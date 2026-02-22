// import React, { useState } from 'react';
// import { Plus, ArrowLeft, LayoutGrid } from 'lucide-react';
// import StudentBatchCard from '../components/students/StudentBatchCard';
// import StudentListTable from '../components/students/StudentListTable';

// export default function Students({ 
//   userRole, 
//   batches = [], 
//   allStudents = [], 
//   onAddBatch, 
//   onAddStudent,
//   onDeleteStudent // Received from App.js
// }) {
//   const [selectedBatch, setSelectedBatch] = useState(null);
//   const [activeFilter, setActiveFilter] = useState('All');
//   const isAdmin = userRole === 'admin';

//   const filterOptions = ['All', ...new Set(batches.map(b => b.dept))];
//   const filteredBatches = activeFilter === 'All' ? batches : batches.filter(b => b.dept === activeFilter);

//   return (
//     <div className="max-w-7xl mx-auto p-8 animate-in fade-in duration-500">
//       <div className="mb-10 text-left">
//         <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
//           <LayoutGrid size={12} /> Dashboard / <span className="text-blue-600">Students</span>
//         </div>
//         <h1 className="text-4xl font-black text-slate-900 tracking-tight">Student Directory</h1>
//         <p className="text-slate-500 font-medium mt-1">Manage departmental enrollment and batch-based student records.</p>
//       </div>

//       {!selectedBatch ? (
//         <div className="space-y-10">
//           {isAdmin && (
//             <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm border-t-4 border-t-blue-600 text-left">
//               <h3 className="font-bold text-xs text-slate-400 uppercase tracking-wider mb-4">Register New Batch</h3>
//               <form onSubmit={(e) => {
//                 e.preventDefault();
//                 const fd = new FormData(e.target);
//                 onAddBatch({ 
//                   dept: fd.get('dept'), 
//                   batch: fd.get('batch'), 
//                   hod: fd.get('hod'), 
//                   year: fd.get('year') 
//                 });
//                 e.target.reset();
//               }} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
//                 <FormGroup label="Department" name="dept" placeholder="BCA" />
//                 <FormGroup label="Batch Year" name="batch" placeholder="2024" />
//                 <FormGroup label="HoD" name="hod" placeholder="Dr. Turing" />
//                 <FormGroup label="Year" name="year" placeholder="Year 1" />
//                 <button type="submit" className="bg-blue-600 text-white py-3 rounded-xl font-bold text-xs shadow-lg shadow-blue-200 hover:bg-blue-700 transition">Create Batch</button>
//               </form>
//             </div>
//           )}

//           <div className="flex justify-between items-center border-b border-slate-100 pb-6">
//             <h3 className="font-black text-xl text-slate-900">Batch Management</h3>
//             <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-1 border border-slate-200">
//               {filterOptions.map(f => (
//                 <button key={f} onClick={() => setActiveFilter(f)} className={`px-6 py-2 text-xs font-black rounded-xl transition-all ${activeFilter === f ? 'bg-white text-blue-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500'}`}>{f}</button>
//               ))}
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//             {filteredBatches.map(b => (
//               <StudentBatchCard key={b.id} batch={b} onSelect={setSelectedBatch} students={allStudents} />
//             ))}
//           </div>
//         </div>
//       ) : (
//         <div className="animate-in slide-in-from-right-4 duration-500">
//           <button onClick={() => setSelectedBatch(null)} className="flex items-center gap-2 text-xs font-black text-slate-500 hover:text-blue-600 mb-6 transition-colors">
//             <ArrowLeft size={16} /> Back to Batches
//           </button>
//           <StudentListTable 
//             batch={selectedBatch} 
//             // Ensures filtering works even if IDs are stored as strings in DB but numbers in JS
//             students={allStudents.filter(s => String(s.batchId) === String(selectedBatch.id))} 
//             onAddStudent={onAddStudent} 
//             onDeleteStudent={onDeleteStudent} // Crucial link
//             isAdmin={isAdmin} 
//           />
//         </div>
//       )}
//     </div>
//   );
// }

// const FormGroup = ({ label, name, placeholder }) => (
//   <div className="space-y-2 text-left">
//     <label className="text-[10px] font-black text-slate-400 uppercase">{label}</label>
//     <input name={name} placeholder={placeholder} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none focus:ring-2 focus:ring-blue-100 transition font-medium text-slate-900" required />
//   </div>
// );


import React, { useState } from 'react';
import { ArrowLeft, LayoutGrid, ChevronDown } from 'lucide-react';
import StudentBatchCard from '../components/students/StudentBatchCard';
import StudentListTable from '../components/students/StudentListTable';

