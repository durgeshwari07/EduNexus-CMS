const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// DATABASE CONNECTION
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '', 
    database: 'college_system',
    waitForConnections: true,
    connectionLimit: 10
});

// --- 1. MASTER SYSTEM SYNC ---
// Powers all dashboard components with a single fetch
app.get('/api/dashboard/data', async (req, res) => {
    try {
        const [depts] = await db.query('SELECT * FROM departments');
        
        // Alias teacherName -> name for frontend logic
        const [teachers] = await db.query(`SELECT id, teacherName as name, email, phone, dept_id, 
            qualification, experience FROM teachers WHERE status = "Active"`);
        
        const [pending] = await db.query('SELECT * FROM teachers WHERE status = "Pending"');
        const [students] = await db.query('SELECT * FROM students');
        const [batches] = await db.query('SELECT * FROM batches');
        
        
        // Alias dept_id -> courseId for SubjectsManagement
        const [subjects] = await db.query(`
            SELECT id, name, code, semester, credits, dept_id as courseId FROM subjects
        `);
        
        const [assignments] = await db.query('SELECT * FROM teacher_assignments');

        res.json({ 
            departments: depts || [], 
            teachers: teachers || [], 
            pendingTeachers: pending || [],
            students: students || [], 
            batches: batches || [], 
            subjects: subjects || [],
            teacherAssignments: assignments || []
        });
    } catch (err) { 
        console.error("Master Sync Error:", err.message);
        res.status(500).json({ error: err.message }); 
    }
});

// --- 2. AUTHENTICATION ---
app.post('/api/login', async (req, res) => {
    const { username, password, role } = req.body;
    try {
        let table = role === 'admin' ? 'admins' : 'teachers';
        const [user] = await db.query(`SELECT * FROM ${table} WHERE username = ? AND password = ?`, [username, password]);
        if (user.length > 0) res.json({ success: true, user: user[0] });
        else res.status(401).json({ success: false, message: "Invalid credentials" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- 3. DEPARTMENT MANAGEMENT ---
app.post('/api/departments', async (req, res) => {
    try {
        const { name, code, hod } = req.body;
        const [result] = await db.query('INSERT INTO departments (name, code, hod) VALUES (?, ?, ?)', [name, code, hod]);
        res.json({ success: true, id: result.insertId });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

app.delete('/api/departments/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('UPDATE teachers SET dept_id = NULL WHERE dept_id = ?', [id]);
        await db.query('UPDATE subjects SET dept_id = NULL WHERE dept_id = ?', [id]);
        await db.query('DELETE FROM departments WHERE id = ?', [id]);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

// --- 4. TEACHER MANAGEMENT ---
app.post('/api/register/teacher', async (req, res) => {
    try {
        const { teacherName, email, phone, dept, qualification, experience, username, password } = req.body;
        const sql = `INSERT INTO teachers (teacherName, email, phone, dept_id, qualification, experience, username, password, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Active')`;
        const [result] = await db.query(sql, [teacherName, email, phone, dept, qualification, experience, username, password]);
        res.json({ success: true, id: result.insertId });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

// --- 5. STUDENT & BATCH MANAGEMENT ---
app.post('/api/students', async (req, res) => {
    try {
        const { 
            name, enrollmentNo, email, phone, batchId,
            semester, division, academicYear, dob, address,
            guardianName, guardianPhone, username, password 
        } = req.body;

        if (!batchId) return res.status(400).json({ success: false, error: "Batch ID is required" });

        const sql = `INSERT INTO students 
            (name, enrollmentNo, email, phone, batchId, semester, division, academicYear, dob, address, guardianName, guardianPhone, username, password, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Active')`;
        
        const [result] = await db.query(sql, [
            name, enrollmentNo, email, phone, batchId,
            semester, division, academicYear, dob, address,
            guardianName, guardianPhone, username, password
        ]);

        res.json({ success: true, id: result.insertId });
    } catch (err) {
        console.error("Student Add Error:", err.message);
        res.status(500).json({ success: false, error: err.message });
    }
});

app.delete('/api/students/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM students WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/batches', async (req, res) => {
    try {
        const { dept, batch, hod, year } = req.body;
        const [result] = await db.query('INSERT INTO batches (dept, batch, hod, year) VALUES (?, ?, ?, ?)', [dept, batch, hod, year]);
        res.json({ success: true, id: result.insertId });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- 6. SUBJECTS & ASSIGNMENTS ---
app.post('/api/subjects', async (req, res) => {
    try {
        const { name, code, semester, credits, courseId } = req.body;
        const sql = `INSERT INTO subjects (name, code, semester, credits, dept_id) VALUES (?, ?, ?, ?, ?)`;
        const [result] = await db.query(sql, [name, code, semester, credits, courseId]);
        res.json({ success: true, id: result.insertId });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

app.put('/api/subjects/:id', async (req, res) => {
    try {
        const { name, code, semester, credits, courseId } = req.body;
        await db.query(
            'UPDATE subjects SET name=?, code=?, semester=?, credits=?, dept_id=? WHERE id=?',
            [name, code, semester, credits, courseId, req.params.id]
        );
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/subjects/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM teacher_assignments WHERE subjectId = ?', [id]);
        await db.query('DELETE FROM subjects WHERE id = ?', [id]);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

app.post('/api/assign-teacher', async (req, res) => {
    try {
        const { subjectId, teacherId, academicYearId } = req.body;
        const sql = `INSERT INTO teacher_assignments (subjectId, teacherId, academicYearId) VALUES (?, ?, ?)`;
        await db.query(sql, [subjectId, teacherId, academicYearId]);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

// --- 7. ADMIN REGISTRATION ---
app.post('/api/register/admin', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const [result] = await db.query('INSERT INTO admins (name, email, password) VALUES (?, ?, ?)', [name, email, password]);
        res.json({ success: true, id: result.insertId });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 SYSTEM FULLY OPERATIONAL ON http://localhost:${PORT}`));