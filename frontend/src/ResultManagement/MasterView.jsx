

// import React, { useState, useEffect, useMemo } from 'react';
// import { useSearchParams, useNavigate, useParams } from 'react-router-dom';
// import axios from 'axios';

// // IMPORTING THE GLOBAL TEAM COMPONENTS
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
//   const [sortOrder, setSortOrder] = useState('enrollmentNo'); 
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

//   // --- DYNAMIC TABLE ENGINE ---
//   const tableLayout = useMemo(() => {
//     if (!batchData?.students) return { semesters: [], config: {} };

//     const semMap = {};
//     const semesterList = new Set();

//     batchData.students.forEach(student => {
//       (student.semesters || []).forEach(sem => {
//         const sNum = Number(sem.sem);
//         if (sNum > 0) {
//           semesterList.add(sNum);
//           if (!semMap[sNum]) {
//             semMap[sNum] = { majors: new Set(), cores: new Set(), minors: new Set(), entitlements: new Set() };
//           }
//           (sem.subjects || []).forEach(sub => {
//             const type = (sub.type || "").toLowerCase();
//             if (type === 'major') semMap[sNum].majors.add(sub.subject);
//             else if (type === 'core') semMap[sNum].cores.add(sub.subject);
//             else if (type === 'minor') semMap[sNum].minors.add(sub.subject);
//             else if (type === 'entitlement') semMap[sNum].entitlements.add(sub.subject);
//           });
//         }
//       });
//     });

//     const sortedSems = Array.from(semesterList).sort((a, b) => a - b);
//     const finalConfig = {};
//     sortedSems.forEach(s => {
//       finalConfig[s] = {
//         majors: Array.from(semMap[s].majors),
//         cores: Array.from(semMap[s].cores),
//         minors: Array.from(semMap[s].minors),
//         entitlements: Array.from(semMap[s].entitlements)
//       };
//     });

//     return { semesters: sortedSems, config: finalConfig };
//   }, [batchData]);

//   // --- FILTER & SORT LOGIC ---
//   const displayedStudents = useMemo(() => {
//     if (!batchData?.students) return [];
    
//     let list = [...batchData.students].filter(student => {
//       const pr = (student.prNo || student.prno || "").toString().toLowerCase();
//       const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
//                            student.enrollmentNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                            pr.includes(searchTerm.toLowerCase());
                           
//       const matchesTab = isSupp ? (student.summary?.backlogs > 0) : true;
//       return matchesSearch && matchesTab;
//     });

//     if (sortOrder === 'cgpaDesc') {
//       list.sort((a, b) => (b.summary?.cgpa || 0) - (a.summary?.cgpa || 0));
//     } else {
//       list.sort((a, b) => (a.enrollmentNo || "").localeCompare(b.enrollmentNo || ""));
//     }
//     return list;
//   }, [batchData, searchTerm, isSupp, sortOrder]);

//   if (loading) return <div className="p-20 text-center font-bold">Loading Batch Ledger...</div>;
//   if (error) return <div className="p-20 text-center text-red-500">{error}</div>;
//   if (!batchData || !batchData.batchInfo) return <div className="p-20 text-center">No data found.</div>;

//   const { batchInfo = {}, stats = { totalStudents: 0, avgCgpa: "0.00", passPercentage: 0 } } = batchData;

//   const activeSemData = selectedStudent ? 
//     selectedStudent.semesters.find(s => s.sem === selectedModalSem) : null;

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
//               <div className="stat-box"><span>Pass %</span><strong className="text-green">{stats.passPercentage}%</strong></div>
//             </div>
//           </div>

