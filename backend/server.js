



require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const nodemailer = require("nodemailer");

const app = express();
app.use(cors());
app.use(express.json());

// --- 1. DATABASE CONNECTION ---
const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '', 
    database: process.env.DB_NAME || 'college_system', 
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// --- 2. EMAIL CONFIGURATION ---
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

let otpCache = {};

// --- 3. AUTHENTICATION & OTP SYSTEM ---
app.post("/api/auth/request-otp", async (req, res) => {
    const { email, password, role } = req.body;
    const lowerEmail = email.toLowerCase().trim();

    try {
        const query = role === "admin" 
            ? `SELECT * FROM admins WHERE LOWER(email)=?` 
            : `SELECT t.*, (SELECT collegeName FROM admins LIMIT 1) as collegeName 
               FROM teachers t WHERE LOWER(email)=?`;

        const [rows] = await db.query(query, [lowerEmail]);
        
        if (rows.length === 0) return res.status(401).json({ success: false, message: "User not found" });

        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ success: false, message: "Invalid credentials" });
        
        if (role === "teacher" && user.status !== "Active") {
            return res.status(403).json({ success: false, message: "Account pending approval" });
        }

        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        
        otpCache[lowerEmail] = { 
            otp, 
            userData: { 
                id: user.id, 
                name: user.name || `${user.first_name} ${user.last_name}`, 
                email: lowerEmail,
                collegeName: user.collegeName || "UniDesk Institution" 
            }, 
            role, 
            expiry: Date.now() + 5 * 60 * 1000 
        };

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: lowerEmail,
            subject: "UniDesk Login Verification",
            html: `<div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 500px; margin: auto;">
                    <h2 style="color: #136dec; text-align: center;">UniDesk Access</h2>
                    <p style="text-align: center; color: #555;">Your verification code is:</p>
                    <h1 style="letter-spacing: 10px; color: #333; text-align: center; background: #f4f4f4; padding: 15px; border-radius: 8px;">${otp}</h1>
                    <p style="font-size: 12px; color: #888; text-align: center;">This code expires in 5 minutes.</p>
                   </div>`
        });

        res.json({ success: true, message: "OTP sent" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error" });
    }
});

app.post("/api/auth/verify-otp", (req, res) => {
    const { email, otp } = req.body;
    const lowerEmail = email.toLowerCase().trim();
    const session = otpCache[lowerEmail];
    if (!session || session.otp !== otp || Date.now() > session.expiry) {
        return res.status(401).json({ success: false, message: "Invalid or expired OTP" });
    }
    const { userData, role } = session;
    delete otpCache[lowerEmail]; 
    res.json({ success: true, user: userData, role });
});

