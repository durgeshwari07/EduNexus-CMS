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

// --- 4. 🔐 AUTHENTICATION & REGISTRATION ---

// ADMIN REGISTRATION
app.post('/api/auth/register/admin', async (req, res) => {
    const { username, password, email, collegeName } = req.body;
    try {
        const hash = await bcrypt.hash(password, 10);
        const sql = `INSERT INTO admins (username, password, email, collegeName) VALUES (?, ?, ?, ?)`;
        await db.query(sql, [username, hash, email.toLowerCase(), collegeName]);
        
        const [rows] = await db.query("SELECT id, username, email, collegeName FROM admins WHERE username=?", [username]);
        res.json({ success: true, user: rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

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

app.post('/api/auth/approve-teacher/:id', authenticateToken, async (req, res) => {
    const teacherId = req.params.id;
    try {
        const [result] = await db.query("UPDATE teachers SET status = 'Active' WHERE id = ?", [teacherId]);
        if (result.affectedRows === 0) return res.status(404).json({ success: false, message: "Teacher not found" });
        res.json({ success: true, message: "Teacher approved and activated" });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

// --- 5. 🎓 STUDENT & BATCH MANAGEMENT ---

// ADD NEW BATCH


app.post('/api/batches', authenticateToken, async (req, res) => {
    const { dept_id, batch, year, semester, status } = req.body;
    
    let connection;
    try {
        connection = await db.getConnection(); 
        await connection.beginTransaction();

        // 1️⃣ Step 1: Create the new batch entry
        // This generates a new unique ID (e.g., Batch 24)
        const [result] = await connection.query(
            `INSERT INTO batches (dept_id, batch, year, semester, status) VALUES (?, ?, ?, ?, ?)`,
            [dept_id, batch, year || 'Year 1', semester || 1, status || 'Active']
        );
        const newBatchId = result.insertId;

        // 2️⃣ Step 2: Fetch the curriculum "template" for this department and semester
        // We fetch 'type' so the gradebook knows which subjects are Major or Minor
        const [subjects] = await connection.query(
            `SELECT id, type FROM subjects WHERE dept_id = ? AND semester = ?`,
            [dept_id, semester || 1]
        );

        // 3️⃣ Step 3: Initialize the unique gradebook for THIS batch
        // By inserting into subject_offerings with the newBatchId, we isolate this 
        // batch from older ones like Batch 23
        if (subjects.length > 0) {
            const offeringValues = subjects.map(sub => [
                sub.id, 
                newBatchId, 
                semester || 1, 
                sub.type // Critical: Keeps MAJOR/MINOR logic isolated per batch
            ]);

            await connection.query(
                `INSERT INTO subject_offerings (subject_id, batch_id, semester, type) VALUES ?`,
                [offeringValues]
            );
        }

        await connection.commit();
        res.json({ 
            success: true, 
            message: `Batch ${batch} created. Gradebook initialized for ${subjects.length} subjects! ✅`,
            batchId: newBatchId 
        });

    } catch (err) {
        if (connection) await connection.rollback();
        console.error("Batch Creation Error:", err);
        res.status(500).json({ success: false, error: err.message });
    } finally {
        if (connection) connection.release();
    }
});


// app.post('/api/batches', authenticateToken, async (req, res) => {
//     const { dept_id, batch, year, semester, status } = req.body;
//     const connection = await db.getConnection(); // Use a connection for transactions
//     try {
//         await connection.beginTransaction();

//         // 1️⃣ Insert the batch
//         const [result] = await connection.query(
//             `INSERT INTO batches (dept_id, batch, year, semester, status) VALUES (?, ?, ?, ?, ?)`,
//             [dept_id, batch, year || 'Year 1', semester || 1, status || 'Active']
//         );
//         const newBatchId = result.insertId;

//         // 2️⃣ Find subjects that match this department and semester
//         const [subjects] = await connection.query(
//             `SELECT id FROM subjects WHERE dept_id = ? AND semester = ?`,
//             [dept_id, semester || 1]
//         );

//         // 3️⃣ Insert into subject_offerings
//         if (subjects.length > 0) {
//             const offeringValues = subjects.map(sub => [sub.id, newBatchId, semester || 1]);
//             await connection.query(
//                 `INSERT INTO subject_offerings (subject_id, batch_id, semester) VALUES ?`,
//                 [offeringValues]
//             );
//         }

//         await connection.commit();
//         res.json({ success: true, message: "Batch created and subjects linked!" });
//     } catch (err) {
//         await connection.rollback();
//         res.status(500).json({ success: false, error: err.message });
//     } finally {
//         connection.release();
//     }
// });

// UPDATE BATCH (Promotion & Editing)





// DELETE BATCH


app.put('/api/batches/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { batch, dept_id, semester, status } = req.body;

    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        // 1️⃣ Update batch
        await connection.query(
            `UPDATE batches 
             SET batch=?, dept_id=?, semester=?, status=? 
             WHERE id=?`,
            [batch, dept_id, semester, status, id]
        );

        // 2️⃣ Update all students semester
        await connection.query(
            `UPDATE students 
             SET semester=? 
             WHERE batchId=?`,
            [semester, id]
        );

        


        // ... inside your batch promotion route
const [subjects] = await connection.query(
    `SELECT id, type FROM subjects WHERE dept_id=? AND semester=?`,
    [dept_id, semester]
);

for (let subject of subjects) {
    await connection.query(
        `INSERT INTO subject_offerings (subject_id, batch_id, semester, type)
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE type = VALUES(type)`,
        [subject.id, id, semester, subject.type]
    );
}



        await connection.commit();
        res.json({ success: true, message: "Batch promoted safely ✅" });

    } catch (err) {
        await connection.rollback();
        res.status(500).json({ success: false, error: err.message });
    } finally {
        connection.release();
    }
});

app.delete('/api/batches/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
        const [students] = await db.query("SELECT id FROM students WHERE batchId = ?", [id]);
        if (students.length > 0) return res.status(400).json({ success: false, message: "Cannot delete batch with enrolled students" });
        await db.query('DELETE FROM batches WHERE id = ?', [id]);
        res.json({ success: true, message: "Batch deleted" });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});




app.post('/api/students', authenticateToken, async (req, res) => {
    const s = req.body;

    try {

        // 1️⃣ Get semester from batch
        const [batchData] = await db.query(
            `SELECT semester FROM batches WHERE id = ?`,
            [s.batchId]
        );

        if (batchData.length === 0) {
            return res.status(400).json({ error: "Invalid Batch ID" });
        }

        const batchSemester = batchData[0].semester;

        // 2️⃣ Insert student with batch semester
        const sql = `
            INSERT INTO students 
            (name, enrollmentNo, prNo, email, phone, semester, division, academicYear, dob, address, guardianName, guardianPhone, username, password, batchId, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Active')
        `;

        await db.query(sql, [
            s.name,
            s.enrollmentNo,
            s.prNo,
            s.email,
            s.phone,
            batchSemester,   // 🔥 AUTO semester
            s.division,
            s.academicYear,
            s.dob,
            s.address,
            s.guardianName,
            s.guardianPhone,
            s.username,
            s.password,
            s.batchId
        ]);

        res.json({ success: true });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



// DELETE STUDENT
app.delete('/api/students/:id', authenticateToken, async (req, res) => {
    try {
        await db.query('DELETE FROM students WHERE id = ?', [req.params.id]);
        res.json({ success: true, message: "Student record removed" });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

// --- 6. 📚 SUBJECTS & ASSIGNMENTS ---





app.post('/api/subjects', authenticateToken, async (req, res) => {
    // Destructure 'type' from the frontend request (e.g., 'MAJOR' or 'MINOR')
    const { name, code, semester, credits, courseId, type } = req.body;
    
    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        // 1️⃣ Insert the subject into the main subjects definition table
        // This stores the baseline information like code, credits, and default category type
        const [result] = await connection.query(
            `INSERT INTO subjects (name, code, semester, credits, dept_id, type) VALUES (?, ?, ?, ?, ?, ?)`,
            [name, code, semester, credits, courseId, type]
        );
        const newSubjectId = result.insertId;

        // 2️⃣ Find all batches in this department that are currently in this specific semester
        // We only link to batches that actually need this subject right now
        const [batches] = await connection.query(
            `SELECT id FROM batches WHERE dept_id = ? AND semester = ?`,
            [courseId, semester]
        );

        // 3️⃣ Link this new subject to those batches in the offerings table
        if (batches.length > 0) {
            // CRITICAL UPDATE: We now explicitly include the 'type' (Category) here
            // This ensures that the ledger knows if it should be under MAJOR or MINOR headers
            const offeringValues = batches.map(b => [newSubjectId, b.id, semester, type]); 
            
            await connection.query(
                `INSERT INTO subject_offerings (subject_id, batch_id, semester, type) VALUES ?`,
                [offeringValues]
            );
        }

        await connection.commit();
        res.json({ 
            success: true, 
            message: `Subject '${name}' added and linked to ${batches.length} active batch(es)! ✅` 
        });

    } catch (err) {
        if (connection) await connection.rollback();
        console.error("Subject Addition Error:", err);
        res.status(500).json({ 
            success: false, 
            error: "Failed to add subject: " + err.message 
        });
    } finally {
        if (connection) connection.release();
    }
});


app.put('/api/subjects/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { name, code, semester, credits, courseId, type } = req.body;
    try {
        const sql = `UPDATE subjects SET name=?, code=?, semester=?, credits=?, dept_id=?, type=? WHERE id=?`;
        await db.query(sql, [name, code, semester, credits, courseId, type, id]);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/subjects/:id', authenticateToken, async (req, res) => {
    try {
        await db.query('DELETE FROM subjects WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/assign-teacher', authenticateToken, async (req, res) => {
    const { teacherId, subjectId, academicYearId } = req.body;
    try {
        const sql = `INSERT INTO teacher_assignments (teacherId, subjectId, academicYearId) VALUES (?, ?, ?)`;
        await db.query(sql, [teacherId, subjectId, academicYearId]);
        res.json({ success: true, message: "Teacher assigned successfully" });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

// --- 7. 📊 DATA & GRADEBOOK ---

// app.get('/api/dashboard/data', authenticateToken, async (req, res) => {
//     try {
//         const [depts] = await db.query('SELECT * FROM departments');
//         const [teachers] = await db.query(`SELECT t.*, CONCAT(t.first_name, ' ', t.last_name) as name, d.name as deptName FROM teachers t LEFT JOIN departments d ON t.dept_id = d.id WHERE t.status = "Active"`);
//         const [pending] = await db.query(`SELECT t.*, CONCAT(t.first_name, ' ', t.last_name) as name, d.name as deptName FROM teachers t LEFT JOIN departments d ON t.dept_id = d.id WHERE t.status = "Pending"`);
//         const [students] = await db.query('SELECT * FROM students');
//         // const [batches] = await db.query(`SELECT b.*, d.id as dept_id FROM batches b LEFT JOIN departments d ON b.dept = d.name`);
//         const [batches] = await db.query(`SELECT b.*, d.name as deptName FROM batches b LEFT JOIN departments d ON b.dept_id = d.id`);
//         // const [subjects] = await db.query(`SELECT id, name, code, semester, credits, dept_id as courseId, batchId, type FROM subjects`);
//         // const [subjects] = await db.query(`SELECT id, name, code, semester, credits, dept_id as courseId, type FROM subjects`);
//         // Inside app.get('/api/dashboard/data', ...)
// const [subjects] = await db.query(`
//     SELECT 
//         s.*, 
//         so.batch_id, 
//         so.semester as offering_semester,
//         b.batch as batch_name
//     FROM subjects s
//     LEFT JOIN subject_offerings so ON s.id = so.subject_id
//     LEFT JOIN batches b ON so.batch_id = b.id
// `);
//         const [assignments] = await db.query(`SELECT ta.*, s.name as subjectName FROM teacher_assignments ta JOIN subjects s ON ta.subjectId = s.id`);
//         res.json({ departments: depts, teachers, pendingTeachers: pending, students, batches, subjects, teacherAssignments: assignments });
//     } catch (err) { res.status(500).json({ error: err.message }); }
// });


app.get('/api/dashboard/data', authenticateToken, async (req, res) => {
    try {
        const [depts] = await db.query('SELECT * FROM departments');
        const [teachers] = await db.query(`SELECT t.*, CONCAT(t.first_name, ' ', t.last_name) as name, d.name as deptName FROM teachers t LEFT JOIN departments d ON t.dept_id = d.id WHERE t.status = "Active"`);
        const [pending] = await db.query(`SELECT t.*, CONCAT(t.first_name, ' ', t.last_name) as name, d.name as deptName FROM teachers t LEFT JOIN departments d ON t.dept_id = d.id WHERE t.status = "Pending"`);
        const [students] = await db.query('SELECT * FROM students');
        const [batches] = await db.query(`SELECT b.*, d.name as deptName FROM batches b LEFT JOIN departments d ON b.dept_id = d.id`);

        // --- FETCH MARKS (The Missing Piece) ---
        const [marks] = await db.query('SELECT * FROM marks');

        const [subjects] = await db.query(`
            SELECT 
                s.*, 
                so.batch_id, 
                so.semester as offering_semester,
                b.batch as batch_name
            FROM subjects s
            LEFT JOIN subject_offerings so ON s.id = so.subject_id
            LEFT JOIN batches b ON so.batch_id = b.id
        `);
        const [assignments] = await db.query(`SELECT ta.*, s.name as subjectName FROM teacher_assignments ta JOIN subjects s ON ta.subjectId = s.id`);

        // --- INCLUDE 'allMarks' IN THE JSON ---
        res.json({ 
            departments: depts, 
            teachers, 
            pendingTeachers: pending, 
            students, 
            batches, 
            subjects, 
            teacherAssignments: assignments,
            allMarks: marks // This must match the prop name in your BatchCard
        });
    } catch (err) { res.status(500).json({ error: err.message }); }
});


app.get('/api/subjects/by-batch/:batchId', authenticateToken, async (req, res) => {
    const { batchId } = req.params;

    try {
        const [subjects] = await db.query(`
            SELECT 
                s.id,
                s.name,
                s.code,
                s.credits,
                so.semester
            FROM subject_offerings so
            JOIN subjects s ON so.subject_id = s.id
            JOIN batches b ON so.batch_id = b.id
            WHERE so.batch_id = ?
            AND so.semester = b.semester
        `, [batchId]);

        res.json({ success: true, subjects });

    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});


// DELETE GRADEBOOK ROUTE
app.delete('/api/faculty/delete-gradebook', authenticateToken, async (req, res) => {
    const { teacher_username, subject_id, batch_id } = req.body;
    
    // Validate required fields
    if (!teacher_username || !subject_id || !batch_id) {
        return res.status(400).json({ success: false, message: "Missing required identification fields" });
    }

    const query = `DELETE FROM faculty_gradebooks WHERE teacher_username = ? AND subject_id = ? AND batch_id = ?`;

    try {
        const [result] = await db.execute(query, [teacher_username, subject_id, batch_id]);
        
        if (result.affectedRows > 0) {
            res.json({ success: true, message: "Gradebook deleted successfully" });
        } else {
            res.status(404).json({ success: false, message: "No matching gradebook found to delete" });
        }
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});




// app.post('/api/faculty/sync-gradebook', authenticateToken, async (req, res) => {
//     // Destructure all fields with default values to prevent 'undefined' bind errors
//     const { 
//         teacher_id, 
//         teacher_username, 
//         subject_id, 
//         batch_id, 
//         name, 
//         batchName, 
//         academicYear, 
//         isaMax = 10, 
//         semMax = 70, 
//         hasPractical = 0, 
//         practicalMax = 0, 
//         selectedISAs = [], 
//         students = [] 
//     } = req.body;

//     // Use the exact column names from your database schema
//     const query = `INSERT INTO faculty_gradebooks 
//         (teacher_id, teacher_username, subject_id, batch_id, subject_name, batch_name, academic_year, isa_max, sem_max, has_practical, practical_max, selected_isas, students_data) 
//         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) 
//         ON DUPLICATE KEY UPDATE 
//         isa_max = VALUES(isa_max),
//         sem_max = VALUES(sem_max),
//         has_practical = VALUES(has_practical),
//         practical_max = VALUES(practical_max),
//         selected_isas = VALUES(selected_isas),
//         students_data = VALUES(students_data), 
//         updated_at = CURRENT_TIMESTAMP`;

//     try {
//         await db.execute(query, [
//             teacher_id || null, 
//             teacher_username || null, 
//             subject_id || null, 
//             batch_id || null, 
//             name || null, 
//             batchName || null, 
//             academicYear || null, 
//             isaMax, 
//             semMax, 
//             hasPractical ? 1 : 0, 
//             practicalMax, 
//             Array.isArray(selectedISAs) ? selectedISAs.join(',') : '', 
//             JSON.stringify(students)
//         ]);
//         res.json({ success: true });
//     } catch (err) { 
//         console.error("SQL Error:", err.message);
//         res.status(500).json({ error: err.message }); 
//     }
// });



app.post('/api/faculty/sync-gradebook', authenticateToken, async (req, res) => {
    // Destructure fields from the request
    const { 
        teacher_id, 
        teacher_username, 
        subject_id, 
        batch_id, 
        name, 
        batchName,      // This is the label like "2026-2029"
        isaMax = 10, 
        semMax = 70, 
        hasPractical = 0, 
        practicalMax = 0, 
        selectedISAs = [], 
        students = [] 
    } = req.body;

    // 1️⃣ LOGIC: Synchronize Academic Year with Batch Name
    // We extract the start year (e.g., 2026) and build the year string "2026-2027"
    let calculatedAcademicYear = null;
    if (batchName && batchName.includes('-')) {
        const startYear = parseInt(batchName.split('-')[0]);
        calculatedAcademicYear = `${startYear}-${startYear + 1}`;
    }

    // 2️⃣ SQL QUERY: Use exact column names from your schema
    const query = `INSERT INTO faculty_gradebooks 
        (teacher_id, teacher_username, subject_id, batch_id, subject_name, batch_name, academic_year, isa_max, sem_max, has_practical, practical_max, selected_isas, students_data) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) 
        ON DUPLICATE KEY UPDATE 
        academic_year = VALUES(academic_year),
        isa_max = VALUES(isa_max),
        sem_max = VALUES(sem_max),
        has_practical = VALUES(has_practical),
        practical_max = VALUES(practical_max),
        selected_isas = VALUES(selected_isas),
        students_data = VALUES(students_data), 
        updated_at = CURRENT_TIMESTAMP`;

    try {
        await db.execute(query, [
            teacher_id || null, 
            teacher_username || null, 
            subject_id || null, 
            batch_id || null, 
            name || null, 
            batchName || null, 
            calculatedAcademicYear, // Forced synchronization
            isaMax, 
            semMax, 
            hasPractical ? 1 : 0, 
            practicalMax, 
            Array.isArray(selectedISAs) ? selectedISAs.join(',') : '', 
            JSON.stringify(students)
        ]);
        
        res.json({ 
            success: true, 
            syncedYear: calculatedAcademicYear,
            message: "Gradebook metadata synchronized with Batch Year ✅" 
        });
    } catch (err) { 
        console.error("SQL Error:", err.message);
        res.status(500).json({ error: err.message }); 
    }
});



app.get('/api/faculty/get-gradebooks/:username', authenticateToken, async (req, res) => {
    try {
        const [results] = await db.query("SELECT * FROM faculty_gradebooks WHERE teacher_username = ?", [req.params.username]);
        const formatted = results.map(row => ({
            id: row.id, 
            subjectId: row.subject_id, 
            batchId: row.batch_id, 
            name: row.subject_name, 
            batchName: row.batch_name, 
            academicYear: row.academic_year, 
            isaMax: row.isa_max, // MAKE SURE THIS IS HERE
            semMax: row.sem_max, 
            hasPractical: !!row.has_practical, 
            practicalMax: row.practical_max, 
            selectedISAs: row.selected_isas ? row.selected_isas.split(',') : [], 
            students: row.students_data ? JSON.parse(row.students_data) : []
        }));
        res.json({ success: true, gradebooks: formatted });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

// Fetch students belonging to a specific batch for the Gradebook
app.get('/api/faculty/students-by-batch/:batchId', authenticateToken, async (req, res) => {
    const { batchId } = req.params;
    try {
        const [students] = await db.query(
            `SELECT id, name, enrollmentNo, prNo 
             FROM students 
             WHERE batchId = ? AND status = 'Active' 
             ORDER BY name ASC`, 
            [batchId]
        );
        
        if (students.length === 0) {
            return res.status(404).json({ success: false, message: "No active students found in this batch." });
        }
        
        res.json({ success: true, students });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});



// --- 8. 🎓 STUDENT PROFILES & LEDGERS ---



// app.post('/api/faculty/bulk-save-marks', authenticateToken, async (req, res) => {
//     const { marks } = req.body;
    
//     // 1️⃣ Uniform Filter: Only save data if marks are actually entered (> 0)
//     // This applies to Major, Minor, and Entitlement equally
//     const validMarks = (marks || []).filter(m => (
//         Number(m.total) > 0 || Number(m.theory) > 0 || 
//         Number(m.isa1) > 0 || Number(m.practical) > 0
//     ));

//     if (validMarks.length === 0) {
//         return res.status(200).json({ success: true, message: "No marks to save." });
//     }

//     let connection; 
//     try {
//         connection = await db.getConnection(); 
//         await connection.beginTransaction();

//         // 2️⃣ Master Lookup: Identify the subject's DNA (Major, Minor, or Entitlement)
//         // This ensures NCC is labeled as 'Entitlement' and Coding as 'Major'
//         const [subjectInfo] = await connection.query(
//             "SELECT type FROM subjects WHERE id = ?", [validMarks[0].subject_id]
//         );
//         const correctType = subjectInfo.length > 0 ? subjectInfo[0].type : 'Major';

//         const [batchRows] = await connection.query("SELECT batch, semester FROM batches WHERE id = ?", [validMarks[0].batchId]);
//         const startYear = parseInt(batchRows[0].batch.split('-')[0]); 
//         const activeAcademicYear = `${startYear}-${startYear + 1}`;

//         // 3️⃣ Map Values: All subjects use the same data structure
//         const values = validMarks.map(m => [
//             m.student_id, m.subject_id, m.batchId, batchRows[0].semester, activeAcademicYear,
//             correctType, // Standardized type field
//             m.isa1 || 0, m.isa2 || 0, m.isa3 || 0, m.theory || 0, m.practical || 0, 
//             m.total || 0, m.grade || 'F', m.result || 'Fail'
//         ]);

//         // 4️⃣ Unified Upsert: Updates marks if they exist, otherwise inserts new
//         const query = `
//             INSERT INTO marks 
//                 (student_id, subject_id, batchId, semester, academicYear, type, 
//                  isa1, isa2, isa3, theory, practical, total, grade, result) 
//             VALUES ? 
//             ON DUPLICATE KEY UPDATE 
//                 type = VALUES(type), total = VALUES(total), 
//                 grade = VALUES(grade), result = VALUES(result)`;

//         await connection.query(query, [values]);
//         await connection.commit();
//         res.json({ success: true, message: "All marks synced successfully! ✅" });
//     } catch (err) {
//         if (connection) await connection.rollback();
//         res.status(500).json({ error: err.message });
//     } finally {
//         if (connection) connection.release();
//     }
// });


app.post('/api/faculty/bulk-save-marks', authenticateToken, async (req, res) => {
    const { marks } = req.body;
    
    // 1️⃣ THE GATEKEEPER: Filter out any student with 0 total marks.
    // If a student didn't take NSS/NCC/Minor, we don't save a row at all.
    // This makes the subject "Not Belong" to them in the frontend.
    const validMarks = (marks || []).filter(m => (
        Number(m.total) > 0 || 
        Number(m.theory) > 0 || 
        Number(m.isa1) > 0 || 
        Number(m.practical) > 0
    ));

    if (validMarks.length === 0) {
        return res.status(200).json({ 
            success: true, 
            message: "No active marks found. No records were created or updated." 
        });
    }

    let connection; 

    try {
        connection = await db.getConnection(); 
        await connection.beginTransaction();

        // 2️⃣ LOOKUP: Get metadata from the Batches table for year calculation
        const [batchRows] = await connection.query(
            "SELECT batch, semester FROM batches WHERE id = ?", 
            [validMarks[0].batchId]
        );
        
        if (batchRows.length === 0) throw new Error("Target Batch not found.");

        const batchLabel = batchRows[0].batch; 
        const currentSem = batchRows[0].semester; 

        // 3️⃣ SUBJECT DNA: Pull the type (Major/Minor/Entitlement) from the master table.
        // This ensures NCC is always saved as 'Entitlement'.
        const [subjectInfo] = await connection.query(
            "SELECT type FROM subjects WHERE id = ?",
            [validMarks[0].subject_id]
        );
        const correctType = subjectInfo.length > 0 ? subjectInfo[0].type : 'Major';

        // 4️⃣ YEAR LOGIC: Calculate academic year based on batch start (e.g., "2026-2029")
        const startYear = parseInt(batchLabel.split('-')[0]); 
        const yearOffset = Math.floor((currentSem - 1) / 2);
        const activeAcademicYear = `${startYear + yearOffset}-${startYear + yearOffset + 1}`;

        // 5️⃣ PREPARE VALUES
        const values = validMarks.map(m => [
            m.student_id, 
            m.subject_id, 
            m.batchId, 
            currentSem,           
            activeAcademicYear,    
            correctType, 
            m.isa1 || 0, 
            m.isa2 || 0, 
            m.isa3 || 0, 
            m.theory || 0, 
            m.practical || 0, 
            m.total || 0, 
            m.grade || 'F', 
            m.result || 'Fail'
        ]);

        // 6️⃣ UNIFIED UPSERT
        const query = `
            INSERT INTO marks 
                (student_id, subject_id, batchId, semester, academicYear, type, 
                 isa1, isa2, isa3, theory, practical, total, grade, result) 
            VALUES ? 
            ON DUPLICATE KEY UPDATE 
                type = VALUES(type),
                academicYear = VALUES(academicYear),
                semester = VALUES(semester),
                total = VALUES(total),
                grade = VALUES(grade),
                result = VALUES(result)`;

        await connection.query(query, [values]);
        await connection.commit();

        res.json({ 
            success: true, 
            message: `Successfully synced ${validMarks.length} records! ✅` 
        });

    } catch (err) {
        if (connection) await connection.rollback();
        console.error("Bulk Save Error:", err);
        res.status(500).json({ success: false, message: "Database Error: " + err.message });
    } finally {
        if (connection) connection.release();
    }
});

// app.get('/api/student-profile/:id', async (req, res) => {
//     const studentId = req.params.id;
//     try {
//         const [profileRows] = await db.query(`SELECT name AS fullName, enrollmentNo AS enrollmentNumber, prNo AS prNumber, email, phone AS phoneNumber, semester, division, academicYear, DATE_FORMAT(dob, '%Y-%m-%d') AS dob, status FROM students WHERE id = ?`, [studentId]);
//         if (profileRows.length === 0) return res.status(404).json({ error: "No student found" });
//         const [marksRows] = await db.query(`SELECT s.code AS subjectCode, s.name AS subjectName, m.isa1 AS isaScore, m.theory AS theoryScore, m.practical AS practScore, m.total, m.grade FROM marks m JOIN subjects s ON m.subject_id = s.id WHERE m.student_id = ?`, [studentId]);
//         res.json({ profile: profileRows[0], marks: marksRows });
//     } catch (err) { res.status(500).json({ error: err.message }); }
// });



app.get('/api/student-profile/:id', async (req, res) => {
    const studentId = req.params.id;
    try {
        // 1. Fetch Profile Data
        const [profileRows] = await db.query(`
            SELECT 
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

        // 2. Fetch Marks Data (ADDED m.semester HERE)
        const [marksRows] = await db.query(`
            SELECT 
                s.code AS subjectCode, 
                s.name AS subjectName, 
                m.semester,      -- THIS IS CRITICAL for separating cards
                m.isa1 AS isaScore, 
                m.theory AS theoryScore, 
                m.practical AS practScore, 
                m.total, 
                m.grade 
            FROM marks m 
            JOIN subjects s ON m.subject_id = s.id 
            WHERE m.student_id = ?
            ORDER BY m.semester ASC`, // Sorting ensures cards appear in order
            [studentId]
        );

        res.json({ profile: profileRows[0], marks: marksRows });
    } catch (err) { 
        res.status(500).json({ error: err.message }); 
    }
});





app.get('/api/batch-results/:batchId', async (req, res) => {
    const { batchId } = req.params;

    try {
        // 1. Fetch Batch & Department Info
        const [batchRows] = await db.query(
            `SELECT b.*, d.name as courseName 
             FROM batches b 
             LEFT JOIN departments d ON b.dept_id = d.id 
             WHERE b.id = ?`,
            [batchId]
        );

        if (batchRows.length === 0) return res.status(404).json({ error: "Batch not found" });

        const batchInfo = {
            id: batchRows[0].id,
            name: batchRows[0].batch,
            course: batchRows[0].courseName,
            year: batchRows[0].year
        };

        // 2. Fetch All Students in this batch
        const [students] = await db.query(
            `SELECT id, name, enrollmentNo, prNo FROM students WHERE batchId = ?`,
            [batchId]
        );

        // 3. Fetch Marks with Subject Type and Code
        
        const [allMarks] = await db.query(
            `SELECT m.*, s.name as subjectName, s.code as subjectCode, s.credits
            FROM marks m
            JOIN subjects s ON m.subject_id = s.id
            WHERE m.batchId = ?`,
            [batchId]
        );

        const structuredStudents = students.map(student => {
            const studentMarks = allMarks.filter(m => m.student_id === student.id);
            const semMap = {};

            studentMarks.forEach(m => {
                const semester = m.semester || 1;
                if (!semMap[semester]) {
                    semMap[semester] = { sem: semester, subjects: [], sgpa: 0, grade: 'F' };
                }

                semMap[semester].subjects.push({
                    subject: m.subjectName,
                    code: m.subjectCode,
                    // PULL TYPE FROM MARKS TABLE: This ensures the frontend groupings work
                    type: (m.type || 'major').toLowerCase(), 
                    isa: (m.isa1 || 0) + (m.isa2 || 0) + (m.isa3 || 0),
                    esa: m.theory || 0,
                    practical: m.practical || 0,
                    tot: m.total || 0,
                    grd: m.grade || 'F'
                });
            });

            // Calculate SGPA for each semester
            Object.values(semMap).forEach(sem => {
                let totalPoints = 0;
                let totalCredits = 0;
                const gradePoints = { 'O': 10, 'A+': 9, 'A': 8, 'B+': 7, 'B': 6, 'C': 5, 'P': 4, 'F': 0 };

                sem.subjects.forEach(s => {
                    const points = gradePoints[s.grd] || 0;
                    const credits = 4; // Or s.credits if available in DB
                    totalPoints += (points * credits);
                    totalCredits += credits;
                });

                sem.sgpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0.00";
                sem.grade = sem.sgpa >= 4 ? 'P' : 'F';
            });

            const semesters = Object.values(semMap).sort((a, b) => a.sem - b.sem);
            const backlogs = studentMarks.filter(m => m.grade === 'F').length;
            const latestSGPA = semesters.length > 0 ? semesters[semesters.length - 1].sgpa : "0.00";

            return {
                ...student,
                semesters,
                summary: {
                    backlogs,
                    lastSGPA: latestSGPA,
                    cgpa: latestSGPA, // Simplified for this view
                    status: backlogs === 0 ? 'PASS' : 'ATKT'
                }
            };
        });

        // 4. Batch Stats
        const total = students.length;
        const passed = structuredStudents.filter(s => s.summary.status === 'PASS').length;

        res.json({
            batchInfo,
            students: structuredStudents,
            stats: {
                totalStudents: total,
                avgCgpa: "7.86", // You can calculate actual average here
                passPercentage: total > 0 ? ((passed / total) * 100).toFixed(1) : 0
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to compile result ledger" });
    }
});





app.post('/api/departments', authenticateToken, async (req, res) => {
    const { name, code, hod } = req.body;
    try {
        await db.query('INSERT INTO departments (name, code, hod) VALUES (?, ?, ?)', [name, code, hod]);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/departments/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
        const [linkedSubjects] = await db.query('SELECT id FROM subjects WHERE dept_id = ?', [id]);
        if (linkedSubjects.length > 0) return res.status(400).json({ success: false, message: "Delete linked subjects first." });
        await db.query('DELETE FROM departments WHERE id = ?', [id]);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});




//reprt page(teacher-workload)
app.get('/api/teacher-workload', async (req, res) => {
  try {
    const sql = `
      SELECT 
        t.id,
        CONCAT(t.first_name, ' ', t.last_name) AS name,
        SUM(CASE WHEN s.type = 'Major' THEN 1 ELSE 0 END) AS majorCount,
        SUM(CASE WHEN s.type = 'Elective' THEN 1 ELSE 0 END) AS electiveCount,
        SUM(CASE WHEN s.type = 'Lab' THEN 1 ELSE 0 END) AS labCount,
        SUM(CASE WHEN s.type = 'Seminar' THEN 1 ELSE 0 END) AS seminarCount
      FROM teacher_assignments ta
      JOIN teachers t ON ta.teacherId = t.id
      JOIN subjects s ON ta.subjectId = s.id
      GROUP BY t.id
    `;

    const [rows] = await db.query(sql);   // ✅ FIXED
    res.json(rows);                       // ✅ SEND ONLY ROWS

  } catch (err) {
    console.error("Workload Error:", err);
    res.status(500).json({ error: err.message });
  }
});


app.get('/api/top-subjects', async (req, res) => {
    try {
        // We select from 'subjects' first to ensure we see them even with 0 marks
        const sql = `
            SELECT 
                s.name, 
                s.id,
                COALESCE(ROUND(AVG(m.total), 1), 0) as percentage
            FROM subjects s
            LEFT JOIN marks m ON s.id = m.subject_id
            GROUP BY s.id, s.name
            ORDER BY percentage DESC, s.name ASC
            LIMIT 3
        `;
        
        const result = await db.query(sql);

        // This handles the mysql2 structure [rows, fields] 
        // while also handling the standard array structure
        const rows = Array.isArray(result[0]) ? result[0] : (Array.isArray(result) ? result : []);

        console.log(`Successfully fetched ${rows.length} subjects for Dashboard`);
        res.json(rows);
    } catch (err) {
        console.error("Database Error in /api/top-subjects:", err);
        res.status(500).json({ error: "Internal Server Error", details: err.message });
    }
});



// Route to get result distribution for the Pie Chart
app.get('/api/result-distribution', async (req, res) => {
    try {
        // 1. Fetch the raw counts grouped by the 'result' ENUM from the 'marks' table
        const sql = `SELECT result, COUNT(*) as count FROM marks GROUP BY result`;
        const [rows] = await db.query(sql);

        // 2. Calculate the total number of records to determine percentages
        const total = rows.reduce((sum, row) => sum + row.count, 0);

        // 3. Map the database values to the exact labels expected by your frontend logic
        const distribution = rows.map(row => {
            let label = 'Suppl.'; // Default for 'Pending'
            if (row.result === 'Pass') label = 'Passed';
            if (row.result === 'Fail') label = 'Failed';

            return {
                label: label,
                count: row.count,
                // Ensure this is a Number, not a string, to avoid 0% chart issues
                percentage: total > 0 ? parseFloat(((row.count / total) * 100).toFixed(1)) : 0
            };
        });

        // 4. Find the specific percentage for the "Overall Pass" center text
        const overallPass = distribution.find(d => d.label === 'Passed')?.percentage || 0;

        // 5. Send the structured response
        res.json({
            success: true,
            totalStudents: total,
            overallPassRate: overallPass,
            data: distribution
        });

    } catch (err) {
        console.error("Backend Error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});






app.get('/api/analytics/holistic-stats', async (req, res) => {
    const { year } = req.query; // Expects ?year=2023-2024

    try {
        // 1. Average Academic Score for the whole year
        const [acad] = await db.query(
            'SELECT ROUND(AVG(total), 0) as avg_score FROM marks WHERE academicYear = ?', 
            [year]
        );
        
        // 2. Average Extracurriculars for students in that year
        const [extra] = await db.query(`
            SELECT 
                ROUND(AVG(ncc_score), 0) as ncc_avg, 
                ROUND(AVG(sports_score), 0) as sports_avg, 
                ROUND(AVG(nss_score), 0) as nss_avg 
            FROM students 
            WHERE academicYear = ?`, 
            [year]
        );

        const stats = extra[0];
        const academic = acad[0].avg_score || 0;

        // Structured for your frontend .map() loop
        res.json([
            { label: 'Avg Academic', val: `${academic}%`, color: 'bg-blue-500', icon: 'GraduationCap' },
            { label: 'NCC Participation', val: `${stats.ncc_avg || 0}%`, color: 'bg-indigo-500', icon: 'Users' },
            { label: 'Sports Score', val: `${stats.sports_avg || 0}%`, color: 'bg-cyan-500', icon: 'Trophy' },
            { label: 'NSS Contribution', val: `${stats.nss_avg || 0}%`, color: 'bg-slate-500', icon: 'Activity' },
        ]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



// --- 10. 🚪 SERVER START ---
app.listen(PORT, () => {
    console.log(`🚀 SERVER RUNNING ON: http://localhost:${PORT}`);
});