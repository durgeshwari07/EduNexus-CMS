import React, { useState, useMemo } from 'react';
import { 
  Plus, Edit3, Trash2, Search, AlertCircle, 
  ShieldAlert, LayoutGrid, BookOpen, UserCheck, Award, Layers, Eye,
  Filter, X
} from 'lucide-react';

export function SubjectsManagement({ data, updateData, userRole }) {
  const isAdmin = userRole?.toLowerCase() === 'admin';
  
  // --- STATE LOGIC ---
  const [showModal, setShowModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [error, setError] = useState('');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSemester, setActiveSemester] = useState(1);
  const [selectedDept, setSelectedDept] = useState('All Departments');

  const semesters = [1, 2, 3, 4, 5, 6, 7, 8];

  // Form States
  const [formData, setFormData] = useState({ name: '', code: '', semester: '1', credits: '', courseId: '' });
  const [assignData, setAssignData] = useState({ subjectId: '', teacherId: '', academicYearId: '2025-26' });

  // --- STATISTICS ---
  const stats = [
    { label: 'Total Subjects', value: (data.subjects || []).length, icon: <BookOpen size={16} />, color: 'bg-blue-50 text-blue-600' },
    { label: 'Faculty Load', value: (data.teacherAssignments || []).length, icon: <UserCheck size={16} />, color: 'bg-indigo-50 text-indigo-600' },
    { label: 'Total Credits', value: (data.subjects || []).reduce((acc, s) => acc + (Number(s.credits) || 0), 0), icon: <Award size={16} />, color: 'bg-green-50 text-green-600' },
    { label: 'Academic Year', value: '2025-26', icon: <Layers size={16} />, color: 'bg-slate-50 text-slate-600' },
  ];

  // --- CORE FILTER LOGIC ---
  const displayedSubjects = useMemo(() => {
    return (data.subjects || []).filter((s) => {
      const searchLower = searchQuery.toLowerCase();
      const teacherNames = (data.teacherAssignments || [])
        .filter(ta => String(ta.subjectId) === String(s.id))
        .map(a => data.users.find(u => String(u.id) === String(a.teacherId))?.name || '')
        .join(' ').toLowerCase();

      const matchesSearch = 
        s.name.toLowerCase().includes(searchLower) ||
        s.code.toLowerCase().includes(searchLower) ||
        teacherNames.includes(searchLower);
      
      const matchesSem = Number(s.semester) === activeSemester;
      const matchesDept = selectedDept === 'All Departments' || String(s.courseId || s.dept_id) === String(selectedDept);
      
      return matchesSearch && matchesSem && matchesDept;
    });
  }, [data.subjects, searchQuery, activeSemester, selectedDept, data.teacherAssignments, data.users]);

  // --- HANDLERS ---
  const resetForm = () => { 
    setFormData({ 
      name: '', 
      code: '', 
      semester: String(activeSemester), 
      credits: '', 
      courseId: selectedDept !== 'All Departments' ? selectedDept : '' 
    }); 
    setEditingSubject(null);
    setError(''); 
  };
  
  const resetAssignForm = () => { 
    setAssignData({ subjectId: '', teacherId: '', academicYearId: '2025-26' }); 
    setError(''); 
  };

  const handleSubjectSubmit = async (e) => {
    e.preventDefault();
    if (!isAdmin) return;

    const payload = editingSubject 
      ? { action: 'edit', subject: { ...formData, id: editingSubject.id } }
      : { action: 'add', subject: { ...formData } };
    
    await updateData(payload);

    if (payload.action === 'add') {
        setSelectedDept(formData.courseId);
        setActiveSemester(Number(formData.semester));
    }
    
    setShowModal(false);
    resetForm();
  };

  const handleDeleteSubject = async (id) => {
    if (!isAdmin) return;
    if (window.confirm("Delete this subject?")) {
      await updateData({ action: 'delete', id: id });
    }
  };

  // --- WORKING ASSIGN LOGIC ---
  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    if (!isAdmin) return;

    if (!assignData.subjectId || !assignData.teacherId) {
        setError("Please select both a subject and a faculty member.");
        return;
    }

    const alreadyAssigned = data.teacherAssignments?.some(
      a => String(a.subjectId) === String(assignData.subjectId) && String(a.teacherId) === String(assignData.teacherId)
    );

    if (alreadyAssigned) { 
      setError("This faculty member is already assigned to this subject."); 
      return; 
    }

    // Call parent sync function
    await updateData({ action: 'assign', assignment: assignData });
    setShowAssignModal(false);
    resetAssignForm();
  };

  const getCourseName = (id) => data.courses.find(c => String(c.id) === String(id))?.name || 'N/A';

  return (
    <div className="max-w-7xl mx-auto p-8 animate-in fade-in duration-500 min-h-screen bg-[#f8fafc]">
      
      {/* 1. HEADER */}
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
            <LayoutGrid size={12} /> {isAdmin ? 'ADMINISTRATION' : 'FACULTY'} / <span className="text-blue-600">CURRICULUM</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Subjects Management</h1>
          <p className="text-slate-500 font-bold mt-1">Manage institutional subjects and teaching allocations.</p>
        </div>

        {isAdmin && (
          <div className="flex gap-3">
            <button onClick={() => setShowAssignModal(true)} className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-black transition-all">
              <UserCheck size={16} /> Assign Faculty
            </button>
            <button onClick={() => { resetForm(); setShowModal(true); }} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all">
              <Plus size={16} /> Add Subject
            </button>
          </div>
        )}
      </div>

      {/* 2. STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white border border-slate-100 p-6 rounded-[2rem] shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <div className={`p-2 rounded-xl ${stat.color}`}>{stat.icon}</div>
            </div>
            <p className="text-2xl font-black text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* 3. MULTI-FILTER TOOLBAR */}
      <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-sm overflow-hidden mb-8">
        <div className="p-5 flex flex-col gap-5 bg-slate-50/40 border-b">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[300px]">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-14 pr-6 py-4 text-sm font-black border-2 border-white rounded-[1.5rem] outline-none focus:border-blue-200 bg-white shadow-sm" placeholder="Search subject or faculty..." />
            </div>

            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <select value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)} className="pl-11 pr-10 py-4 text-[11px] font-black uppercase border-2 border-white rounded-[1.5rem] outline-none bg-white shadow-sm text-slate-700 cursor-pointer appearance-none hover:border-blue-100">
                <option value="All Departments">All Departments</option>
                {data.courses.map(dept => <option key={dept.id} value={dept.id}>{dept.name}</option>)}
              </select>
            </div>

            <div className="flex bg-white p-1.5 rounded-[1.5rem] border-2 border-white shadow-sm gap-1">
              {semesters.map((sem) => (
                <button key={sem} onClick={() => setActiveSemester(sem)} className={`px-5 py-2.5 rounded-2xl text-[10px] font-black transition-all uppercase tracking-widest ${activeSemester === sem ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'}`}>SEM {sem}</button>
              ))}
            </div>
          </div>
        </div>

        {/* 4. TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white border-b text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              <tr>
                <th className="px-10 py-7">Code</th>
                <th className="px-10 py-7">Subject Name</th>
                <th className="px-10 py-7">Course</th>
                <th className="px-10 py-7 text-center">Credits</th>
                <th className="px-10 py-7">Assigned Faculty</th>
                {isAdmin && <th className="px-10 py-7 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 bg-white">
              {displayedSubjects.length > 0 ? displayedSubjects.map((s) => (
                <tr key={s.id} className="hover:bg-blue-50/20 transition-colors group">
                  <td className="px-10 py-6 text-[13px] font-black text-blue-600 uppercase">{s.code}</td>
                  <td className="px-10 py-6 text-sm font-black text-slate-900 uppercase tracking-tight">{s.name}</td>
                  <td className="px-10 py-6 text-[11px] font-bold text-slate-500 uppercase">{getCourseName(s.courseId || s.dept_id)}</td>
                  <td className="px-10 py-6 text-[13px] font-black text-slate-900 text-center">{s.credits}</td>
                  <td className="px-10 py-6">
                    <div className="flex flex-wrap gap-1.5">
                      {(data.teacherAssignments || []).filter(ta => String(ta.subjectId) === String(s.id)).map(a => {
                        const teacher = data.users.find(u => String(u.id) === String(a.teacherId));
                        return teacher ? <span key={a.id} className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-[9px] font-black uppercase tracking-tighter border border-slate-200">{teacher.name}</span> : null;
                      })}
                    </div>
                  </td>
                  {isAdmin && (
                    <td className="px-10 py-6 text-right">
                      <div className="flex justify-end gap-2 opacity-10 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => { setEditingSubject(s); setFormData({ name: s.name, code: s.code, semester: s.semester, credits: s.credits, courseId: s.courseId || s.dept_id }); setShowModal(true); }} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><Edit3 size={18}/></button>
                        <button onClick={() => handleDeleteSubject(s.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={18}/></button>
                      </div>
                    </td>
                  )}
                </tr>
              )) : (
                <tr><td colSpan="6" className="px-10 py-24 text-center text-slate-300 text-xs font-black uppercase tracking-[0.3em] italic bg-white">No subjects found for this selection</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. FOOTER NOTICE */}
      <div className={`p-6 rounded-[2.5rem] flex items-center gap-4 border-2 shadow-sm ${isAdmin ? 'bg-amber-50 border-amber-100 text-amber-800' : 'bg-blue-50 border-blue-100 text-blue-800'}`}>
        <div className={`p-3 rounded-2xl ${isAdmin ? 'bg-amber-100' : 'bg-blue-100'}`}><ShieldAlert size={24} /></div>
        <div>
          <p className="text-[12px] font-black uppercase tracking-[0.1em]">{isAdmin ? `Admin Privileges Active` : `Faculty View Mode`}</p>
          <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest mt-0.5">{isAdmin ? `Viewing ${selectedDept} records for Semester ${activeSemester}.` : `Showing live data for ${selectedDept} Semester ${activeSemester}.`}</p>
        </div>
      </div>

      {/* 6. MODALS */}

      {/* ADD/EDIT MODAL */}
      {isAdmin && showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-md p-12 animate-in zoom-in-95 duration-300 relative">
            <button onClick={() => setShowModal(false)} className="absolute top-8 right-8 text-slate-300 hover:text-slate-900 transition-colors"><X size={24}/></button>
            <h3 className="text-3xl font-black text-slate-900 mb-8 uppercase tracking-tighter">{editingSubject ? 'Edit Subject' : 'New Subject'}</h3>
            <form onSubmit={handleSubjectSubmit} className="space-y-6">
               <div className="space-y-1.5"><label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Subject Name</label><input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-4 text-sm font-black outline-none focus:border-blue-600 focus:bg-white transition-all shadow-inner" /></div>
               <div className="grid grid-cols-2 gap-6">
                 <div className="space-y-1.5"><label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Code</label><input type="text" required value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-4 text-sm font-black outline-none focus:border-blue-600 focus:bg-white transition-all shadow-inner" /></div>
                 <div className="space-y-1.5"><label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Credits</label><input type="number" required value={formData.credits} onChange={e => setFormData({...formData, credits: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-4 text-sm font-black outline-none focus:border-blue-600 focus:bg-white transition-all shadow-inner" /></div>
               </div>
               <div className="space-y-1.5"><label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Department</label>
                 <select required value={formData.courseId} onChange={e => setFormData({...formData, courseId: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-4 text-sm font-black outline-none focus:border-blue-600 focus:bg-white transition-all appearance-none cursor-pointer shadow-inner">
                    <option value="">Select Department</option>
                    {data.courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                 </select>
               </div>
               <div className="space-y-1.5"><label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Target Semester</label>
                 <select required value={formData.semester} onChange={e => setFormData({...formData, semester: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-4 text-sm font-black outline-none focus:border-blue-600 focus:bg-white transition-all appearance-none cursor-pointer shadow-inner">
                    {semesters.map(n => <option key={n} value={String(n)}>Semester {n}</option>)}
                 </select>
               </div>
               <div className="flex gap-4 pt-6">
                 <button type="submit" className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black text-xs uppercase shadow-xl hover:bg-blue-700 active:scale-95">Save</button>
                 <button onClick={() => { setShowModal(false); resetForm(); }} type="button" className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-2xl font-black text-xs uppercase hover:bg-slate-200">Discard</button>
               </div>
            </form>
          </div>
        </div>
      )}

      {/* ASSIGNMENT MODAL (FIXED) */}
      {isAdmin && showAssignModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-md p-12 animate-in zoom-in-95 duration-300 relative">
            <button onClick={() => setShowAssignModal(false)} className="absolute top-8 right-8 text-slate-300 hover:text-slate-900 transition-colors"><X size={24}/></button>
            <h3 className="text-3xl font-black text-slate-900 mb-8 uppercase tracking-tighter">Assign Faculty</h3>
            <form onSubmit={handleAssignSubmit} className="space-y-6">
              {error && <div className="bg-red-50 text-red-600 p-5 rounded-2xl text-[10px] font-black flex items-center gap-3 border-2 border-red-100 uppercase tracking-widest"><AlertCircle size={20} /> {error}</div>}
              
              <div className="space-y-1.5"><label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Subject (SEM {activeSemester})</label>
                <select required value={assignData.subjectId} onChange={e => setAssignData({...assignData, subjectId: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-4 text-sm font-black outline-none focus:border-blue-600 focus:bg-white transition-all appearance-none cursor-pointer shadow-inner">
                  <option value="">-- Choose Subject --</option>
                  {/* Context-aware dropdown based on active filters */}
                  {data.subjects.filter(s => Number(s.semester) === activeSemester && (selectedDept === 'All Departments' || String(s.courseId || s.dept_id) === String(selectedDept))).map(s => <option key={s.id} value={s.id}>{s.code} - {s.name}</option>)}
                </select>
              </div>

              <div className="space-y-1.5"><label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Faculty Member</label>
                <select required value={assignData.teacherId} onChange={e => setAssignData({...assignData, teacherId: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-4 text-sm font-black outline-none focus:border-blue-600 focus:bg-white transition-all appearance-none cursor-pointer shadow-inner">
                  <option value="">-- Choose Teacher --</option>
                  {data.users.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>

              <div className="flex gap-4 pt-6">
                <button type="submit" className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase shadow-xl hover:bg-black active:scale-95">Finalize</button>
                <button onClick={() => { setShowAssignModal(false); resetAssignForm(); }} type="button" className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-2xl font-black text-xs uppercase hover:bg-slate-200">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default SubjectsManagement;