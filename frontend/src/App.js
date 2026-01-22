// // import React, { useState, useEffect } from 'react';
// // import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

// // // Layout & UI Shell
// // import DashboardLayout from './layouts/DashboardLayout';
// // import StarField from './components/StarField';

// // // Public Pages
// // import Home from './pages/Home';
// // import CollegeManagementSystem from './pages/CollegeManagementSystem';
// // import AdminRegistration from './pages/AdminRegistration';
// // import TeacherRegistration from './pages/TeacherRegistration';
// // import Login from './pages/Login';

// // // Dashboard Views
// // import Overview from './pages/Overview';
// // import Departments from './pages/Departments';
// // import Teachers from './pages/Teachers';
// // import Students from './pages/Students';
// // import Reports from './pages/Reports';
// // import { SubjectsManagement } from './pages/SubjectsManagement'; // New Import

// // // Safety Helper for Persistence
// // const getInitialData = (key, fallback) => {
// //   try {
// //     const saved = localStorage.getItem(key);
// //     if (!saved || saved === "null" || saved === "undefined") return fallback;
// //     return JSON.parse(saved);
// //   } catch (e) {
// //     return fallback;
// //   }
// // };

// // export default function App() {
// //   const navigate = useNavigate();

// //   // --- 1. AUTH & SESSION STATE ---
// //   const [role, setRole] = useState(() => getInitialData('user_role', null));
// //   const [currentUser, setCurrentUser] = useState(() => getInitialData('current_user', null));
// //   const [page, setPage] = useState('overview');

// //   // --- 2. INSTITUTIONAL DATA ---
// //   const [departments, setDepartments] = useState(() => getInitialData('depts', []));
// //   const [pendingRequests, setPendingRequests] = useState(() => getInitialData('pending_teachers', []));
// //   const [approvedTeachers, setApprovedTeachers] = useState(() => getInitialData('teachers', []));
// //   const [batches, setBatches] = useState(() => getInitialData('batches', []));
// //   const [allStudents, setAllStudents] = useState(() => getInitialData('students', []));

// //   // --- NEW SUBJECTS DATA ---
// //   const [subjects, setSubjects] = useState(() => getInitialData('subjects', []));
// //   const [teacherAssignments, setTeacherAssignments] = useState(() => getInitialData('assignments', []));
// //   const [divisions, setDivisions] = useState(() => getInitialData('divisions', []));
// //   const [academicYears, setAcademicYears] = useState(() => getInitialData('academic_years', []));

// //   // --- 3. PERSISTENCE SYNC ---
// //   useEffect(() => {
// //     localStorage.setItem('user_role', JSON.stringify(role));
// //     localStorage.setItem('current_user', JSON.stringify(currentUser));
// //     localStorage.setItem('depts', JSON.stringify(departments));
// //     localStorage.setItem('teachers', JSON.stringify(approvedTeachers));
// //     localStorage.setItem('pending_teachers', JSON.stringify(pendingRequests));
// //     localStorage.setItem('batches', JSON.stringify(batches));
// //     localStorage.setItem('students', JSON.stringify(allStudents));
    
// //     // Sync New Subject Data
// //     localStorage.setItem('subjects', JSON.stringify(subjects));
// //     localStorage.setItem('assignments', JSON.stringify(teacherAssignments));
// //     localStorage.setItem('divisions', JSON.stringify(divisions));
// //     localStorage.setItem('academic_years', JSON.stringify(academicYears));
// //   }, [role, currentUser, departments, approvedTeachers, pendingRequests, batches, allStudents, subjects, teacherAssignments, divisions, academicYears]);

// //   // --- 4. FLOW HANDLERS ---

// //   const handleLoginSuccess = (userRole, userData) => {
// //     setRole(userRole);
// //     setCurrentUser(userData);
// //     navigate('/'); 
// //   };

