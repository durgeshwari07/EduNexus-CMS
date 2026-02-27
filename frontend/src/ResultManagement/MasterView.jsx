

// // // // import React, { useState } from 'react';
// // // // import { useSearchParams, useNavigate, useParams } from 'react-router-dom';

// // // // // IMPORTING THE GLOBAL TEAM SIDEBAR
// // // // import Sidebar from '../components/Sidebar'; 
// // // // import masterData from './data/mockMasterData.json';
// // // // import './styles/results.css';

// // // // const MasterView = ({ userRole, currentUser, setCurrentPage, onLogout }) => {
// // // //   const [searchParams] = useSearchParams();
// // // //   const { batchId } = useParams();
// // // //   const navigate = useNavigate();
// // // //   const currentTab = searchParams.get('tab') || 'regular';
// // // //   const isSupp = currentTab === 'supplementary';
  
// // // //   const [searchTerm, setSearchTerm] = useState('');
// // // //   const [sortOrder, setSortOrder] = useState('rollNo');
// // // //   const [isSidebarHidden, setIsSidebarHidden] = useState(true);
  
// // // //   const [selectedStudent, setSelectedStudent] = useState(null);
// // // //   const [selectedModalSem, setSelectedModalSem] = useState(1);

// // // //   if (batchId === 'empty-demo' || !masterData.students || masterData.students.length === 0) {
// // // //     return (
// // // //       <div className="app-layout w-full">
// // // //         <Sidebar isHidden={false} userRole={userRole} currentUser={currentUser} onLogout={onLogout} />
// // // //         <main className="main-content">
// // // //            <div className="container">
// // // //              <div className="header-section">
// // // //                 <button className="btn btn-outline" onClick={() => navigate('/results')}>Back</button>
// // // //              </div>
// // // //              <div className="no-data-container" style={{ textAlign: 'center', marginTop: '100px' }}>
// // // //                 <div style={{ fontSize: '60px', marginBottom: '20px' }}>📄</div>
// // // //                 <h2>No Results Published</h2>
// // // //                 <p>The ledger for this batch is currently empty.</p>
// // // //              </div>
// // // //            </div>
// // // //         </main>
// // // //       </div>
// // // //     );
// // // //   }

// // // //   const semesters = masterData.students[0].semesters;

// // // //   let displayedStudents = masterData.students.filter(student => {
// // // //     const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
// // // //                          student.rollNo.toLowerCase().includes(searchTerm.toLowerCase());
// // // //     const matchesTab = isSupp ? student.summary.backlogs > 0 : true;
// // // //     return matchesSearch && matchesTab;
// // // //   });

// // // //   if (sortOrder === 'cgpaDesc') {
// // // //     displayedStudents.sort((a, b) => b.summary.cgpa - a.summary.cgpa);
// // // //   } else {
// // // //     displayedStudents.sort((a, b) => a.rollNo.localeCompare(b.rollNo));
// // // //   }

// // // //   const handleExport = () => {
// // // //     let csv = "P.R. NO,ROLL NO,STUDENT NAME,BACKLOGS,CGPA,RESULT\n";
// // // //     displayedStudents.forEach(s => {
// // // //       csv += `"${s.prNo}","${s.rollNo}","${s.name}","${s.summary.backlogs}","${s.summary.cgpa}","${s.summary.status}"\n`;
// // // //     });
// // // //     const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
// // // //     const url = window.URL.createObjectURL(blob);
// // // //     const a = document.createElement('a');
// // // //     a.href = url;
// // // //     a.download = `Batch_Results_${batchId}.csv`;
// // // //     a.click();
// // // //   };

// // // //   const activeSemData = selectedStudent ? 
// // // //     selectedStudent.semesters.find(s => s.sem === selectedModalSem) || 
// // // //     selectedStudent.semesters[selectedStudent.semesters.length - 1] : null;

// // // //   return (
// // // //     <div className="app-layout w-full">
// // // //       <Sidebar isHidden={isSidebarHidden} userRole={userRole} currentUser={currentUser} currentPage="result-ledger" onLogout={onLogout} />
      
// // // //       <main className="main-content" style={{ padding: isSidebarHidden ? '32px 60px' : '32px 40px' }}>
// // // //         <div className="container print-container" id="printable-area">
          
// // // //           <div className="header-section no-print">
// // // //             <div className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
// // // //               <button className="btn btn-outline" onClick={() => navigate('/results')}>Back</button>
// // // //               <div>
// // // //                 <h1>Result Management</h1>
// // // //                 <p>{masterData.course} | Batch {masterData.batch}</p>
// // // //               </div>
// // // //             </div>
// // // //             <div className="stats-container">
// // // //               <div className="stat-box"><span>Total Students</span><strong>{masterData.stats.totalStudents}</strong></div>
// // // //               <div className="stat-box"><span>Avg CGPA</span><strong className="text-blue">{masterData.stats.avgCgpa}</strong></div>
// // // //               <div className="stat-box"><span>Pass %</span><strong className="text-green">{masterData.stats.passPercentage}</strong></div>
// // // //             </div>
// // // //           </div>

// // // //           <div className="page-tabs no-print">
// // // //             <button className={`tab-btn ${!isSupp ? 'active' : ''}`} onClick={() => navigate('?tab=regular')}>Regular Marksheet</button>
// // // //             <button className={`tab-btn ${isSupp ? 'active' : ''}`} onClick={() => navigate('?tab=supplementary')} style={{color: isSupp ? '#e11d48' : '', borderBottomColor: isSupp ? '#e11d48' : 'transparent'}}>Supplementary Ledger</button>
// // // //           </div>

// // // //           <div className="toolbar no-print">
// // // //             <div className="toolbar-left">
// // // //               <input type="text" className="search-input" placeholder="Search student..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
// // // //               <select className="sort-select" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
// // // //                 <option value="rollNo">Sort by Roll No</option>
// // // //                 <option value="cgpaDesc">Sort by CGPA</option>
// // // //               </select>
// // // //             </div>
// // // //             <div className="toolbar-right">
// // // //               <button className="btn btn-outline" onClick={() => setIsSidebarHidden(!isSidebarHidden)}>{isSidebarHidden ? 'Show Menu' : 'Hide Menu'}</button>
// // // //               <button className="btn btn-outline" onClick={() => window.print()}>Print Data</button>
// // // //               <button className="btn btn-primary" onClick={handleExport}>Export Table</button>
// // // //             </div>
// // // //           </div>

