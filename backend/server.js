// const express = require('express');
// const mysql = require('mysql2/promise');
// const cors = require('cors');

// const app = express();
// app.use(cors());
// app.use(express.json());

// // DATABASE CONNECTION
// const db = mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     password: '', 
//     database: 'college_system',
//     waitForConnections: true,
//     connectionLimit: 10
// });

// // --- 1. MASTER SYSTEM SYNC ---
// // Powers all dashboard components with a single fetch
// app.get('/api/dashboard/data', async (req, res) => {
//     try {
//         const [depts] = await db.query('SELECT * FROM departments');
        
//         // Alias teacherName -> name for frontend logic
//         const [teachers] = await db.query(`SELECT id, teacherName as name, email, phone, dept_id, 
//             qualification, experience FROM teachers WHERE status = "Active"`);
        
//         const [pending] = await db.query('SELECT * FROM teachers WHERE status = "Pending"');
//         const [students] = await db.query('SELECT * FROM students');
//         const [batches] = await db.query('SELECT * FROM batches');
        
        
//         // Alias dept_id -> courseId for SubjectsManagement
//         const [subjects] = await db.query(`
//             SELECT id, name, code, semester, credits, dept_id as courseId FROM subjects
//         `);
        
//         const [assignments] = await db.query('SELECT * FROM teacher_assignments');

//         res.json({ 
//             departments: depts || [], 
//             teachers: teachers || [], 
//             pendingTeachers: pending || [],
//             students: students || [], 
//             batches: batches || [], 
//             subjects: subjects || [],
//             teacherAssignments: assignments || []
//         });
//     } catch (err) { 
//         console.error("Master Sync Error:", err.message);
//         res.status(500).json({ error: err.message }); 
//     }
// });

// // --- 2. AUTHENTICATION ---
// app.post('/api/login', async (req, res) => {
//     const { username, password, role } = req.body;
//     try {
//         let table = role === 'admin' ? 'admins' : 'teachers';
//         const [user] = await db.query(`SELECT * FROM ${table} WHERE username = ? AND password = ?`, [username, password]);
//         if (user.length > 0) res.json({ success: true, user: user[0] });
//         else res.status(401).json({ success: false, message: "Invalid credentials" });
//     } catch (err) { res.status(500).json({ error: err.message }); }
// });

// // --- 3. DEPARTMENT MANAGEMENT ---
// app.post('/api/departments', async (req, res) => {
//     try {
//         const { name, code, hod } = req.body;
//         const [result] = await db.query('INSERT INTO departments (name, code, hod) VALUES (?, ?, ?)', [name, code, hod]);
//         res.json({ success: true, id: result.insertId });
//     } catch (err) { res.status(500).json({ success: false, error: err.message }); }
// });

// app.delete('/api/departments/:id', async (req, res) => {
//     try {
//         const { id } = req.params;
//         await db.query('UPDATE teachers SET dept_id = NULL WHERE dept_id = ?', [id]);
//         await db.query('UPDATE subjects SET dept_id = NULL WHERE dept_id = ?', [id]);
//         await db.query('DELETE FROM departments WHERE id = ?', [id]);
//         res.json({ success: true });
//     } catch (err) { res.status(500).json({ success: false, error: err.message }); }
// });

// // --- 4. TEACHER MANAGEMENT ---
// app.post('/api/register/teacher', async (req, res) => {
//     try {
//         const { teacherName, email, phone, dept, qualification, experience, username, password } = req.body;
//         const sql = `INSERT INTO teachers (teacherName, email, phone, dept_id, qualification, experience, username, password, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Active')`;
//         const [result] = await db.query(sql, [teacherName, email, phone, dept, qualification, experience, username, password]);
//         res.json({ success: true, id: result.insertId });
//     } catch (err) { res.status(500).json({ success: false, error: err.message }); }
// });

