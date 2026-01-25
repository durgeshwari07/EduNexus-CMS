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

// // // Axios instance with the backend base URL
// // const API = axios.create({ baseURL: 'http://localhost:5000/api' });

// // export default function App() {
// //   const navigate = useNavigate();
  
// //   // -- Auth & Session State --
// //   const [role, setRole] = useState(() => JSON.parse(localStorage.getItem('user_role')) || null);
// //   const [currentUser, setCurrentUser] = useState(() => JSON.parse(localStorage.getItem('current_user')) || null);
// //   const [page, setPage] = useState('overview');

// //   // -- Database Synchronization State --
// //   const [departments, setDepartments] = useState([]);
// //   const [approvedTeachers, setApprovedTeachers] = useState([]);
// //   const [pendingRequests, setPendingRequests] = useState([]);
// //   const [allStudents, setAllStudents] = useState([]);
// //   const [batches, setBatches] = useState([]);
// //   const [subjects, setSubjects] = useState([]);
// //   const [teacherAssignments, setTeacherAssignments] = useState([]);

// //   // --- MASTER SYNC: Fetches all fresh data from MySQL ---
// //   const syncData = useCallback(async () => {
// //     try {
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
// //       console.error("Master Sync failed. Ensure Node.js server is running on port 5000."); 
// //     }
// //   }, []);

// //   // Sync data whenever the user is logged in or changes context
// //   useEffect(() => {
// //     if (role) syncData();
// //   }, [role, page, syncData]);

// //   // -- Auth Handlers --
// //   const handleAuth = (userRole, userData) => {
// //     setRole(userRole);
// //     setCurrentUser(userData);
// //     localStorage.setItem('user_role', JSON.stringify(userRole));
// //     localStorage.setItem('current_user', JSON.stringify(userData));
// //     navigate('/dashboard');
// //   };

// //   const handleLogout = () => {
// //     setRole(null);
// //     setCurrentUser(null);
// //     localStorage.clear();
// //     navigate('/');
// //   };

// //   const NavWrapper = () => (
// //     <Navbar 
// //       onLoginClick={() => navigate('/login')}
// //       onLogoClick={() => navigate('/')}
// //       onRegisterAdmin={() => navigate('/register/admin')}
// //       onRegisterTeacher={() => navigate('/register/teacher')}
// //     />
// //   );

// //   return (
// //     <div className="App min-h-screen bg-[#0a0a0a] text-[#ccc]">
// //       <StarField />
// //       <Routes>
// //         {/* PUBLIC ROUTES */}
// //         <Route path="/" element={<><NavWrapper /><main><Hero onLoginClick={() => navigate('/login')} /><FeatureShowcase /><UserGrid /></main></>} />
// //         <Route path="/login" element={role ? <Navigate to="/dashboard" /> : <><NavWrapper /><Login onLogin={handleAuth} /></>} />
// //         <Route path="/register/admin" element={<><NavWrapper /><AdminRegistration onRegister={(d) => handleAuth('admin', d)} /></>} />
        
// //         <Route path="/register/teacher" element={
// //           <><NavWrapper />
// //             <TeacherRegistration departments={departments} onRegister={async (formData) => {
// //               try {
// //                 const res = await API.post('/register/teacher', formData);
// //                 if (res.data.success) { 
// //                   alert("Teacher Registration Successful!"); 
// //                   syncData(); 
// //                   navigate('/login'); 
// //                 }
// //               } catch (err) { alert("Registration Failed. Check if email exists."); }
// //             }} />
// //           </>
// //         } />

// //         {/* PROTECTED DASHBOARD ROUTES */}
// //         <Route path="/dashboard/*" element={
// //           role ? (
// //             <DashboardLayout userRole={role} currentUser={currentUser} currentPage={page} setCurrentPage={setPage} onLogout={handleLogout}>
              
// //               {/* 1. OVERVIEW */}
// //               {page === 'overview' && (
// //                 <Overview 
// //                   departments={departments} 
// //                   teachersCount={approvedTeachers.length} 
// //                   studentsCount={allStudents.length} 
// //                   pendingTeachers={pendingRequests} 
// //                 />
// //               )}
              
// //               {/* 2. DEPARTMENTS */}
// //               {page === 'departments' && (
// //                 <Departments 
// //                   userRole={role} 
// //                   departments={departments} 
// //                   onAddDept={async (deptData) => { 
// //                     try {
// //                       const res = await API.post('/departments', deptData); 
// //                       if (res.data.success) { syncData(); alert("Department Added!"); }
// //                     } catch (err) { alert("Error adding department."); }
// //                   }} 
// //                   onDeleteDept={async (id) => {
// //                     if(window.confirm("Permanent Delete Department?")) {
// //                       try {
// //                         await API.delete(`/departments/${id}`);
// //                         syncData();
// //                       } catch (err) { alert("Delete failed."); }
// //                     }
// //                   }}
// //                 />
// //               )}