// // // //           <div className="table-wrapper">
// // // //             <table>
// // // //               <thead>
// // // //                 <tr>
// // // //                   <th className="sticky-col-1" rowSpan="4">P.R. NO</th>
// // // //                   <th className="sticky-col-2" rowSpan="4">ROLL NO</th>
// // // //                   <th className="sticky-col-3" rowSpan="4">STUDENT NAME</th>
// // // //                   {semesters.map(s => <th key={s.sem} colSpan="15" className="sem-header border-left-heavy">SEMESTER {s.sem}</th>)}
// // // //                   <th colSpan="4" className="consol-header border-left-heavy" rowSpan="3">MARKSHEET</th>
// // // //                 </tr>
// // // //                 <tr>
// // // //                   {semesters.map((s, idx) => (
// // // //                     <React.Fragment key={idx}>
// // // //                       <th colSpan="8" className="category-major border-left-heavy">MAJOR</th>
// // // //                       <th colSpan="4" className="category-minor border-left-normal">MINOR</th>
// // // //                       <th colSpan="3" className="border-left-normal" style={{background: '#f1f5f9', fontSize:'12px', fontWeight:'700'}}>RESULT</th>
// // // //                     </React.Fragment>
// // // //                   ))}
// // // //                 </tr>
// // // //                 <tr>
// // // //                   {semesters.map((s, idx) => (
// // // //                     <React.Fragment key={idx}>
// // // //                       <th colSpan="4" className="border-left-heavy" style={{background: '#fff', fontSize: '11px', textTransform: 'uppercase'}}>{s.major[0].sub}</th>
// // // //                       <th colSpan="4" className="border-left-normal" style={{background: '#fff', fontSize: '11px', textTransform: 'uppercase'}}>{s.major[1].sub}</th>
// // // //                       <th colSpan="4" className="border-left-normal" style={{background: '#fff', fontSize: '11px', textTransform: 'uppercase'}}>{s.minor.sub}</th>
// // // //                       <th colSpan="3" className="border-left-normal"></th>
// // // //                     </React.Fragment>
// // // //                   ))}
// // // //                 </tr>
// // // //                 <tr>
// // // //                   {semesters.map((s, idx) => (
// // // //                     <React.Fragment key={idx}>
// // // //                       <th className="mark-header border-left-heavy">ISA</th><th className="mark-header">ESA</th><th className="mark-header">TOTAL</th><th className="mark-header">GRADE</th>
// // // //                       <th className="mark-header border-left-normal">ISA</th><th className="mark-header">ESA</th><th className="mark-header">TOTAL</th><th className="mark-header">GRADE</th>
// // // //                       <th className="minor-cell mark-header border-left-normal">ISA</th><th className="minor-cell mark-header">ESA</th><th className="minor-cell mark-header">TOTAL</th><th className="minor-cell mark-header">GRADE</th>
// // // //                       <th className="border-left-normal" style={{fontSize:'10px'}}>ENT</th><th style={{fontSize:'10px'}}>SGPA</th><th style={{fontSize:'10px'}}>GRADE</th>
// // // //                     </React.Fragment>
// // // //                   ))}
// // // //                   <th className="consol-sub border-left-heavy">BACKLOGS</th><th className="consol-sub">SGPA</th><th className="consol-sub">CGPA</th><th className="consol-sub">RESULT</th>
// // // //                 </tr>
// // // //               </thead>
// // // //               <tbody>
// // // //                 {displayedStudents.length > 0 ? (
// // // //                   displayedStudents.map(student => (
// // // //                     <tr key={student.prNo}>
// // // //                       <td className="sticky-col-1">{student.prNo}</td>
// // // //                       <td className="sticky-col-2">{student.rollNo}</td>
// // // //                       <td className="sticky-col-3">
// // // //                         <button className="clickable-name" onClick={() => { setSelectedStudent(student); setSelectedModalSem(student.semesters[student.semesters.length - 1].sem); }}>
// // // //                           <span style={{ background: student.summary.status === 'FAIL' ? '#fce7f3' : '#e0e7ff', color: student.summary.status === 'FAIL' ? '#9d174d' : '#3730a3', padding: '4px 8px', borderRadius: '50%', fontSize: '11px', fontWeight: '700', marginRight: '12px', display: 'inline-block' }}>
// // // //                             {student.name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase()}
// // // //                           </span>
// // // //                           {student.name}
// // // //                         </button>
// // // //                       </td>
// // // //                       {student.semesters.map((sem, idx) => (
// // // //                         <React.Fragment key={idx}>
// // // //                           {sem.major.map((m, i) => {
// // // //                             const show = !isSupp || m.grd === 'F';
// // // //                             return (
// // // //                               <React.Fragment key={i}>
// // // //                                 <td className={i === 0 ? "border-left-heavy" : "border-left-normal"}>{show ? m.isa : '-'}</td>
// // // //                                 {/* ✅ TOOLTIP ADDED TO ATTEMPT TAG IN ESA COLUMN */}
// // // //                                 <td style={{fontWeight: m.attempts > 1 ? 'bold' : 'normal'}}>
// // // //                                   {show ? m.esa : '-'}
// // // //                                   {!isSupp && m.attempts > 1 && (
// // // //                                     <span 
// // // //                                       className="attempt-tag" 
// // // //                                       title={`Cleared in ${m.attempts}${m.attempts === 2 ? 'nd' : m.attempts === 3 ? 'rd' : 'th'} attempt`}
// // // //                                       style={{ cursor: 'help' }}
// // // //                                     >
// // // //                                       A:{m.attempts}
// // // //                                     </span>
// // // //                                   )}
// // // //                                 </td>
// // // //                                 <td>{show ? m.tot : '-'}</td>
// // // //                                 <td style={{color: m.grd === 'F' ? '#e11d48' : 'inherit', fontWeight: 'bold'}}>{show ? m.grd : '-'}</td>
// // // //                               </React.Fragment>
// // // //                             );
// // // //                           })}
// // // //                           <td className="border-left-normal">{(!isSupp || sem.minor.grd === 'F') ? sem.minor.isa : '-'}</td>
// // // //                           <td style={{fontWeight: sem.minor.attempts > 1 ? 'bold' : 'normal'}}>
// // // //                             {(!isSupp || sem.minor.grd === 'F') ? sem.minor.esa : '-'}
// // // //                             {!isSupp && sem.minor.attempts > 1 && (
// // // //                               <span 
// // // //                                 className="attempt-tag" 
// // // //                                 title={`Cleared in ${sem.minor.attempts}${sem.minor.attempts === 2 ? 'nd' : sem.minor.attempts === 3 ? 'rd' : 'th'} attempt`}
// // // //                                 style={{ cursor: 'help' }}
// // // //                               >
// // // //                                 A:{sem.minor.attempts}
// // // //                               </span>
// // // //                             )}
// // // //                           </td>
// // // //                           <td>{(!isSupp || sem.minor.grd === 'F') ? sem.minor.tot : '-'}</td>
// // // //                           <td style={{color: sem.minor.grd === 'F' ? '#e11d48' : 'inherit', fontWeight: 'bold'}}>{(!isSupp || sem.minor.grd === 'F') ? sem.minor.grd : '-'}</td>
                          
