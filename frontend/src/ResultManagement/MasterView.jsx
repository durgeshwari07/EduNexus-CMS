// // import React, { useState } from 'react';
// // import { useSearchParams, useNavigate } from 'react-router-dom';
// // import Sidebar from '../components/Sidebar'; 
// // import masterData from './data/mockMasterData.json';
// // import './styles/results.css';

// // const MasterView = ({ userRole, currentUser, setCurrentPage, onLogout }) => {
// //   const [searchParams] = useSearchParams();
// //   const navigate = useNavigate();
// //   const currentTab = searchParams.get('tab') || 'regular';
// //   const isSupp = currentTab === 'supplementary';
  
// //   const [searchTerm, setSearchTerm] = useState('');
// //   const [sortOrder, setSortOrder] = useState('rollNo');
  
// //   const [isSidebarHidden, setIsSidebarHidden] = useState(true);
  
// //   const [selectedStudent, setSelectedStudent] = useState(null);
// //   const [selectedModalSem, setSelectedModalSem] = useState(1);

// //   if (!masterData.students || masterData.students.length === 0) {
// //     return (
// //       <div className="app-layout w-full">
// //         <Sidebar isHidden={false} userRole={userRole} currentUser={currentUser} currentPage="result-ledger" setCurrentPage={setCurrentPage} onLogout={onLogout} />
// //         <main className="main-content">
// //            <div className="container">
// //              <div className="no-data-container">
// //                 <h3>No Result Data Available</h3>
// //                 <p>There are currently no marks published for the selected batch.</p>
// //              </div>
// //            </div>
// //         </main>
// //       </div>
// //     );
// //   }

// //   const semesters = masterData.students[0].semesters;

// //   let displayedStudents = masterData.students.filter(student => {
// //     const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || student.rollNo.toLowerCase().includes(searchTerm.toLowerCase());
// //     const matchesTab = isSupp ? student.summary.backlogs > 0 : true;
// //     return matchesSearch && matchesTab;
// //   });

// //   if (sortOrder === 'cgpaDesc') {
// //     displayedStudents.sort((a, b) => b.summary.cgpa - a.summary.cgpa);
// //   } else {
// //     displayedStudents.sort((a, b) => a.rollNo.localeCompare(b.rollNo));
// //   }

// //   // BULLETPROOF EXPORT FUNCTION
// //   const handleExport = () => {
// //     let csv = "P.R. NO,ROLL NO,STUDENT NAME,";
    
// //     semesters.forEach(sem => {
// //       sem.major.forEach(m => {
// //         csv += `Sem${sem.sem} ${m.sub} ISA,Sem${sem.sem} ${m.sub} ESA,Sem${sem.sem} ${m.sub} TOT,Sem${sem.sem} ${m.sub} GRD,`;
// //       });
// //       csv += `Sem${sem.sem} ${sem.minor.sub} ISA,Sem${sem.sem} ${sem.minor.sub} ESA,Sem${sem.sem} ${sem.minor.sub} TOT,Sem${sem.sem} ${sem.minor.sub} GRD,`;
// //       csv += `Sem${sem.sem} ENT,Sem${sem.sem} SGPA,Sem${sem.sem} GRADE,`;
// //     });
// //     csv += "TOTAL BACKLOGS,FINAL SGPA,CGPA,FINAL RESULT\n";

// //     displayedStudents.forEach(s => {
// //       let row = `"${s.prNo}","${s.rollNo}","${s.name}",`;
      
// //       s.semesters.forEach(sem => {
// //         sem.major.forEach(m => {
// //           row += `"${m.isa}","${m.esa}","${m.tot}","${m.grd}",`;
// //         });
// //         row += `"${sem.minor.isa}","${sem.minor.esa}","${sem.minor.tot}","${sem.minor.grd}",`;
// //         row += `"${sem.entitlement ? sem.entitlement.marks : '-'}","${sem.sgpa}","${sem.grade}",`;
// //       });
      
// //       row += `"${s.summary.backlogs}","${s.semesters[s.semesters.length-1].sgpa}","${s.summary.cgpa}","${s.summary.status}"\n`;
// //       csv += row;
// //     });

// //     const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
// //     const url = window.URL.createObjectURL(blob);
// //     const a = document.createElement('a');
// //     a.href = url;
// //     a.download = `Batch_Results_Full_${currentTab}.csv`;
// //     a.click();
// //   };

// //   const activeSemData = selectedStudent ? selectedStudent.semesters.find(s => s.sem === selectedModalSem) || selectedStudent.semesters[selectedStudent.semesters.length - 1] : null;

// //   return (
// //     <div className="app-layout w-full">
// //       <Sidebar isHidden={isSidebarHidden} userRole={userRole} currentUser={currentUser} currentPage="result-ledger" setCurrentPage={setCurrentPage} onLogout={onLogout} />
      
// //       <main className="main-content" style={{ padding: isSidebarHidden ? '32px 60px' : '32px 40px' }}>
// //         <div className="container" style={{ maxWidth: '100%' }}>
          
// //           <div className="header-section">
// //             <div className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
// //               <button className="btn btn-outline" onClick={() => navigate('/results')}>← Back</button>
// //               <div>
// //                 <h1>Result Management</h1>
// //                 <p>{masterData.course} | Batch {masterData.batch}</p>
// //               </div>
// //             </div>
// //             <div className="stats-container">
// //               <div className="stat-box"><span>Total Students</span><strong>{masterData.stats.totalStudents}</strong></div>
// //               <div className="stat-box"><span>Avg CGPA</span><strong className="text-blue">{masterData.stats.avgCgpa}</strong></div>
// //               <div className="stat-box"><span>Pass %</span><strong className="text-green">{masterData.stats.passPercentage}</strong></div>
// //             </div>
// //           </div>

// //           <div className="page-tabs">
// //             <button className={`tab-btn ${!isSupp ? 'active' : ''}`} onClick={() => navigate('?tab=regular')}>Regular Marksheet</button>
// //             <button className={`tab-btn ${isSupp ? 'active' : ''}`} onClick={() => navigate('?tab=supplementary')} style={{color: isSupp ? '#e11d48' : '', borderBottomColor: isSupp ? '#e11d48' : 'transparent'}}>Supplementary Ledger</button>
// //           </div>

// //           <div className="toolbar">
// //             <div className="toolbar-left">
// //               <input type="text" className="search-input" placeholder="Search student or Roll No..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
// //               <select className="sort-select" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
// //                 <option value="rollNo">Sort by Roll No</option>
// //                 <option value="cgpaDesc">Sort by CGPA (High to Low)</option>
// //               </select>
// //             </div>
// //             <div className="toolbar-right">
// //               <button className="btn btn-outline" onClick={() => window.print()}>🖨️ Print Data</button>
// //               <button className="btn btn-primary" onClick={handleExport}>⬇️ Export Table</button>
// //             </div>
// //           </div>

