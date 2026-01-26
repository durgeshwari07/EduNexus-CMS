// // import React, { useState, useRef, useEffect } from 'react';
// // import useLocalStorageSync from './useLocalStorageSync';
// // import { useNavigate } from 'react-router-dom';
// // import './Portal.css';

// // const StudentPortal = () => {
// //   const navigate = useNavigate();
// //   const targetStudentName = "Student A";

// //   // Data Keys
// //   const MARKS_KEY = 'unidesk_v10_practical';
// //   const PROFILE_KEY = 'unidesk_student_profile';
// //   const DOC_KEY = 'unidesk_student_documents';
// //   const SGPA_HISTORY_KEY = 'unidesk_student_sgpa_history';

// //   // State Management
// //   const [marksDB] = useLocalStorageSync(MARKS_KEY, {});
// //   const [profile, setProfile] = useLocalStorageSync(PROFILE_KEY, {
// //     fullName: "Student A",
// //     prNumber: "202302121",
// //     rollNumber: "BCA-23-012",
// //     aadhaar: "XXXX-XXXX-1234",
// //     dept: "BCA – Bachelor of Computer Applications",
// //     year: "2023",
// //     semester: "Semester I"
// //   });
// //   const [documents, setDocuments] = useLocalStorageSync(DOC_KEY, {});
// //   const [sgpaHistory, setSgpaHistory] = useLocalStorageSync(SGPA_HISTORY_KEY, {});

// //   const [isSaving, setIsSaving] = useState(false);
// //   const fileInputRef = useRef(null);

// //   // --- Calculations ---
// //   const calculateGrade = (score) => {
// //     if (score >= 90) return 'O'; if (score >= 80) return 'A+'; if (score >= 70) return 'A';
// //     if (score >= 60) return 'B+'; if (score >= 50) return 'B'; if (score >= 40) return 'P';
// //     return 'F';
// //   };

// //   const getGradePoint = (score) => {
// //     if (score >= 90) return 10; if (score >= 80) return 9; if (score >= 70) return 8;
// //     if (score >= 60) return 7; if (score >= 50) return 6; if (score >= 40) return 5;
// //     return 0;
// //   };

// //   // Derive Table Data
// //   let grandTotal = 0;
// //   let subjectsCount = 0;
// //   let totalGradePoints = 0;
// //   let totalCredits = 0;

// //   const tableRows = [];

// //   Object.values(marksDB).forEach((subjects) => {
// //     subjects.forEach((sub, idx) => {
// //       const student = sub.students.find(s => s.name === targetStudentName);
// //       if (student) {
// //         const sum = arr => arr.reduce((a, b) => a + Number(b), 0);
// //         const isa1 = sum(student.isa.isa1);
// //         const isa2 = sum(student.isa.isa2);
// //         const isa3 = sum(student.isa.isa3);
// //         const semScore = sum(student.semMarks);
// //         const practScore = student.practicalMarks || 0;

// //         // Note: In real app logic from faculty.html, we filtered based on selectedISAs,
// //         // but student view in index.html just summed them all. Keeping faithful to index.html logic:
// //         const theoryScore = isa1 + isa2 + isa3 + semScore;
// //         const totalScore = theoryScore + practScore;
// //         const grade = calculateGrade(totalScore);
// //         const gradePoint = getGradePoint(totalScore);
        
// //         tableRows.push({
// //           code: `SUB-0${idx + 1}`,
// //           name: sub.name,
// //           theoryMax: sub.theoryMax || sub.semMax || '--',
// //           theoryScore,
// //           practMax: sub.practicalMax || '--',
// //           practScore,
// //           hasPractical: sub.hasPractical,
// //           totalScore,
// //           grade
// //         });

// //         grandTotal += totalScore;
// //         subjectsCount++;
// //         totalGradePoints += (gradePoint * 4);
// //         totalCredits += 4;
// //       }
// //     });
// //   });

// //   // Derived GPAs
// //   const currentSGPA = totalCredits > 0 ? (totalGradePoints / totalCredits) : 0;
  
// //   // Update History Side Effect
// //   useEffect(() => {
// //     if (totalCredits > 0) {
// //       const currentSem = profile.semester || 'Semester I';
// //       const history = { ...sgpaHistory };
// //       if (!history[targetStudentName]) history[targetStudentName] = {};
      
// //       // Only update if changed to avoid infinite loop
// //       if (history[targetStudentName][currentSem] !== currentSGPA) {
// //         history[targetStudentName][currentSem] = currentSGPA;
// //         setSgpaHistory(history);
// //       }
// //     }
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, [currentSGPA, profile.semester, totalCredits]);

// //   // Calculate CGPA
// //   const studentHistory = sgpaHistory[targetStudentName] || {};
// //   const semesters = Object.values(studentHistory);
// //   const cgpa = semesters.length > 0 ? semesters.reduce((a, b) => a + b, 0) / semesters.length : 0;

