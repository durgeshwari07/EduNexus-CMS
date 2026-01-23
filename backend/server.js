// // // const express = require('express');
// // // const mysql = require('mysql2/promise');
// // // const cors = require('cors');
// // // const bcrypt = require('bcryptjs');

// // // const app = express();
// // // app.use(cors());
// // // app.use(express.json());

// // // // MySQL Connection Pool
// // // const db = mysql.createPool({
// // //     host: 'localhost',
// // //     user: 'root',
// // //     password: '', 
// // //     database: 'college_system'
// // // });

// // // // --- AUTHENTICATION & REGISTRATION ---

// // // // Admin Registration
// // // app.post('/api/register/admin', async (req, res) => {
// // //     try {
// // //         const { password, ...data } = req.body;
// // //         const hashedPassword = await bcrypt.hash(password, 10);
// // //         const sql = `INSERT INTO admins (collegeName, collegeEmail, collegeCode, address, academicYear, board, adminName, adminPhone, adminEmail, password) VALUES (?,?,?,?,?,?,?,?,?,?)`;
// // //         await db.query(sql, [...Object.values(data).slice(0, 9), hashedPassword]);
// // //         res.json({ success: true, message: "Admin Registered" });
// // //     } catch (err) { res.status(500).json({ success: false, error: err.message }); }
// // // });

// // // // Teacher Registration (Pending)
// // // app.post('/api/register/teacher', async (req, res) => {
// // //     try {
// // //         const { password, ...data } = req.body;
// // //         const hashedPassword = await bcrypt.hash(password, 10);
// // //         const sql = `INSERT INTO teachers (teacherName, email, phone, dept, designation, employeeId, classes, subjects, username, password) VALUES (?,?,?,?,?,?,?,?,?,?)`;
// // //         await db.query(sql, [data.teacherName, data.email, data.phone, data.dept, data.designation, data.employeeId, data.classes, data.subjects, data.username, hashedPassword]);
// // //         res.json({ success: true, message: "Request Submitted" });
// // //     } catch (err) { res.status(500).json({ success: false, error: err.message }); }
// // // });

// // // // --- DEPARTMENT & SUBJECT MANAGEMENT ---

// // // // Get Everything for Dashboard
// // // app.get('/api/dashboard/data', async (req, res) => {
// // //     try {
// // //         const [depts] = await db.query('SELECT * FROM departments');
// // //         const [subs] = await db.query('SELECT * FROM subjects');
// // //         const [teachers] = await db.query('SELECT * FROM teachers WHERE status = "Active"');
// // //         const [assigns] = await db.query('SELECT * FROM teacher_assignments');
// // //         res.json({ departments: depts, subjects: subs, teachers, assignments: assigns });
// // //     } catch (err) { res.status(500).json({ error: err.message }); }
// // // });

// // // // Add Subject
// // // app.post('/api/subjects', async (req, res) => {
// // //     const { name, code, semester, credits, dept_id } = req.body;
// // //     try {
// // //         await db.query('INSERT INTO subjects (name, code, semester, credits, dept_id) VALUES (?,?,?,?,?)', [name, code, semester, credits, dept_id]);
// // //         res.json({ success: true });
// // //     } catch (err) { res.status(500).json({ error: err.message }); }
// // // });

// // // // Assign Teacher (With Duplicate Check)
// // // app.post('/api/assign', async (req, res) => {
// // //     const { subject_id, teacher_id, academic_year } = req.body;
// // //     try {
// // //         await db.query('INSERT INTO teacher_assignments (subject_id, teacher_id, academic_year) VALUES (?,?,?)', [subject_id, teacher_id, academic_year]);
// // //         res.json({ success: true });
// // //     } catch (err) { 
// // //         if(err.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: "Teacher already assigned!" });
// // //         res.status(500).json({ error: err.message }); 
// // //     }
// // // });

// // // app.listen(5000, () => console.log('🚀 Unified Backend running on Port 5000'));



// // const express = require('express');
// // const mysql = require('mysql2/promise');
// // const cors = require('cors');
// // const bcrypt = require('bcryptjs');

// // const app = express();