// //           <div className="table-wrapper">
// //             <table>
// //               <thead>
// //                 <tr>
// //                   <th className="sticky-col-1" rowSpan="4">P.R. NO</th>
// //                   <th className="sticky-col-2" rowSpan="4">ROLL NO</th>
// //                   <th className="sticky-col-3" rowSpan="4">STUDENT NAME</th>
// //                   {semesters.map(s => <th key={s.sem} colSpan="15" className="sem-header border-left-heavy">SEMESTER {s.sem}</th>)}
// //                   <th colSpan="4" className="consol-header border-left-heavy" rowSpan="3">MARKSHEET</th>
// //                 </tr>
// //                 <tr>
// //                   {semesters.map((s, idx) => (
// //                     <React.Fragment key={idx}>
// //                       <th colSpan="8" className="category-major border-left-heavy">MAJOR</th>
// //                       <th colSpan="4" className="category-minor border-left-normal">MINOR</th>
// //                       <th colSpan="3" style={{background: '#f1f5f9', fontSize:'12px', fontWeight:'700'}} className="border-left-normal">RESULT</th>
// //                     </React.Fragment>
// //                   ))}
// //                 </tr>
// //                 <tr>
// //                   {semesters.map((s, idx) => (
// //                     <React.Fragment key={idx}>
// //                       <th colSpan="4" style={{background: '#fff', fontSize: '11px', textTransform:'uppercase'}} className="border-left-heavy">{s.major[0].sub}</th>
// //                       <th colSpan="4" style={{background: '#fff', fontSize: '11px', textTransform:'uppercase'}} className="border-left-normal">{s.major[1].sub}</th>
// //                       <th colSpan="4" style={{background: '#fff', fontSize: '11px', textTransform:'uppercase'}} className="border-left-normal">{s.minor.sub}</th>
// //                       <th rowSpan="2" style={{background: '#f1f5f9', fontSize:'10px', fontWeight:'700'}} className="border-left-normal">ENT. MARKS</th>
// //                       <th rowSpan="2" style={{background: '#f1f5f9', fontSize:'10px', fontWeight:'700'}}>SGPA</th>
// //                       <th rowSpan="2" style={{background: '#f1f5f9', fontSize:'10px', fontWeight:'700'}}>GRADE</th>
// //                     </React.Fragment>
// //                   ))}
// //                 </tr>
// //                 <tr>
// //                   {semesters.map((s, idx) => (
// //                     <React.Fragment key={idx}>
// //                       <th className="mark-header border-left-heavy">ISA</th><th className="mark-header">ESA</th><th className="mark-header">TOT</th><th className="mark-header">GRD</th>
// //                       <th className="mark-header border-left-normal">ISA</th><th className="mark-header">ESA</th><th className="mark-header">TOT</th><th className="mark-header">GRD</th>
// //                       <th className="minor-cell mark-header border-left-normal" style={{color:'#854d0e'}}>ISA</th><th className="minor-cell mark-header" style={{color:'#854d0e'}}>ESA</th><th className="minor-cell mark-header" style={{color:'#854d0e'}}>TOT</th><th className="minor-cell mark-header" style={{color:'#854d0e'}}>GRD</th>
// //                     </React.Fragment>
// //                   ))}
// //                   <th className="consol-sub border-left-heavy">TOTAL BACKLOGS</th><th className="consol-sub">SGPA</th><th className="consol-sub">CGPA</th><th className="consol-sub">FINAL RESULT</th>
// //                 </tr>
// //               </thead>
              
// //               <tbody>
// //                 {displayedStudents.length > 0 ? displayedStudents.map(student => (
// //                   <tr key={student.prNo}>
// //                     <td className="sticky-col-1">{student.prNo}</td>
// //                     <td className="sticky-col-2">{student.rollNo}</td>
// //                     <td className="sticky-col-3">
// //                       <button 
// //                         className="clickable-name" 
// //                         onClick={() => {
// //                           setSelectedStudent(student);
// //                           setSelectedModalSem(student.semesters[student.semesters.length - 1].sem);
// //                         }}
// //                       >
// //                         <span style={{background: student.summary.status === 'FAIL' ? '#fce7f3' : '#e0e7ff', color: student.summary.status === 'FAIL' ? '#9d174d' : '#3730a3', padding: '4px 8px', borderRadius: '50%', fontSize: '11px', fontWeight: '700', marginRight: '8px'}}>
// //                           {student.name.split(' ').map(n => n[0]).join('').substring(0,2)}
// //                         </span>
// //                         {student.name}
// //                       </button>
// //                     </td>

// //                     {student.semesters.map((sem, idx) => (
// //                       <React.Fragment key={idx}>
// //                         {sem.major.map((m, i) => {
// //                           const fail = m.grd === 'F';
// //                           const borderClass = i === 0 ? "border-left-heavy" : "border-left-normal";
// //                           return (
// //                             <React.Fragment key={i}>
// //                               <td className={`${borderClass} ${fail ? "col-isa-fail mark-fail-bg" : (isSupp ? "mark-empty" : "col-isa")}`}>{isSupp && !fail ? '-' : m.isa}</td>
// //                               <td className={fail ? "col-esa-fail mark-fail-bg" : (isSupp ? "mark-empty" : "col-esa")}>{isSupp && !fail ? '-' : m.esa}</td>
// //                               <td className={fail ? "col-tot-fail mark-fail-bg" : (isSupp ? "mark-empty" : "col-tot")}>{isSupp && !fail ? '-' : m.tot}</td>
// //                               <td className={fail ? "col-grd-fail mark-fail-bg" : (isSupp ? "mark-empty" : "col-grd")}>{isSupp && !fail ? '-' : m.grd}</td>
// //                             </React.Fragment>
// //                           );
// //                         })}
                        
// //                         <td className={`minor-cell border-left-normal ${sem.minor.grd === 'F' ? "col-isa-fail mark-fail-bg" : (isSupp ? "mark-empty" : "col-isa")}`}>{isSupp && sem.minor.grd !== 'F' ? '-' : sem.minor.isa}</td>
// //                         <td className={`minor-cell ${sem.minor.grd === 'F' ? "col-esa-fail mark-fail-bg" : (isSupp ? "mark-empty" : "col-esa")}`}>{isSupp && sem.minor.grd !== 'F' ? '-' : sem.minor.esa}</td>
// //                         <td className={`minor-cell ${sem.minor.grd === 'F' ? "col-tot-fail mark-fail-bg" : (isSupp ? "mark-empty" : "col-tot")}`}>{isSupp && sem.minor.grd !== 'F' ? '-' : sem.minor.tot}</td>
// //                         <td className={`minor-cell ${sem.minor.grd === 'F' ? "col-grd-fail mark-fail-bg" : (isSupp ? "mark-empty text-blue" : "col-grd")}`}>
// //                           {isSupp && sem.minor.grd !== 'F' ? '-' : sem.minor.grd}
// //                           {(sem.attempts > 1 && (sem.minor.grd === 'F' || !isSupp)) && <span className="attempt-tag" title={`Cleared in Attempt ${sem.attempts}`}>Att: {sem.attempts}</span>}
// //                         </td>

// //                         <td className={`border-left-normal ${isSupp ? "mark-empty" : "fw-bold text-blue"}`}>{(!isSupp && sem.entitlement) ? <>{sem.entitlement.marks}<span className="ent-tag">{sem.entitlement.type}</span></> : "-"}</td>
// //                         <td className={isSupp ? "mark-empty" : (sem.sgpa < 6 ? "fw-bold text-red" : "fw-bold")}>{isSupp ? '-' : sem.sgpa}</td>
// //                         <td className={isSupp ? "mark-empty" : (sem.grade === 'F' ? "fw-bold text-red" : "fw-bold")}>{isSupp ? '-' : sem.grade}</td>
// //                       </React.Fragment>
// //                     ))}

// //                     <td className={`fw-bold border-left-heavy ${student.summary.backlogs > 0 ? 'text-red' : 'text-green'}`}>{student.summary.backlogs}</td>
// //                     <td className={`fw-bold ${student.summary.status === 'FAIL' ? 'text-red' : ''}`}>{student.semesters[student.semesters.length - 1].sgpa}</td>
// //                     <td className={`fw-bold ${student.summary.status === 'PASS' ? 'text-green' : ''}`}>{student.summary.cgpa}</td>
// //                     <td><span className={student.summary.status === 'PASS' ? "badge-pass" : "badge-fail"}>{student.summary.status}</span></td>
// //                   </tr>
// //                 )) : (
// //                    <tr>
// //                       <td colSpan="37" className="mark-empty" style={{padding: 0, height: '200px', position: 'relative'}}>
// //                           {/* STICKY CENTERED EMPTY STATE! */}
// //                           <div style={{ position: 'sticky', left: '50%', transform: 'translateX(-50%)', display: 'inline-block', padding: '20px', color: isSupp ? '#dc2626' : '#64748b', fontWeight: 'bold' }}>
// //                             {isSupp ? "Supplementary Ledger data from Backend will populate here." : "No students match your search."}
// //                           </div>
// //                       </td>
// //                    </tr>
// //                 )}
// //               </tbody>
// //             </table>
// //           </div>
// //         </div>
// //       </main>

