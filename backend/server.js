// require('dotenv').config();
// const express = require('express');
// const mysql = require('mysql2/promise');
// const cors = require('cors');
// const bcrypt = require('bcryptjs');
// const nodemailer = require("nodemailer");

// const app = express();
// app.use(cors());
// app.use(express.json());

// const db = mysql.createPool({
//     host: 'localhost', user: 'root', password: '', database: 'college_system', 
//     waitForConnections: true, connectionLimit: 10
// });

// const transporter = nodemailer.createTransport({
//     service: "gmail", auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
// });

// let otpCache = {};

// // --- AUTH & OTP ---
// app.post("/api/auth/request-otp", async (req, res) => {
//     const { email, password, role } = req.body;
//     const lowerEmail = email.toLowerCase().trim();
//     const table = role === "admin" ? "admins" : "teachers";
//     try {
//         const [rows] = await db.query(`SELECT * FROM ${table} WHERE LOWER(email)=?`, [lowerEmail]);
//         if (rows.length === 0) return res.status(401).json({ success: false, message: "User not found" });
//         const isMatch = await bcrypt.compare(password, rows[0].password);
//         if (!isMatch) return res.status(401).json({ success: false, message: "Invalid credentials" });
//         const otp = Math.floor(1000 + Math.random() * 9000).toString();
//         otpCache[lowerEmail] = { otp, userData: { id: rows[0].id, name: rows[0].name || `${rows[0].first_name} ${rows[0].last_name}`, email: lowerEmail }, role, expiry: Date.now() + 5 * 60 * 1000 };
//         await transporter.sendMail({ from: process.env.EMAIL_USER, to: lowerEmail, subject: "Login OTP", html: `<h1>${otp}</h1>` });
//         res.json({ success: true });
//     } catch (err) { res.status(500).json({ error: "Server Error" }); }
// });

// app.post("/api/auth/verify-otp", (req, res) => {
//     const { email, otp } = req.body;
//     const session = otpCache[email.toLowerCase().trim()];
//     if (!session || session.otp !== otp || Date.now() > session.expiry) return res.status(401).json({ success: false });
//     res.json({ success: true, user: session.userData, role: session.role });
// });


// // --- TEACHER SELF-REGISTRATION (With Approval Logic) ---
// app.post('/api/register-teacher', async (req, res) => {
//     const { 
//         first_name, middle_name, last_name, email, phone, 
//         dept_id, qualification, experience, employmentType, 
//         username, password 
//     } = req.body;

//     try {
//         // Hash the password for security
//         const hashedPassword = await bcrypt.hash(password, 10);

//         const sql = `INSERT INTO teachers (
//             first_name, middle_name, last_name, email, phone, 
//             dept_id, qualification, experience, employmentType, 
//             username, password, status
//         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending')`;

//         await db.query(sql, [
//             first_name, middle_name || null, last_name, email.toLowerCase(), phone, 
//             dept_id, qualification, experience || 0, employmentType, 
//             username, hashedPassword
//         ]);

//         console.log(`📩 New Faculty Application: ${first_name} ${last_name} (${username})`);
//         res.json({ success: true, message: "Application submitted for approval." });

//     } catch (err) {
//         console.error("❌ Registration Error:", err.message);
//         res.status(500).json({ 
//             success: false, 
//             message: "Registration failed. Username or Email already exists." 
//         });
//     }
// });

// // --- ADMIN REGISTRATION (Immediate Activation) ---
// app.post('/api/register/admin', async (req, res) => {
//     const { 
//         collegeName, collegeCode, collegeEmail, address, 
//         academicYear, board, name, phone, email, 
//         username, password 
//     } = req.body;

//     try {
//         const hashedPassword = await bcrypt.hash(password, 10);

//         const sql = `INSERT INTO admins (
//             collegeName, collegeCode, collegeEmail, address, 
//             academicYear, board, name, phone, email, 
//             username, password
//         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

//         const [result] = await db.query(sql, [
//             collegeName, collegeCode, collegeEmail.toLowerCase(), address, 
//             academicYear || '2024-25', board, name, phone, email.toLowerCase(), 
//             username, hashedPassword
//         ]);

//         res.json({ 
//             success: true, 
//             user: { id: result.insertId, name, username, email: email.toLowerCase() } 
//         });

//     } catch (err) {
//         console.error("❌ Admin Registration Error:", err.message);
//         res.status(500).json({ 
//             success: false, 
//             message: "Registration failed. Username or Official Email already taken." 
//         });
//     }
// });


