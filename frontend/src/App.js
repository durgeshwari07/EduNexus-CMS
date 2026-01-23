// //   // import React, { useState, useEffect } from 'react';
// //   // import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
// //   // import axios from 'axios';

// //   // /* --- LANDING PAGE COMPONENTS --- */
// //   // import Navbar from './pages/Navbar';
// //   // import Hero from './pages/Hero';
// //   // import FeatureShowcase from './pages/Featureshowcase';
// //   // import UserGrid from './pages/UserGrid';

// //   // /* --- UI SHELL --- */
// //   // import DashboardLayout from './layouts/DashboardLayout';
// //   // import StarField from './components/StarField';

// //   // /* --- PAGES --- */
// //   // import CollegeManagementSystem from './pages/CollegeManagementSystem';
// //   // import AdminRegistration from './pages/AdminRegistration';
// //   // import TeacherRegistration from './pages/TeacherRegistration';
// //   // import Login from './pages/Login';
// //   // import Overview from './pages/Overview';
// //   // import Departments from './pages/Departments';
// //   // import Teachers from './pages/Teachers';
// //   // import Students from './pages/Students';
// //   // import Reports from './pages/Reports';
// //   // // Removed curly braces to prevent "got: object" error
// //   // import SubjectsManagement from './pages/SubjectsManagement';

// //   // const API = axios.create({ baseURL: 'http://localhost:5000/api' });

// //   // const getInitialData = (key, fallback) => {
// //   //   try {
// //   //     const saved = localStorage.getItem(key);
// //   //     if (!saved || saved === "null" || saved === "undefined") return fallback;
// //   //     return JSON.parse(saved);
// //   //   } catch (e) { return fallback; }
// //   // };

// //   // export default function App() {
// //   //   const navigate = useNavigate();

// //   //   // --- GLOBAL STATE ---
// //   //   const [role, setRole] = useState(() => getInitialData('user_role', null));
// //   //   const [currentUser, setCurrentUser] = useState(() => getInitialData('current_user', null));
// //   //   const [page, setPage] = useState('overview');
    
// //   //   const [departments, setDepartments] = useState(() => getInitialData('depts', []));
// //   //   const [approvedTeachers, setApprovedTeachers] = useState(() => getInitialData('teachers', []));
// //   //   const [pendingRequests, setPendingRequests] = useState(() => getInitialData('pending_teachers', []));
    
// //   //   const [batches, setBatches] = useState(() => getInitialData('batches', []));
// //   //   const [allStudents, setAllStudents] = useState(() => getInitialData('students', []));
// //   //   const [subjects, setSubjects] = useState(() => getInitialData('subjects', []));
// //   //   const [teacherAssignments, setTeacherAssignments] = useState(() => getInitialData('assignments', []));
// //   //   const [divisions, setDivisions] = useState(() => getInitialData('divisions', []));
// //   //   const [academicYears, setAcademicYears] = useState(() => getInitialData('academic_years', []));

// //   //   // --- SYNC EFFECTS ---
// //   //   useEffect(() => {
// //   //     const fetchSystemData = async () => {
// //   //       try {
// //   //         const res = await API.get('/dashboard/data');
// //   //         if (res.data) {
// //   //           setDepartments(res.data.departments || []);
// //   //           setApprovedTeachers(res.data.teachers || []);
// //   //           setPendingRequests(res.data.pendingTeachers || []);
// //   //         }
// //   //       } catch (err) { console.warn("Backend offline."); }
// //   //     };
// //   //     if (role) fetchSystemData();
// //   //   }, [role]);

// //   //   useEffect(() => {
// //   //     localStorage.setItem('user_role', JSON.stringify(role));
// //   //     localStorage.setItem('current_user', JSON.stringify(currentUser));
// //   //     localStorage.setItem('depts', JSON.stringify(departments));
// //   //     localStorage.setItem('teachers', JSON.stringify(approvedTeachers));
// //   //     localStorage.setItem('pending_teachers', JSON.stringify(pendingRequests));
// //   //     localStorage.setItem('batches', JSON.stringify(batches));
// //   //     localStorage.setItem('students', JSON.stringify(allStudents));
// //   //     localStorage.setItem('subjects', JSON.stringify(subjects));
// //   //     localStorage.setItem('assignments', JSON.stringify(teacherAssignments));
// //   //     localStorage.setItem('divisions', JSON.stringify(divisions));
// //   //     localStorage.setItem('academic_years', JSON.stringify(academicYears));
// //   //   }, [role, currentUser, departments, approvedTeachers, pendingRequests, batches, allStudents, subjects, teacherAssignments, divisions, academicYears]);

// //   //   // --- HANDLERS ---
// //   //   const handleLoginSuccess = (userRole, userData) => {
// //   //     setRole(userRole);
// //   //     setCurrentUser(userData);
// //   //     navigate('/dashboard'); 
// //   //   };