// //   const handleTeacherRegister = (teacherData) => {
// //     const request = { 
// //       ...teacherData, 
// //       id: `REQ-${Date.now()}`, 
// //       dateApplied: new Date().toLocaleDateString(),
// //       status: 'Pending'
// //     };
// //     setPendingRequests(prev => [...prev, request]);
// //     alert("Application submitted! Access will be granted once the Admin approves your profile.");
// //     navigate('/'); 
// //   };

// //   const handleLogout = () => {
// //     setRole(null);
// //     setCurrentUser(null);
// //     localStorage.clear(); // Clear all for a fresh session
// //     navigate('/');
// //   };

// //   // Handler for Subjects Page Updates
// //   const handleUpdateSubjects = (updatedData) => {
// //     setSubjects(updatedData.subjects);
// //     if(updatedData.teacherAssignments) setTeacherAssignments(updatedData.teacherAssignments);
// //   };

// //   return (
// //     <div className="App min-h-screen bg-slate-50">
// //       <StarField />
      
// //       <Routes>
// //         {!role ? (
// //           <>
// //             <Route path="/" element={<Home onLoginClick={() => navigate('/portal')} onSignInClick={() => navigate('/login')} />} />
// //             <Route path="/portal" element={<CollegeManagementSystem />} />
// //             <Route path="/login" element={<Login onLogin={handleLoginSuccess} approvedTeachers={approvedTeachers} />} />
// //             <Route path="/register/admin" element={<AdminRegistration onRegister={(name) => handleLoginSuccess('admin', { name, email: 'admin@college.edu' })} />} />
// //             <Route path="/register/teacher" element={<TeacherRegistration onRegister={handleTeacherRegister} />} />
// //             <Route path="*" element={<Navigate to="/" />} />
// //           </>
// //         ) : (
// //           <Route path="/*" element={
// //             <DashboardLayout 
// //               userRole={role} 
// //               currentUser={currentUser}
// //               currentPage={page} 
// //               setCurrentPage={setPage} 
// //               onLogout={handleLogout}
// //             >
// //               {page === 'overview' && (
// //                 <Overview 
// //                   userRole={role} 
// //                   pendingTeachers={pendingRequests} 
// //                   onApprove={(id) => {
// //                     const t = pendingRequests.find(x => x.id === id);
// //                     if(t) {
// //                       setApprovedTeachers(prev => [...prev, { ...t, status: 'Active' }]);
// //                       setPendingRequests(prev => prev.filter(x => x.id !== id));
// //                     }
// //                   }} 
// //                   teachersCount={approvedTeachers.length}
// //                   studentsCount={allStudents.length}
// //                   departments={departments}
// //                 />
// //               )}

// //               {page === 'departments' && (
// //                 <Departments 
// //                   userRole={role}
// //                   departments={departments} 
// //                   onAddDept={(d) => setDepartments(prev => [...prev, { ...d, id: Date.now() }])} 
// //                   onDeleteDept={(id) => setDepartments(prev => prev.filter(d => d.id !== id))}
// //                 />
// //               )}

// //               {page === 'teachers' && (
// //                 <Teachers 
// //                   teachers={approvedTeachers} 
// //                   departments={departments}
// //                   onDeleteTeacher={(id) => setApprovedTeachers(prev => prev.filter(t => t.id !== id))}
// //                 />
// //               )}

// //               {/* NEW SUBJECTS ROUTE */}
// //               {page === 'subjects' && (
// //                 <SubjectsManagement 
// //                   data={{ 
// //                     subjects: subjects, 
// //                     courses: departments, 
// //                     users: approvedTeachers,
// //                     teacherAssignments: teacherAssignments,
// //                     divisions: divisions,
// //                     academicYears: academicYears
// //                   }} 
// //                   updateData={handleUpdateSubjects} 
// //                 />
// //               )}