// //               {/* 3. TEACHERS */}
// //               {page === 'teachers' && (
// //                 <Teachers 
// //                   userRole={role} 
// //                   teachers={approvedTeachers} 
// //                   onRefresh={syncData} 
// //                 />
// //               )}

// //               {/* 4. STUDENTS & BATCHES */}
// //               {page === 'students' && (
// //                 <Students 
// //                   userRole={role} 
// //                   batches={batches} 
// //                   allStudents={allStudents} 
// //                   onAddStudent={async (studentData) => { 
// //                     try {
// //                       const res = await API.post('/students', studentData); 
// //                       if (res.data.success) { 
// //                         alert("Student Registered!"); 
// //                         await syncData(); 
// //                       }
// //                     } catch (err) { alert("Error adding student."); }
// //                   }}
// //                   // --- MISSING FUNCTION ADDED HERE ---
// //                   onDeleteStudent={async (id) => {
// //                     try {
// //                       const res = await API.delete(`/students/${id}`);
// //                       if (res.data.success) {
// //                         await syncData(); // Refresh the list from database
// //                       }
// //                     } catch (err) {
// //                       console.error("Delete failed:", err);
// //                       alert("Error deleting student.");
// //                     }
// //                   }}
// //                   // ------------------------------------
// //                   onAddBatch={async (b) => { 
// //                     try {
// //                       await API.post('/batches', b); 
// //                       await syncData(); 
// //                       alert("Batch Created!");
// //                     } catch (err) { alert("Error adding batch."); }
// //                   }} 
// //                 />
// //               )}

// //               {/* 5. SUBJECTS & FACULTY ASSIGNMENT */}
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
// //                       // --- A. LOGIC FOR DELETING A SUBJECT ---
// //                       if (updatedFullData.subjects.length < subjects.length) {
// //                         const deletedSub = subjects.find(s => !updatedFullData.subjects.find(us => us.id === s.id));
// //                         if (deletedSub) {
// //                           await API.delete(`/subjects/${deletedSub.id}`);
// //                         }
// //                       }

// //                       // --- B. LOGIC FOR ADDING A NEW SUBJECT ---
// //                       else if (updatedFullData.subjects.length > subjects.length) {
// //                         const newSub = updatedFullData.subjects[updatedFullData.subjects.length - 1];
// //                         await API.post('/subjects', {
// //                           name: newSub.name,
// //                           code: newSub.code,
// //                           semester: newSub.semester,
// //                           credits: newSub.credits,
// //                           courseId: newSub.courseId 
// //                         });
// //                       }

// //                       // --- C. LOGIC FOR EDITING AN EXISTING SUBJECT ---
// //                       else {
// //                         const changedSub = updatedFullData.subjects.find((sub, index) => 
// //                           JSON.stringify(sub) !== JSON.stringify(subjects[index])
// //                         );
// //                         if (changedSub) {
// //                           await API.put(`/subjects/${changedSub.id}`, changedSub);
// //                         }
// //                       }

// //                       // --- D. LOGIC FOR NEW TEACHER ASSIGNMENT ---
// //                       if (updatedFullData.teacherAssignments?.length > teacherAssignments.length) {
// //                         const newAssign = updatedFullData.teacherAssignments[updatedFullData.teacherAssignments.length - 1];
// //                         await API.post('/assign-teacher', {
// //                           subjectId: newAssign.subjectId,
// //                           teacherId: newAssign.teacherId,
// //                           academicYearId: newAssign.academicYearId || '2024-25'
// //                         });
// //                       }

// //                       await syncData();
// //                       alert("Database Updated Successfully!");

// //                     } catch (err) {
// //                       console.error("Subject Sync Error:", err);
// //                       alert("Database error: Check server console.");
// //                     }
// //                   }} 
// //                 />
// //               )}
              
// //             </DashboardLayout>
// //           ) : <Navigate to="/login" />
// //         } />
// //       </Routes>
// //     </div>
// //   );
// // }









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

// /* PORTALS */
// import StudentPortal from './assets/StudentPortal';
// import FacultyPortal from './assets/FacultyPortal';

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
//   const [teacherAssignments, setTeacherAssignments] = useState([]);

