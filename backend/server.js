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

    try {
        // Fetches user and ensures both roles get the institutional collegeName from the master admin
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
                collegeName: user.collegeName || "UniDesk Institution" // Consistent Branding
            }, 
            role, 
            expiry: Date.now() + 5 * 60 * 1000 
        };

        try {
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: lowerEmail,
                subject: "UniDesk Login Verification",
                html: `<div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 500px;">
                        <h2 style="color: #136dec; text-align: center;">UniDesk Access</h2>
                        <p style="text-align: center;">Your verification code is:</p>
                        <h1 style="letter-spacing: 10px; color: #333; text-align: center; background: #f4f4f4; padding: 10px; border-radius: 5px;">${otp}</h1>
                        <p style="font-size: 12px; color: #888; text-align: center;">This code expires in 5 minutes.</p>
                       </div>`
            });
        } catch (mailErr) {
            console.error("Mail Transporter Error:", mailErr.message);
            return res.status(500).json({ success: false, message: "Email service temporarily unavailable" });
        }

        res.json({ success: true, message: "OTP sent to email" });
    } catch (err) {
        console.error("Auth Error:", err);
        res.status(500).json({ success: false, message: "Server error during authentication" });
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

// --- 4. MASTER DATA SYNC ---
app.get('/api/dashboard/data', async (req, res) => {
    try {
        const [depts] = await db.query('SELECT * FROM departments');
        
        // Joined queries ensure the frontend shows Department Labels instead of raw IDs
        const teacherQuery = (status) => `
            SELECT t.*, CONCAT(t.first_name, ' ', t.last_name) as name, d.name as deptName 
            FROM teachers t 
            LEFT JOIN departments d ON t.dept_id = d.id 
            WHERE t.status = "${status}"`;

        const [teachers] = await db.query(teacherQuery('Active'));
        const [pending] = await db.query(teacherQuery('Pending'));
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

// --- 5. REGISTRATION ---
app.post('/api/register/admin', async (req, res) => {
    const d = req.body;
    try {
        const hashedPassword = await bcrypt.hash(d.password, 10);
        const [result] = await db.query(
            `INSERT INTO admins (collegeName, collegeCode, collegeEmail, address, academicYear, board, name, phone, email, username, password) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
            [d.collegeName, d.collegeCode, d.collegeEmail, d.address, d.academicYear, d.board, d.name, d.phone, d.email, d.username, hashedPassword]
        );
        res.json({ success: true, user: { id: result.insertId, name: d.name, collegeName: d.collegeName, username: d.username, role: 'admin' } });
    } catch (err) { res.status(500).json({ success: false, message: "Registration failed" }); }
});

app.post('/api/register-teacher', async (req, res) => {
    const d = req.body;
    try {
        const hash = await bcrypt.hash(d.password, 10);
        const sql = `INSERT INTO teachers (first_name, middle_name, last_name, email, phone, dept_id, qualification, experience, employmentType, username, password, status) 
                     VALUES (?,?,?,?,?,?,?,?,?,?,?,'Pending')`;
        await db.query(sql, [d.first_name, d.middle_name || null, d.last_name, d.email.toLowerCase(), d.phone, d.dept_id, d.qualification, d.experience || 0, d.employmentType, d.username, hash]);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ success: false, message: "Registration failed. User may already exist." }); }
});

// --- 6. CORE MANAGEMENT (CRUD) ---
app.post('/api/departments', async (req, res) => {
    await db.query('INSERT INTO departments (name, code, hod) VALUES (?, ?, ?)', [req.body.name, req.body.code, req.body.hod]);
    res.json({ success: true });
});

app.delete('/api/departments/:id', async (req, res) => {
    await db.query('DELETE FROM departments WHERE id = ?', [req.params.id]);
    res.json({ success: true });
});

app.post('/api/subjects', async (req, res) => {
    const { name, code, semester, credits, courseId } = req.body;
    await db.query(`INSERT INTO subjects (name, code, semester, credits, dept_id) VALUES (?, ?, ?, ?, ?)`, [name, code, semester, credits, courseId]);
    res.json({ success: true });
});

app.post('/api/batches', async (req, res) => {
    await db.query('INSERT INTO batches (dept, batch, hod, year) VALUES (?, ?, ?, ?)', [req.body.dept, req.body.batch, req.body.hod, req.body.year]);
    res.json({ success: true });
});

app.post('/api/students', async (req, res) => {
    const s = req.body;
    const sql = `INSERT INTO students (name, enrollmentNo, email, phone, batchId, semester, academicYear, status) VALUES (?, ?, ?, ?, ?, ?, ?, 'Active')`;
    await db.query(sql, [s.name, s.enrollmentNo, s.email, s.phone, s.batchId, s.semester, s.academicYear]);
    res.json({ success: true });
});

app.delete('/api/students/:id', async (req, res) => {
    await db.query('DELETE FROM students WHERE id = ?', [req.params.id]);
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

// --- 7. SERVER START ---
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`\n--------------------------------------`);
    console.log(`🚀 UNIDESK SERVER: http://localhost:${PORT}`);
    console.log(`📡 STATUS: OPERATIONAL`);
    console.log(`--------------------------------------\n`);
});