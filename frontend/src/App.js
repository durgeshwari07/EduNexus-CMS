import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';

/* --- 1. UI & SHELL --- */
import Home from './Home'; 
import './Home.css';
import DashboardLayout from './layouts/DashboardLayout';
import StarField from './components/StarField';

/* --- 2. PAGES --- */
import Login from './pages/Login';
import AdminRegistration from './pages/AdminRegistration';
import TeacherRegistration from './pages/TeacherRegistration';
import Overview from './pages/Overview';
import Departments from './pages/Departments';
import Teachers from './pages/Teachers';
import Students from './pages/Students';
import SubjectsManagement from './pages/SubjectsManagement';
import DocumentVerification from './pages/DocumentVerification'; 
import Reports from './pages/Reports'; 


/* --- 3. PORTALS --- */
import StudentPortal from './assets/StudentPortal';
import FacultyPortal from './assets/FacultyPortal';

// API Configuration
const API = axios.create({ baseURL: 'http://localhost:5000/api' });

export default function App() {
  const navigate = useNavigate();

  // --- STATE MANAGEMENT ---
  const [role, setRole] = useState(() => JSON.parse(localStorage.getItem('user_role')) || null);
  const [currentUser, setCurrentUser] = useState(() => JSON.parse(localStorage.getItem('current_user')) || null);
  const [page, setPage] = useState('overview');
  const [selectedStudent, setSelectedStudent] = useState(null); 

  // Data State
  const [departments, setDepartments] = useState([]);
  const [approvedTeachers, setApprovedTeachers] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [batches, setBatches] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teacherAssignments, setTeacherAssignments] = useState([]);

  // --- 🔄 MASTER SYNC (MySQL) ---
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
      console.error("Master Sync failed. Ensure Node server and XAMPP are running."); 
    }
  }, [role]);

  useEffect(() => { syncData(); }, [syncData]);

  // --- AUTH HANDLERS ---
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
        {/* --- PUBLIC ROUTES --- */}
        <Route path="/" element={<Home />} />
        
        <Route path="/login" element={
          role ? <Navigate to="/dashboard" /> : <Login onLoginSuccess={handleAuth} />
        } />
        
        <Route path="/student-portal/:id" element={<StudentPortal />} />

        {/* --- REGISTRATION FLOW --- */}
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

        {/* --- 🛠️ PROTECTED DASHBOARD ROUTES --- */}
        <Route path="/dashboard/*" element={
          role ? (
            <DashboardLayout 
              userRole={role} 
              currentUser={currentUser} 
              currentPage={page} 
              setCurrentPage={setPage} 
              onLogout={handleLogout}
            >
              {/* Conditional Page Rendering */}
              {page === 'overview' && (
                <Overview 
                  departments={departments} 
                  teachersCount={approvedTeachers.length} 
                  studentsCount={allStudents.length} 
                  pendingTeachers={pendingRequests} 
                />
              )}
              
              {page === 'departments' && (
                <Departments 
                  userRole={role} 
                  departments={departments} 
                  onAddDept={async (d) => { await API.post('/departments', d); syncData(); }} 
                  onEditDept={async (id, d) => { await API.put(`/departments/${id}`, d); syncData(); }} 
                  onDeleteDept={async (id) => { await API.delete(`/departments/${id}`); syncData(); }} 
                />
              )}
              
              {page === 'teachers' && (
                <Teachers userRole={role} teachers={approvedTeachers} onRefresh={syncData} />
              )}
              
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
                  data={{ subjects, courses: departments, users: approvedTeachers, teacherAssignments }} 
                  updateData={async () => { await syncData(); }} 
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
              
              {page === 'documents' && <DocumentVerification onRefresh={syncData} />}
              
              {page === 'reports' && (
                <Reports data={{ departments, teachers: approvedTeachers, students: allStudents, subjects }} />
              )}
            
            </DashboardLayout>
          ) : <Navigate to="/login" />
        } />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div> 
  );
}