// //   //   const handleLogout = () => {
// //   //     setRole(null);
// //   //     setCurrentUser(null);
// //   //     localStorage.clear();
// //   //     navigate('/');
// //   //   };

// //   //   const NavWrapper = () => (
// //   //     <Navbar 
// //   //       onLoginClick={() => navigate('/login')}
// //   //       onLogoClick={() => navigate('/')}
// //   //       onRegisterAdmin={() => navigate('/register/admin')}
// //   //       onRegisterTeacher={() => navigate('/register/teacher')}
// //   //     />
// //   //   );

// //   //   return (
// //   //     <div className="App min-h-screen bg-[#0a0a0a] text-[#ccc]">
// //   //       <StarField />
// //   //       <Routes>
// //   //         <Route path="/" element={
// //   //           <>
// //   //             <NavWrapper />
// //   //             <main>
// //   //               <Hero onLoginClick={() => navigate('/login')} />
// //   //               <FeatureShowcase />
// //   //               <UserGrid />
// //   //             </main>
// //   //           </>
// //   //         } />

// //   //         <Route path="/login" element={<><NavWrapper /><Login onLogin={handleLoginSuccess} /></>} />
// //   //         <Route path="/register/admin" element={<><NavWrapper /><AdminRegistration onRegister={(name) => handleLoginSuccess('admin', {name})} /></>} />
// //   //         <Route path="/register/teacher" element={<><NavWrapper /><TeacherRegistration onRegister={(d) => console.log(d)} /></>} />

// //   //         <Route path="/dashboard/*" element={
// //   //           role ? (
// //   //             <DashboardLayout 
// //   //               userRole={role} 
// //   //               currentUser={currentUser}
// //   //               currentPage={page} 
// //   //               setCurrentPage={setPage} 
// //   //               onLogout={handleLogout}
// //   //             >
// //   //               {page === 'overview' && <Overview userRole={role} pendingTeachers={pendingRequests} teachersCount={approvedTeachers.length} departments={departments} />}
// //   //               {/* {page === 'departments' && <Departments userRole={role} departments={departments} onAddDept={(d) => setDepartments([...departments, d])} />} */}
// //   //               {page === 'teachers' && <Teachers teachers={approvedTeachers} departments={departments} />}
// //   //               {page === 'subjects' && <SubjectsManagement data={{ subjects, courses: departments, users: approvedTeachers }} updateData={(u) => setSubjects(u.subjects)} />}
// //   //               {page === 'students' && <Students userRole={role} batches={batches} allStudents={allStudents} />}
// //   //               {page === 'reports' && <Reports />}

// //   //               {/* --- UPDATED DEPARTMENTS ROUTE --- */}
// //   //               {page === 'departments' && (
// //   //                 <Departments 
// //   //                   userRole={role} 
// //   //                   departments={departments} 
// //   //                   // 1. DELETE LOGIC
// //   //                   onDeleteDept={(id) => {
// //   //                     if(window.confirm("Are you sure you want to delete this department?")) {
// //   //                       setDepartments(prev => prev.filter(d => d.id !== id));
// //   //                     }
// //   //                   }}
// //   //                   // 2. EDIT LOGIC
// //   //                   onEditDept={(updatedDept) => {
// //   //                     setDepartments(prev => 
// //   //                       prev.map(d => d.id === updatedDept.id ? updatedDept : d)
// //   //                     );
// //   //                   }}
// //   //                   // 3. ADD LOGIC
// //   //                   onAddDept={(newDept) => {
// //   //                     setDepartments(prev => [...prev, { ...newDept, id: Date.now() }]);
// //   //                   }} 
// //   //                 />
// //   //               )}
               
// //   //             </DashboardLayout>
// //   //           ) : <Navigate to="/login" />
// //   //         } />
// //   //       </Routes>
// //   //     </div>
// //   //   );
// //   // }



// //   import React, { useState, useEffect } from 'react';
// // import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
// // import axios from 'axios';

// // /* COMPONENTS */
// // import Navbar from './pages/Navbar';
// // import DashboardLayout from './layouts/DashboardLayout';
// // import StarField from './components/StarField';

// // /* PAGES */
// // import Overview from './pages/Overview';
// // import Departments from './pages/Departments';
// // import Teachers from './pages/Teachers';
// // import Students from './pages/Students';
// // import Login from './pages/Login';

// // const API = axios.create({ baseURL: 'http://localhost:5000/api' });

// // export default function App() {
// //   const navigate = useNavigate();
// //   const [role, setRole] = useState(JSON.parse(localStorage.getItem('user_role')) || null);
// //   const [page, setPage] = useState('overview');
  
// //   // SHARED STATE
// //   const [departments, setDepartments] = useState([]);
// //   const [batches, setBatches] = useState([]);
// //   const [allStudents, setAllStudents] = useState([]);
// //   const [approvedTeachers, setApprovedTeachers] = useState([]);
// //   const [pendingRequests, setPendingRequests] = useState([]);

