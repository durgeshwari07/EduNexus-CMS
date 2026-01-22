import React from 'react';
import { 
  Users, UserCheck, Calendar, LayoutGrid, 
  TrendingUp, TrendingDown, Download, Filter, 
  ChevronRight, MoreHorizontal, FileText
} from 'lucide-react';

export default function Overview({ departments = [], teachers = [] }) {
  // 1. Data Summary Stats
  const summaryStats = [
    { label: 'Total Students', value: '12,450', trend: '+12.5%', isUp: true, icon: <Users size={20}/>, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Faculty Count', value: teachers.length || '842', trend: '+2.1%', isUp: true, icon: <UserCheck size={20}/>, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Avg. Attendance', value: '94.2%', trend: '-0.8%', isUp: false, icon: <Calendar size={20}/>, color: 'text-cyan-600', bg: 'bg-cyan-50' },
    { label: 'Active Departments', value: departments.length || '18', trend: 'Stable', isUp: null, icon: <LayoutGrid size={20}/>, color: 'text-blue-500', bg: 'bg-slate-50' },
  ];

  return (
    <div className="max-w-[1600px] mx-auto p-6 space-y-8 animate-in fade-in duration-500">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Institutional Insights</h1>
          <p className="text-slate-500 text-sm font-medium">Detailed performance monitoring and automated reporting portal.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 shadow-sm transition-all">
            <Calendar size={16}/> Last 30 Days
          </button>
          <button className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-xl text-xs font-black shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">
            <TrendingUp size={16}/> Generate New Report
          </button>
        </div>
      </div>

      {/* TABS NAVIGATION */}
      <div className="flex gap-8 border-b border-slate-100">
        {['Overview', 'Enrollment', 'Faculty', 'Finance'].map((tab, i) => (
          <button key={tab} className={`pb-4 text-xs font-black uppercase tracking-widest transition-all ${i === 0 ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>
            {tab}
          </button>
        ))}
      </div>

      {/* SUMMARY STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryStats.map((stat, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color}`}>{stat.icon}</div>
            </div>
            <h3 className="text-3xl font-black text-slate-900 mb-2">{stat.value}</h3>
            <div className={`flex items-center gap-1.5 text-[11px] font-bold ${stat.isUp === null ? 'text-slate-400' : stat.isUp ? 'text-green-600' : 'text-red-500'}`}>
              {stat.isUp !== null && (stat.isUp ? <TrendingUp size={12}/> : <TrendingDown size={12}/>)}
              {stat.trend} <span className="text-slate-300 font-medium">vs last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* MAIN ANALYTICS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ENROLLMENT TRENDS (Simulated Chart Area) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-black text-slate-900">Student Enrollment Trends</h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-2"><div className="size-2 rounded-full bg-blue-600"/> <span className="text-[10px] font-bold text-slate-400 uppercase">Undergraduate</span></div>
              <div className="flex items-center gap-2"><div className="size-2 rounded-full bg-slate-200"/> <span className="text-[10px] font-bold text-slate-400 uppercase">Postgraduate</span></div>
            </div>
          </div>
          <div className="h-64 flex items-end justify-between gap-4 px-2">
            {[65, 45, 80, 70, 90, 75].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="w-full flex gap-1 items-end h-full">
                  <div className="flex-1 bg-blue-600 rounded-t-lg transition-all group-hover:bg-blue-700" style={{ height: `${h}%` }}/>
                  <div className="flex-1 bg-slate-100 rounded-t-lg" style={{ height: `${h * 0.7}%` }}/>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Month {i+1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* FACULTY DISTRIBUTION */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6">
          <h3 className="font-black text-slate-900 mb-8">Faculty Distribution</h3>
          <div className="flex flex-col items-center">
            <div className="relative size-48 rounded-full border-[16px] border-slate-50 flex items-center justify-center mb-8">
              <div className="absolute inset-0 rounded-full border-[16px] border-blue-600 border-t-transparent border-r-transparent -rotate-45"/>
              <div className="text-center">
                <p className="text-3xl font-black text-slate-900">842</p>
                <p className="text-[10px] font-black text-slate-400 uppercase">Total Staff</p>
              </div>
            </div>
            <div className="w-full space-y-3">
              {['Engineering', 'Science', 'Arts', 'Other'].map((dept, i) => (
                <div key={dept} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className={`size-2 rounded-full ${['bg-blue-600', 'bg-blue-400', 'bg-indigo-400', 'bg-slate-300'][i]}`}/>
                    <span className="text-[11px] font-bold text-slate-500">{dept}</span>
                  </div>
                  <span className="text-[11px] font-black text-slate-900">{[45, 30, 15, 10][i]}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* PERFORMANCE HEATMAP (Departmental) */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-black text-slate-900">Performance Heatmap (By Department)</h3>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Low</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4].map(i => <div key={i} className={`size-3 rounded-sm ${['bg-blue-50', 'bg-blue-200', 'bg-blue-400', 'bg-blue-600'][i-1]}`}/>)}
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">High</span>
          </div>
        </div>
        <div className="space-y-2">
          {['Computer Science', 'Mechanical Eng.', 'Biotechnology', 'Architecture'].map(dept => (
            <div key={dept} className="grid grid-cols-7 gap-2 items-center">
              <div className="text-[11px] font-bold text-slate-500 truncate">{dept}</div>
              {[4, 1, 3, 2, 1, 3].map((v, i) => (
                <div key={i} className={`h-8 rounded-lg transition-all hover:scale-105 cursor-pointer ${['bg-blue-50', 'bg-blue-200', 'bg-blue-400', 'bg-blue-600'][v-1]}`}/>
              ))}
            </div>
          ))}
          <div className="grid grid-cols-7 gap-2 text-center pt-2">
            <div/>{['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => <div key={day} className="text-[9px] font-black text-slate-300 uppercase">{day}</div>)}
          </div>
        </div>
      </div>

      {/* GENERATED REPORTS TABLE */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-black text-slate-900">Generated Reports</h3>
          <button className="text-xs font-bold text-blue-600 hover:underline">View All Generated Reports</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Report Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Created By</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {[
                { name: 'Monthly Attendance - Oct 2023', cat: 'Staff & Faculty', user: 'John Smith', status: 'READY', color: 'text-green-600 bg-green-50' },
                { name: 'Final Exam Results Q2', cat: 'Academic', user: 'Sarah Jenkins', status: 'READY', color: 'text-green-600 bg-green-50' },
                { name: 'Annual Budget Overview', cat: 'Finance', user: 'Robert Chen', status: 'GENERATING', color: 'text-orange-600 bg-orange-50' },
              ].map((report, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="p-2 bg-slate-100 rounded-lg text-slate-500"><FileText size={16}/></div>
                    <span className="text-xs font-bold text-slate-800">{report.name}</span>
                  </td>
                  <td className="px-6 py-4 text-[11px] font-medium text-slate-500">{report.cat}</td>
                  <td className="px-6 py-4 flex items-center gap-2">
                    <div className="size-6 rounded-full bg-slate-200"/>
                    <span className="text-[11px] font-medium text-slate-600">{report.user}</span>
                  </td>
                  <td className="px-6 py-4 text-[11px] font-medium text-slate-400">Nov 01, 2023</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${report.color}`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all text-blue-600"><Download size={16}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}