// // --- 5. STUDENT & BATCH MANAGEMENT ---
// app.post('/api/students', async (req, res) => {
//     try {
//         const { 
//             name, enrollmentNo, email, phone, batchId,
//             semester, division, academicYear, dob, address,
//             guardianName, guardianPhone, username, password 
//         } = req.body;

//         if (!batchId) return res.status(400).json({ success: false, error: "Batch ID is required" });

//         const sql = `INSERT INTO students 
//             (name, enrollmentNo, email, phone, batchId, semester, division, academicYear, dob, address, guardianName, guardianPhone, username, password, status) 
//             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Active')`;
        
//         const [result] = await db.query(sql, [
//             name, enrollmentNo, email, phone, batchId,
//             semester, division, academicYear, dob, address,
//             guardianName, guardianPhone, username, password
//         ]);

//         res.json({ success: true, id: result.insertId });
//     } catch (err) {
//         console.error("Student Add Error:", err.message);
//         res.status(500).json({ success: false, error: err.message });
//     }
// });

// app.delete('/api/students/:id', async (req, res) => {
//     try {
//         await db.query('DELETE FROM students WHERE id = ?', [req.params.id]);
//         res.json({ success: true });
//     } catch (err) { res.status(500).json({ error: err.message }); }
// });

// app.post('/api/batches', async (req, res) => {
//     try {
//         const { dept, batch, hod, year } = req.body;
//         const [result] = await db.query('INSERT INTO batches (dept, batch, hod, year) VALUES (?, ?, ?, ?)', [dept, batch, hod, year]);
//         res.json({ success: true, id: result.insertId });
//     } catch (err) { res.status(500).json({ error: err.message }); }
// });

// // --- 6. SUBJECTS & ASSIGNMENTS ---
// app.post('/api/subjects', async (req, res) => {
//     try {
//         const { name, code, semester, credits, courseId } = req.body;
//         const sql = `INSERT INTO subjects (name, code, semester, credits, dept_id) VALUES (?, ?, ?, ?, ?)`;
//         const [result] = await db.query(sql, [name, code, semester, credits, courseId]);
//         res.json({ success: true, id: result.insertId });
//     } catch (err) { res.status(500).json({ success: false, error: err.message }); }
// });

// app.put('/api/subjects/:id', async (req, res) => {
//     try {
//         const { name, code, semester, credits, courseId } = req.body;
//         await db.query(
//             'UPDATE subjects SET name=?, code=?, semester=?, credits=?, dept_id=? WHERE id=?',
//             [name, code, semester, credits, courseId, req.params.id]
//         );
//         res.json({ success: true });
//     } catch (err) { res.status(500).json({ error: err.message }); }
// });

// app.delete('/api/subjects/:id', async (req, res) => {
//     try {
//         const { id } = req.params;
//         await db.query('DELETE FROM teacher_assignments WHERE subjectId = ?', [id]);
//         await db.query('DELETE FROM subjects WHERE id = ?', [id]);
//         res.json({ success: true });
//     } catch (err) { res.status(500).json({ success: false, error: err.message }); }
// });

// app.post('/api/assign-teacher', async (req, res) => {
//     try {
//         const { subjectId, teacherId, academicYearId } = req.body;
//         const sql = `INSERT INTO teacher_assignments (subjectId, teacherId, academicYearId) VALUES (?, ?, ?)`;
//         await db.query(sql, [subjectId, teacherId, academicYearId]);
//         res.json({ success: true });
//     } catch (err) { res.status(500).json({ success: false, error: err.message }); }
// });

// // --- 7. ADMIN REGISTRATION ---
// app.post('/api/register/admin', async (req, res) => {
//     try {
//         const { name, email, password } = req.body;
//         const [result] = await db.query('INSERT INTO admins (name, email, password) VALUES (?, ?, ?)', [name, email, password]);
//         res.json({ success: true, id: result.insertId });
//     } catch (err) { res.status(500).json({ error: err.message }); }
// });



// const PORT = 5000;
// app.listen(PORT, () => console.log(`🚀 SYSTEM FULLY OPERATIONAL ON http://localhost:${PORT}`));






// const express = require('express');
// const mysql = require('mysql2/promise');
// const cors = require('cors');

// const app = express();
// app.use(cors());
// app.use(express.json());

// // DATABASE CONNECTION
// const db = mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     password: '', 
//     database: 'college_system',
//     waitForConnections: true,
//     connectionLimit: 10
// });

// // --- 1. MASTER DASHBOARD SYNC ---
// app.get('/api/dashboard/data', async (req, res) => {
//     try {
//         const [depts] = await db.query('SELECT * FROM departments');
//         const [teachers] = await db.query(`SELECT id, teacherName as name, email, phone, dept_id, qualification, experience FROM teachers WHERE status = "Active"`);
//         const [pending] = await db.query('SELECT * FROM teachers WHERE status = "Pending"');
//         const [students] = await db.query('SELECT * FROM students');
//         const [batches] = await db.query('SELECT * FROM batches');
//         const [subjects] = await db.query(`SELECT id, name, code, semester, credits, dept_id as courseId FROM subjects`);
//         const [assignments] = await db.query('SELECT * FROM teacher_assignments');

//         res.json({ 
//             departments: depts, teachers, pendingTeachers: pending,
//             students, batches, subjects, teacherAssignments: assignments 
//         });
//     } catch (err) { 
//         res.status(500).json({ error: err.message }); 
//     }
// });

// // --- 2. AUTHENTICATION ---
// app.post('/api/login', async (req, res) => {
//     const { username, password, role } = req.body;
//     try {
//         let table = role === 'admin' ? 'admins' : 'teachers';
//         const [user] = await db.query(`SELECT * FROM ${table} WHERE username = ? AND password = ?`, [username, password]);
//         if (user.length > 0) res.json({ success: true, user: user[0] });
//         else res.status(401).json({ success: false, message: "Invalid credentials" });
//     } catch (err) { res.status(500).json({ error: err.message }); }
// });

// // --- 3. SUBJECTS MANAGEMENT (CRUD) ---
// app.post('/api/subjects', async (req, res) => {
//     const { name, code, semester, credits, courseId } = req.body;
//     try {
//         const [result] = await db.query(
//             'INSERT INTO subjects (name, code, semester, credits, dept_id) VALUES (?, ?, ?, ?, ?)',
//             [name, code, semester, credits, courseId]
//         );
//         res.json({ success: true, id: result.insertId });
//     } catch (err) { res.status(500).json({ success: false, error: err.message }); }
// });

// // ADDED: UPDATE SUBJECT
// app.put('/api/subjects/:id', async (req, res) => {
//     const { name, code, semester, credits, courseId } = req.body;
//     try {
//         await db.query(
//             'UPDATE subjects SET name=?, code=?, semester=?, credits=?, dept_id=? WHERE id=?',
//             [name, code, semester, credits, courseId, req.params.id]
//         );
//         res.json({ success: true });
//     } catch (err) { res.status(500).json({ success: false, error: err.message }); }
// });

// app.delete('/api/subjects/:id', async (req, res) => {
//     try {
//         await db.query('DELETE FROM teacher_assignments WHERE subjectId = ?', [req.params.id]);
//         await db.query('DELETE FROM subjects WHERE id = ?', [req.params.id]);
//         res.json({ success: true });
//     } catch (err) { res.status(500).json({ success: false }); }
// });

// // --- 4. TEACHER ASSIGNMENTS ---
// app.post('/api/assign-teacher', async (req, res) => {
//     try {
//         const { subjectId, teacherId, academicYearId } = req.body;
//         await db.query(`INSERT INTO teacher_assignments (subjectId, teacherId, academicYearId) VALUES (?, ?, ?)`, [subjectId, teacherId, academicYearId]);
//         res.json({ success: true });
//     } catch (err) { res.status(500).json({ success: false }); }
// });

