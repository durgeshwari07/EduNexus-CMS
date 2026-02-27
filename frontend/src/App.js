


// import React, { useState, useEffect, useCallback } from 'react';
// import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
// import axios from 'axios';

// /* UI & SHELL COMPONENTS */
// import DashboardLayout from './layouts/DashboardLayout';
// import StarField from './components/StarField';

// /* PAGES */
// import Home from './pages/Home';
// import Login from './pages/Login';
// import AdminRegistration from './pages/AdminRegistration';
// import TeacherRegistration from './pages/TeacherRegistration';
// import Overview from './pages/Overview';
// import Departments from './pages/Departments';
// import Teachers from './pages/Teachers';
// import Students from './pages/Students';
// import SubjectsManagement from './pages/SubjectsManagement';
// import Reports from './pages/Reports'; 
// import DocumentVerification from './pages/DocumentVerification';

// /* PORTALS & VIEWS */
// import StudentPortal from './assets/StudentPortal';
// import FacultyPortal from './assets/FacultyPortal'; 
// import GatewayView from './ResultManagement/GatewayView';
// import MasterView from './ResultManagement/MasterView';

// // --- API CONFIGURATION ---
// const API_URL = 'http://localhost:5000/api';
// export const API = axios.create({ baseURL: API_URL });

// // ---  AUTH INTERCEPTOR ---
// API.interceptors.request.use((config) => {
//   const user = JSON.parse(localStorage.getItem('current_user'));
//   if (user && user.token) {
//     config.headers.Authorization = `Bearer ${user.token}`;
//   }
//   return config;
// }, (error) => Promise.reject(error));

// export default function App() {
//   const navigate = useNavigate();

//   // --- AUTH STATE ---
//   const [role, setRole] = useState(() => JSON.parse(localStorage.getItem('user_role')) || null);
//   const [currentUser, setCurrentUser] = useState(() => JSON.parse(localStorage.getItem('current_user')) || null);
//   const [page, setPage] = useState('overview');
//   const [selectedStudent, setSelectedStudent] = useState(null); 

//   // --- GLOBAL DATA STATE ---
//   const [departments, setDepartments] = useState([]);
//   const [approvedTeachers, setApprovedTeachers] = useState([]);
//   const [pendingRequests, setPendingRequests] = useState([]);
//   const [allStudents, setAllStudents] = useState([]);
//   const [batches, setBatches] = useState([]);
//   const [subjects, setSubjects] = useState([]);
//   const [teacherAssignments, setTeacherAssignments] = useState([]);
//   const [allMarks, setAllMarks] = useState([]); 

//   // --- 🔄 MASTER SYNC ---
//   const syncData = useCallback(async () => {
//     if (!role || role === 'student') return; 
//     try {
//       const res = await API.get('/dashboard/data');
//       if (res.data) {
//         setDepartments(res.data.departments || []);
//         setApprovedTeachers(res.data.teachers || []);
//         setPendingRequests(res.data.pendingTeachers || []);
//         setAllStudents(res.data.students || []);
//         setBatches(res.data.batches || []); 
//         setSubjects(res.data.subjects || []);
//         setTeacherAssignments(res.data.teacherAssignments || []);
//         setAllMarks(res.data.marks || []);
//       }
//     } catch (err) { 
//       console.error("Master Sync failed.", err);
//       if (err.response?.status === 401 || err.response?.status === 403) {
//         handleLogout();
//       }
//     }
//   }, [role]);

//   useEffect(() => { syncData(); }, [syncData, page]);

//   // ---  AUTH HANDLERS ---
//   const handleAuth = (userRole, userData) => {
//     setRole(userRole);
//     setCurrentUser(userData);
//     localStorage.setItem('user_role', JSON.stringify(userRole));
//     localStorage.setItem('current_user', JSON.stringify(userData));
    
//     if (userRole === 'admin') {
//       setPage('overview');
//       navigate('/dashboard');
//     } else if (userRole === 'teacher') {
//       setPage('faculty-portal'); 
//       navigate('/dashboard');
//     } else if (userRole === 'student') {
//       navigate(`/student-portal/${userData.id}`);
//     }
//   };