export default function Students({ 
  userRole, 
  batches = [], 
  allStudents = [], 
  displayDepts = [], 
  onAddBatch, 
  onAddStudent,
  onDeleteStudent 
}) {
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');
  
  // --- FORM STATE ---
  const [formData, setFormData] = useState({
    deptId: '',
    deptName: '',
    hod: '',
    startYear: '2024',
    duration: '3', // Default 3 years
  });

  const isAdmin = userRole === 'admin';

  // --- DYNAMIC CALCULATIONS ---
  const endYear = parseInt(formData.startYear) + parseInt(formData.duration);
  const totalSemesters = parseInt(formData.duration) * 2;
  const batchLabel = `${formData.startYear}-${endYear}`;

  const filterOptions = ['All', ...new Set(batches.map(b => b.dept))];
  const filteredBatches = activeFilter === 'All' ? batches : batches.filter(b => b.dept === activeFilter);

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
    onAddBatch({ 
      dept: formData.deptName, 
      batch: batchLabel, // e.g., "2024-2027"
      hod: formData.hod, 
      year: "Year 1",    // System automatically sets
      semester: 1,       // System automatically sets
      status: "Active"   // System automatically sets
    });

    // Reset Form
    setFormData({ deptId: '', deptName: '', hod: '', startYear: '2024', duration: '3' });
    e.target.reset();
  };

  return (
    <div className="max-w-7xl mx-auto p-8 animate-in fade-in duration-500">
      <div className="mb-10 text-left">
        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
          <LayoutGrid size={12} /> Dashboard / <span className="text-blue-600">Students</span>
        </div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Student Directory</h1>
        <p className="text-slate-500 font-medium mt-1">Manage departmental enrollment and batch-based student records.</p>
      </div>

      {!selectedBatch ? (
        <div className="space-y-10">
          {isAdmin && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm border-t-4 border-t-blue-600 text-left">
              <h3 className="font-bold text-xs text-slate-400 uppercase tracking-wider mb-4">Register New Batch</h3>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-5 items-end">
                
                {/* 1. Department Dropdown */}
                <div className="md:col-span-3 space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Department</label>
                  <select 
                    required 
                    value={formData.deptId}
                    onChange={handleDeptChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-50 rounded-xl outline-none focus:border-[#136dec] focus:bg-white transition-all text-sm font-bold text-slate-700 cursor-pointer"
                  >
                    <option value="">-- Select --</option>
                    {displayDepts.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>

                {/* 2. Start Year */}
                <div className="md:col-span-2 space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Start Year</label>
                  <input 
                    type="number" 
                    value={formData.startYear}
                    onChange={(e) => setFormData({...formData, startYear: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-50 rounded-xl outline-none focus:border-[#136dec] text-sm font-bold text-slate-700"
                  />
                </div>

                {/* 3. Course Duration */}
                <div className="md:col-span-2 space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Duration</label>
                  <select 
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-50 rounded-xl outline-none focus:border-[#136dec] text-sm font-bold text-slate-700 cursor-pointer"
                  >
                    <option value="3">3 Years</option>
                    <option value="4">4 Years</option>
                  </select>
                </div>

                {/* 4. Auto-Calculated End Year & Semesters */}
                <div className="md:col-span-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase ml-1">End Year</label>
                      <div className="px-4 py-2.5 bg-blue-50 border-2 border-blue-50 rounded-xl text-sm font-black text-blue-600">
                        {endYear}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Total Sems</label>
                      <div className="px-4 py-2.5 bg-green-50 border-2 border-green-50 rounded-xl text-sm font-black text-green-600">
                        {totalSemesters}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="md:col-span-2">
                  <button type="submit" className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-blue-200 hover:bg-blue-700 transition h-[44px]">
                    Create Batch
                  </button>
                </div>
              </form>
              
              {/* Info Tags */}
              <div className="mt-4 flex gap-4">
                <span className="text-[9px] bg-slate-100 px-2 py-1 rounded text-slate-500 font-bold">CURRENT SEM: 1</span>
                <span className="text-[9px] bg-slate-100 px-2 py-1 rounded text-slate-500 font-bold">STATUS: ACTIVE</span>
                <span className="text-[9px] bg-slate-100 px-2 py-1 rounded text-slate-500 font-bold">HOD: {formData.hod || 'None'}</span>
              </div>
            </div>
          )}

          {/* Rest of the UI (Filters and Cards) remains the same */}
          <div className="flex justify-between items-center border-b border-slate-100 pb-6">
            <h3 className="font-black text-xl text-slate-900">Batch Management</h3>
            <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-1 border border-slate-200">
              {filterOptions.map(f => (
                <button key={f} onClick={() => setActiveFilter(f)} className={`px-6 py-2 text-xs font-black rounded-xl transition-all ${activeFilter === f ? 'bg-white text-blue-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500'}`}>{f}</button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {filteredBatches.map(b => (
              <StudentBatchCard key={b.id} batch={b} onSelect={setSelectedBatch} students={allStudents} />
            ))}
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