//   // --- MASTER SYNC ---
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
//     } catch (err) { console.error("Master Sync failed."); }
//   }, [role]);

//   useEffect(() => { syncData(); }, [syncData]);

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

//   return (
//     <div className="App min-h-screen bg-[#0a0a0a] text-[#ccc]">
//       <StarField />
//       <Routes>
//         <Route path="/" element={<><Navbar onLoginClick={() => navigate('/login')} onLogoClick={() => navigate('/')} onRegisterAdmin={() => navigate('/register/admin')} onRegisterTeacher={() => navigate('/register/teacher')} /><main><Hero onLoginClick={() => navigate('/login')} /><FeatureShowcase /><UserGrid /></main></>} />
        
//         <Route path="/login" element={role ? <Navigate to="/dashboard" /> : <Login onLogin={handleAuth} />} />
        
//         <Route path="/student-portal/:id" element={<StudentPortal />} />
//         <Route path="/faculty" element={<FacultyPortal />} />

//         <Route path="/register/admin" element={<AdminRegistration onRegister={(d) => handleAuth('admin', d)} />} />
//         <Route path="/register/teacher" element={<TeacherRegistration departments={departments} onRegister={async (formData) => { try { const res = await API.post('/register/teacher', formData); if (res.data.success) { alert("Teacher Registration Successful!"); syncData(); navigate('/login'); } } catch (err) { alert("Registration Failed"); } }} />} />

//         <Route path="/dashboard/*" element={
//           role ? (
//             <DashboardLayout userRole={role} currentUser={currentUser} currentPage={page} setCurrentPage={setPage} onLogout={handleLogout}>
              
//               {page === 'overview' && <Overview departments={departments} teachersCount={approvedTeachers.length} studentsCount={allStudents.length} pendingTeachers={pendingRequests} />}
              
//               {page === 'departments' && <Departments userRole={role} departments={departments} onAddDept={async (d) => { await API.post('/departments', d); syncData(); }} onDeleteDept={async (id) => { await API.delete(`/departments/${id}`); syncData(); }} />}
              
//               {page === 'teachers' && <Teachers userRole={role} teachers={approvedTeachers} onRefresh={syncData} />}
              
//               {page === 'students' && <Students userRole={role} batches={batches} allStudents={allStudents} onAddStudent={async (d) => { await API.post('/students', d); syncData(); }} onDeleteStudent={async (id) => { await API.delete(`/students/${id}`); syncData(); }} onAddBatch={async (b) => { await API.post('/batches', b); syncData(); }} />}
              
//               {page === 'subjects' && (
//                 <SubjectsManagement 
//                   // 🔄 FIX: Mapping names to match SubjectsManagement internal expectations
//                   data={{ 
//                     subjects: subjects, 
//                     courses: departments, // component expects 'courses'
//                     users: approvedTeachers, // component expects 'users'
//                     teacherAssignments: teacherAssignments 
//                   }} 
//                   updateData={async (updatedFullData) => { 
//                     try {
//                       // 🔄 ADD SUBJECT
//                       if (updatedFullData.subjects.length > subjects.length) {
//                         const newSub = updatedFullData.subjects[updatedFullData.subjects.length - 1];
//                         await API.post('/subjects', {
//                           name: newSub.name,
//                           code: newSub.code,
//                           semester: newSub.semester,
//                           credits: newSub.credits,
//                           courseId: newSub.courseId // ensure this key matches server
//                         });
//                       } 
//                       // 🔄 DELETE SUBJECT
//                       else if (updatedFullData.subjects.length < subjects.length) {
//                         const deletedSubId = subjects.find(s => !updatedFullData.subjects.find(us => us.id === s.id))?.id;
//                         if (deletedSubId) await API.delete(`/subjects/${deletedSubId}`);
//                       }
//                       // 🔄 ASSIGN TEACHER
//                       if (updatedFullData.teacherAssignments?.length > teacherAssignments.length) {
//                         const newAssign = updatedFullData.teacherAssignments[updatedFullData.teacherAssignments.length - 1];
//                         await API.post('/assign-teacher', {
//                           subjectId: newAssign.subjectId,
//                           teacherId: newAssign.teacherId,
//                           academicYearId: newAssign.academicYearId || '2024-25'
//                         });
//                       }
//                       await syncData(); // Master sync after any change
//                     } catch (err) { console.error("Subject Logic Error", err); }
//                   }} 
//                 />
//               )}
              
//               {page === 'documents' && <div className="p-10 text-center text-gray-500">Documents Module Coming Soon</div>}
//               {page === 'reports' && <div className="p-10 text-center text-gray-500">Reports Module Coming Soon</div>}
            