// //   // 1. DATA SYNC
// //   useEffect(() => {
// //     const sync = async () => {
// //       try {
// //         const res = await API.get('/dashboard/data');
// //         setDepartments(res.data.departments || []);
// //         setApprovedTeachers(res.data.teachers || []);
// //         setPendingRequests(res.data.pendingTeachers || []);
// //         setAllStudents(res.data.students || []);
// //         setBatches(res.data.batches || []);
// //       } catch (err) { console.error("Sync Failed"); }
// //     };
// //     if (role) sync();
// //   }, [role]);

// //   // 2. HANDLERS
// //   const handleAddStudent = async (s) => {
// //     const res = await API.post('/students', s);
// //     if (res.data.success) setAllStudents(prev => [...prev, { ...s, id: res.data.id }]);
// //   };

// //   const handleAddBatch = async (b) => {
// //     const res = await API.post('/batches', b);
// //     if (res.data.success) setBatches(prev => [...prev, { ...b, id: res.data.id }]);
// //   };

// //   const handleAddDept = async (d) => {
// //     const res = await API.post('/departments', d);
// //     if (res.data.success) setDepartments([...departments, { ...d, id: res.data.id }]);
// //   };

// //   const handleDeleteDept = async (id) => {
// //     if(window.confirm("Delete Department?")) {
// //       await API.delete(`/departments/${id}`);
// //       setDepartments(departments.filter(d => d.id !== id));
// //     }
// //   };

// //   return (
// //     <div className="App min-h-screen bg-[#0a0a0a] text-[#ccc]">
// //       <StarField />
// //       <Routes>
// //         <Route path="/" element={<Navbar onLoginClick={() => navigate('/login')} />} />
// //         <Route path="/login" element={<Login onLogin={(r) => { setRole(r); navigate('/dashboard'); }} />} />
        
// //         <Route path="/dashboard/*" element={
// //           role ? (
// //             <DashboardLayout userRole={role} currentPage={page} setCurrentPage={setPage} onLogout={() => {setRole(null); navigate('/');}}>
              
// //               {page === 'overview' && (
// //                 <Overview 
// //                   departments={departments} 
// //                   teachersCount={approvedTeachers.length} 
// //                   studentsCount={allStudents.length} 
// //                   pendingTeachers={pendingRequests} 
// //                 />
// //               )}

// //               {page === 'students' && (
// //                 <Students 
// //                   userRole={role} 
// //                   batches={batches} 
// //                   allStudents={allStudents} 
// //                   onAddBatch={handleAddBatch} 
// //                   onAddStudent={handleAddStudent} 
// //                 />
// //               )}

// //               {page === 'departments' && (
// //                 <Departments 
// //                   departments={departments} 
// //                   onAddDept={handleAddDept} 
// //                   onDeleteDept={handleDeleteDept} 
// //                 />
// //               )}

// //               {page === 'teachers' && <Teachers teachers={approvedTeachers} departments={departments} />}

// //             </DashboardLayout>
// //           ) : <Navigate to="/login" />
// //         } />
// //       </Routes>
// //     </div>
// //   );
// // }



// import React, { useState, useEffect } from 'react';
// import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
// import axios from 'axios';

// /* COMPONENTS */
// import Navbar from './pages/Navbar';
// import DashboardLayout from './layouts/DashboardLayout';
// import StarField from './components/StarField';

// /* PAGES */
// import Overview from './pages/Overview';
// import Departments from './pages/Departments';
// import Teachers from './pages/Teachers';
// import Students from './pages/Students';
// import SubjectsManagement from './pages/SubjectsManagement';
// import Reports from './pages/Reports';
// import Login from './pages/Login';

// const API = axios.create({ baseURL: 'http://localhost:5000/api' });

// export default function App() {
//   const navigate = useNavigate();
//   const [role, setRole] = useState(JSON.parse(localStorage.getItem('user_role')) || null);
//   const [page, setPage] = useState('overview');
  
//   // SHARED GLOBAL STATE
//   const [departments, setDepartments] = useState([]);
//   const [batches, setBatches] = useState([]);
//   const [allStudents, setAllStudents] = useState([]);
//   const [approvedTeachers, setApprovedTeachers] = useState([]);
//   const [pendingRequests, setPendingRequests] = useState([]);
//   const [subjects, setSubjects] = useState([]);

//   // 1. DATA SYNC FROM BACKEND
//   useEffect(() => {
//     const syncData = async () => {
//       try {
//         const res = await API.get('/dashboard/data');
//         setDepartments(res.data.departments || []);
//         setApprovedTeachers(res.data.teachers || []);
//         setPendingRequests(res.data.pendingTeachers || []);
//         setAllStudents(res.data.students || []);
//         setBatches(res.data.batches || []);
//         setSubjects(res.data.subjects || []);
//       } catch (err) { 
//         console.error("Database sync failed. Check if server is running."); 
//       }
//     };
//     if (role) syncData();
//   }, [role]);