// // // //                           <td className="border-left-normal">
// // // //                              {sem.entitlement ? (
// // // //                                <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap:'2px'}}>
// // // //                                  <span style={{fontWeight:'bold'}}>{sem.entitlement.marks}</span>
// // // //                                  <span className="ent-tag" style={{background: '#dcfce7', color: '#166534', fontSize:'8px', padding:'1px 4px', borderRadius:'4px'}}>{sem.entitlement.type}</span>
// // // //                                </div>
// // // //                              ) : "-"}
// // // //                           </td>
// // // //                           <td>{isSupp ? '-' : sem.sgpa}</td><td>{isSupp ? '-' : sem.grade}</td>
// // // //                         </React.Fragment>
// // // //                       ))}
// // // //                       <td className="border-left-heavy">{student.summary.backlogs}</td>
// // // //                       <td>{student.semesters[student.semesters.length-1].sgpa}</td>
// // // //                       <td>{student.summary.cgpa}</td>
// // // //                       <td><span className={student.summary.status === 'PASS' ? "badge-pass" : "badge-fail"}>{student.summary.status}</span></td>
// // // //                     </tr>
// // // //                   ))
// // // //                 ) : (
// // // //                   <tr>
// // // //                     <td colSpan="100" style={{ padding: '80px', textAlign: 'center', background: '#fff' }}>
// // // //                       <div style={{ fontSize: '40px', marginBottom: '16px' }}>🔍</div>
// // // //                       <h3 style={{ color: '#1e293b', marginBottom: '8px' }}>No Matching Students Found</h3>
// // // //                     </td>
// // // //                   </tr>
// // // //                 )}
// // // //               </tbody>
// // // //             </table>
// // // //           </div>
// // // //         </div>
// // // //       </main>

// // // //       {/* --- MODAL --- */}
// // // //       {selectedStudent && activeSemData && (
// // // //         <div className="modal-overlay active" style={{ zIndex: 9999 }} onClick={() => setSelectedStudent(null)}>
// // // //           <div className="modal-container" onClick={e => e.stopPropagation()}>
// // // //             <div className="modal-header no-print">
// // // //               <h2>Individual Statement of Marks</h2>
// // // //               <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
// // // //                 <select className="sort-select" value={selectedModalSem} onChange={(e) => setSelectedModalSem(Number(e.target.value))}>
// // // //                   {selectedStudent.semesters.map(s => <option key={s.sem} value={s.sem}>Semester {s.sem}</option>)}
// // // //                 </select>
// // // //                 <button className="btn btn-primary" onClick={() => window.print()}>Print Marksheet</button>
// // // //                 <button className="close-btn" onClick={() => setSelectedStudent(null)}>✕</button>
// // // //               </div>
// // // //             </div>
// // // //             <div className="modal-body">
// // // //               <div className="marksheet-doc">
// // // //                 <div className="ms-header"><h1>Statement of Marks</h1><p>{masterData.course.toUpperCase()}</p></div>
// // // //                 <div className="ms-student-info">
// // // //                   <div className="ms-info-col">
// // // //                     <div><span>P.R. No.</span>: {selectedStudent.prNo}</div>
// // // //                     <div><span>Roll No.</span>: {selectedStudent.rollNo}</div>
// // // //                     <div><span>Name</span>: {selectedStudent.name.toUpperCase()}</div>
// // // //                   </div>
// // // //                 </div>
// // // //                 <table className="ms-table">
// // // //                   <thead><tr><th style={{width: '40%'}}>Course Title</th><th>ISA</th><th>ESA</th><th>Total</th><th>Grade</th></tr></thead>
// // // //                   <tbody>
// // // //                     {activeSemData.major.map((m, i) => (
// // // //                       <tr key={i}><td className="text-left" style={{fontWeight: 'bold'}}>{m.sub}</td><td>{m.isa}</td><td>{m.esa} {m.attempts > 1 && <span className="attempt-tag" style={{float: 'right'}}>A:{m.attempts}</span>}</td><td style={{fontWeight: 'bold'}}>{m.tot}</td><td style={{fontWeight: 'bold', color: m.grd === 'F' ? '#e11d48' : 'inherit'}}>{m.grd}</td></tr>
// // // //                     ))}
// // // //                     <tr><td className="text-left" style={{fontWeight: 'bold'}}>{activeSemData.minor.sub}</td><td>{activeSemData.minor.isa}</td><td>{activeSemData.minor.esa} {activeSemData.minor.attempts > 1 && <span className="attempt-tag" style={{float: 'right'}}>A:{activeSemData.minor.attempts}</span>}</td><td style={{fontWeight: 'bold'}}>{activeSemData.minor.tot}</td><td style={{fontWeight: 'bold', color: activeSemData.minor.grd === 'F' ? '#e11d48' : 'inherit'}}>{activeSemData.minor.grd}</td></tr>
// // // //                   </tbody>
// // // //                 </table>
// // // //               </div>
// // // //             </div>
// // // //           </div>
// // // //         </div>
// // // //       )}
// // // //     </div>
// // // //   );
// // // // };

// // // // export default MasterView;




// import React, { useState, useEffect, useMemo } from 'react';
// import { useSearchParams, useNavigate, useParams } from 'react-router-dom';
// import axios from 'axios';

// // IMPORTING THE GLOBAL TEAM SIDEBAR
// import Sidebar from '../components/Sidebar'; 
// import './styles/results.css';

// const API_URL = 'http://localhost:5000/api';