//             </DashboardLayout>
//           ) : <Navigate to="/login" />
//         } />
//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>
//     </div> 
//   );
// }\\\




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
import DocumentVerification from './pages/DocumentVerification'; // 🆕 Live Component

/* PORTALS */
import StudentPortal from './assets/StudentPortal';
import FacultyPortal from './assets/FacultyPortal';

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

  // --- 🔄 MASTER SYNC ---
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
    } catch (err) { console.error("Master Sync failed."); }
  }, [role]);

  useEffect(() => { syncData(); }, [syncData]);

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

  return (
    <div className="App min-h-screen bg-[#0a0a0a] text-[#ccc]">
      <StarField />
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={
          <>
            <Navbar 
              onLoginClick={() => navigate('/login')} 
              onLogoClick={() => navigate('/')} 
              onRegisterAdmin={() => navigate('/register/admin')} 
              onRegisterTeacher={() => navigate('/register/teacher')} 
            />
            <main>
              <Hero onLoginClick={() => navigate('/login')} />
              <FeatureShowcase />
              <UserGrid />
            </main>
          </>
        } />
        
        <Route path="/login" element={role ? <Navigate to="/dashboard" /> : <Login onLogin={handleAuth} />} />
        
        {/* PORTALS (OUTSIDE DASHBOARD SHELL) */}
        <Route path="/student-portal/:id" element={<StudentPortal />} />
        <Route path="/faculty" element={<FacultyPortal />} />

        {/* REGISTRATION */}
        <Route path="/register/admin" element={<AdminRegistration onRegister={(d) => handleAuth('admin', d)} />} />
        <Route path="/register/teacher" element={
          <TeacherRegistration 
            departments={departments} 
            onRegister={async (formData) => { 
              try { 
                const res = await API.post('/register/teacher', formData); 
                if (res.data.success) { alert("Registration Sent for Admin Approval!"); navigate('/login'); } 
              } catch (err) { alert("Registration Failed"); } 
            }} 
          />
        } />

        {/* PRIVATE DASHBOARD */}
        <Route path="/dashboard/*" element={
          role ? (
            <DashboardLayout userRole={role} currentUser={currentUser} currentPage={page} setCurrentPage={setPage} onLogout={handleLogout}>
              
              {page === 'overview' && <Overview departments={departments} teachersCount={approvedTeachers.length} studentsCount={allStudents.length} pendingTeachers={pendingRequests} />}
              
              {page === 'departments' && <Departments userRole={role} departments={departments} onAddDept={async (d) => { await API.post('/departments', d); syncData(); }} onDeleteDept={async (id) => { await API.delete(`/departments/${id}`); syncData(); }} />}
              
              {page === 'teachers' && <Teachers userRole={role} teachers={approvedTeachers} onRefresh={syncData} />}
              
              {page === 'students' && <Students userRole={role} batches={batches} allStudents={allStudents} onAddStudent={async (d) => { await API.post('/students', d); syncData(); }} onDeleteStudent={async (id) => { await API.delete(`/students/${id}`); syncData(); }} onAddBatch={async (b) => { await API.post('/batches', b); syncData(); }} />}
              
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
                      // ADD SUBJECT
                      if (updatedFullData.subjects.length > subjects.length) {
                        const newSub = updatedFullData.subjects[updatedFullData.subjects.length - 1];
                        await API.post('/subjects', { ...newSub, courseId: newSub.courseId });
                      } 
                      // DELETE SUBJECT
                      else if (updatedFullData.subjects.length < subjects.length) {
                        const deletedSubId = subjects.find(s => !updatedFullData.subjects.find(us => us.id === s.id))?.id;
                        if (deletedSubId) await API.delete(`/subjects/${deletedSubId}`);
                      }
                      // ASSIGN TEACHER
                      if (updatedFullData.teacherAssignments?.length > teacherAssignments.length) {
                        const newAssign = updatedFullData.teacherAssignments[updatedFullData.teacherAssignments.length - 1];
                        await API.post('/assign-teacher', newAssign);
                      }
                      await syncData();
                    } catch (err) { console.error("Update failed", err); }
                  }} 
                />
              )}
              
              {/* 🆕 Live Document Verification Module */}
              {page === 'documents' && <DocumentVerification onRefresh={syncData} />}
              
              {page === 'reports' && <div className="p-10 text-center text-gray-500">Analytics & Reports Module Generating...</div>}
            
            </DashboardLayout>
          ) : <Navigate to="/login" />
        } />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div> 
  );
}