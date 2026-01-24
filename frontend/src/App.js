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

/* CHARTS & ANALYTICS TOOLS */
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie, Legend 
} from 'recharts';
import { ArrowUp, ChevronDown } from 'lucide-react';

// --- ANALYTICS DATA (Mock for Reports) ---
const gpaData = [
  { name: 'Fall 2022', gpa: 3.4 }, { name: 'Spring 2023', gpa: 3.5 },
  { name: 'Summer 2023', gpa: 3.58 }, { name: 'Fall 2023', gpa: 3.65 },
  { name: 'Spring 2024', gpa: 3.70 }, { name: 'Fall 2024', gpa: 3.72 },
];
const gradeData = [
  { grade: 'A', count: 18 }, { grade: 'B', count: 15 }, { grade: 'C', count: 8 },
  { grade: 'D', count: 3 }, { grade: 'F', count: 1 },
];
const creditData = [
  { name: 'Major Requirements', value: 28, color: '#1A1A5E' },
  { name: 'General Education', value: 24, color: '#4F46E5' },
  { name: 'Electives', value: 18, color: '#818CF8' },
  { name: 'Minor Requirements', value: 12, color: '#93C5FD' },
  { name: 'Free Electives', value: 4, color: '#BFDBFE' },
];
const standingData = [
  { semester: 'Fall 2022', standing: 1 }, { semester: 'Spring 2023', standing: 1 },
  { semester: 'Summer 2023', standing: 1 }, { semester: 'Fall 2023', standing: 1 },
  { semester: 'Spring 2024', standing: 1 }, { semester: 'Fall 2024', standing: 1 },
];

// --- ANALYTICS SUB-COMPONENTS ---
const StatCard = ({ title, value, prevValue, trend }) => (
  <div className="bg-white p-4 rounded-sm border border-gray-100 shadow-sm">
    <h3 className="text-[#1A1A5E] text-xs font-semibold mb-2 uppercase tracking-wider">{title}</h3>
    <div className="flex items-center gap-2">
      <span className="text-3xl font-bold text-slate-800">{value}</span>
      <ArrowUp className="text-green-500 w-5 h-5" />
    </div>
    <p className="text-gray-400 text-[10px] mt-1">
      vs last period {prevValue} <span className="text-green-600 font-medium">({trend})</span>
    </p>
  </div>
);

const FulfillmentGauge = ({ title, percent }) => {
  const radius = 60;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percent / 100) * (circumference / 2);
  const rotation = (percent / 100) * 180 - 90;

  return (
    <div className="bg-white p-4 rounded-sm border border-gray-100 flex flex-col items-center shadow-sm">
      <h3 className="text-[#1A1A5E] font-bold text-xs mb-4 self-start">{title}</h3>
      <div className="relative flex items-center justify-center h-32 w-full">
        <svg height={radius * 2} width={radius * 2} className="transform -rotate-180">
          <circle stroke="#E5E7EB" fill="transparent" strokeWidth={stroke} strokeDasharray={`${circumference / 2} ${circumference}`} r={normalizedRadius} cx={radius} cy={radius} />
          <circle stroke="#4F46E5" fill="transparent" strokeWidth={stroke} strokeDasharray={`${circumference / 2} ${circumference}`} style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.5s ease' }} r={normalizedRadius} cx={radius} cy={radius} />
        </svg>
        <div className="absolute bottom-12 w-1 h-14 bg-gray-700 origin-bottom transition-transform duration-500" style={{ transform: `rotate(${rotation}deg)` }}>
          <div className="absolute top-0 -left-1 w-3 h-3 bg-gray-700 rounded-full" />
        </div>
        <div className="absolute bottom-6 flex justify-between w-32 text-[9px] text-gray-400">
          <span>0%</span><span>100%</span>
        </div>
        <div className="absolute bottom-0 text-center">
          <span className="text-xl font-bold">{percent}%</span>
        </div>
      </div>
    </div>
  );
};

