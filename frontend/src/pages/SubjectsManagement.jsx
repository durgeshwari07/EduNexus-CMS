// import React, { useState, useMemo } from 'react';
// import { Plus, Edit3, Trash2, LayoutGrid, Search, Filter, BookOpen, AlertCircle, X } from 'lucide-react';

// export function SubjectsManagement({ data, updateData }) {
//   const [showModal, setShowModal] = useState(false);
//   const [editingSubject, setEditingSubject] = useState(null);
//   const [showAssignModal, setShowAssignModal] = useState(false);
//   const [error, setError] = useState('');
  
//   // Search & Filter State
//   const [searchQuery, setSearchQuery] = useState('');
//   const [semesterFilter, setSemesterFilter] = useState('All Semesters');

//   // Form States
//   const [formData, setFormData] = useState({ name: '', code: '', semester: '1', credits: '', courseId: '' });
//   const [assignData, setAssignData] = useState({ subjectId: '', teacherId: '', academicYearId: '2024-25' });

//   // --- Search & Filter Logic ---
//   const filteredSubjects = useMemo(() => {
//     return data.subjects.filter((s) => {
//       const searchLower = searchQuery.toLowerCase();
//       const teacherNames = (data.teacherAssignments || [])
//         .filter(ta => ta.subjectId === s.id)
//         .map(a => data.users.find(u => u.id === a.teacherId)?.name || '')
//         .join(' ').toLowerCase();

//       const matchesSearch = 
//         s.name.toLowerCase().includes(searchLower) ||
//         s.code.toLowerCase().includes(searchLower) ||
//         teacherNames.includes(searchLower);
      
//       const matchesSem = semesterFilter === 'All Semesters' || s.semester.toString() === semesterFilter;
      
//       return matchesSearch && matchesSem;
//     });
//   }, [data.subjects, searchQuery, semesterFilter, data.teacherAssignments, data.users]);

//   // --- Logic Handlers ---
//   const resetForm = () => { setFormData({ name: '', code: '', semester: '1', credits: '', courseId: '' }); setError(''); };
//   const resetAssignForm = () => { setAssignData({ subjectId: '', teacherId: '', academicYearId: '2024-25' }); setError(''); };

//   const handleSubjectSubmit = (e) => {
//     e.preventDefault();
//     if (editingSubject) {
//       const updated = data.subjects.map(s => s.id === editingSubject.id ? { ...s, ...formData } : s);
//       updateData({ ...data, subjects: updated });
//     } else {
//       updateData({ ...data, subjects: [...data.subjects, { ...formData, id: `sub${Date.now()}` }] });
//     }
//     setShowModal(false);
//     resetForm();
//   };

//   const handleAssignSubmit = (e) => {
//     e.preventDefault();
//     const isAlreadyAssigned = data.teacherAssignments?.some(
//       a => a.subjectId === assignData.subjectId && a.teacherId === assignData.teacherId
//     );
//     if (isAlreadyAssigned) { setError("This teacher is already assigned to this subject."); return; }

//     updateData({ 
//       ...data, 
//       teacherAssignments: [...(data.teacherAssignments || []), { ...assignData, id: `ta${Date.now()}` }] 
//     });
//     setShowAssignModal(false);
//     resetAssignForm();
//   };

//   const getCourseName = (id) => data.courses.find(c => String(c.id) === String(id))?.name || 'N/A';

//   return (
//     <div className="animate-in fade-in duration-500 max-w-7xl mx-auto p-6 space-y-6 font-sans">
      
