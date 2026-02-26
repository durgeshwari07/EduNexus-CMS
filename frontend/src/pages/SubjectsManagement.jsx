// import React, { useState, useMemo } from 'react';
// import { 
//   Plus, Edit3, Trash2, Search,  
//    UserCheck, X, CheckCircle2
// } from 'lucide-react';

// export function SubjectsManagement({ data, updateData, userRole }) {
//   const isAdmin = userRole?.toLowerCase() === 'admin';
  
//   // --- STATE ---
//   const [showModal, setShowModal] = useState(false);
//   const [editingSubject, setEditingSubject] = useState(null);
//   const [showAssignModal, setShowAssignModal] = useState(false);
//   const [error, setError] = useState('');
  
//   const [searchQuery, setSearchQuery] = useState('');
//   const [activeSemester, setActiveSemester] = useState(1);
//   const [selectedDept, setSelectedDept] = useState('All Departments');

//   const semesters = [1, 2, 3, 4, 5, 6, 7, 8];

//   const [formData, setFormData] = useState({ 
//     name: '', code: '', semester: '1', credits: '', courseId: '', type: 'MAJOR' 
//   });
  
//   const [assignData, setAssignData] = useState({ subjectId: '', teacherId: '', academicYearId: '2025-26' });

//   // --- FILTERING ---
//   const displayedSubjects = useMemo(() => {
//     return (data.subjects || []).filter((s) => {
//       const searchLower = searchQuery.toLowerCase();
//       const matchesSearch = 
//         s.name.toLowerCase().includes(searchLower) ||
//         s.code.toLowerCase().includes(searchLower) ||
//         (s.type || '').toLowerCase().includes(searchLower);
      
//       const matchesSem = Number(s.semester) === activeSemester;
//       const matchesDept = selectedDept === 'All Departments' || String(s.courseId || s.dept_id) === String(selectedDept);
      
//       return matchesSearch && matchesSem && matchesDept;
//     });
//   }, [data.subjects, searchQuery, activeSemester, selectedDept]);

//   // --- HANDLERS ---
//   const handleSubjectSubmit = async (e) => {
//     e.preventDefault();
//     const payload = editingSubject 
//       ? { action: 'edit', subject: { ...formData, id: editingSubject.id } }
//       : { action: 'add', subject: { ...formData } };
    
//     await updateData(payload);
//     setShowModal(false);
//     setEditingSubject(null);
//     setFormData({ name: '', code: '', semester: String(activeSemester), credits: '', courseId: '', type: 'MAJOR' });
//   };

//   const handleAssignSubmit = async (e) => {
//     e.preventDefault();
//     if (!assignData.subjectId || !assignData.teacherId) {
//         setError("Please select both a subject and faculty.");
//         return;
//     }
//     await updateData({ action: 'assign', assignment: assignData });
//     setShowAssignModal(false);
//     setAssignData({ subjectId: '', teacherId: '', academicYearId: '2025-26' });
//     setError('');
//   };

//   return (
//     <div className="min-h-screen bg-white text-slate-900 font-sans p-6 lg:p-10">
      
//       {/* HEADER SECTION */}
//       <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start border-b border-slate-100 pb-8 mb-8">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight text-slate-900">Curriculum Management</h1>
//           <p className="text-slate-500 mt-2 font-medium">Create, edit, and assign faculty to academic subjects.</p>
//         </div>

//         {isAdmin && (
//           <div className="flex gap-3 mt-6 md:mt-0">
//             <button 
//               onClick={() => setShowAssignModal(true)}
//               className="flex items-center gap-2 border border-slate-200 hover:bg-slate-50 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all"
//             >
//               <UserCheck size={18} /> Assign Faculty
//             </button>
//             <button 
//               onClick={() => {
//                 setEditingSubject(null);
//                 setFormData({ name: '', code: '', semester: String(activeSemester), credits: '', courseId: '', type: 'MAJOR' });
//                 setShowModal(true);
//               }}
//               className="flex items-center gap-2 bg-slate-900 text-white hover:bg-slate-800 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all"
//             >
//               <Plus size={18} /> Add Subject
//             </button>
//           </div>
//         )}
//       </div>

