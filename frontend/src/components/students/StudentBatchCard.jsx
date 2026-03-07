// // // import React from 'react';
// // // import { Users, GraduationCap, CheckCircle2, Clock, ChevronRight, TrendingUp, BookOpen, AlertCircle } from 'lucide-react';

// // // export default function StudentBatchCard({ batch, onSelect, students = [], subjects = [], updateData, allMarks = [] }) {
// // //   // 1. Logic for Progress
// // //   const currentSem = Number(batch.semester) || 1;
// // //   const totalSem = parseInt(batch.batch.includes('2024-2027') ? 6 : 8); 
// // //   const progress = Math.min(Math.round((currentSem / totalSem) * 100), 100);
  
// // //   // 2. Logic for Student Summary
// // //   const batchStudents = students.filter(s => String(s.batchId) === String(batch.id));
// // //   const activeStudents = batchStudents.filter(s => s.status === 'Active').length;

// // //   // 3. Logic for Subject Link
// // //   const linkedSubjects = (subjects || []).filter(sub => 
// // //     String(sub.courseId || sub.dept_id) === String(batch.courseId || batch.dept_id) && 
// // //     Number(sub.semester) === currentSem
// // //   );

// // //   const isCompleted = currentSem >= totalSem;

// // //   // --- ADDED LOGIC FOR RESULT VALIDATION ---
// // //   const handlePromote = (e) => {
// // //     e.stopPropagation();
// // //     if (isCompleted) return;

// // //     // Check if every student in this batch has marks for the current semester
// // //     // Note: This assumes 'allMarks' is passed as a prop containing results data
// // //     const studentsWithMissingResults = batchStudents.filter(student => {
// // //       // Find if this student has any marks recorded for the current semester
// // //       const hasResults = allMarks.some(m => 
// // //         String(m.studentId || m.student_id) === String(student.id) && 
// // //         Number(m.semester) === currentSem
// // //       );
// // //       return !hasResults;
// // //     });

// // //     if (studentsWithMissingResults.length > 0) {
// // //       alert(`Cannot promote: ${studentsWithMissingResults.length} student(s) do not have their Semester ${currentSem} results filled yet.`);
// // //       return;
// // //     }
    
// // //     if (window.confirm(`All results verified. Promote batch ${batch.batch} to Semester ${currentSem + 1}?`)) {
// // //       updateData({
// // //         action: 'edit',
// // //         batch: { ...batch, semester: currentSem + 1 }
// // //       });
// // //     }
// // //   };

// // //   return (
// // //     <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden">
      
// // //       {/* --- SECTION 1: IDENTITY --- */}
// // //       <div className="p-6">
// // //         <div className="flex justify-between items-start mb-4">
// // //           <div className="space-y-1">
// // //             <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter">
// // //               {batch.dept}
// // //             </span>
// // //             <h3 className="text-2xl font-black text-slate-900 leading-tight mt-2">
// // //               {batch.batch}
// // //             </h3>
// // //             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
// // //                 ID: {batch.id} • {batch.dept_name || 'Departmental Batch'}
// // //             </p>
// // //           </div>
// // //           <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase ${isCompleted ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
// // //             {isCompleted ? <CheckCircle2 size={12}/> : <Clock size={12}/>}
// // //             {isCompleted ? 'Completed' : 'Active'}
// // //           </div>
// // //         </div>
// // //       </div>

// // //       {/* --- SECTION: SUBJECT PREVIEW --- */}
// // //       <div className="px-6 py-3 flex items-center justify-between bg-blue-50/50 border-y border-slate-100">
// // //         <div className="flex items-center gap-2">
// // //           <BookOpen size={14} className="text-blue-600" />
// // //           <span className="text-[10px] font-black text-slate-700 uppercase">
// // //             Curriculum: {linkedSubjects.length} Subjects
// // //           </span>
// // //         </div>
// // //         <div className="flex -space-x-1.5">
// // //             {linkedSubjects.slice(0, 3).map((s, i) => (
// // //               <div key={i} title={s.name} className="w-5 h-5 rounded-full bg-slate-900 border-2 border-white flex items-center justify-center text-[7px] text-white font-bold uppercase">
// // //                 {s.code.substring(0, 2)}
// // //               </div>
// // //             ))}
// // //             {linkedSubjects.length > 3 && (
// // //               <div className="w-5 h-5 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[7px] text-slate-600 font-bold">
// // //                 +{linkedSubjects.length - 3}
// // //               </div>
// // //             )}
// // //         </div>
// // //       </div>

// // //       {/* --- SECTION 2: ACADEMIC PROGRESS --- */}
// // //       <div className="px-6 py-5 bg-white">
// // //         <div className="flex justify-between items-center mb-3">
// // //           <div className="flex items-center gap-2">
// // //             <TrendingUp size={14} className="text-blue-600" />
// // //             <span className="text-[11px] font-black text-slate-700 uppercase">Semester {currentSem} / {totalSem}</span>
// // //           </div>
// // //           <span className="text-[11px] font-black text-blue-600">{progress}%</span>
// // //         </div>
        
// // //         <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
// // //           <div 
// // //             className={`h-full rounded-full transition-all duration-1000 ${isCompleted ? 'bg-green-500' : 'bg-blue-600'}`}
// // //             style={{ width: `${progress}%` }}
// // //           />
// // //         </div>

// // //         <div className="mt-2 flex items-center gap-2">
// // //           <div className={`w-1.5 h-1.5 rounded-full ${isCompleted ? 'bg-green-500' : 'bg-orange-500'}`} />
// // //           <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tight">
// // //             {isCompleted ? 'Final Results Published' : `Academic Session: Sem ${currentSem}`}
// // //           </span>
// // //         </div>
// // //       </div>

// // //       {/* --- SECTION 3: STUDENT SUMMARY --- */}
// // //       <div className="p-6 pt-0 flex flex-col gap-6">
// // //         <div className="flex justify-between items-center">
// // //           <div className="flex items-center gap-3">
// // //             <div className="w-10 h-10 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-600">
// // //               <Users size={20} />
// // //             </div>
// // //             <div>
// // //               <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">Total</p>
// // //               <p className="text-lg font-black text-slate-900">{batchStudents.length}</p>
// // //             </div>
// // //           </div>
// // //           <div className="text-right">
// // //               <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">Active</p>
// // //               <p className="text-lg font-black text-green-600">{activeStudents}</p>
// // //           </div>
// // //         </div>

// // //         {/* --- ACTIONS --- */}
// // //         <div className="flex gap-2">
// // //           <button 
// // //             onClick={() => onSelect(batch)}
// // //             className="flex-1 bg-slate-900 text-white py-2.5 rounded-2xl font-bold text-xs hover:bg-blue-700 transition-all shadow-md flex items-center justify-center gap-2"
// // //           >
// // //             Manage Batch <ChevronRight size={10} />
// // //           </button>
          
// // //           {!isCompleted && (
// // //             <button 
// // //               onClick={handlePromote}
// // //               className="px-4 bg-white border-2 border-slate-200 text-slate-700 rounded-2xl font-bold text-xs hover:border-blue-600 hover:text-blue-600 transition-all"
// // //             >
// // //               Promote
// // //             </button>
// // //           )}
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // }






// // // import React, { useState } from 'react';
// // // import { Users, GraduationCap, CheckCircle2, Clock, ChevronRight, TrendingUp, BookOpen, Edit3, Trash2, Save, X } from 'lucide-react';

// // // export default function StudentBatchCard({ batch, onSelect, students = [], subjects = [], updateData, allMarks = [] }) {
// // //   // --- STATE FOR CRUD OPERATIONS ---
// // //   const [isEditing, setIsEditing] = useState(false);
// // //   const [editForm, setEditForm] = useState({ batch: batch.batch, dept: batch.dept });

// // //   // 1. Logic for Progress
// // //   const currentSem = Number(batch.semester) || 1;
// // //   const totalSem = parseInt(batch.batch.includes('2024-2027') ? 6 : 8);
// // //   const progress = Math.min(Math.round((currentSem / totalSem) * 100), 100);

// // //   const batchStudents = students.filter(s => String(s.batchId) === String(batch.id));
// // //   const activeStudents = batchStudents.filter(s => s.status === 'Active').length;

// // //   const linkedSubjects = (subjects || []).filter(sub =>
// // //     String(sub.courseId || sub.dept_id) === String(batch.courseId || batch.dept_id) &&
// // //     Number(sub.semester) === currentSem
// // //   );

// // //   const isCompleted = currentSem >= totalSem;

// // //   // --- CRUD: UPDATE (SAVE) ---
// // //   const handleUpdate = (e) => {
// // //     e.stopPropagation();
// // //     updateData({
// // //       action: 'edit',
// // //       batch: { ...batch, batch: editForm.batch, dept: editForm.dept }
// // //     });
// // //     setIsEditing(false);
// // //   };

// // //   // --- CRUD: DELETE ---
// // //   const handleDelete = (e) => {
// // //     e.stopPropagation();
// // //     if (batchStudents.length > 0) {
// // //       alert(`Cannot delete: This batch has ${batchStudents.length} students enrolled.`);
// // //       return;
// // //     }
// // //     if (window.confirm(`Are you sure you want to delete Batch ${batch.batch}? This cannot be undone.`)) {
// // //       updateData({ action: 'delete', id: batch.id });
// // //     }
// // //   };

// // //   // --- PROMOTE LOGIC ---
// // //   const handlePromote = (e) => {
// // //     e.stopPropagation();
// // //     if (isCompleted) return;

// // //     const studentsWithMissingResults = batchStudents.filter(student => {
// // //       const hasResults = allMarks.some(m =>
// // //         String(m.studentId || m.student_id) === String(student.id) &&
// // //         Number(m.semester) === currentSem
// // //       );
// // //       return !hasResults;
// // //     });

// // //     if (studentsWithMissingResults.length > 0) {
// // //       alert(`Cannot promote: ${studentsWithMissingResults.length} student(s) do not have results for Semester ${currentSem}.`);
// // //       return;
// // //     }

// // //     if (window.confirm(`Promote batch ${batch.batch} to Semester ${currentSem + 1}?`)) {
// // //       updateData({
// // //         action: 'edit',
// // //         batch: { ...batch, semester: currentSem + 1 }
// // //       });
// // //     }
// // //   };

// // //   return (
// // //     <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden group">
      
// // //       {/* --- SECTION 1: IDENTITY & CRUD ACTIONS --- */}
// // //       <div className="p-6">
// // //         <div className="flex justify-between items-start mb-4">
// // //           <div className="space-y-1 flex-1">
// // //             {isEditing ? (
// // //               <div className="flex flex-col gap-2 pr-4">
// // //                 <input 
// // //                   className="text-xs font-bold border rounded px-2 py-1 outline-blue-500"
// // //                   value={editForm.dept}
// // //                   onChange={e => setEditForm({...editForm, dept: e.target.value})}
// // //                 />
// // //                 <input 
// // //                   className="text-lg font-black border rounded px-2 py-1 outline-blue-500"
// // //                   value={editForm.batch}
// // //                   onChange={e => setEditForm({...editForm, batch: e.target.value})}
// // //                 />
// // //               </div>
// // //             ) : (
// // //               <>
// // //                 <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter">
// // //                   {batch.dept}
// // //                 </span>
// // //                 <h3 className="text-2xl font-black text-slate-900 leading-tight mt-2">
// // //                   {batch.batch}
// // //                 </h3>
// // //               </>
// // //             )}
// // //             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
// // //               ID: {batch.id} • {batch.dept_name || 'Departmental Batch'}
// // //             </p>
// // //           </div>

// // //           <div className="flex flex-col items-end gap-2">
// // //              {/* CRUD ACTION BUTTONS */}
// // //             <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
// // //               {isEditing ? (
// // //                 <>
// // //                   <button onClick={handleUpdate} className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-colors"><Save size={14}/></button>
// // //                   <button onClick={() => setIsEditing(false)} className="p-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-600 hover:text-white transition-colors"><X size={14}/></button>
// // //                 </>
// // //               ) : (
// // //                 <>
// // //                   <button onClick={(e) => { e.stopPropagation(); setIsEditing(true); }} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors"><Edit3 size={14}/></button>
// // //                   <button onClick={handleDelete} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors"><Trash2 size={14}/></button>
// // //                 </>
// // //               )}
// // //             </div>
            
// // //             <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase ${isCompleted ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
// // //               {isCompleted ? <CheckCircle2 size={12}/> : <Clock size={12}/>}
// // //               {isCompleted ? 'Completed' : 'Active'}
// // //             </div>
// // //           </div>
// // //         </div>
// // //       </div>

// // //       {/* --- SUBJECT PREVIEW --- */}
// // //       <div className="px-6 py-3 flex items-center justify-between bg-blue-50/50 border-y border-slate-100">
// // //         <div className="flex items-center gap-2">
// // //           <BookOpen size={14} className="text-blue-600" />
// // //           <span className="text-[10px] font-black text-slate-700 uppercase">Curriculum: {linkedSubjects.length} Subjects</span>
// // //         </div>
// // //         <div className="flex -space-x-1.5">
// // //             {linkedSubjects.slice(0, 3).map((s, i) => (
// // //               <div key={i} title={s.name} className="w-5 h-5 rounded-full bg-slate-900 border-2 border-white flex items-center justify-center text-[7px] text-white font-bold uppercase">
// // //                 {s.code.substring(0, 2)}
// // //               </div>
// // //             ))}
// // //         </div>
// // //       </div>

// // //       {/* --- ACADEMIC PROGRESS --- */}
// // //       <div className="px-6 py-5 bg-white">
// // //         <div className="flex justify-between items-center mb-3">
// // //           <div className="flex items-center gap-2">
// // //             <TrendingUp size={14} className="text-blue-600" />
// // //             <span className="text-[11px] font-black text-slate-700 uppercase">Semester {currentSem} / {totalSem}</span>
// // //           </div>
// // //           <span className="text-[11px] font-black text-blue-600">{progress}%</span>
// // //         </div>
// // //         <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
// // //           <div className={`h-full rounded-full transition-all duration-1000 ${isCompleted ? 'bg-green-500' : 'bg-blue-600'}`} style={{ width: `${progress}%` }} />
// // //         </div>
// // //       </div>

// // //       {/* --- SUMMARY & ACTIONS --- */}
// // //       <div className="p-6 pt-0 flex flex-col gap-6">
// // //         <div className="flex justify-between items-center">
// // //           <div className="flex items-center gap-3">
// // //             <div className="w-10 h-10 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-600"><Users size={20} /></div>
// // //             <div>
// // //               <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">Total</p>
// // //               <p className="text-lg font-black text-slate-900">{batchStudents.length}</p>
// // //             </div>
// // //           </div>
// // //           <div className="text-right">
// // //               <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">Active</p>
// // //               <p className="text-lg font-black text-green-600">{activeStudents}</p>
// // //           </div>
// // //         </div>

// // //         <div className="flex gap-2">
// // //           <button 
// // //             onClick={() => onSelect(batch)}
// // //             className="flex-1 bg-slate-900 text-white py-2.5 rounded-2xl font-bold text-xs hover:bg-blue-700 transition-all shadow-md flex items-center justify-center gap-2"
// // //           >
// // //             Manage Batch <ChevronRight size={10} />
// // //           </button>
          