//   const handleLogout = () => {
//     localStorage.clear();
//     setRole(null);
//     setCurrentUser(null);
//     navigate('/login');
//   };

//   return (
//     <div className="App min-h-screen bg-slate-50 text-slate-900">
//       <StarField />
      
//       <Routes>
//         {/* PUBLIC & AUTH ROUTES */}
//         <Route path="/" element={<Home />} />
        
//         <Route path="/login" element={
//           role ? (
//             role === 'student' ? <Navigate to={`/student-portal/${currentUser.id}`} replace /> : <Navigate to="/dashboard" replace />
//           ) : <Login onLoginSuccess={handleAuth} />
//         } />

//         <Route path="/register/admin" element={
//           <AdminRegistration onRegister={async (data) => { 
//             try {
//               const res = await API.post('/auth/register/admin', data); 
//               if(res.data.success) handleAuth('admin', res.data.user); 
//             } catch (err) { alert("Registration error."); }
//           }} />
//         } />

//         <Route path="/register/teacher" element={
//           <TeacherRegistration 
//             departments={departments} 
//             onRegister={async (data) => { 
//               try {
//                 const res = await API.post('/auth/register-teacher', data); 
//                 return res.data.success;
//               } catch (err) { return false; }
//             }} 
//           />
//         } />

//         {/*  PROTECTED DASHBOARD ROUTES */}
//         <Route path="/dashboard/*" element={
//           role && role !== 'student' ? (
//             <DashboardLayout 
//               userRole={role} currentUser={currentUser} 
//               currentPage={page} setCurrentPage={setPage} onLogout={handleLogout}
//             >
//               {page === 'overview' && (
//                 <Overview 
//                   userRole={role} departments={departments} teachers={approvedTeachers} 
//                   pendingTeachers={pendingRequests} allStudents={allStudents} subjects={subjects} 
//                   onApprove={async (id) => { await API.post(`/approve-teacher/${id}`); syncData(); }} 
//                 />
//               )}

//               {page === 'departments' && (
//                 <Departments 
//                   userRole={role} departments={departments} 
//                   onAddDept={async (d) => { await API.post('/departments', d); syncData(); }} 
//                   onDeleteDept={async (id) => { await API.delete(`/departments/${id}`); syncData(); }} 
//                 />
//               )}

//               {page === 'teachers' && <Teachers userRole={role} teachers={approvedTeachers} departments={departments} onRefresh={syncData} />}

//               {page === 'students' && (
//                 <Students 
//                   userRole={role} batches={batches} allStudents={allStudents} displayDepts={departments}
//                   onViewProfile={(s) => { setSelectedStudent(s); setPage('student-portal-view'); }}
//                   onAddStudent={async (d) => { await API.post('/students', d); syncData(); }} 
//                   onDeleteStudent={async (id) => { await API.delete(`/students/${id}`); syncData(); }} 
//                   onAddBatch={async (b) => { await API.post('/batches', b); syncData(); }} 
//                 />
//               )}

//               {page === 'subjects' && (
//                 <SubjectsManagement 
//                   userRole={role} 
//                   data={{ subjects, courses: departments, users: approvedTeachers, teacherAssignments }} 
//                   updateData={async (p) => { 
//                     if (p.action === 'add') await API.post('/subjects', p.subject);
//                     else if (p.action === 'assign') await API.post('/assign-teacher', p.assignment);
//                     else if (p.action === 'delete') await API.delete(`/subjects/${p.id}`);
//                     else if (p.action === 'edit') await API.put(`/subjects/${p.subject.id}`, p.subject);
//                     await syncData();
//                   }} 
//                 />
//               )}

//               {page === 'faculty-portal' && (
//                 <FacultyPortal 
//                   currentUser={currentUser} 
//                   userRole={role} 
//                   externalData={{ teachers: approvedTeachers, subjects, students: allStudents, teacherAssignments }}
//                 />
//               )}
              
