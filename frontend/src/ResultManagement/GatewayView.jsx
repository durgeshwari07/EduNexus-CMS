// // // // import React, { useState } from 'react';
// // // // import { useNavigate } from 'react-router-dom';
// // // // import Sidebar from '../components/Sidebar'; 
// // // // import BatchCard from './components/BatchCard';
// // // // import mockBatches from './data/mockBatches.json';
// // // // // CRITICAL: This line restores your beautiful design!
// // // // import './styles/results.css'; 

// // // // const GatewayView = ({ userRole, currentUser, setCurrentPage, onLogout }) => {
// // // //   const navigate = useNavigate();
// // // //   const [searchTerm, setSearchTerm] = useState('');
// // // //   const [selectedDept, setSelectedDept] = useState('All Departments');

// // // //   const filteredBatches = mockBatches.filter(batch => {
// // // //     const matchesSearch = batch.batchYear.toLowerCase().includes(searchTerm.toLowerCase());
// // // //     const matchesDept = selectedDept === 'All Departments' || batch.courseCode === selectedDept;
// // // //     return matchesSearch && matchesDept;
// // // //   });

// // // //   return (
// // // //     <div className="app-layout w-full">
// // // //       <Sidebar 
// // // //         isHidden={false} 
// // // //         userRole={userRole} 
// // // //         currentUser={currentUser} 
// // // //         currentPage="result-ledger" 
// // // //         setCurrentPage={setCurrentPage} 
// // // //         onLogout={onLogout} 
// // // //       />
// // // //       <main className="main-content">
// // // //         <div className="container">
          
// // // //           <div className="header-section">
// // // //             <div className="page-title">
// // // //               <h1>Result Management</h1>
// // // //               <p>Select an active batch to view Master Registers and Supplementary Ledgers.</p>
// // // //             </div>
// // // //           </div>

// // // //           <div className="filter-bar toolbar" style={{ marginBottom: '24px', borderRadius: '8px' }}>
// // // //             <div className="toolbar-left">
// // // //               <input 
// // // //                 type="text" 
// // // //                 className="search-input" 
// // // //                 placeholder="Search by batch year (e.g., 2023)..."
// // // //                 value={searchTerm}
// // // //                 onChange={(e) => setSearchTerm(e.target.value)}
// // // //               />
// // // //               <select 
// // // //                 className="select-filter"
// // // //                 value={selectedDept}
// // // //                 onChange={(e) => setSelectedDept(e.target.value)}
// // // //               >
// // // //                 <option>All Departments</option>
// // // //                 <option>BCA</option>
// // // //                 <option>BBA</option>
// // // //                 <option>B.Sc. IT</option>
// // // //               </select>
// // // //             </div>
// // // //           </div>

// // // //           {filteredBatches.length === 0 ? (
// // // //             <div className="no-data-container">
// // // //               <h3>No batches found</h3>
// // // //               <p>Try adjusting your search or department filter.</p>
// // // //             </div>
// // // //           ) : (
// // // //             <div className="batch-grid">
// // // //               {filteredBatches.map(batch => (
// // // //                 <BatchCard 
// // // //                   key={batch.id} 
// // // //                   batch={batch} 
// // // //                   onRegularClick={(id) => navigate(`/results/master/${id}?tab=regular`)}
// // // //                   onSupplementaryClick={(id) => navigate(`/results/master/${id}?tab=supplementary`)}
// // // //                 />
// // // //               ))}
// // // //             </div>
// // // //           )}

// // // //         </div>
// // // //       </main>
// // // //     </div>
// // // //   );
// // // // };

// // // // export default GatewayView;


// // // import React, { useState } from 'react';
// // // import { useNavigate } from 'react-router-dom';
// // // import Sidebar from '../components/Sidebar'; 
// // // import BatchCard from './components/BatchCard';
// // // // CRITICAL: This line restores your beautiful design!
// // // import './styles/results.css'; 

// // // const GatewayView = ({ 
// // //   userRole, 
// // //   currentUser, 
// // //   setCurrentPage = () => {}, // Default to empty function to prevent errors
// // //   onLogout, 
// // //   batches = [], // Use real batches from App.jsx
// // //   allStudents = [] // Use real students from App.jsx
// // // }) => {
// // //   const navigate = useNavigate();
// // //   const [searchTerm, setSearchTerm] = useState('');
// // //   const [selectedDept, setSelectedDept] = useState('All Departments');

