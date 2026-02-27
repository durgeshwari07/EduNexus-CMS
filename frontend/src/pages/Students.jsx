


import React, { useState } from 'react';
import { ArrowLeft, LayoutGrid } from 'lucide-react';
import StudentBatchCard from '../components/students/StudentBatchCard';
import StudentListTable from '../components/students/StudentListTable';

export default function Students({ 
  userRole, 
  batches = [], 
  allStudents = [], 
  displayDepts = [], 
  onAddBatch, 
  onAddStudent,
  onDeleteStudent,
  updateData,
  allMarks = [] 
}) {
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');
  // New State for Year Filter
  const [activeYearFilter, setActiveYearFilter] = useState('All');
  
  const [formData, setFormData] = useState({
    deptId: '',
    deptName: '',
    hod: '',
    startYear: '2024',
    duration: '3',
  });

  const isAdmin = userRole === 'admin';
  const endYear = parseInt(formData.startYear) + parseInt(formData.duration);
  const totalSemesters = parseInt(formData.duration) * 2;
  const batchLabel = `${formData.startYear}-${endYear}`;

  // 1. Logic to handle unique batches (removes duplicates)
  const uniqueBatches = Object.values(
    batches.reduce((acc, current) => {
      const key = `${current.dept}-${current.batch}`;
      if (!acc[key] || parseInt(current.id) > parseInt(acc[key].id)) {
        acc[key] = current;
      }
      return acc;
    }, {})
  );

  // 2. Generate Filter Options
  const deptOptions = ['All', ...new Set(uniqueBatches.map(b => b.dept))];
  const yearOptions = ['All', ...new Set(uniqueBatches.map(b => b.batch))];

  // 3. Combined Filtering Logic (Dept + Year)
  const filteredBatches = uniqueBatches.filter(b => {
    const matchDept = activeFilter === 'All' || b.dept === activeFilter;
    const matchYear = activeYearFilter === 'All' || b.batch === activeYearFilter;
    return matchDept && matchYear;
  });

  const handleDeptChange = (e) => {
    const deptId = e.target.value;
    const selectedDept = displayDepts.find(d => String(d.id) === String(deptId));
    setFormData({
      ...formData,
      deptId: deptId,
      deptName: selectedDept ? selectedDept.name : '',
      hod: selectedDept ? (selectedDept.hod || 'Not Assigned') : ''
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isDuplicate = batches.some(b => b.dept === formData.deptName && b.batch === batchLabel);
    if (isDuplicate) {
      alert(`The batch ${batchLabel} already exists for ${formData.deptName}.`);
      return;
    }
    onAddBatch({ 
      dept: formData.deptName, 
      batch: batchLabel, 
      hod: formData.hod, 
      year: "Year 1",
      semester: 1,
      status: "Active"
    });
    setFormData({ deptId: '', deptName: '', hod: '', startYear: '2024', duration: '3' });
    e.target.reset();
  };

  return (
    <div className="max-w-7xl mx-auto p-2 animate-in fade-in duration-500 text-left">
      <div className="mb-10">
        {/* <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
          <LayoutGrid size={12} /> Dashboard / <span className="text-blue-600">Students</span>
        </div> */}
        {/* <h1 className="text-4xl font-black text-slate-900 tracking-tight">Student Directory</h1> */}
         <h1 className="text-[2rem] font-black text-[#0f172a] leading-tight tracking-tight">
            Student Directory
          </h1>
        <p className="text-slate-500 font-medium mt-1">Manage departmental enrollment and batch-based student records.</p>
      </div>

      {!selectedBatch ? (
        <div className="space-y-10">
          {isAdmin && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm border-t-4 border-t-blue-600">
              <h3 className="font-bold text-xs text-slate-400 uppercase tracking-wider mb-4">Register New Batch</h3>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-5 items-end">
                <div className="md:col-span-3 space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Department</label>
                  <select required value={formData.deptId} onChange={handleDeptChange} className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-50 rounded-xl outline-none focus:border-blue-600 text-sm font-bold text-slate-700">
                    <option value="">-- Select --</option>
                    {displayDepts.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Start Year</label>
                  <input type="number" value={formData.startYear} onChange={(e) => setFormData({...formData, startYear: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-50 rounded-xl outline-none focus:border-blue-600 text-sm font-bold text-slate-700" />
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Duration</label>
                  <select value={formData.duration} onChange={(e) => setFormData({...formData, duration: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-50 rounded-xl outline-none focus:border-blue-600 text-sm font-bold text-slate-700">
                    <option value="3">3 Years</option>
                    <option value="4">4 Years</option>
                  </select>
                </div>
                <div className="md:col-span-3">
                    <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1 text-center">
                            <label className="text-[10px] font-black text-slate-400 uppercase">End Year</label>
                            <div className="px-4 py-2.5 bg-blue-50 rounded-xl text-sm font-black text-blue-600">{endYear}</div>
                        </div>
                        <div className="space-y-1 text-center">
                            <label className="text-[10px] font-black text-slate-400 uppercase">Sems</label>
                            <div className="px-4 py-2.5 bg-green-50 rounded-xl text-sm font-black text-green-600">{totalSemesters}</div>
                        </div>
                    </div>
                </div>
                <div className="md:col-span-2">
                  <button type="submit" className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-blue-200 hover:bg-blue-700 transition h-[44px]">Create Batch</button>
                </div>
              </form>
            </div>
          )}

          {/* FILTERS SECTION */}
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-6">
              <h3 className="font-black text-xl text-slate-900 uppercase tracking-tight">Batch Management</h3>
              
              <div className="flex flex-wrap gap-4">
                {/* Department Filter */}
                <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                  <select 
                    value={activeFilter} 
                    onChange={(e) => setActiveFilter(e.target.value)}
                    className="bg-transparent px-3 py-1.5 text-[11px] font-black text-slate-600 outline-none cursor-pointer"
                  >
                    {deptOptions.map(opt => <option key={opt} value={opt}>{opt === 'All' ? 'All Departments' : opt}</option>)}
                  </select>
                </div>

                {/* Year Filter */}
                <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                  <select 
                    value={activeYearFilter} 
                    onChange={(e) => setActiveYearFilter(e.target.value)}
                    className="bg-transparent px-3 py-1.5 text-[11px] font-black text-slate-600 outline-none cursor-pointer"
                  >
                    {yearOptions.map(opt => <option key={opt} value={opt}>{opt === 'All' ? 'All Years' : opt}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {filteredBatches.length > 0 ? (
              filteredBatches.map(b => (
                <StudentBatchCard 
                  key={b.id} 
                  batch={b} 
                  onSelect={setSelectedBatch} 
                  students={allStudents}
                  allMarks={allMarks}
                  updateData={updateData}
                />
              ))
            ) : (
              <div className="col-span-full py-20 text-center bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">No matching batches found</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="animate-in slide-in-from-right-4 duration-500">
          <button onClick={() => setSelectedBatch(null)} className="flex items-center gap-2 text-xs font-black text-slate-500 hover:text-blue-600 mb-6 transition-colors">
            <ArrowLeft size={16} /> Back to Batches
          </button>
          <StudentListTable 
            batch={selectedBatch} 
            students={allStudents.filter(s => String(s.batchId) === String(selectedBatch.id))} 
            onAddStudent={onAddStudent} 
            onDeleteStudent={onDeleteStudent} 
            isAdmin={isAdmin} 
          />
        </div>
      )}
    </div>
  );
}