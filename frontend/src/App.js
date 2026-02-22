// // import React, { useState, useEffect, useCallback } from 'react';
// // import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
// // import axios from 'axios';

// // /* UI & SHELL */
// // import Navbar from './pages/Navbar';
// // import Hero from './pages/Hero';
// // import FeatureShowcase from './pages/Featureshowcase';
// // import UserGrid from './pages/UserGrid';
// // import DashboardLayout from './layouts/DashboardLayout';
// // import StarField from './components/StarField';

// // /* PAGES */
// // import Login from './pages/Login';
// // import AdminRegistration from './pages/AdminRegistration';
// // import TeacherRegistration from './pages/TeacherRegistration';
// // import Overview from './pages/Overview';
// // import Departments from './pages/Departments';
// // import Teachers from './pages/Teachers';
// // import Students from './pages/Students';
// // import SubjectsManagement from './pages/SubjectsManagement';
// // import DocumentVerification from './pages/DocumentVerification'; 
// // import Reports from './pages/Reports'; 

// // /* PORTALS */
// // import StudentPortal from './assets/StudentPortal';
// // import FacultyPortal from './assets/FacultyPortal';

// // // --- API INSTANCE ---
// // const API = axios.create({ baseURL: 'http://localhost:5000/api' });

// // export default function App() {
// //   const navigate = useNavigate();
// //   const [role, setRole] = useState(() => JSON.parse(localStorage.getItem('user_role')) || null);
// //   const [currentUser, setCurrentUser] = useState(() => JSON.parse(localStorage.getItem('current_user')) || null);
// //   const [page, setPage] = useState('overview');
// //   const [selectedStudent, setSelectedStudent] = useState(null); 

// //   // --- GLOBAL DATA STATE ---
// //   const [departments, setDepartments] = useState([]);
// //   const [approvedTeachers, setApprovedTeachers] = useState([]);
// //   const [pendingRequests, setPendingRequests] = useState([]);
// //   const [allStudents, setAllStudents] = useState([]);
// //   const [batches, setBatches] = useState([]);
// //   const [subjects, setSubjects] = useState([]);
// //   const [teacherAssignments, setTeacherAssignments] = useState([]);

// //   // --- 🔄 MASTER SYNC (Fetches everything from MySQL) ---
// //   const syncData = useCallback(async () => {
// //     try {
// //       if (!role) return; 
// //       const res = await API.get('/dashboard/data');
// //       if (res.data) {
// //         setDepartments(res.data.departments || []);
// //         setApprovedTeachers(res.data.teachers || []);
// //         setPendingRequests(res.data.pendingTeachers || []);
// //         setAllStudents(res.data.students || []);
// //         setBatches(res.data.batches || []);
// //         setSubjects(res.data.subjects || []);
// //         setTeacherAssignments(res.data.teacherAssignments || []);
// //       }
// //     } catch (err) { 
// //       console.error("Master Sync failed. Ensure Node server and XAMPP are running."); 
// //     }
// //   }, [role]);

// //   useEffect(() => { syncData(); }, [syncData]);

// //   // --- AUTH HANDLERS ---
// //   const handleAuth = (userRole, userData) => {
// //     setRole(userRole);
// //     setCurrentUser(userData);
// //     localStorage.setItem('user_role', JSON.stringify(userRole));
// //     localStorage.setItem('current_user', JSON.stringify(userData));
    
// //     // Redirect logic based on role
// //     if (userRole === 'admin') {
// //       navigate('/dashboard');
// //     } else if (userRole === 'teacher') {
// //       navigate(`/dashboard`); // Faculty Portal loads inside DashboardLayout
// //       setPage('faculty-portal');
// //     }
// //   };

// //   const handleLogout = () => {
// //     setRole(null);
// //     setCurrentUser(null);
// //     localStorage.clear();
// //     navigate('/');
// //   };