//               {page === 'student-portal-view' && selectedStudent && (
//                 <div className="p-4 bg-white shadow-xl rounded-2xl border border-slate-200">
//                   <button onClick={() => { setSelectedStudent(null); setPage('students'); }} className="mb-4 px-4 py-2 bg-slate-800 rounded-lg text-white hover:bg-slate-700 transition flex items-center gap-2">
//                     <span>←</span> Back to List
//                   </button>
//                   <StudentPortal id={selectedStudent.id} isPreview={true} />
//                 </div>
//               )}

//               {page === 'documents' && <DocumentVerification userRole={role} onRefresh={syncData} />}
//               {page === 'reports' && <Reports data={{ departments, teachers: approvedTeachers, students: allStudents, subjects }} />}
//             </DashboardLayout>
//           ) : <Navigate to="/login" replace />
//         } />
        
//         {/*  RESULT MANAGEMENT MODULE */}
//         <Route path="/results" element={ 
//           role ? <GatewayView batches={batches} allStudents={allStudents} displayDepts={departments} userRole={role} currentUser={currentUser} onLogout={handleLogout} /> 
//           : <Navigate to="/login" /> 
//         } />
        
//         <Route path="/results/master/:batchId" element={ 
//           role ? <MasterView userRole={role} currentUser={currentUser} onLogout={handleLogout} /> 
//           : <Navigate to="/login" /> 
//         } />

//         {/*  STUDENT PORTAL */}
//         <Route path="/student-portal/:id" element={<StudentPortal isPreview={false} />} />

//         {/*  CATCH-ALL */}
//         <Route path="*" element={<Navigate to="/" replace />} />
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
import Departments from './pages/Departments';
import Teachers from './pages/Teachers';
import Students from './pages/Students';
import SubjectsManagement from './pages/SubjectsManagement';
import Reports from './pages/Reports'; 
import DocumentVerification from './pages/DocumentVerification';

/* PORTALS & VIEWS */
import StudentPortal from './assets/StudentPortal';
import FacultyPortal from './assets/FacultyPortal'; 
import GatewayView from './ResultManagement/GatewayView';
import MasterView from './ResultManagement/MasterView';

// --- API CONFIGURATION ---
const API_URL = 'http://localhost:5000/api';
export const API = axios.create({ baseURL: API_URL });

// --- AUTH INTERCEPTOR ---
API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('current_user'));
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
}, (error) => Promise.reject(error));

