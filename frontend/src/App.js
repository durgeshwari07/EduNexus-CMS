// import React, { useState, useEffect, useCallback } from 'react';
// import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
// import axios from 'axios';

// import Home from './pages/Home'; 
// import DashboardLayout from './layouts/DashboardLayout';
// import StarField from './components/StarField';

// /* UI & SHELL COMPONENTS */
// import DashboardLayout from './layouts/DashboardLayout';
// import StarField from './components/StarField';

// /* PAGES */
// import Home from './pages/Home';
// import Login from './pages/Login';
// import AdminRegistration from './pages/AdminRegistration';
// import TeacherRegistration from './pages/TeacherRegistration';
// import Overview from './pages/Overview';
// import Teachers from './pages/Teachers';
// import Students from './pages/Students';
// import SubjectsManagement from './pages/SubjectsManagement';
// import Reports from './pages/Reports'; 

// import StudentPortal from './assets/StudentPortal';
// import FacultyPortal from './assets/FacultyPortal';

// import GatewayView from './ResultManagement/GatewayView';
// import MasterView from './ResultManagement/MasterView';

// /* PORTALS */
// import StudentPortal from './assets/StudentPortal';
// import FacultyPortal from './assets/FacultyPortal';

// // --- API CONFIGURATION ---
// const API = axios.create({ baseURL: 'http://localhost:5000/api' });

// export default function App() {
//   const navigate = useNavigate();
  
//   // --- AUTH & NAVIGATION STATE ---
//   // We initialize from localStorage so data persists on page refresh
//   const [role, setRole] = useState(() => JSON.parse(localStorage.getItem('user_role')) || null);
//   const [currentUser, setCurrentUser] = useState(() => JSON.parse(localStorage.getItem('current_user')) || null);
//   const [page, setPage] = useState('overview');
//   const [selectedStudent, setSelectedStudent] = useState(null); 

//   // --- GLOBAL DATA STATE (MySQL Synced) ---
//   const [departments, setDepartments] = useState([]);
//   const [approvedTeachers, setApprovedTeachers] = useState([]);
//   const [pendingRequests, setPendingRequests] = useState([]);
//   const [allStudents, setAllStudents] = useState([]);
//   const [batches, setBatches] = useState([]);
//   const [subjects, setSubjects] = useState([]);
//   const [teacherAssignments, setTeacherAssignments] = useState([]);

//   // --- 🔄 MASTER SYNC (Fetches everything from MySQL) ---
//   // This ensures your KPI cards (Overview) always show the live count
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
//       console.error("Master Sync failed. Ensure server.js is running on port 5000."); 
//     }
//   }, [role]);

//   // Sync on login, logout, or page switch to keep data "Smooth"
//   useEffect(() => { 
//     syncData(); 
//   }, [syncData, page]);

//   // --- 🔐 AUTH HANDLERS ---
//   const handleAuth = (userRole, userData) => {
//     setRole(userRole);
//     setCurrentUser(userData);
//     localStorage.setItem('user_role', JSON.stringify(userRole));
//     localStorage.setItem('current_user', JSON.stringify(userData));
//     // Admin starts at Overview, Teacher starts at Faculty Portal
//     setPage(userRole === 'admin' ? 'overview' : 'faculty-portal');
//     navigate('/dashboard');
//   };

//   const handleLogout = () => {
//     localStorage.clear();
//     setRole(null);
//     setCurrentUser(null);
//     navigate('/');
//   };

//   // --- 🛠️ ACTION HANDLERS ---
//   const handleApprove = async (id) => {
//     try {
//       await API.post(`/approve-teacher/${id}`);
//       await syncData(); // Refresh UI immediately after approval
//       alert("Faculty member approved and access granted!");
//     } catch (err) { 
//       alert("Approval operation failed."); 
//     }
//   };

//   const handleLogout = () => {
//     setRole(null);
//     setCurrentUser(null);
//     localStorage.clear();
//     navigate('/');
//   const handleAddBatch = async (batchData) => {
//     try {
//       await API.post('/batches', batchData);
//       await syncData();
//     } catch (err) { console.error("Batch creation failed"); }
//   };