// //   // --- Actions ---
// //   const handleProfileChange = (e) => {
// //     setProfile({ ...profile, [e.target.id]: e.target.value });
// //   };

// //   const saveProfile = () => {
// //     setIsSaving(true);
// //     // Profile is already synced via hook, just showing UI feedback
// //     setTimeout(() => setIsSaving(false), 1500);
// //   };

// //   const handleFileUpload = (e) => {
// //     const files = Array.from(e.target.files);
// //     const pr = profile.prNumber?.trim();
// //     if (!pr) return;

// //     const newDocs = { ...documents };
// //     if (!newDocs[pr]) newDocs[pr] = [];

// //     files.forEach(file => {
// //       const formatSize = (bytes) => {
// //         if (bytes === 0) return '0 Bytes';
// //         const k = 1024; const sizes = ['Bytes', 'KB', 'MB', 'GB'];
// //         const i = Math.floor(Math.log(bytes) / Math.log(k));
// //         return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
// //       };
      
// //       const ext = file.name.split('.').pop().toUpperCase();
// //       newDocs[pr].push({
// //         name: file.name,
// //         type: ext === 'JPEG' ? 'JPG' : ext,
// //         size: formatSize(file.size),
// //         date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
// //         status: 'Pending'
// //       });
// //     });

// //     setDocuments(newDocs);
// //     fileInputRef.current.value = '';
// //   };

// //   const finalizeRecord = () => {
// //     const pr = profile.prNumber?.trim();
// //     if(!pr) return alert('Please enter a valid PR Number.');
// //     const newDocs = { ...documents };
// //     if (!newDocs[pr] || newDocs[pr].length === 0) return alert('Cannot finalize: No documents found.');
    
// //     newDocs[pr] = newDocs[pr].map(d => ({ ...d, status: 'Approved' }));
// //     setDocuments(newDocs);
// //     alert('Record finalized successfully');
// //   };

// //   const studentDocs = documents[profile.prNumber] || [];

// //   return (
// //     <>
// //       <nav className="navbar">
// //         <div className="logo">Uni<span>Desk</span></div>
// //         <div className="nav-right">
// //           <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>Help</span>
// //           <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Admin" className="admin-avatar" />
// //         </div>
// //       </nav>

// //       <div className="container">
// //         <header className="page-header">
// //           <div className="page-title-group">
// //             <div className="back-btn"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg></div>
// //             <div className="student-photo-container">
// //               <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Student" className="student-photo" />
// //             </div>
// //             <div className="page-title">
// //               <h1>{profile.fullName || 'Student'}</h1>
// //               <p>Manage academic records and personal details.</p>
// //             </div>
// //           </div>
// //           <div style={{ display: 'flex', gap: '12px' }}>
// //             <button className="btn btn-ghost" onClick={() => window.open('/faculty', '_blank')}>Edit Marks</button>
// //             <button className="btn btn-ghost" onClick={() => window.location.reload()}>Discard Changes</button>
// //             <button 
// //               className="btn btn-primary" 
// //               onClick={saveProfile}
// //               style={{ backgroundColor: isSaving ? '#10b981' : undefined }}
// //             >
// //               {isSaving ? 'Saved ✓' : 'Save Profile'}
// //             </button>
// //           </div>
// //         </header>

// //         <section className="card">
// //           <div className="section-header">
// //             <div className="section-title">
// //               <div className="section-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg></div>
// //               Personal Information
// //             </div>
// //           </div>
// //           <div className="form-grid">
// //             <div className="form-group full-width">
// //               <label>Full Name</label>
// //               <input type="text" className="form-input" id="fullName" value={profile.fullName} onChange={handleProfileChange} />
// //             </div>
// //             <div className="form-group">
// //               <label>PR Number</label>
// //               <input type="text" className="form-input" id="prNumber" value={profile.prNumber} onChange={handleProfileChange} />
// //             </div>
// //             <div className="form-group">
// //               <label>Roll Number</label>
// //               <input type="text" className="form-input" id="rollNumber" value={profile.rollNumber} onChange={handleProfileChange} />
// //             </div>
// //             <div className="form-group">
// //               <label>Aadhaar Number</label>
// //               <input type="text" className="form-input" id="aadhaar" value={profile.aadhaar} onChange={handleProfileChange} />
// //             </div>
// //             <div className="form-group">
// //               <label>Department / Course</label>
// //               <select className="form-input" id="dept" value={profile.dept} onChange={handleProfileChange}>
// //                 <option>BCA – Bachelor of Computer Applications</option>
// //                 <option>B.Com – Bachelor of Commerce</option>
// //                 <option>M.Com – Master of Commerce</option>
// //               </select>
// //             </div>
// //             <div className="form-group">
// //               <label>Admission Year</label>
// //               <input type="text" className="form-input" id="year" value={profile.year} onChange={handleProfileChange} />
// //             </div>
// //             <div className="form-group">
// //               <label>Current Semester</label>
// //               <select className="form-input" id="semester" value={profile.semester} onChange={handleProfileChange}>
// //                 {['Semester I','Semester II','Semester III','Semester IV','Semester V','Semester VI','Semester VII','Semester VIII'].map(s => (
// //                   <option key={s}>{s}</option>
// //                 ))}
// //               </select>
// //             </div>
// //           </div>
// //         </section>