export default function App() {
  const navigate = useNavigate();

  // --- AUTH STATE ---
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
  const [allMarks, setAllMarks] = useState([]); 

  // --- 🔄 MASTER SYNC ---
  const syncData = useCallback(async () => {
    if (!role || role === 'student') return; 
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
        setAllMarks(res.data.marks || []);
      }
    } catch (err) { 
      console.error("Master Sync failed.", err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        handleLogout();
      }
    }
  }, [role]);

  useEffect(() => { syncData(); }, [syncData, page]);

  // --- AUTH HANDLERS ---
  const handleAuth = (userRole, userData) => {
    setRole(userRole);
    setCurrentUser(userData);
    localStorage.setItem('user_role', JSON.stringify(userRole));
    localStorage.setItem('current_user', JSON.stringify(userData));
    
    if (userRole === 'admin') {
      setPage('overview');
      navigate('/dashboard');
    } else if (userRole === 'teacher') {
      setPage('faculty-portal'); 
      navigate('/dashboard');
    } else if (userRole === 'student') {
      navigate(`/student-portal/${userData.id}`);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setRole(null);
    setCurrentUser(null);
    navigate('/login');
  };

  return (
    <div className="App min-h-screen bg-slate-50 text-slate-900">
      <StarField />
      
      <Routes>
        {/* PUBLIC & AUTH ROUTES */}
        <Route path="/" element={<Home />} />
        
        <Route path="/login" element={
          role ? (
            role === 'student' ? <Navigate to={`/student-portal/${currentUser.id}`} replace /> : <Navigate to="/dashboard" replace />
          ) : <Login onLoginSuccess={handleAuth} />
        } />

        <Route path="/register/admin" element={
          <AdminRegistration onRegister={async (data) => { 
            try {
              const res = await API.post('/auth/register/admin', data); 
              if(res.data.success) handleAuth('admin', res.data.user); 
            } catch (err) { alert("Registration error."); }
          }} />
        } />

        <Route path="/register/teacher" element={
          <TeacherRegistration 
            departments={departments} 
            onRegister={async (data) => { 
              try {
                const res = await API.post('/auth/register-teacher', data); 
                return res.data.success;
              } catch (err) { return false; }
            }} 
          />
        } />

        {/* PROTECTED DASHBOARD ROUTES */}
        <Route path="/dashboard/*" element={
          role && role !== 'student' ? (
            <DashboardLayout 
              userRole={role} currentUser={currentUser} 
              currentPage={page} setCurrentPage={setPage} onLogout={handleLogout}
            >
              {page === 'overview' && (
                <Overview 
                  userRole={role} departments={departments} teachers={approvedTeachers} 
                  pendingTeachers={pendingRequests} allStudents={allStudents} subjects={subjects} 
                  onApprove={async (id) => { 
                    // FIXED: Added /auth/ prefix which is likely required by your backend
                    await API.post(`/auth/approve-teacher/${id}`); 
                    syncData(); 
                  }} 
                />
              )}

              {page === 'departments' && (
                <Departments 
                  userRole={role} departments={departments} 
                  onAddDept={async (d) => { await API.post('/departments', d); syncData(); }} 
                  onDeleteDept={async (id) => { await API.delete(`/departments/${id}`); syncData(); }} 
                />
              )}

              {page === 'teachers' && <Teachers userRole={role} teachers={approvedTeachers} departments={departments} onRefresh={syncData} />}

              {page === 'students' && (
                <Students 
                  userRole={role} batches={batches} allStudents={allStudents} displayDepts={departments}
                  onViewProfile={(s) => { setSelectedStudent(s); setPage('student-portal-view'); }}
                  onAddStudent={async (d) => { await API.post('/students', d); syncData(); }} 
                  onDeleteStudent={async (id) => { await API.delete(`/students/${id}`); syncData(); }} 
                  onAddBatch={async (b) => { await API.post('/batches', b); syncData(); }} 
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
                  externalData={{ teachers: approvedTeachers, subjects, students: allStudents, teacherAssignments }}
                />
              )}
              
              {page === 'student-portal-view' && selectedStudent && (
                <div className="p-4 bg-white shadow-xl rounded-2xl border border-slate-200">
                  <button onClick={() => { setSelectedStudent(null); setPage('students'); }} className="mb-4 px-4 py-2 bg-slate-800 rounded-lg text-white hover:bg-slate-700 transition flex items-center gap-2">
                    <span>←</span> Back to List
                  </button>
                  <StudentPortal id={selectedStudent.id} isPreview={true} />
                </div>
              )}

              {page === 'documents' && <DocumentVerification userRole={role} onRefresh={syncData} />}
              {page === 'reports' && <Reports data={{ departments, teachers: approvedTeachers, students: allStudents, subjects }} />}
            </DashboardLayout>
          ) : <Navigate to="/login" replace />
        } />
        
        {/* RESULT MANAGEMENT MODULE */}
        <Route path="/results" element={ 
          role ? <GatewayView 
                   batches={batches} 
                   allStudents={allStudents} 
                   displayDepts={departments} 
                   userRole={role} 
                   currentUser={currentUser} 
                   onLogout={handleLogout} 
                   setCurrentPage={setPage} // Added state handler
                 /> 
          : <Navigate to="/login" /> 
        } />
        
        <Route path="/results/master/:batchId" element={ 
          role ? <MasterView 
                   userRole={role} 
                   currentUser={currentUser} 
                   onLogout={handleLogout} 
                   setCurrentPage={setPage} // Added state handler
                 /> 
          : <Navigate to="/login" /> 
        } />

        {/* STUDENT PORTAL */}
        <Route path="/student-portal/:id" element={<StudentPortal isPreview={false} />} />

        {/* CATCH-ALL */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div> 
  );
}