// //       {/* INDIVIDUAL MARKSHEET MODAL */}
// //       {selectedStudent && activeSemData && (
// //         <div className="modal-overlay active" onClick={() => setSelectedStudent(null)}>
// //           <div className="modal-container" onClick={e => e.stopPropagation()}>
// //             <div className="modal-header">
// //               <h2>Student Statement of Marks</h2>
// //               <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
// //                 <select 
// //                   className="sort-select" 
// //                   value={selectedModalSem} 
// //                   onChange={(e) => setSelectedModalSem(Number(e.target.value))}
// //                   style={{ padding: '6px 12px', fontSize: '13px', height: '36px', borderColor: '#cbd5e1' }}
// //                 >
// //                   {selectedStudent.semesters.map(s => (
// //                     <option key={s.sem} value={s.sem}>Semester {s.sem}</option>
// //                   ))}
// //                 </select>

// //                 <button className="btn btn-outline" style={{ height: '36px' }} onClick={() => window.print()}>🖨️ Print Report</button>
// //                 <button className="close-btn" onClick={() => setSelectedStudent(null)}>✕</button>
// //               </div>
// //             </div>
            
// //             <div className="modal-body">
// //               <div className="marksheet-doc">
// //                 <div className="ms-header">
// //                   <h1>Statement of Marks</h1>
// //                   <p>{masterData.collegeName ? masterData.collegeName.toUpperCase() : "UNIVERSITY ACADEMIC RECORD"}</p>
// //                 </div>
// //                 <div className="ms-student-info">
// //                   <div className="ms-info-col">
// //                     <div><span>P.R. No.</span>: {selectedStudent.prNo}</div>
// //                     <div><span>Roll No.</span>: {selectedStudent.rollNo}</div>
// //                     <div><span>Name</span>: {selectedStudent.name.toUpperCase()}</div>
// //                   </div>
// //                   <div className="ms-info-col" style={{textAlign: 'right'}}>
// //                     <div><span>Degree</span>: {masterData.course}</div>
// //                     <div><span>Batch</span>: {masterData.batch}</div>
// //                     <div><span>Semester</span>: {activeSemData.sem}</div>
// //                   </div>
// //                 </div>
// //                 <table className="ms-table">
// //                   <thead>
// //                     <tr><th style={{width: '40%'}}>Course Title</th><th>ISA</th><th>ESA</th><th>Total</th><th>Grade</th></tr>
// //                   </thead>
// //                   <tbody>
// //                     {activeSemData.major.map((m, i) => (
// //                       <tr key={i}>
// //                         <td className="text-left" style={{fontWeight: 'bold'}}>{m.sub} (Major)</td><td>{m.isa}</td><td>{m.esa}</td><td style={{fontWeight: 'bold'}}>{m.tot}</td><td style={{color: m.grd === 'F' ? '#dc2626' : '#136dec', fontWeight: 'bold'}}>{m.grd}</td>
// //                       </tr>
// //                     ))}
// //                     <tr>
// //                       <td className="text-left" style={{fontWeight: 'bold'}}>{activeSemData.minor.sub} (Minor)</td><td>{activeSemData.minor.isa}</td><td>{activeSemData.minor.esa}</td><td style={{fontWeight: 'bold'}}>{activeSemData.minor.tot}</td><td style={{color: activeSemData.minor.grd === 'F' ? '#dc2626' : '#136dec', fontWeight: 'bold'}}>{activeSemData.minor.grd}</td>
// //                     </tr>
// //                   </tbody>
// //                 </table>
// //                 <div className="ms-footer">
// //                   <div>
// //                     {activeSemData.entitlement && (
// //                       <div style={{marginBottom: '10px'}}>Entitlement Marks: <span>{activeSemData.entitlement.marks} ({activeSemData.entitlement.type})</span></div>
// //                     )}
// //                     <div>Current SGPA: <span>{activeSemData.sgpa}</span></div>
// //                     <div>Overall CGPA: <span>{selectedStudent.summary.cgpa}</span></div>
// //                   </div>
// //                   <div style={{textAlign: 'right'}}>
// //                     <div style={{marginBottom: '10px'}}>Total Backlogs: <span style={{color: selectedStudent.summary.backlogs > 0 ? '#dc2626' : '#10b981'}}>{selectedStudent.summary.backlogs}</span></div>
// //                     <div>Final Result: <span style={{color: selectedStudent.summary.status === 'FAIL' ? '#dc2626' : '#10b981'}}>{selectedStudent.summary.status}</span></div>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //     </div>
// //   );
// // };

// // export default MasterView;


// import React, { useState } from 'react';
// import { useSearchParams, useNavigate, useParams } from 'react-router-dom';

// // IMPORTING THE GLOBAL TEAM SIDEBAR
// import Sidebar from '../components/Sidebar'; 
// import masterData from './data/mockMasterData.json';
// import './styles/results.css';

// const MasterView = ({ userRole, currentUser, setCurrentPage, onLogout }) => {
//   const [searchParams] = useSearchParams();
//   const { batchId } = useParams();
//   const navigate = useNavigate();
//   const currentTab = searchParams.get('tab') || 'regular';
//   const isSupp = currentTab === 'supplementary';
  
//   const [searchTerm, setSearchTerm] = useState('');
//   const [sortOrder, setSortOrder] = useState('rollNo');
//   const [isSidebarHidden, setIsSidebarHidden] = useState(true);
  
//   const [selectedStudent, setSelectedStudent] = useState(null);
//   const [selectedModalSem, setSelectedModalSem] = useState(1);

//   // --- 1. THE "DEMO ONLY" EMPTY STATE LOGIC ---
//   // This ONLY triggers for the 'empty-demo' batch ID. 
//   if (batchId === 'empty-demo') {
//     return (
//       <div className="app-layout w-full">
//         <Sidebar 
//           isHidden={false} 
//           userRole={userRole} 
//           currentUser={currentUser} 
//           currentPage="result-ledger" 
//           setCurrentPage={setCurrentPage} 
//           onLogout={onLogout} 
//         />
//         <main className="main-content">
//            <div className="container">
//              <div className="header-section">
//                 <div className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
//                   <button className="btn btn-outline" onClick={() => navigate('/results')}>← Back</button>
//                   <div>
//                     <h1>Result Management</h1>
//                     <p>Bachelor of Computer Applications | Batch 2025 - 2028</p>
//                   </div>
//                 </div>
//              </div>

//              <div className="no-data-container" style={{ 
//                marginTop: '80px', background: 'white', padding: '80px 40px', 
//                borderRadius: '12px', border: '1px dashed #cbd5e1', textAlign: 'center' 
//              }}>
//                 <div style={{ fontSize: '60px', marginBottom: '20px' }}>📄</div>
//                 <h2 style={{ fontSize: '22px', color: '#1e293b', marginBottom: '12px', fontWeight: '700' }}>
//                   No Results Published
//                 </h2>
//                 <p style={{ color: '#64748b', fontSize: '16px', maxWidth: '400px', margin: '0 auto 32px auto' }}>
//                   The ledger for this batch is currently empty. Results will appear here once they are uploaded.
//                 </p>
//                 <button className="btn btn-primary" onClick={() => navigate('/results')}>
//                   Return to Batch List
//                 </button>
//              </div>
//            </div>
//         </main>
//       </div>
//     );
//   }

//   // --- 2. FULL DATA LOGIC (Runs for bca-2023, bca-2024, bba-2023) ---
//   const semesters = masterData.students[0].semesters;

//   let displayedStudents = masterData.students.filter(student => {
//     const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
//                          student.rollNo.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesTab = isSupp ? student.summary.backlogs > 0 : true;
//     return matchesSearch && matchesTab;
//   });