// // // 1. SECURITY & PARSING (Fixes the raw-body terminal error)
// // app.use(cors());
// // app.use(express.json({ limit: '10mb' })); 
// // app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// // // 2. DATABASE CONNECTION
// // const db = mysql.createPool({
// //     host: 'localhost',
// //     user: 'root',
// //     password: '', 
// //     database: 'college_system',
// //     waitForConnections: true,
// //     connectionLimit: 10
// // });

// // // --- FETCH ALL DASHBOARD DATA ---
// // app.get('/api/dashboard/data', async (req, res) => {
// //     try {
// //         const [depts] = await db.query('SELECT id, name, code, hod FROM departments');
// //         const [teachers] = await db.query('SELECT id, teacherName AS name, email, designation FROM teachers WHERE status = "Active"');
// //         const [pending] = await db.query('SELECT id, teacherName AS name, email, designation, created_at AS dateApplied FROM teachers WHERE status = "Pending"');

// //         res.json({ 
// //             departments: depts, 
// //             teachers: teachers, 
// //             pendingTeachers: pending 
// //         });
// //     } catch (err) {
// //         console.error("Fetch Error:", err.message);
// //         res.status(500).json({ error: err.message });
// //     }
// // });

// // // --- ADD DEPARTMENT ---
// // app.post('/api/departments', async (req, res) => {
// //     try {
// //         const { name, code, hod } = req.body;
// //         const [result] = await db.query(
// //             'INSERT INTO departments (name, code, hod) VALUES (?, ?, ?)', 
// //             [name, code, hod]
// //         );
// //         res.json({ success: true, id: result.insertId });
// //     } catch (err) {
// //         console.error("Post Error:", err.message);
// //         res.status(500).json({ success: false, error: err.message });
// //     }
// // });

// // // --- APPROVE TEACHER ---
// // app.post('/api/teachers/approve/:id', async (req, res) => {
// //     try {
// //         await db.query('UPDATE teachers SET status = "Active" WHERE id = ?', [req.params.id]);
// //         res.json({ success: true });
// //     } catch (err) {
// //         res.status(500).json({ success: false });
// //     }
// // });

// // // --- LOGIN LOGIC ---
// // app.post('/api/login/verify-credentials', async (req, res) => {
// //     const { email, password } = req.body;
// //     try {
// //         const [admins] = await db.query('SELECT * FROM admins WHERE adminEmail = ?', [email]);
// //         if (admins.length > 0 && await bcrypt.compare(password, admins[0].password)) {
// //             return res.json({ success: true, requiresOtp: true, tempUser: { name: admins[0].adminName, email: admins[0].adminEmail, role: 'admin' } });
// //         }
// //         const [teachers] = await db.query('SELECT * FROM teachers WHERE email = ? AND status = "Active"', [email]);
// //         if (teachers.length > 0 && await bcrypt.compare(password, teachers[0].password)) {
// //             return res.json({ success: true, requiresOtp: true, tempUser: { name: teachers[0].teacherName, email: teachers[0].email, role: 'teacher' } });
// //         }
// //         res.status(401).json({ success: false, message: "Invalid credentials" });
// //     } catch (err) { res.status(500).json({ error: err.message }); }
// // });

// // app.post('/api/login/verify-otp', async (req, res) => {
// //     const { otp, tempUser } = req.body;
// //     if (otp === "1234") res.json({ success: true, role: tempUser.role, user: tempUser });
// //     else res.status(401).json({ success: false, message: "Invalid OTP" });
// // });

// // app.listen(5000, () => console.log('🚀 Server started on http://localhost:5000'));







// const express = require('express');
// const mysql = require('mysql2/promise');
// const cors = require('cors');
// const bcrypt = require('bcryptjs');

// const app = express();

// // SECURITY & PARSING
// app.use(cors());
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// // DATABASE CONNECTION
// const db = mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     password: '', 
//     database: 'college_system',
//     waitForConnections: true,
//     connectionLimit: 10
// });

