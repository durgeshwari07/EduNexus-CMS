// // // // // // // import React, { useState, useEffect } from 'react';
// // // // // // // import DashboardLayout from './layouts/DashboardLayout';
// // // // // // // import Home from './pages/Home';
// // // // // // // import Overview from './pages/Overview';
// // // // // // // import Departments from './pages/Departments';
// // // // // // // import Teachers from './pages/Teachers';
// // // // // // // import Students from './pages/Students';
// // // // // // // import Reports from './pages/Reports';
// // // // // // // // import SubjectExplorer from './pages/SubjectExplorer';
// // // // // // // import AcademicSubjects from './pages/AcademicSubjects';

// // // // // // // // --- Local Storage Helper ---
// // // // // // // const getInitialData = (key, fallback) => {
// // // // // // //   const saved = localStorage.getItem(key);
// // // // // // //   return saved ? JSON.parse(saved) : fallback;
// // // // // // // };

// // // // // // // export default function App() {
// // // // // // //   const [view, setView] = useState('home'); 
// // // // // // //   const [role, setRole] = useState(null);
// // // // // // //   const [page, setPage] = useState('overview');
  
// // // // // // //   // Current logged-in user context
// // // // // // //   const [currentUser] = useState({ id: 'T-101', name: 'Dr. Helena Vance', role: 'teacher' });

// // // // // // //   // --- 1. LIVE DATA STATES ---
// // // // // // //   const [departments, setDepartments] = useState(() => getInitialData('depts', [
// // // // // // //     { id: 1, name: 'Computer Science', code: 'CS-BCA', hod: 'Dr. Alan Turing', faculty: 45, students: 1200 },
// // // // // // //     { id: 2, name: 'Mechanical Eng.', code: 'ME-204', hod: 'Dr. Smith', faculty: 30, students: 850 },
// // // // // // //     { id: 3, name: 'Physics', code: 'PH-501', hod: 'Dr. Sarah Miller', faculty: 20, students: 400 }
// // // // // // //   ]));

// // // // // // //   const [approvedTeachers, setApprovedTeachers] = useState(() => getInitialData('teachers', [
// // // // // // //     { id: 'T-4092', name: 'Dr. Sarah Johnson', dept: 'Computer Science', subject: 'Artificial Intelligence', email: 's.johnson@college.edu', type: 'Permanent', initial: 'SJ' },
// // // // // // //     { id: 'T-3115', name: 'Prof. Michael Chen', dept: 'Physics', subject: 'Quantum Mechanics', email: 'm.chen@college.edu', type: 'Permanent', initial: 'MC' }
// // // // // // //   ]));

// // // // // // //   const [allStudents, setAllStudents] = useState(() => getInitialData('students', [
// // // // // // //     { id: 'STU-2024-001', name: 'Alex Johnson', email: 'alex.j@college.edu', batchId: 1, status: 'Active', initial: 'AJ' }
// // // // // // //   ]));

// // // // // // //   const [subjectsList, setSubjectsList] = useState(() => getInitialData('subjects', [
// // // // // // //     { id: 1, code: 'CS-101', name: 'Introduction to Algorithms', semester: 1, dept: 'Computer Science', teacher: 'Dr. Sarah Miller', credits: 4 },
// // // // // // //     { id: 2, code: 'MATH-202', name: 'Discrete Mathematics', semester: 2, dept: 'Mathematics', teacher: 'Prof. James Wilson', credits: 3 }
// // // // // // //   ]));

// // // // // // //   // --- 2. PERSISTENCE LAYER ---
// // // // // // //   useEffect(() => { localStorage.setItem('depts', JSON.stringify(departments)); }, [departments]);
// // // // // // //   useEffect(() => { localStorage.setItem('teachers', JSON.stringify(approvedTeachers)); }, [approvedTeachers]);
// // // // // // //   useEffect(() => { localStorage.setItem('students', JSON.stringify(allStudents)); }, [allStudents]);
// // // // // // //   useEffect(() => { localStorage.setItem('subjects', JSON.stringify(subjectsList)); }, [subjectsList]);

// // // // // // //   // --- 3. DATA HANDLERS ---
// // // // // // //   const onAddDept = (d) => setDepartments([...departments, { ...d, id: Date.now(), faculty: 0, students: 0 }]);
// // // // // // //   const onAddStudent = (s) => setAllStudents([{ ...s, id: `STU-${Date.now()}`, status: 'Active' }, ...allStudents]);
// // // // // // //   const onAddSubject = (sub) => setSubjectsList([{ ...sub, id: Date.now() }, ...subjectsList]);

// // // // // // //   if (view === 'home') return <Home onLogin={(r) => { setRole(r); setView('dashboard'); }} />;

// // // // // // //   const isAdmin = role === 'admin';

// // // // // // //   return (
// // // // // // //     <DashboardLayout userRole={role} currentPage={page} setCurrentPage={setPage} onLogout={() => setView('home')}>
      
// // // // // // //       {/* 1. Dashboard Overview / Analytics */}
// // // // // // //       {page === 'overview' && (
// // // // // // //         <Overview departments={departments} teachers={approvedTeachers} students={allStudents} />
// // // // // // //       )}
      