//   // 2. HANDLERS (Connected to Backend)
//   const handleAddStudent = async (s) => {
//     const res = await API.post('/students', s);
//     if (res.data.success) setAllStudents(prev => [...prev, { ...s, id: res.data.id }]);
//   };

//   const handleAddBatch = async (b) => {
//     const res = await API.post('/batches', b);
//     if (res.data.success) setBatches(prev => [...prev, { ...b, id: res.data.id }]);
//   };

//   const handleAddDept = async (d) => {
//     const res = await API.post('/departments', d);
//     if (res.data.success) setDepartments([...departments, { ...d, id: res.data.id }]);
//   };

//   const handleDeleteDept = async (id) => {
//     if(window.confirm("Delete Department?")) {
//       await API.delete(`/departments/${id}`);
//       setDepartments(departments.filter(d => d.id !== id));
//     }
//   };

//   // const handleAddSubject = async (subData) => {
//   //   try {
//   //     const res = await API.post('/subjects', subData);
//   //     if (res.data.success) setSubjects(prev => [...prev, { ...subData, id: res.data.id }]);
//   //   } catch (err) { alert("Error adding subject."); }
//   // };

//  const handleAddSubject = async (subjectData) => {
//   try {
//     const res = await API.post('/subjects', subjectData);
//     if (res.data.success) {
//       // Add the new subject to state so it appears in the table instantly
//       setSubjects(prev => [...prev, { ...subjectData, id: res.data.id }]);
//     }
//   } catch (err) {
//     console.error("Failed to add subject:", err.message);
//   }
// };

//   return (
//     <div className="App min-h-screen bg-[#0a0a0a] text-[#ccc]">
//       <StarField />
//       <Routes>
//         <Route path="/" element={<Navbar onLoginClick={() => navigate('/login')} />} />
//         <Route path="/login" element={<Login onLogin={(r) => { setRole(r); navigate('/dashboard'); }} />} />
        
//         <Route path="/dashboard/*" element={
//           role ? (
//             <DashboardLayout userRole={role} currentPage={page} setCurrentPage={setPage} onLogout={() => {setRole(null); navigate('/');}}>
              
//               {/* PAGE 1: OVERVIEW */}
//               {page === 'overview' && (
//                 <Overview 
//                   departments={departments} 
//                   teachersCount={approvedTeachers.length} 
//                   studentsCount={allStudents.length} 
//                   pendingTeachers={pendingRequests} 
//                 />
//               )}

//               {/* PAGE 2: STUDENTS & BATCHES */}
//               {page === 'students' && (
//                 <Students 
//                   userRole={role} 
//                   batches={batches} 
//                   allStudents={allStudents} 
//                   onAddBatch={handleAddBatch} 
//                   onAddStudent={handleAddStudent} 
//                 />
//               )}

//               {/* PAGE 3: DEPARTMENTS */}
//               {page === 'departments' && (
//                 <Departments 
//                   departments={departments} 
//                   onAddDept={handleAddDept} 
//                   onDeleteDept={handleDeleteDept} 
//                 />
//               )}

//               {/* PAGE 4: TEACHERS */}
//               {page === 'teachers' && <Teachers teachers={approvedTeachers} departments={departments} />}

//               {/* PAGE 5: SUBJECTS (Fixed the 404/Missing error) */}
//               {/* {page === 'subjects' && (
//                 <SubjectsManagement 
//                   data={{ subjects, courses: departments, users: approvedTeachers }} 
//                   updateData={(d) => handleAddSubject(d)} 
//                 />
//               )} */}
              
//                 {page === 'subjects' && (
//                   <SubjectsManagement 
//                     data={{ 
//                       subjects: subjects || [], 
//                       courses: departments || [], 
//                       users: approvedTeachers || [] 
//                     }} 
//                     updateData={handleAddSubject} 
//                   />
//                 )}


//               {/* PAGE 6: REPORTS */}
//               {page === 'reports' && <Reports />}

//             </DashboardLayout>
//           ) : <Navigate to="/login" />
//         } />
//       </Routes>
//     </div>
//   );
// }

// import React, { useState, useEffect, useCallback } from 'react';
// import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
// import axios from 'axios';

// /* UI & SHELL */
// import Navbar from './pages/Navbar';
// import Hero from './pages/Hero';
// import FeatureShowcase from './pages/Featureshowcase';
// import UserGrid from './pages/UserGrid';
// import DashboardLayout from './layouts/DashboardLayout';
// import StarField from './components/StarField';

// /* PAGES */
// import Login from './pages/Login';
// import AdminRegistration from './pages/AdminRegistration';
// import TeacherRegistration from './pages/TeacherRegistration';
// import Overview from './pages/Overview';
// import Departments from './pages/Departments';
// import Teachers from './pages/Teachers';
// import Students from './pages/Students';
// import SubjectsManagement from './pages/SubjectsManagement';

// const API = axios.create({ baseURL: 'http://localhost:5000/api' });