//       {/* 1. HEADER SECTION */}
//       <div className="space-y-1">
//         <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
//           <LayoutGrid size={12} /> Dashboard / <span className="text-[#136dec]">Subjects</span>
//         </div>
//         <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
//           <div>
//             <h1 className="text-4xl font-black text-slate-900 tracking-tight">Subjects Management</h1>
//             <p className="text-slate-500 font-medium mt-1">Configure curriculum and faculty assignments.</p>
//           </div>
//           <div className="flex gap-3">
//             <button onClick={() => setShowAssignModal(true)} className="flex items-center gap-2 bg-[#10b981] text-white px-6 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-lg shadow-emerald-100 hover:bg-emerald-600 transition-all active:scale-95">
//               <Plus size={16} /> Assign Teacher
//             </button>
//             <button onClick={() => { setEditingSubject(null); resetForm(); setShowModal(true); }} className="flex items-center gap-2 bg-[#136dec] text-white px-6 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95">
//               <Plus size={16} /> Add Subject
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* 2. SEARCH TOOLBAR */}
//       <div className="flex flex-col md:flex-row gap-4 items-center">
//         <div className="relative flex-1 w-full group">
//           <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#136dec]" size={18} />
//           <input 
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-semibold focus:ring-4 focus:ring-blue-500/10 outline-none" 
//             placeholder="Search code, subject or teacher..." 
//           />
//         </div>
//         <div className="relative w-full md:w-64">
//            <Filter size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
//            <select 
//               value={semesterFilter}
//               onChange={(e) => setSemesterFilter(e.target.value)}
//               className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-10 pr-8 text-[12px] font-black uppercase tracking-widest text-slate-700 outline-none appearance-none"
//             >
//               <option value="All Semesters">All Semesters</option>
//               {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>Semester {n}</option>)}
//             </select>
//         </div>
//       </div>