//   if (sortOrder === 'cgpaDesc') {
//     displayedStudents.sort((a, b) => b.summary.cgpa - a.summary.cgpa);
//   } else {
//     displayedStudents.sort((a, b) => a.rollNo.localeCompare(b.rollNo));
//   }

//   const handleExport = () => {
//     let csv = "P.R. NO,ROLL NO,STUDENT NAME,";
//     semesters.forEach(sem => {
//       sem.major.forEach(m => {
//         csv += `Sem${sem.sem} ${m.sub} ISA,Sem${sem.sem} ${m.sub} ESA,Sem${sem.sem} ${m.sub} TOT,Sem${sem.sem} ${m.sub} GRD,`;
//       });
//       csv += `Sem${sem.sem} ${sem.minor.sub} ISA,Sem${sem.sem} ${sem.minor.sub} ESA,Sem${sem.sem} ${sem.minor.sub} TOT,Sem${sem.sem} ${sem.minor.sub} GRD,`;
//       csv += `Sem${sem.sem} ENT,Sem${sem.sem} SGPA,Sem${sem.sem} GRADE,`;
//     });
//     csv += "TOTAL BACKLOGS,FINAL SGPA,CGPA,FINAL RESULT\n";

//     displayedStudents.forEach(s => {
//       let row = `"${s.prNo}","${s.rollNo}","${s.name}",`;
//       s.semesters.forEach(sem => {
//         sem.major.forEach(m => { row += `"${m.isa}","${m.esa}","${m.tot}","${m.grd}",`; });
//         row += `"${sem.minor.isa}","${sem.minor.esa}","${sem.minor.tot}","${sem.minor.grd}",`;
//         row += `"${sem.entitlement ? sem.entitlement.marks : '-'}","${sem.sgpa}","${sem.grade}",`;
//       });
//       row += `"${s.summary.backlogs}","${s.semesters[s.semesters.length-1].sgpa}","${s.summary.cgpa}","${s.summary.status}"\n`;
//       csv += row;
//     });

//     const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `Batch_Results_${batchId}_${currentTab}.csv`;
//     a.click();
//   };

//   const activeSemData = selectedStudent ? 
//     selectedStudent.semesters.find(s => s.sem === selectedModalSem) || 
//     selectedStudent.semesters[selectedStudent.student_semesters - 1] : null;

//   return (
//     <div className="app-layout w-full">
//       <Sidebar 
//         isHidden={isSidebarHidden} 
//         userRole={userRole} 
//         currentUser={currentUser} 
//         currentPage="result-ledger" 
//         setCurrentPage={setCurrentPage} 
//         onLogout={onLogout} 
//       />
      
//       <main className="main-content" style={{ padding: isSidebarHidden ? '32px 60px' : '32px 40px' }}>
//         <div className="container" style={{ maxWidth: '100%' }}>
          
//           <div className="header-section">
//             <div className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
//               <button className="btn btn-outline" onClick={() => navigate('/results')}>← Back</button>
//               <div>
//                 <h1>Result Management</h1>
//                 <p>{masterData.course} | Batch {masterData.batch}</p>
//               </div>
//             </div>
//             <div className="stats-container">
//               <div className="stat-box"><span>Total Students</span><strong>{masterData.stats.totalStudents}</strong></div>
//               <div className="stat-box"><span>Avg CGPA</span><strong className="text-blue">{masterData.stats.avgCgpa}</strong></div>
//               <div className="stat-box"><span>Pass %</span><strong className="text-green">{masterData.stats.passPercentage}</strong></div>
//             </div>
//           </div>

//           <div className="page-tabs">
//             <button className={`tab-btn ${!isSupp ? 'active' : ''}`} onClick={() => navigate('?tab=regular')}>Regular Marksheet</button>
//             <button className={`tab-btn ${isSupp ? 'active' : ''}`} onClick={() => navigate('?tab=supplementary')} style={{color: isSupp ? '#e11d48' : '', borderBottomColor: isSupp ? '#e11d48' : 'transparent'}}>Supplementary Ledger</button>
//           </div>

//           <div className="toolbar">
//             <div className="toolbar-left">
//               <input type="text" className="search-input" placeholder="Search student or Roll No..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
//               <select className="sort-select" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
//                 <option value="rollNo">Sort by Roll No</option>
//                 <option value="cgpaDesc">Sort by CGPA (High to Low)</option>
//               </select>
//             </div>
//             <div className="toolbar-right">
//               <button className="btn btn-outline" onClick={() => window.print()}>🖨️ Print Data</button>
//               <button className="btn btn-primary" onClick={handleExport}>⬇️ Export Table</button>
//             </div>
//           </div>

//           <div className="table-wrapper">
//             <table>
//               <thead>
//                 <tr>
//                   <th className="sticky-col-1" rowSpan="4">P.R. NO</th>
//                   <th className="sticky-col-2" rowSpan="4">ROLL NO</th>
//                   <th className="sticky-col-3" rowSpan="4">STUDENT NAME</th>
//                   {semesters.map(s => <th key={s.sem} colSpan="15" className="sem-header border-left-heavy">SEMESTER {s.sem}</th>)}
//                   <th colSpan="4" className="consol-header border-left-heavy" rowSpan="3">MARKSHEET</th>
//                 </tr>
//                 <tr>
//                   {semesters.map((s, idx) => (
//                     <React.Fragment key={idx}>
//                       <th colSpan="8" className="category-major border-left-heavy">MAJOR</th>
//                       <th colSpan="4" className="category-minor border-left-normal">MINOR</th>
//                       <th colSpan="3" style={{background: '#f1f5f9', fontSize:'12px', fontWeight:'700'}} className="border-left-normal">RESULT</th>
//                     </React.Fragment>
//                   ))}
//                 </tr>
//                 <tr>
//                   {semesters.map((s, idx) => (
//                     <React.Fragment key={idx}>
//                       <th colSpan="4" style={{background: '#fff', fontSize: '11px', textTransform:'uppercase'}} className="border-left-heavy">{s.major[0].sub}</th>
//                       <th colSpan="4" style={{background: '#fff', fontSize: '11px', textTransform:'uppercase'}} className="border-left-normal">{s.major[1].sub}</th>
//                       <th colSpan="4" style={{background: '#fff', fontSize: '11px', textTransform:'uppercase'}} className="border-left-normal">{s.minor.sub}</th>
//                       <th rowSpan="2" style={{background: '#f1f5f9', fontSize:'10px', fontWeight:'700'}} className="border-left-normal">ENT. MARKS</th>
//                       <th rowSpan="2" style={{background: '#f1f5f9', fontSize:'10px', fontWeight:'700'}}>SGPA</th>
//                       <th rowSpan="2" style={{background: '#f1f5f9', fontSize:'10px', fontWeight:'700'}}>GRADE</th>
//                     </React.Fragment>
//                   ))}
//                 </tr>
//                 <tr>
//                   {semesters.map((s, idx) => (
//                     <React.Fragment key={idx}>
//                       <th className="mark-header border-left-heavy">ISA</th><th className="mark-header">ESA</th><th className="mark-header">TOT</th><th className="mark-header">GRD</th>
//                       <th className="mark-header border-left-normal">ISA</th><th className="mark-header">ESA</th><th className="mark-header">TOT</th><th className="mark-header">GRD</th>
//                       <th className="minor-cell mark-header border-left-normal" style={{color:'#854d0e'}}>ISA</th><th className="minor-cell mark-header" style={{color:'#854d0e'}}>ESA</th><th className="minor-cell mark-header" style={{color:'#854d0e'}}>TOT</th><th className="minor-cell mark-header" style={{color:'#854d0e'}}>GRD</th>
//                     </React.Fragment>
//                   ))}
//                   <th className="consol-sub border-left-heavy">TOTAL BACKLOGS</th><th className="consol-sub">SGPA</th><th className="consol-sub">CGPA</th><th className="consol-sub">FINAL RESULT</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {displayedStudents.map(student => (
//                   <tr key={student.prNo}>
//                     <td className="sticky-col-1">{student.prNo}</td>
//                     <td className="sticky-col-2">{student.rollNo}</td>
//                     <td className="sticky-col-3" style={{color: '#136dec', fontWeight: '600'}}>
//                       <button 
//                         className="clickable-name" 
//                         onClick={() => {
//                           setSelectedStudent(student);
//                           setSelectedModalSem(student.semesters[student.semesters.length - 1].sem);
//                         }}
//                       >
//                         {student.name}
//                       </button>
//                     </td>
//                     {student.semesters.map((sem, idx) => (
//                       <React.Fragment key={idx}>
//                         {sem.major.map((m, i) => {
//                           const borderClass = i === 0 ? "border-left-heavy" : "border-left-normal";
//                           return (
//                             <React.Fragment key={i}>
//                               <td className={borderClass}>{m.isa}</td><td>{m.esa}</td><td>{m.tot}</td><td>{m.grd}</td>
//                             </React.Fragment>
//                           );
//                         })}
//                         <td className="border-left-normal">{sem.minor.isa}</td><td>{sem.minor.esa}</td><td>{sem.minor.tot}</td><td>{sem.minor.grd}</td>
//                         <td className="border-left-normal">{sem.entitlement?.marks || "-"}</td><td>{sem.sgpa}</td><td>{sem.grade}</td>
//                       </React.Fragment>
//                     ))}
//                     <td className="border-left-heavy">{student.summary.backlogs}</td><td>{student.semesters[student.semesters.length-1].sgpa}</td><td>{student.summary.cgpa}</td><td>{student.summary.status}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// // export default MasterView;
// import React, { useState } from 'react';
// import { useSearchParams, useNavigate, useParams } from 'react-router-dom';

// // IMPORTING THE GLOBAL TEAM SIDEBAR
// import Sidebar from '../components/Sidebar'; 
// import masterData from './data/mockMasterData.json';
// import './styles/results.css';

// const MasterView = ({ userRole, currentUser, setCurrentPage, onLogout }) => {
//   const [searchParams] = useSearchParams();
//   const { batchId } = useParams();
//   const navigate = useNavigate();
//   const currentTab = searchParams.get('tab') || 'regular';
//   const isSupp = currentTab === 'supplementary';
  
//   const [searchTerm, setSearchTerm] = useState('');
//   const [sortOrder, setSortOrder] = useState('rollNo');
//   const [isSidebarHidden, setIsSidebarHidden] = useState(true);
  
//   const [selectedStudent, setSelectedStudent] = useState(null);
//   const [selectedModalSem, setSelectedModalSem] = useState(1);

//   if (batchId === 'empty-demo' || !masterData.students || masterData.students.length === 0) {
//     return (
//       <div className="app-layout w-full">
//         <Sidebar isHidden={false} userRole={userRole} currentUser={currentUser} onLogout={onLogout} />
//         <main className="main-content">
//            <div className="container">
//              <div className="header-section">
//                 <button className="btn btn-outline" onClick={() => navigate('/results')}>Back</button>
//              </div>
//              <div className="no-data-container" style={{ textAlign: 'center', marginTop: '100px' }}>
//                 <div style={{ fontSize: '60px', marginBottom: '20px' }}>📄</div>
//                 <h2>No Results Published</h2>
//                 <p>The ledger for this batch is currently empty.</p>
//              </div>
//            </div>
//         </main>
//       </div>
//     );
//   }

//   const semesters = masterData.students[0].semesters;

//   let displayedStudents = masterData.students.filter(student => {
//     const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
//                          student.rollNo.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesTab = isSupp ? student.summary.backlogs > 0 : true;
//     return matchesSearch && matchesTab;
//   });

//   if (sortOrder === 'cgpaDesc') {
//     displayedStudents.sort((a, b) => b.summary.cgpa - a.summary.cgpa);
//   } else {
//     displayedStudents.sort((a, b) => a.rollNo.localeCompare(b.rollNo));
//   }

//   const handleExport = () => {
//     let csv = "P.R. NO,ROLL NO,STUDENT NAME,BACKLOGS,CGPA,RESULT\n";
//     displayedStudents.forEach(s => {
//       csv += `"${s.prNo}","${s.rollNo}","${s.name}","${s.summary.backlogs}","${s.summary.cgpa}","${s.summary.status}"\n`;
//     });
//     const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `Batch_Results_${batchId}.csv`;
//     a.click();
//   };

//   const activeSemData = selectedStudent ? 
//     selectedStudent.semesters.find(s => s.sem === selectedModalSem) || 
//     selectedStudent.semesters[selectedStudent.semesters.length - 1] : null;

//   return (
//     <div className="app-layout w-full">
//       <Sidebar isHidden={isSidebarHidden} userRole={userRole} currentUser={currentUser} currentPage="result-ledger" onLogout={onLogout} />
      
//       <main className="main-content" style={{ padding: isSidebarHidden ? '32px 60px' : '32px 40px' }}>
//         <div className="container print-container" id="printable-area">
          
//           <div className="header-section no-print">
//             <div className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
//               <button className="btn btn-outline" onClick={() => navigate('/results')}>Back</button>
//               <div>
//                 <h1>Result Management</h1>
//                 <p>{masterData.course} | Batch {masterData.batch}</p>
//               </div>
//             </div>
//             <div className="stats-container">
//               <div className="stat-box"><span>Total Students</span><strong>{masterData.stats.totalStudents}</strong></div>
//               <div className="stat-box"><span>Avg CGPA</span><strong className="text-blue">{masterData.stats.avgCgpa}</strong></div>
//               <div className="stat-box"><span>Pass %</span><strong className="text-green">{masterData.stats.passPercentage}</strong></div>
//             </div>
//           </div>

//           <div className="page-tabs no-print">
//             <button className={`tab-btn ${!isSupp ? 'active' : ''}`} onClick={() => navigate('?tab=regular')}>Regular Marksheet</button>
//             <button className={`tab-btn ${isSupp ? 'active' : ''}`} onClick={() => navigate('?tab=supplementary')} style={{color: isSupp ? '#e11d48' : '', borderBottomColor: isSupp ? '#e11d48' : 'transparent'}}>Supplementary Ledger</button>
//           </div>

//           <div className="toolbar no-print">
//             <div className="toolbar-left">
//               <input type="text" className="search-input" placeholder="Search student..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
//               <select className="sort-select" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
//                 <option value="rollNo">Sort by Roll No</option>
//                 <option value="cgpaDesc">Sort by CGPA</option>
//               </select>
//             </div>
//             <div className="toolbar-right">
//               <button className="btn btn-outline" onClick={() => setIsSidebarHidden(!isSidebarHidden)}>{isSidebarHidden ? 'Show Menu' : 'Hide Menu'}</button>
//               <button className="btn btn-outline" onClick={() => window.print()}>Print Data</button>
//               <button className="btn btn-primary" onClick={handleExport}>Export Table</button>
//             </div>
//           </div>

