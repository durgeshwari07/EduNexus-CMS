// import React, { useState } from 'react';
// import { 
//   AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
//   PieChart, Pie, Cell, BarChart, Bar
// } from 'recharts';
// import { 
//   GraduationCap, Briefcase, Terminal, Heart, TrendingUp, 
//   X, Plus, Activity, CheckCircle2, ChevronRight, Save, BookOpen
// } from 'lucide-react';

// // --- MOCK DATA ---
// const COLORS = ['#2563eb', '#7c3aed', '#db2777', '#f59e0b', '#10b981', '#6366f1'];

// // --- WIZARD COMPONENT ---
// const WizardPopup = ({ isOpen, onClose, onDataSubmit }) => {
//   const [selectedCategories, setSelectedCategories] = useState(['Academic & Career']);
//   const [currentStepIndex, setCurrentStepIndex] = useState(0);
//   const [formData, setFormData] = useState({
//     academicScore: '', placementRate: '', careerActivities: '',
//     sports: '', techEvents: '', cultural: '', social: '',
//     workshops: '' 
//   });

//   if (!isOpen) return null;

//   const steps = [
//     { id: 'Academic & Career', label: 'Academic & Career' },
//     { id: 'Campus Engagement', label: 'Campus Engagement' },
//     { id: 'Faculty Workshops', label: 'Faculty Workshops' }
//   ];

//   const toggleCategory = (id) => {
//     setSelectedCategories(prev => 
//       prev.includes(id) ? (prev.length > 1 ? prev.filter(c => c !== id) : prev) : [...prev, id]
//     );
//     setCurrentStepIndex(0);
//   };

//   const handleNext = () => {
//     if (currentStepIndex < selectedCategories.length - 1) {
//       setCurrentStepIndex(currentStepIndex + 1);
//     } else {
//       onDataSubmit(formData);
//       // Reset form after submit
//       setFormData({
//         academicScore: '', placementRate: '', careerActivities: '',
//         sports: '', techEvents: '', cultural: '', social: '',
//         workshops: ''
//       });
//       onClose();
//       setCurrentStepIndex(0);
//     }
//   };

//   const activeCategory = selectedCategories[currentStepIndex];

//   return (
//     <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-[2.5rem] w-full max-w-5xl shadow-2xl flex overflow-hidden min-h-[580px] animate-in zoom-in duration-300">
        
//         {/* Sidebar Filters */}
//         <div className="w-1/3 bg-slate-50 p-10 border-r border-slate-100">
//           <div className="flex items-center gap-3 text-blue-600 font-bold mb-10">
//              <Activity size={20} /> Data Entry Wizard
//           </div>
//           <p className="text-[10px] font-bold text-slate-400 uppercase mb-4 tracking-widest">Select Categories</p>
//           <div className="space-y-3">
//             {steps.map((step) => (
//               <button 
//                 key={step.id} 
//                 onClick={() => toggleCategory(step.id)}
//                 className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
//                   selectedCategories.includes(step.id) ? 'bg-white border-blue-600 shadow-sm' : 'border-transparent opacity-50'
//                 }`}
//               >
//                 <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${selectedCategories.includes(step.id) ? 'bg-blue-600 text-white' : 'border-slate-300'}`}>
//                   {selectedCategories.includes(step.id) && <CheckCircle2 size={12}/>}
//                 </div>
//                 <span className="text-sm font-bold">{step.label}</span>
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Form Content */}
//         <div className="flex-1 p-12 flex flex-col">
//           <div className="flex justify-between mb-8">
//             <div>
//               <p className="text-xs font-bold text-blue-600">Step {currentStepIndex + 1} of {selectedCategories.length}</p>
//               <h2 className="text-2xl font-black text-slate-800">{activeCategory}</h2>
//             </div>
//             <button onClick={onClose} className="text-slate-400"><X /></button>
//           </div>

//           <div className="flex-1">
//             {activeCategory === 'Academic & Career' && (
//               <div className="space-y-6 animate-in slide-in-from-right-4">
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="space-y-1">
//                     <label className="text-[10px] font-bold text-slate-500 uppercase">Avg Score %</label>
//                     <input type="number" className="w-full border p-4 rounded-2xl" placeholder="88.5" value={formData.academicScore} onChange={e => setFormData({...formData, academicScore: e.target.value})} />
//                   </div>
//                   <div className="space-y-1">
//                     <label className="text-[10px] font-bold text-slate-500 uppercase">Placement Rate %</label>
//                     <input type="number" className="w-full border p-4 rounded-2xl" placeholder="92.0" value={formData.placementRate} onChange={e => setFormData({...formData, placementRate: e.target.value})} />
//                   </div>
//                 </div>
//               </div>
//             )}
            
//             {activeCategory === 'Campus Engagement' && (
//               <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-right-4">
//                 <div className="space-y-1">
//                   <label className="text-[10px] font-bold text-slate-500 uppercase">Sports Count</label>
//                   <input type="number" className="w-full border p-4 rounded-2xl" placeholder="60" value={formData.sports} onChange={e => setFormData({...formData, sports: e.target.value})} />
//                 </div>
//                 <div className="space-y-1">
//                   <label className="text-[10px] font-bold text-slate-500 uppercase">Tech Events</label>
//                   <input type="number" className="w-full border p-4 rounded-2xl" placeholder="85" value={formData.techEvents} onChange={e => setFormData({...formData, techEvents: e.target.value})} />
//                 </div>
//               </div>
//             )}

//             {activeCategory === 'Faculty Workshops' && (
//                <div className="space-y-6 animate-in slide-in-from-right-4">
//                  <div className="p-8 bg-blue-50/50 rounded-3xl border border-blue-100 mb-6">
//                     <div className="flex items-center gap-3 text-blue-600 font-bold mb-2">
//                       <BookOpen size={20} />
//                       <span>Workshop Reporting</span>
//                     </div>
//                     <p className="text-sm text-slate-500">Enter the number of workshops to add to the current academic year.</p>
//                  </div>
                 
//                  <div className="max-w-md">
//                     <div className="space-y-1">
//                       <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
//                         New Workshops Conducted
//                       </label>
//                       <input 
//                         type="number" 
//                         className="w-full border-2 border-slate-100 p-4 rounded-2xl focus:border-blue-600 outline-none transition-all text-lg font-semibold" 
//                         placeholder="e.g. 5" 
//                         value={formData.workshops}
//                         onChange={e => setFormData({...formData, workshops: e.target.value})} 
//                       />
//                     </div>
//                  </div>
//                </div>
//             )}
//           </div>

//           <div className="mt-8 pt-8 border-t flex justify-between items-center">
//             <button onClick={onClose} className="text-sm font-bold text-slate-400">Cancel</button>
//             <button onClick={handleNext} className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-2">
//               {currentStepIndex === selectedCategories.length - 1 ? <><Save size={18}/> Submit Data</> : <><ChevronRight size={18}/> Save & Next</>}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // --- MAIN DASHBOARD ---
// export default function Dashboard() {
//   const [isWizardOpen, setIsWizardOpen] = useState(false);
  
//   const [performanceData, setPerformanceData] = useState([
//     { year: '2021', academics: 72, placement: 65, engagement: 50 },
//     { year: '2022', academics: 78, placement: 72, engagement: 58 },
//     { year: '2023', academics: 84, placement: 80, engagement: 70 },
//     { year: '2024', academics: 88, placement: 92, engagement: 82 },
//   ]);

//   const [categoryData, setCategoryData] = useState([
//     { name: 'Academic', value: 25 }, { name: 'Technical', value: 20 },
//     { name: 'Career', value: 15 }, { name: 'Cultural', value: 15 },
//     { name: 'Sports', value: 12 }, { name: 'Social', value: 13 },
//   ]);

//   const [successData, setSuccessData] = useState([
//     { name: 'Academics', current: 90, last: 75, prev: 60 },
//     { name: 'Career & Placement', current: 85, last: 65, prev: 50 },
//     { name: 'Workshops', current: 40, last: 60, prev: 45 }, // Lowered initial current to see growth
//   ]);

//   // --- UPDATED HANDLE UPDATE LOGIC ---
//   const handleUpdate = (data) => {
//     // 1. Update Academic/Placement Chart
//     if (data.academicScore || data.placementRate) {
//       setPerformanceData(prev => [
//         ...prev, 
//         { 
//             year: '2025 (New)', 
//             academics: parseInt(data.academicScore || 88), 
//             placement: parseInt(data.placementRate || 92),
//             engagement: 85 
//         }
//       ]);
//     }

//     // 2. Update Workshops in Success Bar Chart
//     if (data.workshops) {
//       setSuccessData(prev => prev.map(item => {
//         if (item.name === 'Workshops') {
//           // We add the new workshops to the existing 'current' value
//           return { ...item, current: item.current + parseInt(data.workshops) };
//         }
//         return item;
//       }));
//     }
    
//     // 3. Update Engagement Chart if sports/tech entered
//     // You can add logic here to update the second bar chart too!
//   };

//   return (
//     <div className="min-h-screen bg-[#fbfcff] font-sans text-slate-800 pb-20">
//       <nav className="bg-white border-b border-slate-100 px-8 py-4 sticky top-0 z-40">
//         <div className="max-w-[1600px] mx-auto flex justify-end">
//           <button onClick={() => setIsWizardOpen(true)} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg hover:bg-blue-700 transition-all">
//             <Plus size={18}/> Add Data
//           </button>
//         </div>
//       </nav>

//       <main className="max-w-[1600px] mx-auto p-8">
//         <header className="mb-10">
//           <h2 className="text-3xl font-black text-slate-900">Institutional Analytics Dashboard</h2>
//           <p className="text-slate-400 text-sm mt-1 font-medium">Holistic tracking of college performance and student success</p>
//         </header>

//         {/* Stat Cards */}
//         <div className="grid grid-cols-4 gap-6 mb-8">
//           {[
//             { label: 'ACADEMIC SCORE', val: '88.5%', change: '+3.2%', icon: GraduationCap, color: 'text-blue-600' },
//             { label: 'PLACEMENT RATE', val: '92.0%', change: '+15.4%', icon: Briefcase, color: 'text-purple-600' },
//             { label: 'TECHNICAL EVENTS', val: '42', change: '+22.1%', icon: Terminal, color: 'text-cyan-500' },
//             { label: 'SOCIAL OUTREACH', val: '18', change: '+8.5%', icon: Heart, color: 'text-pink-500' },
//           ].map((s, i) => (
//             <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
//               <div className="flex justify-between items-start mb-4">
//                 <div className={`p-2.5 rounded-2xl bg-slate-50 ${s.color}`}><s.icon size={22}/></div>
//                 <div className="flex items-center gap-1 text-emerald-500 text-[11px] font-bold"><TrendingUp size={12}/> {s.change}</div>
//               </div>
//               <p className="text-[10px] font-bold text-slate-400 tracking-widest mb-1 uppercase">{s.label}</p>
//               <p className="text-3xl font-extrabold text-slate-800">{s.val}</p>
//             </div>
//           ))}
//         </div>

//         {/* Charts Section */}
//         <div className="grid grid-cols-3 gap-6 mb-8">
//           <div className="col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
//             <div className="flex justify-between items-center mb-6">
//                 <h3 className="font-bold text-lg text-slate-800">Overall College Performance</h3>
//                 <div className="flex gap-4">
//                     {['Academics', 'Placement', 'Engagement'].map((item, idx) => (
//                     <div key={item} className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
//                         <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx] }} /> {item}
//                     </div>
//                     ))}
//                 </div>
//             </div>
//             <div className="h-72">
//               <ResponsiveContainer width="100%" height="100%">
//                 <AreaChart data={performanceData}>
//                   <defs>
//                     <linearGradient id="pAcad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={COLORS[0]} stopOpacity={0.1}/><stop offset="95%" stopColor={COLORS[0]} stopOpacity={0}/></linearGradient>
//                     <linearGradient id="pPlace" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={COLORS[1]} stopOpacity={0.1}/><stop offset="95%" stopColor={COLORS[1]} stopOpacity={0}/></linearGradient>
//                   </defs>
//                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
//                   <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} dy={10} />
//                   <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
//                   <Tooltip contentStyle={{borderRadius: '16px', border: 'none'}} />
//                   <Area type="monotone" dataKey="academics" stroke={COLORS[0]} strokeWidth={4} fill="url(#pAcad)" />
//                   <Area type="monotone" dataKey="placement" stroke={COLORS[1]} strokeWidth={4} fill="url(#pPlace)" />
//                   <Area type="monotone" dataKey="engagement" stroke={COLORS[2]} strokeWidth={3} strokeDasharray="5 5" fill="none" />
//                 </AreaChart>
//               </ResponsiveContainer>
//             </div>
//           </div>

//           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
//             <h3 className="font-bold mb-6 text-slate-800">Category Distribution</h3>
//             <div className="h-56 relative">
//               <ResponsiveContainer width="100%" height="100%">
//                 <PieChart>
//                   <Pie data={categoryData} innerRadius={70} outerRadius={95} paddingAngle={5} dataKey="value" stroke="none">
//                     {categoryData.map((e, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
//                   </Pie>
//                 </PieChart>
//               </ResponsiveContainer>
//               <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
//                 <span className="text-2xl font-black text-slate-800">100%</span>
//                 <span className="text-[10px] text-slate-400 font-bold uppercase">Active</span>
//               </div>
//             </div>
//             <div className="grid grid-cols-2 gap-y-3 mt-6">
//               {categoryData.map((c, i) => (
//                 <div key={i} className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
//                   <div className="w-2.5 h-2.5 rounded-full" style={{background: COLORS[i]}} /> {c.name}
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Comparison Bars - THIS IS WHERE WORKSHOPS SHOW UP */}
//         <div className="grid grid-cols-2 gap-6">
//           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
//             <h3 className="font-bold mb-6 text-slate-800 text-sm">Academic & Professional Success</h3>
//             <div className="h-72">
//               <ResponsiveContainer width="100%" height="100%">
//                 <BarChart data={successData} barGap={8}>
//                   <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 11, fontWeight: 600}} />
//                   <Tooltip cursor={{fill: 'transparent'}} />
//                   <Bar dataKey="prev" fill="#e2e8f0" radius={[6, 6, 0, 0]} barSize={25} />
//                   <Bar dataKey="last" fill="#93c5fd" radius={[6, 6, 0, 0]} barSize={25} />
//                   <Bar dataKey="current" fill="#2563eb" radius={[6, 6, 0, 0]} barSize={25} />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           </div>
          
//           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
//             <h3 className="font-bold mb-6 text-slate-800 text-sm">Campus Engagement & Activities</h3>
//             <div className="h-72">
//               <ResponsiveContainer width="100%" height="100%">
//                 <BarChart data={[{name:'Sports', c:60, l:65}, {name:'Tech', c:85, l:55}, {name:'Cultural', c:75, l:68}]} barGap={6}>
//                   <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 600}} />
//                   <Bar dataKey="l" fill="#93c5fd" radius={[4, 4, 0, 0]} barSize={12} />
//                   <Bar dataKey="c" fill="#2563eb" radius={[4, 4, 0, 0]} barSize={12} />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           </div>
//         </div>
//       </main>

//       <WizardPopup isOpen={isWizardOpen} onClose={() => setIsWizardOpen(false)} onDataSubmit={handleUpdate} />
//     </div>
//   );
// }








import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell 
} from 'recharts';
import { Filter, MoreVertical, GraduationCap, Trophy, Users, Activity, ChevronDown } from 'lucide-react';

// --- Mock Data ---
const performanceData = [
  { name: 'Jan', current: 30, previous: 20 },
  { name: 'Feb', current: 35, previous: 25 },
  { name: 'Mar', current: 25, previous: 22 },
  { name: 'Apr', current: 40, previous: 28 },
  { name: 'May', current: 65, previous: 40 },
  { name: 'Jun', current: 35, previous: 25 },
  { name: 'Jul', current: 75, previous: 45 },
];

const resultData = [
  { name: 'Passed', value: 75, color: '#3B82F6' },
  { name: 'Suppl.', value: 15, color: '#F97316' },
  { name: 'Failed', value: 10, color: '#EF4444' },
];

const teacherData = [
  { name: 'Prof. Rao', status: 'OVERLOAD', color: 'bg-red-100 text-red-500', bars: [30, 25, 20, 25] },
  { name: 'Dr. Adams', status: 'OPTIMAL', color: 'bg-orange-100 text-orange-500', bars: [35, 20, 30, 15] },
  { name: 'Dr. Gupta', status: 'NORMAL', color: 'bg-blue-100 text-blue-500', bars: [25, 30, 25, 20] },
  { name: 'Dr. Smith', status: 'BALANCED', color: 'bg-green-100 text-green-500', bars: [40, 20, 20, 20] },
  { name: 'Ms. Lee', status: 'AVAILABLE', color: 'bg-slate-100 text-slate-500', bars: [20, 20, 20, 40] },
];