// //         <section className="card">
// //           <div className="section-header">
// //             <div className="section-title">
// //               <div className="section-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg></div>
// //               Academic Record
// //             </div>
// //           </div>
// //           <div className="table-wrapper">
// //             <table>
// //               <thead>
// //                 <tr><th>Code</th><th>Subject Name</th><th>Theory (Max/Scored)</th><th>Pract (Max/Scored)</th><th>Total</th><th>Grade</th></tr>
// //               </thead>
// //               <tbody>
// //                 {tableRows.length === 0 ? (
// //                   <tr><td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No records found for this student.</td></tr>
// //                 ) : (
// //                   tableRows.map((row, i) => (
// //                     <tr key={i}>
// //                       <td style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>{row.code}</td>
// //                       <td style={{ fontWeight: 500 }}>{row.name}</td>
// //                       <td dangerouslySetInnerHTML={{ __html: `${row.theoryMax} / <b>${row.theoryScore}</b>` }}></td>
// //                       <td>
// //                         {row.hasPractical 
// //                           ? <span dangerouslySetInnerHTML={{ __html: `${row.practMax} / <b>${row.practScore}</b>` }} /> 
// //                           : <span style={{ color: '#ccc' }}>--</span>}
// //                       </td>
// //                       <td style={{ fontWeight: 700, color: 'var(--primary)' }}>{row.totalScore}</td>
// //                       <td><span className={`grade-badge ${row.grade === 'F' ? 'grade-red' : 'grade-green'}`}>{row.grade}</span></td>
// //                     </tr>
// //                   ))
// //                 )}
// //               </tbody>
// //             </table>
// //           </div>
// //           <div className="gpa-container">
// //             <div className="gpa-stat">
// //               <span className="gpa-label">Total Score</span>
// //               <span className="gpa-value">{grandTotal}</span>
// //             </div>
// //             <div className="gpa-stat">
// //               <span className="gpa-label">SGPA</span>
// //               <span className="gpa-value">{currentSGPA.toFixed(2)}</span>
// //             </div>
// //             <div className="gpa-stat">
// //               <span className="gpa-label">CGPA</span>
// //               <span className="gpa-value">{cgpa.toFixed(2)}</span>
// //             </div>
// //           </div>
// //         </section>

// //         <section className="card">
// //           <div className="section-header">
// //             <div className="section-title">
// //               <div className="section-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg></div>
// //               Documents
// //             </div>
// //             <button className="btn btn-ghost" onClick={() => fileInputRef.current.click()} style={{ fontSize: '0.8rem', padding: '8px 16px' }}>Batch Upload</button>
// //           </div>
// //           <div className="doc-grid">
// //             <div className="upload-area" onClick={() => fileInputRef.current.click()}>
// //               <input type="file" multiple accept=".pdf, .jpg, .jpeg, .png" style={{ display: 'none' }} ref={fileInputRef} onChange={handleFileUpload} />
// //               <div className="upload-icon">
// //                 <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
// //               </div>
// //               <div style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '4px' }}>Click to Upload</div>
// //               <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>or drag and drop files here</div>
// //             </div>
// //             <div className="doc-list">
// //               {studentDocs.map((doc, idx) => (
// //                 <div className="file-card" key={idx}>
// //                   <div className="file-info">
// //                     <div className={`file-type ${['JPG','JPEG','PNG'].includes(doc.type) ? 'type-img' : 'type-pdf'}`}>{doc.type}</div>
// //                     <div>
// //                       <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{doc.name}</div>
// //                       <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{doc.size} • {doc.date}</div>
// //                     </div>
// //                   </div>
// //                   <span className={`status-pill ${doc.status === 'Approved' ? 'status-ok' : 'status-wait'}`}>{doc.status}</span>
// //                 </div>
// //               ))}
// //             </div>
// //           </div>
// //         </section>

// //         <div className="footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
// //           <button className="btn btn-ghost">Cancel</button>
// //           <button className="btn btn-primary" onClick={finalizeRecord}>Finalize Record</button>
// //         </div>
// //       </div>
// //     </>
// //   );
// // };

// // export default StudentPortal;