// // --- DASHBOARD DATA ---
// app.get('/api/dashboard/data', async (req, res) => {
//     try {
//         const [depts] = await db.query('SELECT * FROM departments');
//         const [teachers] = await db.query('SELECT id, teacherName AS name, email, designation FROM teachers WHERE status = "Active"');
//         const [pending] = await db.query('SELECT id, teacherName AS name, email, designation, created_at AS dateApplied FROM teachers WHERE status = "Pending"');
//         res.json({ departments: depts, teachers: teachers, pendingTeachers: pending });
//     } catch (err) { res.status(500).json({ error: err.message }); }
// });

// // --- DEPARTMENT CRUD ---
// app.post('/api/departments', async (req, res) => {
//     try {
//         const { name, code, hod } = req.body;
//         const [result] = await db.query('INSERT INTO departments (name, code, hod) VALUES (?, ?, ?)', [name, code, hod]);
//         res.json({ success: true, id: result.insertId });
//     } catch (err) { res.status(500).json({ success: false, error: err.message }); }
// });

// // app.put('/api/departments/:id', async (req, res) => {
// //     try {
// //         const { name, code, hod } = req.body;
// //         await db.query('UPDATE departments SET name=?, code=?, hod=? WHERE id=?', [name, code, hod, req.params.id]);
// //         res.json({ success: true });
// //     } catch (err) { res.status(500).json({ success: false }); }
// // });

// // app.delete('/api/departments/:id', async (req, res) => {
// //     try {
// //         await db.query('DELETE FROM departments WHERE id = ?', [req.params.id]);
// //         res.json({ success: true });
// //     } catch (err) { res.status(500).json({ success: false }); }
// // });

// app.delete('/api/departments/:id', async (req, res) => {
//     await db.query('DELETE FROM departments WHERE id = ?', [req.params.id]);
//     res.json({ success: true });
// });

// app.put('/api/departments/:id', async (req, res) => {
//     const { name, code, hod } = req.body;
//     await db.query('UPDATE departments SET name=?, code=?, hod=? WHERE id=?', [name, code, hod, req.params.id]);
//     res.json({ success: true });
// });


// // --- TEACHER APPROVAL ---
// app.post('/api/teachers/approve/:id', async (req, res) => {
//     try {
//         await db.query('UPDATE teachers SET status = "Active" WHERE id = ?', [req.params.id]);
//         res.json({ success: true });
//     } catch (err) { res.status(500).json({ success: false }); }
// });

// // --- LOGIN ---
// app.post('/api/login/verify-credentials', async (req, res) => {
//     const { email, password } = req.body;
//     try {
//         const [admins] = await db.query('SELECT * FROM admins WHERE adminEmail = ?', [email]);
//         if (admins.length > 0 && await bcrypt.compare(password, admins[0].password)) {
//             return res.json({ success: true, requiresOtp: true, tempUser: { name: admins[0].adminName, email: admins[0].adminEmail, role: 'admin' } });
//         }
//         const [teachers] = await db.query('SELECT * FROM teachers WHERE email = ? AND status = "Active"', [email]);
//         if (teachers.length > 0 && await bcrypt.compare(password, teachers[0].password)) {
//             return res.json({ success: true, requiresOtp: true, tempUser: { name: teachers[0].teacherName, email: teachers[0].email, role: 'teacher' } });
//         }
//         res.status(401).json({ success: false, message: "Invalid credentials" });
//     } catch (err) { res.status(500).json({ error: err.message }); }
// });

// app.post('/api/login/verify-otp', async (req, res) => {
//     const { otp, tempUser } = req.body;
//     if (otp === "1234") res.json({ success: true, role: tempUser.role, user: tempUser });
//     else res.status(401).json({ success: false, message: "Invalid OTP" });
// });

// app.listen(5000, () => console.log('🚀 Server running on http://localhost:5000'));




// const express = require('express');
// const mysql = require('mysql2/promise');
// const cors = require('cors');
// const bcrypt = require('bcryptjs');

// const app = express();

// // 1. SECURITY & PARSING
// app.use(cors());
// app.use(express.json({ limit: '10mb' })); 
// app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// // 2. DATABASE CONNECTION (MySQL XAMPP)
// const db = mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     password: '', 
//     database: 'college_system',
//     waitForConnections: true,
//     connectionLimit: 10
// });