// // // // // // //       {/* 2. Department Management (Cards) */}
// // // // // // //       {page === 'departments' && (
// // // // // // //         <Departments 
// // // // // // //           userRole={role} 
// // // // // // //           departments={departments} 
// // // // // // //           onAddDept={onAddDept} 
// // // // // // //           onDeleteDept={(id) => setDepartments(departments.filter(d => d.id !== id))}
// // // // // // //         />
// // // // // // //       )}
      
// // // // // // //       {/* 3. Teacher Management (Table) */}
// // // // // // //       {page === 'teachers' && (
// // // // // // //         <Teachers 
// // // // // // //           userRole={role} 
// // // // // // //           teachers={approvedTeachers} 
// // // // // // //           onDelete={(id) => setApprovedTeachers(approvedTeachers.filter(t => t.id !== id))}
// // // // // // //         />
// // // // // // //       )}

// // // // // // //       {/* 4. Academic Subjects (Table View) */}
// // // // // // //       {page === 'subjects' && (
// // // // // // //         <AcademicSubjects 
// // // // // // //           subjects={subjectsList} 
// // // // // // //           isAdmin={isAdmin}
// // // // // // //           onDelete={(id) => setSubjectsList(subjectsList.filter(s => s.id !== id))}
// // // // // // //         />
// // // // // // //       )}

// // // // // // //       {/* 5. Subject Explorer (Teacher Perspective)
// // // // // // //       {page === 'explorer' && (
// // // // // // //         <SubjectExplorer currentUser={currentUser} subjects={subjectsList} teachers={approvedTeachers} />
// // // // // // //       )} */}

// // // // // // //       {/* 6. Reports & Insights */}
// // // // // // //       {page === 'reports' && (
// // // // // // //         <Reports departments={departments} teachers={approvedTeachers} studentsCount={allStudents.length} />
// // // // // // //       )}

// // // // // // //       {/* 7. Students Directory */}
// // // // // // //       {page === 'students' && (
// // // // // // //         <Students userRole={role} allStudents={allStudents} onAddStudent={onAddStudent} />
// // // // // // //       )}

// // // // // // //     </DashboardLayout>
// // // // // // //   );
// // // // // // // }





// // // // // // import React, { useState, useEffect } from 'react';
// // // // // // import DashboardLayout from './layouts/DashboardLayout';
// // // // // // import Home from './pages/Home';
// // // // // // import Overview from './pages/Overview';
// // // // // // import Departments from './pages/Departments';
// // // // // // import Teachers from './pages/Teachers';
// // // // // // import Students from './pages/Students';
// // // // // // import Reports from './pages/Reports';


// // // // // // // Persistence Helper
// // // // // // const getInitialData = (key, fallback) => {
// // // // // //   const saved = localStorage.getItem(key);
// // // // // //   return saved ? JSON.parse(saved) : fallback;
// // // // // // };

// // // // // // export default function App() {
// // // // // //   const [view, setView] = useState('home'); 
// // // // // //   const [role, setRole] = useState(null); // 'admin' or 'teacher'
// // // // // //   const [page, setPage] = useState('overview');

// // // // // //   // --- LIVE STATES ---
// // // // // //   const [departments, setDepartments] = useState(() => getInitialData('depts', [
// // // // // //     { id: 1, name: 'Computer Science', code: 'CS-BCA', hod: 'Dr. Alan Turing', faculty: 45, students: 1200 },
// // // // // //     { id: 2, name: 'Mechanical Eng.', code: 'ME-204', hod: 'Dr. Smith', faculty: 30, students: 850 }
// // // // // //   ]));

// // // // // //   const [approvedTeachers, setApprovedTeachers] = useState(() => getInitialData('teachers', [
// // // // // //     { id: 'T-101', name: 'Dr. Helena Vance', dept: 'Computer Science', initial: 'HV' },
// // // // // //     { id: 'T-202', name: 'Prof. Marcus Thorne', dept: 'Computer Science', initial: 'MT' }
// // // // // //   ]));

// // // // // //   const [allStudents, setAllStudents] = useState(() => getInitialData('students', []));

  

// // // // // //   // --- LOCAL STORAGE SYNC ---
// // // // // //   useEffect(() => { localStorage.setItem('depts', JSON.stringify(departments)); }, [departments]);
// // // // // //   useEffect(() => { localStorage.setItem('teachers', JSON.stringify(approvedTeachers)); }, [approvedTeachers]);
// // // // // //   useEffect(() => { localStorage.setItem('students', JSON.stringify(allStudents)); }, [allStudents]);
 
// // // // // //   // --- HANDLERS ---
// // // // // //   // const onAddSubject = (s) => setSubjectsList([{ ...s, id: Date.now() }, ...subjectsList]);

// // // // // //   if (view === 'home') return <Home onLogin={(r) => { setRole(r); setView('dashboard'); }} />;

// // // // // //   return (
// // // // // //     <DashboardLayout userRole={role} currentPage={page} setCurrentPage={setPage} onLogout={() => setView('home')}>
// // // // // //       {page === 'overview' && <Overview departments={departments} teachers={approvedTeachers} students={allStudents} />}
      