// const MasterView = ({ userRole, currentUser, onLogout }) => {
//   const { batchId } = useParams();
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();

//   // --- LIVE DATA STATE ---
//   const [batchData, setBatchData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // UI STATE
//   const [searchTerm, setSearchTerm] = useState('');
//   const [sortOrder, setSortOrder] = useState('enrollmentNo'); // Changed sort default
//   const [isSidebarHidden, setIsSidebarHidden] = useState(true);
//   const [selectedStudent, setSelectedStudent] = useState(null);

//   const currentTab = searchParams.get('tab') || 'regular';
//   const isSupp = currentTab === 'supplementary';

//   // --- FETCHING LOGIC ---
//   useEffect(() => {
//     const fetchBatchLedger = async () => {
//       try {
//         setLoading(true);
//         const res = await axios.get(`${API_URL}/batch-results/${batchId}`);
//         setBatchData(res.data);
//       } catch (err) {
//         console.error("Error fetching batch data:", err);
//         setError("Could not load result ledger. Check backend connection.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     if (batchId) fetchBatchLedger();
//   }, [batchId]);

//   // --- FILTER & SORT ---
//   const filteredStudents = useMemo(() => {
//     if (!batchData?.students) return [];
    
//     let list = batchData.students.filter(s => {
//       const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
//                            s.enrollmentNo.toLowerCase().includes(searchTerm.toLowerCase());
//       const matchesTab = isSupp ? s.summary.backlogs > 0 : true;
//       return matchesSearch && matchesTab;
//     });

//     if (sortOrder === 'cgpaDesc') {
//       list.sort((a, b) => b.summary.cgpa - a.summary.cgpa);
//     } else {
//       // Sort by Enrollment Number
//       list.sort((a, b) => a.enrollmentNo.localeCompare(b.enrollmentNo));
//     }
//     return list;
//   }, [batchData, searchTerm, isSupp, sortOrder]);

//   if (loading) return <div className="p-20 text-center font-bold">Loading Batch Ledger...</div>;
//   if (error) return <div className="p-20 text-center text-red-500">{error}</div>;
//   if (!batchData) return <div className="p-20 text-center">No batch data found.</div>;

//   const { batchInfo, stats } = batchData;

//   // --- EXPORT HANDLER ---
//   const handleExport = () => {
//     let csv = "P.R. NO,ENROLLMENT NO,STUDENT NAME,BACKLOGS,CGPA,RESULT\n";
//     filteredStudents.forEach(s => {
//       csv += `"${s.prNo}","${s.enrollmentNo}","${s.name}","${s.summary.backlogs}","${s.summary.cgpa}","${s.summary.status}"\n`;
//     });
//     const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `Ledger_${batchInfo.name}_${batchId}.csv`;
//     a.click();
//   };

//   return (
//     <div className="app-layout w-full">
//       <Sidebar isHidden={isSidebarHidden} userRole={userRole} currentUser={currentUser} currentPage="result-ledger" onLogout={onLogout} />
      
//       <main className="main-content" style={{ padding: isSidebarHidden ? '32px 60px' : '32px 40px' }}>
//         <div className="container print-container" id="printable-area">
          
//           {/* HEADER SECTION */}
//           <div className="header-section no-print">
//             <div className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
//               <button className="btn btn-outline" onClick={() => navigate('/results')}>Back</button>
//               <div>
//                 <h1>{batchInfo.course} Ledger</h1>
//                 <p>Batch {batchInfo.year} | Academic Records</p>
//               </div>
//             </div>
//             <div className="stats-container">
//               <div className="stat-box"><span>Students</span><strong>{stats.totalStudents}</strong></div>
//               <div className="stat-box"><span>Avg CGPA</span><strong className="text-blue">{stats.avgCgpa}</strong></div>
//               <div className="stat-box"><span>Pass %</span><strong className="text-green">{stats.passPercentage}</strong></div>
//             </div>
//           </div>

//           {/* TOOLBAR */}
//           <div className="toolbar no-print">
//             <div className="toolbar-left">
//               <input 
//                 type="text" 
//                 className="search-input" 
//                 placeholder="Search Enrollment No or Name..." 
//                 value={searchTerm} 
//                 onChange={(e) => setSearchTerm(e.target.value)} 
//               />
//               <select className="sort-select" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
//                 <option value="enrollmentNo">Sort by Enrollment No</option>
//                 <option value="cgpaDesc">Sort by CGPA</option>
//               </select>
//             </div>
//             <div className="toolbar-right">
//               <button className="btn btn-outline" onClick={() => setIsSidebarHidden(!isSidebarHidden)}>
//                 {isSidebarHidden ? 'Show Menu' : 'Hide Menu'}
//               </button>
//               <button className="btn btn-primary" onClick={handleExport}>Export CSV</button>
//             </div>
//           </div>