// // --- FETCH ALL DASHBOARD DATA ---
// app.get('/api/dashboard/data', async (req, res) => {
//     try {
//         const [depts] = await db.query('SELECT * FROM departments');
//         const [teachers] = await db.query('SELECT id, teacherName AS name, email, designation FROM teachers WHERE status = "Active"');
//         const [pending] = await db.query('SELECT id, teacherName AS name, email, designation, created_at AS dateApplied FROM teachers WHERE status = "Pending"');

//         res.json({ 
//             departments: depts, 
//             teachers: teachers, 
//             pendingTeachers: pending 
//         });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// // --- DEPARTMENT CRUD OPERATIONS ---

// // 1. ADD
// app.post('/api/departments', async (req, res) => {
//     try {
//         const { name, code, hod } = req.body;
//         const [result] = await db.query(
//             'INSERT INTO departments (name, code, hod) VALUES (?, ?, ?)', 
//             [name, code, hod]
//         );
//         res.json({ success: true, id: result.insertId });
//     } catch (err) {
//         res.status(500).json({ success: false, error: err.message });
//     }
// });

// // 2. EDIT (UPDATE)
// app.put('/api/departments/:id', async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { name, code, hod } = req.body;
//         await db.query(
//             'UPDATE departments SET name = ?, code = ?, hod = ? WHERE id = ?',
//             [name, code, hod, id]
//         );
//         res.json({ success: true, message: "Department updated" });
//     } catch (err) {
//         res.status(500).json({ success: false, error: err.message });
//     }
// });

// // 3. DELETE
// app.delete('/api/departments/:id', async (req, res) => {
//     try {
//         const { id } = req.params;
//         await db.query('DELETE FROM departments WHERE id = ?', [id]);
//         res.json({ success: true, message: "Department deleted" });
//     } catch (err) {
//         res.status(500).json({ success: false, error: err.message });
//     }
// });

// // --- TEACHER APPROVAL ---
// app.post('/api/teachers/approve/:id', async (req, res) => {
//     try {
//         await db.query('UPDATE teachers SET status = "Active" WHERE id = ?', [req.params.id]);
//         res.json({ success: true });
//     } catch (err) {
//         res.status(500).json({ success: false });
//     }
// });

// // --- LOGIN LOGIC ---
// app.post('/api/login/verify-credentials', async (req, res) => {
//     const { email, password } = req.body;
//     try {
//         // Check Admin Table
//         const [admins] = await db.query('SELECT * FROM admins WHERE adminEmail = ?', [email]);
//         if (admins.length > 0 && await bcrypt.compare(password, admins[0].password)) {
//             return res.json({ 
//                 success: true, 
//                 requiresOtp: true, 
//                 tempUser: { name: admins[0].adminName, email: admins[0].adminEmail, role: 'admin' } 
//             });
//         }
//         // Check Teacher Table
//         const [teachers] = await db.query('SELECT * FROM teachers WHERE email = ? AND status = "Active"', [email]);
//         if (teachers.length > 0 && await bcrypt.compare(password, teachers[0].password)) {
//             return res.json({ 
//                 success: true, 
//                 requiresOtp: true, 
//                 tempUser: { name: teachers[0].teacherName, email: teachers[0].email, role: 'teacher' } 
//             });
//         }
//         res.status(401).json({ success: false, message: "Invalid credentials" });
//     } catch (err) { 
//         res.status(500).json({ error: err.message }); 
//     }
// });

// app.post('/api/login/verify-otp', async (req, res) => {
//     const { otp, tempUser } = req.body;
//     if (otp === "1234") res.json({ success: true, role: tempUser.role, user: tempUser });
//     else res.status(401).json({ success: false, message: "Invalid OTP" });
// });

// app.listen(5000, () => console.log('🚀 Server started on http://localhost:5000'));




// const express = require('express');
// const mysql = require('mysql2/promise');
// const cors = require('cors');

// const app = express();
// app.use(cors());
// app.use(express.json());

// const db = mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     password: '', 
//     database: 'college_system',
//     waitForConnections: true,
//     connectionLimit: 10
// });