// // import React, { useState, useEffect } from 'react';
// // import { useNavigate, useParams } from 'react-router-dom';
// // import axios from 'axios';
// // import { 
// //   Download, Edit, User, Hash, GraduationCap, 
// //   Calendar, BookOpen, Award, TrendingUp, BookMarked, 
// //   FileText, Upload, Eye, CheckCircle, ArrowLeft, 
// //   Phone, Mail, MapPin, Shield, Users
// // } from 'lucide-react';
// // import './Portal.css';

// // const StudentPortal = () => {
// //   const navigate = useNavigate();
// //   const { id } = useParams();
// //   const [profile, setProfile] = useState(null);
// //   const [marksBySemester, setMarksBySemester] = useState({});
// //   const [loading, setLoading] = useState(true);

// //   // --- 1. Fetch Dynamic Data from Database ---
// //   useEffect(() => {
// //     const fetchData = async () => {
// //       try {
// //         setLoading(true);
// //         const res = await axios.get(`http://localhost:5000/api/students/${id}/portal`);
// //         if (res.data) {
// //           setProfile(res.data.profile);
// //           const grouped = res.data.marks.reduce((acc, mark) => {
// //             const sem = mark.semester || 1;
// //             if (!acc[sem]) acc[sem] = [];
// //             acc[sem].push(mark);
// //             return acc;
// //           }, {});
// //           setMarksBySemester(grouped);
// //         }
// //       } catch (err) {
// //         console.error("Database fetch failed:", err);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };
// //     if (id) fetchData();
// //   }, [id]);

// //   if (loading) return <div className="portal-loading text-center p-10 font-bold text-blue-600">Syncing Student Profile...</div>;
// //   if (!profile) return <div className="portal-error text-center p-10">Student Record Not Found.</div>;

// //   // --- 2. Grade & Best-of-Two ISA Logic ---
// //   const processAcademicRow = (mark) => {
// //     const isas = [Number(mark.isa1 || 0), Number(mark.isa2 || 0), Number(mark.isa3 || 0)];
// //     // Sort descending and take top 2
// //     const sortedIsas = [...isas].sort((a, b) => b - a);
// //     const topTwo = sortedIsas.slice(0, 2);
// //     const isaTotal = topTwo.reduce((a, b) => a + b, 0);
    
// //     const grandTotal = isaTotal + Number(mark.theory || 0) + Number(mark.practical || 0);

// //     let gradeObj = { label: 'F', class: 'bg-red-50 text-red-700 border-red-200' };
// //     if (grandTotal >= 90) gradeObj = { label: 'O', class: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
// //     else if (grandTotal >= 80) gradeObj = { label: 'A+', class: 'bg-green-100 text-green-700 border-green-200' };
// //     else if (grandTotal >= 70) gradeObj = { label: 'A', class: 'bg-green-50 text-green-600 border-green-100' };
// //     else if (grandTotal >= 60) gradeObj = { label: 'B+', class: 'bg-blue-100 text-blue-700 border-blue-200' };

// //     return { isas, topTwo, isaTotal, grandTotal, gradeObj };
// //   };

// //   return (
// //     <div className="min-h-screen bg-slate-50 pb-12 portal-theme">
// //       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
// //         {/* --- HEADER --- */}
// //         <div className="mb-6 flex items-center gap-4">
// //           <button onClick={() => navigate(-1)} className="back-circle">
// //             <ArrowLeft size={20} />
// //           </button>
// //           <div>
// //             <h1 className="text-3xl font-semibold text-slate-900">Student Profile & Academic Record</h1>
// //             <p className="text-slate-600 mt-1">Complete record for {profile.name}</p>
// //           </div>
// //         </div>

// //         <div className="space-y-6">
          
// //           {/* --- HERO PROFILE HEADER --- */}
// //           <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
// //             <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
// //               <div className="flex-shrink-0">
// //                 <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-100">
// //                   <img src={`https://ui-avatars.com/api/?name=${profile.name}&background=2563eb&color=fff&size=128`} alt="Avatar" className="w-full h-full object-cover" />
// //                 </div>
// //               </div>
// //               <div className="flex-1">
// //                 <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
// //                   <div>
// //                     <h1 className="text-3xl font-semibold text-slate-900 mb-2">{profile.name}</h1>
// //                     <div className="flex flex-wrap gap-3 mb-3 text-sm">
// //                       <span className="text-slate-600"><span className="font-medium">Enrollment:</span> {profile.enrollmentNo}</span>
// //                       <span className="text-slate-400">|</span>
// //                       <span className="text-slate-600"><span className="font-medium">PR Number:</span> {profile.prNumber || 'N/A'}</span>
// //                     </div>
// //                     <div className="flex flex-wrap gap-3 items-center">
// //                       <span className="tag bg-slate-100 px-3 py-1 rounded text-sm text-slate-600 font-medium">Division: {profile.division}</span>
// //                       <span className="tag bg-slate-100 px-3 py-1 rounded text-sm text-slate-600 font-medium">Batch ID: {profile.batchId}</span>
// //                       <span className={`px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800`}>{profile.status || 'Active'}</span>
// //                     </div>
// //                   </div>
// //                   <div className="flex gap-3">
// //                     <button className="btn btn-primary"><Edit size={16}/> Edit Profile</button>
// //                     <button className="btn btn-dark" onClick={() => window.print()}><Download size={16}/> Download</button>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>