// --- MAIN REPORT COMPONENT (REPORT 1) ---
const Report1 = () => (
  <div className="p-2 space-y-8 bg-gray-50 rounded-lg">
    {/* KPI Section */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <StatCard title="Cumulative GPA" value="3.72" prevValue="3.58" trend="+3.9%" />
      <StatCard title="Current GPA" value="3.85" prevValue="3.72" trend="+3.5%" />
      <StatCard title="Total Credits" value="86" prevValue="76" trend="+13%" />
      <StatCard title="Completion %" value="72%" prevValue="64%" trend="+8%" />
    </div>

    {/* Progression and Grades */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-sm border border-gray-100 shadow-sm">
        <h3 className="text-[#1A1A5E] font-bold mb-6 text-sm uppercase">GPA Progression</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={gpaData}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis domain={[3, 4]} fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip />
              <Line type="monotone" dataKey="gpa" stroke="#3B3B98" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="bg-white p-6 rounded-sm border border-gray-100 shadow-sm">
        <h3 className="text-[#1A1A5E] font-bold mb-6 text-sm uppercase">Grade Distribution</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={gradeData}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="grade" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#4F46E5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>

    {/* Credits & History */}
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 lg:col-span-4 bg-white p-6 rounded-sm border border-gray-100 shadow-sm">
        <h3 className="text-[#1A1A5E] font-bold mb-4 text-sm uppercase">Credits by Category</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={creditData} innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value">
                {creditData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: '9px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="col-span-12 lg:col-span-8 bg-white p-6 rounded-sm border border-gray-100 shadow-sm">
        <h3 className="text-[#1A1A5E] font-bold mb-4 text-sm uppercase">Academic Standing History</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={standingData}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="semester" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis hide />
              <Tooltip />
              <Bar dataKey="standing" fill="#1A1A5E" barSize={30} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>

    {/* Gauges */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <FulfillmentGauge title="Degree Fulfillment" percent={72} />
      <FulfillmentGauge title="Prerequisites" percent={88} />
      <FulfillmentGauge title="Electives" percent={65} />
    </div>
  </div>
);

// --- AXIOS CONFIG ---
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
      console.error("Master Sync failed."); 
    }
  }, []);

  useEffect(() => {
    if (role) syncData();
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
                if (res.data.success) { alert("Successful!"); syncData(); navigate('/login'); }
              } catch (err) { alert("Failed."); }
            }} />
          </>
        } />

        <Route path="/dashboard/*" element={
          role ? (
            <DashboardLayout userRole={role} currentUser={currentUser} currentPage={page} setCurrentPage={setPage} onLogout={handleLogout}>
              {page === 'overview' && (
                <Overview departments={departments} teachersCount={approvedTeachers.length} studentsCount={allStudents.length} pendingTeachers={pendingRequests} />
              )}
              {page === 'departments' && (
                <Departments userRole={role} departments={departments} onAddDept={async (d) => { await API.post('/departments', d); syncData(); }} onDeleteDept={async (id) => { await API.delete(`/departments/${id}`); syncData(); }} />
              )}
              {page === 'teachers' && (
                <Teachers userRole={role} teachers={approvedTeachers} onRefresh={syncData} />
              )}
              {page === 'students' && (
                <Students userRole={role} batches={batches} allStudents={allStudents} onAddStudent={async (s) => { await API.post('/students', s); syncData(); }} onAddBatch={async (b) => { await API.post('/batches', b); syncData(); }} />
              )}
              {page === 'subjects' && (
                <SubjectsManagement data={{ subjects, courses: departments, users: approvedTeachers, teacherAssignments }} updateData={async () => { await syncData(); }} />
              )}
              {page === 'reports' && <Report1 />}
            </DashboardLayout>
          ) : <Navigate to="/login" />
        } />
      </Routes>
    </div>
  );
}