//       {/* 3. TABLE */}
//       <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full text-left">
//             <thead>
//               <tr className="bg-slate-50/80 border-b border-slate-100">
//                 <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Subject Code</th>
//                 <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Subject Name</th>
//                 <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Course</th>
//                 <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Semester</th>
//                 <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Credits</th>
//                 <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Assigned Teachers</th>
//                 <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-100">
//               {filteredSubjects.map((s) => (
//                 <tr key={s.id} className="hover:bg-slate-50/50 transition-colors group">
//                   <td className="px-8 py-5 font-bold text-[#136dec] text-sm">{s.code}</td>
//                   <td className="px-6 py-5 font-bold text-slate-900 text-sm">{s.name}</td>
//                   <td className="px-6 py-5 text-xs font-bold text-slate-500 uppercase">{getCourseName(s.courseId)}</td>
//                   <td className="px-6 py-5 text-slate-700 font-black text-xs uppercase">Sem {s.semester}</td>
//                   <td className="px-6 py-5 text-slate-700 font-black">{s.credits}</td>
//                   <td className="px-6 py-5">
//                     <div className="flex flex-wrap gap-1">
//                       {(data.teacherAssignments || []).filter(ta => ta.subjectId === s.id).map(a => (
//                         <span key={a.id} className="px-2 py-1 rounded-lg text-[9px] font-black uppercase bg-blue-50 text-[#136dec] border border-blue-100">
//                           {data.users.find(u => u.id === a.teacherId)?.name}
//                         </span>
//                       ))}
//                     </div>
//                   </td>
//                   <td className="px-8 py-5 text-right flex justify-end gap-2 opacity-0 group-hover:opacity-100">
//                     <button onClick={() => { setEditingSubject(s); setFormData(s); setShowModal(true); }} className="p-2 text-blue-500 hover:bg-blue-50 rounded-xl"><Edit3 size={16}/></button>
//                     <button onClick={() => updateData({...data, subjects: data.subjects.filter(sub => sub.id !== s.id)})} className="p-2 text-red-500 hover:bg-red-50 rounded-xl"><Trash2 size={16}/></button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* --- ADD SUBJECT MODAL --- */}
//       {showModal && (
//         <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-md overflow-hidden p-8 animate-in zoom-in-95 duration-200">
//             <h3 className="text-2xl font-black text-slate-900 mb-6 tracking-tight">{editingSubject ? 'Edit Subject' : 'Add New Subject'}</h3>
//             <form onSubmit={handleSubjectSubmit} className="space-y-4 text-left">
//               <div className="space-y-1">
//                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Subject Name *</label>
//                 <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#136dec]/20 outline-none" />
//               </div>
//               <div className="space-y-1">
//                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Subject Code *</label>
//                 <input type="text" required value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#136dec]/20 outline-none" />
//               </div>
//               <div className="space-y-1">
//                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Course/Department *</label>
//                 <select required value={formData.courseId} onChange={e => setFormData({...formData, courseId: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none">
//                   <option value="">Select Course</option>
//                   {data.courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
//                 </select>
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="space-y-1">
//                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Semester</label>
//                   <select required value={formData.semester} onChange={e => setFormData({...formData, semester: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none">
//                     {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n}</option>)}
//                   </select>
//                 </div>
//                 <div className="space-y-1">
//                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Credits</label>
//                   <input type="number" required value={formData.credits} onChange={e => setFormData({...formData, credits: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#136dec]/20 outline-none" />
//                 </div>
//               </div>
//               <div className="flex gap-3 pt-4">
//                 <button type="submit" className="flex-1 bg-[#136dec] text-white py-4 rounded-2xl font-black text-sm shadow-lg hover:bg-blue-700 transition-all active:scale-95">Save Subject</button>
//                 <button onClick={() => { setShowModal(false); resetForm(); }} type="button" className="flex-1 bg-slate-100 text-slate-500 py-4 rounded-2xl font-black text-sm hover:bg-slate-200 transition-all active:scale-95">Cancel</button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* --- ASSIGN TEACHER MODAL --- */}
//       {showAssignModal && (
//         <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-md overflow-hidden p-8 animate-in zoom-in-95 duration-200">
//             <h3 className="text-2xl font-black text-slate-900 mb-6 tracking-tight">Assign Teacher</h3>
//             <form onSubmit={handleAssignSubmit} className="space-y-5 text-left">
//               {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl text-[10px] font-bold flex items-center gap-2 tracking-widest uppercase"><AlertCircle size={14} /> {error}</div>}
//               <div className="space-y-1">
//                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Subject *</label>
//                 <select required value={assignData.subjectId} onChange={e => setAssignData({...assignData, subjectId: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none">
//                   <option value="">Select Subject</option>
//                   {data.subjects.map(s => <option key={s.id} value={s.id}>{s.code} - {s.name}</option>)}
//                 </select>
//               </div>
//               <div className="space-y-1">
//                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Teacher *</label>
//                 <select required value={assignData.teacherId} onChange={e => setAssignData({...assignData, teacherId: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none">
//                   <option value="">Select Teacher</option>
//                   {data.users.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
//                 </select>
//               </div>
//               <div className="space-y-1">
//                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Academic Year</label>
//                 <select required value={assignData.academicYearId} onChange={e => setAssignData({...assignData, academicYearId: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none">
//                   <option value="2024-25">2024-25</option>
//                   <option value="2023-24">2023-24</option>
//                 </select>
//               </div>
//               <div className="flex gap-3 pt-4">
//                 <button type="submit" className="flex-1 bg-[#10b981] text-white py-4 rounded-2xl font-black text-sm shadow-lg hover:bg-emerald-600 active:scale-95 transition-all">Assign Teacher</button>
//                 <button onClick={() => { setShowAssignModal(false); resetAssignForm(); }} type="button" className="flex-1 bg-slate-100 text-slate-500 py-4 rounded-2xl font-black text-sm hover:bg-slate-200 active:scale-95 transition-all">Cancel</button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default SubjectsManagement;










import React, { useState, useMemo } from 'react';
import { Plus, Edit3, Trash2, LayoutGrid, Search, Filter, AlertCircle } from 'lucide-react';