//       <div className="max-w-7xl mx-auto">
//         {/* STATS STRIP */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
//           <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
//             <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Subjects</p>
//             <p className="text-2xl font-bold mt-1">{(data.subjects || []).length}</p>
//           </div>
//           <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
//             <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Credits</p>
//             <p className="text-2xl font-bold mt-1">{(data.subjects || []).reduce((acc, s) => acc + (Number(s.credits) || 0), 0)}</p>
//           </div>
//           <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
//             <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Sem</p>
//             <p className="text-2xl font-bold mt-1">Sem {activeSemester}</p>
//           </div>
//           <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
//             <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">System Status</p>
//             <p className="text-sm font-bold mt-2 text-green-600 flex items-center gap-1.5 uppercase">
//               <CheckCircle2 size={14} /> Operational
//             </p>
//           </div>
//         </div>

//         {/* FILTER TOOLBAR */}
//         <div className="flex flex-col lg:flex-row gap-4 mb-6">
//           <div className="relative flex-1">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
//             <input 
//               type="text"
//               placeholder="Search by code, name or category..."
//               className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//           </div>
          
//           <div className="flex gap-2 bg-slate-50 p-1 rounded-lg border border-slate-200 overflow-x-auto">
//             {semesters.map(sem => (
//               <button
//                 key={sem}
//                 onClick={() => setActiveSemester(sem)}
//                 className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all whitespace-nowrap ${activeSemester === sem ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
//               >
//                 SEM {sem}
//               </button>
//             ))}
//           </div>

//           <select 
//             className="px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-semibold focus:outline-none cursor-pointer"
//             value={selectedDept}
//             onChange={(e) => setSelectedDept(e.target.value)}
//           >
//             <option value="All Departments">All Departments</option>
//             {data.courses.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
//           </select>
//         </div>

//         {/* DATA TABLE */}
//         <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
//           <table className="w-full text-sm text-left border-collapse">
//             <thead>
//               <tr className="bg-slate-50 border-b border-slate-200">
//                 <th className="px-6 py-4 font-bold text-slate-500 uppercase text-[11px] tracking-wider">Code</th>
//                 <th className="px-6 py-4 font-bold text-slate-500 uppercase text-[11px] tracking-wider">Subject Name</th>
//                 <th className="px-6 py-4 font-bold text-slate-500 uppercase text-[11px] tracking-wider text-center">Category</th>
//                 <th className="px-6 py-4 font-bold text-slate-500 uppercase text-[11px] tracking-wider text-center">Credits</th>
//                 <th className="px-6 py-4 font-bold text-slate-500 uppercase text-[11px] tracking-wider">Faculty</th>
//                 {isAdmin && <th className="px-6 py-4 font-bold text-slate-500 uppercase text-[11px] tracking-wider text-right">Options</th>}
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-100">
//               {displayedSubjects.map((s) => (
//                 <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
//                   <td className="px-6 py-4 font-bold text-slate-900">{s.code}</td>
//                   <td className="px-6 py-4 font-semibold text-slate-700">{s.name}</td>
//                   <td className="px-6 py-4 text-center">
//                     <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md border ${s.type === 'MINOR' ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>
//                       {s.type || 'MAJOR'}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 text-center font-bold">{s.credits}</td>
//                   <td className="px-6 py-4">
//                     <div className="flex flex-wrap gap-1">
//                       {(data.teacherAssignments || []).filter(ta => String(ta.subjectId) === String(s.id)).map(a => {
//                         const teacher = data.users.find(u => String(u.id) === String(a.teacherId));
//                         return <span key={a.id} className="text-[10px] font-medium bg-slate-100 px-2 py-0.5 rounded border border-slate-200">{teacher?.name || 'Unknown'}</span>
//                       })}
//                     </div>
//                   </td>
//                   {isAdmin && (
//                     <td className="px-6 py-4 text-right">
//                       <div className="flex justify-end gap-1">
//                         <button onClick={() => { setEditingSubject(s); setFormData({ ...s, courseId: s.courseId || s.dept_id }); setShowModal(true); }} className="p-2 hover:bg-white border border-transparent hover:border-slate-200 rounded-lg text-slate-400 hover:text-slate-900 transition-all"><Edit3 size={16}/></button>
//                         <button onClick={() => updateData({ action: 'delete', id: s.id })} className="p-2 hover:bg-red-50 border border-transparent hover:border-red-100 rounded-lg text-slate-400 hover:text-red-600 transition-all"><Trash2 size={16}/></button>
//                       </div>
//                     </td>
//                   )}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//           {displayedSubjects.length === 0 && (
//             <div className="py-20 text-center text-slate-400 font-medium italic">No subjects matching the current filters.</div>
//           )}
//         </div>
//       </div>

//       {/* ADD/EDIT MODAL */}
//       {showModal && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
//           <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95">
//             <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
//               <h2 className="font-bold text-lg">{editingSubject ? 'Edit Subject' : 'Add New Subject'}</h2>
//               <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-900"><X size={20}/></button>
//             </div>
//             <form onSubmit={handleSubjectSubmit} className="p-6 space-y-4">
//               <div>
//                 <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Subject Name</label>
//                 <input required className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-900 font-medium" type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Code</label>
//                   <input required className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-900 font-medium" type="text" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} />
//                 </div>
//                 <div>
//                   <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Credits</label>
//                   <input required className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-900 font-medium" type="number" value={formData.credits} onChange={e => setFormData({...formData, credits: e.target.value})} />
//                 </div>
//               </div>
//               <div>
//                 <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Category</label>
//                 <div className="flex gap-2">
//                   <button type="button" onClick={() => setFormData({...formData, type: 'MAJOR'})} className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${formData.type === 'MAJOR' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-400 border-slate-200 hover:border-slate-400'}`}>MAJOR</button>
//                   <button type="button" onClick={() => setFormData({...formData, type: 'MINOR'})} className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${formData.type === 'MINOR' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-400 border-slate-200 hover:border-slate-400'}`}>MINOR</button>
//                 </div>
//               </div>
//               <div>
//                 <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Department</label>
//                 <select required className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-900 font-medium bg-white" value={formData.courseId} onChange={e => setFormData({...formData, courseId: e.target.value})}>
//                   <option value="">Select Department</option>
//                   {data.courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
//                 </select>
//               </div>
//               <button type="submit" className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold text-sm mt-4 hover:bg-slate-800 transition-all">Save Changes</button>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* ASSIGN FACULTY MODAL - RE-ADDED THIS PART */}
//       {showAssignModal && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
//           <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95">
//             <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
//               <h2 className="font-bold text-lg">Assign Faculty</h2>
//               <button onClick={() => setShowAssignModal(false)} className="text-slate-400 hover:text-slate-900"><X size={20}/></button>
//             </div>
//             <form onSubmit={handleAssignSubmit} className="p-6 space-y-4">
//               {error && <div className="text-red-500 text-xs font-bold bg-red-50 p-3 rounded-lg border border-red-100">{error}</div>}
              