// //   return (
// //     <div className="App min-h-screen bg-[#0a0a0a] text-[#ccc]">
// //       <StarField />
// //       <Routes>
// //         {/* PUBLIC ROUTES */}
// //         <Route path="/" element={
// //           <>
// //             <Navbar 
// //               onLoginClick={() => navigate('/login')} 
// //               onLogoClick={() => navigate('/')} 
// //               onRegisterAdmin={() => navigate('/register/admin')} 
// //               onRegisterTeacher={() => navigate('/register/teacher')} 
// //             />
// //             <main>
// //               <Hero onLoginClick={() => navigate('/login')} />
// //               <FeatureShowcase />
// //               <UserGrid />
// //             </main>
// //           </>
// //         } />
        
// //         <Route path="/login" element={role ? <Navigate to="/dashboard" /> : <Login onLoginSuccess={handleAuth} />} />
        
// //         {/* EXTERNAL PORTAL ACCESS */}
// //         <Route path="/student-portal/:id" element={<StudentPortal />} />

// //         {/* 📝 REGISTRATION FLOW */}
// //         <Route path="/register/admin" element={
// //           <AdminRegistration onRegister={async (formData) => {
// //             try {
// //               const res = await API.post('/register/admin', formData);
// //               if (res.data.success) {
// //                 alert("Admin Account Registered Successfully!");
// //                 handleAuth('admin', res.data.user);
// //               }
// //             } catch (err) {
// //               alert(err.response?.data?.message || "Admin Registration Failed");
// //             }
// //           }} />
// //         } />

// //         <Route path="/register/teacher" element={
// //           <TeacherRegistration 
// //             departments={departments} 
// //             onRegister={async (formData) => { 
// //               try { 
// //                 const res = await API.post('/register/teacher', formData); 
// //                 if (res.data.success) { 
// //                   alert("Teacher Registration Sent for Admin Approval!"); 
// //                   navigate('/login'); 
// //                 } 
// //               } catch (err) { alert("Registration Failed"); } 
// //             }} 
// //           />
// //         } />

// //         {/* 🛠️ PROTECTED DASHBOARD ROUTES */}
// //         <Route path="/dashboard/*" element={
// //           role ? (
// //             <DashboardLayout 
// //               userRole={role} 
// //               currentUser={currentUser} 
// //               currentPage={page} 
// //               setCurrentPage={setPage} 
// //               onLogout={handleLogout}
// //             >
              
// //               {page === 'overview' && (
// //                 <Overview 
// //                   departments={departments} 
// //                   teachersCount={approvedTeachers.length} 
// //                   studentsCount={allStudents.length} 
// //                   pendingTeachers={pendingRequests} 
// //                 />
// //               )}
              
// //               {page === 'departments' && (
// //                 <Departments 
// //                   userRole={role} 
// //                   departments={departments} 
// //                   onAddDept={async (d) => { await API.post('/departments', d); syncData(); }} 
// //                   onEditDept={async (id, d) => { await API.put(`/departments/${id}`, d); syncData(); }} 
// //                   onDeleteDept={async (id) => { await API.delete(`/departments/${id}`); syncData(); }} 
// //                 />
// //               )}
              
// //               {page === 'teachers' && <Teachers userRole={role} teachers={approvedTeachers} onRefresh={syncData} />}
              
// //               {page === 'students' && (
// //                 <Students 
// //                   userRole={role} 
// //                   batches={batches} 
// //                   allStudents={allStudents} 
// //                   onViewProfile={(student) => { setSelectedStudent(student); setPage('student-portal-view'); }}
// //                   onAddStudent={async (d) => { await API.post('/students', d); syncData(); }} 
// //                   onDeleteStudent={async (id) => { await API.delete(`/students/${id}`); syncData(); }} 
// //                   onAddBatch={async (b) => { await API.post('/batches', b); syncData(); }} 
// //                 />
// //               )}

// //               {page === 'student-portal-view' && selectedStudent && (
// //                 <div className="portal-container">
// //                   <button onClick={() => setPage('students')} className="mb-4 text-blue-400">← Back to Students</button>
// //                   <StudentPortal id={selectedStudent.id} isPreview={true} />
// //                 </div>
// //               )}
              