// // // // // //       {page === 'departments' && (
// // // // // //         <Departments 
// // // // // //           userRole={role} 
// // // // // //           departments={departments} 
// // // // // //           onAddDept={(d) => setDepartments([...departments, { ...d, id: Date.now() }])} 
// // // // // //           onDeleteDept={(id) => setDepartments(departments.filter(d => d.id !== id))}
// // // // // //         />
// // // // // //       )}
      
// // // // // //       {/*  */}

// // // // // //       {page === 'teachers' && <Teachers userRole={role} teachers={approvedTeachers} />}
// // // // // //       {page === 'reports' && <Reports departments={departments} teachers={approvedTeachers} studentsCount={allStudents.length} />}
// // // // // //       {page === 'students' && <Students userRole={role} allStudents={allStudents || []} onAddStudent={(s) => setAllStudents([s, ...allStudents])} />}
// // // // // //     </DashboardLayout>
// // // // // //   );
// // // // // // }





// // // // // import React, { useState, useEffect } from 'react';
// // // // // import DashboardLayout from './layouts/DashboardLayout';
// // // // // import Home from './pages/Home';
// // // // // import Overview from './pages/Overview';
// // // // // import Departments from './pages/Departments';
// // // // // import Teachers from './pages/Teachers';
// // // // // import Students from './pages/Students';
// // // // // import Reports from './pages/Reports';

// // // // // // --- Global Persistence Helper ---
// // // // // const getInitialData = (key, fallback) => {
// // // // //   const saved = localStorage.getItem(key);
// // // // //   return saved ? JSON.parse(saved) : fallback;
// // // // // };

// // // // // export default function App() {
// // // // //   const [view, setView] = useState('home'); 
// // // // //   const [role, setRole] = useState(null);
// // // // //   const [page, setPage] = useState('overview');

// // // // //   // --- 1. LIVE DATA STATES (Subjects Removed) ---
// // // // //   const [departments, setDepartments] = useState(() => getInitialData('depts', [
// // // // //     { id: 1, name: 'Computer Science', code: 'CS-BCA', hod: 'Dr. Alan Turing', faculty: 45, students: 1200 },
// // // // //     { id: 2, name: 'Mechanical Eng.', code: 'ME-204', hod: 'Dr. Smith', faculty: 30, students: 850 }
// // // // //   ]));

// // // // //   const [approvedTeachers, setApprovedTeachers] = useState(() => getInitialData('teachers', [
// // // // //     { id: 'T-101', name: 'Dr. Sarah Johnson', dept: 'Computer Science', email: 's.johnson@college.edu', initial: 'SJ' }
// // // // //   ]));

// // // // //   const [allStudents, setAllStudents] = useState(() => getInitialData('students', []));

// // // // //   // --- 2. LIVE SYNC EFFECTS ---
// // // // //   useEffect(() => { localStorage.setItem('depts', JSON.stringify(departments)); }, [departments]);
// // // // //   useEffect(() => { localStorage.setItem('teachers', JSON.stringify(approvedTeachers)); }, [approvedTeachers]);
// // // // //   useEffect(() => { localStorage.setItem('students', JSON.stringify(allStudents)); }, [allStudents]);

// // // // //   // --- 3. LOGIC HANDLERS ---
// // // // //   const onAddDept = (d) => setDepartments([...departments, { ...d, id: Date.now(), faculty: 0, students: 0 }]);
  
// // // // //   const onAddStudent = (s) => {
// // // // //     const initial = s.name ? s.name.charAt(0).toUpperCase() : '?';
// // // // //     setAllStudents([{ ...s, id: `STU-${Date.now()}`, initial, status: 'Active' }, ...allStudents]);
// // // // //   };

// // // // //   if (view === 'home') return <Home onLogin={(r) => { setRole(r); setView('dashboard'); }} />;

// // // // //   return (
// // // // //     <DashboardLayout 
// // // // //       userRole={role} 
// // // // //       currentPage={page} 
// // // // //       setCurrentPage={setPage} 
// // // // //       onLogout={() => setView('home')}
// // // // //     >
// // // // //       {/* Overview Analytics */}
// // // // //       {page === 'overview' && (
// // // // //         <Overview departments={departments} teachers={approvedTeachers} students={allStudents || []} />
// // // // //       )}
      
// // // // //       {/* Department Cards */}
// // // // //       {page === 'departments' && (
// // // // //         <Departments 
// // // // //           userRole={role} 
// // // // //           departments={departments} 
// // // // //           onAddDept={onAddDept} 
// // // // //           onDeleteDept={(id) => setDepartments(departments.filter(d => d.id !== id))}
// // // // //         />
// // // // //       )}
      
// // // // //       {/* Teacher Management */}
// // // // //       {page === 'teachers' && (
// // // // //         <Teachers 
// // // // //           userRole={role} 
// // // // //           teachers={approvedTeachers} 
// // // // //           onDelete={(id) => setApprovedTeachers(approvedTeachers.filter(t => t.id !== id))}
// // // // //         />
// // // // //       )}

// // // // //       {/* Reports & Analytics */}
// // // // //       {page === 'reports' && (
// // // // //         <Reports 
// // // // //           departments={departments} 
// // // // //           teachers={approvedTeachers} 
// // // // //           studentsCount={(allStudents || []).length} 
// // // // //         />
// // // // //       )}

