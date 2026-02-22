// import React from 'react';
// import { ChevronRight, GraduationCap, Users } from 'lucide-react';

// export default function StudentBatchCard({ batch, onSelect, students }) {
//   // 🔄 ONE-FLOW: Compare batchId (ensuring string/number compatibility)
//   const count = students.filter(s => String(s.batchId) === String(batch.id)).length;

//   return (
//     <div 
//       onClick={() => onSelect(batch)} 
//       className={`bg-white border-2 rounded-[2rem] p-8 hover:border-blue-600 hover:shadow-2xl hover:shadow-blue-500/10 transition-all cursor-pointer group 
//       ${batch.active ? 'border-blue-600 ring-4 ring-blue-50' : 'border-slate-100'}`}
//     >
//       <div className="flex justify-between items-start mb-6">
//         <div className="p-4 bg-blue-50 rounded-2xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
//           <GraduationCap size={24} />
//         </div>
        
//         {/* Year Badge */}
//         <span className="text-[10px] font-black px-3 py-1.5 rounded-full uppercase bg-blue-50 text-blue-600 border border-blue-100 tracking-wider">
//           Year {batch.year}
//         </span>
//       </div>
      
//       {/* 🏛️ DEPARTMENT NAME - Big, Bold, Blue, and CAPITALIZED */}
//       <h3 className="text-2xl font-black text-blue-600 leading-tight mb-2 uppercase tracking-tight">
//         {batch.dept}
//       </h3>
      
//       {/* 📅 BATCH INFO - Bold Black */}
//       <p className="text-sm font-black text-black uppercase tracking-[0.15em] mb-8">
//         Batch {batch.batch}
//       </p>
      
//       <div className="flex justify-between items-center pt-5 border-t border-slate-100">
//         <div className="flex items-center gap-3">
//           <div className="size-9 rounded-full bg-slate-50 flex items-center justify-center">
//              <Users size={18} className="text-slate-400" />
//           </div>
//           <p className="text-sm font-black text-slate-700">{count} Registered</p>
//         </div>
        
//         <div className="size-10 rounded-full bg-slate-50 group-hover:bg-blue-600 flex items-center justify-center transition-all">
//           <ChevronRight size={20} className="text-slate-300 group-hover:text-white transition-all" />
//         </div>
//       </div>
//     </div>
//   );
// }


import React from 'react';
import { Users, GraduationCap, CheckCircle2, Clock, ChevronRight, TrendingUp } from 'lucide-react';

export default function StudentBatchCard({ batch, onSelect, students = [] }) {
  // 1. Logic for Progress
  const currentSem = batch.semester || 1;
  const totalSem = parseInt(batch.batch.includes('2024-2027') ? 6 : 8); // Example logic
  const progress = Math.min(Math.round((currentSem / totalSem) * 100), 100);
  
  // 2. Logic for Student Summary
  const batchStudents = students.filter(s => String(s.batchId) === String(batch.id));
  const activeStudents = batchStudents.filter(s => s.status === 'Active').length;

  const isCompleted = currentSem >= totalSem;

  return (
    <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden">
      
      {/* --- SECTION 1: IDENTITY --- */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="space-y-1">
            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter">
              {batch.dept}
            </span>
            <h3 className="text-2xl font-black text-slate-900 leading-tight mt-2">
              {batch.batch}
            </h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
               Code: {batch.dept}-{batch.batch.split('-')[0]}
            </p>
          </div>
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase ${isCompleted ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
            {isCompleted ? <CheckCircle2 size={12}/> : <Clock size={12}/>}
            {isCompleted ? 'Completed' : 'Active'}
          </div>
        </div>
      </div>

      {/* --- SECTION 2: ACADEMIC PROGRESS --- */}
      <div className="px-6 py-5 bg-slate-50 border-y border-slate-100">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp size={14} className="text-blue-600" />
            <span className="text-[11px] font-black text-slate-700 uppercase">Semester {currentSem} / {totalSem}</span>
          </div>
          <span className="text-[11px] font-black text-blue-600">{progress}%</span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden p-0.5">
          <div 
            className={`h-full rounded-full transition-all duration-1000 ${isCompleted ? 'bg-green-500' : 'bg-blue-600'}`}
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Result Indicator */}
        <div className="mt-2 flex items-center gap-2">
          <div className={`w-2  rounded-full ${isCompleted ? 'bg-green-500' : 'bg-orange-500'}`} />
          <span className="text-[9px] font-bold text-slate-500 uppercase">
            {isCompleted ? '🟢 Final Results Published' : '🟠 Mid-term results pending'}
          </span>
        </div>
      </div>

      {/* --- SECTION 3: STUDENT SUMMARY --- */}
      <div className="p-6 flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-600">
              <Users size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">Total Students</p>
              <p className="text-lg font-black text-slate-900">{batchStudents.length}</p>
            </div>
          </div>
          <div className="text-right">
             <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">Active</p>
             <p className="text-lg font-black text-green-600">{activeStudents}</p>
          </div>
        </div>

        {/* --- ACTIONS --- */}
        <div className="flex gap-2">
          <button 
            onClick={() => onSelect(batch)}
            className="flex-1 bg-slate-900 text-white py-1 rounded-2xl font-bold text-xs hover:bg-blue-600 transition-all shadow-lg flex items-center justify-center gap-2"
          >
            Manage Batch <ChevronRight size={10} />
          </button>
          
          {!isCompleted && (
            <button className="px-4 bg-white border-2 border-slate-200 text-slate-700 rounded-2xl font-bold text-xs hover:border-blue-600 hover:text-blue-600 transition-all">
              Promote
            </button>
          )}
        </div>
      </div>
    </div>
  );
}