// //           {/* --- PERSONAL INFORMATION GRID --- */}
// //           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //             <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
// //               <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
// //                 <User className="text-blue-600" size={20}/> Identity & Academic Info
// //               </h2>
// //               <div className="space-y-4 text-sm">
// //                 <div className="flex justify-between border-b border-slate-50 pb-2">
// //                   <span className="text-slate-500">Enrollment No</span>
// //                   <span className="font-medium text-slate-900">{profile.enrollmentNo}</span>
// //                 </div>
// //                 <div className="flex justify-between border-b border-slate-50 pb-2">
// //                   <span className="text-slate-500">Date of Birth</span>
// //                   <span className="font-medium text-slate-900">{profile.dob}</span>
// //                 </div>
// //                 <div className="flex justify-between border-b border-slate-50 pb-2">
// //                   <span className="text-slate-500">Semester</span>
// //                   <span className="font-medium text-slate-900">Semester {profile.semester}</span>
// //                 </div>
// //                 <div className="flex flex-col gap-1">
// //                   <span className="text-slate-500">Residential Address</span>
// //                   <span className="font-medium text-slate-900 bg-slate-50 p-3 rounded-lg mt-1">{profile.address}</span>
// //                 </div>
// //               </div>
// //             </div>

// //             <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
// //               <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
// //                 <Users className="text-blue-600" size={20}/> Contact & Guardian
// //               </h2>
// //               <div className="space-y-4 text-sm">
// //                 <div className="flex justify-between border-b border-slate-50 pb-2">
// //                   <span className="text-slate-500">Email</span>
// //                   <span className="font-medium text-slate-900">{profile.email}</span>
// //                 </div>
// //                 <div className="flex justify-between border-b border-slate-50 pb-2">
// //                   <span className="text-slate-500">Phone</span>
// //                   <span className="font-medium text-slate-900">{profile.phone}</span>
// //                 </div>
// //                 <div className="flex justify-between border-b border-slate-50 pb-2">
// //                   <span className="text-slate-500">Guardian</span>
// //                   <span className="font-medium text-slate-900">{profile.guardianName}</span>
// //                 </div>
// //                 <div className="flex justify-between border-b border-slate-50 pb-2">
// //                   <span className="text-slate-500">Guardian Phone</span>
// //                   <span className="font-medium text-slate-900">{profile.guardianPhone}</span>
// //                 </div>
// //                 <div className="flex justify-between pt-2">
// //                   <span className="text-slate-500">Portal Username</span>
// //                   <span className="font-mono text-blue-600 font-bold">{profile.username}</span>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>

// //           {/* --- ACADEMIC RECORDS (DYNAMIC BY SEMESTER) --- */}
// //           <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
// //             <div className="flex items-center gap-3 mb-6">
// //               <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
// //                 <BookOpen className="w-5 h-5 text-white" />
// //               </div>
// //               <h2 className="text-2xl font-semibold text-slate-900">Academic Records</h2>
// //             </div>
            
// //             <div className="space-y-8">
// //               {Object.keys(marksBySemester).sort().map(sem => (
// //                 <div key={sem} className="rounded-xl border border-slate-200 overflow-hidden shadow-sm bg-white">
// //                   {/* Blue Semester Header matches Image image_6f6915.png */}
// //                   <div className="bg-blue-600 px-6 py-4 flex justify-between items-center text-white">
// //                     <h3 className="text-lg font-semibold">Semester {sem}</h3>
// //                     <div className="bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-lg text-xs font-bold border border-white/30">
// //                       SGPA: 8.20
// //                     </div>
// //                   </div>
                  