// // // // //       {/* Students Directory */}
// // // // //       {page === 'students' && (
// // // // //         <Students 
// // // // //           userRole={role} 
// // // // //           allStudents={allStudents || []} 
// // // // //           onAddStudent={onAddStudent} 
// // // // //         />
// // // // //       )}
// // // // //     </DashboardLayout>
// // // // //   );
// // // // // }/





// // // // import React, { useState, useEffect } from 'react';
// // // // import DashboardLayout from './layouts/DashboardLayout';
// // // // import Home from './pages/Home';
// // // // import Overview from './pages/Overview';
// // // // import Departments from './pages/Departments';
// // // // import Teachers from './pages/Teachers';
// // // // import Students from './pages/Students';
// // // // import Reports from './pages/Reports';

// // // // // Persistence Helper
// // // // const getInitialData = (key, fallback) => {
// // // //   const saved = localStorage.getItem(key);
// // // //   return saved ? JSON.parse(saved) : fallback;
// // // // };

// // // // export default function App() {
// // // //   const [view, setView] = useState('home'); 
// // // //   const [role, setRole] = useState(null);
// // // //   const [page, setPage] = useState('overview');

// // // //   // --- 1. ALL LIVE STATES ---
// // // //   const [departments, setDepartments] = useState(() => getInitialData('depts', [
// // // //     { id: 1, name: 'Computer Science', code: 'CS-BCA', hod: 'Dr. Alan Turing', faculty: 45, students: 1200 },
// // // //     { id: 2, name: 'Mechanical Eng.', code: 'ME-204', hod: 'Dr. Smith', faculty: 30, students: 850 }
// // // //   ]));

// // // //   // FIX: Added batches state which was missing
// // // //   const [batches, setBatches] = useState(() => getInitialData('batches', [
// // // //     { id: 1, dept: 'BCA', batch: '2024', year: 'Year 1', status: 'CURRENT', hod: 'Dr. Alan Turing' }
// // // //   ]));

// // // //   const [approvedTeachers, setApprovedTeachers] = useState(() => getInitialData('teachers', [
// // // //     { id: 'T-101', name: 'Dr. Sarah Johnson', dept: 'Computer Science', email: 's.johnson@college.edu', initial: 'SJ' }
// // // //   ]));

// // // //   const [allStudents, setAllStudents] = useState(() => getInitialData('students', []));

// // // //   // --- 2. LIVE SYNC EFFECTS ---
// // // //   useEffect(() => { localStorage.setItem('depts', JSON.stringify(departments)); }, [departments]);
// // // //   useEffect(() => { localStorage.setItem('batches', JSON.stringify(batches)); }, [batches]);
// // // //   useEffect(() => { localStorage.setItem('teachers', JSON.stringify(approvedTeachers)); }, [approvedTeachers]);
// // // //   useEffect(() => { localStorage.setItem('students', JSON.stringify(allStudents)); }, [allStudents]);

// // // //   // --- 3. HANDLERS ---
// // // //   const onAddBatch = (b) => {
// // // //     setBatches([{ ...b, id: Date.now(), status: 'CURRENT' }, ...batches]);
// // // //   };

// // // //   const onAddStudent = (s) => {
// // // //     const initial = s.name ? s.name.charAt(0).toUpperCase() : '?';
// // // //     setAllStudents([{ ...s, id: `STU-${Date.now()}`, initial, status: 'Active' }, ...allStudents]);
// // // //   };

// // // //   if (view === 'home') return <Home onLogin={(r) => { setRole(r); setView('dashboard'); }} />;

// // // //   return (
// // // //     <DashboardLayout userRole={role} currentPage={page} setCurrentPage={setPage} onLogout={() => setView('home')}>
// // // //       {page === 'overview' && <Overview departments={departments} teachers={approvedTeachers} students={allStudents || []} />}
      
// // // //       {page === 'departments' && (
// // // //         <Departments 
// // // //           userRole={role} 
// // // //           departments={departments} 
// // // //           onAddDept={(d) => setDepartments([...departments, { ...d, id: Date.now() }])} 
// // // //           onDeleteDept={(id) => setDepartments(departments.filter(d => d.id !== id))}
// // // //         />
// // // //       )}
      
// // // //       {/* FIX: Passing batches and onAddBatch */}
// // // //       {page === 'students' && (
// // // //         <Students 
// // // //           userRole={role} 
// // // //           batches={batches || []} 
// // // //           allStudents={allStudents || []} 
// // // //           onAddBatch={onAddBatch}
// // // //           onAddStudent={onAddStudent} 
// // // //         />
// // // //       )}

// // // //       {page === 'teachers' && <Teachers userRole={role} teachers={approvedTeachers} />}
// // // //       {page === 'reports' && <Reports departments={departments} teachers={approvedTeachers} studentsCount={(allStudents || []).length} />}
// // // //     </DashboardLayout>
// // // //   );
// // // // }


// // // import React, { useState, useEffect } from 'react';
// // // import DashboardLayout from './layouts/DashboardLayout';
// // // import Home from './pages/Home';
// // // import Overview from './pages/Overview';
// // // import Departments from './pages/Departments';
// // // import Teachers from './pages/Teachers';
// // // import Students from './pages/Students';
// // // import Reports from './pages/Reports';

