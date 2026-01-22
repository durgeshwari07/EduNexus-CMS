// import React from 'react';
// import { 
//   Plus, Building2, Users, GraduationCap, BookOpen, 
//   ChevronLeft, ChevronRight, Activity, Bell 
// } from 'lucide-react';
// import StatCard from '../components/StatCard';

// export default function Overview({ userRole, departments = [], teachers = [], pendingTeachers = [], onApprove }) {
//   const isAdmin = userRole === 'admin';

//   return (
//     // font-sans applies Inter globally if configured in tailwind.config
//     <div className="animate-in fade-in duration-500 max-w-full font-sans">
      
//       {/* 1. HEADER SECTION */}
//       <div className="flex items-center justify-between mb-8">
//         <div>
//           <h2 className="text-3xl font-black text-slate-900 tracking-tight">
//             Dashboard Overview
//           </h2>
//           <p className="text-slate-500 text-sm font-medium tracking-tight">
//             Welcome back, Admin. Here is what's happening today.
//           </p>
//         </div>
//         <div className="flex gap-3">
//            <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
//             <Bell size={14} /> Notifications
//           </button>
//           <button className="flex items-center gap-2 bg-[#136dec] text-white px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-[#136dec]/20 hover:bg-blue-700 transition-all active:scale-95">
//             <Plus size={16} /> Generate Report
//           </button>
//         </div>
//       </div>

//       {/* 2. KPI STATS */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         <StatCard icon={<Building2/>} label="Total Departments" value={departments.length || "8"} trend="+2 New" color="text-emerald-500" />
//         <StatCard icon={<Users/>} label="Teachers" value={teachers.length || "45"} trend="Active" color="text-slate-400" />
//         <StatCard icon={<GraduationCap/>} label="Students" value="1,200" trend="+12%" color="text-emerald-500" />
//         <StatCard icon={<BookOpen/>} label="Subjects" value="32" trend="Semester 1" color="text-slate-400" />
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
//         {/* LEFT COLUMN: PRIMARY DATA */}
//         <div className="lg:col-span-2 space-y-8">
          
//           {/* Pending Teacher Requests */}
//           <div className="bg-white rounded-[24px] border border-slate-200 overflow-hidden shadow-sm">
//             <div className="p-6 border-b flex justify-between items-center bg-white">
//               <h4 className="font-black text-slate-900 text-[11px] uppercase tracking-[0.2em]">
//                 Pending Teacher Requests
//               </h4>
//               <button className="text-[11px] font-black uppercase tracking-widest text-[#136dec] hover:underline">
//                 View All
//               </button>
//             </div>
//             <div className="overflow-x-auto">
//               <table className="w-full text-left">
//                 <thead className="bg-slate-50/50 text-slate-400 uppercase text-[9px] font-black tracking-[0.2em]">
//                   <tr>
//                     <th className="px-6 py-4">Teacher Name</th>
//                     <th className="px-6 py-4">Department</th>
//                     <th className="px-6 py-4">Date Applied</th>
//                     <th className="px-6 py-4 text-right">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-slate-100">
//                   {pendingTeachers.length > 0 ? (
//                     pendingTeachers.map((t) => (
//                       <tr key={t.id} className="hover:bg-slate-50 transition-colors group">
//                         <td className="px-6 py-4 flex items-center gap-3">
//                           <div className="size-9 bg-slate-100 rounded-full flex items-center justify-center text-[11px] font-black text-slate-600 border border-slate-200 shadow-sm">
//                             {t.initial || 'SJ'}
//                           </div>
//                           <span className="font-bold text-slate-700 text-sm tracking-tight">{t.name}</span>
//                         </td>
//                         <td className="px-6 py-4 text-slate-500 font-bold text-xs">{t.dept}</td>
//                         <td className="px-6 py-4 text-slate-400 text-[10px] font-bold uppercase tracking-tight">Oct 12, 2023</td>
//                         <td className="px-6 py-4 text-right">
//                           {isAdmin && (
//                             <div className="flex justify-end gap-2">
//                               <button onClick={() => onApprove(t.id)} className="bg-[#136dec] text-white px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-blue-700 shadow-md shadow-blue-100 transition">Approve</button>
//                               <button className="text-slate-400 font-black text-[9px] uppercase tracking-widest hover:text-red-500 transition">Reject</button>
//                             </div>
//                           )}
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan="4" className="px-6 py-10 text-center text-slate-400 italic text-sm font-medium">
//                         No pending requests at the moment.
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {/* PERFORMANCE TRENDS */}
//           <div className="bg-white p-8 rounded-[24px] border border-slate-200 shadow-sm">
//             <div className="flex justify-between items-center mb-8">
//               <h4 className="font-black text-[11px] text-slate-900 uppercase tracking-[0.2em]">
//                 Top Performing Departments
//               </h4>
//               <Activity className="text-[#136dec]" size={18} />
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
//               <ProgressBar label="Computer Science" val="94%" width="94%" />
//               <ProgressBar label="Mathematics" val="88%" width="88%" />
//               <ProgressBar label="Physics" val="82%" width="82%" />
//               <ProgressBar label="Biotechnology" val="79%" width="79%" />
//             </div>
//           </div>
//         </div>