//           <div className="table-wrapper">
//             <table>
//               <thead>
//                 <tr>
//                   <th className="sticky-col-1" rowSpan="4">P.R. NO</th>
//                   <th className="sticky-col-2" rowSpan="4">ROLL NO</th>
//                   <th className="sticky-col-3" rowSpan="4">STUDENT NAME</th>
//                   {semesters.map(s => <th key={s.sem} colSpan="15" className="sem-header border-left-heavy">SEMESTER {s.sem}</th>)}
//                   <th colSpan="4" className="consol-header border-left-heavy" rowSpan="3">MARKSHEET</th>
//                 </tr>
//                 <tr>
//                   {semesters.map((s, idx) => (
//                     <React.Fragment key={idx}>
//                       <th colSpan="8" className="category-major border-left-heavy">MAJOR</th>
//                       <th colSpan="4" className="category-minor border-left-normal">MINOR</th>
//                       <th colSpan="3" style={{background: '#f1f5f9', fontSize:'12px', fontWeight:'700'}} className="border-left-normal">RESULT</th>
//                     </React.Fragment>
//                   ))}
//                 </tr>
//                 <tr>
//                   {semesters.map((s, idx) => (
//                     <React.Fragment key={idx}>
//                       <th colSpan="4" style={{background: '#fff', fontSize: '11px', textTransform:'uppercase'}} className="border-left-heavy">{s.major[0].sub}</th>
//                       <th colSpan="4" style={{background: '#fff', fontSize: '11px', textTransform:'uppercase'}} className="border-left-normal">{s.major[1].sub}</th>
//                       <th colSpan="4" style={{background: '#fff', fontSize: '11px', textTransform:'uppercase'}} className="border-left-normal">{s.minor.sub}</th>
//                     </React.Fragment>
//                   ))}
//                 </tr>
//                 <tr>
//                   {semesters.map((s, idx) => (
//                     <React.Fragment key={idx}>
//                       <th className="mark-header border-left-heavy">ISA</th><th className="mark-header">ESA</th><th className="mark-header">TOT</th><th className="mark-header">GRD</th>
//                       <th className="mark-header border-left-normal">ISA</th><th className="mark-header">ESA</th><th className="mark-header">TOT</th><th className="mark-header">GRD</th>
//                       <th className="minor-cell mark-header border-left-normal" style={{color:'#854d0e'}}>ISA</th><th className="minor-cell mark-header" style={{color:'#854d0e'}}>ESA</th><th className="minor-cell mark-header" style={{color:'#854d0e'}}>TOT</th><th className="minor-cell mark-header" style={{color:'#854d0e'}}>GRD</th>
//                       <th className="border-left-normal" style={{background: '#f1f5f9', fontSize:'10px', fontWeight:'700'}}>ENT</th><th style={{background: '#f1f5f9', fontSize:'10px', fontWeight:'700'}}>SGPA</th><th style={{background: '#f1f5f9', fontSize:'10px', fontWeight:'700'}}>GRD</th>
//                     </React.Fragment>
//                   ))}
//                   <th className="consol-sub border-left-heavy">BACKLOGS</th><th className="consol-sub">SGPA</th><th className="consol-sub">CGPA</th><th className="consol-sub">RESULT</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {displayedStudents.length > 0 ? (
//                   displayedStudents.map(student => (
//                     <tr key={student.prNo}>
//                       <td className="sticky-col-1">{student.prNo}</td>
//                       <td className="sticky-col-2">{student.rollNo}</td>
//                       <td className="sticky-col-3">
//                         <button className="clickable-name" onClick={() => { setSelectedStudent(student); setSelectedModalSem(student.semesters[student.semesters.length - 1].sem); }}>
//                           <span style={{ background: student.summary.status === 'FAIL' ? '#fce7f3' : '#e0e7ff', color: student.summary.status === 'FAIL' ? '#9d174d' : '#3730a3', padding: '4px 8px', borderRadius: '50%', fontSize: '11px', fontWeight: '700', marginRight: '12px', display: 'inline-block' }}>
//                             {student.name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase()}
//                           </span>
//                           {student.name}
//                         </button>
//                       </td>
//                       {student.semesters.map((sem, idx) => (
//                         <React.Fragment key={idx}>
//                           {sem.major.map((m, i) => {
//                             const show = !isSupp || m.grd === 'F';
//                             return (
//                               <React.Fragment key={i}>
//                                 <td className={i === 0 ? "border-left-heavy" : "border-left-normal"}>{show ? m.isa : '-'}</td>
//                                 <td>{show ? m.esa : '-'}</td>
//                                 <td>{show ? m.tot : '-'}</td>
//                                 <td style={{color: m.grd === 'F' ? '#e11d48' : 'inherit', fontWeight: 'bold'}}>
//                                   {show ? m.grd : '-'}
//                                   {/* ATTEMPT TAG LOGIC */}
//                                   {m.attempts > 1 && <span className="attempt-tag">A:{m.attempts}</span>}
//                                 </td>
//                               </React.Fragment>
//                             );
//                           })}
//                           <td className="border-left-normal">{(!isSupp || sem.minor.grd === 'F') ? sem.minor.isa : '-'}</td>
//                           <td>{(!isSupp || sem.minor.grd === 'F') ? sem.minor.esa : '-'}</td>
//                           <td>{(!isSupp || sem.minor.grd === 'F') ? sem.minor.tot : '-'}</td>
//                           <td style={{color: sem.minor.grd === 'F' ? '#e11d48' : 'inherit', fontWeight: 'bold'}}>
//                             {(!isSupp || sem.minor.grd === 'F') ? sem.minor.grd : '-'}
//                             {sem.minor.attempts > 1 && <span className="attempt-tag">A:{sem.minor.attempts}</span>}
//                           </td>
//                           <td className="border-left-normal">{sem.entitlement?.marks || "-"}</td>
//                           <td>{sem.sgpa}</td>
//                           <td>{sem.grade}</td>
//                         </React.Fragment>
//                       ))}
//                       <td className="border-left-heavy">{student.summary.backlogs}</td>
//                       <td>{student.semesters[student.semesters.length-1].sgpa}</td>
//                       <td>{student.summary.cgpa}</td>
//                       <td><span className={student.summary.status === 'PASS' ? "badge-pass" : "badge-fail"}>{student.summary.status}</span></td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="100" style={{ padding: '80px', textAlign: 'center', background: '#fff' }}>
//                       <div style={{ fontSize: '40px', marginBottom: '16px' }}>🔍</div>
//                       <h3 style={{ color: '#1e293b', marginBottom: '8px' }}>No Matching Students Found</h3>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </main>

//       {/* --- MODAL POPUP --- */}
//       {selectedStudent && activeSemData && (
//         <div className="modal-overlay active" style={{ zIndex: 9999 }} onClick={() => setSelectedStudent(null)}>
//           <div className="modal-container" onClick={e => e.stopPropagation()}>
//             <div className="modal-header no-print">
//               <h2>Individual Marksheet</h2>
//               <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
//                 <select className="sort-select" value={selectedModalSem} onChange={(e) => setSelectedModalSem(Number(e.target.value))}>
//                   {selectedStudent.semesters.map(s => <option key={s.sem} value={s.sem}>Semester {s.sem}</option>)}
//                 </select>
//                 <button className="btn btn-primary" onClick={() => window.print()}>Print Marksheet</button>
//                 <button className="close-btn" onClick={() => setSelectedStudent(null)}>✕</button>
//               </div>
//             </div>
//             <div className="modal-body">
//               <div className="marksheet-doc">
//                 <div className="ms-header"><h1>Statement of Marks</h1><p>{masterData.course.toUpperCase()}</p></div>
//                 <div className="ms-student-info">
//                   <div className="ms-info-col">
//                     <div><span>P.R. No.</span>: {selectedStudent.prNo}</div>
//                     <div><span>Roll No.</span>: {selectedStudent.rollNo}</div>
//                     <div><span>Name</span>: {selectedStudent.name.toUpperCase()}</div>
//                   </div>
//                 </div>
//                 <table className="ms-table">
//                   <thead><tr><th style={{width: '40%'}}>Course Title</th><th>ISA</th><th>ESA</th><th>Total</th><th>Grade</th></tr></thead>
//                   <tbody>
//                     {activeSemData.major.map((m, i) => (
//                       <tr key={i}><td className="text-left" style={{fontWeight: 'bold'}}>{m.sub}</td><td>{m.isa}</td><td>{m.esa}</td><td style={{fontWeight: 'bold'}}>{m.tot}</td><td style={{fontWeight: 'bold', color: m.grd === 'F' ? '#e11d48' : 'inherit'}}>{m.grd}</td></tr>
//                     ))}
//                     <tr><td className="text-left" style={{fontWeight: 'bold'}}>{activeSemData.minor.sub}</td><td>{activeSemData.minor.isa}</td><td>{activeSemData.minor.esa}</td><td style={{fontWeight: 'bold'}}>{activeSemData.minor.tot}</td><td style={{fontWeight: 'bold', color: activeSemData.minor.grd === 'F' ? '#e11d48' : 'inherit'}}>{activeSemData.minor.grd}</td></tr>
//                   </tbody>
//                 </table>
//                 <div className="ms-footer">
//                   <div><div>Current SGPA: <span>{activeSemData.sgpa}</span></div><div>Overall CGPA: <span>{selectedStudent.summary.cgpa}</span></div></div>
//                   <div style={{textAlign: 'right'}}><div>Final Result: <span>{selectedStudent.summary.status}</span></div></div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MasterView;


