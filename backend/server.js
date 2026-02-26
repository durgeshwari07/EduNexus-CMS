require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

// --- CONFIGURATION ---
const JWT_SECRET = process.env.JWT_SECRET || 'unidesk_secret_key_2026';
const PORT = process.env.PORT || 5000;

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

// --- 3. 🛡️ AUTH MIDDLEWARE ---
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return res.status(401).json({ message: "Access Denied: No Token Provided" });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid or Expired Token" });
        req.user = user;
        next();
    });
};

// --- 4. 🔐 AUTHENTICATION ROUTES ---

app.post("/api/auth/workspace-validate", authenticateToken, async (req, res) => {
    const { username } = req.body;
    if (req.user.role !== 'admin' && req.user.username && req.user.username !== username) {
        return res.status(403).json({ success: false, message: "Unauthorized workspace access" });
    }

    try {
        const sql = `
            SELECT t.id, t.username, CONCAT(t.first_name, ' ', t.last_name) as name, d.name as department
            FROM teachers t
            LEFT JOIN departments d ON t.dept_id = d.id
            WHERE t.username = ? AND t.status = 'Active'
        `;
        const [rows] = await db.query(sql, [username]);
        if (rows.length === 0) return res.status(404).json({ success: false, message: "Faculty profile not found." });
        res.json({ success: true, teacher: rows[0] });
    } catch (err) { res.status(500).json({ success: false, message: "Server error" }); }
});

app.post("/api/auth/request-otp", async (req, res) => {
    const { username, password, role } = req.body;
    const cleanUsername = username ? username.trim() : "";

    try {
        const query = role === "admin" 
            ? `SELECT * FROM admins WHERE username=?` 
            : `SELECT t.*, (SELECT collegeName FROM admins LIMIT 1) as collegeName FROM teachers t WHERE username=?`;

        const [rows] = await db.query(query, [cleanUsername]);
        if (rows.length === 0) return res.status(401).json({ success: false, message: "User not found" });

        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ success: false, message: "Invalid credentials" });
        
        if (role === "teacher" && user.status !== "Active") return res.status(403).json({ success: false, message: "Account pending approval" });

        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        const userEmail = user.email.toLowerCase().trim();
        
        otpCache[userEmail] = { otp, userData: { id: user.id, name: user.name || `${user.first_name} ${user.last_name}`, username: user.username, email: userEmail, collegeName: user.collegeName || "UniDesk" }, role, expiry: Date.now() + 5 * 60 * 1000 };

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: "UniDesk Login Verification",
            html: `<div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 500px; margin: auto;">
                    <h2 style="color: #136dec; text-align: center;">UniDesk Access</h2>
                    <p style="text-align: center; color: #555;">Your verification code is: <strong>${otp}</strong></p>
                   </div>`
        });
        res.json({ success: true, message: "OTP sent", email: userEmail });
    } catch (err) { res.status(500).json({ success: false, message: "Server error" }); }
});

app.post("/api/auth/verify-otp", (req, res) => {
    const { email, otp } = req.body;
    const lowerEmail = email.toLowerCase().trim();
    const session = otpCache[lowerEmail];
    
    if (!session || session.otp !== otp || Date.now() > session.expiry) return res.status(401).json({ success: false, message: "Invalid OTP" });
    
    const token = jwt.sign({ id: session.userData.id, role: session.role, username: session.userData.username }, JWT_SECRET, { expiresIn: '24h' });
    const userData = { ...session.userData, token };
    delete otpCache[lowerEmail]; 
    res.json({ success: true, user: userData, role: session.role });
});