// //               {page === 'students' && (
// //                 <Students 
// //                   userRole={role}
// //                   batches={batches} 
// //                   allStudents={allStudents} 
// //                   onAddBatch={(b) => setBatches(prev => [...prev, { ...b, id: Date.now() }])}
// //                   onAddStudent={(s) => setAllStudents(prev => [...prev, { ...s, id: Date.now() }])} 
// //                 />
// //               )}

// //               {page === 'reports' && <Reports />}
// //             </DashboardLayout>
// //           } />
// //         )}
// //       </Routes>
// //     </div>
// //   );
// // }

//////////////////////

// import React, { useState, useEffect } from 'react';
// import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

// // Layout & UI Shell
// import DashboardLayout from './layouts/DashboardLayout';
// import StarField from './components/StarField';

// // Public Pages
// import Home from './pages/Home';
// import CollegeManagementSystem from './pages/CollegeManagementSystem';
// import AdminRegistration from './pages/AdminRegistration';
// import TeacherRegistration from './pages/TeacherRegistration';
// import Login from './pages/Login';

// // Dashboard Views
// import Overview from './pages/Overview';
// import Departments from './pages/Departments';
// import Teachers from './pages/Teachers';
// import Students from './pages/Students';
// import Reports from './pages/Reports';
// import { SubjectsManagement } from './pages/SubjectsManagement';

// const getInitialData = (key, fallback) => {
//   try {
//     const saved = localStorage.getItem(key);
//     if (!saved || saved === "null" || saved === "undefined") return fallback;
//     return JSON.parse(saved);
//   } catch (e) {
//     return fallback;
//   }
// };

// export default function App() {
//   const navigate = useNavigate();

//   // --- 1. AUTH & SESSION STATE ---
//   const [role, setRole] = useState(() => getInitialData('user_role', null));
//   const [currentUser, setCurrentUser] = useState(() => getInitialData('current_user', null));
//   const [page, setPage] = useState('overview');

//   // --- 2. INSTITUTIONAL DATA ---
//   const [departments, setDepartments] = useState(() => getInitialData('depts', []));
//   const [pendingRequests, setPendingRequests] = useState(() => getInitialData('pending_teachers', []));
//   const [approvedTeachers, setApprovedTeachers] = useState(() => getInitialData('teachers', []));
//   const [batches, setBatches] = useState(() => getInitialData('batches', []));
//   const [allStudents, setAllStudents] = useState(() => getInitialData('students', []));
//   const [subjects, setSubjects] = useState(() => getInitialData('subjects', []));
//   const [teacherAssignments, setTeacherAssignments] = useState(() => getInitialData('assignments', []));
//   const [divisions, setDivisions] = useState(() => getInitialData('divisions', []));
//   const [academicYears, setAcademicYears] = useState(() => getInitialData('academic_years', []));

//   // --- 3. PERSISTENCE SYNC ---
//   useEffect(() => {
//     localStorage.setItem('user_role', JSON.stringify(role));
//     localStorage.setItem('current_user', JSON.stringify(currentUser));
//     localStorage.setItem('depts', JSON.stringify(departments));
//     localStorage.setItem('teachers', JSON.stringify(approvedTeachers));
//     localStorage.setItem('pending_teachers', JSON.stringify(pendingRequests));
//     localStorage.setItem('batches', JSON.stringify(batches));
//     localStorage.setItem('students', JSON.stringify(allStudents));
//     localStorage.setItem('subjects', JSON.stringify(subjects));
//     localStorage.setItem('assignments', JSON.stringify(teacherAssignments));
//     localStorage.setItem('divisions', JSON.stringify(divisions));
//     localStorage.setItem('academic_years', JSON.stringify(academicYears));
//   }, [role, currentUser, departments, approvedTeachers, pendingRequests, batches, allStudents, subjects, teacherAssignments, divisions, academicYears]);

//   // --- 4. FLOW HANDLERS ---

//   const handleLoginSuccess = (userRole, userData) => {
//     setRole(userRole);
//     setCurrentUser(userData);
//     navigate('/dashboard'); // Redirect to dashboard area
//   };