const Dashboard = () => {
  return (
    <div className="bg-slate-50 p-2 min-h-screen font-sans text-slate-700">
      
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-[2rem] font-black text-[#0f172a] leading-tight tracking-tight">
            Student Performance Dashboard
          </h1>
        <p className="text-slate-500 font-medium text-xs">
          Institutional Performance and Academic Distribution Tracking
        </p>
      </div>

      {/* COMPACT FILTER BAR: Merged and brought side-by-side */}
      <div className="bg-white px-5 py-3 rounded-xl shadow-sm mb-6 border border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-blue-600 font-bold border-r border-slate-100 pr-6">
            <Filter size={16} strokeWidth={2.5} />
            <span className="text-sm tracking-tight">Analytics Filters</span>
          </div>

          <div className="flex items-center gap-8">
            {/* Current Year Dropdown */}
            <div className="flex items-center gap-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current</label>
              <div className="relative">
                <select className="appearance-none border border-slate-200 rounded-lg px-3 py-1.5 bg-slate-50 w-32 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer">
                  <option>2023-2024</option>
                </select>
                <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Compare Year Dropdown */}
            <div className="flex items-center gap-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Compare</label>
              <div className="relative">
                <select className="appearance-none border border-slate-200 rounded-lg px-3 py-1.5 bg-slate-50 w-32 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer">
                  <option>2022-2023</option>
                </select>
                <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
        
        <button className="text-slate-400 hover:text-slate-600 transition-colors">
          <MoreVertical size={20} />
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-6">
        
        {/* YoY Performance Chart */}
        <div className="col-span-12 lg:col-span-8 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg text-slate-800">Year-over-Year Performance</h3>
            <div className="flex items-center gap-4 text-[10px] font-bold">
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500"></span> 2023</div>
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-300"></span> 2022</div>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="colorCurr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="current" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorCurr)" />
                <Area type="monotone" dataKey="previous" stroke="#CBD5E1" strokeWidth={2} strokeDasharray="5 5" fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Result Distribution (Donut Chart) */}
        <div className="col-span-12 lg:col-span-4 bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center">
          <h3 className="font-bold text-lg self-start mb-4">Result Distribution</h3>
          <div className="relative h-48 w-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={resultData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {resultData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black">88%</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Overall Pass</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-4 text-xs font-bold text-slate-600">
             {resultData.map(item => (
               <div key={item.name} className="flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full" style={{backgroundColor: item.color}}></span>
                 {item.name} ({item.value}%)
               </div>
             ))}
          </div>
        </div>

        {/* Results by Dept */}
        <div className="col-span-12 lg:col-span-4 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
           <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold">Results by Dept.</h3>
              <button className="text-blue-500 text-xs font-bold">Details</button>
           </div>
           {['ENGINEERING', 'MEDICINE', 'ARTS'].map((dept, i) => (
             <div key={dept} className="mb-4">
               <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                 <span>{dept}</span>
                 <span>{94 - (i*5)}%</span>
               </div>
               <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                 <div className="bg-blue-500 h-full rounded-full" style={{width: `${94 - (i*5)}%`}}></div>
               </div>
             </div>
           ))}
        </div>

        {/* Teacher Workload - Scrollable Container */}
        <div className="col-span-12 lg:col-span-8 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
           <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold">Subjects Assigned Per Teacher</h3>
              <div className="flex gap-2 text-[8px] font-bold uppercase">
                <span className="flex items-center gap-1"><div className="w-2 h-2 bg-blue-500 rounded-full"></div> Major</span>
                <span className="flex items-center gap-1"><div className="w-2 h-2 bg-indigo-400 rounded-full"></div> Elective</span>
                <span className="flex items-center gap-1"><div className="w-2 h-2 bg-cyan-400 rounded-full"></div> Lab</span>
                <span className="flex items-center gap-1"><div className="w-2 h-2 bg-slate-400 rounded-full"></div> Seminar</span>
              </div>
           </div>
           
           <div className="max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
             {teacherData.map((teacher, i) => (
               <div key={i} className="flex items-center gap-4 mb-4 last:mb-0">
                 <span className="text-xs font-bold w-20 text-slate-500 truncate">{teacher.name}</span>
                 <div className="flex-1 h-6 rounded-md overflow-hidden flex bg-slate-100">
                    <div className="bg-blue-500 h-full border-r border-white/20" style={{width: `${teacher.bars[0]}%`}}></div>
                    <div className="bg-indigo-400 h-full border-r border-white/20" style={{width: `${teacher.bars[1]}%`}}></div>
                    <div className="bg-cyan-400 h-full border-r border-white/20" style={{width: `${teacher.bars[2]}%`}}></div>
                    <div className="bg-slate-400 h-full" style={{width: `${teacher.bars[3]}%`}}></div>
                 </div>
                 <span className={`text-[10px] font-bold px-2 py-0.5 rounded whitespace-nowrap ${teacher.color}`}>
                   {teacher.status}
                 </span>
               </div>
             ))}
           </div>
        </div>

        {/* Holistic Performance Metrics */}
        <div className="col-span-12 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
           <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold">Student Holistic Performance</h3>
              <div className="flex gap-3 text-slate-400"><Filter size={18}/><MoreVertical size={18}/></div>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Avg Academic', val: '84%', color: 'bg-blue-500', Icon: GraduationCap },
                { label: 'NCC Participation', val: '65%', color: 'bg-indigo-500', Icon: Users },
                { label: 'Sports Score', val: '72%', color: 'bg-cyan-500', Icon: Trophy },
                { label: 'NSS Contribution', val: '58%', color: 'bg-slate-500', Icon: Activity },
              ].map((item) => (
                <div key={item.label} className="p-4 rounded-xl border border-slate-50 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-2 mb-4">
                    <div className={`p-2 rounded-lg bg-opacity-10 ${item.color.replace('bg-', 'text-')}`}>
                      <item.Icon size={16} />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{item.label}</span>
                  </div>
                  <div className="text-2xl font-black mb-2">{item.val}</div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className={`${item.color} h-full rounded-full`} style={{width: item.val}}></div>
                  </div>
                </div>
              ))}
           </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f8fafc; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>
    </div>
  );
};

export default Dashboard;