// --- 4. DEPARTMENT MANAGEMENT ---
app.post('/api/departments', async (req, res) => {
    const { name, code, hod } = req.body;
    try {
        await db.query('INSERT INTO departments (name, code, hod) VALUES (?, ?, ?)', [name, code, hod]);
        res.json({ success: true, message: "Department created" });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

app.put('/api/departments/:id', async (req, res) => {
    const { name, code, hod } = req.body;
    try {
        await db.query('UPDATE departments SET name=?, code=?, hod=? WHERE id=?', [name, code, hod, req.params.id]);
        res.json({ success: true, message: "Department updated" });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

app.delete('/api/departments/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM departments WHERE id = ?', [req.params.id]);
        res.json({ success: true, message: "Department deleted" });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

// --- 5. MASTER LEDGER & DASHBOARD DATA ---
app.get('/api/ledger/:batchId', async (req, res) => {
    try {
        const { batchId } = req.params;
        const [rows] = await db.query(
            `SELECT * FROM master_result_ledger WHERE batch_id = ? OR batch_name = ?`, 
            [batchId, batchId]
        );

        if (rows.length === 0) return res.json({ students: [], stats: { totalStudents: 0, avgCgpa: 0, passPercentage: '0%' } });

        const studentsMap = {};
        let passCount = 0;

        rows.forEach(row => {
            if (!studentsMap[row.prNo]) {
                studentsMap[row.prNo] = {
                    prNo: row.prNo || 'N/A',
                    rollNo: row.enrollmentNo || 'N/A',
                    name: row.student_name,
                    semesters: [],
                    summary: { backlogs: 0, cgpa: 0, status: 'PASS' }
                };
            }
            const student = studentsMap[row.prNo];
            if (row.subject_name && row.semester) {
                let sem = student.semesters.find(s => s.sem === row.semester);
                if (!sem) {
                    sem = { sem: row.semester, major: [], minor: null };
                    student.semesters.push(sem);
                }
                const markData = { sub: row.subject_name, code: row.subject_code, tot: row.total_marks, grd: row.grade || (row.total_marks >= 40 ? 'P' : 'F') };
                row.subject_type === 'MAJOR' ? sem.major.push(markData) : sem.minor = markData;
                if (markData.grd === 'F') { student.summary.backlogs += 1; student.summary.status = 'FAIL'; }
            }
        });

        const studentList = Object.values(studentsMap);
        studentList.forEach(s => { if (s.summary.status === 'PASS') passCount++; });

        res.json({
            batch: rows[0].batch_name || "Unknown",
            stats: { totalStudents: studentList.length, passPercentage: `${Math.round((passCount / studentList.length) * 100)}%` },
            students: studentList
        });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/dashboard/data', async (req, res) => {
    try {
        const [depts] = await db.query('SELECT * FROM departments');
        const teacherQuery = (status) => `SELECT t.*, CONCAT(t.first_name, ' ', t.last_name) as name, d.name as deptName FROM teachers t LEFT JOIN departments d ON t.dept_id = d.id WHERE t.status = "${status}"`;
        const [teachers] = await db.query(teacherQuery('Active'));
        const [pending] = await db.query(teacherQuery('Pending'));
        const [students] = await db.query('SELECT * FROM students');
        const [batches] = await db.query(`SELECT b.*, d.id as dept_id FROM batches b LEFT JOIN departments d ON b.dept = d.name`);
        const [subjects] = await db.query(`SELECT id, name, code, semester, credits, dept_id as courseId, type FROM subjects`);
        const [assignments] = await db.query('SELECT * FROM teacher_assignments');
        res.json({ departments: depts, teachers, pendingTeachers: pending, students, batches, subjects, teacherAssignments: assignments });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- 6. SUBJECT & FACULTY ASSIGNMENT ---
// app.post('/api/subjects', async (req, res) => {
//     const { name, code, semester, credits, courseId, type } = req.body;
//     try {
//         await db.query('INSERT INTO subjects (name, code, semester, credits, dept_id, type) VALUES (?, ?, ?, ?, ?, ?)', [name, code, semester, credits, courseId, type || 'MAJOR']);
//         res.json({ success: true });
//     } catch (err) { res.status(500).json({ error: err.message }); }
// });


// 1. ADD NEW SUBJECT
app.post('/api/subjects', async (req, res) => {
    const { name, code, semester, credits, courseId, type } = req.body;
    try {
        // Ensure the column name matches your DB (deptId)
        const sql = 'INSERT INTO subjects (name, code, semester, credits, deptId, type) VALUES (?, ?, ?, ?, ?, ?)';
        await db.query(sql, [name, code, semester, credits, courseId, type || 'MAJOR']);
        res.json({ success: true });
    } catch (err) { 
        console.error("ADD SUBJECT ERROR:", err.message);
        res.status(500).json({ error: err.message }); 
    }
});

// 2. UPDATE SUBJECT (Fixes the 500 error on Edit)
app.put('/api/subjects/:id', async (req, res) => {
    const { id } = req.params;
    const { name, code, semester, credits, type, courseId } = req.body;
    
    try {
        // IMPORTANT: Verify if your DB uses deptId or dept_id
        const sql = `
            UPDATE subjects 
            SET name = ?, code = ?, semester = ?, credits = ?, type = ?, deptId = ? 
            WHERE id = ?`;
        
        const [result] = await db.query(sql, [name, code, semester, credits, type, courseId, id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Subject not found" });
        }
        
        res.json({ success: true, message: "Subject updated successfully" });
    } catch (err) {
        console.error("UPDATE SUBJECT ERROR:", err.message);
        res.status(500).json({ success: false, error: err.message });
    }
});

// 3. DELETE SUBJECT
app.delete('/api/subjects/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM subjects WHERE id = ?', [req.params.id]);
        res.json({ success: true, message: "Subject deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



app.post('/api/assign-teacher', async (req, res) => {
    const { subjectId, teacherId, academicYearId } = req.body;
    try {
        await db.query('INSERT INTO teacher_assignments (subjectId, teacherId, academicYearId) VALUES (?, ?, ?)', [subjectId, teacherId, academicYearId]);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- 7. REGISTRATION (TEACHER / STUDENT / BATCH) ---
app.post('/api/register-teacher', async (req, res) => {
    const d = req.body;
    try {
        const hash = await bcrypt.hash(d.password, 10);
        const sql = `INSERT INTO teachers (first_name, middle_name, last_name, email, phone, dept_id, qualification, experience, employmentType, username, password, status) VALUES (?,?,?,?,?,?,?,?,?,?,?,'Pending')`;
        await db.query(sql, [d.first_name, d.middle_name || null, d.last_name, d.email.toLowerCase(), d.phone, d.dept_id, d.qualification, d.experience || 0, d.employmentType, d.username, hash]);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

// FIXED BATCH ROUTE
app.post('/api/batches', async (req, res) => {
    const { dept, batch, hod, year, semester, status } = req.body;
    try {
        // Log to terminal for debugging
        console.log("Creating batch:", req.body);
        
        // Added 'status' and 'year' to query to match what frontend sends
        const sql = 'INSERT INTO batches (dept, batch, hod, year, semester, status) VALUES (?, ?, ?, ?, ?, ?)';
        const [result] = await db.query(sql, [dept, batch, hod, year || 'Year 1', semester || 1, status || 'Active']);
        
        res.json({ success: true, id: result.insertId, ...req.body });
    } catch (err) { 
        console.error("BATCH ERROR:", err.message);
        res.status(500).json({ success: false, error: err.message }); 
    }
});

// app.post('/api/students', async (req, res) => {
//     const s = req.body;
//     try {
//         const sql = `INSERT INTO students (name, enrollmentNo, prNo, email, phone, batchId, semester, division, academicYear, status) VALUES (?,?,?,?,?,?,?,?,?,'Active')`;
//         await db.query(sql, [s.name, s.enrollmentNo, s.prNo, s.email, s.phone, s.batchId, s.semester, s.division, s.academicYear]);
//         res.json({ success: true });
//     } catch (err) { res.status(500).json({ success: false, error: err.message }); }
// });

app.post('/api/students', async (req, res) => {
    const s = req.body;
    try {
        const sql = `INSERT INTO students 
            (name, enrollmentNo, prNo, email, phone, semester, division, academicYear, 
             dob, address, guardianName, guardianPhone, passCount, failCount, 
             username, password, batchId, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Active')`;
        
        const values = [
            s.name, 
            s.enrollmentNo, 
            s.prNo || null, 
            s.email, 
            s.phone, 
            s.semester || 1, 
            s.division || 'A', 
            s.academicYear,
            s.dob || '2000-01-01', 
            s.address || 'N/A', 
            s.guardianName || 'N/A', 
            s.guardianPhone || '',
            s.passCount || 0,
            s.failCount || 0,
            s.username || s.enrollmentNo, 
            s.password || 'student123', // You should hash this in production
            s.batchId || 1
        ];

        const [result] = await db.query(sql, values);
        res.json({ success: true, id: result.insertId });
    } catch (err) {
        console.error("IMPORT ERROR:", err.message);
        res.status(500).json({ success: false, error: err.message });
    }
});



// --- 8. MARKS ENTRY ---
app.post('/api/faculty/save-marks', async (req, res) => {
    const { studentId, subjectId, isa1, isa2, isa3, theory, practical, semester } = req.body;
    try {
        const sql = `INSERT INTO marks (student_id, subject_id, semester, isa1, isa2, isa3, theory, practical) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?) 
                     ON DUPLICATE KEY UPDATE isa1=?, isa2=?, isa3=?, theory=?, practical=?`;
        await db.query(sql, [studentId, subjectId, semester, isa1, isa2, isa3, theory, practical, isa1, isa2, isa3, theory, practical]);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

// --- 9. SERVER START ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`\n--------------------------------------`);
    console.log(`🚀 UNIDESK SERVER: http://localhost:${PORT}`);
    console.log(`📡 STATUS: OPERATIONAL`);
    console.log(`--------------------------------------\n`);
});