//   const handleAdminRegister = (adminData) => {
//     // Admin is registered and logged in immediately
//     const userData = { name: adminData, email: 'admin@college.edu' };
//     setRole('admin');
//     setCurrentUser(userData);
//     navigate('/dashboard');
//   };

//   const handleTeacherRegister = (teacherData) => {
//     const request = { 
//       ...teacherData, 
//       id: `REQ-${Date.now()}`, 
//       dateApplied: new Date().toLocaleDateString(),
//       status: 'Pending'
//     };
//     setPendingRequests(prev => [...prev, request]);
    
//     // Note: Teachers usually wait for approval. 
//     // If you want them to see a "Limited" dashboard immediately, set role here.
//     // Otherwise, redirect to Home with a success message.
//     alert("Application submitted! Your account is pending Admin approval.");
//     navigate('/'); 
//   };

//   const handleLogout = () => {
//     setRole(null);
//     setCurrentUser(null);
//     localStorage.clear();
//     navigate('/');
//   };

//   const handleUpdateSubjects = (updatedData) => {
//     setSubjects(updatedData.subjects);
//     if(updatedData.teacherAssignments) setTeacherAssignments(updatedData.teacherAssignments);
//   };

//   return (
//     <div className="App min-h-screen bg-slate-50 font-sans antialiased">
//       <StarField />
      
//       <Routes>
//         {/* PHASE 1: PUBLIC GATEWAY */}
//         <Route path="/" element={<Home onLoginClick={() => navigate('/portal')} onSignInClick={() => navigate('/login')} />} />
//         <Route path="/portal" element={<CollegeManagementSystem />} />
//         <Route path="/login" element={<Login onLogin={handleLoginSuccess} approvedTeachers={approvedTeachers} />} />
        
//         {/* Registration Paths */}
//         <Route path="/register/admin" element={<AdminRegistration onRegister={handleAdminRegister} />} />
//         <Route path="/register/teacher" element={<TeacherRegistration onRegister={handleTeacherRegister} />} />

//         {/* PHASE 2: PROTECTED DASHBOARD */}
//         <Route 
//           path="/dashboard/*" 
//           element={
//             role ? (
//               <DashboardLayout 
//                 userRole={role} 
//                 currentUser={currentUser}
//                 currentPage={page} 
//                 setCurrentPage={setPage} 
//                 onLogout={handleLogout}
//               >
//                 {/* Dashboard Content based on current 'page' state */}
//                 {page === 'overview' && (
//                   <Overview 
//                     userRole={role} 
//                     pendingTeachers={pendingRequests} 
//                     onApprove={(id) => {
//                       const t = pendingRequests.find(x => x.id === id);
//                       if(t) {
//                         setApprovedTeachers(prev => [...prev, { ...t, status: 'Active' }]);
//                         setPendingRequests(prev => prev.filter(x => x.id !== id));
//                       }
//                     }} 
//                     teachersCount={approvedTeachers.length}
//                     studentsCount={allStudents.length}
//                     departments={departments}
//                   />
//                 )}

//                 {page === 'departments' && (
//                   <Departments 
//                     userRole={role}
//                     departments={departments} 
//                     onAddDept={(d) => setDepartments(prev => [...prev, { ...d, id: Date.now() }])} 
//                     onDeleteDept={(id) => setDepartments(prev => prev.filter(d => d.id !== id))}
//                   />
//                 )}

//                 {page === 'teachers' && (
//                   <Teachers 
//                     teachers={approvedTeachers} 
//                     departments={departments}
//                     onDeleteTeacher={(id) => setApprovedTeachers(prev => prev.filter(t => t.id !== id))}
//                   />
//                 )}

//                 {page === 'subjects' && (
//                   <SubjectsManagement 
//                     data={{ 
//                       subjects: subjects, 
//                       courses: departments, 
//                       users: approvedTeachers,
//                       teacherAssignments: teacherAssignments,
//                       divisions: divisions,
//                       academicYears: academicYears
//                     }} 
//                     updateData={handleUpdateSubjects} 
//                   />
//                 )}