// //                   <div className="overflow-x-auto">
// //                     <table className="w-full text-sm text-left">
// //                       <thead>
// //                         <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
// //                           <th className="px-6 py-4">Subject Name</th>
// //                           <th className="px-4 py-4 text-center">ISA 1</th>
// //                           <th className="px-4 py-4 text-center">ISA 2</th>
// //                           <th className="px-4 py-4 text-center">ISA 3</th>
// //                           <th className="px-4 py-4 text-center text-blue-600 bg-blue-50/50">Top 2 Total</th>
// //                           <th className="px-4 py-4 text-center">Final (20)</th>
// //                           <th className="px-4 py-4 text-center">Prac (20)</th>
// //                           <th className="px-4 py-4 text-center text-blue-700 font-black">Grand Total</th>
// //                           <th className="px-6 py-4 text-center">Grade</th>
// //                         </tr>
// //                       </thead>
// //                       <tbody className="divide-y divide-slate-100">
// //                         {marksBySemester[sem].map((mark, i) => {
// //                           const { isas, topTwo, isaTotal, grandTotal, gradeObj } = processAcademicRow(mark);
// //                           return (
// //                             <tr key={i} className="hover:bg-slate-50/50 transition-colors">
// //                               <td className="px-6 py-4 font-semibold text-slate-800">{mark.subject_name}</td>
// //                               {/* Show all 3 ISAs, bolding the ones used in total */}
// //                               {isas.map((val, idx) => (
// //                                 <td key={idx} className={`px-4 py-4 text-center ${topTwo.includes(val) ? 'font-bold text-slate-900' : 'text-slate-400 opacity-60'}`}>
// //                                   {val}
// //                                 </td>
// //                               ))}
// //                               <td className="px-4 py-4 text-center font-bold text-blue-600 bg-blue-50/30">{isaTotal}</td>
// //                               <td className="px-4 py-4 text-center text-slate-600">{mark.theory || 0}</td>
// //                               <td className="px-4 py-4 text-center text-slate-600">{mark.practical || '--'}</td>
// //                               <td className="px-4 py-4 text-center font-extrabold text-blue-700 text-base">{grandTotal}</td>
// //                               <td className="px-6 py-4 text-center">
// //                                 <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${gradeObj.class}`}>
// //                                   {gradeObj.label}
// //                                 </span>
// //                               </td>
// //                             </tr>
// //                           );
// //                         })}
// //                       </tbody>
// //                     </table>
// //                   </div>
// //                   <div className="bg-slate-50 px-6 py-3 flex justify-between items-center border-t border-slate-200 text-xs text-slate-500 font-medium">
// //                     <div>Total Subjects: {marksBySemester[sem].length}</div>
// //                     <div className="text-slate-700">Semester Grade Point Average: <span className="text-blue-600 font-bold text-sm">8.20</span></div>
// //                   </div>
// //                 </div>
// //               ))}
// //             </div>
// //           </div>

// //           {/* --- CGPA SUMMARY (BANNER) --- */}
// //           <div className="cgpa-banner shadow-lg">
// //             <div className="flex items-center gap-3 mb-6">
// //               <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-sm">
// //                 <Award className="w-6 h-6 text-white" />
// //               </div>
// //               <h2 className="text-2xl font-semibold text-white">CGPA Summary</h2>
// //             </div>
// //             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
// //               <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
// //                 <p className="text-blue-100 flex items-center gap-2 mb-2"><TrendingUp size={18}/> Overall CGPA</p>
// //                 <p className="text-4xl font-bold text-white">8.65 <small className="text-sm font-normal opacity-70">/ 10.00</small></p>
// //               </div>
// //               <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
// //                 <p className="text-blue-100 flex items-center gap-2 mb-2"><BookMarked size={18}/> Credits Earned</p>
// //                 <p className="text-4xl font-bold text-white">180</p>
// //               </div>
// //               <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
// //                 <span className="inline-flex px-4 py-2 rounded-lg text-lg font-bold bg-emerald-400 text-emerald-900 border-2 border-white/20">Excellent</span>
// //                 <p className="text-sm text-blue-200 mt-2 font-medium">Academic Standing</p>
// //               </div>
// //             </div>
// //           </div>

// //           {/* --- DOCUMENTS GRID --- */}
// //           <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
// //             <div className="flex items-center justify-between mb-6">
// //               <div className="flex items-center gap-3">
// //                 <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm"><FileText size={20} className="text-white" /></div>
// //                 <h2 className="text-2xl font-semibold text-slate-900">Student Documents</h2>
// //               </div>
// //               <button className="btn btn-primary"><Upload size={16}/> Upload Document</button>
// //             </div>
// //             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
// //               {['Aadhaar Card', '10th Marksheet', '12th Marksheet'].map((doc, i) => (
// //                 <div key={i} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
// //                   <div className="flex items-start gap-3 mb-4">
// //                     <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center"><FileText className="text-red-500" /></div>
// //                     <div className="flex-1 min-w-0">
// //                       <h3 className="font-semibold text-slate-900 text-sm truncate">{doc}</h3>
// //                       <p className="text-xs text-slate-500 font-medium">PDF</p>
// //                     </div>
// //                   </div>
// //                   <div className="flex justify-between items-center mb-4">
// //                     <span className="text-xs text-slate-500 font-medium">Status:</span>
// //                     <span className="flex items-center gap-1 text-xs font-bold text-green-700"><CheckCircle size={12}/> Approved</span>
// //                   </div>
// //                   <div className="flex gap-2">
// //                     <button className="flex-1 flex justify-center items-center gap-1 px-3 py-2 text-xs bg-slate-100 rounded-lg hover:bg-slate-200 font-semibold text-slate-700 transition-colors"><Eye size={12}/> Preview</button>
// //                     <button className="flex-1 flex justify-center items-center gap-1 px-3 py-2 text-xs bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 font-bold transition-colors"><Download size={12}/> Download</button>
// //                   </div>
// //                 </div>
// //               ))}
// //             </div>
// //           </div>

// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default StudentPortal;










import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { 
  Download, Edit, User, GraduationCap, BookOpen, Award, TrendingUp, 
  FileText, Upload, Eye, CheckCircle, ArrowLeft, Users, Clock, 
  Mail, Phone, MapPin, Shield, Calendar, Hash
} from 'lucide-react';
import './Portal.css';

const StudentPortal = () => {
  const navigate = useNavigate();
  // FIXED: useParams must be called inside the component
  const { id } = useParams();
  const fileInputRef = useRef(null); 
  
  const [profile, setProfile] = useState(null);
  const [marksBySemester, setMarksBySemester] = useState({});
  const [documents, setDocuments] = useState([]); 
  const [loading, setLoading] = useState(true);

  const fetchPortalData = async () => {
    try {
      setLoading(true);
      // Ensure your backend has the /portal route or change this to /api/students/${id}
      const res = await axios.get(`http://localhost:5000/api/students/${id}/portal`);
      if (res.data) {
        setProfile(res.data.profile);
        setDocuments(res.data.documents || []);
        const grouped = res.data.marks.reduce((acc, mark) => {
          const sem = mark.semester || 1;
          if (!acc[sem]) acc[sem] = [];
          acc[sem].push(mark);
          return acc;
        }, {});
        setMarksBySemester(grouped);
      }
    } catch (err) { 
      console.error("Fetch error:", err); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { 
    if (id) fetchPortalData(); 
  }, [id]);

  const handleUploadClick = () => { fileInputRef.current.click(); };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setLoading(true);
      await axios.post('http://localhost:5000/api/students/upload-doc', {
        studentId: id, docName: file.name, fileType: file.name.split('.').pop().toUpperCase()
      });
      alert("Document Uploaded Successfully!");
      fetchPortalData(); 
    } catch (err) { 
      alert("Upload failed."); 
    } finally { 
      setLoading(false); 
    }
  };

  const processAcademicRow = (mark) => {
    const isas = [Number(mark.isa1 || 0), Number(mark.isa2 || 0), Number(mark.isa3 || 0)];
    const sortedIsas = [...isas].sort((a, b) => b - a);
    const topTwo = sortedIsas.slice(0, 2);
    const isaTotal = topTwo.reduce((a, b) => a + b, 0);
    const grandTotal = isaTotal + Number(mark.theory || 0) + Number(mark.practical || 0);
    let gradeObj = { label: 'F', class: 'bg-red-50 text-red-700' };
    if (grandTotal >= 80) gradeObj = { label: 'O', class: 'bg-emerald-50 text-emerald-700' };
    else if (grandTotal >= 60) gradeObj = { label: 'A', class: 'bg-blue-50 text-blue-700' };
    return { isas, topTwo, isaTotal, grandTotal, gradeObj };
  };

  if (loading && !profile) return <div className="p-20 text-center text-blue-600 font-bold animate-pulse">Loading Profile...</div>;
  if (!profile) return <div className="p-20 text-center">Record Not Found.</div>;

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-12 portal-theme">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* --- SECTION 1: HERO HEADER --- */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-shrink-0">
              <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-slate-50 shadow-sm">
                <img src={`https://ui-avatars.com/api/?name=${profile.name}&background=2563eb&color=fff&size=128`} alt="Avatar" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 mb-1">{profile.name}</h1>
                  <div className="flex flex-wrap gap-4 mb-3 text-sm font-medium text-slate-500">
                    <span>PR Number: <span className="text-blue-600 font-bold">{profile.enrollmentNo}</span></span>
                    <span className="text-slate-300">|</span>
                    <span>Roll No: {profile.rollNumber || '21BCA123'}</span>
                  </div>
                  <p className="text-lg text-slate-600 mb-3">{profile.course || 'BCA - Bachelor of Computer Applications'}</p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                    <span>Department: {profile.department || 'Computer Science'}</span>
                    <span className="w-1.5 h-1.5 bg-slate-300 rounded-full"></span>
                    <span>Admission Year: {profile.academicYear || '2021'}</span>
                    <span className="ml-2 bg-emerald-100 text-emerald-700 px-3 py-0.5 rounded-full text-xs font-bold">Active</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-sm hover:bg-blue-700 transition-all"><Edit size={16}/> Edit Profile</button>
                  <button className="flex items-center gap-2 bg-[#475569] text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-sm hover:bg-slate-700 transition-all" onClick={() => window.print()}><Download size={16}/> Download</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- SECTION 2: PERSONAL INFORMATION GRID --- */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-8">
          <h2 className="text-xl font-bold text-slate-800 mb-8">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600"><User size={20}/></div>
              <div><p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Full Name</p><p className="font-bold text-slate-800">{profile.name}</p></div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600"><Hash size={20}/></div>
              <div><p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">PR Number</p><p className="font-bold text-slate-800">{profile.enrollmentNo}</p></div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600"><FileText size={20}/></div>
              <div><p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Roll Number</p><p className="font-bold text-slate-800">{profile.rollNumber || '21BCA123'}</p></div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600"><Shield size={20}/></div>
              <div><p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Aadhaar</p><p className="font-bold text-slate-800">XXXX-XXXX-4567</p></div>
            </div>
          </div>
        </div>

        {/* --- SECTION 3: ACADEMIC RECORDS --- */}
        <div className="space-y-8 mb-8">
          {Object.keys(marksBySemester).sort().map(sem => (
            <div key={sem} className="rounded-xl border border-slate-200 overflow-hidden shadow-sm bg-white">
              <div className="bg-blue-600 px-6 py-4 flex justify-between items-center text-white">
                <h3 className="font-bold">Semester {sem} Results</h3>
                <div className="bg-white/20 px-3 py-1 rounded-lg text-xs font-bold border border-white/20">SGPA: 8.20</div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase text-[10px]">
                      <th className="px-6 py-4">Subject</th>
                      <th className="px-4 py-4 text-center">ISA 1</th>
                      <th className="px-4 py-4 text-center">ISA 2</th>
                      <th className="px-4 py-4 text-center">ISA 3</th>
                      <th className="px-4 py-4 text-center text-blue-600 bg-blue-50/50">Best 2</th>
                      <th className="px-4 py-4 text-center">Theory</th>
                      <th className="px-4 py-4 text-center">Prac</th>
                      <th className="px-4 py-4 text-center font-black text-slate-900">Total</th>
                      <th className="px-6 py-4 text-center">Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {marksBySemester[sem].map((mark, i) => {
                      const { isas, topTwo, isaTotal, grandTotal, gradeObj } = processAcademicRow(mark);
                      return (
                        <tr key={i} className="hover:bg-blue-50/10 transition-colors">
                          <td className="px-6 py-4 font-bold text-slate-700">{mark.subject_name}</td>
                          {isas.map((val, idx) => (
                            <td key={idx} className={`px-4 py-4 text-center ${topTwo.includes(val) ? 'font-bold text-slate-900' : 'text-slate-400 opacity-60'}`}>{val}</td>
                          ))}
                          <td className="px-4 py-4 text-center font-bold text-blue-600 bg-blue-50/20">{isaTotal}</td>
                          <td className="px-4 py-4 text-center">{mark.theory || 0}</td>
                          <td className="px-4 py-4 text-center">{mark.practical || '--'}</td>
                          <td className="px-4 py-4 text-center font-black text-slate-900 bg-slate-50/50">{grandTotal}</td>
                          <td className="px-6 py-4 text-center"><span className={`px-3 py-1 rounded-md text-[11px] font-black border ${gradeObj.class}`}>{gradeObj.label}</span></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>

        {/* --- SECTION 4: LIVE DOCUMENTS GRID --- */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm"><FileText size={20} className="text-white" /></div>
              <h2 className="text-2xl font-semibold text-slate-900">Student Documents</h2>
            </div>
            <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} />
            <button className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg font-bold" onClick={handleUploadClick}><Upload size={16}/> Upload From PC</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {documents.length > 0 ? documents.map((doc, i) => (
              <div key={i} className="border border-slate-200 rounded-xl p-5 hover:shadow-lg transition-all bg-white">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center text-red-500"><FileText size={24} /></div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-900 text-sm truncate uppercase tracking-tight">{doc.doc_name}</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{doc.file_type}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center mb-5 bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Status</span>
                  <span className={`font-black uppercase flex items-center gap-1 text-[10px] ${doc.status === 'Approved' ? 'text-emerald-600' : 'text-orange-500'}`}>
                    {doc.status === 'Approved' ? <CheckCircle size={12}/> : <Clock size={12}/>} {doc.status}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 py-2 text-[10px] bg-slate-100 rounded-lg font-bold text-slate-600 hover:bg-slate-200 transition-colors uppercase" onClick={() => window.open(`http://localhost:5000/${doc.file_path}`)}>Preview</button>
                  <button className="flex-1 py-2 text-[10px] bg-blue-600 rounded-lg font-bold text-white hover:bg-blue-700 shadow-sm transition-all uppercase">Download</button>
                </div>
              </div>
            )) : (
              <div className="col-span-3 py-16 text-center text-slate-400 border-2 border-dashed border-slate-100 rounded-2xl">
                <p className="font-bold uppercase text-xs tracking-widest">No documents found. Click "Upload" to select files.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentPortal;