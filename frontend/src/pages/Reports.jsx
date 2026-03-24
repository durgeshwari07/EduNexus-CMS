


// import React, { useState, useEffect, useMemo } from 'react';
// import axios from 'axios';
// import { 
//   AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
//   PieChart, Pie, Cell 
// } from 'recharts';
// import { 
//   Filter, MoreVertical, GraduationCap, Trophy, Users, 
//   Activity, ChevronDown 
// } from 'lucide-react';

// // --- Base Mock Data for Area Chart ---
// const basePerformanceData = [
//   { name: 'Jan', current: 30, previous: 20 },
//   { name: 'Feb', current: 35, previous: 25 },
//   { name: 'Mar', current: 25, previous: 22 },
//   { name: 'Apr', current: 40, previous: 28 },
//   { name: 'May', current: 65, previous: 40 },
//   { name: 'Jun', current: 35, previous: 25 },
//   { name: 'Jul', current: 75, previous: 45 },
// ];

// const Dashboard = () => {
//   // --- State Definitions ---
//   const [teacherData, setTeacherData] = useState([]);
//   const [topSubjects, setTopSubjects] = useState([]); 
//   const [subjectsLoading, setSubjectsLoading] = useState(true); 
//   const [currentYear, setCurrentYear] = useState('2023-2024');
//   const [compareYear, setCompareYear] = useState('2022-2023');
//   const [resultData, setResultData] = useState([]);
//   const [overallPass, setOverallPass] = useState(0);

//   const availableYears = ['2022-2023', '2023-2024', '2024-2025', '2025-2026'];

//   /* ---------------- DYNAMIC GRAPH LOGIC ---------------- */
//   const dynamicGraphData = useMemo(() => {
//     const currIndex = availableYears.indexOf(currentYear) + 1;
//     const compIndex = availableYears.indexOf(compareYear) + 1;

//     return basePerformanceData.map(item => ({
//       ...item,
//       current: Math.round(item.current * (0.8 + currIndex * 0.1)),
//       previous: Math.round(item.previous * (0.8 + compIndex * 0.1)),
//     }));
//   }, [currentYear, compareYear]);

//   /* ---------------- FETCH ALL DATA ---------------- */
//   const fetchAllData = async () => {
//     try {
//       setSubjectsLoading(true);
//       const token = localStorage.getItem('token');
      
//       // 1. Fetch Teacher Workload
//       const workloadRes = await axios.get("http://localhost:5000/api/teacher-workload");
//       const formattedWorkload = workloadRes.data.map(t => {
//         const total = Number(t.majorCount || 0) + Number(t.electiveCount || 0) + Number(t.labCount || 0) + Number(t.seminarCount || 0);
//         return {
//           name: t.name || "Unknown",
//           totalSubjects: total,
//           spaceLeft: Math.max(0, 16 - total),
//           percentUsed: (total / 16) * 100,
//           barColor: total >= 12 ? "bg-red-500" : total >= 8 ? "bg-orange-500" : "bg-blue-500",
//         };
//       });
//       setTeacherData(formattedWorkload);

//       // 2. Fetch Result Distribution
//       const resultRes = await fetch('http://localhost:5000/api/result-distribution', {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });
//       const resJson = await resultRes.json();
//       if (resJson.success) {
//         setResultData(resJson.data.map(item => ({
//           name: item.label, 
//           value: Number(item.percentage), 
//           color: item.label === 'Passed' ? '#3b82f6' : item.label === 'Failed' ? '#ef4444' : '#f59e0b'
//         })));
//         setOverallPass(resJson.overallPassRate);
//       }

//       // 3. Fetch Top Subjects
//       const subjectsRes = await axios.get("http://localhost:5000/api/top-subjects");
//       setTopSubjects(Array.isArray(subjectsRes.data) ? subjectsRes.data : []);
      
//     } catch (err) {
//       console.error("Dashboard Fetch Error:", err);
//     } finally {
//       setSubjectsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAllData();
//   }, [currentYear]);