// //               {page === 'subjects' && (
// //                 <SubjectsManagement 
// //                   data={{ 
// //                     subjects: subjects, 
// //                     courses: departments, 
// //                     users: approvedTeachers, 
// //                     teacherAssignments: teacherAssignments 
// //                   }} 
// //                   updateData={async (updatedFullData) => { 
// //                     try {
// //                       // Logic for ADD, EDIT, DELETE
// //                       if (updatedFullData.action === 'edit') {
// //                         await API.put(`/subjects/${updatedFullData.subject.id}`, updatedFullData.subject);
// //                       } else if (updatedFullData.subjects.length > subjects.length) {
// //                         const newSub = updatedFullData.subjects[updatedFullData.subjects.length - 1];
// //                         await API.post('/subjects', newSub);
// //                       } else if (updatedFullData.subjects.length < subjects.length) {
// //                         const deletedId = subjects.find(s => !updatedFullData.subjects.find(us => us.id === s.id))?.id;
// //                         if (deletedId) await API.delete(`/subjects/${deletedId}`);
// //                       }
                      
// //                       // Teacher Assignments
// //                       if (updatedFullData.teacherAssignments?.length > teacherAssignments.length) {
// //                         const newAssign = updatedFullData.teacherAssignments[updatedFullData.teacherAssignments.length - 1];
// //                         await API.post('/assign-teacher', newAssign);
// //                       }
// //                       await syncData();
// //                     } catch (err) { console.error("Subject Operation Error", err); }
// //                   }} 
// //                 />
// //               )}

// //               {page === 'faculty-portal' && (
// //                 <FacultyPortal 
// //                   currentUser={currentUser} 
// //                   userRole={role}
// //                   onSaveMarks={async (marksData) => {
// //                     await API.post('/faculty/save-marks', marksData);
// //                     syncData();
// //                   }}
// //                 />
// //               )}
              
// //               {page === 'documents' && <DocumentVerification onRefresh={syncData} />}
              
// //               {page === 'reports' && (
// //                 <Reports 
// //                   data={{ departments, teachers: approvedTeachers, students: allStudents, subjects }} 
// //                 />
// //               )}
            
// //             </DashboardLayout>
// //           ) : <Navigate to="/login" />
// //         } />
        
// //         <Route path="*" element={<Navigate to="/" replace />} />
// //       </Routes>
// //     </div> 
// //   );
// // }







// import React, { useState, useEffect, useCallback } from 'react';
// import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
// import axios from 'axios';

// /* --- 1. IMPORT YOUR NEW HOME PAGE --- */
// import Home from './pages/Home';; 


// /* --- 2. IMPORT TEAM UI COMPONENTS --- */
// /* Based on your project structure screenshot */
// import Navbar from './pages/Navbar';
// import Hero from './pages/Hero'; // Kept for reference, but Home replaces this on main route
// import DashboardLayout from './layouts/DashboardLayout';
// import StarField from './components/StarField';

// /* --- 3. IMPORT PAGES --- */
// import Login from './pages/Login';
// import AdminRegistration from './pages/AdminRegistration';
// import TeacherRegistration from './pages/TeacherRegistration';
// import Overview from './pages/Overview';
// import Departments from './pages/Departments';
// import Teachers from './pages/Teachers';
// import Students from './pages/Students';
// import SubjectsManagement from './pages/SubjectsManagement';
// import DocumentVerification from './pages/DocumentVerification'; 
// import Reports from './pages/Reports'; 

// /* --- 4. IMPORT PORTALS (From assets folder) --- */
// import StudentPortal from './assets/StudentPortal';
// import FacultyPortal from './assets/FacultyPortal';

// // --- API INSTANCE ---
// const API = axios.create({ baseURL: 'http://localhost:5000/api' });

// export default function App() {
//   const navigate = useNavigate();
  
//   // Auth State
//   const [role, setRole] = useState(() => JSON.parse(localStorage.getItem('user_role')) || null);
//   const [currentUser, setCurrentUser] = useState(() => JSON.parse(localStorage.getItem('current_user')) || null);
//   const [page, setPage] = useState('overview');
//   const [selectedStudent, setSelectedStudent] = useState(null); 

