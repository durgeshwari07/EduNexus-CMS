const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

// --- 1. FILE UPLOAD CONFIGURATION ---
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) { fs.mkdirSync(uploadDir); }

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });
app.use('/uploads', express.static('uploads'));

// --- 2. DATABASE CONNECTION ---
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '', 
    database: 'college_system',
    waitForConnections: true,
    connectionLimit: 10
});

// --- 3. AUTHENTICATION & OTP ---
let otpCache = {}; 

app.post('/api/auth/request-otp', async (req, res) => {
    // Convert email to lowercase to prevent "Invalid OTP" mismatches
    const { email, password, role } = req.body;
    const lowerEmail = email.toLowerCase(); 

    try {
        let table = role === 'admin' ? 'admins' : 'teachers';
        const [user] = await db.query(`SELECT * FROM ${table} WHERE LOWER(email) = ? AND password = ?`, [lowerEmail, password]);

        if (user.length > 0) {
            // Block teachers if account status is not Active
            if (role === 'teacher' && user[0].status !== 'Active') {
                return res.status(403).json({ success: false, message: "Teacher account pending approval." });
            }
            
            const otp = Math.floor(1000 + Math.random() * 9000).toString();
            // Store session with normalized lowercase email key
            otpCache[lowerEmail] = { otp, userData: user[0], role };
            
            console.log(`🔑 OTP for ${lowerEmail}: ${otp}`); 
            res.json({ success: true, message: "OTP generated" });
        } else {
            res.status(401).json({ success: false, message: "Invalid credentials" });
        }
    } catch (err) { res.status(500).json({ error: "Auth Database Error" }); }
});

app.post('/api/auth/verify-otp', async (req, res) => {
    const { email, otp } = req.body;
    const lowerEmail = email.toLowerCase();
    const session = otpCache[lowerEmail];

    if (session && session.otp === otp) {
        // Return user data and role to trigger frontend redirection
        res.json({ success: true, user: session.userData, role: session.role });
        delete otpCache[lowerEmail]; 
    } else {
        res.status(401).json({ success: false, message: "Invalid OTP" });
    }
});

// --- 4. MASTER DASHBOARD SYNC (Admin View) ---
app.get('/api/dashboard/data', async (req, res) => {
    try {
        const [depts] = await db.query('SELECT * FROM departments');
        const [teachers] = await db.query(`SELECT id, teacherName as name, email, phone, dept_id, qualification, experience FROM teachers WHERE status = "Active"`);
        const [pending] = await db.query('SELECT * FROM teachers WHERE status = "Pending"');
        const [students] = await db.query('SELECT * FROM students');
        const [batches] = await db.query('SELECT * FROM batches');
        const [subjects] = await db.query(`SELECT id, name, code, semester, credits, dept_id as courseId, batchId FROM subjects`);
        const [assignments] = await db.query('SELECT * FROM teacher_assignments');

        res.json({ 
            departments: depts, teachers, pendingTeachers: pending,
            students, batches, subjects, teacherAssignments: assignments 
        });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- 5. FACULTY PORTAL DATA (Teacher View) ---
app.get('/api/faculty/data/:username', async (req, res) => {
    const { username } = req.params;
    try {
        const [teacher] = await db.query('SELECT id FROM teachers WHERE username = ?', [username]);
        if (teacher.length === 0) return res.status(404).json({ message: "Teacher not found" });
        const teacherId = teacher[0].id;

        // Fetch subjects using the teacher_assignments bridge table
        const [assignedSubjects] = await db.query(`
            SELECT s.id, s.name, s.code, s.semester, s.batchId 
            FROM subjects s
            JOIN teacher_assignments ta ON s.id = ta.subjectId
            WHERE ta.teacherId = ?`, [teacherId]);

        const fullData = await Promise.all(assignedSubjects.map(async (sub) => {
            // Find students by Batch and Semester to ensure correct class list
            const [students] = await db.query(
                'SELECT * FROM students WHERE batchId = ? AND semester = ?', 
                [sub.batchId, sub.semester]
            );

            const studentsWithMarks = await Promise.all(students.map(async (st) => {
                const [m] = await db.query(
                    'SELECT * FROM marks WHERE student_id = ? AND subject_id = ?', 
                    [st.id, sub.id]
                );
                const marks = m[0] || {};
                return {
                    ...st,
                    isa: {
                        isa1: [marks.isa1 || 0, 0, 0, 0, 0], 
                        isa2: [marks.isa2 || 0, 0, 0, 0, 0],
                        isa3: [marks.isa3 || 0, 0, 0, 0, 0]
                    },
                    semMarks: [marks.theory || 0, 0, 0, 0],
                    practicalMarks: marks.practical || 0
                };
            }));
            return { ...sub, students: studentsWithMarks };
        }));

        res.json({ subjects: fullData });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- 6. STUDENT PORTAL DATA ---
app.get('/api/students/:id/portal', async (req, res) => {
    const { id } = req.params;
    try {
        const [profile] = await db.query('SELECT * FROM students WHERE id = ?', [id]);
        if (profile.length === 0) return res.status(404).json({ message: "Student Not Found" });

        const [marks] = await db.query(`
            SELECT m.*, s.name as subject_name, s.credits 
            FROM marks m 
            JOIN subjects s ON m.subject_id = s.id 
            WHERE m.student_id = ?`, [id]);

        res.json({ profile: profile[0], marks });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- 7. CORE MANAGEMENT (CRUD ROUTES) ---

// --- DEPARTMENT MANAGEMENT ---
app.post('/api/departments', async (req, res) => {
    const { name, code, hod } = req.body;
    try {
        const [result] = await db.query('INSERT INTO departments (name, code, hod) VALUES (?, ?, ?)', [name, code, hod]);
        res.json({ success: true, id: result.insertId });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/departments/:id', async (req, res) => {
    const { id } = req.params;
    const { name, code, hod } = req.body;
    try {
        await db.query('UPDATE departments SET name=?, code=?, hod=? WHERE id=?', [name, code, hod, id]);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/departments/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM departments WHERE id = ?', [id]);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- BATCH MANAGEMENT ---
app.post('/api/batches', async (req, res) => {
    const { dept, batch, hod, year } = req.body;
    try {
        const [result] = await db.query('INSERT INTO batches (dept, batch, hod, year) VALUES (?, ?, ?, ?)', [dept, batch, hod, year]);
        res.json({ success: true, id: result.insertId });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- STUDENT MANAGEMENT ---
app.post('/api/students', async (req, res) => {
    const d = req.body;
    try {
        const sql = `INSERT INTO students (name, enrollmentNo, email, phone, batchId, semester, division, academicYear, dob, address, guardianName, guardianPhone, username, password, status) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Active')`;
        await db.query(sql, [d.name, d.enrollmentNo, d.email, d.phone, d.batchId, d.semester, d.division, d.academicYear, d.dob, d.address, d.guardianName, d.guardianPhone, d.username, d.password]);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- SUBJECT MANAGEMENT ---
app.post('/api/subjects', async (req, res) => {
    const { name, code, semester, credits, courseId, batchId } = req.body;
    try {
        const [result] = await db.query('INSERT INTO subjects (name, code, semester, credits, dept_id, batchId) VALUES (?, ?, ?, ?, ?, ?)', 
        [name, code, semester, credits, courseId, batchId]);
        res.json({ success: true, id: result.insertId });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/subjects/:id', async (req, res) => {
    const { id } = req.params;
    const { name, code, semester, credits, batchId } = req.body;
    try {
        const sql = `UPDATE subjects SET name=?, code=?, semester=?, credits=?, batchId=? WHERE id=?`;
        await db.query(sql, [name, code, semester, credits, batchId, id]);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/subjects/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // Clear teacher assignments linked to subject first
        await db.query('DELETE FROM teacher_assignments WHERE subjectId = ?', [id]);
        await db.query('DELETE FROM subjects WHERE id = ?', [id]);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- TEACHER ASSIGNMENT MANAGEMENT ---
app.post('/api/assign-teacher', async (req, res) => {
    const { subjectId, teacherId, academicYear } = req.body;
    try {
        const sql = `INSERT INTO teacher_assignments (subjectId, teacherId, academicYearId) VALUES (?, ?, ?)`;
        const [result] = await db.query(sql, [subjectId, teacherId, academicYear || '2024-25']);
        res.json({ success: true, id: result.insertId });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/assign-teacher/:id', async (req, res) => {
    const { id } = req.params;
    const { teacherId, academicYear } = req.body;
    try {
        const sql = `UPDATE teacher_assignments SET teacherId=?, academicYearId=? WHERE id=?`;
        await db.query(sql, [teacherId, academicYear, id]);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/assign-teacher/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM teacher_assignments WHERE id = ?', [id]);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- 8. REGISTRATION & MARKS SAVING ---
app.post('/api/register/admin', async (req, res) => {
    const d = req.body;
    try {
        const sql = `INSERT INTO admins (collegeName, collegeCode, collegeEmail, address, academicYear, board, name, phone, email, username, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const [result] = await db.query(sql, [d.collegeName, d.collegeCode, d.collegeEmail, d.address, d.academicYear, d.board, d.name, d.phone, d.email, d.username, d.password]);
        res.json({ success: true, user: { id: result.insertId, name: d.name, role: 'admin' } });
    } catch (err) { res.status(500).json({ success: false }); }
});

app.post('/api/register/teacher', async (req, res) => {
    const d = req.body;
    try {
        const sql = `INSERT INTO teachers (teacherName, email, phone, dept_id, qualification, experience, username, password, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Pending')`;
        await db.query(sql, [d.teacherName, d.email, d.phone, d.dept_id, d.qualification, d.experience, d.username, d.password]);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/faculty/save-marks', async (req, res) => {
    const { studentId, subjectId, semester, marks } = req.body;
    try {
        // Update marks using 'theory' column and handle duplicates
        const sql = `INSERT INTO marks (student_id, subject_id, semester, isa1, isa2, isa3, theory, practical) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?) 
                     ON DUPLICATE KEY UPDATE isa1=VALUES(isa1), isa2=VALUES(isa2), isa3=VALUES(isa3), theory=VALUES(theory), practical=VALUES(practical)`;
        await db.query(sql, [studentId, subjectId, semester, marks.isa1 || 0, marks.isa2 || 0, marks.isa3 || 0, marks.theory || 0, marks.practical || 0]);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- 9. START SERVER ---
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 SYSTEM OPERATIONAL ON PORT: ${PORT}`);
});