//   return (
//     <div className="bg-slate-50 p-6 min-h-screen font-sans text-slate-700">
      
//       {/* Header Section */}
//       <div className="mb-6">
//         <h1 className="text-[2rem] font-black text-[#0f172a] tracking-tight">Student Performance Dashboard</h1>
//         <p className="text-slate-500 font-medium text-xs">Institutional Performance and Academic Tracking</p>
//       </div>

//       <div className="grid grid-cols-12 gap-6">
        
//         {/* Performance Area Chart */}
//         <div className="col-span-12 lg:col-span-8 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
//           <h3 className="font-bold text-lg mb-6 text-slate-800">Year-over-Year Performance</h3>
//           <div className="h-64">
//             <ResponsiveContainer width="100%" height="100%">
//               <AreaChart data={dynamicGraphData}>
//                 <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} />
//                 <Tooltip />
//                 <Area type="monotone" dataKey="current" stroke="#3B82F6" strokeWidth={3} fillOpacity={0.1} fill="#3B82F6" />
//                 <Area type="monotone" dataKey="previous" stroke="#CBD5E1" strokeWidth={2} strokeDasharray="5 5" fill="transparent" />
//               </AreaChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* Result Pie Chart */}
//         <div className="col-span-12 lg:col-span-4 bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center">
//           <h3 className="font-bold text-lg self-start mb-4 text-slate-800">Result Distribution</h3>
//           <div className="relative h-48 w-48">
//             <ResponsiveContainer width="100%" height="100%">
//               <PieChart>
//                 <Pie data={resultData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
//                   {resultData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
//                 </Pie>
//               </PieChart>
//             </ResponsiveContainer>
//             <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
//               <span className="text-3xl font-black text-slate-700">{overallPass}%</span>
//               <span className="text-[10px] font-bold text-slate-400">OVERALL PASS</span>
//             </div>
//           </div>
//           <div className="grid grid-cols-2 gap-4 mt-4 text-[10px] font-bold uppercase">
//              {resultData.map((item, i) => (
//                <div key={i} className="flex items-center gap-2">
//                  <div className="w-2 h-2 rounded-full" style={{backgroundColor: item.color}}></div>
//                  <span>{item.name}: {item.value}%</span>
//                </div>
//              ))}
//           </div>
//         </div>

//         {/* --- TOP SCORING SUBJECTS WITH SCROLLER --- */}
//         <div className="col-span-12 lg:col-span-4 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
//           <div className="flex justify-between items-center mb-6">
//             <h3 className="font-bold text-slate-800">Top Scoring Subjects</h3>
//             <span className="text-blue-500 text-[10px] font-black uppercase tracking-widest">Avg. Score</span>
//           </div>
//           <div className="h-[280px] overflow-y-auto pr-2 custom-scrollbar space-y-5">
//             {!subjectsLoading && topSubjects.length > 0 ? (
//               topSubjects.map((subject, i) => (
//                 <div key={subject.id || i}>
//                   <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-2 uppercase">
//                     <span className="truncate pr-4">{subject.name}</span>
//                     <span className="text-blue-600 font-black">{subject.percentage}%</span>
//                   </div>
//                   <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
//                     <div 
//                       className="bg-blue-500 h-full rounded-full transition-all duration-1000" 
//                       style={{ width: `${Math.min(Number(subject.percentage), 100)}%` }}
//                     ></div>
//                   </div>
//                 </div>
//               ))
//             ) : subjectsLoading ? (
//                <div className="space-y-4 animate-pulse">
//                  {[1,2,3,4,5].map(n => <div key={n} className="h-4 bg-slate-100 rounded w-full"></div>)}
//                </div>
//             ) : <p className="text-xs text-slate-400 italic py-10 text-center">No data found.</p>}
//           </div>
//         </div>

