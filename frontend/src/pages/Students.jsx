



// import React, { useState } from 'react';
// import { ArrowLeft, LayoutGrid } from 'lucide-react';
// import StudentBatchCard from '../components/students/StudentBatchCard';
// import StudentListTable from '../components/students/StudentListTable';

// export default function Students({ 
//   userRole, 
//   batches = [], 
//   allStudents = [], 
//   displayDepts = [], 
//   subjects = [], 
//   onAddBatch, 
//   onAddStudent,
//   onDeleteStudent,
//   updateData, 
//   allMarks = [] 
// }) {
//   const [selectedBatch, setSelectedBatch] = useState(null);
//   const [activeFilter, setActiveFilter] = useState('All');
//   const [activeYearFilter, setActiveYearFilter] = useState('All');
  
//   const [formData, setFormData] = useState({
//     deptId: '',
//     deptName: '',
//     hod: '',
//     startYear: '2024',
//     duration: '3',
//   });

//   const isAdmin = userRole === 'admin';
//   const endYear = parseInt(formData.startYear) + parseInt(formData.duration);
//   const totalSemesters = parseInt(formData.duration) * 2;
//   const batchLabel = `${formData.startYear}-${endYear}`;

//   // 1. Logic to handle unique batches
//   const uniqueBatches = Object.values(
//     batches.reduce((acc, current) => {
//       const key = `${current.dept}-${current.batch}`;
//       if (!acc[key] || parseInt(current.id) > parseInt(acc[key].id)) {
//         acc[key] = current;
//       }
//       return acc;
//     }, {})
//   );

//   // 2. Generate Filter Options
//   const deptOptions = ['All', ...new Set(uniqueBatches.map(b => b.dept))];
//   const yearOptions = ['All', ...new Set(uniqueBatches.map(b => b.batch))];

//   // 3. Combined Filtering Logic
//   const filteredBatches = uniqueBatches.filter(b => {
//     const matchDept = activeFilter === 'All' || b.dept === activeFilter;
//     const matchYear = activeYearFilter === 'All' || b.batch === activeYearFilter;
//     return matchDept && matchYear;
//   });

//   // --- CRUD LOGIC HANDLER ---
//   const handleBatchCRUD = async (payload) => {
//     try {
//       if (payload.action === 'edit') {
//         // This handles Batch name editing, Department changes, and Semester Promotion
//         await updateData({
//           action: 'edit',
//           batch: payload.batch
//         });
//       } else if (payload.action === 'delete') {
//         // This processes the batch deletion request
//         await updateData({
//           action: 'delete',
//           id: payload.id
//         });
//       }
//     } catch (err) {
//       console.error("Batch CRUD Operation Failed:", err);
//     }
//   };

//   const handleDeptChange = (e) => {
//     const deptId = e.target.value;
//     const selectedDept = displayDepts.find(d => String(d.id) === String(deptId));
//     setFormData({
//       ...formData,
//       deptId: deptId,
//       deptName: selectedDept ? selectedDept.name : '',
//       hod: selectedDept ? (selectedDept.hod || 'Not Assigned') : ''
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const isDuplicate = batches.some(b => b.dept === formData.deptName && b.batch === batchLabel);
//     if (isDuplicate) {
//       alert(`The batch ${batchLabel} already exists for ${formData.deptName}.`);
//       return;
//     }
//     onAddBatch({ 
//       dept: formData.deptName, 
//       batch: batchLabel, 
//       hod: formData.hod, 
//       year: "Year 1",
//       semester: 1,
//       status: "Active"
//     });
//     setFormData({ deptId: '', deptName: '', hod: '', startYear: '2024', duration: '3' });
//     e.target.reset();
//   };

//   return (
//     <div className="max-w-7xl mx-auto p-2 animate-in fade-in duration-500 text-left">
//       <div className="mb-10">
//          <h1 className="text-[2rem] font-black text-[#0f172a] leading-tight tracking-tight">
//             Student Directory
//           </h1>
//         <p className="text-slate-500 font-medium mt-1">Manage departmental enrollment and batch-based student records.</p>
//       </div>