//         {/* RIGHT COLUMN: WIDGETS */}
//         <div className="space-y-8">
          
//           {/* Calendar Widget */}
//           <div className="bg-white rounded-[24px] border border-slate-200 p-7 shadow-sm">
//             <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Academic Calendar</h4>
//             <div className="flex justify-between mb-8 items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
//               <ChevronLeft size={16} className="cursor-pointer text-slate-400 hover:text-[#136dec]" />
//               <span className="text-xs font-black text-slate-900 tracking-tight">October 2023</span>
//               <ChevronRight size={16} className="cursor-pointer text-slate-400 hover:text-[#136dec]" />
//             </div>
//             <div className="space-y-5">
//                <CalendarItem day="24" month="OCT" title="Midterm Exams" sub="All Departments" active />
//                <CalendarItem day="28" month="OCT" title="Staff Meeting" sub="Main Conference Hall" />
//                <CalendarItem day="02" month="NOV" title="Cultural Fest" sub="Campus Grounds" />
//             </div>
//             <button className="w-full mt-8 py-3.5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border border-slate-100 rounded-xl hover:bg-slate-50 hover:text-[#136dec] transition-all">Full Schedule</button>
//           </div>

//           {/* STORAGE WIDGET */}
//           <div className="bg-gradient-to-br from-[#136dec] to-blue-700 p-8 rounded-[24px] text-white shadow-2xl shadow-blue-200 relative overflow-hidden group">
//               <div className="absolute -right-4 -top-4 size-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-all duration-700"></div>
//               <h5 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70 mb-2">Cloud Storage Status</h5>
//               <div className="flex justify-between items-end mb-4">
//                  <span className="text-5xl font-black tracking-tighter">78%</span>
//                  <span className="text-[10px] font-bold opacity-60 uppercase tracking-widest">390 GB / 500 GB</span>
//               </div>
//               <div className="w-full bg-white/20 h-2.5 rounded-full mb-8 overflow-hidden shadow-inner">
//                  <div className="bg-white h-full rounded-full transition-all duration-1000" style={{width: '78%'}}></div>
//               </div>
//               <button className="w-full py-4 bg-white text-[#136dec] rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-50 transition-all shadow-lg">Upgrade Storage</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // --- HELPER COMPONENTS ---

// const ProgressBar = ({ label, val, width }) => (
//   <div>
//     <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-3">
//       <span className="text-slate-500">{label}</span>
//       <span className="text-[#136dec]">{val}</span>
//     </div>
//     <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
//       <div className="bg-[#136dec] h-full rounded-full shadow-[0_0_12px_rgba(19,109,236,0.3)] transition-all duration-1000" style={{ width }}></div>
//     </div>
//   </div>
// );

// const CalendarItem = ({ day, month, title, sub, active }) => (
//   <div className={`flex gap-5 p-4 rounded-2xl border transition-all ${active ? 'bg-[#136dec]/5 border-[#136dec]/10' : 'border-transparent hover:bg-slate-50'}`}>
//     <div className={`size-12 flex flex-col items-center justify-center rounded-xl shadow-sm ${active ? 'bg-[#136dec] text-white' : 'bg-white border border-slate-100 text-slate-600'}`}>
//       <span className="text-[8px] font-black uppercase tracking-tighter leading-none mb-1">{month}</span>
//       <span className="text-xl font-black leading-none">{day}</span>
//     </div>
//     <div className="flex flex-col justify-center">
//       <p className="text-sm font-black text-slate-900 leading-tight mb-0.5 tracking-tight">{title}</p>
//       <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{sub}</p>
//     </div>
//   </div>
// );