// // //   // Filter real batches instead of mock ones
// // //   const filteredBatches = batches.filter(batch => {
// // //     // Check both 'batch' (name) and 'year' fields based on your DB schema
// // //     const batchName = batch.batch || "";
// // //     const matchesSearch = batchName.toLowerCase().includes(searchTerm.toLowerCase());
// // //     const matchesDept = selectedDept === 'All Departments' || batch.dept === selectedDept;
// // //     return matchesSearch && matchesDept;
// // //   });

// // //   return (
// // //     <div className="app-layout w-full">
// // //       <Sidebar 
// // //         isHidden={false} 
// // //         userRole={userRole} 
// // //         currentUser={currentUser} 
// // //         currentPage="result-ledger" 
// // //         setCurrentPage={setCurrentPage} 
// // //         onLogout={onLogout} 
// // //       />
// // //       <main className="main-content">
// // //         <div className="container">
          
// // //           <div className="header-section">
// // //             <div className="page-title">
// // //               <h1>Result Management</h1>
// // //               <p>Select an active batch to view Master Registers and Supplementary Ledgers.</p>
// // //             </div>
// // //           </div>

// // //           <div className="filter-bar toolbar" style={{ marginBottom: '24px', borderRadius: '8px' }}>
// // //             <div className="toolbar-left">
// // //               <input 
// // //                 type="text" 
// // //                 className="search-input" 
// // //                 placeholder="Search by batch (e.g., 2024)..."
// // //                 value={searchTerm}
// // //                 onChange={(e) => setSearchTerm(e.target.value)}
// // //               />
// // //               <select 
// // //                 className="select-filter"
// // //                 value={selectedDept}
// // //                 onChange={(e) => setSelectedDept(e.target.value)}
// // //               >
// // //                 <option>All Departments</option>
// // //                 {/* Dynamically list depts or keep your static ones */}
// // //                 <option>BCA</option>
// // //                 <option>BBA</option>
// // //                 <option>B.Sc. IT</option>
// // //               </select>
// // //             </div>
// // //           </div>

// // //           {filteredBatches.length === 0 ? (
// // //             <div className="no-data-container" style={{ padding: '40px', textAlign: 'center' }}>
// // //               <h3>No active batches found</h3>
// // //               <p>Try adjusting your search or ensure batches are created in the Students section.</p>
// // //             </div>
// // //           ) : (
// // //             <div className="batch-grid">
// // //               {filteredBatches.map(batch => (
// // //                 <BatchCard 
// // //                   key={batch.id} 
// // //                   batch={batch} 
// // //                   students={allStudents} // Passing real students for the count logic
// // //                   onRegularClick={(id) => navigate(`/results/master/${id}?tab=regular`)}
// // //                   onSupplementaryClick={(id) => navigate(`/results/master/${id}?tab=supplementary`)}
// // //                 />
// // //               ))}
// // //             </div>
// // //           )}

// // //         </div>
// // //       </main>
// // //     </div>
// // //   );
// // // };

// // // export default GatewayView;



// // import React, { useState } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import Sidebar from '../components/Sidebar'; 
// // import BatchCard from './components/BatchCard';
// // import './styles/results.css'; 

// // const GatewayView = ({ 
// //   userRole, 
// //   currentUser, 
// //   setCurrentPage = () => {}, 
// //   onLogout, 
// //   batches = [], 
// //   allStudents = [],
// //   displayDepts = [] // Live departments from your main state
// // }) => {
// //   const navigate = useNavigate();
// //   const [searchTerm, setSearchTerm] = useState('');
  
// //   // States matching your filter structure
// //   const [activeFilter, setActiveFilter] = useState('All');
// //   const [activeYearFilter, setActiveYearFilter] = useState('All');

// //   // 1. LIVE DEPARTMENT OPTIONS: Mapping from displayDepts prop
// //   const deptOptions = ['All', ...displayDepts.map(d => d.name)];

// //   // 2. LIVE YEAR OPTIONS: Extracting unique years from existing batches
// //   const yearOptions = ['All', ...new Set(batches.map(b => b.batch))];

// //   // 3. FILTER LOGIC
// //   const filteredBatches = batches.filter(batch => {
// //     const batchName = batch.batch || "";
// //     const matchesSearch = batchName.toLowerCase().includes(searchTerm.toLowerCase());
// //     const matchesDept = activeFilter === 'All' || batch.dept === activeFilter;
// //     const matchesYear = activeYearFilter === 'All' || batch.batch === activeYearFilter;
    
