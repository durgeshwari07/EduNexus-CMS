

// import React from 'react';
// import { Users, GraduationCap, CheckCircle2, Clock, ChevronRight, TrendingUp, BookOpen } from 'lucide-react';

// export default function StudentBatchCard({ batch, onSelect, students = [], subjects = [], updateData }) {
//   // 1. Logic for Progress
//   const currentSem = Number(batch.semester) || 1;
//   const totalSem = parseInt(batch.batch.includes('2024-2027') ? 6 : 8); 
//   const progress = Math.min(Math.round((currentSem / totalSem) * 100), 100);
  
//   // 2. Logic for Student Summary
//   const batchStudents = students.filter(s => String(s.batchId) === String(batch.id));
//   const activeStudents = batchStudents.filter(s => s.status === 'Active').length;

//   // 3. Logic for Subject Link (New)
//   // Connects to SubjectsManagement by filtering the subjects array provided via props
//   const linkedSubjects = (subjects || []).filter(sub => 
//     String(sub.courseId || sub.dept_id) === String(batch.courseId || batch.dept_id) && 
//     Number(sub.semester) === currentSem
//   );

//   const isCompleted = currentSem >= totalSem;

//   // 4. Handle Promotion (Communicates with Parent updateData)
//   const handlePromote = (e) => {
//     e.stopPropagation();
//     if (isCompleted) return;
    
//     if (window.confirm(`Promote batch ${batch.batch} to Semester ${currentSem + 1}?`)) {
//       updateData({
//         action: 'edit',
//         batch: { ...batch, semester: currentSem + 1 }
//       });
//     }
//   };

//   return (
//     <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden">
      
//       {/* --- SECTION 1: IDENTITY --- */}
//       <div className="p-6">
//         <div className="flex justify-between items-start mb-4">
//           <div className="space-y-1">
//             <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter">
//               {batch.dept}
//             </span>
//             <h3 className="text-2xl font-black text-slate-900 leading-tight mt-2">
//               {batch.batch}
//             </h3>
//             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
//                 ID: {batch.id} • {batch.dept_name || 'Departmental Batch'}
//             </p>
//           </div>
//           <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase ${isCompleted ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
//             {isCompleted ? <CheckCircle2 size={12}/> : <Clock size={12}/>}
//             {isCompleted ? 'Completed' : 'Active'}
//           </div>
//         </div>
//       </div>

//       {/* --- NEW SECTION: SUBJECT PREVIEW --- */}
//       <div className="px-6 py-3 flex items-center justify-between bg-blue-50/50 border-y border-slate-100">
//         <div className="flex items-center gap-2">
//           <BookOpen size={14} className="text-blue-600" />
//           <span className="text-[10px] font-black text-slate-700 uppercase">
//             Curriculum: {linkedSubjects.length} Subjects
//           </span>
//         </div>
//         <div className="flex -space-x-1.5">
//            {linkedSubjects.slice(0, 3).map((s, i) => (
//              <div key={i} title={s.name} className="w-5 h-5 rounded-full bg-slate-900 border-2 border-white flex items-center justify-center text-[7px] text-white font-bold uppercase">
//                {s.code.substring(0, 2)}
//              </div>
//            ))}
//            {linkedSubjects.length > 3 && (
//              <div className="w-5 h-5 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[7px] text-slate-600 font-bold">
//                +{linkedSubjects.length - 3}
//              </div>
//            )}
//         </div>
//       </div>

//       {/* --- SECTION 2: ACADEMIC PROGRESS --- */}
//       <div className="px-6 py-5 bg-white">
//         <div className="flex justify-between items-center mb-3">
//           <div className="flex items-center gap-2">
//             <TrendingUp size={14} className="text-blue-600" />
//             <span className="text-[11px] font-black text-slate-700 uppercase">Semester {currentSem} / {totalSem}</span>
//           </div>
//           <span className="text-[11px] font-black text-blue-600">{progress}%</span>
//         </div>
        
//         <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
//           <div 
//             className={`h-full rounded-full transition-all duration-1000 ${isCompleted ? 'bg-green-500' : 'bg-blue-600'}`}
//             style={{ width: `${progress}%` }}
//           />
//         </div>

//         <div className="mt-2 flex items-center gap-2">
//           <div className={`w-1.5 h-1.5 rounded-full ${isCompleted ? 'bg-green-500' : 'bg-orange-500'}`} />
//           <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tight">
//             {isCompleted ? 'Final Results Published' : `Academic Session: Sem ${currentSem}`}
//           </span>
//         </div>
//       </div>

//       {/* --- SECTION 3: STUDENT SUMMARY --- */}
//       <div className="p-6 pt-0 flex flex-col gap-6">
//         <div className="flex justify-between items-center">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-600">
//               <Users size={20} />
//             </div>
//             <div>
//               <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">Total</p>
//               <p className="text-lg font-black text-slate-900">{batchStudents.length}</p>
//             </div>
//           </div>
//           <div className="text-right">
//              <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">Active</p>
//              <p className="text-lg font-black text-green-600">{activeStudents}</p>
//           </div>
//         </div>

//         {/* --- ACTIONS --- */}
//         <div className="flex gap-2">
//           <button 
//             onClick={() => onSelect(batch)}
//             className="flex-1 bg-slate-900 text-white py-2.5 rounded-2xl font-bold text-xs hover:bg-blue-700 transition-all shadow-md flex items-center justify-center gap-2"
//           >
//             Manage Batch <ChevronRight size={10} />
//           </button>
          
