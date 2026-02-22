import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';

/* UI & SHELL */
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
import DocumentVerification from './pages/DocumentVerification'; 
import Reports from './pages/Reports'; 

/* PORTALS */
import StudentPortal from './assets/StudentPortal';
import FacultyPortal from './assets/FacultyPortal';

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

  useEffect(() => { syncData(); }, [syncData, page]);

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

  return (
    <div className="App min-h-screen bg-[#0a0a0a] text-[#ccc]">
      <StarField />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={role ? <Navigate to="/dashboard" /> : <Login onLoginSuccess={handleAuth} />} />
        <Route path="/student-portal/:id" element={<StudentPortal />} />

        {/* --- TEACHER REGISTRATION ROUTE --- */}
            <Route path="/register/teacher" element={
              <TeacherRegistration 
                departments={departments} 
                onRegister={async (teacherData) => { 
                  try { 
                    // 1. Send data to the new backend endpoint
                    const res = await API.post('/register-teacher', teacherData); 
                    
                    if (res.data.success) { 
                      // Return true so the component shows the "Application Sent" screen
                      return true; 
                    } 
                  } catch (err) { 
                    alert(err.response?.data?.message || "Registration failed. Username/Email might be taken."); 
                    return false;
                  } 
                }} 
              />
            } />

            {/* --- ADMIN REGISTRATION ROUTE --- */}
            <Route path="/register/admin" element={
            <AdminRegistration onRegister={async (adminData) => {
            try {
              const res = await API.post('/register/admin', adminData);
              
              if (res.data.success) {
                alert("Admin Account Created Successfully!");
                // Log them in immediately after registration
                handleAuth('admin', res.data.user);
              }
            } catch (err) {
              alert(err.response?.data?.message || "Registration failed. Username/Email already exists.");
            }
          }} />
        } />

        <Route path="/dashboard/*" element={
          role ? (
            <DashboardLayout userRole={role} currentUser={currentUser} currentPage={page} setCurrentPage={setPage} onLogout={handleLogout}>
              
              {page === 'overview' && (
                <Overview userRole={role} departments={departments} teachersCount={approvedTeachers.length} studentsCount={allStudents.length} pendingTeachers={pendingRequests} onApprove={async (id) => { await API.post(`/approve-teacher/${id}`); syncData(); }} />
              )}

              {page === 'departments' && (
                <Departments userRole={role} departments={departments} 
                  onAddDept={async (d) => { await API.post('/departments', d); syncData(); }} 
                  onEditDept={async (id, d) => { await API.put(`/departments/${id}`, d); syncData(); }} 
                  onDeleteDept={async (id) => { await API.delete(`/departments/${id}`); syncData(); }} 
                />
              )}
              
              {page === 'teachers' && (
                <Teachers userRole={role} teachers={approvedTeachers} departments={departments} onRefresh={syncData} />
              )}
              
              {page === 'students' && (
                <Students userRole={role} batches={batches} allStudents={allStudents} 
                  onViewProfile={(student) => { setSelectedStudent(student); setPage('student-portal-view'); }}
                  onAddStudent={async (d) => { await API.post('/students', d); syncData(); }} 
                  onDeleteStudent={async (id) => { await API.delete(`/students/${id}`); syncData(); }} 
                  onAddBatch={async (b) => { await API.post('/batches', b); syncData(); }} 
                />
              )}

              {page === 'student-portal-view' && selectedStudent && (
                <div className="p-4 bg-white/5 rounded-2xl">
                  <button onClick={() => setPage('students')} className="mb-4 text-blue-400 hover:underline">← Back to Directory</button>
                  <StudentPortal id={selectedStudent.id} isPreview={true} />
                </div>
              )}
              
              {page === 'subjects' && (
                <SubjectsManagement userRole={role} data={{ subjects, courses: departments, users: approvedTeachers, teacherAssignments }} 
                  updateData={async (payload) => { 
                    if (payload.action === 'add') await API.post('/subjects', payload.subject);
                    else if (payload.action === 'edit') await API.put(`/subjects/${payload.subject.id}`, payload.subject);
                    else if (payload.action === 'assign') await API.post('/assign-teacher', payload.assignment);
                    else if (payload.action === 'delete') await API.delete(`/subjects/${payload.id}`);
                    await syncData();
                  }} 
                />
              )}

              {page === 'faculty-portal' && (
                <FacultyPortal currentUser={currentUser} userRole={role} onSaveMarks={async (m) => { await API.post('/faculty/save-marks', m); syncData(); }} />
              )}
              
              {page === 'documents' && <DocumentVerification userRole={role} onRefresh={syncData} />}
              {page === 'reports' && <Reports userRole={role} data={{ departments, teachers: approvedTeachers, students: allStudents, subjects }} />}
            
            </DashboardLayout>
          ) : <Navigate to="/login" />
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div> 
  );
}