// // // const getInitialData = (key, fallback) => {
// // //   const saved = localStorage.getItem(key);
// // //   return saved ? JSON.parse(saved) : fallback;
// // // };

// // // export default function App() {
// // //   const [view, setView] = useState('home'); 
// // //   const [role, setRole] = useState(null);
// // //   const [page, setPage] = useState('overview');

// // //   const [departments, setDepartments] = useState(() => getInitialData('depts', [
// // //     { id: 1, name: 'Computer Science', code: 'CS-BCA', hod: 'Dr. Alan Turing', faculty: 45, students: 1200 },
// // //     { id: 2, name: 'Mechanical Eng.', code: 'ME-204', hod: 'Dr. Smith', faculty: 30, students: 850 }
// // //   ]));

// // //   const [batches, setBatches] = useState(() => getInitialData('batches', [
// // //     { id: 1, dept: 'BCA', batch: '2024', year: 'Year 1', status: 'CURRENT', hod: 'Dr. Alan Turing' }
// // //   ]));

// // //   const [approvedTeachers, setApprovedTeachers] = useState(() => getInitialData('teachers', [
// // //     { id: 'T-101', name: 'Dr. Sarah Johnson', dept: 'Computer Science', email: 's.johnson@college.edu', initial: 'SJ' }
// // //   ]));

// // //   // 1. ADD: State for pending requests
// // //   const [pendingRequests, setPendingRequests] = useState(() => getInitialData('pending_teachers', [
// // //     { id: 'P-001', name: 'Dr. Sarah Jenkins', dept: 'Computer Science', initial: 'SJ', dateApplied: 'Oct 12, 2023' },
// // //     { id: 'P-002', name: 'Prof. Michael Chen', dept: 'Mathematics', initial: 'MC', dateApplied: 'Oct 14, 2023' }
// // //   ]));

// // //   const [allStudents, setAllStudents] = useState(() => getInitialData('students', []));

// // //   // 2. ADD: Sync pending requests to local storage
// // //   useEffect(() => { localStorage.setItem('depts', JSON.stringify(departments)); }, [departments]);
// // //   useEffect(() => { localStorage.setItem('batches', JSON.stringify(batches)); }, [batches]);
// // //   useEffect(() => { localStorage.setItem('teachers', JSON.stringify(approvedTeachers)); }, [approvedTeachers]);
// // //   useEffect(() => { localStorage.setItem('pending_teachers', JSON.stringify(pendingRequests)); }, [pendingRequests]);
// // //   useEffect(() => { localStorage.setItem('students', JSON.stringify(allStudents)); }, [allStudents]);

// // //   // 3. ADD: Handlers for Teacher Registration and Approval
// // //   const handleTeacherRegister = (newTeacher) => {
// // //     const request = {
// // //       ...newTeacher,
// // //       id: `REQ-${Date.now()}`,
// // //       initial: newTeacher.name?.charAt(0) || 'T',
// // //       dateApplied: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
// // //     };
// // //     setPendingRequests([request, ...pendingRequests]);
// // //   };

// // //   const onApproveTeacher = (id) => {
// // //     const teacher = pendingRequests.find(t => t.id === id);
// // //     if (teacher) {
// // //       setApprovedTeachers([...approvedTeachers, { ...teacher, id: `T-${Date.now()}` }]);
// // //       setPendingRequests(pendingRequests.filter(t => t.id !== id));
// // //     }
// // //   };

// // //   // 4. Pass register handler to Home
// // //   if (view === 'home') return <Home onLogin={(r) => { setRole(r); setView('dashboard'); }} onRegister={handleTeacherRegister} />;

// // //   return (
// // //     <DashboardLayout userRole={role} currentPage={page} setCurrentPage={setPage} onLogout={() => setView('home')}>
// // //       {/* 5. Pass pending data and approve handler to Overview */}
// // //       {page === 'overview' && (
// // //         <Overview 
// // //           userRole={role} 
// // //           departments={departments} 
// // //           teachers={approvedTeachers} 
// // //           pendingTeachers={pendingRequests}
// // //           onApprove={onApproveTeacher}
// // //           students={allStudents || []} 
// // //         />
// // //       )}
      
// // //       {page === 'departments' && (
// // //         <Departments 
// // //           userRole={role} 
// // //           departments={departments} 
// // //           onAddDept={(d) => setDepartments([...departments, { ...d, id: Date.now() }])} 
// // //           onDeleteDept={(id) => setDepartments(departments.filter(d => d.id !== id))}
// // //         />
// // //       )}
      
// // //       {/* {page === 'students' && (
// // //         <Students 
// // //           userRole={role} 
// // //           batches={batches || []} 
// // //           allStudents={allStudents || []} 
// // //           onAddBatch={onAddBatch}
// // //           onAddStudent={onAddStudent} 
// // //         />
// // //       )} */}

// // //       {/* Students Directory */}
// // //     {page === 'students' && (
// // //          <Students 
// // //            userRole={role} 
// // //            allStudents={allStudents || []} 
// // //            onAddStudent={onAddStudent} 
// // //          />
// // //        )}