//         {/* --- TEACHER WORKLOAD WITH SCROLLER --- */}
//         <div className="col-span-12 lg:col-span-8 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
//           <h3 className="font-bold mb-6 text-slate-800">Teacher Workload Allocation</h3>
//           <div className="h-[280px] overflow-y-auto pr-2 custom-scrollbar space-y-5">
//             {teacherData.length > 0 ? (
//               teacherData.map((teacher, i) => (
//                 <div key={i}>
//                   <div className="flex justify-between text-xs font-bold mb-1">
//                     <span>{teacher.name}</span>
//                     <span className="text-slate-400">{teacher.totalSubjects}/16 Units</span>
//                   </div>
//                   <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
//                     <div 
//                       className={`${teacher.barColor} h-full transition-all duration-500`} 
//                       style={{ width: `${teacher.percentUsed}%` }} 
//                     />
//                   </div>
//                 </div>
//               ))
//             ) : <p className="text-sm text-slate-400 italic">No teacher data found.</p>}
//           </div>
//         </div>

//         {/* --- HOLISTIC PERFORMANCE METRICS --- */}
//         <div className="col-span-12 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
//            <h3 className="font-bold mb-6 text-slate-800">Student Holistic Performance</h3>
//            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//              {[
//                { label: 'Avg Academic', val: '84%', color: 'bg-blue-500', Icon: GraduationCap },
//                { label: 'NCC Participation', val: '65%', color: 'bg-indigo-500', Icon: Users },
//                { label: 'Sports Score', val: '72%', color: 'bg-cyan-500', Icon: Trophy },
//                { label: 'NSS Contribution', val: '58%', color: 'bg-slate-500', Icon: Activity },
//              ].map((item) => (
//                <div key={item.label} className="p-4 rounded-xl border border-slate-50 hover:bg-slate-50 transition-all">
//                  <div className="flex items-center gap-2 mb-4">
//                    <div className={`p-2 rounded-lg bg-opacity-10 ${item.color.replace('bg-', 'text-')}`}>
//                      <item.Icon size={16} />
//                    </div>
//                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.label}</span>
//                  </div>
//                  <div className="text-2xl font-black mb-2 text-slate-800">{item.val}</div>
//                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
//                    <div className={`${item.color} h-full rounded-full`} style={{width: item.val}}></div>
//                  </div>
//                </div>
//              ))}
//            </div>
//         </div>
//       </div>

//       {/* --- CUSTOM SCROLLBAR STYLING --- */}
//       <style>{`
//         .custom-scrollbar::-webkit-scrollbar { width: 4px; }
//         .custom-scrollbar::-webkit-scrollbar-track { background: #f8fafc; border-radius: 10px; }
//         .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
//         .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
//       `}</style>
//     </div>
//   );
// };

// export default Dashboard;



import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell 
} from 'recharts';
import { 
  Filter, MoreVertical, GraduationCap, Trophy, Users, 
  Activity, ChevronDown 
} from 'lucide-react';

// --- Base Mock Data for Area Chart ---
const basePerformanceData = [
  { name: 'Jan', current: 30, previous: 20 },
  { name: 'Feb', current: 35, previous: 25 },
  { name: 'Mar', current: 25, previous: 22 },
  { name: 'Apr', current: 40, previous: 28 },
  { name: 'May', current: 65, previous: 40 },
  { name: 'Jun', current: 35, previous: 25 },
  { name: 'Jul', current: 75, previous: 45 },
];