// //     return matchesSearch && matchesDept && matchesYear;
// //   });

// //   return (
// //     <div className="app-layout w-full text-left">
// //       <Sidebar 
// //         isHidden={false} 
// //         userRole={userRole} 
// //         currentUser={currentUser} 
// //         currentPage="result-ledger" 
// //         setCurrentPage={setCurrentPage} 
// //         onLogout={onLogout} 
// //       />
// //       <main className="main-content">
// //         <div className="container">
          
// //           <div className="header-section">
// //             <div className="page-title">
// //               <h1>Result Management</h1>
// //               <p>Select an active batch to view Master Registers and Supplementary Ledgers.</p>
// //             </div>
// //           </div>

// //           {/* FILTERS SECTION */}
// //           <div className="space-y-4">
// //             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-6 mb-8">
// //               <h3 className="font-black text-xl text-slate-900 uppercase tracking-tight">Batch Management</h3>
              
// //               <div className="flex flex-wrap gap-4">
// //                 {/* Search Filter */}
// //                 <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
// //                    <input 
// //                     type="text" 
// //                     placeholder="Search batch..."
// //                     value={searchTerm}
// //                     onChange={(e) => setSearchTerm(e.target.value)}
// //                     className="bg-transparent px-3 py-1.5 text-[11px] font-bold text-slate-600 outline-none w-32 md:w-48"
// //                   />
// //                 </div>

// //                 {/* Live Department Filter */}
// //                 <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
// //                   <select 
// //                     value={activeFilter} 
// //                     onChange={(e) => setActiveFilter(e.target.value)}
// //                     className="bg-transparent px-3 py-1.5 text-[11px] font-black text-slate-600 outline-none cursor-pointer"
// //                   >
// //                     {deptOptions.map(opt => (
// //                       <option key={opt} value={opt}>
// //                         {opt === 'All' ? 'All Departments' : opt}
// //                       </option>
// //                     ))}
// //                   </select>
// //                 </div>

// //                 {/* Live Year Filter */}
// //                 <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
// //                   <select 
// //                     value={activeYearFilter} 
// //                     onChange={(e) => setActiveYearFilter(e.target.value)}
// //                     className="bg-transparent px-3 py-1.5 text-[11px] font-black text-slate-600 outline-none cursor-pointer"
// //                   >
// //                     {yearOptions.map(opt => (
// //                       <option key={opt} value={opt}>
// //                         {opt === 'All' ? 'All Years' : opt}
// //                       </option>
// //                     ))}
// //                   </select>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>

// //           {/* BATCH GRID */}
// //           {filteredBatches.length === 0 ? (
// //             <div className="col-span-full py-20 text-center bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
// //               <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">No matching batches found</p>
// //             </div>
// //           ) : (
// //             <div className="batch-grid">
// //               {filteredBatches.map(batch => (
// //                 <BatchCard 
// //                   key={batch.id} 
// //                   batch={batch} 
// //                   students={allStudents} 
// //                   onRegularClick={(id) => navigate(`/results/master/${id}?tab=regular`)}
// //                   onSupplementaryClick={(id) => navigate(`/results/master/${id}?tab=supplementary`)}
// //                 />
// //               ))}
// //             </div>
// //           )}

// //         </div>
// //       </main>
// //     </div>
// //   );
// // };

// // export default GatewayView;


// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Sidebar from '../components/Sidebar'; 
// import BatchCard from './components/BatchCard';
// import './styles/results.css'; 

// const GatewayView = ({ 
//   userRole, 
//   currentUser, 
//   setCurrentPage = () => {}, 
//   onLogout, 
//   batches = [], 
//   allStudents = [],
//   displayDepts = [] // Live departments passed from App.jsx
// }) => {
//   const navigate = useNavigate();
//   const [searchTerm, setSearchTerm] = useState('');
  
//   // State for the filters matching the Student Directory style
//   const [activeFilter, setActiveFilter] = useState('All');
//   const [activeYearFilter, setActiveYearFilter] = useState('All');

//   // 1. LIVE DEPARTMENT OPTIONS: Mapping from displayDepts prop
//   const deptOptions = ['All', ...displayDepts.map(d => d.name)];

//   // 2. LIVE YEAR OPTIONS: Extracting unique years from existing batches
//   const yearOptions = ['All', ...new Set(batches.map(b => b.batch))];

//   // 3. COMBINED FILTER LOGIC (Search + Dept + Year)
//   const filteredBatches = batches.filter(batch => {
//     const batchLabel = batch.batch || "";
//     const matchesSearch = batchLabel.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesDept = activeFilter === 'All' || batch.dept === activeFilter;
//     const matchesYear = activeYearFilter === 'All' || batch.batch === activeYearFilter;
    
//     return matchesSearch && matchesDept && matchesYear;
//   });

//   return (
//     <div className="app-layout w-full text-left">
//       <Sidebar 
//         isHidden={false} 
//         userRole={userRole} 
//         currentUser={currentUser} 
//         currentPage="result-ledger" 
//         setCurrentPage={setCurrentPage} 
//         onLogout={onLogout} 
//       />
//       <main className="main-content">
//         <div className="container">
          
//           <div className="header-section">
//             <div className="page-title">
//               <h1 className="text-3xl font-black text-slate-900">Result Management</h1>
//               <p className="text-slate-500 font-medium mt-1">
//                 Select an active batch to view Master Registers and Supplementary Ledgers.
//               </p>
//             </div>
//           </div>

//           {/* FILTERS SECTION */}
//           <div className="space-y-4">
//             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-6 mb-8">
//               <h3 className="font-black text-xl text-slate-900 uppercase tracking-tight">Batch Management</h3>
              
//               <div className="flex flex-wrap gap-4">
//                 {/* Search Filter - Pill Style */}
//                 <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
//                    <input 
//                     type="text" 
//                     placeholder="Search batch..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="bg-transparent px-3 py-1.5 text-[11px] font-bold text-slate-600 outline-none w-32 md:w-48 placeholder:text-slate-400"
//                   />
//                 </div>

//                 {/* Live Department Filter - Pill Style */}
//                 <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
//                   <select 
//                     value={activeFilter} 
//                     onChange={(e) => setActiveFilter(e.target.value)}
//                     className="bg-transparent px-3 py-1.5 text-[11px] font-black text-slate-600 outline-none cursor-pointer appearance-none pr-6 relative"
//                     style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'3\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'%3E%3C/polyline%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 4px center', backgroundSize: '10px' }}
//                   >
//                     {deptOptions.map(opt => (
//                       <option key={opt} value={opt}>
//                         {opt === 'All' ? 'All Departments' : opt}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 {/* Live Year Filter - Pill Style */}
//                 <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
//                   <select 
//                     value={activeYearFilter} 
//                     onChange={(e) => setActiveYearFilter(e.target.value)}
//                     className="bg-transparent px-3 py-1.5 text-[11px] font-black text-slate-600 outline-none cursor-pointer appearance-none pr-6 relative"
//                     style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'3\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'%3E%3C/polyline%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 4px center', backgroundSize: '10px' }}
//                   >
//                     {yearOptions.map(opt => (
//                       <option key={opt} value={opt}>
//                         {opt === 'All' ? 'All Years' : opt}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* BATCH GRID */}
//           {filteredBatches.length === 0 ? (
//             <div className="col-span-full py-20 text-center bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 animate-in fade-in duration-500">
//               <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">No matching batches found</p>
//               <button 
//                 onClick={() => {setActiveFilter('All'); setActiveYearFilter('All'); setSearchTerm('');}}
//                 className="mt-4 text-blue-600 font-black text-[10px] uppercase hover:underline"
//               >
//                 Clear all filters
//               </button>
//             </div>
//           ) : (
//             <div className="batch-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in slide-in-from-bottom-4 duration-500">
//               {filteredBatches.map(batch => (
//                 <BatchCard 
//                   key={batch.id} 
//                   batch={batch} 
//                   students={allStudents} 
//                   onRegularClick={(id) => navigate(`/results/master/${id}?tab=regular`)}
//                   onSupplementaryClick={(id) => navigate(`/results/master/${id}?tab=supplementary`)}
//                 />
//               ))}
//             </div>
//           )}

//         </div>
//       </main>
//     </div>
//   );
// };

// export default GatewayView;



import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar'; 
import BatchCard from './components/BatchCard';
import './styles/results.css'; 