// // //       {page === 'teachers' && <Teachers userRole={role} teachers={approvedTeachers} />}
// // //       {page === 'reports' && <Reports departments={departments} teachers={approvedTeachers} studentsCount={(allStudents || []).length} />}
// // //     </DashboardLayout>
// // //   );
// // // }



// // import React, { useState, useEffect } from 'react';
// // import DashboardLayout from './layouts/DashboardLayout';
// // import Home from './pages/Home';
// // import Overview from './pages/Overview';
// // import Departments from './pages/Departments';
// // import Teachers from './pages/Teachers';
// // import Students from './pages/Students';
// // import Reports from './pages/Reports';

// // const getInitialData = (key, fallback) => {
// //   const saved = localStorage.getItem(key);
// //   return saved ? JSON.parse(saved) : fallback;
// // };

// // export default function App() {
// //   const [view, setView] = useState('home'); 
// //   const [role, setRole] = useState(null);
// //   const [page, setPage] = useState('overview');

// //   // --- 1. DATA STATES ---
// //   const [departments, setDepartments] = useState(() => getInitialData('depts', [
// //     { id: 1, name: 'Computer Science', code: 'CS-BCA', hod: 'Dr. Alan Turing', faculty: 45, students: 1200 },
// //     { id: 2, name: 'Mechanical Eng.', code: 'ME-204', hod: 'Dr. Smith', faculty: 30, students: 850 }
// //   ]));

// //   const [batches, setBatches] = useState(() => getInitialData('batches', [
// //     { id: 1, dept: 'BCA', batch: '2024', year: 'Year 1', status: 'CURRENT', hod: 'Dr. Alan Turing' }
// //   ]));

// //   const [approvedTeachers, setApprovedTeachers] = useState(() => getInitialData('teachers', [
// //     { id: 'T-101', name: 'Dr. Sarah Johnson', dept: 'Computer Science', email: 's.johnson@college.edu', initial: 'SJ' }
// //   ]));

// //   const [pendingRequests, setPendingRequests] = useState(() => getInitialData('pending_teachers', [
// //     { id: 'P-001', name: 'Dr. Sarah Jenkins', dept: 'Computer Science', initial: 'SJ', dateApplied: 'Oct 12, 2023' },
// //     { id: 'P-002', name: 'Prof. Michael Chen', dept: 'Mathematics', initial: 'MC', dateApplied: 'Oct 14, 2023' }
// //   ]));

// //   const [allStudents, setAllStudents] = useState(() => getInitialData('students', []));

// //   // --- 2. SYNC EFFECTS ---
// //   useEffect(() => { localStorage.setItem('depts', JSON.stringify(departments)); }, [departments]);
// //   useEffect(() => { localStorage.setItem('batches', JSON.stringify(batches)); }, [batches]);
// //   useEffect(() => { localStorage.setItem('teachers', JSON.stringify(approvedTeachers)); }, [approvedTeachers]);
// //   useEffect(() => { localStorage.setItem('pending_teachers', JSON.stringify(pendingRequests)); }, [pendingRequests]);
// //   useEffect(() => { localStorage.setItem('students', JSON.stringify(allStudents)); }, [allStudents]);

// //   // --- 3. HANDLERS (Defined here to fix your error) ---
// //   const handleTeacherRegister = (newTeacher) => {
// //     const request = {
// //       ...newTeacher,
// //       id: `REQ-${Date.now()}`,
// //       initial: newTeacher.name?.charAt(0) || 'T',
// //       dateApplied: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
// //     };
// //     setPendingRequests([request, ...pendingRequests]);
// //   };

// //   const onApproveTeacher = (id) => {
// //     const teacher = pendingRequests.find(t => t.id === id);
// //     if (teacher) {
// //       setApprovedTeachers([...approvedTeachers, { ...teacher, id: `T-${Date.now()}` }]);
// //       setPendingRequests(pendingRequests.filter(t => t.id !== id));
// //     }
// //   };

// //   // FIX: Defining missing onAddBatch
// //   const onAddBatch = (b) => {
// //     setBatches([{ ...b, id: Date.now(), status: 'CURRENT' }, ...batches]);
// //   };

// //   // FIX: Defining missing onAddStudent
// //   const onAddStudent = (s) => {
// //     const initial = s.name ? s.name.charAt(0).toUpperCase() : '?';
// //     setAllStudents([{ ...s, id: `STU-${Date.now()}`, initial, status: 'Active' }, ...allStudents]);
// //   };

// //   if (view === 'home') return <Home onLogin={(r) => { setRole(r); setView('dashboard'); }} onRegister={handleTeacherRegister} />;

// //   return (
// //     <DashboardLayout userRole={role} currentPage={page} setCurrentPage={setPage} onLogout={() => setView('home')}>
// //       {page === 'overview' && (
// //         <Overview 
// //           userRole={role} 
// //           departments={departments} 
// //           teachers={approvedTeachers} 
// //           pendingTeachers={pendingRequests}
// //           onApprove={onApproveTeacher}
// //           students={allStudents || []} 
// //         />
// //       )}
      