//       {!selectedBatch ? (
//         <div className="space-y-10">
//           {isAdmin && (
//             <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm border-t-4 border-t-blue-600">
//               <h3 className="font-bold text-xs text-slate-400 uppercase tracking-wider mb-4">Register New Batch</h3>
//               <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-5 items-end">
//                 <div className="md:col-span-3 space-y-1">
//                   <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Department</label>
//                   <select required value={formData.deptId} onChange={handleDeptChange} className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-50 rounded-xl outline-none focus:border-blue-600 text-sm font-bold text-slate-700">
//                     <option value="">-- Select --</option>
//                     {displayDepts.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
//                   </select>
//                 </div>
//                 <div className="md:col-span-2 space-y-1">
//                   <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Start Year</label>
//                   <input type="number" value={formData.startYear} onChange={(e) => setFormData({...formData, startYear: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-50 rounded-xl outline-none focus:border-blue-600 text-sm font-bold text-slate-700" />
//                 </div>
//                 <div className="md:col-span-2 space-y-1">
//                   <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Duration</label>
//                   <select value={formData.duration} onChange={(e) => setFormData({...formData, duration: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-50 rounded-xl outline-none focus:border-blue-600 text-sm font-bold text-slate-700">
//                     <option value="3">3 Years</option>
//                     <option value="4">4 Years</option>
//                   </select>
//                 </div>
//                 <div className="md:col-span-3">
//                     <div className="grid grid-cols-2 gap-2">
//                         <div className="space-y-1 text-center">
//                             <label className="text-[10px] font-black text-slate-400 uppercase">End Year</label>
//                             <div className="px-4 py-2.5 bg-blue-50 rounded-xl text-sm font-black text-blue-600">{endYear}</div>
//                         </div>
//                         <div className="space-y-1 text-center">
//                             <label className="text-[10px] font-black text-slate-400 uppercase">Sems</label>
//                             <div className="px-4 py-2.5 bg-green-50 rounded-xl text-sm font-black text-green-600">{totalSemesters}</div>
//                         </div>
//                     </div>
//                 </div>
//                 <div className="md:col-span-2">
//                   <button type="submit" className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-blue-200 hover:bg-blue-700 transition h-[44px]">Create Batch</button>
//                 </div>
//               </form>
//             </div>
//           )}

//           <div className="space-y-4">
//             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-6">
//               <h3 className="font-black text-xl text-slate-900 uppercase tracking-tight">Batch Management</h3>
              
//               <div className="flex flex-wrap gap-4">
//                 <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
//                   <select 
//                     value={activeFilter} 
//                     onChange={(e) => setActiveFilter(e.target.value)}
//                     className="bg-transparent px-3 py-1.5 text-[11px] font-black text-slate-600 outline-none cursor-pointer"
//                   >
//                     {deptOptions.map(opt => <option key={opt} value={opt}>{opt === 'All' ? 'All Departments' : opt}</option>)}
//                   </select>
//                 </div>

//                 <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
//                   <select 
//                     value={activeYearFilter} 
//                     onChange={(e) => setActiveYearFilter(e.target.value)}
//                     className="bg-transparent px-3 py-1.5 text-[11px] font-black text-slate-600 outline-none cursor-pointer"
//                   >
//                     {yearOptions.map(opt => <option key={opt} value={opt}>{opt === 'All' ? 'All Years' : opt}</option>)}
//                   </select>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//             {filteredBatches.length > 0 ? (
//               filteredBatches.map(b => (
//                 <StudentBatchCard 
//                   key={b.id} 
//                   batch={b} 
//                   onSelect={setSelectedBatch} 
//                   students={allStudents}
//                   subjects={subjects}
//                   allMarks={allMarks}
//                   updateData={handleBatchCRUD} 
//                 />
//               ))
//             ) : (
//               <div className="col-span-full py-20 text-center bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
//                 <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">No matching batches found</p>
//               </div>
//             )}
//           </div>
//         </div>
//       ) : (
//         <div className="animate-in slide-in-from-right-4 duration-500">
//           <button onClick={() => setSelectedBatch(null)} className="flex items-center gap-2 text-xs font-black text-slate-500 hover:text-blue-600 mb-6 transition-colors">
//             <ArrowLeft size={16} /> Back to Batches
//           </button>
//           <StudentListTable 
//             batch={selectedBatch} 
//             students={allStudents.filter(s => String(s.batchId) === String(selectedBatch.id))} 
//             onAddStudent={onAddStudent} 
//             onDeleteStudent={onDeleteStudent} 
//             isAdmin={isAdmin} 
//           />
//         </div>
//       )}
//     </div>
//   );
// }


// // import React, { useState } from 'react';
// // import { ArrowLeft, LayoutGrid } from 'lucide-react';
// // import StudentBatchCard from '../components/students/StudentBatchCard';
// // import StudentListTable from '../components/students/StudentListTable';

// // export default function Students({ 
// //   userRole, 
// //   batches = [], 
// //   allStudents = [], 
// //   displayDepts = [], 
// //   subjects = [], 
// //   onAddBatch, 
// //   onAddStudent,
// //   onDeleteStudent,
// //   updateData, 
// //   allMarks = [] 
// // }) {

// //   const [selectedBatch, setSelectedBatch] = useState(null);
// //   const [activeFilter, setActiveFilter] = useState('All');
// //   const [activeYearFilter, setActiveYearFilter] = useState('All');
  
// //   const [formData, setFormData] = useState({
// //     deptId: '',
// //     deptName: '',
// //     hod: '',
// //     startYear: '2024',
// //     duration: '3',
// //   });

// //   const isAdmin = userRole === 'admin';

// //   const endYear = parseInt(formData.startYear) + parseInt(formData.duration);
// //   const totalSemesters = parseInt(formData.duration) * 2;
// //   const batchLabel = `${formData.startYear}-${endYear}`;

// //   // ✅ FIXED: Use dept_id instead of dept
// //   const uniqueBatches = Object.values(
// //     batches.reduce((acc, current) => {
// //       const key = `${current.dept_id}-${current.batch}`;
// //       if (!acc[key] || parseInt(current.id) > parseInt(acc[key].id)) {
// //         acc[key] = current;
// //       }
// //       return acc;
// //     }, {})
// //   );

// //   // ✅ FIXED: Use deptName (comes from backend JOIN)
// //   const deptOptions = ['All', ...new Set(uniqueBatches.map(b => b.deptName))];
// //   const yearOptions = ['All', ...new Set(uniqueBatches.map(b => b.batch))];

// //   // ✅ FIXED: Filter using deptName
// //   const filteredBatches = uniqueBatches.filter(b => {
// //     const matchDept = activeFilter === 'All' || b.deptName === activeFilter;
// //     const matchYear = activeYearFilter === 'All' || b.batch === activeYearFilter;
// //     return matchDept && matchYear;
// //   });

// //   // --- CRUD LOGIC HANDLER ---
// //   const handleBatchCRUD = async (payload) => {
// //     try {
// //       if (payload.action === 'edit') {
// //         await updateData({
// //           action: 'edit',
// //           batch: payload.batch
// //         });
// //       } else if (payload.action === 'delete') {
// //         await updateData({
// //           action: 'delete',
// //           id: payload.id
// //         });
// //       }
// //     } catch (err) {
// //       console.error("Batch CRUD Operation Failed:", err);
// //     }
// //   };

// //   const handleDeptChange = (e) => {
// //     const deptId = e.target.value;
// //     const selectedDept = displayDepts.find(d => String(d.id) === String(deptId));

// //     setFormData({
// //       ...formData,
// //       deptId: deptId,
// //       deptName: selectedDept ? selectedDept.name : '',
// //       hod: selectedDept ? (selectedDept.hod || 'Not Assigned') : ''
// //     });
// //   };

// //   const handleSubmit = (e) => {
// //     e.preventDefault();

// //     // ✅ FIXED: Duplicate check using dept_id
// //     const isDuplicate = batches.some(
// //       b => String(b.dept_id) === String(formData.deptId) &&
// //            b.batch === batchLabel
// //     );

// //     if (isDuplicate) {
// //       alert(`The batch ${batchLabel} already exists for ${formData.deptName}.`);
// //       return;
// //     }

// //     // ✅ FIXED: Send dept_id to backend
// //     onAddBatch({ 
// //       dept_id: formData.deptId,
// //       batch: batchLabel, 
// //       hod: formData.hod, 
// //       year: "Year 1",
// //       semester: 1,
// //       status: "Active"
// //     });

// //     setFormData({ deptId: '', deptName: '', hod: '', startYear: '2024', duration: '3' });
// //     e.target.reset();
// //   };