// export default function App() {
//   const navigate = useNavigate();
  
//   // --- AUTH STATE ---
//   const [role, setRole] = useState(() => JSON.parse(localStorage.getItem('user_role')) || null);
//   const [currentUser, setCurrentUser] = useState(() => JSON.parse(localStorage.getItem('current_user')) || null);
//   const [page, setPage] = useState('overview');

//   // --- SYSTEM DATA STATE ---
//   const [departments, setDepartments] = useState([]);
//   const [approvedTeachers, setApprovedTeachers] = useState([]);
//   const [pendingRequests, setPendingRequests] = useState([]);
//   const [allStudents, setAllStudents] = useState([]);
//   const [batches, setBatches] = useState([]);
//   const [subjects, setSubjects] = useState([]);

//   // --- MASTER SYNC FUNCTION ---
//   // Memoized so it can be called after any "Add" action to refresh the UI
//   const syncData = useCallback(async () => {
//     try {
//       const res = await API.get('/dashboard/data');
//       if (res.data) {
//         setDepartments(res.data.departments || []);
//         setApprovedTeachers(res.data.teachers || []);
//         setPendingRequests(res.data.pendingTeachers || []);
//         setAllStudents(res.data.students || []);
//         setBatches(res.data.batches || []);
//         setSubjects(res.data.subjects || []);
//       }
//     } catch (err) {
//       console.error("Database Sync failed. Ensure server.js is running.");
//     }
//   }, []);

//   // Initial Sync on Load or Login
//   useEffect(() => {
//     if (role || page === 'overview') syncData();
//   }, [role, page, syncData]);

//   // --- AUTH HANDLERS ---
//   const handleAuth = (userRole, userData) => {
//     setRole(userRole);
//     setCurrentUser(userData);
//     localStorage.setItem('user_role', JSON.stringify(userRole));
//     localStorage.setItem('current_user', JSON.stringify(userData));
//     navigate('/dashboard');
//   };

//   const handleLogout = () => {
//     setRole(null);
//     setCurrentUser(null);
//     localStorage.clear();
//     navigate('/');
//   };

//   // --- UI WRAPPERS ---
//   const NavWrapper = () => (
//     <Navbar 
//       onLoginClick={() => navigate('/login')}
//       onLogoClick={() => navigate('/')}
//       onRegisterAdmin={() => navigate('/register/admin')}
//       onRegisterTeacher={() => navigate('/register/teacher')}
//     />
//   );

//   return (
//     <div className="App min-h-screen bg-[#0a0a0a] text-[#ccc]">
//       <StarField />
//       <Routes>
        
//         {/* 1. LANDING PAGE */}
//         <Route path="/" element={
//           <>
//             <NavWrapper />
//             <main>
//               <Hero onLoginClick={() => navigate('/login')} />
//               <FeatureShowcase />
//               <UserGrid />
//             </main>
//           </>
//         } />

//         {/* 2. AUTHENTICATION (Redirects if already logged in) */}
//         <Route path="/login" element={
//           role ? <Navigate to="/dashboard" /> : <><NavWrapper /><Login onLogin={handleAuth} /></>
//         } />
        
//         <Route path="/register/admin" element={
//           <><NavWrapper /><AdminRegistration onRegister={(d) => handleAuth('admin', d)} /></>
//         } />
        
//         {/* 3. TEACHER REGISTRATION (Integrated with DB) */}
//         <Route path="/register/teacher" element={
//           <>
//             <NavWrapper />
//             <TeacherRegistration 
//               departments={departments} 
//               onRegister={async (formData) => {
//                 try {
//                   const res = await API.post('/register/teacher', formData);
//                   if (res.data.success) {
//                     alert("Registration Successful!");
//                     syncData(); // Refresh teachers list
//                     navigate('/login'); 
//                   }
//                 } catch (err) {
//                   alert("Registration Error. Check server console.");
//                 }
//               }} 
//             />
//           </>
//         } />

//         {/* 4. PROTECTED DASHBOARD AREA */}
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
//                   onAddDept={async (d) => { 
//                     await API.post('/departments', d); 
//                     syncData(); // Refresh departments after adding
//                   }} 
//                 />
//               )}

//               {page === 'teachers' && (
//                 <Teachers userRole={role} teachers={approvedTeachers} />
//               )}

//               {page === 'students' && (
//                 <Students 
//                   userRole={role} 
//                   batches={batches} 
//                   allStudents={allStudents} 
//                   onAddStudent={async (s) => { 
//                     await API.post('/students', s); 
//                     syncData(); // Refresh students after adding
//                   }} 
//                   onAddBatch={async (b) => { 
//                     await API.post('/batches', b); 
//                     syncData(); // Refresh batches after adding
//                   }} 
//                 />
//               )}