app.post('/api/auth/register-teacher', async (req, res) => {
    const d = req.body;
    try {
        const hash = await bcrypt.hash(d.password, 10);
        const sql = `INSERT INTO teachers (first_name, middle_name, last_name, email, phone, dept_id, qualification, experience, employmentType, username, password, status) VALUES (?,?,?,?,?,?,?,?,?,?,?,'Pending')`;
        await db.query(sql, [d.first_name, d.middle_name || null, d.last_name, d.email.toLowerCase(), d.phone, d.dept_id, d.qualification, d.experience || 0, d.employmentType, d.username, hash]);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});








// 5. Assign a teacher to a subject
app.post('/api/assign-teacher', authenticateToken, async (req, res) => {
    const { teacherId, subjectId, academicYearId } = req.body;
    try {
        const sql = `INSERT INTO teacher_assignments (teacherId, subjectId, academicYearId) VALUES (?, ?, ?)`;
        await db.query(sql, [teacherId, subjectId, academicYearId]);
        res.json({ success: true, message: "Teacher assigned successfully" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});


// 1. ADD NEW SUBJECT
app.post('/api/subjects', authenticateToken, async (req, res) => {
    const { name, code, semester, credits, courseId, type } = req.body;
    try {
        const sql = `INSERT INTO subjects (name, code, semester, credits, dept_id, type) 
                     VALUES (?, ?, ?, ?, ?, ?)`;
        // Note: courseId from frontend is mapped to dept_id in database
        await db.query(sql, [name, code, semester, credits, courseId, type]);
        res.json({ success: true, message: "Subject added successfully" });
    } catch (err) {
        console.error("Error adding subject:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// 2. UPDATE EXISTING SUBJECT
app.put('/api/subjects/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { name, code, semester, credits, courseId, type } = req.body;
    try {
        const sql = `UPDATE subjects SET name=?, code=?, semester=?, credits=?, dept_id=?, type=? WHERE id=?`;
        await db.query(sql, [name, code, semester, credits, courseId, type, id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. DELETE SUBJECT
app.delete('/api/subjects/:id', authenticateToken, async (req, res) => {
    try {
        await db.query('DELETE FROM subjects WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});







// --- 7. 🎓 STUDENT & DEPARTMENT MANAGEMENT (Protected) ---

app.post('/api/departments', authenticateToken, async (req, res) => {
    const { name, code, hod } = req.body;
    try {
        await db.query('INSERT INTO departments (name, code, hod) VALUES (?, ?, ?)', [name, code, hod]);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});


// DELETE DEPARTMENT
app.delete('/api/departments/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
        // 1. Check if students or subjects are linked to this dept first (Optional but safer)
        const [linkedSubjects] = await db.query('SELECT id FROM subjects WHERE dept_id = ?', [id]);
        
        if (linkedSubjects.length > 0) {
            return res.status(400).json({ 
                success: false, 
                message: "Cannot delete department: It has linked subjects. Delete subjects first." 
            });
        }

        // 2. Perform the deletion
        const [result] = await db.query('DELETE FROM departments WHERE id = ?', [id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Department not found" });
        }

        res.json({ success: true, message: "Department deleted successfully" });
    } catch (err) {
        console.error("Delete Dept Error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});


app.post('/api/students', authenticateToken, async (req, res) => {
    const s = req.body;
    try {
        const sql = `INSERT INTO students (name, enrollmentNo, prNo, email, phone, semester, division, academicYear, dob, address, guardianName, guardianPhone, username, password, batchId, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Active')`;
        await db.query(sql, [s.name, s.enrollmentNo, s.prNo, s.email, s.phone, s.semester, s.division, s.academicYear, s.dob, s.address, s.guardianName, s.guardianPhone, s.username, s.password, s.batchId]);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});








// --- 5. DATA MANAGEMENT ROUTES ---

app.get('/api/dashboard/data', authenticateToken, async (req, res) => {
    try {
        const [depts] = await db.query('SELECT * FROM departments');
        const [teachers] = await db.query(`SELECT t.*, CONCAT(t.first_name, ' ', t.last_name) as name, d.name as deptName FROM teachers t LEFT JOIN departments d ON t.dept_id = d.id WHERE t.status = "Active"`);
        const [pending] = await db.query(`SELECT t.*, CONCAT(t.first_name, ' ', t.last_name) as name, d.name as deptName FROM teachers t LEFT JOIN departments d ON t.dept_id = d.id WHERE t.status = "Pending"`);
        const [students] = await db.query('SELECT * FROM students');
        const [batches] = await db.query(`SELECT b.*, d.id as dept_id FROM batches b LEFT JOIN departments d ON b.dept = d.name`);
        // const [subjects] = await db.query(`SELECT id, name, code, semester, credits, dept_id as courseId, type FROM subjects`);
        // Change this line inside app.get('/api/dashboard/data')
const [subjects] = await db.query(`SELECT id, name, code, semester, credits, dept_id as courseId, batchId, type FROM subjects`);
        const [assignments] = await db.query(`SELECT ta.*, s.name as subjectName FROM teacher_assignments ta JOIN subjects s ON ta.subjectId = s.id`);
        res.json({ departments: depts, teachers, pendingTeachers: pending, students, batches, subjects, teacherAssignments: assignments });
    } catch (err) { res.status(500).json({ error: err.message }); }
});



//6 📊 FACULTY GRADEBOOK ROUTES


app.post('/api/faculty/sync-gradebook', async (req, res) => {
    const { teacher_id, subject_id, batch_id, semester, academic_year, gradebook_data } = req.body;
    
    // Unique key check: teacher + subject + batch + semester
    const query = `
        INSERT INTO faculty_gradebooks 
        (teacher_id, subject_id, batch_id, semester, academic_year, gradebook_data)
        VALUES (?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE 
        gradebook_data = VALUES(gradebook_data),
        updated_at = CURRENT_TIMESTAMP
    `;

    try {
        await db.execute(query, [
            teacher_id, 
            subject_id, 
            batch_id, 
            semester, 
            academic_year, 
            JSON.stringify(gradebook_data)
        ]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// FETCH Gradebooks
app.get('/api/faculty/get-gradebooks/:username', authenticateToken, async (req, res) => {
    try {
        const username = req.params.username;
        const sql = "SELECT * FROM faculty_gradebooks WHERE teacher_username = ?";
        const [results] = await db.query(sql, [username]);

        const formattedGradebooks = results.map(row => ({
            id: row.id,
            subjectId: row.subject_id,
            name: row.subject_name,
            batchName: row.batch_name,
            semMax: row.sem_max,
            hasPractical: !!row.has_practical,
            practicalMax: row.practical_max,
            selectedISAs: row.selected_isas ? row.selected_isas.split(',') : [],
            students: typeof row.students_data === 'string' 
                ? JSON.parse(row.students_data) 
                : (row.students_data || [])
        }));

        res.json({ success: true, gradebooks: formattedGradebooks });
    } catch (err) {
        console.error("Fetch Error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});


// BULK SAVE MARKS

app.post('/api/faculty/bulk-save-marks', (req, res) => {
    const { marks } = req.body;

    if (!marks || !Array.isArray(marks)) {
        return res.status(400).json({ success: false, message: "Invalid data format" });
    }

    // UPDATED QUERY: Uses 'total' and 'result' to match your phpMyAdmin structure
    const query = `
        INSERT INTO marks 
        (student_id, subject_id, batchId, isa1, isa2, isa3, theory, practical, total, grade, result)
        VALUES ?
        ON DUPLICATE KEY UPDATE 
        isa1=VALUES(isa1), 
        isa2=VALUES(isa2), 
        isa3=VALUES(isa3), 
        theory=VALUES(theory), 
        practical=VALUES(practical), 
        total=VALUES(total), 
        grade=VALUES(grade), 
        result=VALUES(result)
    `;

    // MAPPING: Ensure the order here matches the (column list) in the query above
    const values = marks.map(m => [
        m.student_id,
        m.subject_id,
        m.batchId || null, // Providing null if batchId is missing in frontend
        m.isa1 || 0,
        m.isa2 || 0,
        m.isa3 || 0,
        m.theory || 0,
        m.practical || 0,
        m.total_marks || 0, // Frontend sends 'total_marks', we map it to 'total' column
        m.grade || 'F',
        m.result_status || 'Fail' // Frontend sends 'result_status', we map it to 'result' column
    ]);

    db.query(query, [values], (err, result) => {
        if (err) {
            console.error("MYSQL ERROR:", err);
            return res.status(500).json({ 
                success: false, 
                error: err.sqlMessage 
            });
        }
        res.json({ success: true, message: "Marks synced to database!" });
    });
});










//  student Profile


app.get('/api/student-profile/:id', async (req, res) => {
    const studentId = req.params.id;
    try {
        // Query 1: Get Profile
        // Note: Check if your table uses 'prNo', 'enrollmentNo', etc.
        const [profileRows] = await db.query(
            `SELECT name as fullName, enrollmentNo as prNumber, email, phone, semester 
             FROM students WHERE id = ?`, [studentId]
        );

        if (profileRows.length === 0) return res.status(404).json({ error: "No student found" });

        // Query 2: Get Marks (Aliasing columns to match your Frontend)
        const [marksRows] = await db.query(
            `SELECT s.code as subjectCode, s.name as subjectName, 
                    m.isa1 as isaScore, m.theory as theoryScore, 
                    m.practical as practScore, m.total, m.result as grade
             FROM marks m 
             JOIN subjects s ON m.subject_id = s.id 
             WHERE m.student_id = ?`, [studentId]
        );

        res.json({
            profile: profileRows[0],
            marks: marksRows,
            documents: [], 
            sgpaHistory: [] 
        });
    } catch (err) {
        console.error("Database Error:", err); // Look at your terminal!
        res.status(500).json({ error: err.message });
    }
});







app.get('/api/student-profile/:id', async (req, res) => {
    const studentId = req.params.id;
    try {
        const [profileRows] = await db.query(
            `SELECT 
                name AS fullName, 
                enrollmentNo AS enrollmentNumber, 
                prNo AS prNumber, 
                email, 
                phone AS phoneNumber, 
                semester, 
                division, 
                academicYear, 
                DATE_FORMAT(dob, '%Y-%m-%d') AS dob,
                status
             FROM students 
             WHERE id = ?`, 
            [studentId]
        );

        if (profileRows.length === 0) return res.status(404).json({ error: "No student found" });

        const [marksRows] = await db.query(
            `SELECT 
                s.code AS subjectCode, 
                s.name AS subjectName, 
                m.isa1 AS isaScore, 
                m.theory AS theoryScore, 
                m.practical AS practScore, 
                m.total, 
                m.grade
             FROM marks m 
             JOIN subjects s ON m.subject_id = s.id 
             WHERE m.student_id = ?`, 
            [studentId]
        );

        res.json({
            profile: profileRows[0],
            marks: marksRows
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// --- 10. BATCH RESULTS LEDGER (Finalized & Debugged) ---
app.get('/api/batch-results/:batchId', async (req, res) => {
    const { batchId } = req.params;

    try {
        // 1. Fetch Batch Info
        const [batchRows] = await db.query(
            `SELECT b.*, d.name as courseName 
             FROM batches b 
             LEFT JOIN departments d ON b.dept = d.name 
             WHERE b.id = ?`, [batchId]
        );

        if (batchRows.length === 0) return res.status(404).json({ error: "Batch not found" });

        const batchInfo = {
            id: batchRows[0].id,
            name: batchRows[0].batch,
            course: batchRows[0].courseName,
            year: batchRows[0].year
        };

        // 2. Fetch all students in this batch 
        // FIX: Removed 'rollNo' which was causing the error, aliased enrollmentNo as rollNo for frontend compatibility
        const [students] = await db.query(
            `SELECT id, name, enrollmentNo, prNo 
             FROM students WHERE batchId = ?`, [batchId]
        );

        // 3. Fetch all marks for this batch's students with subject details
        const [allMarks] = await db.query(
            `SELECT m.*, s.name as subjectName, s.code as subjectCode, s.credits, s.type 
             FROM marks m
             JOIN subjects s ON m.subject_id = s.id
             WHERE m.student_id IN (SELECT id FROM students WHERE batchId = ?)`, [batchId]
        );

        // 4. Structure the data for the Frontend Master Ledger
        const structuredStudents = students.map(student => {
            const studentMarks = allMarks.filter(m => m.student_id === student.id);
            
            // Group marks by semester
            const semMap = {};
            studentMarks.forEach(m => {
                if (!semMap[m.semester]) {
                    semMap[m.semester] = { 
                        sem: m.semester, 
                        major: [], 
                        minor: { isa: '-', esa: '-', tot: '-', grd: '-' }, 
                        sgpa: 0 
                    };
                }
                
                // Calculate Grade locally if not stored
                const grade = m.total >= 40 ? 'P' : 'F';
                const markEntry = { 
                    subject: m.subjectName,
                    isa: m.isa1 || 0, 
                    esa: m.theory || 0, 
                    tot: m.total || 0, 
                    grd: grade 
                };

                if (m.type === 'MINOR') {
                    semMap[m.semester].minor = markEntry;
                } else {
                    semMap[m.semester].major.push(markEntry);
                }
            });

            // Ensure Major array always has at least 2 entries for table consistency
            // (Adjust this number based on your specific curriculum requirements)
            Object.keys(semMap).forEach(sem => {
                while(semMap[sem].major.length < 2) {
                    semMap[sem].major.push({ isa: '-', esa: '-', tot: '-', grd: '-' });
                }
            });

            const semesters = Object.values(semMap).sort((a, b) => a.sem - b.sem);
            const backlogs = studentMarks.filter(m => m.total < 40).length;
            
            // Basic SGPA calculation (Total Marks / Subject Count) if SGPA table is empty
            const avgCgpa = semesters.length > 0 
                ? (semesters.reduce((acc, s) => acc + (parseFloat(s.sgpa) || 0), 0) / semesters.length).toFixed(2) 
                : "0.00";

            return {
                ...student,
                enrollmentNo: student.enrollmentNo, // Ensure this key matches your frontend state
                semesters,
                summary: {
                    backlogs,
                    cgpa: avgCgpa,
                    status: backlogs === 0 ? 'PASS' : 'ATKT',
                    lastSGPA: semesters.length > 0 ? semesters[semesters.length - 1].sgpa : 0
                }
            };
        });

        // 5. Calculate Batch Stats for the Header Stat-Boxes
        const stats = {
            totalStudents: students.length,
            avgCgpa: structuredStudents.length > 0 
                ? (structuredStudents.reduce((acc, s) => acc + parseFloat(s.summary.cgpa), 0) / students.length).toFixed(2) 
                : 0,
            passPercentage: students.length > 0 
                ? ((structuredStudents.filter(s => s.summary.status === 'PASS').length / students.length) * 100).toFixed(1) 
                : 0
        };

        res.json({ batchInfo, students: structuredStudents, stats });

    } catch (err) {
        console.error("Ledger Compilation Error:", err);
        res.status(500).json({ error: "Failed to compile ledger", details: err.message });
    }
});











// --- 8. 🚪 SERVER START ---
app.listen(PORT, () => {
    console.log(`🚀 SERVER RUNNING ON: http://localhost:${PORT}`);
});