//           {/* MASTER TABLE */}
//           <div className="table-wrapper">
//             <table>
//               <thead>
//                 <tr>
//                   <th className="sticky-col-1" rowSpan="3">P.R. NO</th>
//                   <th className="sticky-col-2" rowSpan="3">ENROLLMENT NO</th>
//                   <th className="sticky-col-3" rowSpan="3">STUDENT NAME</th>
//                   {filteredStudents[0]?.semesters.map(s => (
//                     <th key={s.sem} colSpan="15" className="sem-header border-left-heavy">SEMESTER {s.sem}</th>
//                   ))}
//                   <th colSpan="4" className="consol-header border-left-heavy" rowSpan="2">CONSOLIDATED</th>
//                 </tr>
//                 <tr>
//                   {filteredStudents[0]?.semesters.map((_, i) => (
//                     <React.Fragment key={i}>
//                       <th colSpan="8" className="category-major border-left-heavy">MAJOR SUBJECTS</th>
//                       <th colSpan="4" className="category-minor border-left-normal">MINOR</th>
//                       <th colSpan="3" className="border-left-normal" style={{background: '#f1f5f9'}}>RESULT</th>
//                     </React.Fragment>
//                   ))}
//                 </tr>
//                 <tr>
//                   {filteredStudents[0]?.semesters.map((_, i) => (
//                     <React.Fragment key={i}>
//                       <th className="mark-header border-left-heavy">ISA</th><th className="mark-header">ESA</th><th className="mark-header">TOT</th><th className="mark-header">GRD</th>
//                       <th className="mark-header border-left-normal">ISA</th><th className="mark-header">ESA</th><th className="mark-header">TOT</th><th className="mark-header">GRD</th>
//                       <th className="mark-header border-left-normal">ISA</th><th className="mark-header">ESA</th><th className="mark-header">TOT</th><th className="mark-header">GRD</th>
//                       <th className="border-left-normal">ENT</th><th>SGPA</th><th>RES</th>
//                     </React.Fragment>
//                   ))}
//                   <th className="consol-sub border-left-heavy">BK</th><th>SGPA</th><th>CGPA</th><th>RESULT</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredStudents.map(student => (
//                   <tr key={student.id}>
//                     <td className="sticky-col-1">{student.prNo}</td>
//                     <td className="sticky-col-2">{student.enrollmentNo}</td>
//                     <td className="sticky-col-3">
//                       <button className="clickable-name" onClick={() => setSelectedStudent(student)}>
//                         {student.name}
//                       </button>
//                     </td>
//                     {student.semesters.map((sem, sIdx) => (
//                       <React.Fragment key={sIdx}>
//                         {sem.major.map((m, mIdx) => (
//                           <React.Fragment key={mIdx}>
//                             <td className={mIdx === 0 ? "border-left-heavy" : "border-left-normal"}>{m.isa}</td>
//                             <td>{m.esa}</td>
//                             <td className="font-bold">{m.tot}</td>
//                             <td className={m.grd === 'F' ? "text-red-500 font-bold" : ""}>{m.grd}</td>
//                           </React.Fragment>
//                         ))}
//                         <td className="border-left-normal">{sem.minor.isa}</td>
//                         <td>{sem.minor.esa}</td>
//                         <td className="font-bold">{sem.minor.tot}</td>
//                         <td className={sem.minor.grd === 'F' ? "text-red-500 font-bold" : ""}>{sem.minor.grd}</td>
//                         <td className="border-left-normal">--</td>
//                         <td className="font-bold">{sem.sgpa}</td>
//                         <td className={sem.sgpa >= 4 ? "text-green-600" : "text-red-600"}>{sem.sgpa >= 4 ? 'P' : 'F'}</td>
//                       </React.Fragment>
//                     ))}
//                     <td className="border-left-heavy font-bold text-center">{student.summary.backlogs}</td>
//                     <td className="text-center">{student.summary.lastSGPA}</td>
//                     <td className="font-bold text-blue-600 text-center">{student.summary.cgpa}</td>
//                     <td className="text-center">
//                       <span className={`badge-${student.summary.status === 'PASS' ? 'pass' : 'fail'}`}>
//                         {student.summary.status}
//                       </span>
//                     </td>
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

// export default MasterView;



// import React, { useState, useEffect, useMemo } from 'react';
// import { useSearchParams, useNavigate, useParams } from 'react-router-dom';
// import axios from 'axios';

// // IMPORTING THE GLOBAL TEAM SIDEBAR
// import Sidebar from '../components/Sidebar'; 
// import './styles/results.css';

// const API_URL = 'http://localhost:5000/api';

// const MasterView = ({ userRole, currentUser, onLogout }) => {
//   const { batchId } = useParams();
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();

//   // --- LIVE DATA STATE ---
//   const [batchData, setBatchData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // UI STATE
//   const [searchTerm, setSearchTerm] = useState('');
//   const [sortOrder, setSortOrder] = useState('enrollmentNo'); // Default to Enrollment No
//   const [isSidebarHidden, setIsSidebarHidden] = useState(true);
//   const [selectedStudent, setSelectedStudent] = useState(null);
//   const [selectedModalSem, setSelectedModalSem] = useState(1);

//   const currentTab = searchParams.get('tab') || 'regular';
//   const isSupp = currentTab === 'supplementary';

//   // --- FETCHING LOGIC ---
//   useEffect(() => {
//     const fetchBatchLedger = async () => {
//       try {
//         setLoading(true);
//         const res = await axios.get(`${API_URL}/batch-results/${batchId}`);
//         setBatchData(res.data);
//       } catch (err) {
//         console.error("Error fetching batch data:", err);
//         setError("Could not load result ledger. Check backend connection.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     if (batchId) fetchBatchLedger();
//   }, [batchId]);

//   // --- FILTER & SORT LOGIC ---
//   const displayedStudents = useMemo(() => {
//     if (!batchData?.students) return [];
    
//     let list = batchData.students.filter(student => {
//       const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
//                            student.enrollmentNo.toLowerCase().includes(searchTerm.toLowerCase());
//       const matchesTab = isSupp ? student.summary.backlogs > 0 : true;
//       return matchesSearch && matchesTab;
//     });

//     if (sortOrder === 'cgpaDesc') {
//       list.sort((a, b) => b.summary.cgpa - a.summary.cgpa);
//     } else {
//       list.sort((a, b) => a.enrollmentNo.localeCompare(b.enrollmentNo));
//     }
//     return list;
//   }, [batchData, searchTerm, isSupp, sortOrder]);

//   // Handle loading/error/empty states
//   if (loading) return <div className="p-20 text-center font-bold">Loading Batch Ledger...</div>;
//   if (error) return <div className="p-20 text-center text-red-500">{error}</div>;
//   if (!batchData || batchData.students.length === 0) {
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

//   const { batchInfo, stats } = batchData;
//   const semestersHeader = batchData.students[0]?.semesters || [];

//   const handleExport = () => {
//     let csv = "P.R. NO,ENROLLMENT NO,STUDENT NAME,BACKLOGS,CGPA,RESULT\n";
//     displayedStudents.forEach(s => {
//       csv += `"${s.prNo}","${s.enrollmentNo}","${s.name}","${s.summary.backlogs}","${s.summary.cgpa}","${s.summary.status}"\n`;
//     });
//     const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `Ledger_${batchInfo.course}_${batchId}.csv`;
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
//                 <p>{batchInfo.course} | Batch {batchInfo.name}</p>
//               </div>
//             </div>
//             <div className="stats-container">
//               <div className="stat-box"><span>Total Students</span><strong>{stats.totalStudents}</strong></div>
//               <div className="stat-box"><span>Avg CGPA</span><strong className="text-blue">{stats.avgCgpa}</strong></div>
//               <div className="stat-box"><span>Pass %</span><strong className="text-green">{stats.passPercentage}</strong></div>
//             </div>
//           </div>

