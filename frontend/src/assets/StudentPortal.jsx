


// // import React, { useState, useEffect } from 'react';
// // import { useNavigate, useParams } from 'react-router-dom';
// // import axios from 'axios';
// // import './StudentPortal.css';

// // const API_URL = 'http://localhost:5000/api';

// // const StudentPortal = ({ id: propId, isPreview = false }) => {
// //   const navigate = useNavigate();
// //   const { id: routeId } = useParams();
// //   const studentId = propId || routeId;

// //   const [data, setData] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);

// //   useEffect(() => {
// //     const fetchStudentData = async () => {
// //       try {
// //         setLoading(true);
// //         const res = await axios.get(`${API_URL}/student-profile/${studentId}`);
// //         setData(res.data);
// //       } catch (err) {
// //         console.error("Error fetching student data:", err);
// //         setError("Could not load student records. Ensure the backend is running.");
// //       } finally {
// //         setLoading(false);
// //       }
// //     };
// //     if (studentId) fetchStudentData();
// //   }, [studentId]);

// //   const getGradePoints = (grade) => {
// //     const pointsMap = { 'O': 10, 'A+': 9, 'A': 8, 'B+': 7, 'B': 6, 'C': 5, 'P': 4, 'F': 0 };
// //     return pointsMap[grade] || 0;
// //   };

// //   const calculateGrade = (score) => {
// //     if (score >= 90) return 'O'; if (score >= 80) return 'A+'; if (score >= 70) return 'A';
// //     if (score >= 60) return 'B+'; if (score >= 50) return 'B'; if (score >= 40) return 'P';
// //     return 'F';
// //   };

// //   if (loading) return <div className="p-10 text-center">Loading Student Records...</div>;
// //   if (error) return <div className="p-10 text-center text-red-500">{error}</div>;
// //   if (!data) return <div className="p-10 text-center">No student found.</div>;

// //   const { profile, marks = [], documents = [], sgpaHistory = [] } = data;

// //   const liveSGPA = marks.length > 0 
// //     ? (marks.reduce((sum, m) => sum + getGradePoints(m.grade || calculateGrade(m.total)), 0) / marks.length).toFixed(2)
// //     : "0.00";

// //   const allSGPAs = [...sgpaHistory.map(h => Number(h.sgpa)), Number(liveSGPA)].filter(val => val > 0);
// //   const liveCGPA = allSGPAs.length > 0 
// //     ? (allSGPAs.reduce((a, b) => a + b, 0) / allSGPAs.length).toFixed(2)
// //     : "0.00";

// //   return (
// //     <div className={`portal-root ${isPreview ? 'is-preview' : ''}`}>
// //       {!isPreview && (
// //         <nav className="navbar">
// //           <div className="logo">Uni<span>Desk</span></div>
// //           <div className="nav-right">
// //             <span className="nav-link">Help</span>
// //             <img src={`https://ui-avatars.com/api/?name=${profile.name}`} alt="User" className="admin-avatar" />
// //           </div>
// //         </nav>
// //       )}

// //       <div className="container">
// //         <header className="page-header">
// //           <div className="page-title-group">
// //             {!isPreview && (
// //               <div className="back-btn" onClick={() => navigate(-1)}>
// //                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
// //               </div>
// //             )}
// //             <div className="student-photo-container">
// //               <img src={`https://ui-avatars.com/api/?name=${profile.name}&background=random`} alt="Student" className="student-photo" />
// //             </div>
// //             <div className="page-title">
// //               <h1>{profile.fullName}</h1>
// //               <p>PRN: {profile.prNumber} | {profile.dept || 'Department'} | Semester: {profile.semester} </p>
// //             </div>
// //           </div>
// //         </header>

// //         {/* --- PERSONAL INFORMATION SECTION --- */}
// //         <section className="card">
// //           <div className="section-header">
// //             <div className="section-title">Personal Information</div>
// //           </div>
// //           <div className="form-grid">
// //             <div className="form-group full-width">
// //               <label>Full Name</label>
// //               <input type="text" className="form-input" value={profile.fullName || ''} readOnly />
// //             </div>
            