import React from 'react';
import { 
  Plus, Building2, Users, GraduationCap, BookOpen, 
  ChevronLeft, ChevronRight, Activity, Bell 
} from 'lucide-react';
import StatCard from '../components/StatCard';

export default function Overview({ 
  userRole, 
  departments = [], 
  teachers = [], 
  pendingTeachers = [], // Prop received from App.js
  studentsCount = "1,200", 
  onApprove 
}) {
  const isAdmin = userRole === 'admin';

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-full font-sans">
      
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
            Dashboard Overview
          </h2>
          <p className="text-slate-500 text-sm font-medium tracking-tight mt-1">
            {isAdmin 
              ? "Institutional oversight and administrative controls." 
              : "Faculty insights and departmental performance panel."}
          </p>
        </div>
        <div className="flex gap-3">
           <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
            <Bell size={14} className="text-[#136dec]" /> Notifications
          </button>
          <button className="flex items-center gap-2 bg-[#136dec] text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#136dec]/20 hover:bg-blue-700 transition-all active:scale-95">
            <Plus size={16} /> Generate Report
          </button>
        </div>
      </div>

      {/* 2. KPI STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard 
          icon={<Building2 className="text-blue-600" />} 
          label="Total Departments" 
          value={departments.length.toString()} 
          trend="+1 New" 
          color="text-emerald-500" 
        />
        <StatCard 
          icon={<Users className="text-purple-600" />} 
          label="Active Teachers" 
          value={teachers.length.toString()} 
          trend="Verified" 
          color="text-slate-400" 
        />
        <StatCard 
          icon={<GraduationCap className="text-orange-600" />} 
          label="Total Students" 
          value={studentsCount} 
          trend="+12% Growth" 
          color="text-emerald-500" 
        />
        <StatCard 
          icon={<BookOpen className="text-emerald-600" />} 
          label="Courses/Subjects" 
          value="32" 
          trend="Semester 1" 
          color="text-slate-400" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: PRIMARY DATA */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Pending Teacher Requests - Uses pendingTeachers Prop */}
          <div className="bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-7 border-b flex justify-between items-center bg-white">
              <div className="flex items-center gap-3">
                <div className={`size-2 rounded-full animate-pulse ${pendingTeachers.length > 0 ? 'bg-orange-500' : 'bg-slate-300'}`}></div>
                <h4 className="font-black text-slate-900 text-[11px] uppercase tracking-[0.2em]">
                  Pending Approvals ({pendingTeachers.length})
                </h4>
              </div>
              <button className="text-[10px] font-black uppercase tracking-widest text-[#136dec] hover:text-blue-800 transition-colors">
                Queue Settings
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 text-slate-400 uppercase text-[9px] font-black tracking-[0.2em]">
                  <tr>
                    <th className="px-8 py-5">Faculty Member</th>
                    <th className="px-8 py-5">Dept</th>
                    <th className="px-8 py-5">Request Date</th>
                    <th className="px-8 py-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pendingTeachers.length > 0 ? (
                    pendingTeachers.map((t) => (
                      <tr key={t.id} className="hover:bg-slate-50/80 transition-colors group">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className="size-10 bg-slate-100 rounded-xl flex items-center justify-center text-[12px] font-black text-slate-600 border border-slate-200 shadow-sm group-hover:bg-white transition-colors">
                              {t.teacherName?.charAt(0) || t.name?.charAt(0) || 'T'}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-black text-slate-800 text-sm tracking-tight">{t.teacherName || t.name}</span>
                              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{t.employeeId || 'System User'}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5 text-slate-500 font-bold text-xs">{t.dept}</td>
                        <td className="px-8 py-5 text-slate-400 text-[10px] font-bold uppercase tracking-tight">
                          {t.dateApplied || 'Jan 21, 2026'}
                        </td>
                        <td className="px-8 py-5 text-right">
                          {isAdmin ? (
                            <div className="flex justify-end gap-3">
                              <button 
                                onClick={() => onApprove(t.id)} 
                                className="bg-[#136dec] text-white px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-95"
                              >
                                Approve
                              </button>
                              <button className="text-slate-400 font-black text-[9px] uppercase tracking-widest hover:text-red-500 transition-colors">
                                Decline
                              </button>
                            </div>
                          ) : (
                            <span className="text-[9px] font-black uppercase text-slate-300 tracking-widest">Locked</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-8 py-16 text-center">
                        <div className="flex flex-col items-center opacity-40">
                          <Activity size={32} className="mb-3 text-slate-300" />
                          <p className="italic text-sm font-medium text-slate-400">All faculty requests are processed.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* PERFORMANCE TRENDS */}
          <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-10">
              <h4 className="font-black text-[11px] text-slate-900 uppercase tracking-[0.2em]">
                Departmental Performance Index
              </h4>
              <Activity className="text-[#136dec] animate-pulse" size={18} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              <ProgressBar label="Computer Science" val="94%" width="94%" color="bg-blue-500" />
              <ProgressBar label="Mathematics" val="88%" width="88%" color="bg-indigo-500" />
              <ProgressBar label="Physics" val="82%" width="82%" color="bg-emerald-500" />
              <ProgressBar label="Information Tech" val="79%" width="79%" color="bg-purple-500" />
            </div>
          </div>
        </div>


        {/* RIGHT COLUMN: WIDGETS */}
        <div className="space-y-8">
          
          {/* Calendar Widget */}
          <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Academic Milestones</h4>
            <div className="flex justify-between mb-8 items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <ChevronLeft size={16} className="cursor-pointer text-slate-400 hover:text-[#136dec]" />
              <span className="text-xs font-black text-slate-900 tracking-tight">January 2026</span>
              <ChevronRight size={16} className="cursor-pointer text-slate-400 hover:text-[#136dec]" />
            </div>
            <div className="space-y-6">
               <CalendarItem day="24" month="JAN" title="Semester Finals" sub="All Departments" active />
               <CalendarItem day="28" month="JAN" title="Faculty Sync" sub="Main Lab 01" />
               <CalendarItem day="05" month="FEB" title="Admission Cycle" sub="Campus Office" />
            </div>
            <button className="w-full mt-10 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border border-dashed border-slate-200 rounded-2xl hover:bg-slate-50 hover:text-[#136dec] transition-all">
              View Calendar
            </button>
          </div>

          {/* STORAGE WIDGET */}
          <div className="bg-slate-950 p-8 rounded-[32px] text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 size-32 bg-blue-600/20 rounded-full blur-3xl group-hover:bg-blue-600/40 transition-all duration-700"></div>
              <h5 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 mb-4">Node Server Storage</h5>
              <div className="flex justify-between items-end mb-6">
                 <span className="text-5xl font-black tracking-tighter italic">78%</span>
                 <div className="text-right">
                    <p className="text-[10px] font-black opacity-40 uppercase tracking-widest">Available</p>
                    <p className="text-xs font-black text-blue-400">110 GB Left</p>
                 </div>
              </div>
              <div className="w-full bg-white/10 h-3 rounded-full mb-10 overflow-hidden shadow-inner">
                 <div className="bg-gradient-to-r from-blue-600 to-indigo-400 h-full rounded-full transition-all duration-1000 shadow-[0_0_20px_rgba(37,99,235,0.5)]" style={{width: '78%'}}></div>
              </div>
              <button className="w-full py-4 bg-white/5 border border-white/10 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all">Clear Server Logs</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- HELPER COMPONENTS ---

const ProgressBar = ({ label, val, width, color }) => (
  <div>
    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-3">
      <span className="text-slate-400">{label}</span>
      <span className={color.replace('bg-', 'text-')}>{val}</span>
    </div>
    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden shadow-inner">
      <div className={`${color} h-full rounded-full transition-all duration-1000`} style={{ width }}></div>
    </div>
  </div>
);

const CalendarItem = ({ day, month, title, sub, active }) => (
  <div className={`flex gap-5 p-4 rounded-2xl transition-all ${active ? 'bg-blue-50 border border-blue-100' : 'hover:bg-slate-50'}`}>
    <div className={`size-14 flex flex-col items-center justify-center rounded-2xl shadow-sm ${active ? 'bg-[#136dec] text-white' : 'bg-white border border-slate-100 text-slate-600'}`}>
      <span className="text-[9px] font-black uppercase tracking-tighter leading-none mb-1">{month}</span>
      <span className="text-2xl font-black leading-none">{day}</span>
    </div>
    <div className="flex flex-col justify-center">
      <p className="text-sm font-black text-slate-900 leading-tight mb-1 tracking-tight">{title}</p>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">{sub}</p>
    </div>
  </div>
);