// // --- 5. STUDENT PORTAL & PROFILE (Dynamic Fetching) ---
// // NEW: Used by StudentPortal.jsx to show data based on ID
// app.get('/api/students/:id/portal', async (req, res) => {
//     try {
//         const studentId = req.params.id;
//         // 1. Fetch Student Profile
//         const [profile] = await db.query('SELECT * FROM students WHERE id = ?', [studentId]);
//         if (profile.length === 0) return res.status(404).json({ message: "Student not found" });

//         // 2. Fetch Marks joined with Subject names
//         const [marks] = await db.query(`
//             SELECT m.*, s.name as subject_name, s.credits 
//             FROM marks m
//             JOIN subjects s ON m.subject_id = s.id
//             WHERE m.student_id = ?`, [studentId]);

//         res.json({ profile: profile[0], marks: marks });
//     } catch (err) { res.status(500).json({ error: err.message }); }
// });

// app.post('/api/students', async (req, res) => {
//     try {
//         const d = req.body;
//         const semInt = parseInt(d.semester) || 1;
//         const sql = `INSERT INTO students (name, enrollmentNo, email, phone, batchId, semester, division, academicYear, dob, address, guardianName, guardianPhone, username, password, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Active')`;
//         const [resul] = await db.query(sql, [d.name, d.enrollmentNo, d.email, d.phone, d.batchId, semInt, d.division, d.academicYear, d.dob, d.address, d.guardianName, d.guardianPhone, d.username, d.password]);
//         res.json({ success: true, id: resul.insertId });
//     } catch (err) { res.status(500).json({ error: err.message }); }
// });

// app.delete('/api/students/:id', async (req, res) => {
//     try {
//         await db.query('DELETE FROM students WHERE id = ?', [req.params.id]);
//         res.json({ success: true });
//     } catch (err) { res.status(500).json({ success: false }); }
// });

// // --- 6. FACULTY PORTAL (Relational Sync) ---
// app.get('/api/faculty/data/:username', async (req, res) => {
//     const { username } = req.params;
//     try {
//         const [teacher] = await db.query('SELECT id FROM teachers WHERE username = ?', [username]);
//         if (teacher.length === 0) return res.status(404).json({ message: "Not found" });

//         const [subjects] = await db.query(`
//             SELECT s.* FROM subjects s 
//             JOIN teacher_assignments ta ON s.id = ta.subjectId 
//             WHERE ta.teacherId = ?`, [teacher[0].id]);

//         const fullData = await Promise.all(subjects.map(async (sub) => {
//             const [students] = await db.query('SELECT * FROM students WHERE semester = ?', [sub.semester]);
//             return { ...sub, students };
//         }));

//         res.json({ subjects: fullData });
//     } catch (err) { res.status(500).json({ error: err.message }); }
// });

// app.post('/api/faculty/save-marks', async (req, res) => {
//     try {
//         const { studentId, subjectId, semester, marks } = req.body;
//         const sql = `
//             INSERT INTO marks (student_id, subject_id, semester, isa1, theory, practical) 
//             VALUES (?, ?, ?, ?, ?, ?) 
//             ON DUPLICATE KEY UPDATE theory=VALUES(theory), practical=VALUES(practical)`;
//         await db.query(sql, [studentId, subjectId, semester, marks.isa1, marks.sem, marks.practical]);
//         res.json({ success: true });
//     } catch (err) { res.status(500).json({ error: err.message }); }
// });


// app.post('/api/students/upload-doc', async (req, res) => {
//     const { studentId, docName, fileType } = req.body;
//     try {
//         const sql = 'INSERT INTO student_documents (student_id, doc_name, file_type, upload_date, status) VALUES (?, ?, ?, NOW(), "Pending")';
//         await db.query(sql, [studentId, docName, fileType]);
//         res.json({ success: true, message: "Document record created" });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// // --- 7. REGISTRATION HELPERS ---
// app.post('/api/departments', async (req, res) => {
//     const { name, code, hod } = req.body;
//     const [result] = await db.query('INSERT INTO departments (name, code, hod) VALUES (?, ?, ?)', [name, code, hod]);
//     res.json({ success: true, id: result.insertId });
// });