//   // Data State
//   const [departments, setDepartments] = useState([]);
//   const [approvedTeachers, setApprovedTeachers] = useState([]);
//   const [pendingRequests, setPendingRequests] = useState([]);
//   const [allStudents, setAllStudents] = useState([]);
//   const [batches, setBatches] = useState([]);
//   const [subjects, setSubjects] = useState([]);
//   const [teacherAssignments, setTeacherAssignments] = useState([]);

//   // --- SYNC DATA FUNCTION ---
//   const syncData = useCallback(async () => {
//     try {
//       if (!role) return; 
//       const res = await API.get('/dashboard/data');
//       if (res.data) {
//         setDepartments(res.data.departments || []);
//         setApprovedTeachers(res.data.teachers || []);
//         setPendingRequests(res.data.pendingTeachers || []);
//         setAllStudents(res.data.students || []);
//         setBatches(res.data.batches || []);
//         setSubjects(res.data.subjects || []);
//         setTeacherAssignments(res.data.teacherAssignments || []);
//       }
//     } catch (err) { 
//       console.error("Master Sync failed. Ensure Node server is running."); 
//     }
//   }, [role]);

//   useEffect(() => { syncData(); }, [syncData]);

//   // --- LOGIN HANDLER ---
//   const handleAuth = (userRole, userData) => {
//     setRole(userRole);
//     setCurrentUser(userData);
//     localStorage.setItem('user_role', JSON.stringify(userRole));
//     localStorage.setItem('current_user', JSON.stringify(userData));
    
//     if (userRole === 'admin') {
//       navigate('/dashboard');
//     } else if (userRole === 'teacher') {
//       navigate(`/dashboard`); 
//       setPage('faculty-portal');
//     }
//   };

//   // --- LOGOUT HANDLER ---
//   const handleLogout = () => {
//     setRole(null);
//     setCurrentUser(null);
//     localStorage.clear();
//     navigate('/');
//   };

//   return (
//     <div className="App min-h-screen bg-[#0a0a0a] text-[#ccc]">
//       {/* Background Star Effect */}
//       <StarField />
      
//       <Routes>
//         {/* --- MAIN HOME ROUTE --- */}
//         {/* This loads your Home.js design when opening the site */}
//         <Route path="/" element={<Home />} />
        
//         {/* --- LOGIN ROUTE --- */}
//         <Route path="/login" element={role ? <Navigate to="/dashboard" /> : <Login onLoginSuccess={handleAuth} />} />
        
//         {/* --- PUBLIC PORTAL --- */}
//         <Route path="/student-portal/:id" element={<StudentPortal />} />

//         {/* --- REGISTRATION ROUTES --- */}
//         <Route path="/register/admin" element={
//           <AdminRegistration onRegister={async (formData) => {
//             try {
//               const res = await API.post('/register/admin', formData);
//               if (res.data.success) {
//                 alert("Admin Account Registered Successfully!");
//                 handleAuth('admin', res.data.user);
//               }
//             } catch (err) {
//               alert(err.response?.data?.message || "Admin Registration Failed");
//             }
//           }} />
//         } />

//         <Route path="/register/teacher" element={
//           <TeacherRegistration 
//             departments={departments} 
//             onRegister={async (formData) => { 
//               try { 
//                 const res = await API.post('/register/teacher', formData); 
//                 if (res.data.success) { 
//                   alert("Teacher Registration Sent for Admin Approval!"); 
//                   navigate('/login'); 
//                 } 
//               } catch (err) { alert("Registration Failed"); } 
//             }} 
//           />
//         } />

//         {/* --- DASHBOARD (PROTECTED) --- */}
//         <Route path="/dashboard/*" element={
//           role ? (
//             <DashboardLayout 
//               userRole={role} 
//               currentUser={currentUser} 
//               currentPage={page} 
//               setCurrentPage={setPage} 
//               onLogout={handleLogout}
//             >
              
//               {page === 'overview' && (
//                 <Overview 
//                   departments={departments} 
//                   teachersCount={approvedTeachers.length} 
//                   studentsCount={allStudents.length} 
//                   pendingTeachers={pendingRequests} 
//                 />
//               )}
              
