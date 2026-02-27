import React from 'react';
import { 
  Plus, Building2, Users, GraduationCap, BookOpen, ShieldCheck, 
  ChevronLeft, ChevronRight, Activity, Bell, Mail, Clock
} from 'lucide-react';
import StatCard from '../components/StatCard';

/**
 * Overview Component
 * @param {string} userRole - 'admin' or 'teacher'
 * @param {Array} departments - List of all departments
 * @param {Array} teachers - List of approved teachers
 * @param {Array} pendingTeachers - List of teachers awaiting approval
 * @param {Array} allStudents - List of all students
 * @param {Array} subjects - List of all curriculum subjects
 * @param {Function} onApprove - Function to approve a pending teacher
 */
export default function Overview({ 
  userRole, 
  departments = [], 
  teachers = [], 
  pendingTeachers = [], 
  allStudents = [], 
  subjects = [], 
  onApprove 
}) {
  const isAdmin = userRole === 'admin';

  return (
    <div className="animate-in fade-in duration-500 max-w-full font-sans p-2">
      
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-[2rem] font-black text-[#0f172a] leading-tight tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-slate-500 text-sm font-medium tracking-tight">
            Welcome back, <span className="text-blue-600 font-bold">{isAdmin ? 'Administrator' : 'Faculty Member'}</span>. Here is the institutional snapshot.
          </p>
        </div>
        <div className="flex gap-3">
           <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
            <Bell size={14} /> Notifications
          </button>
          <button className="flex items-center gap-2 bg-[#136dec] text-white px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95">
            <Plus size={16} /> Generate Report
          </button>
        </div>
      </div>

      {/* 2. LIVE KPI STATS (Numbers fetched directly from array lengths) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard 
          icon={<Building2/>} 
          label="Total Departments" 
          value={departments.length} 
          trend={`${departments.length > 0 ? '+Active' : 'Offline'}`} 
          color="text-blue-600" 
        />
        <StatCard 
          icon={<Users/>} 
          label="Approved Teachers" 
          value={teachers.length} 
          trend="Live Faculty" 
          color="text-indigo-600" 
        />
        <StatCard 
          icon={<GraduationCap/>} 
          label="Total Students" 
          value={allStudents.length} 
          trend="+Live Records" 
          color="text-emerald-500" 
        />
        <StatCard 
          icon={<BookOpen/>} 
          label="Total Subjects" 
          value={subjects.length} 
          trend="Current Curriculum" 
          color="text-amber-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: PRIMARY DATA */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Pending Teacher Requests Table */}
          <div className="bg-white rounded-[24px] border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-6 border-b flex justify-between items-center bg-white">
              <h4 className="font-black text-slate-900 text-[11px] uppercase tracking-[0.2em]">
                Pending Teacher Requests
              </h4>
              <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[9px] font-black uppercase">
                {pendingTeachers.length} New Application{pendingTeachers.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 text-slate-400 uppercase text-[9px] font-black tracking-[0.2em]">
                  <tr>
                    <th className="px-6 py-4">Teacher Name</th>
                    <th className="px-6 py-4">Department</th>
                    <th className="px-6 py-4">Date Applied</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pendingTeachers.length > 0 ? (
                    pendingTeachers.map((t) => (
                      <tr key={t.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-6 py-4 flex items-center gap-3">
                          <div className="size-9 bg-blue-50 rounded-full flex items-center justify-center text-[11px] font-black text-blue-600 border border-blue-100 shadow-sm uppercase">
                            {t.initial || t.name?.charAt(0) || 'T'}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-black text-slate-700 text-sm tracking-tight uppercase">
                              {t.name}
                            </span>
                            <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                              <Clock size={10} /> Needs Review
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-slate-500 font-black text-[10px] uppercase bg-slate-100 px-2.5 py-1 rounded-lg">
                             {t.deptName || t.dept || 'General'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-400 text-[10px] font-bold uppercase tracking-tight">
                          {t.dateApplied ? new Date(t.dateApplied).toLocaleDateString('en-US', { 
                            month: 'short', day: 'numeric', year: 'numeric' 
                          }) : 'Recent'}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {isAdmin && (
                            <div className="flex justify-end gap-2">
                              <button 
                                onClick={() => onApprove(t.id)} 
                                className="bg-[#136dec] text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-100 transition active:scale-95"
                              >
                                Approve
                              </button>
                              <button className="text-slate-300 font-black text-[9px] uppercase tracking-widest hover:text-red-500 transition px-2">
                                Reject
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-20 text-center">
                         <div className="flex flex-col items-center opacity-20">
                            <ShieldCheck size={40} className="mb-2" />
                            <p className="italic text-xs font-black uppercase tracking-widest text-slate-600">No pending verification tasks</p>
                         </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Institutional Performance Metrics */}
          {/* <div className="bg-white p-8 rounded-[24px] border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h4 className="font-black text-[11px] text-slate-900 uppercase tracking-[0.2em]">
                Departmental Coverage & Health
              </h4>
              <Activity className="text-[#136dec]" size={18} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              <ProgressBar label="System Department Sync" val={`${Math.min(departments.length * 12.5, 100)}%`} width={`${Math.min(departments.length * 12.5, 100)}%`} />
              <ProgressBar label="Faculty-Student Ratio" val={`${Math.min((teachers.length / (allStudents.length || 1)) * 1000, 100).toFixed(0)}%`} width={`${Math.min((teachers.length / (allStudents.length || 1)) * 1000, 100).toFixed(0)}%`} />
            </div>
          </div> */}
        </div>


        {/* RIGHT COLUMN: WIDGETS */}
        <div className="space-y-8">
          
          {/* Academic Calendar */}
          <div className="bg-white rounded-[24px] border border-slate-200 p-7 shadow-sm">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Academic Calendar</h4>
            <div className="flex justify-between mb-8 items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
              <ChevronLeft size={16} className="cursor-pointer text-slate-400 hover:text-[#136dec]" />
              <span className="text-xs font-black text-slate-900 tracking-tight">February 2026</span>
              <ChevronRight size={16} className="cursor-pointer text-slate-400 hover:text-[#136dec]" />
            </div>
            <div className="space-y-5">
               <CalendarItem day="24" month="FEB" title="Internal Assessment" sub="All Departments" active />
               <CalendarItem day="28" month="FEB" title="Staff General Meeting" sub="Conference Room A" />
               <CalendarItem day="02" month="MAR" title="Semester Project Sync" sub="Labs 1-4" />
            </div>
            <button className="w-full mt-8 py-3.5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border border-slate-100 rounded-xl hover:bg-slate-50 hover:text-[#136dec] transition-all">Full Schedule</button>
          </div>

          {/* System Health Widget */}
          {/* <div className="bg-gradient-to-br from-[#136dec] to-blue-700 p-8 rounded-[24px] text-white shadow-2xl shadow-blue-200 relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 size-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-all duration-700"></div>
              <h5 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70 mb-2">Cloud Gateway Status</h5>
              <div className="flex justify-between items-end mb-4">
                 <span className="text-5xl font-black tracking-tighter">99.8%</span>
                 <span className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Active Server</span>
              </div>
              <div className="w-full bg-white/20 h-2.5 rounded-full mb-8 overflow-hidden shadow-inner">
                 <div className="bg-white h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_white]" style={{width: '99.8%'}}></div>
              </div>
              <button className="w-full py-4 bg-white text-[#136dec] rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-50 transition-all shadow-lg font-black">System Diagnostics</button>
          </div> */}
        </div>
      </div>
    </div>
  );
}

// --- HELPER COMPONENTS ---

const ProgressBar = ({ label, val, width }) => (
  <div>
    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-3">
      <span className="text-slate-500">{label}</span>
      <span className="text-[#136dec]">{val}</span>
    </div>
    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
      <div className="bg-[#136dec] h-full rounded-full shadow-[0_0_12px_rgba(19,109,236,0.3)] transition-all duration-1000" style={{ width }}></div>
    </div>
  </div>
);

const CalendarItem = ({ day, month, title, sub, active }) => (
  <div className={`flex gap-5 p-4 rounded-2xl border transition-all ${active ? 'bg-[#136dec]/5 border-[#136dec]/10' : 'border-transparent hover:bg-slate-50'}`}>
    <div className={`size-12 flex flex-col items-center justify-center rounded-xl shadow-sm ${active ? 'bg-[#136dec] text-white' : 'bg-white border border-slate-100 text-slate-600'}`}>
      <span className="text-[8px] font-black uppercase tracking-tighter leading-none mb-1">{month}</span>
      <span className="text-xl font-black leading-none">{day}</span>
    </div>
    <div className="flex flex-col justify-center">
      <p className="text-sm font-black text-slate-900 leading-tight mb-0.5 tracking-tight">{title}</p>
      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{sub}</p>
    </div>
  </div>
);