// app.post('/api/batches', async (req, res) => {
//     const { dept, batch, hod, year } = req.body;
//     const [result] = await db.query('INSERT INTO batches (dept, batch, hod, year) VALUES (?, ?, ?, ?)', [dept, batch, hod, year]);
//     res.json({ success: true, id: result.insertId });
// });

// const PORT = 5000;
// app.listen(PORT, () => {
//     console.log(`🚀 SERVER RUNNING ON PORT: ${PORT}`);
// });


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

// --- 1. MASTER DASHBOARD SYNC ---
app.get('/api/dashboard/data', async (req, res) => {
    try {
        const [depts] = await db.query('SELECT * FROM departments');
        const [teachers] = await db.query(`SELECT id, teacherName as name, email, phone, dept_id, qualification, experience FROM teachers WHERE status = "Active"`);
        const [pending] = await db.query('SELECT * FROM teachers WHERE status = "Pending"');
        const [students] = await db.query('SELECT * FROM students');
        const [batches] = await db.query('SELECT * FROM batches');
        const [subjects] = await db.query(`SELECT id, name, code, semester, credits, dept_id as courseId FROM subjects`);
        const [assignments] = await db.query('SELECT * FROM teacher_assignments');

        res.json({ 
            departments: depts, teachers, pendingTeachers: pending,
            students, batches, subjects, teacherAssignments: assignments 
        });
    } catch (err) { res.status(500).json({ error: err.message }); }
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

// --- 3. STUDENT PORTAL DATA (Live Profile & Marks) ---
app.get('/api/students/:id/portal', async (req, res) => {
    try {
        const studentId = req.params.id;
        const [profile] = await db.query('SELECT * FROM students WHERE id = ?', [studentId]);
        if (profile.length === 0) return res.status(404).json({ message: "Student not found" });

        const [marks] = await db.query(`
            SELECT m.*, s.name as subject_name, s.credits 
            FROM marks m
            JOIN subjects s ON m.subject_id = s.id
            WHERE m.student_id = ? ORDER BY m.semester ASC`, [studentId]);

        const [docs] = await db.query('SELECT * FROM student_documents WHERE student_id = ?', [studentId]);

        res.json({ profile: profile[0], marks, documents: docs });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- 4. DOCUMENT MANAGEMENT (Student Upload & Admin Verify) ---
app.post('/api/students/upload-doc', async (req, res) => {
    const { studentId, docName, fileType } = req.body;
    try {
        const sql = 'INSERT INTO student_documents (student_id, doc_name, file_type, upload_date, status) VALUES (?, ?, ?, NOW(), "Pending")';
        await db.query(sql, [studentId, docName, fileType]);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/admin/pending-documents', async (req, res) => {
    try {
        const [docs] = await db.query(`
            SELECT d.*, s.name as student_name, s.enrollmentNo 
            FROM student_documents d
            JOIN students s ON d.student_id = s.id
            WHERE d.status = "Pending"`);
        res.json(docs);
    } catch (err) { res.status(500).json(err); }
});

app.put('/api/admin/verify-document/:id', async (req, res) => {
    const { status } = req.body;
    try {
        await db.query('UPDATE student_documents SET status = ? WHERE id = ?', [status, req.params.id]);
        res.json({ success: true });
    } catch (err) { res.status(500).json(err); }
});

// --- 5. FACULTY PORTAL (Relational Sync with 3 ISAs) ---
app.get('/api/faculty/data/:username', async (req, res) => {
    const { username } = req.params;
    try {
        const [teacher] = await db.query('SELECT id FROM teachers WHERE username = ?', [username]);
        if (teacher.length === 0) return res.status(404).json({ message: "Teacher not found" });

        const [subjects] = await db.query(`
            SELECT s.* FROM subjects s 
            JOIN teacher_assignments ta ON s.id = ta.subjectId 
            WHERE ta.teacherId = ?`, [teacher[0].id]);

        const fullData = await Promise.all(subjects.map(async (sub) => {
            const [students] = await db.query('SELECT * FROM students WHERE semester = ?', [sub.semester]);
            const studentsWithMarks = await Promise.all(students.map(async (st) => {
                const [m] = await db.query('SELECT * FROM marks WHERE student_id = ? AND subject_id = ?', [st.id, sub.id]);
                return { ...st, marks: m[0] || {} };
            }));
            return { ...sub, students: studentsWithMarks };
        }));

        res.json({ subjects: fullData });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/faculty/save-marks', async (req, res) => {
    try {
        const { studentId, subjectId, semester, marks } = req.body;
        const sql = `
            INSERT INTO marks (student_id, subject_id, semester, isa1, isa2, isa3, theory, practical) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?) 
            ON DUPLICATE KEY UPDATE 
            isa1=VALUES(isa1), isa2=VALUES(isa2), isa3=VALUES(isa3), 
            theory=VALUES(theory), practical=VALUES(practical)`;
        
        await db.query(sql, [
            studentId, subjectId, semester, 
            marks.isa1 || 0, marks.isa2 || 0, marks.isa3 || 0, 
            marks.sem || 0, marks.practical || 0
        ]);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- 6. CORE CRUD (Subjects, Students, Batches, Departments) ---

// DELETE STUDENT (Fixes frontend 404)
app.delete('/api/students/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM students WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

// DELETE DEPARTMENT (Fixes frontend 404)
app.delete('/api/departments/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM departments WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ success: false, error: "Cannot delete department with linked records." }); }
});

app.post('/api/subjects', async (req, res) => {
    const { name, code, semester, credits, courseId } = req.body;
    try {
        await db.query('INSERT INTO subjects (name, code, semester, credits, dept_id) VALUES (?, ?, ?, ?, ?)', [name, code, semester, credits, courseId]);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/subjects/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM teacher_assignments WHERE subjectId = ?', [req.params.id]);
        await db.query('DELETE FROM subjects WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ success: false }); }
});

app.post('/api/students', async (req, res) => {
    try {
        const d = req.body;
        const semInt = parseInt(d.semester) || 1;
        const sql = `INSERT INTO students (name, enrollmentNo, email, phone, batchId, semester, division, academicYear, dob, address, guardianName, guardianPhone, username, password, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Active')`;
        const [resul] = await db.query(sql, [d.name, d.enrollmentNo, d.email, d.phone, d.batchId, semInt, d.division, d.academicYear, d.dob, d.address, d.guardianName, d.guardianPhone, d.username, d.password]);
        res.json({ success: true, id: resul.insertId });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/departments', async (req, res) => {
    const { name, code, hod } = req.body;
    const [result] = await db.query('INSERT INTO departments (name, code, hod) VALUES (?, ?, ?)', [name, code, hod]);
    res.json({ success: true, id: result.insertId });
});

app.post('/api/batches', async (req, res) => {
    const { dept, batch, hod, year } = req.body;
    const [result] = await db.query('INSERT INTO batches (dept, batch, hod, year) VALUES (?, ?, ?, ?)', [dept, batch, hod, year]);
    res.json({ success: true, id: result.insertId });
});

app.post('/api/assign-teacher', async (req, res) => {
    try {
        const { subjectId, teacherId, academicYearId } = req.body;
        await db.query(`INSERT INTO teacher_assignments (subjectId, teacherId, academicYearId) VALUES (?, ?, ?)`, [subjectId, teacherId, academicYearId]);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ success: false }); }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 SERVER RUNNING ON PORT: ${PORT}`);
});