//               {page === 'subjects' && (
//                 <SubjectsManagement 
//                   data={{ subjects, courses: departments, users: approvedTeachers }} 
//                   updateData={async (sub) => { 
//                     await API.post('/subjects', sub); 
//                     syncData(); // Refresh subjects after adding
//                   }} 
//                 />
//               )}
//             </DashboardLayout>
//           ) : <Navigate to="/login" />
//         } />
//       </Routes>
//     </div>
//   );
// }



// import React, { useState, useEffect, useCallback } from 'react';
// import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
// import axios from 'axios';

// /* UI & SHELL */
// import Navbar from './pages/Navbar';
// import Hero from './pages/Hero';
// import FeatureShowcase from './pages/Featureshowcase';
// import UserGrid from './pages/UserGrid';
// import DashboardLayout from './layouts/DashboardLayout';
// import StarField from './components/StarField';

// /* PAGES */
// import Login from './pages/Login';
// import AdminRegistration from './pages/AdminRegistration';
// import TeacherRegistration from './pages/TeacherRegistration';
// import Overview from './pages/Overview';
// import Departments from './pages/Departments';
// import Teachers from './pages/Teachers';
// import Students from './pages/Students';
// import SubjectsManagement from './pages/SubjectsManagement';

// const API = axios.create({ baseURL: 'http://localhost:5000/api' });

// export default function App() {
//   const navigate = useNavigate();
  
//   const [role, setRole] = useState(() => JSON.parse(localStorage.getItem('user_role')) || null);
//   const [currentUser, setCurrentUser] = useState(() => JSON.parse(localStorage.getItem('current_user')) || null);
//   const [page, setPage] = useState('overview');

//   const [departments, setDepartments] = useState([]);
//   const [approvedTeachers, setApprovedTeachers] = useState([]);
//   const [pendingRequests, setPendingRequests] = useState([]);
//   const [allStudents, setAllStudents] = useState([]);
//   const [batches, setBatches] = useState([]);
//   const [subjects, setSubjects] = useState([]);

//   // MASTER SYNC - Now available for all sub-pages
//   const syncData = useCallback(async () => {
//     try {
//       const res = await API.get('/dashboard/data');
//       if (res.data) {
//         setDepartments(res.data.departments || []);
//         setApprovedTeachers(res.data.teachers || []);
//         setPendingRequests(res.data.pendingTeachers || []);
//         setAllStudents(res.data.students || []);
//         setBatches(res.data.batches || []);
//         setSubjects(res.data.subjects || []);
//       }
//     } catch (err) { console.error("Sync failed."); }
//   }, []);

//   useEffect(() => {
//     if (role || page === 'overview') syncData();
//   }, [role, page, syncData]);

//   const handleAuth = (userRole, userData) => {
//     setRole(userRole);
//     setCurrentUser(userData);
//     localStorage.setItem('user_role', JSON.stringify(userRole));
//     localStorage.setItem('current_user', JSON.stringify(userData));
//     navigate('/dashboard');
//   };

//   const handleLogout = () => {
//     setRole(null);
//     setCurrentUser(null);
//     localStorage.clear();
//     navigate('/');
//   };

//   const NavWrapper = () => (
//     <Navbar 
//       onLoginClick={() => navigate('/login')}
//       onLogoClick={() => navigate('/')}
//       onRegisterAdmin={() => navigate('/register/admin')}
//       onRegisterTeacher={() => navigate('/register/teacher')}
//     />
//   );

//   return (
//     <div className="App min-h-screen bg-[#0a0a0a] text-[#ccc]">
//       <StarField />
//       <Routes>
//         <Route path="/" element={<><NavWrapper /><main><Hero onLoginClick={() => navigate('/login')} /><FeatureShowcase /><UserGrid /></main></>} />
        
//         <Route path="/login" element={role ? <Navigate to="/dashboard" /> : <><NavWrapper /><Login onLogin={handleAuth} /></>} />
        
//         <Route path="/register/admin" element={<><NavWrapper /><AdminRegistration onRegister={(d) => handleAuth('admin', d)} /></>} />
        
//         <Route path="/register/teacher" element={
//           <><NavWrapper />
//             <TeacherRegistration departments={departments} onRegister={async (formData) => {
//               try {
//                 const res = await API.post('/register/teacher', formData);
//                 if (res.data.success) { alert("Registration Successful!"); syncData(); navigate('/login'); }
//               } catch (err) { alert("Registration Error."); }
//             }} />
//           </>
//         } />

//         <Route path="/dashboard/*" element={
//           role ? (
//             <DashboardLayout userRole={role} currentUser={currentUser} currentPage={page} setCurrentPage={setPage} onLogout={handleLogout}>
//               {page === 'overview' && <Overview departments={departments} teachersCount={approvedTeachers.length} studentsCount={allStudents.length} pendingTeachers={pendingRequests} />}
              
//               {/* {page === 'departments' && <Departments userRole={role} departments={departments} 
//                 onAddDept={async (d) => { await API.post('/departments', d); syncData(); }} 
//                 onDeleteDept={async (id) => { await API.delete(`/departments/${id}`); syncData(); }} 
//               />} */}