// // --- MASTER SYNC ---
// app.get('/api/dashboard/data', async (req, res) => {
//     try {
//         const [depts] = await db.query('SELECT * FROM departments');
//         const [teachers] = await db.query(`SELECT *, CONCAT(first_name, ' ', last_name) as name FROM teachers WHERE status = "Active"`);
//         const [pending] = await db.query(`SELECT *, CONCAT(first_name, ' ', last_name) as name FROM teachers WHERE status = "Pending"`);
//         const [students] = await db.query('SELECT * FROM students');
//         const [batches] = await db.query('SELECT * FROM batches');
//         const [subjects] = await db.query(`SELECT id, name, code, semester, credits, dept_id as courseId FROM subjects`);
//         const [assignments] = await db.query('SELECT * FROM teacher_assignments');
//         res.json({ departments: depts, teachers, pendingTeachers: pending, students, batches, subjects, teacherAssignments: assignments });
//     } catch (err) { res.status(500).json({ error: err.message }); }
// });

// // --- CRUD: DEPARTMENTS ---
// app.post('/api/departments', async (req, res) => {
//     await db.query('INSERT INTO departments (name, code, hod) VALUES (?, ?, ?)', [req.body.name, req.body.code, req.body.hod]);
//     res.json({ success: true });
// });
// app.delete('/api/departments/:id', async (req, res) => {
//     await db.query('DELETE FROM departments WHERE id = ?', [req.params.id]);
//     res.json({ success: true });
// });

// // --- CRUD: SUBJECTS & ASSIGNMENTS ---
// app.post('/api/subjects', async (req, res) => {
//     const { name, code, semester, credits, courseId } = req.body;
//     await db.query(`INSERT INTO subjects (name, code, semester, credits, dept_id) VALUES (?, ?, ?, ?, ?)`, [name, code, semester, credits, courseId]);
//     res.json({ success: true });
// });
// app.delete('/api/subjects/:id', async (req, res) => {
//     await db.query('DELETE FROM teacher_assignments WHERE subjectId = ?', [req.params.id]);
//     await db.query('DELETE FROM subjects WHERE id = ?', [req.params.id]);
//     res.json({ success: true });
// });
// app.post('/api/assign-teacher', async (req, res) => {
//     await db.query(`INSERT INTO teacher_assignments (subjectId, teacherId, academicYearId) VALUES (?, ?, ?)`, [req.body.subjectId, req.body.teacherId, req.body.academicYearId]);
//     res.json({ success: true });
// });

// // --- CRUD: STUDENTS & BATCHES ---
// app.post('/api/batches', async (req, res) => {
//     const { dept, batch, hod, year } = req.body;
//     await db.query('INSERT INTO batches (dept, batch, hod, year) VALUES (?, ?, ?, ?)', [dept, batch, hod, year]);
//     res.json({ success: true });
// });
// app.post('/api/students', async (req, res) => {
//     const s = req.body;
//     await db.query(`INSERT INTO students (name, enrollmentNo, email, phone, batchId, semester, academicYear, status) VALUES (?, ?, ?, ?, ?, ?, ?, 'Active')`, [s.name, s.enrollmentNo, s.email, s.phone, s.batchId, s.semester, s.academicYear]);
//     res.json({ success: true });
// });
// app.delete('/api/students/:id', async (req, res) => {
//     await db.query('DELETE FROM students WHERE id = ?', [req.params.id]);
//     res.json({ success: true });
// });

// // --- TEACHER APPROVAL ---
// app.post('/api/approve-teacher/:id', async (req, res) => {
//     await db.query('UPDATE teachers SET status = "Active" WHERE id = ?', [req.params.id]);
//     res.json({ success: true });
// });