// //             <div className="form-group">
// //               <label>Enrollment Number</label>
// //               <input type="text" className="form-input" value={profile.enrollmentNumber || 'N/A'} readOnly />
// //             </div>

// //             <div className="form-group">
// //               <label>PR Number (Permanent Registration)</label>
// //               <input type="text" className="form-input" value={profile.prNumber || 'N/A'} readOnly />
// //             </div>

// //             <div className="form-group">
// //               <label>Email ID</label>
// //               <input type="text" className="form-input" value={profile.email || 'N/A'} readOnly />
// //             </div>

// //             <div className="form-group">
// //               <label>Phone Number</label>
// //               <input type="text" className="form-input" value={profile.phoneNumber || 'N/A'} readOnly />
// //             </div>

// //             <div className="form-group">
// //               <label>Date of Birth</label>
// //               <input type="text" className="form-input" value={profile.dob || '--/--/----'} readOnly />
// //             </div>

// //             <div className="form-group">
// //               <label>Academic Year</label>
// //               <input type="text" className="form-input" value={profile.academicYear || 'N/A'} readOnly />
// //             </div>

// //             <div className="form-group">
// //               <label>Semester</label>
// //               <input type="text" className="form-input" value={profile.semester || 'N/A'} readOnly />
// //             </div>

// //             <div className="form-group">
// //               <label>Division / Section</label>
// //               <input type="text" className="form-input" value={profile.division || 'N/A'} readOnly />
// //             </div>
// //           </div>
// //         </section>