//               {/* Look for this section in your App.js */}
// {page === 'departments' && (
//   <Departments 
//     userRole={role} 
//     departments={departments} 
//     onAddDept={async (deptData) => { 
//       try {
//         // 1. Send the data to the backend
//         const res = await API.post('/departments', deptData); 
        
//         if (res.data.success) {
//           alert("Department added successfully!");
//           // 2. CRITICAL: Refresh the master data so the new dept shows up
//           syncData(); 
//         }
//       } catch (err) {
//         console.error("Failed to add department:", err.response?.data || err.message);
//         alert("Error: Check if the Department Code already exists.");
//       }
//     }} 
//     onDeleteDept={async (id) => {
//       if(window.confirm("Delete this department?")) {
//         await API.delete(`/departments/${id}`);
//         syncData();
//       }
//     }}
//   />
// )}

//               {page === 'teachers' && <Teachers userRole={role} teachers={approvedTeachers} onRefresh={syncData} />}

//               {page === 'students' && <Students userRole={role} batches={batches} allStudents={allStudents} 
//                 // onAddStudent={async (s) => { await API.post('/students', s); syncData(); }} 
//                 // Inside App.js -> Students Component
//                 onAddStudent={async (studentData) => { 
//                   try {
//                     const res = await API.post('/students', studentData); 
//                     if (res.data.success) {
//                       alert("Student added successfully!");
//                       syncData(); // Refresh the list
//                     }
//                   } catch (err) {
//                     console.error("Student addition failed:", err);
//                     alert("Error adding student. Check if Enrollment No already exists.");
//                   }
//                 }}
//                 onAddBatch={async (b) => { await API.post('/batches', b); syncData(); }} 
//               />}

//               {/* {page === 'subjects' && <SubjectsManagement data={{ subjects, courses: departments, users: approvedTeachers }} 
//                 updateData={async (sub) => { await API.post('/subjects', sub); syncData(); }} 
//               />} */}

//               {page === 'subjects' && (
//   <SubjectsManagement 
//     data={{ 
//       subjects: subjects, 
//       courses: departments, 
//       users: approvedTeachers, // Teachers are passed as 'users' here
//       teacherAssignments: pendingRequests // Map this to your assignments state
//     }} 
//     updateData={async (updatedFullData) => { 
//       try {
//         // A. Handle New Subject Addition
//         if (updatedFullData.subjects.length > subjects.length) {
//           const newSub = updatedFullData.subjects[updatedFullData.subjects.length - 1];
//           await API.post('/subjects', {
//             name: newSub.name,
//             code: newSub.code,
//             semester: newSub.semester,
//             credits: newSub.credits,
//             dept_id: newSub.courseId
//           });
//         }

//         // B. Handle Teacher Assignment
//         // Note: Compare against the state variable you use for assignments
//         if (updatedFullData.teacherAssignments?.length > (pendingRequests?.length || 0)) {
//           const newAssign = updatedFullData.teacherAssignments[updatedFullData.teacherAssignments.length - 1];
//           await API.post('/assign-teacher', {
//             subjectId: newAssign.subjectId,
//             teacherId: newAssign.teacherId,
//             academicYearId: newAssign.academicYearId
//           });
//         }

//         alert("Database Updated Successfully!");
//         syncData(); // Refresh everything from MySQL
//       } catch (err) {
//         console.error("Sync Error:", err.response?.data || err.message);
//         alert("Error syncing with database. Check terminal.");
//       }
//     }} 
//   />
// )}

              


              
//             </DashboardLayout>
//           ) : <Navigate to="/login" />
//         } />
//       </Routes>
//     </div>
//   );
// }





import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';

/* UI & SHELL */
import Navbar from './pages/Navbar';
import Hero from './pages/Hero';
import FeatureShowcase from './pages/Featureshowcase';
import UserGrid from './pages/UserGrid';
import DashboardLayout from './layouts/DashboardLayout';
import StarField from './components/StarField';

/* PAGES */
import Login from './pages/Login';
import AdminRegistration from './pages/AdminRegistration';
import TeacherRegistration from './pages/TeacherRegistration';
import Overview from './pages/Overview';
import Departments from './pages/Departments';
import Teachers from './pages/Teachers';
import Students from './pages/Students';
import SubjectsManagement from './pages/SubjectsManagement';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