// // //           {!isCompleted && !isEditing && (
// // //             <button 
// // //               onClick={handlePromote}
// // //               className="px-4 bg-white border-2 border-slate-200 text-slate-700 rounded-2xl font-bold text-xs hover:border-blue-600 hover:text-blue-600 transition-all"
// // //             >
// // //               Promote
// // //             </button>
// // //           )}
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // }



// // import React from 'react';
// // import { Users, CheckCircle2, Clock, ChevronRight, TrendingUp, BookOpen, Trash2 } from 'lucide-react';

// // export default function StudentBatchCard({ batch, onSelect, students = [], subjects = [], updateData, allMarks = [] }) {
  
// //   // 1. Logic for Progress
// //   const currentSem = Number(batch.semester) || 1;
// //   const totalSem = parseInt(batch.batch.includes('2024-2027') ? 6 : 8);
// //   const progress = Math.min(Math.round((currentSem / totalSem) * 100), 100);

// //   const batchStudents = students.filter(s => String(s.batchId) === String(batch.id));
// //   const activeStudents = batchStudents.filter(s => s.status === 'Active').length;

// //   const linkedSubjects = (subjects || []).filter(sub =>
// //     String(sub.courseId || sub.dept_id) === String(batch.courseId || batch.dept_id) &&
// //     Number(sub.semester) === currentSem
// //   );

// //   const isCompleted = currentSem >= totalSem;

// //   // --- CRUD: DELETE ---
// //   const handleDelete = (e) => {
// //     e.stopPropagation();
// //     if (batchStudents.length > 0) {
// //       alert(`Cannot delete: This batch has ${batchStudents.length} students enrolled.`);
// //       return;
// //     }
// //     if (window.confirm(`Are you sure you want to delete Batch ${batch.batch}?`)) {
// //       updateData({ action: 'delete', id: batch.id });
// //     }
// //   };

// //   // --- PROMOTE LOGIC ---
// //   const handlePromote = (e) => {
// //     e.stopPropagation();
// //     if (isCompleted) return;

// //     const studentsWithMissingResults = batchStudents.filter(student => {
// //       const hasResults = allMarks.some(m =>
// //         String(m.studentId || m.student_id) === String(student.id) &&
// //         Number(m.semester) === currentSem
// //       );
// //       return !hasResults;
// //     });

// //     if (studentsWithMissingResults.length > 0) {
// //       alert(`Cannot promote: ${studentsWithMissingResults.length} student(s) do not have results for Semester ${currentSem}.`);
// //       return;
// //     }

// //     if (window.confirm(`Promote batch ${batch.batch} to Semester ${currentSem + 1}?`)) {
// //       updateData({
// //         action: 'edit',
// //         batch: { ...batch, semester: currentSem + 1 }
// //       });
// //     }
// //   };

// //   return (
// //     <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden group">
      
// //       {/* --- SECTION 1: IDENTITY --- */}
// //       <div className="p-6">
// //         <div className="flex justify-between items-start mb-4">
// //           <div className="space-y-1 flex-1">
// //             <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter">
// //               {batch.dept}
// //             </span>
// //             <h3 className="text-2xl font-black text-slate-900 leading-tight mt-2">
// //               {batch.batch}
// //             </h3>
// //             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
// //               ID: {batch.id} • {batch.dept_name || 'Departmental Batch'}
// //             </p>
// //           </div>

// //           <div className="flex flex-col items-end gap-2">
// //             {/* DELETE ACTION BUTTON */}
// //             <button onClick={handleDelete} className="opacity-0 group-hover:opacity-100 p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all">
// //               <Trash2 size={14}/>
// //             </button>
            
// //             <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase ${isCompleted ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
// //               {isCompleted ? <CheckCircle2 size={12}/> : <Clock size={12}/>}
// //               {isCompleted ? 'Completed' : 'Active'}
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* --- SUBJECT PREVIEW --- */}
// //       <div className="px-6 py-3 flex items-center justify-between bg-blue-50/50 border-y border-slate-100">
// //         <div className="flex items-center gap-2">
// //           <BookOpen size={14} className="text-blue-600" />
// //           <span className="text-[10px] font-black text-slate-700 uppercase">Curriculum: {linkedSubjects.length} Subjects</span>
// //         </div>
// //         <div className="flex -space-x-1.5">
// //             {linkedSubjects.slice(0, 3).map((s, i) => (
// //               <div key={i} title={s.name} className="w-5 h-5 rounded-full bg-slate-900 border-2 border-white flex items-center justify-center text-[7px] text-white font-bold uppercase">
// //                 {s.code.substring(0, 2)}
// //               </div>
// //             ))}
// //         </div>
// //       </div>

// //       {/* --- ACADEMIC PROGRESS --- */}
// //       <div className="px-6 py-5 bg-white">
// //         <div className="flex justify-between items-center mb-3">
// //           <div className="flex items-center gap-2">
// //             <TrendingUp size={14} className="text-blue-600" />
// //             <span className="text-[11px] font-black text-slate-700 uppercase">Semester {currentSem} / {totalSem}</span>
// //           </div>
// //           <span className="text-[11px] font-black text-blue-600">{progress}%</span>
// //         </div>
// //         <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
// //           <div className={`h-full rounded-full transition-all duration-1000 ${isCompleted ? 'bg-green-500' : 'bg-blue-600'}`} style={{ width: `${progress}%` }} />
// //         </div>
// //       </div>

// //       {/* --- SUMMARY & ACTIONS --- */}
// //       <div className="p-6 pt-0 flex flex-col gap-6">
// //         <div className="flex justify-between items-center">
// //           <div className="flex items-center gap-3">
// //             <div className="w-10 h-10 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-600"><Users size={20} /></div>
// //             <div>
// //               <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">Total</p>
// //               <p className="text-lg font-black text-slate-900">{batchStudents.length}</p>
// //             </div>
// //           </div>
// //           <div className="text-right">
// //               <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">Active</p>
// //               <p className="text-lg font-black text-green-600">{activeStudents}</p>
// //           </div>
// //         </div>

// //         <div className="flex gap-2">
// //           <button 
// //             onClick={() => onSelect(batch)}
// //             className="flex-1 bg-slate-900 text-white py-2.5 rounded-2xl font-bold text-xs hover:bg-blue-700 transition-all shadow-md flex items-center justify-center gap-2"
// //           >
// //             Manage Batch <ChevronRight size={10} />
// //           </button>
          
// //           {!isCompleted && (
// //             <button 
// //               onClick={handlePromote}
// //               className="px-4 bg-white border-2 border-slate-200 text-slate-700 rounded-2xl font-bold text-xs hover:border-blue-600 hover:text-blue-600 transition-all"
// //             >
// //               Promote
// //             </button>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }





// import React from 'react';
// import { Users, CheckCircle2, Clock, ChevronRight, TrendingUp, BookOpen, Trash2 } from 'lucide-react';

// export default function StudentBatchCard({
//   batch,
//   onSelect,
//   students = [],
//   subjects = [],
//   updateData,
//   allMarks = []
// }) {
  

//   /* ===============================
//      0️⃣ SAFE DEPARTMENT NAME FIX
//   =============================== */

//   const departmentName =
//     batch.deptName ||        // ✅ from JOIN (correct one)
//     batch.dept_name ||       // fallback (old backend)
//     batch.dept ||            // fallback (very old structure)
//     'No Department';

//   /* ===============================
//      1️⃣ SEMESTER & PROGRESS LOGIC
//   =============================== */

//   const currentSem = Number(batch.semester) || 1;
//   const totalSem = Number(batch.total_semesters) || 6;

//   const progress = Math.min(
//     Math.round((currentSem / totalSem) * 100),
//     100
//   );

//   const isCompleted = currentSem >= totalSem;

//   /* ===============================
//      2️⃣ STUDENT CALCULATIONS
//   =============================== */

//   const batchStudents = students.filter(
//     s => String(s.batchId || s.batch_id) === String(batch.id)
//   );

//   const activeStudents = batchStudents.filter(
//     s => s.status === 'Active'
//   ).length;

//   /* ===============================
//      3️⃣ SUBJECT LINKING (RELATIONAL)
//   =============================== */

//   // const linkedSubjects = subjects.filter(
//   //   sub =>
//   //     String(sub.dept_id) === String(batch.dept_id) &&
//   //     Number(sub.semester) === currentSem
//   // );


//   /* ===============================
//    3️⃣ SUBJECT LINKING (FIXED SAFE VERSION)
// ================================ */

// const linkedSubjects = subjects.filter(sub => {
//   const subjectDeptId =
//     sub.dept_id ??
//     sub.deptId ??
//     sub.courseId ??
//     null;

//   const batchDeptId =
//     batch.dept_id ??
//     batch.deptId ??
//     batch.courseId ??
//     null;

//   return (
//     String(subjectDeptId) === String(batchDeptId) &&
//     Number(sub.semester) === currentSem
//   );
// });

//   /* ===============================
//      4️⃣ DELETE LOGIC
//   =============================== */

//   const handleDelete = (e) => {
//     e.stopPropagation();

//     if (batchStudents.length > 0) {
//       alert(`Cannot delete: This batch has ${batchStudents.length} students enrolled.`);
//       return;
//     }

//     if (window.confirm(`Are you sure you want to delete Batch ${batch.batch}?`)) {
//       updateData({ action: 'delete', id: batch.id });
//     }
//   };

//   /* ===============================
//      5️⃣ PROMOTE LOGIC
//   =============================== */

//   // const handlePromote = (e) => {
//   //   e.stopPropagation();
//   //   if (isCompleted) return;

//   //   const studentsWithMissingResults = batchStudents.filter(student => {
//   //     const hasResults = allMarks.some(m =>
//   //       String(m.student_id || m.studentId) === String(student.id) &&
//   //       Number(m.semester) === currentSem
//   //     );
//   //     return !hasResults;
//   //   });