//           <div className="page-tabs no-print">
//             <button className={`tab-btn ${!isSupp ? 'active' : ''}`} onClick={() => navigate('?tab=regular')}>Regular Marksheet</button>
//             <button className={`tab-btn ${isSupp ? 'active' : ''}`} onClick={() => navigate('?tab=supplementary')} style={{color: isSupp ? '#e11d48' : '', borderBottomColor: isSupp ? '#e11d48' : 'transparent'}}>Supplementary Ledger</button>
//           </div>

//           <div className="toolbar no-print">
//             <div className="toolbar-left">
//               <input type="text" className="search-input" placeholder="Search enrollment or name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
//               <select className="sort-select" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
//                 <option value="enrollmentNo">Sort by Enrollment No</option>
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
//                   <th className="sticky-col-2" rowSpan="4">ENROLLMENT NO</th>
//                   <th className="sticky-col-3" rowSpan="4">STUDENT NAME</th>
//                   {semestersHeader.map(s => <th key={s.sem} colSpan="15" className="sem-header border-left-heavy">SEMESTER {s.sem}</th>)}
//                   <th colSpan="4" className="consol-header border-left-heavy" rowSpan="3">MARKSHEET</th>
//                 </tr>
//                 <tr>
//                   {semestersHeader.map((s, idx) => (
//                     <React.Fragment key={idx}>
//                       <th colSpan="8" className="category-major border-left-heavy">MAJOR</th>
//                       <th colSpan="4" className="category-minor border-left-normal">MINOR</th>
//                       <th colSpan="3" className="border-left-normal" style={{background: '#f1f5f9', fontSize:'12px', fontWeight:'700'}}>RESULT</th>
//                     </React.Fragment>
//                   ))}
//                 </tr>
//                 <tr>
//                   {semestersHeader.map((s, idx) => (
//                     <React.Fragment key={idx}>
//                       <th colSpan="4" className="border-left-heavy" style={{background: '#fff', fontSize: '11px', textTransform: 'uppercase'}}>{s.major[0]?.subject || 'MAJOR 1'}</th>
//                       <th colSpan="4" className="border-left-normal" style={{background: '#fff', fontSize: '11px', textTransform: 'uppercase'}}>{s.major[1]?.subject || 'MAJOR 2'}</th>
//                       <th colSpan="4" className="border-left-normal" style={{background: '#fff', fontSize: '11px', textTransform: 'uppercase'}}>{s.minor.subject || 'MINOR'}</th>
//                       <th colSpan="3" className="border-left-normal"></th>
//                     </React.Fragment>
//                   ))}
//                 </tr>
//                 <tr>
//                   {semestersHeader.map((s, idx) => (
//                     <React.Fragment key={idx}>
//                       <th className="mark-header border-left-heavy">ISA</th><th className="mark-header">ESA</th><th className="mark-header">TOTAL</th><th className="mark-header">GRADE</th>
//                       <th className="mark-header border-left-normal">ISA</th><th className="mark-header">ESA</th><th className="mark-header">TOTAL</th><th className="mark-header">GRADE</th>
//                       <th className="minor-cell mark-header border-left-normal">ISA</th><th className="minor-cell mark-header">ESA</th><th className="minor-cell mark-header">TOTAL</th><th className="minor-cell mark-header">GRADE</th>
//                       <th className="border-left-normal" style={{fontSize:'10px'}}>ENT</th><th style={{fontSize:'10px'}}>SGPA</th><th style={{fontSize:'10px'}}>GRADE</th>
//                     </React.Fragment>
//                   ))}
//                   <th className="consol-sub border-left-heavy">BACKLOGS</th><th className="consol-sub">SGPA</th><th className="consol-sub">CGPA</th><th className="consol-sub">RESULT</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {displayedStudents.map(student => (
//                     <tr key={student.id}>
//                       <td className="sticky-col-1">{student.prNo}</td>
//                       <td className="sticky-col-2">{student.enrollmentNo}</td>
//                       <td className="sticky-col-3">
//                         <button className="clickable-name" onClick={() => { setSelectedStudent(student); setSelectedModalSem(student.semesters[student.semesters.length - 1]?.sem || 1); }}>
//                           <span style={{ background: student.summary.status === 'ATKT' ? '#fce7f3' : '#e0e7ff', color: student.summary.status === 'ATKT' ? '#9d174d' : '#3730a3', padding: '4px 8px', borderRadius: '50%', fontSize: '11px', fontWeight: '700', marginRight: '12px', display: 'inline-block' }}>
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
//                                 <td style={{color: m.grd === 'F' ? '#e11d48' : 'inherit', fontWeight: 'bold'}}>{show ? m.grd : '-'}</td>
//                               </React.Fragment>
//                             );
//                           })}
//                           <td className="border-left-normal">{(!isSupp || sem.minor.grd === 'F') ? sem.minor.isa : '-'}</td>
//                           <td>{(!isSupp || sem.minor.grd === 'F') ? sem.minor.esa : '-'}</td>
//                           <td>{(!isSupp || sem.minor.grd === 'F') ? sem.minor.tot : '-'}</td>
//                           <td style={{color: sem.minor.grd === 'F' ? '#e11d48' : 'inherit', fontWeight: 'bold'}}>{(!isSupp || sem.minor.grd === 'F') ? sem.minor.grd : '-'}</td>
//                           <td className="border-left-normal">-</td>
//                           <td>{isSupp ? '-' : sem.sgpa}</td><td>{isSupp ? '-' : (sem.sgpa >= 4 ? 'P' : 'F')}</td>
//                         </React.Fragment>
//                       ))}
//                       <td className="border-left-heavy">{student.summary.backlogs}</td>
//                       <td>{student.summary.lastSGPA}</td>
//                       <td>{student.summary.cgpa}</td>
//                       <td><span className={student.summary.status === 'PASS' ? "badge-pass" : "badge-fail"}>{student.summary.status}</span></td>
//                     </tr>
//                   ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </main>