// //   return (
// //     <div className="max-w-7xl mx-auto p-2 animate-in fade-in duration-500 text-left">
// //       <div className="mb-10">
// //          <h1 className="text-[2rem] font-black text-[#0f172a] leading-tight tracking-tight">
// //             Student Directory
// //           </h1>
// //         <p className="text-slate-500 font-medium mt-1">Manage departmental enrollment and batch-based student records.</p>
// //       </div>

// //       {!selectedBatch ? (
// //         <div className="space-y-10">
// //           {isAdmin && (
// //             <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm border-t-4 border-t-blue-600">
// //               <h3 className="font-bold text-xs text-slate-400 uppercase tracking-wider mb-4">Register New Batch</h3>
// //               <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-5 items-end">
// //                 <div className="md:col-span-3 space-y-1">
// //                   <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Department</label>
// //                   <select required value={formData.deptId} onChange={handleDeptChange} className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-50 rounded-xl outline-none focus:border-blue-600 text-sm font-bold text-slate-700">
// //                     <option value="">-- Select --</option>
// //                     {displayDepts.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
// //                   </select>
// //                 </div>

// //                 <div className="md:col-span-2 space-y-1">
// //                   <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Start Year</label>
// //                   <input type="number" value={formData.startYear} onChange={(e) => setFormData({...formData, startYear: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-50 rounded-xl outline-none focus:border-blue-600 text-sm font-bold text-slate-700" />
// //                 </div>

// //                 <div className="md:col-span-2 space-y-1">
// //                   <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Duration</label>
// //                   <select value={formData.duration} onChange={(e) => setFormData({...formData, duration: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-50 rounded-xl outline-none focus:border-blue-600 text-sm font-bold text-slate-700">
// //                     <option value="3">3 Years</option>
// //                     <option value="4">4 Years</option>
// //                   </select>
// //                 </div>

// //                 <div className="md:col-span-3">
// //                     <div className="grid grid-cols-2 gap-2">
// //                         <div className="space-y-1 text-center">
// //                             <label className="text-[10px] font-black text-slate-400 uppercase">End Year</label>
// //                             <div className="px-4 py-2.5 bg-blue-50 rounded-xl text-sm font-black text-blue-600">{endYear}</div>
// //                         </div>
// //                         <div className="space-y-1 text-center">
// //                             <label className="text-[10px] font-black text-slate-400 uppercase">Sems</label>
// //                             <div className="px-4 py-2.5 bg-green-50 rounded-xl text-sm font-black text-green-600">{totalSemesters}</div>
// //                         </div>
// //                     </div>
// //                 </div>

// //                 <div className="md:col-span-2">
// //                   <button type="submit" className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-blue-200 hover:bg-blue-700 transition h-[44px]">
// //                     Create Batch
// //                   </button>
// //                 </div>
// //               </form>
// //             </div>
// //           )}

// //           <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
// //             {filteredBatches.length > 0 ? (
// //               filteredBatches.map(b => (
// //                 <StudentBatchCard 
// //                   key={b.id} 
// //                   batch={b} 
// //                   onSelect={setSelectedBatch} 
// //                   students={allStudents}
// //                   subjects={subjects}
// //                   allMarks={allMarks}
// //                   updateData={handleBatchCRUD} 
// //                 />
// //               ))
// //             ) : (
// //               <div className="col-span-full py-20 text-center bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
// //                 <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">
// //                   No matching batches found
// //                 </p>
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //       ) : (
// //         <div className="animate-in slide-in-from-right-4 duration-500">
// //           <button onClick={() => setSelectedBatch(null)} className="flex items-center gap-2 text-xs font-black text-slate-500 hover:text-blue-600 mb-6 transition-colors">
// //             <ArrowLeft size={16} /> Back to Batches
// //           </button>

// //           <StudentListTable 
// //             batch={selectedBatch} 
// //             students={allStudents.filter(s => String(s.batchId) === String(selectedBatch.id))} 
// //             onAddStudent={onAddStudent} 
// //             onDeleteStudent={onDeleteStudent} 
// //             isAdmin={isAdmin} 
// //           />
// //         </div>
// //       )}
// //     </div>
// //   );
// // }







import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import StudentBatchCard from '../components/students/StudentBatchCard';
import StudentListTable from '../components/students/StudentListTable';