//                 {page === 'students' && (
//                   <Students 
//                     userRole={role}
//                     batches={batches} 
//                     allStudents={allStudents} 
//                     onAddBatch={(b) => setBatches(prev => [...prev, { ...b, id: Date.now() }])}
//                     onAddStudent={(s) => setAllStudents(prev => [...prev, { ...s, id: Date.now() }])} 
//                   />
//                 )}

//                 {page === 'reports' && <Reports />}
//               </DashboardLayout>
//             ) : (
//               <Navigate to="/login" replace />
//             )
//           } 
//         />

//         {/* Fallback */}
//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>
//     </div>
//   );
// }



import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

// Layout & UI Shell
import DashboardLayout from './layouts/DashboardLayout';
import StarField from './components/StarField';

// Public Pages
import Home from './pages/Home';
import CollegeManagementSystem from './pages/CollegeManagementSystem';
import AdminRegistration from './pages/AdminRegistration';
import TeacherRegistration from './pages/TeacherRegistration';
import Login from './pages/Login';

// Dashboard Views
import Overview from './pages/Overview';
import Departments from './pages/Departments';
import Teachers from './pages/Teachers';
import Students from './pages/Students';
import Reports from './pages/Reports';
import { SubjectsManagement } from './pages/SubjectsManagement';

// Safety Helper for Persistence
const getInitialData = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    if (!saved || saved === "null" || saved === "undefined") return fallback;
    return JSON.parse(saved);
  } catch (e) {
    return fallback;
  }
};