//               {page === 'departments' && (
//                 <Departments 
//                   userRole={role} 
//                   departments={departments} 
//                   onAddDept={async (d) => { await API.post('/departments', d); syncData(); }} 
//                   onEditDept={async (id, d) => { await API.put(`/departments/${id}`, d); syncData(); }} 
//                   onDeleteDept={async (id) => { await API.delete(`/departments/${id}`); syncData(); }} 
//                 />
//               )}
              
//               {page === 'teachers' && <Teachers userRole={role} teachers={approvedTeachers} onRefresh={syncData} />}
              
//               {page === 'students' && (
//                 <Students 
//                   userRole={role} 
//                   batches={batches} 
//                   allStudents={allStudents} 
//                   onViewProfile={(student) => { setSelectedStudent(student); setPage('student-portal-view'); }}
//                   onAddStudent={async (d) => { await API.post('/students', d); syncData(); }} 
//                   onDeleteStudent={async (id) => { await API.delete(`/students/${id}`); syncData(); }} 
//                   onAddBatch={async (b) => { await API.post('/batches', b); syncData(); }} 
//                 />
//               )}

//               {page === 'student-portal-view' && selectedStudent && (
//                 <div className="portal-container">
//                   <button onClick={() => setPage('students')} className="mb-4 text-blue-400">← Back to Students</button>
//                   <StudentPortal id={selectedStudent.id} isPreview={true} />
//                 </div>
//               )}
              
//               {page === 'subjects' && (
//                 <SubjectsManagement 
//                   data={{ 
//                     subjects: subjects, 
//                     courses: departments, 
//                     users: approvedTeachers, 
//                     teacherAssignments: teacherAssignments 
//                   }} 
//                   updateData={async (updatedFullData) => { 
//                     try {
//                       if (updatedFullData.action === 'edit') {
//                         await API.put(`/subjects/${updatedFullData.subject.id}`, updatedFullData.subject);
//                       } else if (updatedFullData.subjects.length > subjects.length) {
//                         const newSub = updatedFullData.subjects[updatedFullData.subjects.length - 1];
//                         await API.post('/subjects', newSub);
//                       } else if (updatedFullData.subjects.length < subjects.length) {
//                         const deletedId = subjects.find(s => !updatedFullData.subjects.find(us => us.id === s.id))?.id;
//                         if (deletedId) await API.delete(`/subjects/${deletedId}`);
//                       }
                      
//                       if (updatedFullData.teacherAssignments?.length > teacherAssignments.length) {
//                         const newAssign = updatedFullData.teacherAssignments[updatedFullData.teacherAssignments.length - 1];
//                         await API.post('/assign-teacher', newAssign);
//                       }
//                       await syncData();
//                     } catch (err) { console.error("Subject Operation Error", err); }
//                   }} 
//                 />
//               )}

//               {page === 'faculty-portal' && (
//                 <FacultyPortal 
//                   currentUser={currentUser} 
//                   userRole={role}
//                   onSaveMarks={async (marksData) => {
//                     await API.post('/faculty/save-marks', marksData);
//                     syncData();
//                   }}
//                 />
//               )}
              
//               {page === 'documents' && <DocumentVerification onRefresh={syncData} />}
              
//               {page === 'reports' && (
//                 <Reports 
//                   data={{ departments, teachers: approvedTeachers, students: allStudents, subjects }} 
//                 />
//               )}
            
//             </DashboardLayout>
//           ) : <Navigate to="/login" />
//         } />
        
//         {/* Fallback Route */}
//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>
//     </div> 
//   );
// }


import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';

import Home from './pages/Home'; 
import DashboardLayout from './layouts/DashboardLayout';
import StarField from './components/StarField';

import Login from './pages/Login';
import AdminRegistration from './pages/AdminRegistration';
import TeacherRegistration from './pages/TeacherRegistration';
import Overview from './pages/Overview';
import Teachers from './pages/Teachers';
import Students from './pages/Students';
import SubjectsManagement from './pages/SubjectsManagement';
import Reports from './pages/Reports'; 