const GatewayView = ({ 
  userRole, 
  currentUser, 
  setCurrentPage = () => {}, 
  onLogout, 
  batches = [], // Fetched from Backend (e.g., SELECT * FROM batches)
  allStudents = [], // Fetched from Backend (e.g., SELECT * FROM students)
  displayDepts = [] // Fetched from Backend (e.g., SELECT * FROM departments)
}) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [activeYearFilter, setActiveYearFilter] = useState('All');

  // 1. DYNAMIC OPTIONS LOGIC
  // We use useMemo so these lists don't recalculate unless the source data changes
  const deptOptions = useMemo(() => {
    return ['All', ...displayDepts.map(d => d.name)];
  }, [displayDepts]);

  const yearOptions = useMemo(() => {
    // Extracts unique batch years from the actual data in the database
    const years = batches.map(b => b.batch);
    return ['All', ...new Set(years)].sort((a, b) => b - a);
  }, [batches]);

  // 2. BACKEND-CONNECTED FILTER LOGIC
  const filteredBatches = useMemo(() => {
    return batches.filter(batch => {
      // Logic: Connects to 'batch' (year) and 'dept' (department) fields from your DB
      const batchLabel = String(batch.batch || "");
      const matchesSearch = batchLabel.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDept = activeFilter === 'All' || batch.dept === activeFilter;
      const matchesYear = activeYearFilter === 'All' || String(batch.batch) === activeYearFilter;
      
      return matchesSearch && matchesDept && matchesYear;
    });
  }, [searchTerm, activeFilter, activeYearFilter, batches]);

  return (
    <div className="app-layout w-full text-left">
      <Sidebar 
        isHidden={false} 
        userRole={userRole} 
        currentUser={currentUser} 
        currentPage="result-ledger" 
        setCurrentPage={setCurrentPage} 
        onLogout={onLogout} 
      />
      <main className="main-content">
        <div className="container">
          
          <div className="header-section">
            <div className="page-title">
              <h1 className="text-3xl font-black text-slate-900">Result Management</h1>
              <p className="text-slate-500 font-medium mt-1">
                Select an active batch to view Master Registers and Supplementary Ledgers.
              </p>
            </div>
          </div>

          {/* FILTERS SECTION */}
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-6 mb-8">
              <h3 className="font-black text-xl text-slate-900 uppercase tracking-tight">Batch Management</h3>
              
              <div className="flex flex-wrap gap-4">
                {/* Search Filter */}
                <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                   <input 
                    type="text" 
                    placeholder="Search batch..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-transparent px-3 py-1.5 text-[11px] font-bold text-slate-600 outline-none w-32 md:w-48 placeholder:text-slate-400"
                  />
                </div>

                {/* Dept Filter */}
                <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                  <select 
                    value={activeFilter} 
                    onChange={(e) => setActiveFilter(e.target.value)}
                    className="bg-transparent px-3 py-1.5 text-[11px] font-black text-slate-600 outline-none cursor-pointer appearance-none pr-6 relative"
                    style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'3\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'%3E%3C/polyline%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 4px center', backgroundSize: '10px' }}
                  >
                    {deptOptions.map(opt => (
                      <option key={opt} value={opt}>{opt === 'All' ? 'All Departments' : opt}</option>
                    ))}
                  </select>
                </div>

                {/* Year Filter */}
                <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                  <select 
                    value={activeYearFilter} 
                    onChange={(e) => setActiveYearFilter(e.target.value)}
                    className="bg-transparent px-3 py-1.5 text-[11px] font-black text-slate-600 outline-none cursor-pointer appearance-none pr-6 relative"
                    style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'3\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'%3E%3C/polyline%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 4px center', backgroundSize: '10px' }}
                  >
                    {yearOptions.map(opt => (
                      <option key={opt} value={opt}>{opt === 'All' ? 'All Years' : opt}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* BATCH GRID */}
          {filteredBatches.length === 0 ? (
            <div className="col-span-full py-20 text-center bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
              <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">No matching batches found</p>
              <button 
                onClick={() => {setActiveFilter('All'); setActiveYearFilter('All'); setSearchTerm('');}}
                className="mt-4 text-blue-600 font-black text-[10px] uppercase hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="batch-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredBatches.map(batch => (
                <BatchCard 
                  key={batch.id} 
                  batch={batch} 
                  students={allStudents} // Logic inside BatchCard will filter students where student.batchId === batch.id
                  onRegularClick={(id) => navigate(`/results/master/${id}?tab=regular`)}
                  onSupplementaryClick={(id) => navigate(`/results/master/${id}?tab=supplementary`)}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default GatewayView;