export default function Students({ 
  userRole, 
  batches = [], 
  allStudents = [], 
  displayDepts = [], 
  subjects = [], 
  onAddBatch, 
  onAddStudent,
  onDeleteStudent,
  updateData, 
  allMarks = [] 
}) {

  const [selectedBatch, setSelectedBatch] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');
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

  // ✅ UNIQUE BATCHES (FIXED FOR dept_id)
  const uniqueBatches = Object.values(
    batches.reduce((acc, current) => {
      const key = `${current.dept_id}-${current.batch}`;
      if (!acc[key] || parseInt(current.id) > parseInt(acc[key].id)) {
        acc[key] = current;
      }
      return acc;
    }, {})
  );

  // ✅ FILTER OPTIONS (FIXED)
  const deptOptions = ['All', ...new Set(uniqueBatches.map(b => b.deptName))];
  const yearOptions = ['All', ...new Set(uniqueBatches.map(b => b.batch))];

  // ✅ FILTER LOGIC (FIXED)
  const filteredBatches = uniqueBatches.filter(b => {
    const matchDept = activeFilter === 'All' || b.deptName === activeFilter;
    const matchYear = activeYearFilter === 'All' || b.batch === activeYearFilter;
    return matchDept && matchYear;
  });

  // --- CRUD HANDLER ---
  const handleBatchCRUD = async (payload) => {
    try {
      if (payload.action === 'edit') {
        await updateData({
          action: 'edit',
          batch: payload.batch
        });
      } else if (payload.action === 'delete') {
        await updateData({
          action: 'delete',
          id: payload.id
        });
      }
    } catch (err) {
      console.error("Batch CRUD Operation Failed:", err);
    }
  };

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

    // ✅ DUPLICATE CHECK FIXED
    const isDuplicate = batches.some(
      b => String(b.dept_id) === String(formData.deptId) && b.batch === batchLabel
    );

    if (isDuplicate) {
      alert(`The batch ${batchLabel} already exists for ${formData.deptName}.`);
      return;
    }

    // ✅ UPDATED PAYLOAD
    onAddBatch({ 
      dept_id: formData.deptId,
      batch: batchLabel, 
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
        <h1 className="text-[2rem] font-black text-[#0f172a] leading-tight tracking-tight">
          Student Directory
        </h1>
        <p className="text-slate-500 font-medium mt-1">
          Manage departmental enrollment and batch-based student records.
        </p>
      </div>

      {!selectedBatch ? (
        <div className="space-y-10">

          {/* CREATE BATCH */}
          {isAdmin && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm border-t-4 border-t-blue-600">
              <h3 className="font-bold text-xs text-slate-400 uppercase tracking-wider mb-4">
                Register New Batch
              </h3>

              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-5 items-end">

                <div className="md:col-span-3 space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">
                    Department
                  </label>
                  <select
                    required
                    value={formData.deptId}
                    onChange={handleDeptChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-50 rounded-xl outline-none focus:border-blue-600 text-sm font-bold text-slate-700"
                  >
                    <option value="">-- Select --</option>
                    {displayDepts.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2 space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">
                    Start Year
                  </label>
                  <input
                    type="number"
                    value={formData.startYear}
                    onChange={(e) => setFormData({...formData, startYear: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-50 rounded-xl outline-none focus:border-blue-600 text-sm font-bold text-slate-700"
                  />
                </div>

                <div className="md:col-span-2 space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">
                    Duration
                  </label>
                  <select
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-50 rounded-xl outline-none focus:border-blue-600 text-sm font-bold text-slate-700"
                  >
                    <option value="3">3 Years</option>
                    <option value="4">4 Years</option>
                  </select>
                </div>

                <div className="md:col-span-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1 text-center">
                      <label className="text-[10px] font-black text-slate-400 uppercase">
                        End Year
                      </label>
                      <div className="px-4 py-2.5 bg-blue-50 rounded-xl text-sm font-black text-blue-600">
                        {endYear}
                      </div>
                    </div>
                    <div className="space-y-1 text-center">
                      <label className="text-[10px] font-black text-slate-400 uppercase">
                        Sems
                      </label>
                      <div className="px-4 py-2.5 bg-green-50 rounded-xl text-sm font-black text-green-600">
                        {totalSemesters}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-blue-200 hover:bg-blue-700 transition h-[44px]"
                  >
                    Create Batch
                  </button>
                </div>

              </form>
            </div>
          )}

          {/* FILTER SECTION */}
          <div className="flex flex-wrap gap-4 border-b border-slate-100 pb-6">
            <select
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value)}
              className="bg-slate-100 px-3 py-2 rounded-xl text-xs font-black"
            >
              {deptOptions.map(opt => (
                <option key={opt} value={opt}>
                  {opt === 'All' ? 'All Departments' : opt}
                </option>
              ))}
            </select>

            <select
              value={activeYearFilter}
              onChange={(e) => setActiveYearFilter(e.target.value)}
              className="bg-slate-100 px-3 py-2 rounded-xl text-xs font-black"
            >
              {yearOptions.map(opt => (
                <option key={opt} value={opt}>
                  {opt === 'All' ? 'All Years' : opt}
                </option>
              ))}
            </select>
          </div>

          {/* BATCH GRID */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {filteredBatches.length > 0 ? (
              filteredBatches.map(b => (
                <StudentBatchCard
                  key={b.id}
                  batch={b}
                  onSelect={setSelectedBatch}
                  students={allStudents}
                  subjects={subjects}
                  allMarks={allMarks}
                  updateData={handleBatchCRUD}
                />
              ))
            ) : (
              <div className="col-span-full py-20 text-center bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">
                  No matching batches found
                </p>
              </div>
            )}
          </div>

        </div>
      ) : (
        <div className="animate-in slide-in-from-right-4 duration-500">
          <button
            onClick={() => setSelectedBatch(null)}
            className="flex items-center gap-2 text-xs font-black text-slate-500 hover:text-blue-600 mb-6 transition-colors"
          >
            <ArrowLeft size={16} /> Back to Batches
          </button>

          <StudentListTable
            batch={selectedBatch}
            students={allStudents.filter(
              s => String(s.batchId) === String(selectedBatch.id)
            )}
            onAddStudent={onAddStudent}
            onDeleteStudent={onDeleteStudent}
            isAdmin={isAdmin}
          />
        </div>
      )}

    </div>
  );
}





// import React, { useState } from 'react';
// import { ArrowLeft, ShieldCheck, Plus, Filter } from 'lucide-react';
// import StudentBatchCard from '../components/students/StudentBatchCard';
// import StudentListTable from '../components/students/StudentListTable';

// /**
//  * Students Component
//  * Manages Departmental Batches, Enrollment, and Promotion Logic
//  */
// export default function Students({ 
//   userRole, 
//   batches = [], 
//   allStudents = [], 
//   displayDepts = [], 
//   subjects = [], 
//   onAddBatch, 
//   onAddStudent,
//   onDeleteStudent,
//   updateData, 
//   allMarks = [] 
// }) {

//   const [selectedBatch, setSelectedBatch] = useState(null);
//   const [activeFilter, setActiveFilter] = useState('All');
//   const [activeYearFilter, setActiveYearFilter] = useState('All');
  
//   const [formData, setFormData] = useState({
//     deptId: '',
//     deptName: '',
//     hod: '',
//     startYear: new Date().getFullYear().toString(),
//     duration: '3',
//   });

//   const isAdmin = userRole === 'admin';

//   // Batch Calculation Logic
//   const endYear = parseInt(formData.startYear) + parseInt(formData.duration);
//   const totalSemesters = parseInt(formData.duration) * 2;
//   const batchLabel = `${formData.startYear}-${endYear}`;

//   /* ===============================
//       1️⃣ DATA CLEANUP & FILTERS
//   =============================== */
//   // Ensure we only show unique batches (prevents duplicate cards from join queries)
//   const uniqueBatches = Object.values(
//     batches.reduce((acc, current) => {
//       const key = `${current.dept_id}-${current.batch}`;
//       if (!acc[key] || parseInt(current.id) > parseInt(acc[key].id)) {
//         acc[key] = current;
//       }
//       return acc;
//     }, {})
//   );

//   const deptOptions = ['All', ...new Set(uniqueBatches.map(b => b.deptName).filter(Boolean))];
//   const yearOptions = ['All', ...new Set(uniqueBatches.map(b => b.batch).filter(Boolean))];

//   const filteredBatches = uniqueBatches.filter(b => {
//     const matchDept = activeFilter === 'All' || b.deptName === activeFilter;
//     const matchYear = activeYearFilter === 'All' || b.batch === activeYearFilter;
//     return matchDept && matchYear;
//   });

//   /* ===============================
//       2️⃣ CRUD & INTEGRITY HANDLERS
//   =============================== */
//   const handleBatchCRUD = async (payload) => {
//     try {
//       if (payload.action === 'edit') {
//         // Handles Promotion (BatchCard increments semester and sends here)
//         await updateData({
//           action: 'edit',
//           batch: payload.batch
//         });
//       } else if (payload.action === 'delete') {
//         await updateData({
//           action: 'delete',
//           id: payload.id
//         });
//       }
//     } catch (err) {
//       console.error("Batch Operation Failed:", err);
//     }
//   };

//   const handleFixData = async () => {
//     if (window.confirm("This will synchronize Semester values and Category types (Major/Minor) across the database. Fix now?")) {
//       await updateData({ action: 'repair' });
//     }
//   };

//   const handleDeptChange = (e) => {
//     const deptId = e.target.value;
//     const selectedDept = displayDepts.find(d => String(d.id) === String(deptId));

//     setFormData({
//       ...formData,
//       deptId: deptId,
//       deptName: selectedDept ? selectedDept.name : '',
//       hod: selectedDept ? (selectedDept.hod || 'Not Assigned') : ''
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     const isDuplicate = batches.some(
//       b => String(b.dept_id) === String(formData.deptId) && b.batch === batchLabel
//     );

//     if (isDuplicate) {
//       alert(`The batch ${batchLabel} already exists for ${formData.deptName}.`);
//       return;
//     }

//     onAddBatch({ 
//       dept_id: formData.deptId,
//       batch: batchLabel, 
//       year: "Year 1",
//       semester: 1,
//       status: "Active"
//     });

//     setFormData({ ...formData, deptId: '', deptName: '', hod: '' });
//   };

//   /* ===============================
//       3️⃣ UI RENDERING
//   =============================== */
//   return (
//     <div className="max-w-7xl mx-auto p-4 animate-in fade-in duration-500 text-left">

//       {/* HEADER SECTION */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
//         <div>
//           <h1 className="text-[2.5rem] font-black text-[#0f172a] leading-tight tracking-tight">
//             Student Directory
//           </h1>
//           <p className="text-slate-500 font-medium">
//             Manage departmental enrollment and multi-semester promotion tracking.
//           </p>
//         </div>
        
//         {isAdmin && !selectedBatch && (
//           <button 
//             onClick={handleFixData}
//             className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 px-5 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
//           >
//             <ShieldCheck size={16} /> Sync Database Health
//           </button>
//         )}
//       </div>

//       {!selectedBatch ? (
//         <div className="space-y-10">

//           {/* REGISTER NEW BATCH FORM */}
//           {isAdmin && (
//             <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm border-t-8 border-t-blue-600">
//               <div className="flex items-center gap-2 mb-6">
//                 <Plus size={18} className="text-blue-600" />
//                 <h3 className="font-black text-xs text-slate-400 uppercase tracking-[0.2em]">
//                   Register Institutional Batch
//                 </h3>
//               </div>

//               <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
//                 <div className="md:col-span-3 space-y-2">
//                   <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Department</label>
//                   <select
//                     required
//                     value={formData.deptId}
//                     onChange={handleDeptChange}
//                     className="w-full px-5 py-3 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-blue-600 focus:bg-white text-sm font-bold text-slate-700 transition-all"
//                   >
//                     <option value="">Select Department</option>
//                     {displayDepts.map((d) => (
//                       <option key={d.id} value={d.id}>{d.name}</option>
//                     ))}
//                   </select>
//                 </div>

//                 <div className="md:col-span-2 space-y-2">
//                   <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Start Year</label>
//                   <input
//                     type="number"
//                     value={formData.startYear}
//                     onChange={(e) => setFormData({...formData, startYear: e.target.value})}
//                     className="w-full px-5 py-3 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-blue-600 focus:bg-white text-sm font-bold text-slate-700 transition-all"
//                   />
//                 </div>

//                 <div className="md:col-span-2 space-y-2">
//                   <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Course Duration</label>
//                   <select
//                     value={formData.duration}
//                     onChange={(e) => setFormData({...formData, duration: e.target.value})}
//                     className="w-full px-5 py-3 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-blue-600 focus:bg-white text-sm font-bold text-slate-700 transition-all"
//                   >
//                     <option value="3">3 Years (BCA/BSc)</option>
//                     <option value="4">4 Years (BTech/NEP)</option>
//                   </select>
//                 </div>

//                 <div className="md:col-span-3 bg-blue-50/50 p-4 rounded-2xl border border-blue-100/50">
//                   <div className="grid grid-cols-2 gap-4">
//                     <div className="text-center">
//                       <p className="text-[9px] font-black text-blue-400 uppercase mb-1">Graduation</p>
//                       <p className="text-lg font-black text-blue-700">{endYear}</p>
//                     </div>
//                     <div className="text-center border-l border-blue-100">
//                       <p className="text-[9px] font-black text-green-400 uppercase mb-1">Semesters</p>
//                       <p className="text-lg font-black text-green-700">{totalSemesters}</p>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="md:col-span-2">
//                   <button
//                     type="submit"
//                     className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 transition-all active:scale-95 h-[56px]"
//                   >
//                     Create Batch
//                   </button>
//                 </div>
//               </form>
//             </div>
//           )}

//           {/* FILTER TOOLBAR */}
//           <div className="flex items-center justify-between border-b border-slate-100 pb-6">
//             <div className="flex items-center gap-4">
//               <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl text-slate-500">
//                 <Filter size={14} />
//                 <span className="text-[10px] font-black uppercase tracking-widest">Quick Filters</span>
//               </div>
              
//               <select
//                 value={activeFilter}
//                 onChange={(e) => setActiveFilter(e.target.value)}
//                 className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-xs font-black text-slate-700 outline-none focus:border-blue-600"
//               >
//                 {deptOptions.map(opt => (
//                   <option key={opt} value={opt}>{opt === 'All' ? 'All Departments' : opt}</option>
//                 ))}
//               </select>

//               <select
//                 value={activeYearFilter}
//                 onChange={(e) => setActiveYearFilter(e.target.value)}
//                 className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-xs font-black text-slate-700 outline-none focus:border-blue-600"
//               >
//                 {yearOptions.map(opt => (
//                   <option key={opt} value={opt}>{opt === 'All' ? 'All Academic Years' : opt}</option>
//                 ))}
//               </select>
//             </div>
            
//             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
//               Showing {filteredBatches.length} Active Groups
//             </p>
//           </div>

//           {/* BATCH CARD GRID */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//             {filteredBatches.length > 0 ? (
//               filteredBatches.map(b => (
//                 <StudentBatchCard
//                   key={b.id}
//                   batch={b}
//                   onSelect={setSelectedBatch}
//                   students={allStudents}
//                   subjects={subjects}
//                   allMarks={allMarks}
//                   updateData={handleBatchCRUD}
//                 />
//               ))
//             ) : (
//               <div className="col-span-full py-32 text-center bg-slate-50 rounded-[3rem] border-4 border-dashed border-slate-200">
//                 <ShieldCheck size={48} className="mx-auto text-slate-200 mb-4" />
//                 <p className="text-slate-400 font-black uppercase text-sm tracking-[0.3em]">
//                   No Records Detected in Current Filter
//                 </p>
//               </div>
//             )}
//           </div>

//         </div>
//       ) : (
//         /* INDIVIDUAL BATCH VIEW (STUDENT LIST) */
//         <div className="animate-in slide-in-from-right-8 duration-700">
//           <div className="flex items-center justify-between mb-8">
//             <button
//               onClick={() => setSelectedBatch(null)}
//               className="flex items-center gap-3 text-[11px] font-black text-slate-400 hover:text-blue-600 transition-all uppercase tracking-widest group"
//             >
//               <div className="size-8 rounded-full border border-slate-200 flex items-center justify-center group-hover:border-blue-600 group-hover:bg-blue-50">
//                 <ArrowLeft size={16} />
//               </div>
//               Return to Directory
//             </button>
            
//             <div className="text-right">
//               <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
//                 Viewing: {selectedBatch.batch}
//               </span>
//             </div>
//           </div>

//           <StudentListTable
//             batch={selectedBatch}
//             students={allStudents.filter(
//               s => String(s.batchId || s.batch_id) === String(selectedBatch.id)
//             )}
//             onAddStudent={onAddStudent}
//             onDeleteStudent={onDeleteStudent}
//             isAdmin={isAdmin}
//           />
//         </div>
//       )}
//     </div>
//   );
// }