//           <div className="table-wrapper" style={{ overflowX: 'auto', overflowY: 'auto', maxHeight: '70vh' }}>
//             <table style={{ borderCollapse: 'separate', borderSpacing: 0, width: 'max-content' }}>
//               <thead>
//                 <tr>
//                   <th className="sticky-col-1" rowSpan="4" style={{ position: 'sticky', left: 0, zIndex: 60, background: '#f8fafc' }}>P.R. <br/> NO</th>
//                   <th className="sticky-col-2" rowSpan="4" style={{ position: 'sticky', left: '100px', zIndex: 60, background: '#f8fafc' }}>ENROLLMENT <br/> NO</th>
//                   <th className="sticky-col-3" rowSpan="4" style={{ position: 'sticky', left: '220px', zIndex: 60, background: '#f8fafc' }}>STUDENT <br/> NAME</th>
//                   {tableLayout.semesters.map(sNum => {
//                     const conf = tableLayout.config[sNum];
//                     const academicCount = conf.majors.length + conf.cores.length + conf.minors.length;
//                     const entCount = conf.entitlements.length;
//                     return <th key={sNum} colSpan={(academicCount * 5) + entCount + 2} className="sem-header border-left-heavy">SEMESTER {sNum}</th>;
//                   })}
//                   <th colSpan="4" className="consol-header border-left-heavy" rowSpan="3">CONSOLIDATED</th>
//                 </tr>
//                 <tr>
//                   {tableLayout.semesters.map(sNum => {
//                     const conf = tableLayout.config[sNum];
//                     return (
//                       <React.Fragment key={sNum}>
//                         {conf.majors.length > 0 && <th colSpan={conf.majors.length * 5} className="category-major border-left-heavy">MAJOR</th>}
//                         {conf.cores.length > 0 && <th colSpan={conf.cores.length * 5} className="category-core border-left-normal">CORE</th>}
//                         {conf.minors.length > 0 && <th colSpan={conf.minors.length * 5} className="category-minor border-left-normal">MINOR</th>}
//                         {conf.entitlements.length > 0 && <th colSpan={conf.entitlements.length} className="category-ent border-left-normal" style={{background: '#ecfdf5', color: '#065f46'}}>ENTITLEMENT (#)</th>}
//                         <th colSpan="2" className="border-left-normal" style={{background: '#f1f5f9', fontSize:'11px'}}>RESULT</th>
//                       </React.Fragment>
//                     );
//                   })}
//                 </tr>
//                 <tr>
//                   {tableLayout.semesters.map(sNum => {
//                     const conf = tableLayout.config[sNum];
//                     return (
//                       <React.Fragment key={sNum}>
//                         {[...conf.majors, ...conf.cores, ...conf.minors].map((m, i) => (
//                           <th key={i} colSpan="5" className={`border-left-${i === 0 ? 'heavy' : 'normal'} text-[10px] uppercase`} style={{background: '#fff', fontSize: '10px'}}>{m}</th>
//                         ))}
//                         {conf.entitlements.map((m, i) => (
//                           <th key={`ent-${i}`} colSpan="1" className="border-left-normal text-[10px] uppercase" style={{background: '#f0fdf4', fontSize: '10px'}}>{m}</th>
//                         ))}
//                         <th colSpan="2" className="border-left-normal"></th>
//                       </React.Fragment>
//                     );
//                   })}
//                 </tr>
//                 <tr>
//                   {tableLayout.semesters.map(sNum => (
//                     <React.Fragment key={sNum}>
//                       {[...tableLayout.config[sNum].majors, ...tableLayout.config[sNum].cores, ...tableLayout.config[sNum].minors].map((_, i) => (
//                         <React.Fragment key={i}>
//                           <th className={`mark-header border-left-${i === 0 ? 'heavy' : 'normal'}`}>ISA</th>
//                           <th className="mark-header">ESA</th>
//                           <th className="mark-header">PRAC</th>
//                           <th className="mark-header">TOTAL</th>
//                           <th className="mark-header">GRD</th>
//                         </React.Fragment>
//                       ))}
//                       {tableLayout.config[sNum].entitlements.map((_, i) => (
//                         <th key={`ent-h-${i}`} className="mark-header border-left-normal" style={{background: '#f0fdf4'}}>TOT</th>
//                       ))}
//                       <th className="border-left-normal" style={{fontSize:'10px'}}>SGPA</th>
//                       <th style={{fontSize:'10px'}}>GRD</th>
//                     </React.Fragment>
//                   ))}
//                   <th className="consol-sub border-left-heavy">BKLOG</th>
//                   <th className="consol-sub">SGPA</th>
//                   <th className="consol-sub">CGPA</th>
//                   <th className="consol-sub">RESULT</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {displayedStudents.map(student => (
//                   <tr key={student.id}>
//                     <td className="sticky-col-1" style={{ position: 'sticky', left: 0, background: 'white', zIndex: 10 }}>{student.prNo || student.prno}</td>
//                     <td className="sticky-col-2" style={{ position: 'sticky', left: '100px', background: 'white', zIndex: 10 }}>{student.enrollmentNo}</td>
//                     <td className="sticky-col-3" style={{ position: 'sticky', left: '220px', background: 'white', zIndex: 10 }}>
//                       <button className="clickable-name" onClick={() => { setSelectedStudent(student); setSelectedModalSem(student.semesters?.[0]?.sem || 1); }}>
//                         {student.name}
//                       </button>
//                     </td>
//                     {tableLayout.semesters.map(sNum => {
//                       const sem = (student.semesters || []).find(s => Number(s.sem) === sNum) || {};
//                       const subs = sem.subjects || [];
//                       const conf = tableLayout.config[sNum];
//                       return (
//                         <React.Fragment key={sNum}>
//                           {[...conf.majors, ...conf.cores, ...conf.minors].map((mName, i) => {
//                             const subMatch = subs.find(s => s.subject === mName) || {};
//                             const isFail = subMatch.grd === 'F' || subMatch.grade === 'F';
//                             const markStyle = isFail ? { color: '#e11d48', fontWeight: 'bold' } : {};
//                             return (
//                               <React.Fragment key={i}>
//                                 <td className={`border-left-${i === 0 ? 'heavy' : 'normal'}`} style={markStyle}>{subMatch.isa ?? '-'}</td>
//                                 <td style={markStyle}>{subMatch.esa ?? '-'}</td>
//                                 <td style={markStyle}>{subMatch.practical ?? '-'}</td>
//                                 <td style={{...markStyle, fontWeight: '700'}}>{subMatch.tot ?? '-'}</td>
//                                 <td style={{...markStyle, fontWeight: '900'}}>{subMatch.grd ?? '-'}</td>
//                               </React.Fragment>
//                             );
//                           })}
//                           {conf.entitlements.map((mName, i) => {
//                             const subMatch = subs.find(s => s.subject === mName) || {};
//                             const score = Number(subMatch.tot);
//                             return (
//                               <td key={`ent-val-${i}`} className="border-left-normal text-center" style={{background: '#f0fdf4', fontWeight: 'bold'}}>
//                                 {score > 0 ? score : ''}
//                               </td>
//                             );
//                           })}
//                           <td className="border-left-normal" style={{fontWeight: '600'}}>{isSupp ? '-' : (sem.sgpa || '-')}</td>
//                           <td style={sem.grade === 'F' ? {color: '#e11d48'} : {}}>{isSupp ? '-' : (sem.grade || '-')}</td>
//                         </React.Fragment>
//                       );
//                     })}
//                     <td className="border-left-heavy" style={{fontWeight: '700', color: student.summary?.backlogs > 0 ? '#e11d48' : 'inherit'}}>{student.summary?.backlogs || 0}</td>
//                     <td>{student.summary?.lastSGPA || '-'}</td>
//                     <td style={{fontWeight: 'bold', color: 'var(--primary)'}}>{student.summary?.cgpa || '0.00'}</td>
//                     <td><span className={student.summary?.status === 'PASS' ? "badge-pass" : "badge-fail"}>{student.summary?.status}</span></td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </main>