// // --- 1. MASTER SYSTEM SYNC ---
// app.get('/api/dashboard/data', async (req, res) => {
//     try {
//         const [depts] = await db.query('SELECT * FROM departments');
//         const [teachers] = await db.query('SELECT id, teacherName, email, phone, dept_id, qualification, experience FROM teachers WHERE status = "Active"');
//         const [pending] = await db.query('SELECT * FROM teachers WHERE status = "Pending"');
//         const [students] = await db.query('SELECT * FROM students');
//         const [batches] = await db.query('SELECT * FROM batches');
//         const [subjects] = await db.query('SELECT * FROM subjects');

//         res.json({ 
//             departments: depts || [], 
//             teachers: teachers || [], 
//             pendingTeachers: pending || [], 
//             students: students || [], 
//             batches: batches || [], 
//             subjects: subjects || [] 
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

// // --- 3. TEACHER MANAGEMENT ---
// // app.post('/api/register/teacher', async (req, res) => {
// //     try {
// //         const { teacherName, email, phone, dept, qualification, experience, username, password } = req.body;
// //         const sql = `INSERT INTO teachers (teacherName, email, phone, dept_id, qualification, experience, username, password, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Active')`;
// //         const [result] = await db.query(sql, [teacherName, email, phone, dept, qualification, experience, username, password]);
// //         res.json({ success: true, id: result.insertId });
// //     } catch (err) { res.status(500).json({ success: false, error: err.message }); }
// // });

// app.post('/api/register/teacher', async (req, res) => {
//     try {
//         const { teacherName, email, phone, dept, qualification, experience, username, password } = req.body;

//         // Log to terminal so you can see the data arriving
//         console.log("Processing registration for:", teacherName);

//         const sql = `INSERT INTO teachers 
//             (teacherName, email, phone, dept_id, qualification, experience, username, password, status) 
//             VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Active')`;
        
//         // Using || fallbacks ensures the query doesn't fail if data is missing
//         const [result] = await db.query(sql, [
//             teacherName || 'New Teacher', 
//             email, 
//             phone || 'N/A', 
//             dept || 'General', 
//             qualification || 'N/A', 
//             experience || 0, 
//             username, 
//             password,
//         ]);

//         res.json({ success: true, id: result.insertId });
//     } catch (err) {
//         // This will print the EXACT reason for the 500 error in your terminal
//         console.error("❌ SQL INSERT FAILURE:", err.message);
//         res.status(500).json({ success: false, error: err.message });
//     }
// });


// app.delete('/api/teachers/:id', async (req, res) => {
//     try {
//         await db.query('DELETE FROM teachers WHERE id = ?', [req.params.id]);
//         res.json({ success: true });
//     } catch (err) { res.status(500).json({ error: err.message }); }
// });

// // --- 4. STUDENT & BATCH MANAGEMENT ---
// // app.post('/api/students', async (req, res) => {
// //     try {
// //         const { name, enrollmentNo, email, phone, batchId } = req.body;
// //         const sql = `INSERT INTO students (name, enrollmentNo, email, phone, batchId, status) VALUES (?, ?, ?, ?, ?, 'Active')`;
// //         await db.query(sql, [name, enrollmentNo, email, phone, batchId]);
// //         res.json({ success: true });
// //     } catch (err) { res.status(500).json({ error: err.message }); }
// // });

// app.post('/api/students', async (req, res) => {
//     try {
//         const { name, enrollmentNo, email, phone, batchId } = req.body;

//         console.log("Adding Student:", name);

//         const sql = `INSERT INTO students 
//             (name, enrollmentNo, email, phone, batchId, status) 
//             VALUES (?, ?, ?, ?, ?, 'Active')`;
        
//         const [result] = await db.query(sql, [
//             name || 'New Student',
//             enrollmentNo, // Must be unique
//             email,        // Must be unique
//             phone || '',
//             batchId || 'Default'
//         ]);

//         res.json({ success: true, id: result.insertId });
//     } catch (err) {
//         console.error("❌ STUDENT INSERT ERROR:", err.message);
//         res.status(500).json({ success: false, error: err.message });
//     }
// });