//           {!isCompleted && (
//             <button 
//               onClick={handlePromote}
//               className="px-4 bg-white border-2 border-slate-200 text-slate-700 rounded-2xl font-bold text-xs hover:border-blue-600 hover:text-blue-600 transition-all"
//             >
//               Promote
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }



import React from 'react';
import { Users, GraduationCap, CheckCircle2, Clock, ChevronRight, TrendingUp, BookOpen, AlertCircle } from 'lucide-react';

export default function StudentBatchCard({ batch, onSelect, students = [], subjects = [], updateData, allMarks = [] }) {
  // 1. Logic for Progress
  const currentSem = Number(batch.semester) || 1;
  const totalSem = parseInt(batch.batch.includes('2024-2027') ? 6 : 8); 
  const progress = Math.min(Math.round((currentSem / totalSem) * 100), 100);
  
  // 2. Logic for Student Summary
  const batchStudents = students.filter(s => String(s.batchId) === String(batch.id));
  const activeStudents = batchStudents.filter(s => s.status === 'Active').length;

  // 3. Logic for Subject Link
  const linkedSubjects = (subjects || []).filter(sub => 
    String(sub.courseId || sub.dept_id) === String(batch.courseId || batch.dept_id) && 
    Number(sub.semester) === currentSem
  );

  const isCompleted = currentSem >= totalSem;

  // --- ADDED LOGIC FOR RESULT VALIDATION ---
  const handlePromote = (e) => {
    e.stopPropagation();
    if (isCompleted) return;

    // Check if every student in this batch has marks for the current semester
    // Note: This assumes 'allMarks' is passed as a prop containing results data
    const studentsWithMissingResults = batchStudents.filter(student => {
      // Find if this student has any marks recorded for the current semester
      const hasResults = allMarks.some(m => 
        String(m.studentId || m.student_id) === String(student.id) && 
        Number(m.semester) === currentSem
      );
      return !hasResults;
    });

    if (studentsWithMissingResults.length > 0) {
      alert(`Cannot promote: ${studentsWithMissingResults.length} student(s) do not have their Semester ${currentSem} results filled yet.`);
      return;
    }
    
    if (window.confirm(`All results verified. Promote batch ${batch.batch} to Semester ${currentSem + 1}?`)) {
      updateData({
        action: 'edit',
        batch: { ...batch, semester: currentSem + 1 }
      });
    }
  };

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
                ID: {batch.id} • {batch.dept_name || 'Departmental Batch'}
            </p>
          </div>
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase ${isCompleted ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
            {isCompleted ? <CheckCircle2 size={12}/> : <Clock size={12}/>}
            {isCompleted ? 'Completed' : 'Active'}
          </div>
        </div>
      </div>

      {/* --- SECTION: SUBJECT PREVIEW --- */}
      <div className="px-6 py-3 flex items-center justify-between bg-blue-50/50 border-y border-slate-100">
        <div className="flex items-center gap-2">
          <BookOpen size={14} className="text-blue-600" />
          <span className="text-[10px] font-black text-slate-700 uppercase">
            Curriculum: {linkedSubjects.length} Subjects
          </span>
        </div>
        <div className="flex -space-x-1.5">
            {linkedSubjects.slice(0, 3).map((s, i) => (
              <div key={i} title={s.name} className="w-5 h-5 rounded-full bg-slate-900 border-2 border-white flex items-center justify-center text-[7px] text-white font-bold uppercase">
                {s.code.substring(0, 2)}
              </div>
            ))}
            {linkedSubjects.length > 3 && (
              <div className="w-5 h-5 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[7px] text-slate-600 font-bold">
                +{linkedSubjects.length - 3}
              </div>
            )}
        </div>
      </div>

      {/* --- SECTION 2: ACADEMIC PROGRESS --- */}
      <div className="px-6 py-5 bg-white">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp size={14} className="text-blue-600" />
            <span className="text-[11px] font-black text-slate-700 uppercase">Semester {currentSem} / {totalSem}</span>
          </div>
          <span className="text-[11px] font-black text-blue-600">{progress}%</span>
        </div>
        
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
          <div 
            className={`h-full rounded-full transition-all duration-1000 ${isCompleted ? 'bg-green-500' : 'bg-blue-600'}`}
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-2 flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${isCompleted ? 'bg-green-500' : 'bg-orange-500'}`} />
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tight">
            {isCompleted ? 'Final Results Published' : `Academic Session: Sem ${currentSem}`}
          </span>
        </div>
      </div>

      {/* --- SECTION 3: STUDENT SUMMARY --- */}
      <div className="p-6 pt-0 flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-600">
              <Users size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">Total</p>
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
            className="flex-1 bg-slate-900 text-white py-2.5 rounded-2xl font-bold text-xs hover:bg-blue-700 transition-all shadow-md flex items-center justify-center gap-2"
          >
            Manage Batch <ChevronRight size={10} />
          </button>
          
          {!isCompleted && (
            <button 
              onClick={handlePromote}
              className="px-4 bg-white border-2 border-slate-200 text-slate-700 rounded-2xl font-bold text-xs hover:border-blue-600 hover:text-blue-600 transition-all"
            >
              Promote
            </button>
          )}
        </div>
      </div>
    </div>
  );
}