//       {/* --- MODAL --- */}
//       {selectedStudent && activeSemData && (
//         <div className="modal-overlay active" style={{ zIndex: 9999 }} onClick={() => setSelectedStudent(null)}>
//           <div className="modal-container" onClick={e => e.stopPropagation()}>
//             <div className="modal-header no-print">
//               <h2>Individual Statement of Marks</h2>
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
//                 <div className="ms-header"><h1>Statement of Marks</h1><p>{batchInfo.course.toUpperCase()}</p></div>
//                 <div className="ms-student-info">
//                   <div className="ms-info-col">
//                     <div><span>P.R. No.</span>: {selectedStudent.prNo}</div>
//                     <div><span>Enrollment No.</span>: {selectedStudent.enrollmentNo}</div>
//                     <div><span>Name</span>: {selectedStudent.name.toUpperCase()}</div>
//                   </div>
//                 </div>
//                 <table className="ms-table">
//                   <thead><tr><th style={{width: '40%'}}>Course Title</th><th>ISA</th><th>ESA</th><th>Total</th><th>Grade</th></tr></thead>
//                   <tbody>
//                     {activeSemData.major.map((m, i) => (
//                       <tr key={i}><td className="text-left" style={{fontWeight: 'bold'}}>{m.subject}</td><td>{m.isa}</td><td>{m.esa}</td><td style={{fontWeight: 'bold'}}>{m.tot}</td><td style={{fontWeight: 'bold', color: m.grd === 'F' ? '#e11d48' : 'inherit'}}>{m.grd}</td></tr>
//                     ))}
//                     <tr><td className="text-left" style={{fontWeight: 'bold'}}>{activeSemData.minor.subject}</td><td>{activeSemData.minor.isa}</td><td>{activeSemData.minor.esa}</td><td style={{fontWeight: 'bold'}}>{activeSemData.minor.tot}</td><td style={{fontWeight: 'bold', color: activeSemData.minor.grd === 'F' ? '#e11d48' : 'inherit'}}>{activeSemData.minor.grd}</td></tr>
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MasterView;



import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

// IMPORTING THE GLOBAL TEAM SIDEBAR

import Sidebar from '../components/Sidebar'; 
import './styles/results.css';

const API_URL = 'http://localhost:5000/api';

