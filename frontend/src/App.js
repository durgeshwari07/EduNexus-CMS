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