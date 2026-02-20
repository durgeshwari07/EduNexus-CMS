import React, { useState, useMemo } from 'react';
import { 
  Plus, Edit3, Trash2, Search, Filter, AlertCircle, 
  X, ShieldAlert, LayoutGrid, BookOpen, UserCheck, Award, Layers 
} from 'lucide-react';

export function SubjectsManagement({ data, updateData, readOnly }) {
  // --- STATE LOGIC ---
  const [showModal, setShowModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [error, setError] = useState('');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [semesterFilter, setSemesterFilter] = useState('All Semesters');

  const [formData, setFormData] = useState({ name: '', code: '', semester: '1', credits: '', courseId: '' });
  const [assignData, setAssignData] = useState({ subjectId: '', teacherId: '', academicYearId: '2024-25' });

  // --- STATISTICS LOGIC ---
  const stats = [
    { label: 'Total Subjects', value: (data.subjects || []).length, icon: <BookOpen size={16} />, color: 'bg-blue-50 text-blue-600' },
    { label: 'Faculty Load', value: (data.teacherAssignments || []).length, icon: <UserCheck size={16} />, color: 'bg-indigo-50 text-indigo-600' },
    { label: 'Total Credits', value: (data.subjects || []).reduce((acc, s) => acc + (Number(s.credits) || 0), 0), icon: <Award size={16} />, color: 'bg-green-50 text-green-600' },
    { label: 'Curriculum Year', value: '2024-25', icon: <Layers size={16} />, color: 'bg-slate-50 text-slate-600' },
  ];

  // --- FILTER LOGIC ---
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

  // --- HANDLERS ---
  const resetForm = () => { 
    setFormData({ name: '', code: '', semester: '1', credits: '', courseId: '' }); 
    setEditingSubject(null);
    setError(''); 
  };
  
  const resetAssignForm = () => { 
    setAssignData({ subjectId: '', teacherId: '', academicYearId: '2024-25' }); 
    setError(''); 
  };

  const handleSubjectSubmit = (e) => {
    e.preventDefault();
    if (readOnly) return;

    let updatedSubjects;
    if (editingSubject) {
      updatedSubjects = data.subjects.map(s => 
        String(s.id) === String(editingSubject.id) ? { ...s, ...formData } : s
      );
    } else {
      updatedSubjects = [...data.subjects, { ...formData, id: `sub${Date.now()}` }];
    }
    
    updateData({ ...data, subjects: updatedSubjects });
    setShowModal(false);
    resetForm();
  };

  const handleDeleteSubject = (id) => {
    if (readOnly) return;
    if (window.confirm("Are you sure you want to delete this subject? This will also remove associated teacher assignments.")) {
      const updatedSubjects = data.subjects.filter(s => String(s.id) !== String(id));
      const updatedAssignments = (data.teacherAssignments || []).filter(ta => String(ta.subjectId) !== String(id));
      updateData({ ...data, subjects: updatedSubjects, teacherAssignments: updatedAssignments });
    }
  };

  const handleAssignSubmit = (e) => {
    e.preventDefault();
    if (readOnly) return;

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
    <div className="max-w-7xl mx-auto p-8 animate-in fade-in duration-500">
      
      {/* 1. HEADER SECTION */}
      <div className="mb-10 text-left flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
            <LayoutGrid size={12} /> Dashboard / <span className="text-blue-600">SUBJECTS</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Subjects Management</h1>
          <p className="text-slate-500 font-bold mt-1">Manage departmental curriculum and faculty course loads.</p>
        </div>

        {!readOnly && (
          <div className="flex gap-3">
            <button 
              onClick={() => setShowAssignModal(true)} 
              className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-black transition-all"
            >
              Assign Teacher
            </button>
            <button 
              onClick={() => { resetForm(); setShowModal(true); }} 
              className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all"
            >
              <Plus size={14} /> Add Subject
            </button>
          </div>
        )}
      </div>

      {/* 2. STATISTICS GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <div className={`p-1.5 rounded-lg ${stat.color}`}>{stat.icon}</div>
            </div>
            <p className="text-xl font-black text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* 3. TOOLBAR & TABLE ACTION BAR */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-6">
        <div className="p-4 flex flex-wrap gap-4 items-center bg-slate-50/30">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              className="w-full pl-10 pr-4 py-2.5 text-xs font-black border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 text-slate-900" 
              placeholder="Search code, subject or teacher..." 
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <select 
              value={semesterFilter} 
              onChange={(e) => setSemesterFilter(e.target.value)} 
              className="pl-9 pr-8 py-2.5 text-xs font-black uppercase tracking-widest border border-slate-200 rounded-xl outline-none bg-white appearance-none cursor-pointer text-slate-900"
            >
              <option value="All Semesters">All Semesters</option>
              {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={String(n)}>Semester {n}</option>)}
            </select>
          </div>
        </div>

        {/* 4. MAIN SUBJECT TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b text-[15px] font-black text-slate-400 uppercase tracking-[0.1em]">
              <tr>
                <th className="px-6 py-5">Code</th>
                <th className="px-6 py-5">Subject Name</th>
                <th className="px-6 py-5">Course</th>
                <th className="px-6 py-5 text-center">Semester</th>
                <th className="px-6 py-5 text-center">Credits</th>
                <th className="px-6 py-5">Assigned Faculty</th>
                {!readOnly && <th className="px-6 py-5 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredSubjects.map((s) => (
                <tr key={s.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-6 py-4 text-[13px] font-black text-blue-600 uppercase">{s.code}</td>
                  <td className="px-6 py-4 text-xs font-black text-slate-900 uppercase">{s.name}</td>
                  <td className="px-6 py-4 text-[13px] font-black text-slate-500 uppercase">{getCourseName(s.courseId)}</td>
                  <td className="px-6 py-4 text-[13px] font-black text-slate-900 text-center">Sem {s.semester}</td>
                  <td className="px-6 py-4 text-[13px] font-black text-slate-900 text-center">{s.credits}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {(data.teacherAssignments || [])
                        .filter(ta => String(ta.subjectId) === String(s.id))
                        .map(a => {
                          const teacher = data.users.find(u => String(u.id) === String(a.teacherId));
                          // Determine color based on user type (Blue=Permanent, Green=Lecture)
                          const badgeColor = teacher?.type?.toLowerCase() === 'permanent' ? 'bg-blue-600' : 'bg-green-600';
                          return teacher ? (
                            <span key={a.id} className={`inline-flex items-center px-2 py-0.5 rounded-md ${badgeColor} text-white text-[9px] font-black uppercase tracking-tighter shadow-sm`}>
                              {teacher.name}
                            </span>
                          ) : null;
                        })}
                    </div>
                  </td>
                  {!readOnly && (
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <button 
                          onClick={() => { 
                            setEditingSubject(s); 
                            setFormData({ name: s.name, code: s.code, semester: s.semester, credits: s.credits, courseId: s.courseId }); 
                            setShowModal(true); 
                          }} 
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        >
                          <Edit3 size={16}/>
                        </button>
                        <button 
                          onClick={() => handleDeleteSubject(s.id)} 
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 size={16}/>
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. READ-ONLY ALERT */}
      {readOnly && (
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-center gap-3">
          <ShieldAlert className="text-blue-600" size={20} />
          <p className="text-[10px] font-black text-blue-700 uppercase tracking-widest">
            Read-Only: Curriculum modifications are restricted to system administrators.
          </p>
        </div>
      )}

      {/* 6. SUBJECT MODAL (Styled for Readability) */}
      {!readOnly && showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md p-8 animate-in zoom-in-95 duration-200">
            <h3 className="text-2xl font-black text-slate-900 mb-6 uppercase tracking-tight">
              {editingSubject ? 'Update Subject' : 'New Subject'}
            </h3>
            <form onSubmit={handleSubjectSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[15px] font-black text-slate-400 uppercase tracking-widest">Subject Name</label>
                <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-black text-slate-900 outline-none focus:ring-2 focus:ring-blue-100" />
              </div>
              <div className="space-y-1">
                <label className="text-[15px] font-black text-slate-400 uppercase tracking-widest">Subject Code</label>
                <input type="text" required value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-black text-slate-900 outline-none focus:ring-2 focus:ring-blue-100" />
              </div>
              <div className="space-y-1">
                <label className="text-[15px] font-black text-slate-400 uppercase tracking-widest">Course/Dept</label>
                <select required value={formData.courseId} onChange={e => setFormData({...formData, courseId: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-black text-slate-900 outline-none appearance-none">
                  <option value="">Select Course</option>
                  {data.courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[15px] font-black text-slate-400 uppercase tracking-widest">Semester</label>
                  <select required value={formData.semester} onChange={e => setFormData({...formData, semester: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-black text-slate-900 outline-none">
                    {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={String(n)}>{n}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Credits</label>
                  <input type="number" required value={formData.credits} onChange={e => setFormData({...formData, credits: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-black text-slate-900 outline-none" />
                </div>
              </div>
              <div className="flex gap-3 pt-6">
                <button type="submit" className="flex-1 bg-blue-600 text-white py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">Save Data</button>
                <button onClick={() => { setShowModal(false); resetForm(); }} type="button" className="flex-1 bg-slate-100 text-slate-600 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest">Discard</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. ASSIGN MODAL */}
      {!readOnly && showAssignModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md p-8 animate-in zoom-in-95 duration-200">
            <h3 className="text-2xl font-black text-slate-900 mb-6 uppercase tracking-tight">Assign Faculty</h3>
            <form onSubmit={handleAssignSubmit} className="space-y-4">
              {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-black flex items-center gap-2 border border-red-100"><AlertCircle size={14} /> {error}</div>}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Subject</label>
                <select required value={assignData.subjectId} onChange={e => setAssignData({...assignData, subjectId: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-black text-slate-900 outline-none">
                  <option value="">-- Choose Subject --</option>
                  {data.subjects.map(s => <option key={s.id} value={s.id}>{s.code} - {s.name}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Teacher</label>
                <select required value={assignData.teacherId} onChange={e => setAssignData({...assignData, teacherId: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-black text-slate-900 outline-none">
                  <option value="">-- Choose Teacher --</option>
                  {data.users.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
              <div className="flex gap-3 pt-6">
                <button type="submit" className="flex-1 bg-slate-900 text-white py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all">Assign</button>
                <button onClick={() => { setShowAssignModal(false); resetAssignForm(); }} type="button" className="flex-1 bg-slate-100 text-slate-600 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default SubjectsManagement;