// //         {/* Academic Record */}
// //         <section className="card">
// //           <div className="section-header">
// //             <div className="section-title">Academic Record</div>
// //           </div>
// //           <div className="table-wrapper">
// //             <table className="full-width-table">
// //               <thead>
// //                 <tr>
// //                   <th>Code</th>
// //                   <th>Subject Name</th>
// //                   <th>ISA</th>
// //                   <th>Theory</th>
// //                   <th>Practical</th>
// //                   <th>Total</th>
// //                   <th>Grade</th>
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {marks.length === 0 ? (
// //                   <tr><td colSpan="7" className="empty-table-msg">No marks found.</td></tr>
// //                 ) : (
// //                   marks.map((m, i) => (
// //                     <tr key={i}>
// //                       <td className="code-cell">{m.subjectCode}</td>
// //                       <td className="subject-cell">{m.subjectName}</td>
// //                       <td className="score-cell"><b>{m.isaScore}</b></td>
// //                       <td className="score-cell">{m.theoryScore}</td>
// //                       <td className="score-cell">{m.practScore || '--'}</td>
// //                       <td className="total-cell">{m.total}</td>
// //                       <td className="grade-cell">
// //                         <span className={`grade-badge ${m.grade === 'F' ? 'grade-red' : 'grade-green'}`}>
// //                           {m.grade || calculateGrade(m.total)}
// //                         </span>
// //                       </td>
// //                     </tr>
// //                   ))
// //                 )}
// //               </tbody>
// //             </table>
// //           </div>

// //           <div className="gpa-container">
// //             <div className="gpa-stat">
// //               <span className="gpa-label">Current SGPA</span>
// //               <span className="gpa-value">{liveSGPA}</span>
// //             </div>
// //             <div className="gpa-stat">
// //               <span className="gpa-label">Cumulative CGPA</span>
// //               <span className="gpa-value">{liveCGPA}</span>
// //             </div>
// //           </div>
// //         </section>

// //         {/* Documents */}
// //         <section className="card">
// //           <div className="section-header">
// //             <div className="section-title">Verified Documents</div>
// //           </div>
// //           <div className="doc-list">
// //             {documents.length === 0 ? (
// //               <div className="empty-docs">No documents found.</div>
// //             ) : (
// //               documents.map((doc, idx) => (
// //                 <div className="file-card" key={idx}>
// //                   <div className="file-info">
// //                     <div className="file-type type-pdf">{doc.type || 'PDF'}</div>
// //                     <div>
// //                       <div className="file-name">{doc.name}</div>
// //                       <div className="file-meta">{doc.uploadDate}</div>
// //                     </div>
// //                   </div>
// //                   <span className={`status-pill ${doc.status === 'Approved' ? 'status-ok' : 'status-wait'}`}>
// //                     {doc.status}
// //                   </span>
// //                 </div>
// //               ))
// //             )}
// //           </div>
// //         </section>
// //       </div>
// //     </div>
// //   );
// // };

// // export default StudentPortal;



// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import axios from 'axios';
// import './StudentPortal.css';

// const API_URL = 'http://localhost:5000/api';

// const StudentPortal = ({ id: propId, isPreview = false }) => {
//   const navigate = useNavigate();
//   const { id: routeId } = useParams();
//   const studentId = propId || routeId;

//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchStudentData = async () => {
//       try {
//         setLoading(true);
//         // Fetches profile (fullName, enrollmentNumber, prNumber, etc.) and current marks
//         const res = await axios.get(`${API_URL}/student-profile/${studentId}`);
//         setData(res.data);
//       } catch (err) {
//         console.error("Error fetching student data:", err);
//         setError("Could not load student records. Ensure the backend is running.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     if (studentId) fetchStudentData();
//   }, [studentId]);

//   const getGradePoints = (grade) => {
//     const pointsMap = { 'O': 10, 'A+': 9, 'A': 8, 'B+': 7, 'B': 6, 'C': 5, 'P': 4, 'F': 0 };
//     return pointsMap[grade] || 0;
//   };

//   const calculateGrade = (score) => {
//     if (score >= 90) return 'O'; if (score >= 80) return 'A+'; if (score >= 70) return 'A';
//     if (score >= 60) return 'B+'; if (score >= 50) return 'B'; if (score >= 40) return 'P';
//     return 'F';
//   };

//   if (loading) return <div className="p-10 text-center">Loading Student Records...</div>;
//   if (error) return <div className="p-10 text-center text-red-500">{error}</div>;
//   if (!data) return <div className="p-10 text-center">No student found.</div>;

//   const { profile, marks = [], documents = [], sgpaHistory = [] } = data;

//   // SGPA Calculation based on subjects linked to the current semester
//   const liveSGPA = marks.length > 0 
//     ? (marks.reduce((sum, m) => sum + getGradePoints(m.grade || calculateGrade(m.total)), 0) / marks.length).toFixed(2)
//     : "0.00";

//   const allSGPAs = [...sgpaHistory.map(h => Number(h.sgpa)), Number(liveSGPA)].filter(val => val > 0);
//   const liveCGPA = allSGPAs.length > 0 
//     ? (allSGPAs.reduce((a, b) => a + b, 0) / allSGPAs.length).toFixed(2)
//     : "0.00";

//   return (
//     <div className={`portal-root ${isPreview ? 'is-preview' : ''}`}>
//       {!isPreview && (
//         <nav className="navbar">
//           <div className="logo">Uni<span>Desk</span></div>
//           <div className="nav-right">
//             <span className="nav-link">Help</span>
//             <img src={`https://ui-avatars.com/api/?name=${profile.fullName}`} alt="User" className="admin-avatar" />
//           </div>
//         </nav>
//       )}

//       <div className="container">
//         <header className="page-header">
//           <div className="page-title-group">
//             {!isPreview && (
//               <div className="back-btn" onClick={() => navigate(-1)}>
//                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
//                   <path d="M19 12H5M12 19l-7-7 7-7"/>
//                 </svg>
//               </div>
//             )}
//             <div className="student-photo-container">
//               <img src={`https://ui-avatars.com/api/?name=${profile.fullName}&background=random`} alt="Student" className="student-photo" />
//             </div>
//             <div className="page-title">
//               <h1>{profile.fullName}</h1>
//               <p>PRN: {profile.prNumber} | Semester: {profile.semester} | {profile.status}</p>
//             </div>
//           </div>
//         </header>

//         {/* --- PERSONAL INFORMATION SECTION --- */}
//         <section className="card">
//           <div className="section-header">
//             <div className="section-title">Personal Information</div>
//           </div>
//           <div className="form-grid">
//             <div className="form-group full-width">
//               <label>Full Name</label>
//               <input type="text" className="form-input" value={profile.fullName || ''} readOnly />
//             </div>
            
//             <div className="form-group">
//               <label>Enrollment Number</label>
//               <input type="text" className="form-input" value={profile.enrollmentNumber || 'N/A'} readOnly />
//             </div>

//             <div className="form-group">
//               <label>PR Number</label>
//               <input type="text" className="form-input" value={profile.prNumber || 'N/A'} readOnly />
//             </div>

//             <div className="form-group">
//               <label>Email ID</label>
//               <input type="text" className="form-input" value={profile.email || 'N/A'} readOnly />
//             </div>

//             <div className="form-group">
//               <label>Phone Number</label>
//               <input type="text" className="form-input" value={profile.phoneNumber || 'N/A'} readOnly />
//             </div>

//             <div className="form-group">
//               <label>Date of Birth</label>
//               <input type="text" className="form-input" value={profile.dob || '--/--/----'} readOnly />
//             </div>

//             <div className="form-group">
//               <label>Academic Year</label>
//               <input type="text" className="form-input" value={profile.academicYear || 'N/A'} readOnly />
//             </div>

//             <div className="form-group">
//               <label>Semester</label>
//               <input type="text" className="form-input" value={profile.semester || 'N/A'} readOnly />
//             </div>

//             <div className="form-group">
//               <label>Division / Section</label>
//               <input type="text" className="form-input" value={profile.division || 'N/A'} readOnly />
//             </div>
//           </div>
//         </section>

//         {/* --- ACADEMIC RECORD SECTION --- */}
//         <section className="card">
//           <div className="section-header">
//             <div className="section-title">Academic Record (Semester {profile.semester})</div>
//           </div>
//           <div className="table-wrapper">
//             <table className="full-width-table">
//               <thead>
//                 <tr>
//                   <th style={{ width: '15%' }}>Code</th>
//                   <th style={{ width: '35%' }}>Subject Name</th>
//                   <th style={{ width: '10%' }}>ISA</th>
//                   <th style={{ width: '10%' }}>Theory</th>
//                   <th style={{ width: '10%' }}>Prac</th>
//                   <th style={{ width: '10%' }}>Total</th>
//                   <th style={{ width: '10%' }}>Grade</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {marks.length === 0 ? (
//                   <tr><td colSpan="7" className="empty-table-msg">No mark records found for current semester.</td></tr>
//                 ) : (
//                   marks.map((m, i) => (
//                     <tr key={i}>
//                       <td className="code-cell">{m.subjectCode}</td>
//                       <td className="subject-cell">{m.subjectName}</td>
//                       <td className="score-cell"><b>{m.isaScore}</b></td>
//                       <td className="score-cell">{m.theoryScore}</td>
//                       <td className="score-cell">{m.practScore || '--'}</td>
//                       <td className="total-cell">{m.total}</td>
//                       <td className="grade-cell">
//                         <span className={`grade-badge ${m.grade === 'F' ? 'grade-red' : 'grade-green'}`}>
//                           {m.grade || calculateGrade(m.total)}
//                         </span>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>

//           <div className="gpa-container">
//             <div className="gpa-stat">
//               <span className="gpa-label">Semester SGPA</span>
//               <span className="gpa-value">{liveSGPA}</span>
//             </div>
//             <div className="gpa-stat">
//               <span className="gpa-label">Cumulative CGPA</span>
//               <span className="gpa-value">{liveCGPA}</span>
//             </div>
//           </div>
//         </section>

//         {/* --- DOCUMENTS SECTION --- */}
//         <section className="card">
//           <div className="section-header">
//             <div className="section-title">Verified Documents</div>
//           </div>
//           <div className="doc-list">
//             {documents.length === 0 ? (
//               <div className="empty-docs">No documents found.</div>
//             ) : (
//               documents.map((doc, idx) => (
//                 <div className="file-card" key={idx}>
//                   <div className="file-info">
//                     <div className="file-type type-pdf">{doc.type || 'PDF'}</div>
//                     <div>
//                       <div className="file-name">{doc.name}</div>
//                       <div className="file-meta">{doc.uploadDate}</div>
//                     </div>
//                   </div>
//                   <span className={`status-pill ${doc.status === 'Approved' ? 'status-ok' : 'status-wait'}`}>
//                     {doc.status}
//                   </span>
//                 </div>
//               ))
//             )}
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// };

// export default StudentPortal;




// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import axios from 'axios';
// import './StudentPortal.css';

// const API_URL = 'http://localhost:5000/api';

// const StudentPortal = ({ id: propId, isPreview = false }) => {
//   const navigate = useNavigate();
//   const { id: routeId } = useParams();
//   const studentId = propId || routeId;

//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchStudentData = async () => {
//       try {
//         setLoading(true);
//         // Fetches student profile, grouped marks, and academic history
//         const res = await axios.get(`${API_URL}/student-profile/${studentId}`);
//         setData(res.data);
//       } catch (err) {
//         console.error("Error fetching student data:", err);
//         setError("Could not load student records. Ensure the backend is running.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     if (studentId) fetchStudentData();
//   }, [studentId]);

//   const getGradePoints = (grade) => {
//     const pointsMap = { 'O': 10, 'A+': 9, 'A': 8, 'B+': 7, 'B': 6, 'C': 5, 'P': 4, 'F': 0 };
//     return pointsMap[grade] || 0;
//   };

//   const calculateGrade = (score) => {
//     if (score >= 90) return 'O'; if (score >= 80) return 'A+'; if (score >= 70) return 'A';
//     if (score >= 60) return 'B+'; if (score >= 50) return 'B'; if (score >= 40) return 'P';
//     return 'F';
//   };

//   if (loading) return <div className="p-10 text-center">Loading Student Records...</div>;
//   if (error) return <div className="p-10 text-center text-red-500">{error}</div>;
//   if (!data) return <div className="p-10 text-center">No student found.</div>;

//   const { profile, marks = [], documents = [], sgpaHistory = [] } = data;

//   // --- LOGIC: GROUP MARKS BY SEMESTER FOR DYNAMIC CARDS ---
//   const groupedMarks = marks.reduce((acc, mark) => {
//     const sem = mark.semester || "Unknown"; 
//     if (!acc[sem]) acc[sem] = [];
//     acc[sem].push(mark);
//     return acc;
//   }, {});

//   // Sort semesters numerically so Sem 1 appears before Sem 2
//   const sortedSemesters = Object.keys(groupedMarks).sort((a, b) => a - b);

//   // GPA Calculations
//   const liveSGPA = marks.length > 0 
//     ? (marks.reduce((sum, m) => sum + getGradePoints(m.grade || calculateGrade(m.total)), 0) / marks.length).toFixed(2)
//     : "0.00";

//   const allSGPAs = [...sgpaHistory.map(h => Number(h.sgpa)), Number(liveSGPA)].filter(val => val > 0);
//   const liveCGPA = allSGPAs.length > 0 
//     ? (allSGPAs.reduce((a, b) => a + b, 0) / allSGPAs.length).toFixed(2)
//     : "0.00";

//   return (
//     <div className={`portal-root ${isPreview ? 'is-preview' : ''}`}>
//       {!isPreview && (
//         <nav className="navbar">
//           <div className="logo">Uni<span>Desk</span></div>
//           <div className="nav-right">
//             <span className="nav-link">Help</span>
//             <img src={`https://ui-avatars.com/api/?name=${profile.fullName}`} alt="User" className="admin-avatar" />
//           </div>
//         </nav>
//       )}

//       <div className="container">
//         <header className="page-header">
//           <div className="page-title-group">
//             {!isPreview && (
//               <div className="back-btn" onClick={() => navigate(-1)}>
//                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
//                   <path d="M19 12H5M12 19l-7-7 7-7"/>
//                 </svg>
//               </div>
//             )}
//             <div className="student-photo-container">
//               <img src={`https://ui-avatars.com/api/?name=${profile.fullName}&background=random`} alt="Student" className="student-photo" />
//             </div>
//             <div className="page-title">
//               <h1>{profile.fullName}</h1>
//               <p>PRN: {profile.prNumber} | Current Semester: {profile.semester} | {profile.status}</p>
//             </div>
//           </div>
//         </header>

//         {/* --- PERSONAL INFORMATION --- */}
//         <section className="card">
//           <div className="section-header">
//             <div className="section-title">Personal Information</div>
//           </div>
//           <div className="form-grid">
//             <div className="form-group full-width">
//               <label>Full Name</label>
//               <input type="text" className="form-input" value={profile.fullName || ''} readOnly />
//             </div>
//             <div className="form-group"><label>Enrollment No</label><input type="text" className="form-input" value={profile.enrollmentNumber || 'N/A'} readOnly /></div>
//             <div className="form-group"><label>PR Number</label><input type="text" className="form-input" value={profile.prNumber || 'N/A'} readOnly /></div>
//             <div className="form-group"><label>Email ID</label><input type="text" className="form-input" value={profile.email || 'N/A'} readOnly /></div>
//             <div className="form-group"><label>Phone Number</label><input type="text" className="form-input" value={profile.phoneNumber || 'N/A'} readOnly /></div>
//           </div>
//         </section>

//         {/* --- ACADEMIC RECORDS (DYNAMIC SEMESTER CARDS) --- */}
//         <div className="section-main-title" style={{ margin: '30px 0 15px 5px', fontWeight: 'bold', fontSize: '1.2rem', color: '#333' }}>
//             Academic Records
//         </div>

//         {sortedSemesters.length === 0 ? (
//           <section className="card">
//             <div className="empty-table-msg" style={{ padding: '30px', textAlign: 'center' }}>No academic records found.</div>
//           </section>
//         ) : (
//           sortedSemesters.map((sem) => (
//             <section className="card" key={sem} style={{ marginBottom: '30px' }}>
//               <div className="section-header" style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: '12px' }}>
//                 <div className="section-title" style={{ color: '#2563eb' }}>Semester {sem}</div>
//               </div>
//               <div className="table-wrapper">
//                 <table className="full-width-table">
//                   <thead>
//                     <tr>
//                       <th style={{ width: '15%' }}>CODE</th>
//                       <th style={{ width: '35%' }}>SUBJECT NAME</th>
//                       <th style={{ width: '10%' }}>ISA</th>
//                       <th style={{ width: '10%' }}>THEORY</th>
//                       <th style={{ width: '10%' }}>PRAC</th>
//                       <th style={{ width: '10%' }}>TOTAL</th>
//                       <th style={{ width: '10%' }}>GRADE</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {groupedMarks[sem].map((m, i) => (
//                       <tr key={i}>
//                         <td className="code-cell" style={{ fontWeight: '600' }}>{m.subjectCode}</td>
//                         <td className="subject-cell">{m.subjectName}</td>
//                         <td className="score-cell">{m.isaScore}</td>
//                         <td className="score-cell">{m.theoryScore}</td>
//                         <td className="score-cell">{m.practScore || '--'}</td>
//                         <td className="total-cell" style={{ color: '#2563eb', fontWeight: 'bold' }}>{m.total}</td>
//                         <td className="grade-cell">
//                           <span className={`grade-badge ${m.grade === 'F' ? 'grade-red' : 'grade-green'}`}>
//                             {m.grade || calculateGrade(m.total)}
//                           </span>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </section>
//           ))
//         )}

//         {/* --- GPA SUMMARY --- */}
//         <div className="gpa-container" style={{ marginBottom: '30px' }}>
//           <div className="gpa-stat">
//             <span className="gpa-label">CURRENT SGPA</span>
//             <span className="gpa-value">{liveSGPA}</span>
//           </div>
//           <div className="gpa-stat">
//             <span className="gpa-label">OVERALL CGPA</span>
//             <span className="gpa-value">{liveCGPA}</span>
//           </div>
//         </div>

//         {/* --- DOCUMENTS --- */}
//         <section className="card">
//           <div className="section-header">
//             <div className="section-title">Verified Documents</div>
//           </div>
//           <div className="doc-list">
//             {documents.length === 0 ? (
//               <div className="empty-docs">No documents found.</div>
//             ) : (
//               documents.map((doc, idx) => (
//                 <div className="file-card" key={idx}>
//                   <div className="file-info">
//                     <div className="file-type type-pdf">{doc.type || 'PDF'}</div>
//                     <div>
//                       <div className="file-name">{doc.name}</div>
//                       <div className="file-meta">{doc.uploadDate}</div>
//                     </div>
//                   </div>
//                   <span className={`status-pill ${doc.status === 'Approved' ? 'status-ok' : 'status-wait'}`}>
//                     {doc.status}
//                   </span>
//                 </div>
//               ))
//             )}
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// };

// export default StudentPortal;




import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './StudentPortal.css';

const API_URL = 'http://localhost:5000/api';

const StudentPortal = ({ id: propId, isPreview = false }) => {
  const navigate = useNavigate();
  const { id: routeId } = useParams();
  const studentId = propId || routeId;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true);
        // Fetches student profile, grouped marks, and academic history
        const res = await axios.get(`${API_URL}/student-profile/${studentId}`);
        setData(res.data);
      } catch (err) {
        console.error("Error fetching student data:", err);
        setError("Could not load student records. Ensure the backend is running.");
      } finally {
        setLoading(false);
      }
    };
    if (studentId) fetchStudentData();
  }, [studentId]);

  const getGradePoints = (grade) => {
    const pointsMap = { 'O': 10, 'A+': 9, 'A': 8, 'B+': 7, 'B': 6, 'C': 5, 'P': 4, 'F': 0 };
    return pointsMap[grade] || 0;
  };

  const calculateGrade = (score) => {
    if (score >= 90) return 'O'; if (score >= 80) return 'A+'; if (score >= 70) return 'A';
    if (score >= 60) return 'B+'; if (score >= 50) return 'B'; if (score >= 40) return 'P';
    return 'F';
  };

  if (loading) return <div className="p-10 text-center">Loading Student Records...</div>;
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;
  if (!data) return <div className="p-10 text-center">No student found.</div>;

  const { profile, marks = [], documents = [], sgpaHistory = [] } = data;

  // --- LOGIC: GROUP MARKS BY SEMESTER FOR DYNAMIC CARDS ---
  const groupedMarks = marks.reduce((acc, mark) => {
    const sem = mark.semester || "Unknown"; 
    if (!acc[sem]) acc[sem] = [];
    acc[sem].push(mark);
    return acc;
  }, {});

  // Sort semesters numerically so Sem 1 appears before Sem 2
  const sortedSemesters = Object.keys(groupedMarks).sort((a, b) => a - b);

  // GPA Calculations
  const liveSGPA = marks.length > 0 
    ? (marks.reduce((sum, m) => sum + getGradePoints(m.grade || calculateGrade(m.total)), 0) / marks.length).toFixed(2)
    : "0.00";

  const allSGPAs = [...sgpaHistory.map(h => Number(h.sgpa)), Number(liveSGPA)].filter(val => val > 0);
  const liveCGPA = allSGPAs.length > 0 
    ? (allSGPAs.reduce((a, b) => a + b, 0) / allSGPAs.length).toFixed(2)
    : "0.00";

  return (
    <div className={`portal-root ${isPreview ? 'is-preview' : ''}`}>
      {!isPreview && (
        <nav className="navbar">
          <div className="logo">Uni<span>Desk</span></div>
          <div className="nav-right">
            <span className="nav-link">Help</span>
            <img src={`https://ui-avatars.com/api/?name=${profile.fullName}`} alt="User" className="admin-avatar" />
          </div>
        </nav>
      )}

      <div className="container">
        <header className="page-header">
          <div className="page-title-group">
            {!isPreview && (
              <div className="back-btn" onClick={() => navigate(-1)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
              </div>
            )}
            <div className="student-photo-container">
              <img src={`https://ui-avatars.com/api/?name=${profile.fullName}&background=random`} alt="Student" className="student-photo" />
            </div>
            <div className="page-title">
              <h1>{profile.fullName}</h1>
              <p>PRN: {profile.prNumber} | Current Semester: {profile.semester} | {profile.status}</p>
            </div>
          </div>
        </header>

        {/* --- PERSONAL INFORMATION --- */}
        <section className="card">
          <div className="section-header">
            <div className="section-title">Personal Information</div>
          </div>
          <div className="form-grid">
            <div className="form-group full-width">
              <label>Full Name</label>
              <input type="text" className="form-input" value={profile.fullName || ''} readOnly />
            </div>
            <div className="form-group"><label>Enrollment No</label><input type="text" className="form-input" value={profile.enrollmentNumber || 'N/A'} readOnly /></div>
            <div className="form-group"><label>PR Number</label><input type="text" className="form-input" value={profile.prNumber || 'N/A'} readOnly /></div>
            <div className="form-group"><label>Email ID</label><input type="text" className="form-input" value={profile.email || 'N/A'} readOnly /></div>
            <div className="form-group"><label>Phone Number</label><input type="text" className="form-input" value={profile.phoneNumber || 'N/A'} readOnly /></div>
          </div>
        </section>

        {/* --- ACADEMIC RECORDS (DYNAMIC SEMESTER CARDS) --- */}
        <div className="section-main-title" style={{ margin: '30px 0 15px 5px', fontWeight: 'bold', fontSize: '1.2rem', color: '#333' }}>
            Academic Records
        </div>

        {sortedSemesters.length === 0 ? (
          <section className="card">
            <div className="empty-table-msg" style={{ padding: '30px', textAlign: 'center' }}>No academic records found.</div>
          </section>
        ) : (
          sortedSemesters.map((sem) => (
            <section className="card" key={sem} style={{ marginBottom: '30px' }}>
              <div className="section-header" style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: '12px' }}>
                <div className="section-title" style={{ color: '#2563eb' }}>Semester {sem}</div>
              </div>
              <div className="table-wrapper">
                <table className="full-width-table">
                  <thead>
                    <tr>
                      <th style={{ width: '15%' }}>CODE</th>
                      <th style={{ width: '35%' }}>SUBJECT NAME</th>
                      <th style={{ width: '10%' }}>ISA</th>
                      <th style={{ width: '10%' }}>THEORY</th>
                      <th style={{ width: '10%' }}>PRAC</th>
                      <th style={{ width: '10%' }}>TOTAL</th>
                      <th style={{ width: '10%' }}>GRADE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedMarks[sem].map((m, i) => (
                      <tr key={i}>
                        <td className="code-cell" style={{ fontWeight: '600' }}>{m.subjectCode}</td>
                        <td className="subject-cell">{m.subjectName}</td>
                        <td className="score-cell">{m.isaScore}</td>
                        <td className="score-cell">{m.theoryScore}</td>
                        <td className="score-cell">{m.practScore || '--'}</td>
                        <td className="total-cell" style={{ color: '#2563eb', fontWeight: 'bold' }}>{m.total}</td>
                        <td className="grade-cell">
                          <span className={`grade-badge ${m.grade === 'F' ? 'grade-red' : 'grade-green'}`}>
                            {m.grade || calculateGrade(m.total)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ))
        )}

        {/* --- GPA SUMMARY --- */}
        <div className="gpa-container" style={{ marginBottom: '30px' }}>
          <div className="gpa-stat">
            <span className="gpa-label">CURRENT SGPA</span>
            <span className="gpa-value">{liveSGPA}</span>
          </div>
          <div className="gpa-stat">
            <span className="gpa-label">OVERALL CGPA</span>
            <span className="gpa-value">{liveCGPA}</span>
          </div>
        </div>

        {/* --- DOCUMENTS --- */}
        <section className="card">
          <div className="section-header">
            <div className="section-title">Verified Documents</div>
          </div>
          <div className="doc-list">
            {documents.length === 0 ? (
              <div className="empty-docs">No documents found.</div>
            ) : (
              documents.map((doc, idx) => (
                <div className="file-card" key={idx}>
                  <div className="file-info">
                    <div className="file-type type-pdf">{doc.type || 'PDF'}</div>
                    <div>
                      <div className="file-name">{doc.name}</div>
                      <div className="file-meta">{doc.uploadDate}</div>
                    </div>
                  </div>
                  <span className={`status-pill ${doc.status === 'Approved' ? 'status-ok' : 'status-wait'}`}>
                    {doc.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default StudentPortal;