//   //   if (studentsWithMissingResults.length > 0) {
//   //     alert(
//   //       `Cannot promote: ${studentsWithMissingResults.length} student(s) do not have results for Semester ${currentSem}.`
//   //     );
//   //     return;
//   //   }

//   //   if (window.confirm(`Promote batch ${batch.batch} to Semester ${currentSem + 1}?`)) {
//   //     updateData({
//   //       action: 'edit',
//   //       batch: { ...batch, semester: currentSem + 1 }
//   //     });
//   //   }
//   // };


//  /* ===============================
//       5️⃣ PROMOTE LOGIC
//   =============================== */

//   const handlePromote = (e) => {
//     e.stopPropagation();
//     if (isCompleted) return;

//     // 1. Identify students missing results
//     const studentsWithMissingResults = batchStudents.filter(student => {
//       // Filter marks specifically for this student and this semester
//       const resultsForStudent = allMarks.filter(m => 
//         String(m.student_id || m.studentId) === String(student.id) &&
//         Number(m.semester || m.semester_id) === currentSem
//       );

//       // A student is only ready if they have marks for EVERY linked subject
//       // In your case: resultsForStudent.length (2) < linkedSubjects.length (2) is FALSE
//       return resultsForStudent.length < linkedSubjects.length;
//     });

//     // 2. Alert if data is incomplete
//     if (studentsWithMissingResults.length > 0) {
//       alert(
//         `Cannot promote: ${studentsWithMissingResults.length} student(s) are missing results for one or more subjects in Semester ${currentSem}.`
//       );
//       return;
//     }

//     // 3. Execute Update
//     if (window.confirm(`Promote batch ${batch.batch} to Semester ${currentSem + 1}?`)) {
//       updateData({
//         action: 'edit',
//         // This increments the semester in the database
//         batch: { ...batch, semester: currentSem + 1 }
//       });
//     }
//   };


//   /* ===============================
//      6️⃣ UI (UNCHANGED)
//   =============================== */

//   return (
//     <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden group">

//       {/* -------- HEADER -------- */}
//       <div className="p-6">
//         <div className="flex justify-between items-start mb-4">

//           <div className="space-y-1 flex-1">
//             <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter">
//               {departmentName}
//             </span>

//             <h3 className="text-2xl font-black text-slate-900 leading-tight mt-2">
//               {batch.batch}
//             </h3>

//             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
//               ID: {batch.id}
//             </p>
//           </div>

//           <div className="flex flex-col items-end gap-2">

//             <button
//               onClick={handleDelete}
//               className="opacity-0 group-hover:opacity-100 p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all"
//             >
//               <Trash2 size={14} />
//             </button>

//             <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase ${
//               isCompleted
//                 ? 'bg-green-100 text-green-600'
//                 : 'bg-amber-100 text-amber-600'
//             }`}>
//               {isCompleted ? <CheckCircle2 size={12} /> : <Clock size={12} />}
//               {isCompleted ? 'Completed' : 'Active'}
//             </div>

//           </div>
//         </div>
//       </div>

//       {/* -------- SUBJECT PREVIEW -------- */}
//       <div className="px-6 py-3 flex items-center justify-between bg-blue-50/50 border-y border-slate-100">
//         <div className="flex items-center gap-2">
//           <BookOpen size={14} className="text-blue-600" />
//           <span className="text-[10px] font-black text-slate-700 uppercase">
//             Curriculum: {linkedSubjects.length} Subjects
//           </span>
//         </div>

//         <div className="flex -space-x-1.5">
//           {linkedSubjects.slice(0, 3).map((s, i) => (
//             <div
//               key={i}
//               title={s.name}
//               className="w-5 h-5 rounded-full bg-slate-900 border-2 border-white flex items-center justify-center text-[7px] text-white font-bold uppercase"
//             >
//               {s.code?.substring(0, 2)}
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* -------- PROGRESS -------- */}
//       <div className="px-6 py-5 bg-white">
//         <div className="flex justify-between items-center mb-3">
//           <div className="flex items-center gap-2">
//             <TrendingUp size={14} className="text-blue-600" />
//             <span className="text-[11px] font-black text-slate-700 uppercase">
//               Semester {currentSem} / {totalSem}
//             </span>
//           </div>

//           <span className="text-[11px] font-black text-blue-600">
//             {progress}%
//           </span>
//         </div>

//         <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
//           <div
//             className={`h-full rounded-full transition-all duration-1000 ${
//               isCompleted ? 'bg-green-500' : 'bg-blue-600'
//             }`}
//             style={{ width: `${progress}%` }}
//           />
//         </div>
//       </div>

//       {/* -------- SUMMARY -------- */}
//       <div className="p-6 pt-0 flex flex-col gap-6">

//         <div className="flex justify-between items-center">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-600">
//               <Users size={20} />
//             </div>
//             <div>
//               <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Total</p>
//               <p className="text-lg font-black text-slate-900">
//                 {batchStudents.length}
//               </p>
//             </div>
//           </div>

//           <div className="text-right">
//             <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Active</p>
//             <p className="text-lg font-black text-green-600">
//               {activeStudents}
//             </p>
//           </div>
//         </div>

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
import { Users, CheckCircle2, Clock, ChevronRight, TrendingUp, BookOpen, Trash2 } from 'lucide-react';

