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
  // This function pulls the latest data from MySQL via your Backend
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
      console.error("Master Sync failed. Ensure server.js is running."); 
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
  
  // FIXED: Approve Faculty
  const handleApprove = async (id) => {
    try {
      await API.post(`/approve-teacher/${id}`);
      await syncData(); // Refresh UI after change
      alert("Faculty member approved!");
    } catch (err) { 
      alert("Approval operation failed."); 
    }
  };

  // FIXED: Create Batch (This was your 500 error source)
  const handleAddBatch = async (newBatch) => {
    try {
      // Send to backend
      const response = await API.post('/batches', newBatch);
      
      if (response.data.success) {
        // Option 1: Optimistic UI update
        // setBatches(prev => [...prev, response.data]); 
        
        // Option 2: Full Sync (Safer - gets the auto-increment ID from DB)
        await syncData(); 
        console.log("Batch created and synced.");
      }
    } catch (err) {
      console.error("Batch creation failed:", err.response?.data || err.message);
      alert("Batch creation failed: " + (err.response?.data?.error || "Check server terminal"));
    }
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
              {/* 1. OVERVIEW */}
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

              {/* 2. DEPARTMENTS */}
              {page === 'departments' && (
                <Departments 
                  userRole={role} 
                  departments={departments} 
                  onAddDept={async (d) => { await API.post('/departments', d); syncData(); }} 
                  onDeleteDept={async (id) => { await API.delete(`/departments/${id}`); syncData(); }} 
                />
              )}

              {/* 3. TEACHERS */}
              {page === 'teachers' && (
                <Teachers userRole={role} teachers={approvedTeachers} departments={departments} onRefresh={syncData} />
              )}

              {/* 4. STUDENTS */}
              {page === 'students' && (
                <Students 
                  userRole={role} 
                  batches={batches} 
                  allStudents={allStudents} 
                  displayDepts={departments}
                  onViewProfile={(s) => { setSelectedStudent(s); setPage('student-portal-view'); }}
                  onAddStudent={async (d) => { await API.post('/students', d); syncData(); }} 
                  onDeleteStudent={async (id) => { await API.delete(`/students/${id}`); syncData(); }} 
                  onAddBatch={handleAddBatch} 
                />
              )}

              {/* 5. SUBJECTS */}
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

              {/* 6. FACULTY PORTAL */}
              {page === 'faculty-portal' && (
                <FacultyPortal 
                  currentUser={currentUser} 
                  userRole={role} 
                  onSaveMarks={async (m) => { await API.post('/faculty/save-marks', m); syncData(); }} 
                />
              )}
              
              {/* 7. PREVIEW STUDENT PROFILE */}
              {page === 'student-portal-view' && selectedStudent && (
                <div className="p-4 bg-white/5 rounded-2xl text-left">
                  <button onClick={() => setPage('students')} className="mb-4 text-blue-400 hover:underline">← Back to List</button>
                  <StudentPortal id={selectedStudent.id} isPreview={true} />
                </div>
              )}

              {page === 'documents' && <DocumentVerification userRole={role} onRefresh={syncData} />}
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
              <GatewayView 
                batches={batches} 
                allStudents={allStudents} 
                userRole={role} 
                currentUser={currentUser} 
                onLogout={handleLogout} 
              />
            </div>
          ) : <Navigate to="/login" />
        } />
        
        <Route path="/results/master/:batchId" element={
          role ? (
            <div className="absolute inset-0 z-50 bg-[#f4f7fb] text-slate-800 min-h-screen w-full font-sans overflow-auto text-left">
              <MasterView 
                userRole={role} 
                currentUser={currentUser} 
                batches={batches}
                allStudents={allStudents}
                subjects={subjects}
                onLogout={handleLogout}
              />
            </div>
          ) : <Navigate to="/login" />
        } />

        <Route path="/student-portal/:id" element={<StudentPortal />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div> 
  );
}