const MasterView = ({ userRole, currentUser, onLogout }) => {
  const { batchId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // --- LIVE DATA STATE ---
  const [batchData, setBatchData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // UI STATE
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('enrollmentNo'); 
  const [isSidebarHidden, setIsSidebarHidden] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedModalSem, setSelectedModalSem] = useState(1);

  const currentTab = searchParams.get('tab') || 'regular';
  const isSupp = currentTab === 'supplementary';

  // --- FETCHING LOGIC ---
  useEffect(() => {
    const fetchBatchLedger = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/batch-results/${batchId}`);
        setBatchData(res.data);
      } catch (err) {
        console.error("Error fetching batch data:", err);
        setError("Could not load result ledger. Check backend connection.");
      } finally {
        setLoading(false);
      }
    };
    if (batchId) fetchBatchLedger();
  }, [batchId]);

  // --- FILTER & SORT LOGIC ---
  const displayedStudents = useMemo(() => {
    if (!batchData?.students) return [];
    
    let list = batchData.students.filter(student => {
      // FIX: Added search for PR No and fallback for naming
      const pr = (student.prNo || student.prno || "").toString().toLowerCase();
      const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           student.enrollmentNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           pr.includes(searchTerm.toLowerCase());
                           
      const matchesTab = isSupp ? student.summary.backlogs > 0 : true;
      return matchesSearch && matchesTab;
    });

    if (sortOrder === 'cgpaDesc') {
      list.sort((a, b) => b.summary.cgpa - a.summary.cgpa);
    } else {
      list.sort((a, b) => a.enrollmentNo.localeCompare(b.enrollmentNo));
    }
    return list;
  }, [batchData, searchTerm, isSupp, sortOrder]);

  if (loading) return <div className="p-20 text-center font-bold">Loading Batch Ledger...</div>;
  if (error) return <div className="p-20 text-center text-red-500">{error}</div>;
  
  if (!batchData || batchData.students.length === 0) {
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

  const { batchInfo, stats } = batchData;
  const semestersHeader = batchData.students[0]?.semesters || [];

  const handleExport = () => {
    let csv = "P.R. NO,ENROLLMENT NO,STUDENT NAME,BACKLOGS,CGPA,RESULT\n";
    displayedStudents.forEach(s => {
      // FIX: Use fallback for export as well
      const pr = s.prNo || s.prno || "";
      csv += `"${pr}","${s.enrollmentNo}","${s.name}","${s.summary.backlogs}","${s.summary.cgpa}","${s.summary.status}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Ledger_${batchInfo.course}_${batchId}.csv`;
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
                <p>{batchInfo.course} | Batch {batchInfo.name}</p>
              </div>
            </div>
            <div className="stats-container">
              <div className="stat-box"><span>Total Students</span><strong>{stats.totalStudents}</strong></div>
              <div className="stat-box"><span>Avg CGPA</span><strong className="text-blue">{stats.avgCgpa}</strong></div>
              <div className="stat-box"><span>Pass %</span><strong className="text-green">{stats.passPercentage}</strong></div>
            </div>
          </div>

          <div className="page-tabs no-print">
            <button className={`tab-btn ${!isSupp ? 'active' : ''}`} onClick={() => navigate('?tab=regular')}>Regular Marksheet</button>
            <button className={`tab-btn ${isSupp ? 'active' : ''}`} onClick={() => navigate('?tab=supplementary')} style={{color: isSupp ? '#e11d48' : '', borderBottomColor: isSupp ? '#e11d48' : 'transparent'}}>Supplementary Ledger</button>
          </div>

          <div className="toolbar no-print">
            <div className="toolbar-left">
              <input type="text" className="search-input" placeholder="Search enrollment or name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              <select className="sort-select" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                <option value="enrollmentNo">Sort by Enrollment No</option>
                <option value="cgpaDesc">Sort by CGPA</option>
              </select>
            </div>
            <div className="toolbar-right">
              <button className="btn btn-outline" onClick={() => setIsSidebarHidden(!isSidebarHidden)}>{isSidebarHidden ? 'Show Menu' : 'Hide Menu'}</button>
              <button className="btn btn-outline" onClick={() => window.print()}>Print Data</button>
              <button className="btn btn-primary" onClick={handleExport}>Export Table</button>
            </div>
          </div>

          {/* FIX: Added inline styles to ensure scrolling works immediately */}
          <div className="table-wrapper" style={{ overflowX: 'auto', overflowY: 'auto', maxHeight: '70vh' }}>
            <table style={{ borderCollapse: 'separate', borderSpacing: 0, width: 'max-content' }}>
              <thead>
                <tr>
                  <th className="sticky-col-1" rowSpan="4" style={{ position: 'sticky', left: 0, zIndex: 30, background: '#f8fafc' }}>P.R. NO</th>
                  <th className="sticky-col-2" rowSpan="4" style={{ position: 'sticky', left: '100px', zIndex: 30, background: '#f8fafc' }}>ENROLLMENT NO</th>
                  <th className="sticky-col-3" rowSpan="4" style={{ position: 'sticky', left: '220px', zIndex: 30, background: '#f8fafc' }}>STUDENT NAME</th>
                  {semestersHeader.map(s => <th key={s.sem} colSpan="15" className="sem-header border-left-heavy">SEMESTER {s.sem}</th>)}
                  <th colSpan="4" className="consol-header border-left-heavy" rowSpan="3">MARKSHEET</th>
                </tr>
                <tr>
                  {semestersHeader.map((s, idx) => (
                    <React.Fragment key={idx}>
                      <th colSpan="8" className="category-major border-left-heavy">MAJOR</th>
                      <th colSpan="4" className="category-minor border-left-normal">MINOR</th>
                      <th colSpan="3" className="border-left-normal" style={{background: '#f1f5f9', fontSize:'12px', fontWeight:'700'}}>RESULT</th>
                    </React.Fragment>
                  ))}
                </tr>
                <tr>
                  {semestersHeader.map((s, idx) => (
                    <React.Fragment key={idx}>
                      <th colSpan="4" className="border-left-heavy" style={{background: '#fff', fontSize: '11px', textTransform: 'uppercase'}}>{s.major[0]?.subject || 'MAJOR 1'}</th>
                      <th colSpan="4" className="border-left-normal" style={{background: '#fff', fontSize: '11px', textTransform: 'uppercase'}}>{s.major[1]?.subject || 'MAJOR 2'}</th>
                      <th colSpan="4" className="border-left-normal" style={{background: '#fff', fontSize: '11px', textTransform: 'uppercase'}}>{s.minor.subject || 'MINOR'}</th>
                      <th colSpan="3" className="border-left-normal"></th>
                    </React.Fragment>
                  ))}
                </tr>
                <tr>
                  {semestersHeader.map((s, idx) => (
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
                {displayedStudents.map(student => (
                    <tr key={student.id}>
                      {/* FIX: student.prNo || student.prno handles the blank field issue */}
                      <td className="sticky-col-1" style={{ position: 'sticky', left: 0, background: 'white', zIndex: 10 }}>{student.prNo || student.prno}</td>
                      <td className="sticky-col-2" style={{ position: 'sticky', left: '100px', background: 'white', zIndex: 10 }}>{student.enrollmentNo}</td>
                      <td className="sticky-col-3" style={{ position: 'sticky', left: '220px', background: 'white', zIndex: 10 }}>
                        <button className="clickable-name" onClick={() => { setSelectedStudent(student); setSelectedModalSem(student.semesters[student.semesters.length - 1]?.sem || 1); }}>
                          <span style={{ background: student.summary.status === 'ATKT' ? '#fce7f3' : '#e0e7ff', color: student.summary.status === 'ATKT' ? '#9d174d' : '#3730a3', padding: '4px 8px', borderRadius: '50%', fontSize: '11px', fontWeight: '700', marginRight: '12px', display: 'inline-block' }}>
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
                                <td>{show ? m.esa : '-'}</td>
                                <td>{show ? m.tot : '-'}</td>
                                <td style={{color: m.grd === 'F' ? '#e11d48' : 'inherit', fontWeight: 'bold'}}>{show ? m.grd : '-'}</td>
                              </React.Fragment>
                            );
                          })}
                          <td className="border-left-normal">{(!isSupp || sem.minor.grd === 'F') ? sem.minor.isa : '-'}</td>
                          <td>{(!isSupp || sem.minor.grd === 'F') ? sem.minor.esa : '-'}</td>
                          <td>{(!isSupp || sem.minor.grd === 'F') ? sem.minor.tot : '-'}</td>
                          <td style={{color: sem.minor.grd === 'F' ? '#e11d48' : 'inherit', fontWeight: 'bold'}}>{(!isSupp || sem.minor.grd === 'F') ? sem.minor.grd : '-'}</td>
                          <td className="border-left-normal">-</td>
                          <td>{isSupp ? '-' : sem.sgpa}</td><td>{isSupp ? '-' : (sem.sgpa >= 4 ? 'P' : 'F')}</td>
                        </React.Fragment>
                      ))}
                      <td className="border-left-heavy">{student.summary.backlogs}</td>
                      <td>{student.summary.lastSGPA}</td>
                      <td>{student.summary.cgpa}</td>
                      <td><span className={student.summary.status === 'PASS' ? "badge-pass" : "badge-fail"}>{student.summary.status}</span></td>
                    </tr>
                  ))}
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
                <div className="ms-header"><h1>Statement of Marks</h1><p>{batchInfo.course.toUpperCase()}</p></div>
                <div className="ms-student-info">
                  <div className="ms-info-col">
                    <div><span>P.R. No.</span>: {selectedStudent.prNo || selectedStudent.prno}</div>
                    <div><span>Enrollment No.</span>: {selectedStudent.enrollmentNo}</div>
                    <div><span>Name</span>: {selectedStudent.name.toUpperCase()}</div>
                  </div>
                </div>
                <table className="ms-table">
                  <thead><tr><th style={{width: '40%'}}>Course Title</th><th>ISA</th><th>ESA</th><th>Total</th><th>Grade</th></tr></thead>
                  <tbody>
                    {activeSemData.major.map((m, i) => (
                      <tr key={i}><td className="text-left" style={{fontWeight: 'bold'}}>{m.subject}</td><td>{m.isa}</td><td>{m.esa}</td><td style={{fontWeight: 'bold'}}>{m.tot}</td><td style={{fontWeight: 'bold', color: m.grd === 'F' ? '#e11d48' : 'inherit'}}>{m.grd}</td></tr>
                    ))}
                    <tr><td className="text-left" style={{fontWeight: 'bold'}}>{activeSemData.minor.subject}</td><td>{activeSemData.minor.isa}</td><td>{activeSemData.minor.esa}</td><td style={{fontWeight: 'bold'}}>{activeSemData.minor.tot}</td><td style={{fontWeight: 'bold', color: activeSemData.minor.grd === 'F' ? '#e11d48' : 'inherit'}}>{activeSemData.minor.grd}</td></tr>
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