//               <div>
//                 <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Select Subject</label>
//                 <select required className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-900 font-medium bg-white" value={assignData.subjectId} onChange={e => setAssignData({...assignData, subjectId: e.target.value})}>
//                   <option value="">-- Choose Subject --</option>
//                   {data.subjects.filter(s => Number(s.semester) === activeSemester && (selectedDept === 'All Departments' || String(s.courseId || s.dept_id) === String(selectedDept))).map(s => (
//                     <option key={s.id} value={s.id}>{s.code} - {s.name}</option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Faculty Member</label>
//                 <select required className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-900 font-medium bg-white" value={assignData.teacherId} onChange={e => setAssignData({...assignData, teacherId: e.target.value})}>
//                   <option value="">-- Choose Teacher --</option>
//                   {data.users.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
//                 </select>
//               </div>

//               <button type="submit" className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold text-sm mt-4 hover:bg-slate-800 transition-all">Finalize Assignment</button>
//             </form>
//           </div>
//         </div>
//       )}

//     </div>
//   );
// }

// export default SubjectsManagement;


import React, { useState, useMemo, useEffect } from 'react';
import { 
  Plus, Edit3, Trash2, Search,  
  UserCheck, X, CheckCircle2, BookOpen, Link2Off
} from 'lucide-react';