//       {selectedStudent && activeSemData && (
//         <div className="modal-overlay active" style={{ zIndex: 9999 }} onClick={() => setSelectedStudent(null)}>
//           <div className="modal-container" onClick={e => e.stopPropagation()}>
//             <div className="modal-header no-print">
//               <h2>Individual Marksheet Preview</h2>
//               <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
//                 <select className="sort-select" value={selectedModalSem} onChange={(e) => setSelectedModalSem(Number(e.target.value))}>
//                   {selectedStudent.semesters.map(s => <option key={s.sem} value={s.sem}>Semester {s.sem}</option>)}
//                 </select>
//                 <button className="close-btn" onClick={() => setSelectedStudent(null)}>✕</button>
//               </div>
//             </div>
//             <div className="modal-body">
//               <div className="marksheet-doc">
//                 <div className="ms-header">
//                   <div className="logo">Uni<span>Desk</span></div>
//                   <h1>Statement of Marks</h1>
//                   <p>{batchInfo.course?.toUpperCase()}</p>
//                 </div>
//                 <div className="ms-student-info">
//                    <div style={{marginBottom: '5px'}}><span>P.R. No.</span>: {selectedStudent.prNo || selectedStudent.prno}</div>
//                    <div style={{marginBottom: '5px'}}><span>Name</span>: {selectedStudent.name.toUpperCase()}</div>
//                    <div style={{marginBottom: '5px'}}><span>Semester</span>: {selectedModalSem}</div>
//                 </div>
//                 <table className="ms-table" style={{marginTop: '20px'}}>
//                   <thead>
//                     <tr>
//                       <th style={{width: '40%'}}>Course Title</th>
//                       <th>ISA</th>
//                       <th>ESA</th>
//                       <th>Prac</th>
//                       <th>Total</th>
//                       <th>Grade</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {(activeSemData.subjects || []).map((s, i) => {
//                       const isFail = s.grd === 'F' || s.grade === 'F';
//                       const isEnt = (s.type || "").toLowerCase() === 'entitlement';
//                       const score = Number(s.tot);
//                       if (isEnt && score === 0) return null;
//                       return (
//                         <tr key={i} style={isFail ? {color: '#e11d48', fontWeight: 'bold'} : (isEnt ? {background: '#f0fdf4'} : {})}>
//                           <td className="text-left" style={{fontWeight: '600'}}>{isEnt ? `# ${s.subject}` : s.subject}</td>
//                           <td>{isEnt ? '-' : s.isa}</td>
//                           <td>{isEnt ? '-' : s.esa}</td>
//                           <td>{s.practical || 0}</td>
//                           <td style={{fontWeight: 'bold'}}>{s.tot}</td>
//                           <td style={{fontWeight: 'bold'}}>{isEnt ? '#' : s.grd}</td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                   <tfoot>
//                     <tr>
//                       <td colSpan="4" style={{textAlign: 'right', fontWeight: 'bold'}}>Semester SGPA:</td>
//                       <td colSpan="2" style={{fontWeight: '800', fontSize: '1.1rem'}}>{activeSemData.sgpa}</td>
//                     </tr>
//                   </tfoot>
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