export default function StudentBatchCard({
  batch,
  onSelect,
  students = [],
  subjects = [],
  updateData,
  allMarks = []
}) {

  /* ===============================
      0️⃣ SAFE DEPARTMENT NAME FIX
  =============================== */
  const departmentName =
    batch.deptName ||        // from JOIN
    batch.dept_name ||       // fallback
    batch.dept ||            // fallback
    'No Department';

  /* ===============================
      1️⃣ SEMESTER & PROGRESS LOGIC
  =============================== */
  const currentSem = Number(batch.semester) || 1;
  const totalSem = Number(batch.total_semesters) || 6;

  const progress = Math.min(
    Math.round((currentSem / totalSem) * 100),
    100
  );

  const isCompleted = currentSem >= totalSem;

  /* ===============================
      2️⃣ STUDENT CALCULATIONS
  =============================== */
  const batchStudents = students.filter(
    s => String(s.batchId || s.batch_id) === String(batch.id)
  );

  const activeStudents = batchStudents.filter(
    s => s.status === 'Active'
  ).length;

  /* ===============================
      3️⃣ SUBJECT LINKING (RELATIONAL)
  =============================== */
  const linkedSubjects = subjects.filter(sub => {
    const subjectDeptId = sub.dept_id ?? sub.deptId ?? sub.courseId ?? null;
    const batchDeptId = batch.dept_id ?? batch.deptId ?? batch.courseId ?? null;

    return (
      String(subjectDeptId) === String(batchDeptId) &&
      Number(sub.semester) === currentSem
    );
  });

  /* ===============================
      4️⃣ DELETE LOGIC
  =============================== */
  const handleDelete = (e) => {
    e.stopPropagation();

    if (batchStudents.length > 0) {
      alert(`Cannot delete: This batch has ${batchStudents.length} students enrolled.`);
      return;
    }

    if (window.confirm(`Are you sure you want to delete Batch ${batch.batch}?`)) {
      updateData({ action: 'delete', id: batch.id });
    }
  };

  // /* ===============================
  //     5️⃣ PROMOTE LOGIC (FINAL STABLE)
  // =============================== */
  // const handlePromote = (e) => {
  //   e.stopPropagation();
  //   if (isCompleted) return;

  //   // 1. Identify students missing results
  //   const studentsWithMissingResults = batchStudents.filter(student => {
  //     // Find all marks for this student in the current semester
  //     const resultsForStudent = allMarks.filter(m => 
  //       String(m.student_id || m.studentId) === String(student.id) &&
  //       Number(m.semester || m.semester_id) === currentSem
  //     );

  //     // Student is missing results if entries < linked subjects
  //     return resultsForStudent.length < linkedSubjects.length;
  //   });

  //   // 2. Alert if data is incomplete
  //   if (studentsWithMissingResults.length > 0) {
  //     alert(
  //       `Cannot promote: ${studentsWithMissingResults.length} student(s) are missing results for one or more subjects in Semester ${currentSem}.`
  //     );
  //     return;
  //   }

  //   // 3. Confirm and Update Database
  //   if (window.confirm(`Promote batch ${batch.batch} to Semester ${currentSem + 1}?`)) {
  //     updateData({
  //       action: 'edit',
  //       batch: { ...batch, semester: currentSem + 1 }
  //     });
  //   }
  // };


  /* ===============================
      5️⃣ PROMOTE LOGIC (FIXED)
  =============================== */


console.log(`Checking Batch ${batch.id}:`, {
  students: batchStudents.map(s => s.id),
  marksFound: allMarks.filter(m => m.batchId === batch.id && m.semester === currentSem).length,
  expected: batchStudents.length * 5
});
  /* ===============================
      5️⃣ PROMOTE LOGIC (REPAIRED)
  =============================== */
  /* ===============================
      5️⃣ PROMOTE LOGIC (FINAL STABLE)
  =============================== */
//   const handlePromote = (e) => {
//     e.stopPropagation();
//     if (isCompleted) return;

//     const requiredSubjectCount = linkedSubjects.length;

//     if (requiredSubjectCount === 0) {
//       alert("Cannot promote: No subjects linked to this curriculum.");
//       return;
//     }

//     // const studentsWithIncompleteData = batchStudents.filter(student => {
//     //   // Find all marks for THIS student in THIS semester
//     //   const studentMarks = allMarks.filter(m => 
//     //     String(m.student_id || m.studentId) === String(student.id) &&
//     //     Number(m.semester) === currentSem
//     //   );

//     //   // VALIDATION:
//     //   // 1. Must have exactly one row for every subject in the curriculum
//     //   const isMissingRows = studentMarks.length < requiredSubjectCount;

//     //   // 2. Check for NULL or UNDEFINED (Total was never calculated/saved)
//     //   // Note: We EXCLUDE '0' from this check so 0 marks are accepted as valid entries
//     //   const hasNullTotals = studentMarks.some(m => m.total === null || m.total === undefined);
      
//     //   return isMissingRows || hasNullTotals;
//     // });

//     // if (studentsWithIncompleteData.length > 0) {
//     //   alert(
//     //     `Promotion Blocked: ${studentsWithIncompleteData.length} student(s) have missing records.\n\n` +
//     //     `Required: ${requiredSubjectCount} subjects.\n` +
//     //     `Note: Students with 0 marks are accepted, but every subject must have a saved record.`
//     //   );
//     //   return;
//     // }

//     const studentsWithIncompleteData = batchStudents.filter(student => {
//   // Find marks for this student
//   const studentMarks = allMarks.filter(m => 
//     // Use loose equality (==) or force both to String to avoid Type Mismatch
//     String(m.student_id || m.studentId) === String(student.id) &&
//     Number(m.semester) === currentSem
//   );

//   // 1. Check if the number of records matches the curriculum
//   const isMissingRows = studentMarks.length < requiredSubjectCount;

//   // 2. Check for missing 'total' values
//   // We check for null/undefined but allow 0
//   const hasNullTotals = studentMarks.some(m => 
//     m.total === null || 
//     m.total === undefined || 
//     m.total === "" // Handle empty strings from DB
//   );

//   // DEBUGGING: This will tell you exactly who is failing in the Console
//   if (isMissingRows || hasNullTotals) {
//     console.error(`Promotion Blocked for Student: ${student.name}`, {
//       marksFound: studentMarks.length,
//       required: requiredSubjectCount,
//       hasNullTotals: hasNullTotals,
//       actualMarks: studentMarks
//     });
//   }
  
//   return isMissingRows || hasNullTotals;
// });



//     if (window.confirm(`Verify promotion for ${batch.batch} to Semester ${currentSem + 1}?`)) {
//       updateData({
//         action: 'edit',
//         batch: { ...batch, semester: currentSem + 1 }
//       });
//     }
//   };
  
const handlePromote = (e) => {
    e.stopPropagation();
    if (isCompleted) return;

    const requiredSubjectCount = linkedSubjects.length;

    const studentsWithIncompleteData = batchStudents.filter(student => {
        // Use String() on both IDs to ensure a match
        const studentMarks = allMarks.filter(m => 
            String(m.student_id || m.studentId) === String(student.id) &&
            Number(m.semester) === currentSem
        );

        const isMissingRows = studentMarks.length < requiredSubjectCount;
        
        // Ensure we check the correct 'total' column name
        const hasNullTotals = studentMarks.some(m => m.total === null || m.total === undefined);
        
        return isMissingRows || hasNullTotals;
    });

    if (studentsWithIncompleteData.length > 0) {
        alert(`Promotion Blocked: ${studentsWithIncompleteData.length} student(s) have missing records.`);
        return;
    }

    if (window.confirm(`Promote batch ${batch.batch}?`)) {
        updateData({
            action: 'edit',
            batch: { ...batch, semester: currentSem + 1 }
        });
    }
};

/* ===============================
      6️⃣ UI RENDERING
  =============================== */
  return (
    <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden group">

      {/* HEADER */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="space-y-1 flex-1">
            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter">
              {departmentName}
            </span>
            <h3 className="text-2xl font-black text-slate-900 leading-tight mt-2">
              {batch.batch}
            </h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              ID: {batch.id}
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <button
              onClick={handleDelete}
              className="opacity-0 group-hover:opacity-100 p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all"
            >
              <Trash2 size={14} />
            </button>

            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase ${
              isCompleted ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
            }`}>
              {isCompleted ? <CheckCircle2 size={12} /> : <Clock size={12} />}
              {isCompleted ? 'Completed' : 'Active'}
            </div>
          </div>
        </div>
      </div>

      {/* SUBJECT PREVIEW */}
      <div className="px-6 py-3 flex items-center justify-between bg-blue-50/50 border-y border-slate-100">
        <div className="flex items-center gap-2">
          <BookOpen size={14} className="text-blue-600" />
          <span className="text-[10px] font-black text-slate-700 uppercase">
            Curriculum: {linkedSubjects.length} Subjects
          </span>
        </div>

        <div className="flex -space-x-1.5">
          {linkedSubjects.slice(0, 3).map((s, i) => (
            <div
              key={i}
              title={s.name}
              className="w-5 h-5 rounded-full bg-slate-900 border-2 border-white flex items-center justify-center text-[7px] text-white font-bold uppercase"
            >
              {s.code?.substring(0, 2)}
            </div>
          ))}
        </div>
      </div>

      {/* PROGRESS */}
      <div className="px-6 py-5 bg-white">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp size={14} className="text-blue-600" />
            <span className="text-[11px] font-black text-slate-700 uppercase">
              Semester {currentSem} / {totalSem}
            </span>
          </div>
          <span className="text-[11px] font-black text-blue-600">
            {progress}%
          </span>
        </div>

        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${
              isCompleted ? 'bg-green-500' : 'bg-blue-600'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* SUMMARY */}
      <div className="p-6 pt-0 flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-600">
              <Users size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Total</p>
              <p className="text-lg font-black text-slate-900">
                {batchStudents.length}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Active</p>
            <p className="text-lg font-black text-green-600">
              {activeStudents}
            </p>
          </div>
        </div>

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