import React, { useState } from 'react';
import { useSearchParams, useNavigate, useParams } from 'react-router-dom';

// IMPORTING THE GLOBAL TEAM SIDEBAR
import Sidebar from '../components/Sidebar'; 
import masterData from './data/mockMasterData.json';
import './styles/results.css';

const MasterView = ({ userRole, currentUser, setCurrentPage, onLogout }) => {
  const [searchParams] = useSearchParams();
  const { batchId } = useParams();
  const navigate = useNavigate();
  const currentTab = searchParams.get('tab') || 'regular';
  const isSupp = currentTab === 'supplementary';
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('rollNo');
  const [isSidebarHidden, setIsSidebarHidden] = useState(true);
  
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedModalSem, setSelectedModalSem] = useState(1);

  if (batchId === 'empty-demo' || !masterData.students || masterData.students.length === 0) {
    return (
      <div className="app-layout w-full">
        <Sidebar isHidden={false} userRole={userRole} currentUser={currentUser} onLogout={onLogout} />
        <main className="main-content">
           <div className="container">
             <div className="header-section">
                <button className="btn btn-outline" onClick={() => navigate('/results')}>Back</button>
             </div>
             <div className="no-data-container" style={{ textAlign: 'center', marginTop: '100px' }}>
                <div style={{ fontSize: '60px', marginBottom: '20px' }}>📄</div>
                <h2>No Results Published</h2>
                <p>The ledger for this batch is currently empty.</p>
             </div>
           </div>
        </main>
      </div>
    );
  }

  const semesters = masterData.students[0].semesters;

  let displayedStudents = masterData.students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         student.rollNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = isSupp ? student.summary.backlogs > 0 : true;
    return matchesSearch && matchesTab;
  });

  if (sortOrder === 'cgpaDesc') {
    displayedStudents.sort((a, b) => b.summary.cgpa - a.summary.cgpa);
  } else {
    displayedStudents.sort((a, b) => a.rollNo.localeCompare(b.rollNo));
  }

  const handleExport = () => {
    let csv = "P.R. NO,ROLL NO,STUDENT NAME,BACKLOGS,CGPA,RESULT\n";
    displayedStudents.forEach(s => {
      csv += `"${s.prNo}","${s.rollNo}","${s.name}","${s.summary.backlogs}","${s.summary.cgpa}","${s.summary.status}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Batch_Results_${batchId}.csv`;
    a.click();
  };

  const activeSemData = selectedStudent ? 
    selectedStudent.semesters.find(s => s.sem === selectedModalSem) || 
    selectedStudent.semesters[selectedStudent.semesters.length - 1] : null;

  return (
    <div className="app-layout w-full">
      <Sidebar isHidden={isSidebarHidden} userRole={userRole} currentUser={currentUser} currentPage="result-ledger" onLogout={onLogout} />
      
      <main className="main-content" style={{ padding: isSidebarHidden ? '32px 60px' : '32px 40px' }}>
        <div className="container print-container" id="printable-area">
          
          <div className="header-section no-print">
            <div className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button className="btn btn-outline" onClick={() => navigate('/results')}>Back</button>
              <div>
                <h1>Result Management</h1>
                <p>{masterData.course} | Batch {masterData.batch}</p>
              </div>
            </div>
            <div className="stats-container">
              <div className="stat-box"><span>Total Students</span><strong>{masterData.stats.totalStudents}</strong></div>
              <div className="stat-box"><span>Avg CGPA</span><strong className="text-blue">{masterData.stats.avgCgpa}</strong></div>
              <div className="stat-box"><span>Pass %</span><strong className="text-green">{masterData.stats.passPercentage}</strong></div>
            </div>
          </div>

          <div className="page-tabs no-print">
            <button className={`tab-btn ${!isSupp ? 'active' : ''}`} onClick={() => navigate('?tab=regular')}>Regular Marksheet</button>
            <button className={`tab-btn ${isSupp ? 'active' : ''}`} onClick={() => navigate('?tab=supplementary')} style={{color: isSupp ? '#e11d48' : '', borderBottomColor: isSupp ? '#e11d48' : 'transparent'}}>Supplementary Ledger</button>
          </div>

          <div className="toolbar no-print">
            <div className="toolbar-left">
              <input type="text" className="search-input" placeholder="Search student..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              <select className="sort-select" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                <option value="rollNo">Sort by Roll No</option>
                <option value="cgpaDesc">Sort by CGPA</option>
              </select>
            </div>
            <div className="toolbar-right">
              <button className="btn btn-outline" onClick={() => setIsSidebarHidden(!isSidebarHidden)}>{isSidebarHidden ? 'Show Menu' : 'Hide Menu'}</button>
              <button className="btn btn-outline" onClick={() => window.print()}>Print Data</button>
              <button className="btn btn-primary" onClick={handleExport}>Export Table</button>
            </div>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th className="sticky-col-1" rowSpan="4">P.R. NO</th>
                  <th className="sticky-col-2" rowSpan="4">ROLL NO</th>
                  <th className="sticky-col-3" rowSpan="4">STUDENT NAME</th>
                  {semesters.map(s => <th key={s.sem} colSpan="15" className="sem-header border-left-heavy">SEMESTER {s.sem}</th>)}
                  <th colSpan="4" className="consol-header border-left-heavy" rowSpan="3">MARKSHEET</th>
                </tr>
                <tr>
                  {semesters.map((s, idx) => (
                    <React.Fragment key={idx}>
                      <th colSpan="8" className="category-major border-left-heavy">MAJOR</th>
                      <th colSpan="4" className="category-minor border-left-normal">MINOR</th>
                      <th colSpan="3" className="border-left-normal" style={{background: '#f1f5f9', fontSize:'12px', fontWeight:'700'}}>RESULT</th>
                    </React.Fragment>
                  ))}
                </tr>
                <tr>
                  {semesters.map((s, idx) => (
                    <React.Fragment key={idx}>
                      <th colSpan="4" className="border-left-heavy" style={{background: '#fff', fontSize: '11px', textTransform: 'uppercase'}}>{s.major[0].sub}</th>
                      <th colSpan="4" className="border-left-normal" style={{background: '#fff', fontSize: '11px', textTransform: 'uppercase'}}>{s.major[1].sub}</th>
                      <th colSpan="4" className="border-left-normal" style={{background: '#fff', fontSize: '11px', textTransform: 'uppercase'}}>{s.minor.sub}</th>
                      <th colSpan="3" className="border-left-normal"></th>
                    </React.Fragment>
                  ))}
                </tr>
                <tr>
                  {semesters.map((s, idx) => (
                    <React.Fragment key={idx}>
                      <th className="mark-header border-left-heavy">ISA</th><th className="mark-header">ESA</th><th className="mark-header">TOTAL</th><th className="mark-header">GRADE</th>
                      <th className="mark-header border-left-normal">ISA</th><th className="mark-header">ESA</th><th className="mark-header">TOTAL</th><th className="mark-header">GRADE</th>
                      <th className="minor-cell mark-header border-left-normal">ISA</th><th className="minor-cell mark-header">ESA</th><th className="minor-cell mark-header">TOTAL</th><th className="minor-cell mark-header">GRADE</th>
                      <th className="border-left-normal" style={{fontSize:'10px'}}>ENT</th><th style={{fontSize:'10px'}}>SGPA</th><th style={{fontSize:'10px'}}>GRADE</th>
                    </React.Fragment>
                  ))}
                  <th className="consol-sub border-left-heavy">BACKLOGS</th><th className="consol-sub">SGPA</th><th className="consol-sub">CGPA</th><th className="consol-sub">RESULT</th>
                </tr>
              </thead>
              <tbody>
                {displayedStudents.length > 0 ? (
                  displayedStudents.map(student => (
                    <tr key={student.prNo}>
                      <td className="sticky-col-1">{student.prNo}</td>
                      <td className="sticky-col-2">{student.rollNo}</td>
                      <td className="sticky-col-3">
                        <button className="clickable-name" onClick={() => { setSelectedStudent(student); setSelectedModalSem(student.semesters[student.semesters.length - 1].sem); }}>
                          <span style={{ background: student.summary.status === 'FAIL' ? '#fce7f3' : '#e0e7ff', color: student.summary.status === 'FAIL' ? '#9d174d' : '#3730a3', padding: '4px 8px', borderRadius: '50%', fontSize: '11px', fontWeight: '700', marginRight: '12px', display: 'inline-block' }}>
                            {student.name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase()}
                          </span>
                          {student.name}
                        </button>
                      </td>
                      {student.semesters.map((sem, idx) => (
                        <React.Fragment key={idx}>
                          {sem.major.map((m, i) => {
                            const show = !isSupp || m.grd === 'F';
                            return (
                              <React.Fragment key={i}>
                                <td className={i === 0 ? "border-left-heavy" : "border-left-normal"}>{show ? m.isa : '-'}</td>
                                {/* ✅ TOOLTIP ADDED TO ATTEMPT TAG IN ESA COLUMN */}
                                <td style={{fontWeight: m.attempts > 1 ? 'bold' : 'normal'}}>
                                  {show ? m.esa : '-'}
                                  {!isSupp && m.attempts > 1 && (
                                    <span 
                                      className="attempt-tag" 
                                      title={`Cleared in ${m.attempts}${m.attempts === 2 ? 'nd' : m.attempts === 3 ? 'rd' : 'th'} attempt`}
                                      style={{ cursor: 'help' }}
                                    >
                                      A:{m.attempts}
                                    </span>
                                  )}
                                </td>
                                <td>{show ? m.tot : '-'}</td>
                                <td style={{color: m.grd === 'F' ? '#e11d48' : 'inherit', fontWeight: 'bold'}}>{show ? m.grd : '-'}</td>
                              </React.Fragment>
                            );
                          })}
                          <td className="border-left-normal">{(!isSupp || sem.minor.grd === 'F') ? sem.minor.isa : '-'}</td>
                          <td style={{fontWeight: sem.minor.attempts > 1 ? 'bold' : 'normal'}}>
                            {(!isSupp || sem.minor.grd === 'F') ? sem.minor.esa : '-'}
                            {!isSupp && sem.minor.attempts > 1 && (
                              <span 
                                className="attempt-tag" 
                                title={`Cleared in ${sem.minor.attempts}${sem.minor.attempts === 2 ? 'nd' : sem.minor.attempts === 3 ? 'rd' : 'th'} attempt`}
                                style={{ cursor: 'help' }}
                              >
                                A:{sem.minor.attempts}
                              </span>
                            )}
                          </td>
                          <td>{(!isSupp || sem.minor.grd === 'F') ? sem.minor.tot : '-'}</td>
                          <td style={{color: sem.minor.grd === 'F' ? '#e11d48' : 'inherit', fontWeight: 'bold'}}>{(!isSupp || sem.minor.grd === 'F') ? sem.minor.grd : '-'}</td>
                          
                          <td className="border-left-normal">
                             {sem.entitlement ? (
                               <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap:'2px'}}>
                                 <span style={{fontWeight:'bold'}}>{sem.entitlement.marks}</span>
                                 <span className="ent-tag" style={{background: '#dcfce7', color: '#166534', fontSize:'8px', padding:'1px 4px', borderRadius:'4px'}}>{sem.entitlement.type}</span>
                               </div>
                             ) : "-"}
                          </td>
                          <td>{isSupp ? '-' : sem.sgpa}</td><td>{isSupp ? '-' : sem.grade}</td>
                        </React.Fragment>
                      ))}
                      <td className="border-left-heavy">{student.summary.backlogs}</td>
                      <td>{student.semesters[student.semesters.length-1].sgpa}</td>
                      <td>{student.summary.cgpa}</td>
                      <td><span className={student.summary.status === 'PASS' ? "badge-pass" : "badge-fail"}>{student.summary.status}</span></td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="100" style={{ padding: '80px', textAlign: 'center', background: '#fff' }}>
                      <div style={{ fontSize: '40px', marginBottom: '16px' }}>🔍</div>
                      <h3 style={{ color: '#1e293b', marginBottom: '8px' }}>No Matching Students Found</h3>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* --- MODAL --- */}
      {selectedStudent && activeSemData && (
        <div className="modal-overlay active" style={{ zIndex: 9999 }} onClick={() => setSelectedStudent(null)}>
          <div className="modal-container" onClick={e => e.stopPropagation()}>
            <div className="modal-header no-print">
              <h2>Individual Statement of Marks</h2>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <select className="sort-select" value={selectedModalSem} onChange={(e) => setSelectedModalSem(Number(e.target.value))}>
                  {selectedStudent.semesters.map(s => <option key={s.sem} value={s.sem}>Semester {s.sem}</option>)}
                </select>
                <button className="btn btn-primary" onClick={() => window.print()}>Print Marksheet</button>
                <button className="close-btn" onClick={() => setSelectedStudent(null)}>✕</button>
              </div>
            </div>
            <div className="modal-body">
              <div className="marksheet-doc">
                <div className="ms-header"><h1>Statement of Marks</h1><p>{masterData.course.toUpperCase()}</p></div>
                <div className="ms-student-info">
                  <div className="ms-info-col">
                    <div><span>P.R. No.</span>: {selectedStudent.prNo}</div>
                    <div><span>Roll No.</span>: {selectedStudent.rollNo}</div>
                    <div><span>Name</span>: {selectedStudent.name.toUpperCase()}</div>
                  </div>
                </div>
                <table className="ms-table">
                  <thead><tr><th style={{width: '40%'}}>Course Title</th><th>ISA</th><th>ESA</th><th>Total</th><th>Grade</th></tr></thead>
                  <tbody>
                    {activeSemData.major.map((m, i) => (
                      <tr key={i}><td className="text-left" style={{fontWeight: 'bold'}}>{m.sub}</td><td>{m.isa}</td><td>{m.esa} {m.attempts > 1 && <span className="attempt-tag" style={{float: 'right'}}>A:{m.attempts}</span>}</td><td style={{fontWeight: 'bold'}}>{m.tot}</td><td style={{fontWeight: 'bold', color: m.grd === 'F' ? '#e11d48' : 'inherit'}}>{m.grd}</td></tr>
                    ))}
                    <tr><td className="text-left" style={{fontWeight: 'bold'}}>{activeSemData.minor.sub}</td><td>{activeSemData.minor.isa}</td><td>{activeSemData.minor.esa} {activeSemData.minor.attempts > 1 && <span className="attempt-tag" style={{float: 'right'}}>A:{activeSemData.minor.attempts}</span>}</td><td style={{fontWeight: 'bold'}}>{activeSemData.minor.tot}</td><td style={{fontWeight: 'bold', color: activeSemData.minor.grd === 'F' ? '#e11d48' : 'inherit'}}>{activeSemData.minor.grd}</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MasterView;