// IMPORTING THE GLOBAL TEAM COMPONENTS
import Sidebar from '../components/Sidebar'; 
import './styles/results.css';

const API_URL = 'http://localhost:5000/api';

const MasterView = ({ userRole, currentUser, onLogout }) => {
  const { batchId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [batchData, setBatchData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('enrollmentNo'); 
  const [isSidebarHidden, setIsSidebarHidden] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedModalSem, setSelectedModalSem] = useState(1);

  const currentTab = searchParams.get('tab') || 'regular';
  const isSupp = currentTab === 'supplementary';

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

  const tableLayout = useMemo(() => {
    if (!batchData?.students) return { semesters: [], config: {} };

    const semMap = {};
    const semesterList = new Set();

    batchData.students.forEach(student => {
      (student.semesters || []).forEach(sem => {
        const sNum = Number(sem.sem);
        if (sNum > 0) {
          semesterList.add(sNum);
          if (!semMap[sNum]) {
            semMap[sNum] = { majors: new Set(), cores: new Set(), minors: new Set(), entitlements: new Set() };
          }
          (sem.subjects || []).forEach(sub => {
            const type = (sub.type || "").toLowerCase();
            if (type === 'major') semMap[sNum].majors.add(sub.subject);
            else if (type === 'core') semMap[sNum].cores.add(sub.subject);
            else if (type === 'minor') semMap[sNum].minors.add(sub.subject);
            else if (type === 'entitlement') semMap[sNum].entitlements.add(sub.subject);
          });
        }
      });
    });

    const sortedSems = Array.from(semesterList).sort((a, b) => a - b);
    const finalConfig = {};
    sortedSems.forEach(s => {
      finalConfig[s] = {
        majors: Array.from(semMap[s].majors),
        cores: Array.from(semMap[s].cores),
        minors: Array.from(semMap[s].minors),
        entitlements: Array.from(semMap[s].entitlements)
      };
    });

    return { semesters: sortedSems, config: finalConfig };
  }, [batchData]);

  const displayedStudents = useMemo(() => {
    if (!batchData?.students) return [];
    
    let list = [...batchData.students].filter(student => {
      const pr = (student.prNo || student.prno || "").toString().toLowerCase();
      const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           student.enrollmentNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           pr.includes(searchTerm.toLowerCase());
      const matchesTab = isSupp ? (student.summary?.backlogs > 0) : true;
      return matchesSearch && matchesTab;
    });

    if (sortOrder === 'cgpaDesc') {
      list.sort((a, b) => (b.summary?.cgpa || 0) - (a.summary?.cgpa || 0));
    } else {
      list.sort((a, b) => (a.enrollmentNo || "").localeCompare(b.enrollmentNo || ""));
    }
    return list;
  }, [batchData, searchTerm, isSupp, sortOrder]);

  if (loading) return <div className="p-20 text-center font-bold">Loading Batch Ledger...</div>;
  if (error) return <div className="p-20 text-center text-red-500">{error}</div>;
  if (!batchData || !batchData.batchInfo) return <div className="p-20 text-center">No data found.</div>;

  const { batchInfo = {}, stats = { totalStudents: 0, avgCgpa: "0.00", passPercentage: 0 } } = batchData;

  const activeSemData = selectedStudent ? 
    selectedStudent.semesters.find(s => s.sem === selectedModalSem) : null;

  return (
    <div className="app-layout w-full">
      <Sidebar isHidden={isSidebarHidden} userRole={userRole} currentUser={currentUser} currentPage="result-ledger" onLogout={onLogout} />
      
      <main className="main-content" style={{ padding: isSidebarHidden ? '32px 60px' : '32px 40px' }}>
        <div className="container print-container" id="printable-area">
          
          {/* ✅ UPDATED HEADER WITH TABS */}
          <div className="header-section no-print">
            <div className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button className="btn btn-outline" onClick={() => navigate('/results')}>Back</button>
              
              <div>
                <h1>Result Management</h1>
                <p>{batchInfo.course} | Batch {batchInfo.name}</p>

                {/* ✅ NAVIGATION TABS */}
                <div style={{
                  display: 'flex',
                  gap: '20px',
                  marginTop: '10px',
                  borderBottom: '2px solid #e2e8f0'
                }}>
                  
                  <button
                    onClick={() => navigate(`/results/master/${batchId}?tab=regular`)}
                    style={{
                      padding: '6px 0',
                      fontWeight: '700',
                      borderBottom: currentTab === 'regular' ? '3px solid #2563eb' : 'none',
                      color: currentTab === 'regular' ? '#2563eb' : '#64748b',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    Regular Result
                  </button>

                  <button
                    onClick={() => navigate(`/results/master/${batchId}?tab=supplementary`)}
                    style={{
                      padding: '6px 0',
                      fontWeight: '700',
                      borderBottom: currentTab === 'supplementary' ? '3px solid #2563eb' : 'none',
                      color: currentTab === 'supplementary' ? '#2563eb' : '#64748b',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    Supplementary
                  </button>

                </div>
              </div>
            </div>

            <div className="stats-container">
              <div className="stat-box"><span>Total Students</span><strong>{stats.totalStudents}</strong></div>
              <div className="stat-box"><span>Avg CGPA</span><strong className="text-blue">{stats.avgCgpa}</strong></div>
              <div className="stat-box"><span>Pass %</span><strong className="text-green">{stats.passPercentage}%</strong></div>
            </div>
          </div>


          
          <div className="table-wrapper" style={{ overflowX: 'auto', overflowY: 'auto', maxHeight: '70vh' }}>
            <table style={{ borderCollapse: 'separate', borderSpacing: 0, width: 'max-content' }}>
              <thead>
                <tr>
                  <th className="sticky-col-1" rowSpan="4" style={{ position: 'sticky', left: 0, zIndex: 60, background: '#f8fafc' }}>P.R. <br/> NO</th>
                  <th className="sticky-col-2" rowSpan="4" style={{ position: 'sticky', left: '100px', zIndex: 60, background: '#f8fafc' }}>ENROLLMENT <br/> NO</th>
                  <th className="sticky-col-3" rowSpan="4" style={{ position: 'sticky', left: '220px', zIndex: 60, background: '#f8fafc' }}>STUDENT <br/> NAME</th>
                  {tableLayout.semesters.map(sNum => {
                    const conf = tableLayout.config[sNum];
                    const academicCount = conf.majors.length + conf.cores.length + conf.minors.length;
                    const entCount = conf.entitlements.length;
                    return <th key={sNum} colSpan={(academicCount * 5) + entCount + 2} className="sem-header border-left-heavy">SEMESTER {sNum}</th>;
                  })}
                  <th colSpan="4" className="consol-header border-left-heavy" rowSpan="3">CONSOLIDATED</th>
                </tr>
                <tr>
                  {tableLayout.semesters.map(sNum => {
                    const conf = tableLayout.config[sNum];
                    return (
                      <React.Fragment key={sNum}>
                        {conf.majors.length > 0 && <th colSpan={conf.majors.length * 5} className="category-major border-left-heavy">MAJOR</th>}
                        {conf.cores.length > 0 && <th colSpan={conf.cores.length * 5} className="category-core border-left-normal">CORE</th>}
                        {conf.minors.length > 0 && <th colSpan={conf.minors.length * 5} className="category-minor border-left-normal">MINOR</th>}
                        {conf.entitlements.length > 0 && <th colSpan={conf.entitlements.length} className="category-ent border-left-normal" style={{background: '#ecfdf5', color: '#065f46'}}>ENTITLEMENT (#)</th>}
                        <th colSpan="2" className="border-left-normal" style={{background: '#f1f5f9', fontSize:'11px'}}>RESULT</th>
                      </React.Fragment>
                    );
                  })}
                </tr>
                <tr>
                  {tableLayout.semesters.map(sNum => {
                    const conf = tableLayout.config[sNum];
                    return (
                      <React.Fragment key={sNum}>
                        {[...conf.majors, ...conf.cores, ...conf.minors].map((m, i) => (
                          <th key={i} colSpan="5" className={`border-left-${i === 0 ? 'heavy' : 'normal'} text-[10px] uppercase`} style={{background: '#fff', fontSize: '10px'}}>{m}</th>
                        ))}
                        {conf.entitlements.map((m, i) => (
                          <th key={`ent-${i}`} colSpan="1" className="border-left-normal text-[10px] uppercase" style={{background: '#f0fdf4', fontSize: '10px'}}>{m}</th>
                        ))}
                        <th colSpan="2" className="border-left-normal"></th>
                      </React.Fragment>
                    );
                  })}
                </tr>
                <tr>
                  {tableLayout.semesters.map(sNum => (
                    <React.Fragment key={sNum}>
                      {[...tableLayout.config[sNum].majors, ...tableLayout.config[sNum].cores, ...tableLayout.config[sNum].minors].map((_, i) => (
                        <React.Fragment key={i}>
                          <th className={`mark-header border-left-${i === 0 ? 'heavy' : 'normal'}`}>ISA</th>
                          <th className="mark-header">ESA</th>
                          <th className="mark-header">PRAC</th>
                          <th className="mark-header">TOTAL</th>
                          <th className="mark-header">GRD</th>
                        </React.Fragment>
                      ))}
                      {tableLayout.config[sNum].entitlements.map((_, i) => (
                        <th key={`ent-h-${i}`} className="mark-header border-left-normal" style={{background: '#f0fdf4'}}>TOT</th>
                      ))}
                      <th className="border-left-normal" style={{fontSize:'10px'}}>SGPA</th>
                      <th style={{fontSize:'10px'}}>GRD</th>
                    </React.Fragment>
                  ))}
                  <th className="consol-sub border-left-heavy">BKLOG</th>
                  <th className="consol-sub">SGPA</th>
                  <th className="consol-sub">CGPA</th>
                  <th className="consol-sub">RESULT</th>
                </tr>
              </thead>
              <tbody>
                {displayedStudents.map(student => (
                  <tr key={student.id}>
                    <td className="sticky-col-1" style={{ position: 'sticky', left: 0, background: 'white', zIndex: 10 }}>{student.prNo || student.prno}</td>
                    <td className="sticky-col-2" style={{ position: 'sticky', left: '100px', background: 'white', zIndex: 10 }}>{student.enrollmentNo}</td>
                    <td className="sticky-col-3" style={{ position: 'sticky', left: '220px', background: 'white', zIndex: 10 }}>
                      <button className="clickable-name" onClick={() => { setSelectedStudent(student); setSelectedModalSem(student.semesters?.[0]?.sem || 1); }}>
                        {student.name}
                      </button>
                    </td>
                    {tableLayout.semesters.map(sNum => {
                      const sem = (student.semesters || []).find(s => Number(s.sem) === sNum) || {};
                      const subs = sem.subjects || [];
                      const conf = tableLayout.config[sNum];
                      return (
                        <React.Fragment key={sNum}>
                          {[...conf.majors, ...conf.cores, ...conf.minors].map((mName, i) => {
                            const subMatch = subs.find(s => s.subject === mName) || {};
                            const isFail = subMatch.grd === 'F' || subMatch.grade === 'F';
                            const markStyle = isFail ? { color: '#e11d48', fontWeight: 'bold' } : {};
                            return (
                              <React.Fragment key={i}>
                                <td className={`border-left-${i === 0 ? 'heavy' : 'normal'}`} style={markStyle}>{subMatch.isa ?? '-'}</td>
                                <td style={markStyle}>{subMatch.esa ?? '-'}</td>
                                <td style={markStyle}>{subMatch.practical ?? '-'}</td>
                                <td style={{...markStyle, fontWeight: '700'}}>{subMatch.tot ?? '-'}</td>
                                <td style={{...markStyle, fontWeight: '900'}}>{subMatch.grd ?? '-'}</td>
                              </React.Fragment>
                            );
                          })}
                          {conf.entitlements.map((mName, i) => {
                            const subMatch = subs.find(s => s.subject === mName) || {};
                            const score = Number(subMatch.tot);
                            return (
                              <td key={`ent-val-${i}`} className="border-left-normal text-center" style={{background: '#f0fdf4', fontWeight: 'bold'}}>
                                {score > 0 ? score : ''}
                              </td>
                            );
                          })}
                          <td className="border-left-normal" style={{fontWeight: '600'}}>{isSupp ? '-' : (sem.sgpa || '-')}</td>
                          <td style={sem.grade === 'F' ? {color: '#e11d48'} : {}}>{isSupp ? '-' : (sem.grade || '-')}</td>
                        </React.Fragment>
                      );
                    })}
                    <td className="border-left-heavy" style={{fontWeight: '700', color: student.summary?.backlogs > 0 ? '#e11d48' : 'inherit'}}>{student.summary?.backlogs || 0}</td>
                    <td>{student.summary?.lastSGPA || '-'}</td>
                    <td style={{fontWeight: 'bold', color: 'var(--primary)'}}>{student.summary?.cgpa || '0.00'}</td>
                    <td><span className={student.summary?.status === 'PASS' ? "badge-pass" : "badge-fail"}>{student.summary?.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {selectedStudent && activeSemData && (
        <div className="modal-overlay active" style={{ zIndex: 9999 }} onClick={() => setSelectedStudent(null)}>
          <div className="modal-container" onClick={e => e.stopPropagation()}>
            <div className="modal-header no-print">
              <h2>Individual Marksheet Preview</h2>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <select className="sort-select" value={selectedModalSem} onChange={(e) => setSelectedModalSem(Number(e.target.value))}>
                  {selectedStudent.semesters.map(s => <option key={s.sem} value={s.sem}>Semester {s.sem}</option>)}
                </select>
                <button className="close-btn" onClick={() => setSelectedStudent(null)}>✕</button>
              </div>
            </div>
            <div className="modal-body">
              <div className="marksheet-doc">
                <div className="ms-header">
                  <div className="logo">Uni<span>Desk</span></div>
                  <h1>Statement of Marks</h1>
                  <p>{batchInfo.course?.toUpperCase()}</p>
                </div>
                <div className="ms-student-info">
                   <div style={{marginBottom: '5px'}}><span>P.R. No.</span>: {selectedStudent.prNo || selectedStudent.prno}</div>
                   <div style={{marginBottom: '5px'}}><span>Name</span>: {selectedStudent.name.toUpperCase()}</div>
                   <div style={{marginBottom: '5px'}}><span>Semester</span>: {selectedModalSem}</div>
                </div>
                <table className="ms-table" style={{marginTop: '20px'}}>
                  <thead>
                    <tr>
                      <th style={{width: '40%'}}>Course Title</th>
                      <th>ISA</th>
                      <th>ESA</th>
                      <th>Prac</th>
                      <th>Total</th>
                      <th>Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(activeSemData.subjects || []).map((s, i) => {
                      const isFail = s.grd === 'F' || s.grade === 'F';
                      const isEnt = (s.type || "").toLowerCase() === 'entitlement';
                      const score = Number(s.tot);
                      if (isEnt && score === 0) return null;
                      return (
                        <tr key={i} style={isFail ? {color: '#e11d48', fontWeight: 'bold'} : (isEnt ? {background: '#f0fdf4'} : {})}>
                          <td className="text-left" style={{fontWeight: '600'}}>{isEnt ? `# ${s.subject}` : s.subject}</td>
                          <td>{isEnt ? '-' : s.isa}</td>
                          <td>{isEnt ? '-' : s.esa}</td>
                          <td>{s.practical || 0}</td>
                          <td style={{fontWeight: 'bold'}}>{s.tot}</td>
                          <td style={{fontWeight: 'bold'}}>{isEnt ? '#' : s.grd}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="4" style={{textAlign: 'right', fontWeight: 'bold'}}>Semester SGPA:</td>
                      <td colSpan="2" style={{fontWeight: '800', fontSize: '1.1rem'}}>{activeSemData.sgpa}</td>
                    </tr>
                  </tfoot>
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

          {/* REST CODE SAME */}
