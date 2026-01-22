// const express = require('express');
// const mysql = require('mysql2/promise');
// const cors = require('cors');
// const bcrypt = require('bcryptjs');

// const app = express();
// app.use(cors());
// app.use(express.json());

// // MySQL Connection Pool
// const db = mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     password: '', 
//     database: 'college_system'
// });

// // --- AUTHENTICATION & REGISTRATION ---

// // Admin Registration
// app.post('/api/register/admin', async (req, res) => {
//     try {
//         const { password, ...data } = req.body;
//         const hashedPassword = await bcrypt.hash(password, 10);
//         const sql = `INSERT INTO admins (collegeName, collegeEmail, collegeCode, address, academicYear, board, adminName, adminPhone, adminEmail, password) VALUES (?,?,?,?,?,?,?,?,?,?)`;
//         await db.query(sql, [...Object.values(data).slice(0, 9), hashedPassword]);
//         res.json({ success: true, message: "Admin Registered" });
//     } catch (err) { res.status(500).json({ success: false, error: err.message }); }
// });

// // Teacher Registration (Pending)
// app.post('/api/register/teacher', async (req, res) => {
//     try {
//         const { password, ...data } = req.body;
//         const hashedPassword = await bcrypt.hash(password, 10);
//         const sql = `INSERT INTO teachers (teacherName, email, phone, dept, designation, employeeId, classes, subjects, username, password) VALUES (?,?,?,?,?,?,?,?,?,?)`;
//         await db.query(sql, [data.teacherName, data.email, data.phone, data.dept, data.designation, data.employeeId, data.classes, data.subjects, data.username, hashedPassword]);
//         res.json({ success: true, message: "Request Submitted" });
//     } catch (err) { res.status(500).json({ success: false, error: err.message }); }
// });

// // --- DEPARTMENT & SUBJECT MANAGEMENT ---

// // Get Everything for Dashboard
// app.get('/api/dashboard/data', async (req, res) => {
//     try {
//         const [depts] = await db.query('SELECT * FROM departments');
//         const [subs] = await db.query('SELECT * FROM subjects');
//         const [teachers] = await db.query('SELECT * FROM teachers WHERE status = "Active"');
//         const [assigns] = await db.query('SELECT * FROM teacher_assignments');
//         res.json({ departments: depts, subjects: subs, teachers, assignments: assigns });
//     } catch (err) { res.status(500).json({ error: err.message }); }
// });

// // Add Subject
// app.post('/api/subjects', async (req, res) => {
//     const { name, code, semester, credits, dept_id } = req.body;
//     try {
//         await db.query('INSERT INTO subjects (name, code, semester, credits, dept_id) VALUES (?,?,?,?,?)', [name, code, semester, credits, dept_id]);
//         res.json({ success: true });
//     } catch (err) { res.status(500).json({ error: err.message }); }
// });

// // Assign Teacher (With Duplicate Check)
// app.post('/api/assign', async (req, res) => {
//     const { subject_id, teacher_id, academic_year } = req.body;
//     try {
//         await db.query('INSERT INTO teacher_assignments (subject_id, teacher_id, academic_year) VALUES (?,?,?)', [subject_id, teacher_id, academic_year]);
//         res.json({ success: true });
//     } catch (err) { 
//         if(err.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: "Teacher already assigned!" });
//         res.status(500).json({ error: err.message }); 
//     }
// });

// app.listen(5000, () => console.log('🚀 Unified Backend running on Port 5000'));



const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const app = express();

// 1. SECURITY & PARSING (Fixes the raw-body terminal error)
app.use(cors());
app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 2. DATABASE CONNECTION
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '', 
    database: 'college_system',
    waitForConnections: true,
    connectionLimit: 10
});

// --- FETCH ALL DASHBOARD DATA ---
app.get('/api/dashboard/data', async (req, res) => {
    try {
        const [depts] = await db.query('SELECT id, name, code, hod FROM departments');
        const [teachers] = await db.query('SELECT id, teacherName AS name, email, designation FROM teachers WHERE status = "Active"');
        const [pending] = await db.query('SELECT id, teacherName AS name, email, designation, created_at AS dateApplied FROM teachers WHERE status = "Pending"');

        res.json({ 
            departments: depts, 
            teachers: teachers, 
            pendingTeachers: pending 
        });
    } catch (err) {
        console.error("Fetch Error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// --- ADD DEPARTMENT ---
app.post('/api/departments', async (req, res) => {
    try {
        const { name, code, hod } = req.body;
        const [result] = await db.query(
            'INSERT INTO departments (name, code, hod) VALUES (?, ?, ?)', 
            [name, code, hod]
        );
        res.json({ success: true, id: result.insertId });
    } catch (err) {
        console.error("Post Error:", err.message);
        res.status(500).json({ success: false, error: err.message });
    }
});

// --- APPROVE TEACHER ---
app.post('/api/teachers/approve/:id', async (req, res) => {
    try {
        await db.query('UPDATE teachers SET status = "Active" WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false });
    }
});

// --- LOGIN LOGIC ---
app.post('/api/login/verify-credentials', async (req, res) => {
    const { email, password } = req.body;
    try {
        const [admins] = await db.query('SELECT * FROM admins WHERE adminEmail = ?', [email]);
        if (admins.length > 0 && await bcrypt.compare(password, admins[0].password)) {
            return res.json({ success: true, requiresOtp: true, tempUser: { name: admins[0].adminName, email: admins[0].adminEmail, role: 'admin' } });
        }
        const [teachers] = await db.query('SELECT * FROM teachers WHERE email = ? AND status = "Active"', [email]);
        if (teachers.length > 0 && await bcrypt.compare(password, teachers[0].password)) {
            return res.json({ success: true, requiresOtp: true, tempUser: { name: teachers[0].teacherName, email: teachers[0].email, role: 'teacher' } });
        }
        res.status(401).json({ success: false, message: "Invalid credentials" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/login/verify-otp', async (req, res) => {
    const { otp, tempUser } = req.body;
    if (otp === "1234") res.json({ success: true, role: tempUser.role, user: tempUser });
    else res.status(401).json({ success: false, message: "Invalid OTP" });
});

app.listen(5000, () => console.log('🚀 Server started on http://localhost:5000'));