//   return (
//     <div className="App min-h-screen bg-[#0a0a0a] text-[#ccc]">
//       <StarField />
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/login" element={role ? <Navigate to="/dashboard" /> : <Login onLoginSuccess={handleAuth} />} />
//         <Route path="/student-portal/:id" element={<StudentPortal />} />

        
//         {/* LOGIN GATE */}
//         <Route path="/login" element={
//           role ? <Navigate to="/dashboard" /> : <Login onLoginSuccess={handleAuth} />
//         } />

//         {/* REGISTRATION FLOWS */}
//         <Route path="/register/admin" element={
//           <AdminRegistration onRegister={async (d) => { 
//             try {
//               const res = await API.post('/register/admin', d); 
//               if(res.data.success) handleAuth('admin', res.data.user); 
//             } catch (err) { alert("Registration error."); }
//           }} />
//         } />

//         <Route path="/register/teacher" element={
//           <TeacherRegistration 
//             departments={departments} 
//             onRegister={async (d) => { 
//               try {
//                 const res = await API.post('/register-teacher', d); 
//                 return res.data.success; // Triggers the success UI in the component
//               } catch (err) { return false; }
//             }} 
//           />
//         } />

//         <Route path="/student-portal/:id" element={<StudentPortal />} />

//         {/* PROTECTED DASHBOARD GATEWAY */}
//         <Route path="/dashboard/*" element={
//           role ? (
//             <DashboardLayout 
//               userRole={role} 
//               currentUser={currentUser} // Passes name/college to Header
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
//               {page === 'teachers' && <Teachers userRole={role} teachers={approvedTeachers} onRefresh={syncData} />}
              
//               {/* 1. OVERVIEW: Live Stats and Pending Approvals */}
//               {page === 'overview' && (
//                 <Overview 
//                   userRole={role} 
//                   departments={departments} 
//                   teachers={approvedTeachers} 
//                   pendingTeachers={pendingRequests} 
//                   allStudents={allStudents} 
//                   subjects={subjects}
//                   onApprove={handleApprove}
//                 />
//               )}

//               {/* 2. DEPARTMENTS MANAGEMENT */}
//               {page === 'departments' && (
//                 <Departments userRole={role} departments={departments} 
//                   onAddDept={async (d) => { await API.post('/departments', d); syncData(); }} 
//                   onDeleteDept={async (id) => { await API.delete(`/departments/${id}`); syncData(); }} 
//                 />
//               )}
              
//               {/* 3. FACULTY DIRECTORY */}
//               {page === 'teachers' && (
//                 <Teachers userRole={role} teachers={approvedTeachers} departments={departments} onRefresh={syncData} />
//               )}
              
//               {/* 4. STUDENT RECORDS */}
//               {page === 'students' && (
//                 <Students userRole={role} batches={batches} allStudents={allStudents} 
//                   onViewProfile={(s) => { setSelectedStudent(s); setPage('student-portal-view'); }}
//                   onAddStudent={async (d) => { await API.post('/students', d); syncData(); }} 
//                   onDeleteStudent={async (id) => { await API.delete(`/students/${id}`); syncData(); }} 
//                   onAddBatch={handleAddBatch} 
//                 />
//               )}

//               {/* 5. CURRICULUM CONTROL */}
//               {page === 'subjects' && (
//                 <SubjectsManagement userRole={role} data={{ subjects, courses: departments, users: approvedTeachers, teacherAssignments }} 
//                   updateData={async (p) => { 
//                     if (p.action === 'add') await API.post('/subjects', p.subject);
//                     else if (p.action === 'assign') await API.post('/assign-teacher', p.assignment);
//                     else if (p.action === 'delete') await API.delete(`/subjects/${p.id}`);
//                     await syncData();
//                   }} 
//                 />
//               )}

//               {/* 6. FACULTY TOOLS */}
//               {page === 'faculty-portal' && (
//                 <FacultyPortal currentUser={currentUser} userRole={role} onSaveMarks={async (m) => { await API.post('/faculty/save-marks', m); syncData(); }} />
//               )}
              
//               {/* 7. VIEW MODES */}
//               {page === 'student-portal-view' && selectedStudent && (
//                 <div className="p-4 bg-white/5 rounded-2xl">
//                   <button onClick={() => setPage('students')} className="mb-4 text-blue-400 hover:underline">← Back to List</button>
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
//               {page === 'reports' && (
//                 <Reports data={{ departments, teachers: approvedTeachers, students: allStudents, subjects }} />
//               )}
//             </DashboardLayout>
//           ) : <Navigate to="/login" />
//         } />
        