// //       {page === 'departments' && (
// //         <Departments 
// //           userRole={role} 
// //           departments={departments} 
// //           onAddDept={(d) => setDepartments([...departments, { ...d, id: Date.now() }])} 
// //           onDeleteDept={(id) => setDepartments(departments.filter(d => d.id !== id))}
// //         />
// //       )}
      
// //       {page === 'students' && (
// //         <Students 
// //           userRole={role} 
// //           batches={batches || []} 
// //           allStudents={allStudents || []} 
// //           onAddBatch={onAddBatch}
// //           onAddStudent={onAddStudent} 
// //         />
// //       )}

// //       {page === 'teachers' && <Teachers userRole={role} teachers={approvedTeachers} />}
// //       {page === 'reports' && <Reports departments={departments} teachers={approvedTeachers} studentsCount={(allStudents || []).length} />}
// //     </DashboardLayout>
// //   );
// // }











// import React, { useState, useEffect } from 'react';
// import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

// // Layout & UI Shell
// import DashboardLayout from './layouts/DashboardLayout';
// import StarField from './components/StarField';

// // Pages
// import Home from './pages/Home';
// import CollegeManagementSystem from './pages/CollegeManagementSystem';
// import AdminRegistration from './pages/AdminRegistration';
// import TeacherRegistration from './pages/TeacherRegistration';
// import Overview from './pages/Overview';
// import Departments from './pages/Departments';
// import Teachers from './pages/Teachers';
// import Students from './pages/Students';
// import Reports from './pages/Reports';

// // Data Persistence Helper
// const getInitialData = (key, fallback) => {
//   const saved = localStorage.getItem(key);
//   try {
//     return (saved && saved !== "null") ? JSON.parse(saved) : fallback;
//   } catch (e) {
//     return fallback;
//   }
// };

// export default function App() {
//   const navigate = useNavigate();

//   // --- 1. SESSION STATE ---
//   const [role, setRole] = useState(() => getInitialData('user_role', null));
//   const [page, setPage] = useState('overview');

//   // --- 2. DATA STATES ---
//   const [departments, setDepartments] = useState(() => getInitialData('depts', []));
//   const [pendingRequests, setPendingRequests] = useState(() => getInitialData('pending_teachers', []));
//   const [approvedTeachers, setApprovedTeachers] = useState(() => getInitialData('teachers', []));
  
//   // These are the two keys your Students.jsx requires
//   const [batches, setBatches] = useState(() => getInitialData('batches', []));
//   const [allStudents, setAllStudents] = useState(() => getInitialData('students', []));

//   // --- 3. PERSISTENCE SYNC ---
//   useEffect(() => {
//     localStorage.setItem('user_role', JSON.stringify(role));
//     localStorage.setItem('depts', JSON.stringify(departments));
//     localStorage.setItem('teachers', JSON.stringify(approvedTeachers));
//     localStorage.setItem('pending_teachers', JSON.stringify(pendingRequests));
//     localStorage.setItem('batches', JSON.stringify(batches));
//     localStorage.setItem('students', JSON.stringify(allStudents));
//   }, [role, departments, approvedTeachers, pendingRequests, batches, allStudents]);

//   // --- 4. HANDLERS ---
//   const handleAdminRegister = (adminName) => {
//     setRole('admin'); 
//     navigate('/'); 
//   };

//   const handleTeacherRegister = (teacherData) => {
//     const request = { ...teacherData, id: `REQ-${Date.now()}`, dateApplied: new Date().toLocaleDateString() };
//     setPendingRequests(prev => [...prev, request]);
//     alert("Request submitted successfully!");
//     navigate('/'); 
//   };

//   // --- STUDENT SYSTEM HANDLERS ---
//   const handleAddBatch = (newBatch) => {
//     setBatches(prev => [...prev, { ...newBatch, id: Date.now() }]);
//   };

//   const handleAddStudent = (newStudent) => {
//     // Note: newStudent should include batchId from the StudentListTable
//     setAllStudents(prev => [...prev, { ...newStudent, id: `STU-${Date.now()}` }]);
//   };

//   const logout = () => {
//     if (window.confirm("Logout from Academia CMS?")) {
//       setRole(null);
//       localStorage.removeItem('user_role');
//       navigate('/');
//     }
//   };

//   return (
//     <div className="App min-h-screen">
//       <StarField />
//       <Routes>
//         {!role ? (
//           <>
//             <Route path="/" element={<Home onLoginClick={() => navigate('/portal')} />} />
//             <Route path="/portal" element={<CollegeManagementSystem />} />
//             <Route path="/register/admin" element={<AdminRegistration onRegister={handleAdminRegister} />} />
//             <Route path="/register/teacher" element={<TeacherRegistration onRegister={handleTeacherRegister} />} />
//             <Route path="*" element={<Navigate to="/" />} />
//           </>
//         ) : (
//           <Route path="/*" element={
//             <DashboardLayout userRole={role} currentPage={page} setCurrentPage={setPage} onLogout={logout}>
//               {page === 'overview' && (
//                 <Overview 
//                   userRole={role} 
//                   pendingTeachers={pendingRequests || []} 
//                   onApprove={(id) => {
//                     const t = pendingRequests.find(x => x.id === id);
//                     if(t) {
//                       setApprovedTeachers(prev => [...prev, { ...t, status: 'Active' }]);
//                       setPendingRequests(prev => prev.filter(x => x.id !== id));
//                     }
//                   }} 
//                 />
//               )}