// app.listen(5000, () => console.log(`🚀 UNIDESK SERVER LIVE ON PORT 5000`));



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
    host: 'localhost',
    user: 'root',
    password: '', 
    database: 'college_system', 
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
    const table = role === "admin" ? "admins" : "teachers";

    try {
        const [rows] = await db.query(`SELECT * FROM ${table} WHERE LOWER(email)=?`, [lowerEmail]);
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
            userData: { id: user.id, name: user.name || `${user.first_name} ${user.last_name}`, email: lowerEmail }, 
            role, 
            expiry: Date.now() + 5 * 60 * 1000 
        };

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: lowerEmail,
            subject: "UniDesk Login Verification",
            html: `<h1>Your OTP is: ${otp}</h1><p>Valid for 5 minutes.</p>`
        });

        res.json({ success: true, message: "OTP sent to email" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server Error" });
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

// --- 4. MASTER DATA SYNC (Unified Dashboard State) ---
app.get('/api/dashboard/data', async (req, res) => {
    try {
        const [depts] = await db.query('SELECT * FROM departments');
        
        // Joins department names for Active and Pending teachers so UI shows labels instead of IDs
        const [teachers] = await db.query(`
            SELECT t.*, CONCAT(t.first_name, ' ', t.last_name) as name, d.name as deptName 
            FROM teachers t 
            LEFT JOIN departments d ON t.dept_id = d.id 
            WHERE t.status = "Active"`);

        const [pending] = await db.query(`
            SELECT t.*, CONCAT(t.first_name, ' ', t.last_name) as name, d.name as deptName 
            FROM teachers t 
            LEFT JOIN departments d ON t.dept_id = d.id 
            WHERE t.status = "Pending"`);

        const [students] = await db.query('SELECT * FROM students');
        const [batches] = await db.query('SELECT * FROM batches');
        const [subjects] = await db.query(`SELECT id, name, code, semester, credits, dept_id as courseId FROM subjects`);
        const [assignments] = await db.query('SELECT * FROM teacher_assignments');

        res.json({ 
            departments: depts, teachers, pendingTeachers: pending, 
            students, batches, subjects, teacherAssignments: assignments 
        });
    } catch (err) { 
        res.status(500).json({ error: err.message }); 
    }
});

// --- 5. REGISTRATION (Admin & Teacher) ---
app.post('/api/register/admin', async (req, res) => {
    const d = req.body;
    try {
        const hashedPassword = await bcrypt.hash(d.password, 10);
        const [result] = await db.query(
            `INSERT INTO admins (collegeName, collegeCode, collegeEmail, address, academicYear, board, name, phone, email, username, password) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
            [d.collegeName, d.collegeCode, d.collegeEmail, d.address, d.academicYear, d.board, d.name, d.phone, d.email, d.username, hashedPassword]
        );
        res.json({ success: true, user: { id: result.insertId, name: d.name, username: d.username, role: 'admin' } });
    } catch (err) { res.status(500).json({ success: false, message: "Registration failed" }); }
});

app.post('/api/register-teacher', async (req, res) => {
    const d = req.body;
    try {
        const hash = await bcrypt.hash(d.password, 10);
        const sql = `INSERT INTO teachers (first_name, middle_name, last_name, email, phone, dept_id, qualification, experience, employmentType, username, password, status) 
                     VALUES (?,?,?,?,?,?,?,?,?,?,?,'Pending')`;
        await db.query(sql, [d.first_name, d.middle_name || null, d.last_name, d.email, d.phone, d.dept_id, d.qualification, d.experience || 0, d.employmentType, d.username, hash]);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ success: false, message: "Username or Email already exists" }); }
});

// --- 6. CORE MANAGEMENT (Departments, Subjects, Batches, Students) ---
app.post('/api/departments', async (req, res) => {
    await db.query('INSERT INTO departments (name, code, hod) VALUES (?, ?, ?)', [req.body.name, req.body.code, req.body.hod]);
    res.json({ success: true });
});

app.post('/api/subjects', async (req, res) => {
    const { name, code, semester, credits, courseId } = req.body;
    await db.query(`INSERT INTO subjects (name, code, semester, credits, dept_id) VALUES (?, ?, ?, ?, ?)`, [name, code, semester, credits, courseId]);
    res.json({ success: true });
});

app.post('/api/batches', async (req, res) => {
    const { dept, batch, hod, year } = req.body;
    await db.query('INSERT INTO batches (dept, batch, hod, year) VALUES (?, ?, ?, ?)', [dept, batch, hod, year]);
    res.json({ success: true });
});

app.post('/api/students', async (req, res) => {
    const s = req.body;
    const sql = `INSERT INTO students (name, enrollmentNo, email, phone, batchId, semester, academicYear, status) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, 'Active')`;
    await db.query(sql, [s.name, s.enrollmentNo, s.email, s.phone, s.batchId, s.semester, s.academicYear]);
    res.json({ success: true });
});

// --- 7. DELETIONS & APPROVALS ---
app.delete('/api/students/:id', async (req, res) => {
    await db.query('DELETE FROM students WHERE id = ?', [req.params.id]);
    res.json({ success: true });
});

app.delete('/api/subjects/:id', async (req, res) => {
    await db.query('DELETE FROM teacher_assignments WHERE subjectId = ?', [req.params.id]);
    await db.query('DELETE FROM subjects WHERE id = ?', [req.params.id]);
    res.json({ success: true });
});

app.post('/api/approve-teacher/:id', async (req, res) => {
    await db.query('UPDATE teachers SET status = "Active" WHERE id = ?', [req.params.id]);
    res.json({ success: true });
});

app.post('/api/assign-teacher', async (req, res) => {
    await db.query(`INSERT INTO teacher_assignments (subjectId, teacherId, academicYearId) VALUES (?, ?, ?)`, [req.body.subjectId, req.body.teacherId, req.body.academicYearId || '2025-26']);
    res.json({ success: true });
});

// --- 8. SERVER START ---
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 UNIDESK SERVER OPERATIONAL ON PORT: ${PORT}`);
});