import StudentPortal from './assets/StudentPortal';
import FacultyPortal from './assets/FacultyPortal';

import GatewayView from './ResultManagement/GatewayView';
import MasterView from './ResultManagement/MasterView';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

export default function App() {
  const navigate = useNavigate();
  
  const [role, setRole] = useState(() => JSON.parse(localStorage.getItem('user_role')) || null);
  const [currentUser, setCurrentUser] = useState(() => JSON.parse(localStorage.getItem('current_user')) || null);
  const [page, setPage] = useState('overview');
  const [selectedStudent, setSelectedStudent] = useState(null); 

  const [departments, setDepartments] = useState([]);
  const [approvedTeachers, setApprovedTeachers] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [batches, setBatches] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teacherAssignments, setTeacherAssignments] = useState([]);

  const syncData = useCallback(async () => {
    try {
      if (!role) return; 
      const res = await API.get('/dashboard/data');
      if (res.data) {
        setDepartments(res.data.departments || []);
        setApprovedTeachers(res.data.teachers || []);
        setPendingRequests(res.data.pendingTeachers || []);
        setAllStudents(res.data.students || []);
        setBatches(res.data.batches || []);
        setSubjects(res.data.subjects || []);
        setTeacherAssignments(res.data.teacherAssignments || []);
      }
    } catch (err) { 
      console.error("Master Sync failed. Ensure Node server is running."); 
    }
  }, [role]);

  useEffect(() => { syncData(); }, [syncData]);

  const handleAuth = (userRole, userData) => {
    setRole(userRole);
    setCurrentUser(userData);
    localStorage.setItem('user_role', JSON.stringify(userRole));
    localStorage.setItem('current_user', JSON.stringify(userData));
    
    if (userRole === 'admin') {
      navigate('/dashboard');
    } else if (userRole === 'teacher') {
      navigate(`/dashboard`); 
      setPage('faculty-portal');
    }
  };

  const handleLogout = () => {
    setRole(null);
    setCurrentUser(null);
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="App min-h-screen bg-[#0a0a0a] text-[#ccc]">
      <StarField />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={role ? <Navigate to="/dashboard" /> : <Login onLoginSuccess={handleAuth} />} />
        <Route path="/student-portal/:id" element={<StudentPortal />} />

        <Route path="/register/admin" element={
          <AdminRegistration onRegister={async (formData) => {
            try {
              const res = await API.post('/register/admin', formData);
              if (res.data.success) {
                alert("Admin Account Registered Successfully!");
                handleAuth('admin', res.data.user);
              }
            } catch (err) {
              alert(err.response?.data?.message || "Admin Registration Failed");
            }
          }} />
        } />

        <Route path="/register/teacher" element={
          <TeacherRegistration 
            departments={departments} 
            onRegister={async (formData) => { 
              try { 
                const res = await API.post('/register/teacher', formData); 
                if (res.data.success) { 
                  alert("Teacher Registration Sent for Admin Approval!"); 
                  navigate('/login'); 
                } 
              } catch (err) { alert("Registration Failed"); } 
            }} 
          />
        } />

        <Route path="/dashboard/*" element={
          role ? (
            <DashboardLayout 
              userRole={role} 
              currentUser={currentUser} 
              currentPage={page} 
              setCurrentPage={setPage} 
              onLogout={handleLogout}
            >
              {page === 'overview' && (
                <Overview 
                  departments={departments} 
                  teachersCount={approvedTeachers.length} 
                  studentsCount={allStudents.length} 
                  pendingTeachers={pendingRequests} 
                />
              )}
              {page === 'teachers' && <Teachers userRole={role} teachers={approvedTeachers} onRefresh={syncData} />}
              {page === 'students' && (
                <Students 
                  userRole={role} 
                  batches={batches} 
                  allStudents={allStudents} 
                  onViewProfile={(student) => { setSelectedStudent(student); setPage('student-portal-view'); }}
                  onAddStudent={async (d) => { await API.post('/students', d); syncData(); }} 
                  onDeleteStudent={async (id) => { await API.delete(`/students/${id}`); syncData(); }} 
                  onAddBatch={async (b) => { await API.post('/batches', b); syncData(); }} 
                />
              )}
              {page === 'student-portal-view' && selectedStudent && (
                <div className="portal-container">
                  <button onClick={() => setPage('students')} className="mb-4 text-blue-400">← Back to Students</button>
                  <StudentPortal id={selectedStudent.id} isPreview={true} />
                </div>
              )}
              {page === 'subjects' && (
                <SubjectsManagement 
                  data={{ 
                    subjects: subjects, 
                    courses: departments, 
                    users: approvedTeachers, 
                    teacherAssignments: teacherAssignments 
                  }} 
                  updateData={async (updatedFullData) => { 
                    try {
                      if (updatedFullData.action === 'edit') {
                        await API.put(`/subjects/${updatedFullData.subject.id}`, updatedFullData.subject);
                      } else if (updatedFullData.subjects.length > subjects.length) {
                        const newSub = updatedFullData.subjects[updatedFullData.subjects.length - 1];
                        await API.post('/subjects', newSub);
                      } else if (updatedFullData.subjects.length < subjects.length) {
                        const deletedId = subjects.find(s => !updatedFullData.subjects.find(us => us.id === s.id))?.id;
                        if (deletedId) await API.delete(`/subjects/${deletedId}`);
                      }
                      if (updatedFullData.teacherAssignments?.length > teacherAssignments.length) {
                        const newAssign = updatedFullData.teacherAssignments[updatedFullData.teacherAssignments.length - 1];
                        await API.post('/assign-teacher', newAssign);
                      }
                      await syncData();
                    } catch (err) { console.error("Subject Operation Error", err); }
                  }} 
                />
              )}
              {page === 'faculty-portal' && (
                <FacultyPortal 
                  currentUser={currentUser} 
                  userRole={role}
                  onSaveMarks={async (marksData) => {
                    await API.post('/faculty/save-marks', marksData);
                    syncData();
                  }}
                />
              )}
              {page === 'reports' && (
                <Reports data={{ departments, teachers: approvedTeachers, students: allStudents, subjects }} />
              )}
            </DashboardLayout>
          ) : <Navigate to="/login" />
        } />
        
        {/* --- LIGHT THEME WRAPPERS FOR RESULT MANAGEMENT --- */}
        <Route path="/results" element={
          role ? (
            <div className="bg-[#f4f7fb] text-slate-800 h-screen w-screen overflow-hidden text-left font-sans">
              <GatewayView userRole={role} currentUser={currentUser} setCurrentPage={setPage} onLogout={handleLogout} />
            </div>
          ) : <Navigate to="/login" />
        } />
        
        <Route path="/results/master/:batchId" element={
          role ? (
            <div className="bg-[#f4f7fb] text-slate-800 h-screen w-screen overflow-hidden text-left font-sans">
              <MasterView userRole={role} currentUser={currentUser} setCurrentPage={setPage} onLogout={handleLogout} />
            </div>
          ) : <Navigate to="/login" />
        } />

        <Route path="*" element={<Navigate to="/" replace />} />

        {/* --- RESULT MANAGEMENT ROUTES --- */}
        <Route path="/results" element={
          role ? (
            <div className="absolute inset-0 z-50 bg-[#f4f7fb] text-slate-800 min-h-screen w-full font-sans overflow-auto text-left">
              <GatewayView userRole={role} currentUser={currentUser} setCurrentPage={setPage} onLogout={handleLogout} />
            </div>
          ) : <Navigate to="/login" />
        } />
        
        <Route path="/results/master/:batchId" element={
          role ? (
            <div className="absolute inset-0 z-50 bg-[#f4f7fb] text-slate-800 min-h-screen w-full font-sans overflow-hidden text-left">
              <MasterView userRole={role} currentUser={currentUser} setCurrentPage={setPage} onLogout={handleLogout} />
            </div>
          ) : <Navigate to="/login" />
        } />
      </Routes>
    </div> 
  );
}