//         {/* --- LIGHT THEME WRAPPERS FOR RESULT MANAGEMENT --- */}
//         <Route path="/results" element={
//           role ? (
//             <div className="bg-[#f4f7fb] text-slate-800 h-screen w-screen overflow-hidden text-left font-sans">
//               <GatewayView userRole={role} currentUser={currentUser} setCurrentPage={setPage} onLogout={handleLogout} />
//             </div>
//           ) : <Navigate to="/login" />
//         } />
        
//         <Route path="/results/master/:batchId" element={
//           role ? (
//             <div className="bg-[#f4f7fb] text-slate-800 h-screen w-screen overflow-hidden text-left font-sans">
//               <MasterView userRole={role} currentUser={currentUser} setCurrentPage={setPage} onLogout={handleLogout} />
//             </div>
//           ) : <Navigate to="/login" />
//         } />


//               {page === 'documents' && <DocumentVerification userRole={role} onRefresh={syncData} />}
//               {page === 'reports' && <Reports userRole={role} data={{ departments, teachers: approvedTeachers, students: allStudents, subjects }} />}
            
//             </DashboardLayout>
//           ) : <Navigate to="/login" />
//         } />
//         <Route path="*" element={<Navigate to="/" replace />} />

//         {/* --- RESULT MANAGEMENT ROUTES --- */}
//         <Route path="/results" element={
//           role ? (
//             <div className="absolute inset-0 z-50 bg-[#f4f7fb] text-slate-800 min-h-screen w-full font-sans overflow-auto text-left">
//               <GatewayView userRole={role} currentUser={currentUser} setCurrentPage={setPage} onLogout={handleLogout} />
//             </div>
//           ) : <Navigate to="/login" />
//         } />
        
//         <Route path="/results/master/:batchId" element={
//           role ? (
//             <div className="absolute inset-0 z-50 bg-[#f4f7fb] text-slate-800 min-h-screen w-full font-sans overflow-hidden text-left">
//               <MasterView userRole={role} currentUser={currentUser} setCurrentPage={setPage} onLogout={handleLogout} />
//             </div>
//           ) : <Navigate to="/login" />
//         } />
//       </Routes>
//     </div> 
//   );
// }


import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';

/* UI & SHELL COMPONENTS */
import DashboardLayout from './layouts/DashboardLayout';
import StarField from './components/StarField';

/* PAGES */
import Home from './pages/Home';
import Login from './pages/Login';
import AdminRegistration from './pages/AdminRegistration';
import TeacherRegistration from './pages/TeacherRegistration';
import Overview from './pages/Overview';
import Teachers from './pages/Teachers';
import Students from './pages/Students';
import SubjectsManagement from './pages/SubjectsManagement';
import Reports from './pages/Reports'; 

/* PORTALS & VIEWS */
import StudentPortal from './assets/StudentPortal';
import FacultyPortal from './assets/FacultyPortal';
import GatewayView from './ResultManagement/GatewayView';
import MasterView from './ResultManagement/MasterView';

// --- API CONFIGURATION ---
const API = axios.create({ baseURL: 'http://localhost:5000/api' });