export default function App() {
  const navigate = useNavigate();
  
  const [role, setRole] = useState(() => JSON.parse(localStorage.getItem('user_role')) || null);
  const [currentUser, setCurrentUser] = useState(() => JSON.parse(localStorage.getItem('current_user')) || null);
  const [page, setPage] = useState('overview');

  const [departments, setDepartments] = useState([]);
  const [approvedTeachers, setApprovedTeachers] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [batches, setBatches] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teacherAssignments, setTeacherAssignments] = useState([]);

  // MASTER SYNC - Pulls all MySQL data into React State
  const syncData = useCallback(async () => {
    try {
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
      console.error("Database sync failed. Is the server running?"); 
    }
  }, []);

  useEffect(() => {
    if (role || page === 'overview') syncData();
  }, [role, page, syncData]);

  const handleAuth = (userRole, userData) => {
    setRole(userRole);
    setCurrentUser(userData);
    localStorage.setItem('user_role', JSON.stringify(userRole));
    localStorage.setItem('current_user', JSON.stringify(userData));
    navigate('/dashboard');
  };

  const handleLogout = () => {
    setRole(null);
    setCurrentUser(null);
    localStorage.clear();
    navigate('/');
  };

  const NavWrapper = () => (
    <Navbar 
      onLoginClick={() => navigate('/login')}
      onLogoClick={() => navigate('/')}
      onRegisterAdmin={() => navigate('/register/admin')}
      onRegisterTeacher={() => navigate('/register/teacher')}
    />
  );

  return (
    <div className="App min-h-screen bg-[#0a0a0a] text-[#ccc]">
      <StarField />
      <Routes>
        <Route path="/" element={<><NavWrapper /><main><Hero onLoginClick={() => navigate('/login')} /><FeatureShowcase /><UserGrid /></main></>} />
        
        <Route path="/login" element={role ? <Navigate to="/dashboard" /> : <><NavWrapper /><Login onLogin={handleAuth} /></>} />
        
        <Route path="/register/admin" element={<><NavWrapper /><AdminRegistration onRegister={(d) => handleAuth('admin', d)} /></>} />
        
        <Route path="/register/teacher" element={
          <><NavWrapper />
            <TeacherRegistration departments={departments} onRegister={async (formData) => {
              try {
                const res = await API.post('/register/teacher', formData);
                if (res.data.success) { 
                  alert("Registration Successful!"); 
                  syncData(); 
                  navigate('/login'); 
                }
              } catch (err) { alert("Registration Error: Check if Email exists."); }
            }} />
          </>
        } />

        <Route path="/dashboard/*" element={
          role ? (
            <DashboardLayout userRole={role} currentUser={currentUser} currentPage={page} setCurrentPage={setPage} onLogout={handleLogout}>
              
              {/* 1. OVERVIEW */}
              {page === 'overview' && <Overview departments={departments} teachersCount={approvedTeachers.length} studentsCount={allStudents.length} pendingTeachers={pendingRequests} />}
              
              {/* 2. DEPARTMENTS */}
              {page === 'departments' && (
                <Departments 
                  userRole={role} 
                  departments={departments} 
                  onAddDept={async (deptData) => { 
                    try {
                      const res = await API.post('/departments', deptData); 
                      if (res.data.success) { syncData(); alert("Department added!"); }
                    } catch (err) { alert("Error: Dept Code already exists."); }
                  }} 
                  onDeleteDept={async (id) => {
                    if(window.confirm("Delete this department?")) {
                      await API.delete(`/departments/${id}`);
                      syncData();
                    }
                  }}
                />
              )}

              {/* 3. TEACHERS */}
              {page === 'teachers' && <Teachers userRole={role} teachers={approvedTeachers} onRefresh={syncData} />}

              {/* 4. STUDENTS & BATCHES */}
              {page === 'students' && (
                <Students 
                  userRole={role} 
                  batches={batches} 
                  allStudents={allStudents} 
                  onAddStudent={async (studentData) => { 
                    try {
                      const res = await API.post('/students', studentData); 
                      if (res.data.success) { alert("Student added!"); syncData(); }
                    } catch (err) { alert("Enrollment No already exists."); }
                  }}
                  onAddBatch={async (b) => { 
                    await API.post('/batches', b); 
                    syncData(); 
                  }} 
                />
              )}

              {/* 5. SUBJECTS & ASSIGNMENTS */}
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
                      // Detect New Subject
                      if (updatedFullData.subjects.length > subjects.length) {
                        const newSub = updatedFullData.subjects[updatedFullData.subjects.length - 1];
                        await API.post('/subjects', {
                          name: newSub.name,
                          code: newSub.code,
                          semester: newSub.semester,
                          credits: newSub.credits,
                          dept_id: newSub.courseId
                        });
                      }

                      // Detect New Teacher Assignment
                      if (updatedFullData.teacherAssignments?.length > teacherAssignments.length) {
                        const newAssign = updatedFullData.teacherAssignments[updatedFullData.teacherAssignments.length - 1];
                        await API.post('/assign-teacher', {
                          subjectId: newAssign.subjectId,
                          teacherId: newAssign.teacherId,
                          academicYearId: newAssign.academicYearId
                        });
                      }

                      syncData();
                      alert("Database Updated!");
                    } catch (err) {
                      alert("Sync Error: Check if Code exists.");
                    }
                  }} 
                />
              )}
              
            </DashboardLayout>
          ) : <Navigate to="/login" />
        } />
      </Routes>
    </div>
  );
}