// app.post('/api/batches', async (req, res) => {
//     try {
//         const { dept, batch, hod, year } = req.body;
//         await db.query('INSERT INTO batches (dept, batch, hod, year) VALUES (?, ?, ?, ?)', [dept, batch, hod, year]);
//         res.json({ success: true });
//     } catch (err) { res.status(500).json({ error: err.message }); }
// });

// // --- 5. DEPARTMENT & SUBJECT MANAGEMENT ---
// app.post('/api/departments', async (req, res) => {
//     try {
//         const { name, code, hod } = req.body;
//         await db.query('INSERT INTO departments (name, code, hod) VALUES (?, ?, ?)', [name, code, hod]);
//         res.json({ success: true });
//     } catch (err) { res.status(500).json({ error: err.message }); }
// });

// app.delete('/api/departments/:id', async (req, res) => {
//     try {
//         await db.query('DELETE FROM departments WHERE id = ?', [req.params.id]);
//         res.json({ success: true });
//     } catch (err) { res.status(500).json({ error: err.message }); }
// });

// app.post('/api/subjects', async (req, res) => {
//     try {
//         const { name, code, semester, credits, dept_id, teacher_id } = req.body;

//         const sql = `INSERT INTO subjects 
//             (name, code, semester, credits, dept_id, teacher_id) 
//             VALUES (?, ?, ?, ?, ?, ?)`;
        
//         const [result] = await db.query(sql, [
//             name, 
//             code, 
//             semester, 
//             credits, 
//             dept_id, 
//             teacher_id || null // Link the teacher here
//         ]);

//         res.json({ success: true, id: result.insertId });
//     } catch (err) {
//         console.error("❌ SUBJECT INSERT ERROR:", err.message);
//         res.status(500).json({ success: false, error: err.message });
//     }
// });

// app.listen(5000, () => console.log('🚀 Server is 100% Ready on http://localhost:5000'));









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
// This powers ALL pages. It translates DB column names to React names.
app.get('/api/dashboard/data', async (req, res) => {
    try {
        const [depts] = await db.query('SELECT * FROM departments');
        
        // Alias teacherName -> name for React component logic
        const [teachers] = await db.query(`
            SELECT id, teacherName as name, email, phone, dept_id, qualification, experience 
            FROM teachers WHERE status = "Active"
        `);
        
        // Alias dept_id -> courseId for SubjectsManagement
        const [subjects] = await db.query(`
            SELECT id, name, code, semester, credits, dept_id as courseId FROM subjects
        `);
        
        const [assignments] = await db.query('SELECT * FROM teacher_assignments');
        const [students] = await db.query('SELECT * FROM students');
        const [batches] = await db.query('SELECT * FROM batches');

        res.json({ 
            departments: depts || [], 
            teachers: teachers || [], 
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

// --- 2. DEPARTMENT MANAGEMENT ---
app.post('/api/departments', async (req, res) => {
    try {
        const { name, code, hod } = req.body;
        const [result] = await db.query('INSERT INTO departments (name, code, hod) VALUES (?, ?, ?)', [name, code, hod]);
        res.json({ success: true, id: result.insertId });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

// --- 3. TEACHER MANAGEMENT ---
app.post('/api/register/teacher', async (req, res) => {
    try {
        const { teacherName, email, phone, dept, qualification, experience, username, password } = req.body;
        const sql = `INSERT INTO teachers (teacherName, email, phone, dept_id, qualification, experience, username, password, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Active')`;
        const [result] = await db.query(sql, [teacherName, email, phone, dept, qualification, experience, username, password]);
        res.json({ success: true, id: result.insertId });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

// --- 4. SUBJECTS & ASSIGNMENTS ---
app.post('/api/subjects', async (req, res) => {
    try {
        const { name, code, semester, credits, courseId } = req.body;
        const sql = `INSERT INTO subjects (name, code, semester, credits, dept_id) VALUES (?, ?, ?, ?, ?)`;
        const [result] = await db.query(sql, [name, code, semester, credits, courseId]);
        res.json({ success: true, id: result.insertId });
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

app.listen(5000, () => console.log('🚀 SYSTEM READY ON http://localhost:5000'));