export default function App() {
  const navigate = useNavigate();
  
  // --- AUTH & NAVIGATION STATE ---
  const [role, setRole] = useState(() => JSON.parse(localStorage.getItem('user_role')) || null);
  const [currentUser, setCurrentUser] = useState(() => JSON.parse(localStorage.getItem('current_user')) || null);
  const [page, setPage] = useState('overview');
  const [selectedStudent, setSelectedStudent] = useState(null); 

  // --- GLOBAL DATA STATE ---
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
    } catch (err) { 
      console.error("Master Sync failed. Ensure server.js is running on port 5000."); 
    }
  }, [role]);

  useEffect(() => { 
    syncData(); 
  }, [syncData, page]);

  // --- 🔐 AUTH HANDLERS ---
  const handleAuth = (userRole, userData) => {
    setRole(userRole);
    setCurrentUser(userData);
    localStorage.setItem('user_role', JSON.stringify(userRole));
    localStorage.setItem('current_user', JSON.stringify(userData));
    setPage(userRole === 'admin' ? 'overview' : 'faculty-portal');
    navigate('/dashboard');
  };

  const handleLogout = () => {
    localStorage.clear();
    setRole(null);
    setCurrentUser(null);
    navigate('/');
  };

  // --- 🛠️ ACTION HANDLERS ---
  const handleApprove = async (id) => {
    try {
      await API.post(`/approve-teacher/${id}`);
      await syncData();
      alert("Faculty member approved!");
    } catch (err) { 
      alert("Approval operation failed."); 
    }
  };

  const handleAddBatch = async (batchData) => {
    try {
      await API.post('/batches', batchData);
      await syncData();
    } catch (err) { console.error("Batch creation failed"); }
  };

  return (
    <div className="App min-h-screen bg-[#0a0a0a] text-[#ccc]">
      <StarField />
      <Routes>
        <Route path="/" element={<Home />} />
        
        {/* AUTH ROUTES */}
        <Route path="/login" element={role ? <Navigate to="/dashboard" /> : <Login onLoginSuccess={handleAuth} />} />
        
        <Route path="/register/admin" element={
          <AdminRegistration onRegister={async (d) => { 
            try {
              const res = await API.post('/register/admin', d); 
              if(res.data.success) handleAuth('admin', res.data.user); 
            } catch (err) { alert("Registration error."); }
          }} />
        } />

        <Route path="/register/teacher" element={
          <TeacherRegistration 
            departments={departments} 
            onRegister={async (d) => { 
              try {
                const res = await API.post('/register-teacher', d); 
                return res.data.success;
              } catch (err) { return false; }
            }} 
          />
        } />

        <Route path="/student-portal/:id" element={<StudentPortal />} />

        {/* PROTECTED DASHBOARD GATEWAY */}
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
                  userRole={role} 
                  departments={departments} 
                  teachers={approvedTeachers} 
                  pendingTeachers={pendingRequests} 
                  allStudents={allStudents} 
                  subjects={subjects}
                  onApprove={handleApprove}
                />
              )}

              {page === 'teachers' && (
                <Teachers userRole={role} teachers={approvedTeachers} departments={departments} onRefresh={syncData} />
              )}

              {page === 'students' && (
                <Students userRole={role} batches={batches} allStudents={allStudents} 
                  onViewProfile={(s) => { setSelectedStudent(s); setPage('student-portal-view'); }}
                  onAddStudent={async (d) => { await API.post('/students', d); syncData(); }} 
                  onDeleteStudent={async (id) => { await API.delete(`/students/${id}`); syncData(); }} 
                  onAddBatch={handleAddBatch} 
                />
              )}

              {page === 'subjects' && (
                <SubjectsManagement 
                  userRole={role} 
                  data={{ subjects, courses: departments, users: approvedTeachers, teacherAssignments }} 
                  updateData={async (p) => { 
                    if (p.action === 'add') await API.post('/subjects', p.subject);
                    else if (p.action === 'assign') await API.post('/assign-teacher', p.assignment);
                    else if (p.action === 'delete') await API.delete(`/subjects/${p.id}`);
                    else if (p.action === 'edit') await API.put(`/subjects/${p.subject.id}`, p.subject);
                    await syncData();
                  }} 
                />
              )}

              {page === 'faculty-portal' && (
                <FacultyPortal 
                  currentUser={currentUser} 
                  userRole={role} 
                  onSaveMarks={async (m) => { await API.post('/faculty/save-marks', m); syncData(); }} 
                />
              )}
              
              {page === 'student-portal-view' && selectedStudent && (
                <div className="p-4 bg-white/5 rounded-2xl">
                  <button onClick={() => setPage('students')} className="mb-4 text-blue-400 hover:underline">← Back to List</button>
                  <StudentPortal id={selectedStudent.id} isPreview={true} />
                </div>
              )}

              {page === 'reports' && (
                <Reports data={{ departments, teachers: approvedTeachers, students: allStudents, subjects }} />
              )}
            </DashboardLayout>
          ) : <Navigate to="/login" />
        } />
        
        {/* RESULT MANAGEMENT ROUTES */}
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

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div> 
  );
}