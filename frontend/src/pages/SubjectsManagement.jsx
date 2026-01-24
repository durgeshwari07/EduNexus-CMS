import React, { useState, useMemo } from 'react';
import { Plus, Edit3, Trash2, Search, Filter, AlertCircle, X } from 'lucide-react';

export function SubjectsManagement({ data, updateData }) {
  const [showModal, setShowModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [error, setError] = useState('');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [semesterFilter, setSemesterFilter] = useState('All Semesters');

  const [formData, setFormData] = useState({ name: '', code: '', semester: '1', credits: '', courseId: '' });
  const [assignData, setAssignData] = useState({ subjectId: '', teacherId: '', academicYearId: '2024-25' });

  // --- Logic: Search and Filter ---
  const filteredSubjects = useMemo(() => {
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
      
      const matchesSem = semesterFilter === 'All Semesters' || String(s.semester) === semesterFilter;
      
      return matchesSearch && matchesSem;
    });
  }, [data.subjects, searchQuery, semesterFilter, data.teacherAssignments, data.users]);

  // --- Handlers ---
  const resetForm = () => { 
    setFormData({ name: '', code: '', semester: '1', credits: '', courseId: '' }); 
    setEditingSubject(null);
    setError(''); 
  };
  
  const resetAssignForm = () => { setAssignData({ subjectId: '', teacherId: '', academicYearId: '2024-25' }); setError(''); };

  const handleSubjectSubmit = (e) => {
    e.preventDefault();
    let updatedSubjects;
    
    if (editingSubject) {
      // EDIT LOGIC
      updatedSubjects = data.subjects.map(s => 
        String(s.id) === String(editingSubject.id) ? { ...s, ...formData } : s
      );
    } else {
      // ADD LOGIC
      updatedSubjects = [...data.subjects, { ...formData, id: `sub${Date.now()}` }];
    }
    
    updateData({ ...data, subjects: updatedSubjects });
    setShowModal(false);
    resetForm();
  };

  const handleDeleteSubject = (id) => {
    if (window.confirm("Are you sure you want to delete this subject? This will also remove associated teacher assignments.")) {
      const updatedSubjects = data.subjects.filter(s => String(s.id) !== String(id));
      const updatedAssignments = (data.teacherAssignments || []).filter(ta => String(ta.subjectId) !== String(id));
      
      updateData({ 
        ...data, 
        subjects: updatedSubjects,
        teacherAssignments: updatedAssignments 
      });
    }
  };

  const handleAssignSubmit = (e) => {
    e.preventDefault();
    const isAlreadyAssigned = data.teacherAssignments?.some(
      a => String(a.subjectId) === String(assignData.subjectId) && String(a.teacherId) === String(assignData.teacherId)
    );

    if (isAlreadyAssigned) { 
      setError("This teacher is already assigned to this subject."); 
      return; 
    }

    updateData({ 
      ...data, 
      teacherAssignments: [...(data.teacherAssignments || []), { ...assignData, id: `ta${Date.now()}` }] 
    });
    setShowAssignModal(false);
    resetAssignForm();
  };

  const getCourseName = (id) => {
    const course = data.courses.find(c => String(c.id) === String(id));
    return course ? course.name : 'N/A';
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-7xl mx-auto p-8 space-y-8 bg-[#f8fafc] min-h-screen font-sans text-slate-900">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Subjects Management</h1>
          <p className="text-slate-500 font-medium mt-1">Manage curriculum and faculty course loads.</p>
        </div>
        <div className="flex gap-4">
          <button onClick={() => setShowAssignModal(true)} className="flex items-center gap-2 bg-[#00b341] text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-all hover:bg-[#009a37] active:scale-95 shadow-md">
            <Plus size={18} /> Assign Teacher
          </button>
          <button onClick={() => { resetForm(); setShowModal(true); }} className="flex items-center gap-2 bg-[#2563eb] text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-all hover:bg-[#1d4ed8] active:scale-95 shadow-md">
            <Plus size={18} /> Add Subject
          </button>
        </div>
      </div>

      {/* SEARCH TOOLBAR */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-sm font-semibold focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" placeholder="Search code, subject or teacher..." />
        </div>
        <div className="relative w-full md:w-64">
           <Filter size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
           <select value={semesterFilter} onChange={(e) => setSemesterFilter(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-10 pr-8 text-sm font-bold text-slate-700 outline-none appearance-none cursor-pointer">
              <option value="All Semesters">All Semesters</option>
              {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={String(n)}>Semester {n}</option>)}
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
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Assigned Faculty</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSubjects.map((s) => (
                <tr key={s.id} className="hover:bg-blue-50/50 transition-colors group">
                  <td className="px-6 py-6 font-black text-blue-600 text-sm">{s.code}</td>
                  <td className="px-6 py-6 font-bold text-slate-900 text-sm">{s.name}</td>
                  <td className="px-6 py-6 text-sm text-slate-600 font-bold uppercase tracking-tight">{getCourseName(s.courseId)}</td>
                  <td className="px-6 py-6 text-sm text-slate-600 font-bold">Sem {s.semester}</td>
                  <td className="px-6 py-6 text-sm text-slate-600 font-bold">{s.credits}</td>
                  <td className="px-6 py-6">
                    <div className="flex flex-wrap gap-2">
                      {(data.teacherAssignments || [])
                        .filter(ta => String(ta.subjectId) === String(s.id))
                        .map(a => {
                          const teacher = data.users.find(u => String(u.id) === String(a.teacherId));
                          return teacher ? (
                            <span key={a.id} className="inline-flex items-center px-3 py-1 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-tighter shadow-sm">
                              {teacher.name}
                            </span>
                          ) : null;
                        })}
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex justify-center gap-3">
                      <button onClick={() => { 
                        setEditingSubject(s); 
                        setFormData({ name: s.name, code: s.code, semester: s.semester, credits: s.credits, courseId: s.courseId }); 
                        setShowModal(true); 
                      }} className="text-blue-600 hover:scale-110 transition-transform"><Edit3 size={18}/></button>
                      <button onClick={() => handleDeleteSubject(s.id)} className="text-red-500 hover:scale-110 transition-transform"><Trash2 size={18}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SUBJECT MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 text-left">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 animate-in zoom-in-95 duration-200">
            <h3 className="text-2xl font-black text-slate-900 mb-6">{editingSubject ? 'Edit Subject' : 'Add New Subject'}</h3>
            <form onSubmit={handleSubjectSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Subject Name</label>
                <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-bold text-slate-900 outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Subject Code</label>
                <input type="text" required value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-bold text-slate-900 outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Course/Department</label>
                <select required value={formData.courseId} onChange={e => setFormData({...formData, courseId: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-bold text-slate-900 outline-none">
                  <option value="">Select Course</option>
                  {data.courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Semester</label>
                  <select required value={formData.semester} onChange={e => setFormData({...formData, semester: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-bold text-slate-900 outline-none">
                    {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={String(n)}>{n}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Credits</label>
                  <input type="number" required value={formData.credits} onChange={e => setFormData({...formData, credits: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-bold text-slate-900 outline-none" />
                </div>
              </div>
              <div className="flex gap-3 pt-6">
                <button type="submit" className="flex-1 bg-slate-900 text-white py-3 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-black transition-all">Save Subject</button>
                <button onClick={() => { setShowModal(false); resetForm(); }} type="button" className="flex-1 bg-slate-100 text-slate-600 py-3 rounded-xl font-black text-sm uppercase tracking-widest">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ASSIGN FACULTY MODAL */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 text-left">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 animate-in zoom-in-95 duration-200">
            <h3 className="text-2xl font-black text-slate-900 mb-6">Assign Faculty</h3>
            <form onSubmit={handleAssignSubmit} className="space-y-4">
              {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-xs font-bold flex items-center gap-2"><AlertCircle size={14} /> {error}</div>}
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Select Subject</label>
                <select required value={assignData.subjectId} onChange={e => setAssignData({...assignData, subjectId: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-bold text-slate-900 outline-none">
                  <option value="">-- Choose --</option>
                  {data.subjects.map(s => <option key={s.id} value={s.id}>{s.code} - {s.name}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Select Teacher</label>
                <select required value={assignData.teacherId} onChange={e => setAssignData({...assignData, teacherId: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-bold text-slate-900 outline-none">
                  <option value="">-- Choose --</option>
                  {data.users.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
              <div className="flex gap-3 pt-6">
                <button type="submit" className="flex-1 bg-slate-900 text-white py-3 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-black transition-all">Complete Assignment</button>
                <button onClick={() => { setShowAssignModal(false); resetAssignForm(); }} type="button" className="flex-1 bg-slate-100 text-slate-600 py-3 rounded-xl font-black text-sm uppercase tracking-widest">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default SubjectsManagement;