export default function App() {
  const navigate = useNavigate();

  // --- 1. AUTH & SESSION STATE ---
  const [role, setRole] = useState(() => getInitialData('user_role', null));
  const [currentUser, setCurrentUser] = useState(() => getInitialData('current_user', null));
  const [page, setPage] = useState('overview');

  // --- 2. INSTITUTIONAL DATA (Synced with MySQL) ---
  const [departments, setDepartments] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [approvedTeachers, setApprovedTeachers] = useState([]);
  const [batches, setBatches] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teacherAssignments, setTeacherAssignments] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);

  // --- 3. DATABASE SYNC LOGIC ---
  const fetchAllData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/dashboard/data');
      const result = await response.json();
      if (result) {
        setDepartments(result.departments || []);
        setSubjects(result.subjects || []);
        setApprovedTeachers(result.teachers || []);
        setTeacherAssignments(result.assignments || []);
        setPendingRequests(result.pendingTeachers || []);
      }
    } catch (err) {
      console.error("Failed to fetch data from MySQL:", err);
    }
  };

  useEffect(() => {
    if (role) fetchAllData();
  }, [role]);

  // Persistent Auth Sync
  useEffect(() => {
    localStorage.setItem('user_role', JSON.stringify(role));
    localStorage.setItem('current_user', JSON.stringify(currentUser));
  }, [role, currentUser]);

  // --- 4. FLOW HANDLERS ---

  const handleLoginSuccess = (userRole, userData) => {
    setRole(userRole);
    setCurrentUser(userData);
    navigate('/dashboard'); 
  };

  const handleAdminRegister = async (adminData) => {
    try {
      const response = await fetch('http://localhost:5000/api/register/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adminData)
      });
      const result = await response.json();
      if (result.success) {
        handleLoginSuccess('admin', { name: adminData.adminName, email: adminData.adminEmail });
      }
    } catch (err) {
      alert("Registration failed. Ensure backend is running.");
    }
  };

  const handleTeacherRegister = async (teacherData) => {
    try {
      const response = await fetch('http://localhost:5000/api/register/teacher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(teacherData)
      });
      const result = await response.json();
      if (result.success) {
        alert("Application submitted! Access granted once Admin approves your profile.");
        navigate('/'); 
      }
    } catch (err) {
      alert("Submission failed.");
    }
  };

  const handleLogout = () => {
    setRole(null);
    setCurrentUser(null);
    localStorage.clear();
    navigate('/');
  };

  const handleUpdateSubjects = async (updatedData) => {
    setSubjects(updatedData.subjects);
    if(updatedData.teacherAssignments) setTeacherAssignments(updatedData.teacherAssignments);
    fetchAllData(); 
  };

  return (
    <div className="App min-h-screen bg-slate-50 font-sans antialiased">
      <StarField />
      
      <Routes>
        <Route path="/" element={<Home onLoginClick={() => navigate('/portal')} onSignInClick={() => navigate('/login')} />} />
        <Route path="/portal" element={<CollegeManagementSystem />} />
        <Route path="/login" element={<Login onLogin={handleLoginSuccess} />} />
        <Route path="/register/admin" element={<AdminRegistration onRegister={handleAdminRegister} />} />
        <Route path="/register/teacher" element={<TeacherRegistration onRegister={handleTeacherRegister} />} />

        <Route 
          path="/dashboard/*" 
          element={
            role ? (
              <DashboardLayout 
                userRole={role} 
                currentUser={currentUser}
                currentPage={page} 
                setCurrentPage={setPage} 
                onLogout={handleLogout}
              >
                {/* 1. OVERVIEW */}
                {page === 'overview' && (
                  <Overview 
                    userRole={role} 
                    pendingTeachers={pendingRequests} 
                    onApprove={async (id) => {
                      await fetch(`http://localhost:5000/api/teachers/approve/${id}`, { method: 'POST' });
                      await fetchAllData(); 
                    }} 
                    teachers={approvedTeachers}
                    departments={departments}
                    studentsCount={allStudents.length}
                  />
                )}

                {/* 2. DEPARTMENTS */}
                {page === 'departments' && (
                  <Departments 
                    userRole={role}
                    departments={departments} 
                    onAddDept={async (deptData) => {
                      try {
                        const res = await fetch('http://localhost:5000/api/departments', {
                          method: 'POST',
                          headers: {'Content-Type': 'application/json'},
                          body: JSON.stringify(deptData)
                        });
                        const result = await res.json();
                        if (result.success) {
                          await fetchAllData(); 
                          alert("Department saved and synced with MySQL!");
                        } else {
                          alert("Failed to save: " + (result.error || "Unknown error"));
                        }
                      } catch (err) {
                        console.error("Connection failed:", err);
                        alert("Server error. Check Node.js terminal.");
                      }
                    }} 
                    onDeleteDept={async (id) => {
                      await fetch(`http://localhost:5000/api/departments/${id}`, { method: 'DELETE' });
                      await fetchAllData();
                    }}
                  />
                )}

                {/* 3. TEACHERS */}
                {page === 'teachers' && (
                  <Teachers 
                    userRole={role}
                    teachers={approvedTeachers} 
                    departments={departments}
                  />
                )}

                {/* 4. SUBJECTS */}
                {page === 'subjects' && (
                  <SubjectsManagement 
                    data={{ 
                      subjects: subjects, 
                      courses: departments, 
                      users: approvedTeachers,
                      teacherAssignments: teacherAssignments,
                      divisions: divisions,
                      academicYears: academicYears
                    }} 
                    updateData={handleUpdateSubjects} 
                  />
                )}

                {/* 5. STUDENTS */}
                {page === 'students' && (
                  <Students 
                    userRole={role}
                    batches={batches} 
                    allStudents={allStudents} 
                    onAddBatch={(b) => setBatches(prev => [...prev, { ...b, id: Date.now() }])}
                    onAddStudent={(s) => setAllStudents(prev => [...prev, { ...s, id: Date.now() }])} 
                  />
                )}

                {/* 6. REPORTS */}
                {page === 'reports' && <Reports />}
              </DashboardLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}