const Dashboard = () => {
  // --- State Definitions ---
  const [teacherData, setTeacherData] = useState([]);
  const [topSubjects, setTopSubjects] = useState([]); 
  const [subjectsLoading, setSubjectsLoading] = useState(true); 
  const [currentYear, setCurrentYear] = useState('2023-2024');
  const [compareYear, setCompareYear] = useState('2022-2023');
  const [resultData, setResultData] = useState([]);
  const [overallPass, setOverallPass] = useState(0);
  
  // NEW: State for Holistic Performance (Live Data)
  const [holisticMetrics, setHolisticMetrics] = useState({ academic: 0, ncc: 0, sports: 0, nss: 0 });

  const availableYears = ['2022-2023', '2023-2024', '2024-2025', '2025-2026'];

  /* ---------------- DYNAMIC GRAPH LOGIC ---------------- */
  const dynamicGraphData = useMemo(() => {
    const currIndex = availableYears.indexOf(currentYear) + 1;
    const compIndex = availableYears.indexOf(compareYear) + 1;

    return basePerformanceData.map(item => ({
      ...item,
      current: Math.round(item.current * (0.8 + currIndex * 0.1)),
      previous: Math.round(item.previous * (0.8 + compIndex * 0.1)),
    }));
  }, [currentYear, compareYear]);

  /* ---------------- FETCH ALL DATA ---------------- */
  const fetchAllData = async () => {
    try {
      setSubjectsLoading(true);
      const token = localStorage.getItem('token');
      
      // 1. Fetch Teacher Workload
      const workloadRes = await axios.get("http://localhost:5000/api/teacher-workload");
      const formattedWorkload = workloadRes.data.map(t => {
        const total = Number(t.majorCount || 0) + Number(t.electiveCount || 0) + Number(t.labCount || 0) + Number(t.seminarCount || 0);
        return {
          name: t.name || "Unknown",
          totalSubjects: total,
          spaceLeft: Math.max(0, 16 - total),
          percentUsed: (total / 16) * 100,
          barColor: total >= 12 ? "bg-red-500" : total >= 8 ? "bg-orange-500" : "bg-blue-500",
        };
      });
      setTeacherData(formattedWorkload);

      // 2. Fetch Result Distribution
      const resultRes = await fetch('http://localhost:5000/api/result-distribution', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const resJson = await resultRes.json();
      if (resJson.success) {
        setResultData(resJson.data.map(item => ({
          name: item.label, 
          value: Number(item.percentage), 
          color: item.label === 'Passed' ? '#3b82f6' : item.label === 'Failed' ? '#ef4444' : '#f59e0b'
        })));
        setOverallPass(resJson.overallPassRate);
      }

      // 3. Fetch Top Subjects
      const subjectsRes = await axios.get("http://localhost:5000/api/top-subjects");
      const subData = Array.isArray(subjectsRes.data) ? subjectsRes.data : [];
      setTopSubjects(subData);

      // 4. NEW: Fetch Holistic Performance (NSS, NCC, Sports)
      const holisticRes = await axios.get("http://localhost:5000/api/analytics/holistic-averages");
      if (holisticRes.data) {
        // Calculate Academic Average from the top subjects fetched in step 3
        const academicAvg = subData.length > 0 
          ? Math.round(subData.reduce((acc, curr) => acc + Number(curr.percentage), 0) / subData.length)
          : 0;

        setHolisticMetrics({
          academic: academicAvg,
          ncc: holisticRes.data.ncc || 0,
          sports: holisticRes.data.sports || 0,
          nss: holisticRes.data.nss || 0
        });
      }
      
    } catch (err) {
      console.error("Dashboard Fetch Error:", err);
    } finally {
      setSubjectsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [currentYear]);

  return (
    <div className="bg-slate-50 p-6 min-h-screen font-sans text-slate-700">
      
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-[2rem] font-black text-[#0f172a] tracking-tight">Student Performance Dashboard</h1>
        <p className="text-slate-500 font-medium text-xs">Institutional Performance and Academic Tracking</p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        
        {/* Performance Area Chart */}
        <div className="col-span-12 lg:col-span-8 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-lg mb-6 text-slate-800">Year-over-Year Performance</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dynamicGraphData}>
                <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="current" stroke="#3B82F6" strokeWidth={3} fillOpacity={0.1} fill="#3B82F6" />
                <Area type="monotone" dataKey="previous" stroke="#CBD5E1" strokeWidth={2} strokeDasharray="5 5" fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Result Pie Chart */}
        <div className="col-span-12 lg:col-span-4 bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center">
          <h3 className="font-bold text-lg self-start mb-4 text-slate-800">Result Distribution</h3>
          <div className="relative h-48 w-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={resultData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {resultData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-black text-slate-700">{overallPass}%</span>
              <span className="text-[10px] font-bold text-slate-400">OVERALL PASS</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4 text-[10px] font-bold uppercase">
             {resultData.map((item, i) => (
               <div key={i} className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full" style={{backgroundColor: item.color}}></div>
                 <span>{item.name}: {item.value}%</span>
               </div>
             ))}
          </div>
        </div>

        {/* --- TOP SCORING SUBJECTS WITH SCROLLER --- */}
        <div className="col-span-12 lg:col-span-4 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800">Top Scoring Subjects</h3>
            <span className="text-blue-500 text-[10px] font-black uppercase tracking-widest">Avg. Score</span>
          </div>
          <div className="h-[280px] overflow-y-auto pr-2 custom-scrollbar space-y-5">
            {!subjectsLoading && topSubjects.length > 0 ? (
              topSubjects.map((subject, i) => (
                <div key={subject.id || i}>
                  <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-2 uppercase">
                    <span className="truncate pr-4">{subject.name}</span>
                    <span className="text-blue-600 font-black">{subject.percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-blue-500 h-full rounded-full transition-all duration-1000" 
                      style={{ width: `${Math.min(Number(subject.percentage), 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))
            ) : subjectsLoading ? (
               <div className="space-y-4 animate-pulse">
                 {[1,2,3,4,5].map(n => <div key={n} className="h-4 bg-slate-100 rounded w-full"></div>)}
               </div>
            ) : <p className="text-xs text-slate-400 italic py-10 text-center">No data found.</p>}
          </div>
        </div>

        {/* --- TEACHER WORKLOAD WITH SCROLLER --- */}
        <div className="col-span-12 lg:col-span-8 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="font-bold mb-6 text-slate-800">Teacher Workload Allocation</h3>
          <div className="h-[280px] overflow-y-auto pr-2 custom-scrollbar space-y-5">
            {teacherData.length > 0 ? (
              teacherData.map((teacher, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span>{teacher.name}</span>
                    <span className="text-slate-400">{teacher.totalSubjects}/16 Units</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className={`${teacher.barColor} h-full transition-all duration-500`} 
                      style={{ width: `${teacher.percentUsed}%` }} 
                    />
                  </div>
                </div>
              ))
            ) : <p className="text-sm text-slate-400 italic">No teacher data found.</p>}
          </div>
        </div>

        {/* --- HOLISTIC PERFORMANCE METRICS (NOW LIVE) --- */}
        <div className="col-span-12 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
           <h3 className="font-bold mb-6 text-slate-800">Student Holistic Performance</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             {[
               { label: 'Avg Academic', val: `${holisticMetrics.academic}%`, color: 'bg-blue-500', Icon: GraduationCap },
               { label: 'NCC Participation', val: `${holisticMetrics.ncc}%`, color: 'bg-indigo-500', Icon: Users },
               { label: 'Sports Score', val: `${holisticMetrics.sports}%`, color: 'bg-cyan-500', Icon: Trophy },
               { label: 'NSS Contribution', val: `${holisticMetrics.nss}%`, color: 'bg-slate-500', Icon: Activity },
             ].map((item) => (
               <div key={item.label} className="p-4 rounded-xl border border-slate-50 hover:bg-slate-50 transition-all">
                 <div className="flex items-center gap-2 mb-4">
                   <div className={`p-2 rounded-lg bg-opacity-10 ${item.color.replace('bg-', 'text-')}`}>
                     <item.Icon size={16} />
                   </div>
                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.label}</span>
                 </div>
                 <div className="text-2xl font-black mb-2 text-slate-800">{item.val}</div>
                 <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                   <div 
                     className={`${item.color} h-full rounded-full transition-all duration-700`} 
                     style={{width: item.val}}
                   ></div>
                 </div>
               </div>
             ))}
           </div>
        </div>
      </div>

      {/* --- CUSTOM SCROLLBAR STYLING --- */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f8fafc; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>
    </div>
  );
};

export default Dashboard;