//               {page === 'departments' && (
//                 <Departments 
//                   departments={departments || []} 
//                   onAddDept={(d) => setDepartments(prev => [...prev, { ...d, id: Date.now() }])} 
//                 />
//               )}

//               {page === 'teachers' && <Teachers teachers={approvedTeachers || []} />}

//               {page === 'students' && (
//                 <Students 
//                   userRole={role}
//                   batches={batches || []} 
//                   allStudents={allStudents || []} 
//                   onAddBatch={handleAddBatch}
//                   onAddStudent={handleAddStudent} 
//                 />
//               )}

//               {page === 'reports' && <Reports />}
//             </DashboardLayout>
//           } />
//         )}
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

  // --- 2. INSTITUTIONAL DATA ---
  const [departments, setDepartments] = useState(() => getInitialData('depts', []));
  const [pendingRequests, setPendingRequests] = useState(() => getInitialData('pending_teachers', []));
  const [approvedTeachers, setApprovedTeachers] = useState(() => getInitialData('teachers', []));
  const [batches, setBatches] = useState(() => getInitialData('batches', []));
  const [allStudents, setAllStudents] = useState(() => getInitialData('students', []));

  // --- 3. PERSISTENCE SYNC ---
  useEffect(() => {
    localStorage.setItem('user_role', JSON.stringify(role));
    localStorage.setItem('current_user', JSON.stringify(currentUser));
    localStorage.setItem('depts', JSON.stringify(departments));
    localStorage.setItem('teachers', JSON.stringify(approvedTeachers));
    localStorage.setItem('pending_teachers', JSON.stringify(pendingRequests));
    localStorage.setItem('batches', JSON.stringify(batches));
    localStorage.setItem('students', JSON.stringify(allStudents));
  }, [role, currentUser, departments, approvedTeachers, pendingRequests, batches, allStudents]);

  // --- 4. FLOW HANDLERS ---

  // Handle successful login (Admin or Teacher)
  const handleLoginSuccess = (userRole, userData) => {
    setRole(userRole);
    setCurrentUser(userData);
    navigate('/'); 
  };

  // Handle new teacher registration (Goes to pending)
  const handleTeacherRegister = (teacherData) => {
    const request = { 
      ...teacherData, 
      id: `REQ-${Date.now()}`, 
      dateApplied: new Date().toLocaleDateString(),
      status: 'Pending'
    };
    setPendingRequests(prev => [...prev, request]);
    alert("Application submitted! Access will be granted once the Admin approves your profile.");
    navigate('/'); 
  };

  const handleLogout = () => {
    setRole(null);
    setCurrentUser(null);
    localStorage.removeItem('user_role');
    localStorage.removeItem('current_user');
    navigate('/');
  };

  return (
    <div className="App min-h-screen bg-slate-50">
      <StarField />
      
      <Routes>
        {/* PHASE 1: PUBLIC GATEWAY (Role is null) */}
        {!role ? (
          <>
            <Route 
              path="/" 
              element={<Home onLoginClick={() => navigate('/portal')} onSignInClick={() => navigate('/login')} />} 
            />
            <Route path="/portal" element={<CollegeManagementSystem />} />
            <Route 
              path="/login" 
              element={<Login onLogin={handleLoginSuccess} approvedTeachers={approvedTeachers} />} 
            />
            <Route 
              path="/register/admin" 
              element={<AdminRegistration onRegister={(name) => handleLoginSuccess('admin', { name, email: 'admin@college.edu' })} />} 
            />
            <Route 
              path="/register/teacher" 
              element={<TeacherRegistration onRegister={handleTeacherRegister} />} 
            />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        ) : (
          /* PHASE 2: PROTECTED DASHBOARD (Role is set) */
          <Route path="/*" element={
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
                  pendingTeachers={pendingRequests} 
                  onApprove={(id) => {
                    const t = pendingRequests.find(x => x.id === id);
                    if(t) {
                      setApprovedTeachers(prev => [...prev, { ...t, status: 'Active' }]);
                      setPendingRequests(prev => prev.filter(x => x.id !== id));
                    }
                  }} 
                  teachersCount={approvedTeachers.length}
                  studentsCount={allStudents.length}
                />
              )}

              {page === 'departments' && (
                <Departments 
                  userRole={role}
                  departments={departments} 
                  onAddDept={(d) => setDepartments(prev => [...prev, { ...d, id: Date.now() }])} 
                />
              )}

              {page === 'teachers' && <Teachers teachers={approvedTeachers} />}

              {page === 'students' && (
                <Students 
                  userRole={role}
                  batches={batches} 
                  allStudents={allStudents} 
                  onAddBatch={(b) => setBatches(prev => [...prev, { ...b, id: Date.now() }])}
                  onAddStudent={(s) => setAllStudents(prev => [...prev, { ...s, id: Date.now() }])} 
                />
              )}

              {page === 'reports' && <Reports />}
            </DashboardLayout>
          } />
        )}
      </Routes>
    </div>
  );
}