export function SubjectsManagement({ data, updateData }) {
  const [showModal, setShowModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [error, setError] = useState('');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [semesterFilter, setSemesterFilter] = useState('All Semesters');

  const [formData, setFormData] = useState({ name: '', code: '', semester: '1', credits: '', courseId: '' });
  const [assignData, setAssignData] = useState({ subjectId: '', teacherId: '', academicYearId: '2024-25' });

  const filteredSubjects = useMemo(() => {
    return data.subjects.filter((s) => {
      const searchLower = searchQuery.toLowerCase();
      const teacherNames = (data.teacherAssignments || [])
        .filter(ta => ta.subjectId === s.id)
        .map(a => data.users.find(u => u.id === a.teacherId)?.name || '')
        .join(' ').toLowerCase();

      const matchesSearch = 
        s.name.toLowerCase().includes(searchLower) ||
        s.code.toLowerCase().includes(searchLower) ||
        teacherNames.includes(searchLower);
      
      const matchesSem = semesterFilter === 'All Semesters' || s.semester.toString() === semesterFilter;
      
      return matchesSearch && matchesSem;
    });
  }, [data.subjects, searchQuery, semesterFilter, data.teacherAssignments, data.users]);

  const resetForm = () => { setFormData({ name: '', code: '', semester: '1', credits: '', courseId: '' }); setError(''); };
  const resetAssignForm = () => { setAssignData({ subjectId: '', teacherId: '', academicYearId: '2024-25' }); setError(''); };

  const handleSubjectSubmit = (e) => {
    e.preventDefault();
    if (editingSubject) {
      const updated = data.subjects.map(s => s.id === editingSubject.id ? { ...s, ...formData } : s);
      updateData({ ...data, subjects: updated });
    } else {
      updateData({ ...data, subjects: [...data.subjects, { ...formData, id: `sub${Date.now()}` }] });
    }
    setShowModal(false);
    resetForm();
  };

  const handleAssignSubmit = (e) => {
    e.preventDefault();
    const isAlreadyAssigned = data.teacherAssignments?.some(
      a => a.subjectId === assignData.subjectId && a.teacherId === assignData.teacherId
    );
    if (isAlreadyAssigned) { setError("This teacher is already assigned to this subject."); return; }

    updateData({ 
      ...data, 
      teacherAssignments: [...(data.teacherAssignments || []), { ...assignData, id: `ta${Date.now()}` }] 
    });
    setShowAssignModal(false);
    resetAssignForm();
  };

  const getCourseName = (id) => data.courses.find(c => String(c.id) === String(id))?.name || 'N/A';

  return (
    <div className="animate-in fade-in duration-500 max-w-7xl mx-auto p-8 space-y-8 bg-[#f8fafc] min-h-screen font-sans">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Subjects Management</h1>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setShowAssignModal(true)} 
            className="flex items-center gap-2 bg-[#00b341] text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-all hover:bg-[#009a37] active:scale-95 shadow-sm"
          >
            <Plus size={18} /> Assign Teacher
          </button>
          <button 
            onClick={() => { setEditingSubject(null); resetForm(); setShowModal(true); }} 
            className="flex items-center gap-2 bg-[#2563eb] text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-all hover:bg-[#1d4ed8] active:scale-95 shadow-sm"
          >
            <Plus size={18} /> Add Subject
          </button>
        </div>
      </div>

      {/* SEARCH TOOLBAR */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" 
            placeholder="Search code, subject or teacher..." 
          />
        </div>
        <div className="relative w-full md:w-64">
           <Filter size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
           <select 
              value={semesterFilter}
              onChange={(e) => setSemesterFilter(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-10 pr-8 text-sm font-semibold text-slate-700 outline-none appearance-none cursor-pointer"
            >
              <option value="All Semesters">All Semesters</option>
              {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>Semester {n}</option>)}
            </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f1f5f9] border-b border-slate-200">
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Subject Code</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Subject Name</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Course</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Semester</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Credits</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Assigned Teachers</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSubjects.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-6 font-bold text-slate-900 text-sm">{s.code}</td>
                  <td className="px-6 py-6 font-medium text-slate-700 text-sm">{s.name}</td>
                  <td className="px-6 py-6 text-sm text-slate-500">{getCourseName(s.courseId)}</td>
                  <td className="px-6 py-6 text-sm text-slate-600 font-medium">{s.semester}</td>
                  <td className="px-6 py-6 text-sm text-slate-600 font-medium">{s.credits}</td>
                  <td className="px-6 py-6">
                    <div className="flex flex-wrap gap-2">
                      {(data.teacherAssignments || []).filter(ta => ta.subjectId === s.id).map(a => (
                        <span key={a.id} className="text-sm text-slate-700 font-medium">
                          {data.users.find(u => u.id === a.teacherId)?.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex justify-center gap-3">
                      <button onClick={() => { setEditingSubject(s); setFormData(s); setShowModal(true); }} className="text-blue-600 hover:text-blue-800 transition-colors"><Edit3 size={18}/></button>
                      <button onClick={() => updateData({...data, subjects: data.subjects.filter(sub => sub.id !== s.id)})} className="text-red-500 hover:text-red-700 transition-colors"><Trash2 size={18}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD/EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 animate-in slide-in-from-bottom-4">
            <h3 className="text-xl font-bold text-slate-900 mb-6">{editingSubject ? 'Edit Subject' : 'Add New Subject'}</h3>
            <form onSubmit={handleSubjectSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Subject Name</label>
                <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-500" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Subject Code</label>
                <input type="text" required value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-500" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Course/Department</label>
                <select required value={formData.courseId} onChange={e => setFormData({...formData, courseId: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none cursor-pointer">
                  <option value="">Select Course</option>
                  {data.courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Semester</label>
                  <select required value={formData.semester} onChange={e => setFormData({...formData, semester: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none cursor-pointer">
                    {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Credits</label>
                  <input type="number" required value={formData.credits} onChange={e => setFormData({...formData, credits: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-500" />
                </div>
              </div>
              <div className="flex gap-3 pt-6">
                <button type="submit" className="flex-1 bg-slate-900 text-white py-2.5 rounded-lg font-bold text-sm hover:bg-black transition-all">Save Subject</button>
                <button onClick={() => { setShowModal(false); resetForm(); }} type="button" className="flex-1 bg-slate-100 text-slate-600 py-2.5 rounded-lg font-bold text-sm hover:bg-slate-200 transition-all">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ASSIGN TEACHER MODAL */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 animate-in slide-in-from-bottom-4">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Assign Teacher</h3>
            <form onSubmit={handleAssignSubmit} className="space-y-4">
              {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-xs font-bold flex items-center gap-2"><AlertCircle size={14} /> {error}</div>}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Subject</label>
                <select required value={assignData.subjectId} onChange={e => setAssignData({...assignData, subjectId: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none cursor-pointer">
                  <option value="">Select Subject</option>
                  {data.subjects.map(s => <option key={s.id} value={s.id}>{s.code} - {s.name}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Teacher</label>
                <select required value={assignData.teacherId} onChange={e => setAssignData({...assignData, teacherId: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none cursor-pointer">
                  <option value="">Select Teacher</option>
                  {data.users.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Academic Year</label>
                <select required value={assignData.academicYearId} onChange={e => setAssignData({...assignData, academicYearId: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none cursor-pointer">
                  <option value="2024-25">2024-25</option>
                  <option value="2023-24">2023-24</option>
                </select>
              </div>
              <div className="flex gap-3 pt-6">
                <button type="submit" className="flex-1 bg-[#00b341] text-white py-2.5 rounded-lg font-bold text-sm hover:bg-[#009a37] transition-all">Assign Teacher</button>
                <button onClick={() => { setShowAssignModal(false); resetAssignForm(); }} type="button" className="flex-1 bg-slate-100 text-slate-600 py-2.5 rounded-lg font-bold text-sm hover:bg-slate-200 transition-all">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default SubjectsManagement;