export function SubjectsManagement({ data, updateData, userRole, initialFilters = null }) {
  const isAdmin = userRole?.toLowerCase() === 'admin';
  
  // --- STATE ---
  const [showModal, setShowModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [error, setError] = useState('');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSemester, setActiveSemester] = useState(1);
  const [selectedDept, setSelectedDept] = useState('All Departments');

  // Sync state if initialFilters are passed (from Batch Card "Manage" click)
  useEffect(() => {
    if (initialFilters) {
      setActiveSemester(Number(initialFilters.semester));
      setSelectedDept(String(initialFilters.courseId || initialFilters.dept_id));
    }
  }, [initialFilters]);

  const semesters = [1, 2, 3, 4, 5, 6, 7, 8];

  const [formData, setFormData] = useState({ 
    name: '', code: '', semester: '1', credits: '', courseId: '', type: 'MAJOR' 
  });
  
  const [assignData, setAssignData] = useState({ subjectId: '', teacherId: '', academicYearId: '2025-26' });

  // --- FILTERING ---
  const displayedSubjects = useMemo(() => {
    return (data.subjects || []).filter((s) => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        s.name.toLowerCase().includes(searchLower) ||
        s.code.toLowerCase().includes(searchLower) ||
        (s.type || '').toLowerCase().includes(searchLower);
      
      const matchesSem = Number(s.semester) === activeSemester;
      const matchesDept = selectedDept === 'All Departments' || String(s.courseId || s.dept_id) === String(selectedDept);
      
      return matchesSearch && matchesSem && matchesDept;
    });
  }, [data.subjects, searchQuery, activeSemester, selectedDept]);

  // --- HANDLERS ---
  const handleSubjectSubmit = async (e) => {
    e.preventDefault();
    const payload = editingSubject 
      ? { action: 'edit', subject: { ...formData, id: editingSubject.id } }
      : { action: 'add', subject: { ...formData } };
    
    await updateData(payload);
    setShowModal(false);
    setEditingSubject(null);
    setFormData({ name: '', code: '', semester: String(activeSemester), credits: '', courseId: '', type: 'MAJOR' });
  };

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    if (!assignData.subjectId || !assignData.teacherId) {
        setError("Please select both a subject and faculty.");
        return;
    }
    await updateData({ action: 'assign', assignment: assignData });
    setShowAssignModal(false);
    setAssignData({ subjectId: '', teacherId: '', academicYearId: '2025-26' });
    setError('');
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans p-6 lg:p-10">
      
      {/* HEADER SECTION */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start border-b border-slate-100 pb-8 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Curriculum Management</h1>
          <p className="text-slate-500 mt-2 font-medium">Create, edit, and assign faculty to academic subjects.</p>
          
          {/* CONNECTION BADGE: Shows when filtered by a specific department */}
          {selectedDept !== 'All Departments' && (
            <div className="flex items-center gap-2 mt-4 bg-blue-50 border border-blue-100 w-fit px-3 py-1.5 rounded-full">
               <BookOpen size={14} className="text-blue-600" />
               <span className="text-[10px] font-black text-blue-700 uppercase">
                 Connected to Dept: {data.courses.find(c => String(c.id) === selectedDept)?.name}
               </span>
               <button onClick={() => setSelectedDept('All Departments')} className="text-blue-400 hover:text-blue-800 transition-colors">
                 <Link2Off size={14} />
               </button>
            </div>
          )}
        </div>

        {isAdmin && (
          <div className="flex gap-3 mt-6 md:mt-0">
            <button 
              onClick={() => setShowAssignModal(true)}
              className="flex items-center gap-2 border border-slate-200 hover:bg-slate-50 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all"
            >
              <UserCheck size={18} /> Assign Faculty
            </button>
            <button 
              onClick={() => {
                setEditingSubject(null);
                setFormData({ name: '', code: '', semester: String(activeSemester), credits: '', courseId: selectedDept !== 'All Departments' ? selectedDept : '', type: 'MAJOR' });
                setShowModal(true);
              }}
              className="flex items-center gap-2 bg-slate-900 text-white hover:bg-slate-800 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all"
            >
              <Plus size={18} /> Add Subject
            </button>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto">
        {/* STATS STRIP */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Filtered Subjects</p>
            <p className="text-2xl font-bold mt-1">{displayedSubjects.length}</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Credits for Sem {activeSemester}</p>
            <p className="text-2xl font-bold mt-1">{displayedSubjects.reduce((acc, s) => acc + (Number(s.credits) || 0), 0)}</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Sem</p>
            <p className="text-2xl font-bold mt-1 text-blue-600">Sem {activeSemester}</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">System Status</p>
            <p className="text-sm font-bold mt-2 text-green-600 flex items-center gap-1.5 uppercase">
              <CheckCircle2 size={14} /> Live Curriculum
            </p>
          </div>
        </div>

        {/* FILTER TOOLBAR */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Search by code, name or category..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 bg-slate-50 p-1 rounded-lg border border-slate-200 overflow-x-auto">
            {semesters.map(sem => (
              <button
                key={sem}
                onClick={() => setActiveSemester(sem)}
                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all whitespace-nowrap ${activeSemester === sem ? 'bg-white text-slate-900 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
              >
                SEM {sem}
              </button>
            ))}
          </div>

          <select 
            className="px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-semibold focus:outline-none cursor-pointer"
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
          >
            <option value="All Departments">All Departments</option>
            {data.courses.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </div>

        {/* DATA TABLE */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 font-bold text-slate-500 uppercase text-[11px] tracking-wider">Code</th>
                <th className="px-6 py-4 font-bold text-slate-500 uppercase text-[11px] tracking-wider">Subject Name</th>
                <th className="px-6 py-4 font-bold text-slate-500 uppercase text-[11px] tracking-wider text-center">Category</th>
                <th className="px-6 py-4 font-bold text-slate-500 uppercase text-[11px] tracking-wider text-center">Credits</th>
                <th className="px-6 py-4 font-bold text-slate-500 uppercase text-[11px] tracking-wider">Faculty</th>
                {isAdmin && <th className="px-6 py-4 font-bold text-slate-500 uppercase text-[11px] tracking-wider text-right">Options</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayedSubjects.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900">{s.code}</td>
                  <td className="px-6 py-4 font-semibold text-slate-700">{s.name}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md border ${s.type === 'MINOR' ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>
                      {s.type || 'MAJOR'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center font-bold">{s.credits}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {(data.teacherAssignments || []).filter(ta => String(ta.subjectId) === String(s.id)).map(a => {
                        const teacher = data.users.find(u => String(u.id) === String(a.teacherId));
                        return <span key={a.id} className="text-[10px] font-medium bg-slate-100 px-2 py-0.5 rounded border border-slate-200">{teacher?.name || 'Unknown'}</span>
                      })}
                      {(data.teacherAssignments || []).filter(ta => String(ta.subjectId) === String(s.id)).length === 0 && (
                        <span className="text-[10px] text-slate-300 italic">Not Assigned</span>
                      )}
                    </div>
                  </td>
                  {isAdmin && (
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => { setEditingSubject(s); setFormData({ ...s, courseId: s.courseId || s.dept_id }); setShowModal(true); }} className="p-2 hover:bg-white border border-transparent hover:border-slate-200 rounded-lg text-slate-400 hover:text-slate-900 transition-all"><Edit3 size={16}/></button>
                        <button onClick={() => updateData({ action: 'delete', id: s.id })} className="p-2 hover:bg-red-50 border border-transparent hover:border-red-100 rounded-lg text-slate-400 hover:text-red-600 transition-all"><Trash2 size={16}/></button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          {displayedSubjects.length === 0 && (
            <div className="py-20 text-center flex flex-col items-center">
               <div className="bg-slate-50 p-4 rounded-full mb-4">
                 <BookOpen size={40} className="text-slate-200" />
               </div>
               <p className="text-slate-400 font-medium italic">No subjects matching the current filters.</p>
            </div>
          )}
        </div>
      </div>

      {/* ADD/EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h2 className="font-bold text-lg">{editingSubject ? 'Edit Subject' : 'Add New Subject'}</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-900"><X size={20}/></button>
            </div>
            <form onSubmit={handleSubjectSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Subject Name</label>
                <input required className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-900 font-medium" type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Code</label>
                  <input required className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-900 font-medium" type="text" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Credits</label>
                  <input required className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-900 font-medium" type="number" value={formData.credits} onChange={e => setFormData({...formData, credits: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Category</label>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setFormData({...formData, type: 'MAJOR'})} className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${formData.type === 'MAJOR' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-400 border-slate-200 hover:border-slate-400'}`}>MAJOR</button>
                  <button type="button" onClick={() => setFormData({...formData, type: 'MINOR'})} className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${formData.type === 'MINOR' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-400 border-slate-200 hover:border-slate-400'}`}>MINOR</button>
                </div>
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Department</label>
                <select required className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-900 font-medium bg-white" value={formData.courseId} onChange={e => setFormData({...formData, courseId: e.target.value})}>
                  <option value="">Select Department</option>
                  {data.courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <button type="submit" className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold text-sm mt-4 hover:bg-slate-800 transition-all">Save Changes</button>
            </form>
          </div>
        </div>
      )}

      {/* ASSIGN FACULTY MODAL */}
      {showAssignModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h2 className="font-bold text-lg">Assign Faculty</h2>
              <button onClick={() => setShowAssignModal(false)} className="text-slate-400 hover:text-slate-900"><X size={20}/></button>
            </div>
            <form onSubmit={handleAssignSubmit} className="p-6 space-y-4">
              {error && <div className="text-red-500 text-xs font-bold bg-red-50 p-3 rounded-lg border border-red-100">{error}</div>}
              
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Select Subject</label>
                <select required className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-900 font-medium bg-white" value={assignData.subjectId} onChange={e => setAssignData({...assignData, subjectId: e.target.value})}>
                  <option value="">-- Choose Subject --</option>
                  {data.subjects.filter(s => Number(s.semester) === activeSemester && (selectedDept === 'All Departments' || String(s.courseId || s.dept_id) === String(selectedDept))).map(s => (
                    <option key={s.id} value={s.id}>{s.code} - {s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Faculty Member</label>
                <select required className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-900 font-medium bg-white" value={assignData.teacherId} onChange={e => setAssignData({...assignData, teacherId: e.target.value})}>
                  <option value="">-- Choose Teacher --</option>
                  {data.users.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>

              <button type="submit" className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold text-sm mt-4 hover:bg-slate-800 transition-all">Finalize Assignment</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default SubjectsManagement;