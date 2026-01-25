// import React, { useState } from 'react';
// import useLocalStorageSync from './useLocalStorageSync';
// import { useNavigate } from 'react-router-dom';
// import './Portal.css';

// const FacultyPortal = () => {
//   const navigate = useNavigate();
//   const [db, setDb] = useLocalStorageSync('unidesk_v10_practical', {});
//   const [currentUser, setCurrentUser] = useState(null);
//   const [view, setView] = useState('login'); // login, dashboard, grading
//   const [currentSubIdx, setCurrentSubIdx] = useState(null);
//   const [loginError, setLoginError] = useState(false);
  
//   // Modal States
//   const [subjectModalOpen, setSubjectModalOpen] = useState(false);
//   const [gradingModalOpen, setGradingModalOpen] = useState(false);
  
//   // Subject Creation State
//   const [newSubject, setNewSubject] = useState({
//     name: '', semMax: 100, hasPractical: false, practicalMax: 25, selectedISAs: ['isa1', 'isa2']
//   });
//   const [isaError, setIsaError] = useState(false);

//   // Grading Modal State
//   const [gradingState, setGradingState] = useState({ studentIdx: null, type: null, subType: null });
//   const [modalStudentData, setModalStudentData] = useState(null); // Temp copy for editing
//   const [modalError, setModalError] = useState('');

//   // --- Auth ---
//   const handleLogin = (e) => {
//     e.preventDefault();
//     const val = e.target.elements.user.value.trim();
//     if (!val) { setLoginError(true); return; }
    
//     if (!db[val]) {
//       // Initialize new user array in DB
//       setDb({ ...db, [val]: [] });
//     }
    
//     setCurrentUser(val);
//     setView('dashboard');
//   };

//   const logout = () => { setCurrentUser(null); setView('login'); window.location.reload(); };

//   // --- Dashboard Logic ---
//   const handleCreateSubject = () => {
//     if (!newSubject.name) return;
//     if (newSubject.selectedISAs.length === 0) { setIsaError(true); return; }

//     const newSubData = {
//       name: newSubject.name,
//       semMax: Number(newSubject.semMax),
//       selectedISAs: newSubject.selectedISAs,
//       hasPractical: newSubject.hasPractical,
//       practicalMax: newSubject.hasPractical ? Number(newSubject.practicalMax) : 25,
//       students: [createStudent("Student A"), createStudent("Student B")]
//     };

//     const userSubjects = db[currentUser] || [];
//     setDb({ ...db, [currentUser]: [...userSubjects, newSubData] });
//     setSubjectModalOpen(false);
//     // Reset form
//     setNewSubject({ name: '', semMax: 100, hasPractical: false, practicalMax: 25, selectedISAs: ['isa1', 'isa2'] });
//   };

//   const createStudent = (name) => ({
//     id: Date.now() + Math.random(),
//     name,
//     isa: { isa1: [0,0,0,0,0], isa2: [0,0,0,0,0], isa3: [0,0,0,0,0] },
//     semMarks: [0,0,0,0],
//     practicalMarks: 0,
//     questionDetails: {},
//     result: 'pending'
//   });

//   const handleIsaCheckbox = (e) => {
//     const val = e.target.value;
//     const current = newSubject.selectedISAs;
//     if (current.includes(val)) {
//       setNewSubject({ ...newSubject, selectedISAs: current.filter(i => i !== val) });
//     } else {
//       setNewSubject({ ...newSubject, selectedISAs: [...current, val] });
//     }
//     setIsaError(false);
//   };

//   // --- Grading Logic ---
//   const openSubject = (idx) => {
//     setCurrentSubIdx(idx);
//     setView('grading');
//   };

//   const openGradingModal = (sIdx, type, subType = null) => {
//     const sub = db[currentUser][currentSubIdx];
//     // Deep copy student data to temporary state
//     const studentData = JSON.parse(JSON.stringify(sub.students[sIdx]));
    
//     setGradingState({ studentIdx: sIdx, type, subType });
//     setModalStudentData(studentData);
//     setGradingModalOpen(true);
//     setModalError('');
//   };

//   // Sub-part Logic for Modal
//   const getUniqueKey = (idx) => {
//     if (gradingState.type === 'ISA') return `${gradingState.subType}-${idx}`;
//     return `sem-${idx}`;
//   };

//   const handleModalQuestionChange = (qIdx, val) => {
//     const newData = { ...modalStudentData };
//     if (gradingState.type === 'ISA') newData.isa[gradingState.subType][qIdx] = Number(val);
//     else if (gradingState.type === 'SEM') newData.semMarks[qIdx] = Number(val);
//     else if (gradingState.type === 'PRACTICAL') newData.practicalMarks = Number(val);
//     setModalStudentData(newData);
//   };

//   const updateLabel = (uniqueKey, label) => {
//     const newData = { ...modalStudentData };
//     if (!newData.questionDetails) newData.questionDetails = {};
//     if (!newData.questionDetails[uniqueKey]) newData.questionDetails[uniqueKey] = {};
//     newData.questionDetails[uniqueKey].label = label;
//     setModalStudentData(newData);
//   };

//   const addSubPart = (uniqueKey) => {
//     const newData = { ...modalStudentData };
//     if (!newData.questionDetails) newData.questionDetails = {};
//     if (!newData.questionDetails[uniqueKey]) newData.questionDetails[uniqueKey] = {};
//     if (!newData.questionDetails[uniqueKey].subs) newData.questionDetails[uniqueKey].subs = [];
//     newData.questionDetails[uniqueKey].subs.push(0);
//     setModalStudentData(newData);
//   };

//   const updateSubPart = (uniqueKey, subIdx, val, parentIdx) => {
//     const newData = { ...modalStudentData };
//     newData.questionDetails[uniqueKey].subs[subIdx] = Number(val);
    
//     // Auto-sum to parent question
//     const newTotal = newData.questionDetails[uniqueKey].subs.reduce((a,b) => a + Number(b), 0);
//     if (gradingState.type === 'ISA') newData.isa[gradingState.subType][parentIdx] = newTotal;
//     else if (gradingState.type === 'SEM') newData.semMarks[parentIdx] = newTotal;
    
//     setModalStudentData(newData);
//   };

//   const removeSubPart = (uniqueKey, subIdx, parentIdx) => {
//     const newData = { ...modalStudentData };
//     newData.questionDetails[uniqueKey].subs.splice(subIdx, 1);
//     if (newData.questionDetails[uniqueKey].subs.length === 0) delete newData.questionDetails[uniqueKey].subs;
//     setModalStudentData(newData);
//   };

//   const addSemQuestion = () => {
//     const newData = { ...modalStudentData };
//     newData.semMarks.push(0);
//     setModalStudentData(newData);
//   };

//   const removeSemQuestion = (idx) => {
//     const newData = { ...modalStudentData };
//     newData.semMarks.splice(idx, 1);
//     setModalStudentData(newData);
//   };

//   const saveModalData = () => {
//     // Validate
//     const sub = db[currentUser][currentSubIdx];
//     if (gradingState.type === 'PRACTICAL') {
//       const max = sub.practicalMax || 25;
//       if (modalStudentData.practicalMarks < 0 || modalStudentData.practicalMarks > max) {
//         setModalError(`Marks must be between 0 and ${max}`); return;
//       }
//     }

//     // Save to DB
//     const newDb = { ...db };
//     newDb[currentUser][currentSubIdx].students[gradingState.studentIdx] = modalStudentData;
//     setDb(newDb);
//     setGradingModalOpen(false);
//   };

//   // --- Helpers for Grading Table ---
//   const getStudentScore = (student) => {
//     const sub = db[currentUser][currentSubIdx];
//     const sum = arr => arr.reduce((a,b) => a+Number(b), 0);
    
//     let isaTotal = 0;
//     if (sub.selectedISAs.includes('isa1')) isaTotal += sum(student.isa.isa1);
//     if (sub.selectedISAs.includes('isa2')) isaTotal += sum(student.isa.isa2);
//     if (sub.selectedISAs.includes('isa3')) isaTotal += sum(student.isa.isa3);

//     const sem = sum(student.semMarks);
//     const pract = sub.hasPractical ? (student.practicalMarks || 0) : 0;
    
//     return isaTotal + sem + pract;
//   };

//   const updateStudentField = (sIdx, field, val) => {
//     const newDb = { ...db };
//     newDb[currentUser][currentSubIdx].students[sIdx][field] = val;
//     setDb(newDb);
//   };

//   const deleteStudent = (sIdx) => {
//     if(window.confirm("Delete?")) {
//       const newDb = { ...db };
//       newDb[currentUser][currentSubIdx].students.splice(sIdx, 1);
//       setDb(newDb);
//     }
//   };

//   const addStudent = () => {
//     const newDb = { ...db };
//     newDb[currentUser][currentSubIdx].students.push(createStudent("New Student"));
//     setDb(newDb);
//   };

//   // --- RENDERERS ---

//   if (view === 'login') {
//     return (
//       <div className="login-wrapper">
//         <div className="login-card">
//           <div className="logo">Uni<span>Desk</span></div>
//           <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Faculty Grading Portal</p>
//           <form onSubmit={handleLogin}>
//             <div className="form-group">
//               <input name="user" type="text" className="form-input" placeholder="Enter Faculty Name" style={{ textAlign: 'center' }} />
//               {loginError && <div className="error-msg" style={{ textAlign: 'center' }}>⚠ Please enter your name</div>}
//             </div>
//             <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Access Dashboard</button>
//           </form>
//         </div>
//       </div>
//     );
//   }

//   const currentSubject = currentSubIdx !== null ? db[currentUser][currentSubIdx] : null;

//   return (
//     <div className="container" style={{ animation: 'slideUp 0.4s ease' }}>
      
//       {/* Header */}
//       <div className="section-header">
//         <div>
//           <div className="logo" style={{ fontSize: '24px' }}>Uni<span>Desk</span></div>
//           {view === 'dashboard' && <div style={{ color: 'var(--text-muted)', marginTop: '4px' }}>Welcome back, <strong style={{ color: 'var(--text-main)' }}>{currentUser}</strong></div>}
//         </div>
//         <div>
//           {view === 'grading' && <button className="btn btn-ghost" onClick={() => setView('dashboard')} style={{ marginRight: '12px' }}>← Back</button>}
//           <button className="btn btn-ghost" onClick={logout}>Sign Out</button>
//         </div>
//       </div>

//       {/* Dashboard View */}
//       {view === 'dashboard' && (
//         <div className="faculty-grid">
//           <div className="card card-add" onClick={() => setSubjectModalOpen(true)}>
//             <span style={{ fontSize: '3rem', color: 'var(--border)' }}>+</span>
//             <span style={{ fontWeight: 600, marginTop: '8px' }}>New Subject</span>
//           </div>
//           {(db[currentUser] || []).map((sub, idx) => (
//             <div className="card faculty-card" key={idx} onClick={() => openSubject(idx)} style={{ cursor: 'pointer' }}>
//               <div>
//                 <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #4f46e5, #8b5cf6)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '1.2rem', marginBottom: '16px' }}>
//                   {sub.name.substring(0,2).toUpperCase()}
//                 </div>
//                 <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>{sub.name}</h3>
//                 <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{sub.students.length} Students</p>
//               </div>
//               <div style={{ marginTop: '24px', borderTop: '1px solid var(--border)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between' }}>
//                 <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Used: {sub.selectedISAs.join(', ').toUpperCase()}</span>
//                 {sub.hasPractical && <span style={{ fontSize: '0.75rem', background: '#dbeafe', color: '#1e40af', padding: '2px 6px', borderRadius: '4px' }}>Prac ({sub.practicalMax})</span>}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Grading View */}
//       {view === 'grading' && currentSubject && (
//         <>
//           <div className="section-header">
//             <div>
//               <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{currentSubject.name}</h2>
//               <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
//                 ISAs Used: {currentSubject.selectedISAs.join(', ').toUpperCase()} {currentSubject.hasPractical ? ` | Practical (${currentSubject.practicalMax})` : ''}
//               </div>
//             </div>
//             <button className="btn btn-primary">Save Grades</button>
//           </div>

//           <div className="table-wrapper">
//             <table>
//               <thead>
//                 <tr>
//                   <th style={{ width: '25%' }}>Student Name</th>
//                   <th style={{ textAlign: 'center' }}>ISA 1</th>
//                   <th style={{ textAlign: 'center' }}>ISA 2</th>
//                   <th style={{ textAlign: 'center' }}>ISA 3</th>
//                   <th style={{ textAlign: 'center' }}>SEM ({currentSubject.semMax || 100})</th>
//                   {currentSubject.hasPractical && <th style={{ textAlign: 'center' }}>Practical ({currentSubject.practicalMax})</th>}
//                   <th style={{ textAlign: 'center' }}>Final Score</th>
//                   <th style={{ textAlign: 'center' }}>Result</th>
//                   <th style={{ width: '50px' }}></th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {currentSubject.students.map((st, idx) => {
//                    const sum = arr => arr.reduce((a, b) => a + Number(b), 0);
//                    return (
//                     <tr key={st.id}>
//                       <td><input type="text" className="name-input" value={st.name} onChange={(e) => updateStudentField(idx, 'name', e.target.value)} /></td>
//                       <td style={{ textAlign: 'center' }}><div className="clickable-score" onClick={() => openGradingModal(idx, 'ISA', 'isa1')}>{sum(st.isa.isa1)}</div></td>
//                       <td style={{ textAlign: 'center' }}><div className="clickable-score" onClick={() => openGradingModal(idx, 'ISA', 'isa2')}>{sum(st.isa.isa2)}</div></td>
//                       <td style={{ textAlign: 'center' }}><div className="clickable-score" onClick={() => openGradingModal(idx, 'ISA', 'isa3')}>{sum(st.isa.isa3)}</div></td>
//                       <td style={{ textAlign: 'center' }}><div className="clickable-score" onClick={() => openGradingModal(idx, 'SEM')}>{sum(st.semMarks)}</div></td>
//                       {currentSubject.hasPractical && (
//                         <td style={{ textAlign: 'center' }}><div className="clickable-score" onClick={() => openGradingModal(idx, 'PRACTICAL')}>{st.practicalMarks || 0}</div></td>
//                       )}
//                       <td style={{ textAlign: 'center' }}><strong style={{ color: 'var(--text-main)', fontSize: '1rem' }}>{getStudentScore(st)}</strong></td>
//                       <td style={{ textAlign: 'center' }}>
//                         <select 
//                           className={`status-select status-${st.result}`} 
//                           value={st.result}
//                           onChange={(e) => updateStudentField(idx, 'result', e.target.value)}
//                         >
//                           <option value="pending">--</option>
//                           <option value="pass">Pass</option>
//                           <option value="fail">Fail</option>
//                         </select>
//                       </td>
//                       <td style={{ textAlign: 'center' }}><button className="btn btn-ghost" style={{ padding: '6px', border: 'none' }} onClick={() => deleteStudent(idx)}>✕</button></td>
//                     </tr>
//                    );
//                 })}
//               </tbody>
//             </table>
//           </div>
//           <div style={{ marginTop: '32px', textAlign: 'center' }}>
//             <button className="btn btn-ghost" onClick={addStudent}>+ Add New Student</button>
//           </div>
//         </>
//       )}

//       {/* --- SUBJECT CREATION MODAL --- */}
//       {subjectModalOpen && (
//         <div className="modal-overlay">
//           <div className="modal">
//             <h3 style={{ marginBottom: '24px', fontSize: '1.5rem', fontWeight: 800 }}>Create New Subject</h3>
//             <div className="form-group">
//               <label>Subject Name</label>
//               <input type="text" className="form-input" placeholder="e.g. Advanced Physics" 
//                 value={newSubject.name} onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })} 
//               />
//             </div>
//             <div className="form-group">
//               <label>Max SEM Marks</label>
//               <select className="form-input" value={newSubject.semMax} onChange={(e) => setNewSubject({ ...newSubject, semMax: e.target.value })}>
//                 <option value="20">20 Marks</option>
//                 <option value="40">40 Marks</option>
//                 <option value="60">60 Marks</option>
//                 <option value="80">80 Marks</option>
//                 <option value="100">100 Marks</option>
//               </select>
//             </div>
//             <div className="form-group">
//               <label>Select ISAs for Calculation</label>
//               <div className="isa-checkbox-group">
//                 {['isa1', 'isa2', 'isa3'].map(isa => (
//                   <label key={isa} className="isa-checkbox-label">
//                     <input type="checkbox" value={isa} checked={newSubject.selectedISAs.includes(isa)} onChange={handleIsaCheckbox} />
//                     {isa.toUpperCase()}
//                   </label>
//                 ))}
//               </div>
//               {isaError && <div className="error-msg">⚠ Please select at least one ISA</div>}
//             </div>
//             <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', background: '#f9fafb', padding: '12px', borderRadius: '10px', border: '1px solid var(--border)' }}>
//               <div>
//                 <label style={{ marginBottom: '2px' }}>Has Practical?</label>
//                 <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Enable marks</span>
//               </div>
//               <input type="checkbox" style={{ width: '20px', height: '20px', accentColor: 'var(--primary)' }} 
//                 checked={newSubject.hasPractical} onChange={(e) => setNewSubject({ ...newSubject, hasPractical: e.target.checked })}
//               />
//             </div>
//             {newSubject.hasPractical && (
//               <div className="form-group">
//                 <label>Max Practical Marks</label>
//                 <select className="form-input" value={newSubject.practicalMax} onChange={(e) => setNewSubject({ ...newSubject, practicalMax: e.target.value })}>
//                   <option value="25">25 Marks</option>
//                   <option value="40">40 Marks</option>
//                   <option value="80">80 Marks</option>
//                 </select>
//               </div>
//             )}
//             <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
//               <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setSubjectModalOpen(false)}>Cancel</button>
//               <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleCreateSubject}>Create Subject</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* --- GRADING MODAL --- */}
//       {gradingModalOpen && modalStudentData && (
//         <div className="modal-overlay">
//           <div className="modal">
//             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
//               <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
//                 {gradingState.type === 'PRACTICAL' ? 'Practical Grading' : `Grading • ${gradingState.subType ? gradingState.subType.toUpperCase() : 'SEM'}`}
//               </h3>
//               <button className="btn btn-ghost" onClick={() => setGradingModalOpen(false)} style={{ padding: '4px 8px', height: 'auto' }}>✕</button>
//             </div>
//             <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '0.9rem' }}>
//               {gradingState.type === 'PRACTICAL' ? 'Enter total practical marks.' : 'Enter marks below. Rename labels or add sub-parts.'}
//             </p>

//             {/* Practical Input */}
//             {gradingState.type === 'PRACTICAL' ? (
//               <div className="form-group">
//                 <label>Marks Scored</label>
//                 <input type="number" className="form-input" min="0" step="0.5" 
//                   value={modalStudentData.practicalMarks} 
//                   onChange={(e) => handleModalQuestionChange(0, e.target.value)} 
//                 />
//               </div>
//             ) : (
//               /* ISA/SEM List */
//               <div>
//                 {(gradingState.type === 'ISA' ? modalStudentData.isa[gradingState.subType] : modalStudentData.semMarks).map((val, idx) => {
//                   const uniqueKey = getUniqueKey(idx);
//                   const qDetails = (modalStudentData.questionDetails && modalStudentData.questionDetails[uniqueKey]) || {};
//                   const subParts = qDetails.subs || [];
//                   const isReadOnly = subParts.length > 0;
//                   const displayValue = isReadOnly ? subParts.reduce((a,b)=>a+Number(b), 0) : val;

//                   return (
//                     <div key={idx} style={{ marginBottom: '12px' }}>
//                       <div className="question-row">
//                         <input type="text" className="question-label-input" placeholder={`Question ${idx+1}`} 
//                           value={qDetails.label || `Question ${idx+1}`}
//                           onChange={(e) => updateLabel(uniqueKey, e.target.value)}
//                         />
//                         <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
//                           <input type="number" className="question-input" min="0" step="0.5" 
//                             readOnly={isReadOnly}
//                             value={displayValue}
//                             onChange={(e) => !isReadOnly && handleModalQuestionChange(idx, e.target.value)}
//                           />
//                           <button className="btn-tiny" onClick={() => addSubPart(uniqueKey)}>+ Sub</button>
//                           {gradingState.type === 'SEM' && (
//                             <button className="btn btn-ghost" style={{ padding: '4px 8px', color: 'var(--danger-text)' }} onClick={() => removeSemQuestion(idx)}>✕</button>
//                           )}
//                         </div>
//                       </div>
//                       {/* Sub Parts Render */}
//                       {subParts.length > 0 && (
//                         <div className="sub-parts-container">
//                           {subParts.map((subVal, sIdx) => (
//                             <div className="sub-part-row" key={sIdx}>
//                               <span>Part {String.fromCharCode(65 + sIdx)}</span>
//                               <div style={{ display: 'flex', alignItems: 'center' }}>
//                                 <input type="number" className="question-input" style={{ width: '60px', padding: '6px' }} step="0.5" min="0"
//                                   value={subVal}
//                                   onChange={(e) => updateSubPart(uniqueKey, sIdx, e.target.value, idx)}
//                                 />
//                                 <button className="btn-tiny btn-tiny-remove" onClick={() => removeSubPart(uniqueKey, sIdx, idx)}>✕</button>
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       )}
//                     </div>
//                   );
//                 })}
//                 {gradingState.type === 'SEM' && (
//                   <button className="btn btn-ghost" style={{ width: '100%', borderStyle: 'dashed', marginTop: '12px' }} onClick={addSemQuestion}>+ Add Question</button>
//                 )}
//               </div>
//             )}

//             {modalError && <div className="error-msg" style={{ textAlign: 'center', marginBottom: '12px' }}>{modalError}</div>}
//             <button className="btn btn-primary" style={{ width: '100%', marginTop: '20px' }} onClick={saveModalData}>Save Changes</button>
//           </div>
//         </div>
//       )}

//     </div>
//   );
// };

// export default FacultyPortal;








import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Portal.css';

const FacultyPortal = () => {
  const navigate = useNavigate();
  
  // Data State
  const [db, setDb] = useState({}); 
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [view, setView] = useState('login'); // login, dashboard, grading
  const [currentSubIdx, setCurrentSubIdx] = useState(null);
  const [loginError, setLoginError] = useState(false);

  // Modal States
  const [gradingModalOpen, setGradingModalOpen] = useState(false);
  const [gradingState, setGradingState] = useState({ studentIdx: null, type: null, subType: null });
  const [modalStudentData, setModalStudentData] = useState(null); 
  const [modalError, setModalError] = useState('');

  // --- Auth & Data Fetching ---
  const handleLogin = async (e) => {
    e.preventDefault();
    const val = e.target.elements.user.value.trim();
    if (!val) { setLoginError(true); return; }
    
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/faculty/data/${val}`);
      const subjects = res.data.subjects || res.data || [];
      
      const normalizedSubjects = subjects.map(sub => ({
        ...sub,
        students: (sub.students || []).map(st => ({
          ...st,
          isa: st.isa || { isa1: [0,0,0,0,0], isa2: [0,0,0,0,0], isa3: [0,0,0,0,0] },
          semMarks: st.semMarks || [0,0,0,0],
          practicalMarks: st.practicalMarks || 0,
          questionDetails: st.questionDetails || {}
        }))
      }));

      setDb({ [val]: normalizedSubjects });
      setCurrentUser(val);
      setView('dashboard');
      setLoginError(false);
    } catch (err) {
      alert("Login Failed: Check username or server connection.");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => { setCurrentUser(null); setView('login'); setDb({}); navigate(0); };

  // --- Grading Logic ---
  const openSubject = (idx) => {
    setCurrentSubIdx(idx);
    setView('grading');
  };

  const openGradingModal = (sIdx, type, subType = null) => {
    const sub = db[currentUser][currentSubIdx];
    if (!sub || !sub.students?.[sIdx]) return; 
    const studentData = JSON.parse(JSON.stringify(sub.students[sIdx]));
    setGradingState({ studentIdx: sIdx, type, subType });
    setModalStudentData(studentData);
    setGradingModalOpen(true);
    setModalError('');
  };

  const getUniqueKey = (idx) => {
    if (gradingState.type === 'ISA') return `${gradingState.subType}-${idx}`;
    return `sem-${idx}`;
  };

  const handleModalQuestionChange = (qIdx, val) => {
    const newData = { ...modalStudentData };
    const num = Number(val) || 0;
    if (gradingState.type === 'ISA') newData.isa[gradingState.subType][qIdx] = num;
    else if (gradingState.type === 'SEM') newData.semMarks[qIdx] = num;
    else if (gradingState.type === 'PRACTICAL') newData.practicalMarks = num;
    setModalStudentData(newData);
  };

  const updateLabel = (uniqueKey, label) => {
    const newData = { ...modalStudentData };
    if (!newData.questionDetails) newData.questionDetails = {};
    if (!newData.questionDetails[uniqueKey]) newData.questionDetails[uniqueKey] = {};
    newData.questionDetails[uniqueKey].label = label;
    setModalStudentData(newData);
  };

  const addSubPart = (uniqueKey) => {
    const newData = { ...modalStudentData };
    if (!newData.questionDetails) newData.questionDetails = {};
    if (!newData.questionDetails[uniqueKey]) newData.questionDetails[uniqueKey] = {};
    if (!newData.questionDetails[uniqueKey].subs) newData.questionDetails[uniqueKey].subs = [];
    newData.questionDetails[uniqueKey].subs.push(0);
    setModalStudentData(newData);
  };

  const updateSubPart = (uniqueKey, subIdx, val, parentIdx) => {
    const newData = { ...modalStudentData };
    newData.questionDetails[uniqueKey].subs[subIdx] = Number(val);
    const newTotal = newData.questionDetails[uniqueKey].subs.reduce((a,b) => a + Number(b), 0);
    if (gradingState.type === 'ISA') newData.isa[gradingState.subType][parentIdx] = newTotal;
    else if (gradingState.type === 'SEM') newData.semMarks[parentIdx] = newTotal;
    setModalStudentData(newData);
  };

  const removeSubPart = (uniqueKey, subIdx, parentIdx) => {
    const newData = { ...modalStudentData };
    newData.questionDetails[uniqueKey].subs.splice(subIdx, 1);
    if (newData.questionDetails[uniqueKey].subs.length === 0) delete newData.questionDetails[uniqueKey].subs;
    setModalStudentData(newData);
  };

  const addSemQuestion = () => {
    const newData = { ...modalStudentData };
    if (!newData.semMarks) newData.semMarks = [];
    newData.semMarks.push(0);
    setModalStudentData(newData);
  };

  const removeSemQuestion = (idx) => {
    const newData = { ...modalStudentData };
    newData.semMarks.splice(idx, 1);
    setModalStudentData(newData);
  };

  const saveModalData = async () => {
    const sub = db[currentUser][currentSubIdx];
    if (gradingState.type === 'PRACTICAL') {
      const max = sub.practicalMax || 25;
      if (modalStudentData.practicalMarks < 0 || modalStudentData.practicalMarks > max) {
        setModalError(`Marks must be between 0 and ${max}`); return;
      }
    }
    const newDb = { ...db };
    newDb[currentUser][currentSubIdx].students[gradingState.studentIdx] = modalStudentData;
    setDb(newDb);
    setGradingModalOpen(false);
    try {
        const sum = arr => (arr || []).reduce((a,b) => a + Number(b), 0);
        await axios.post('http://localhost:5000/api/faculty/save-marks', {
            studentId: modalStudentData.id,
            subjectId: sub.id,
            semester: sub.semester,
            marks: {
                isa1: sum(modalStudentData.isa?.isa1),
                isa2: sum(modalStudentData.isa?.isa2),
                isa3: sum(modalStudentData.isa?.isa3),
                sem: sum(modalStudentData.semMarks),
                practical: modalStudentData.practicalMarks
            }
        });
    } catch (err) { console.error("Database save failed"); }
  };

  // --- NEW LOGIC: Calculate Top 2 ISA + SEM + PRAC ---
  const getStudentCalculations = (student) => {
    const sub = db[currentUser][currentSubIdx];
    if (!sub || !student) return { isa1: 0, isa2: 0, isa3: 0, topTwo: 0, grandTotal: 0 };
    
    const sum = arr => (arr || []).reduce((a, b) => a + Number(b), 0);
    
    const i1 = sum(student.isa?.isa1);
    const i2 = sum(student.isa?.isa2);
    const i3 = sum(student.isa?.isa3);
    const sem = sum(student.semMarks);
    const prac = sub.hasPractical ? (student.practicalMarks || 0) : 0;

    // Get Best 2 of 3
    const isas = [i1, i2, i3].sort((a, b) => b - a);
    const topTwoTotal = isas[0] + isas[1];
    
    return {
      isa1: i1,
      isa2: i2,
      isa3: i3,
      topTwo: topTwoTotal,
      grandTotal: topTwoTotal + sem + prac
    };
  };

  // --- RENDERERS ---

  if (view === 'login') {
    return (
      <div className="portal-theme login-wrapper">
        <div className="login-card">
          <div className="logo">Uni<span>Desk</span></div>
          <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Faculty Portal</p>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <input name="user" type="text" className="form-input" placeholder="Enter Username" style={{ textAlign: 'center' }} />
              {loginError && <div className="error-msg">⚠ Please enter valid username</div>}
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              {loading ? 'Authenticating...' : 'Access Dashboard'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const currentSubject = (currentUser && currentSubIdx !== null) ? db[currentUser]?.[currentSubIdx] : null;

  return (
    <div className="portal-theme" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      <div className="container" style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', animation: 'slideUp 0.4s ease' }}>
        
        {/* Header */}
        <div className="section-header" style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div className="logo" style={{ fontSize: '24px' }}>Uni<span>Desk</span></div>
            {view === 'dashboard' && <div style={{ color: 'var(--text-muted)', marginTop: '4px' }}>Welcome back, <strong style={{ color: 'var(--text-main)' }}>{currentUser}</strong></div>}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            {view === 'grading' && <button className="btn btn-ghost" onClick={() => setView('dashboard')}>← Back</button>}
            <button className="btn btn-ghost" onClick={logout}>Sign Out</button>
          </div>
        </div>

        {/* Dashboard View */}
        {view === 'dashboard' && (
          <div className="faculty-grid" style={{ width: '100%', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px', justifyContent: 'center' }}>
            {(db[currentUser] || []).map((sub, idx) => (
              <div className="card faculty-card" key={idx} onClick={() => openSubject(idx)} style={{ cursor: 'pointer', margin: '0' }}>
                <div>
                  <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #4f46e5, #8b5cf6)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '1.2rem', marginBottom: '16px' }}>
                    {(sub.name || "SU").substring(0,2).toUpperCase()}
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>{sub.name}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{(sub.students || []).length} Students</p>
                </div>
                <div style={{ marginTop: '24px', borderTop: '1px solid var(--border)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Semester: {sub.semester}</span>
                  {sub.hasPractical && <span style={{ fontSize: '0.75rem', background: '#dbeafe', color: '#1e40af', padding: '2px 6px', borderRadius: '4px' }}>Prac ({sub.practicalMax})</span>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Grading View */}
        {view === 'grading' && currentSubject && (
          <div style={{ width: '100%' }}>
            <div className="section-header" style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{currentSubject.name}</h2>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  Semester {currentSubject.semester} | Best 2 of 3 ISAs will be considered
                </div>
              </div>
              <button className="btn btn-primary" onClick={() => setView('dashboard')}>Confirm All</button>
            </div>

            <div className="table-wrapper" style={{ width: '100%', margin: '0 auto' }}>
              <table style={{ width: '100%' }}>
                <thead>
                  <tr style={{ background: '#f8fafc' }}>
                    <th style={{ width: '20%', padding: '15px' }}>Student Name</th>
                    <th style={{ textAlign: 'center' }}>ISA 1</th>
                    <th style={{ textAlign: 'center' }}>ISA 2</th>
                    <th style={{ textAlign: 'center' }}>ISA 3</th>
                    <th style={{ textAlign: 'center', color: '#4f46e5' }}>Top 2 Total</th>
                    <th style={{ textAlign: 'center' }}>SEM ({currentSubject.semMax || 100})</th>
                    {currentSubject.hasPractical && <th style={{ textAlign: 'center' }}>Practical ({currentSubject.practicalMax})</th>}
                    <th style={{ textAlign: 'center', background: '#f1f5f9' }}>Grand Total</th>
                  </tr>
                </thead>
                <tbody>
                  {(currentSubject.students || []).map((st, idx) => {
                     const calc = getStudentCalculations(st);
                     return (
                      <tr key={st.id || idx}>
                        <td style={{ padding: '12px' }}><input type="text" className="name-input" value={st.name} readOnly /></td>
                        <td style={{ textAlign: 'center' }}><div className="clickable-score" onClick={() => openGradingModal(idx, 'ISA', 'isa1')}>{calc.isa1}</div></td>
                        <td style={{ textAlign: 'center' }}><div className="clickable-score" onClick={() => openGradingModal(idx, 'ISA', 'isa2')}>{calc.isa2}</div></td>
                        <td style={{ textAlign: 'center' }}><div className="clickable-score" onClick={() => openGradingModal(idx, 'ISA', 'isa3')}>{calc.isa3}</div></td>
                        <td style={{ textAlign: 'center', fontWeight: 'bold', color: '#4f46e5' }}>{calc.topTwo}</td>
                        <td style={{ textAlign: 'center' }}><div className="clickable-score" onClick={() => openGradingModal(idx, 'SEM')}>{calc.grandTotal - calc.topTwo - (currentSubject.hasPractical ? st.practicalMarks : 0)}</div></td>
                        {currentSubject.hasPractical && (
                          <td style={{ textAlign: 'center' }}><div className="clickable-score" onClick={() => openGradingModal(idx, 'PRACTICAL')}>{st.practicalMarks || 0}</div></td>
                        )}
                        <td style={{ textAlign: 'center', background: '#f8fafc' }}>
                          <strong style={{ color: 'var(--text-main)', fontSize: '1rem' }}>{calc.grandTotal}</strong>
                        </td>
                      </tr>
                     );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* --- GRADING MODAL --- */}
      {gradingModalOpen && modalStudentData && (
        <div className="modal-overlay">
          <div className="modal">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                {gradingState.type === 'PRACTICAL' ? 'Practical Grading' : `Grading • ${gradingState.subType ? gradingState.subType.toUpperCase() : 'SEM'}`}
              </h3>
              <button className="btn btn-ghost" onClick={() => setGradingModalOpen(false)} style={{ padding: '4px 8px', height: 'auto' }}>✕</button>
            </div>
            
            {gradingState.type === 'PRACTICAL' ? (
              <div className="form-group">
                <label>Marks Scored</label>
                <input type="number" className="form-input" min="0" step="0.5" 
                  value={modalStudentData.practicalMarks || 0} 
                  onChange={(e) => handleModalQuestionChange(0, e.target.value)} 
                />
              </div>
            ) : (
              <div>
                {(gradingState.type === 'ISA' ? (modalStudentData.isa?.[gradingState.subType] || []) : (modalStudentData.semMarks || [])).map((val, idx) => {
                  const uniqueKey = getUniqueKey(idx);
                  const qDetails = (modalStudentData.questionDetails && modalStudentData.questionDetails[uniqueKey]) || {};
                  const subParts = qDetails.subs || [];
                  const isReadOnly = subParts.length > 0;
                  const displayValue = isReadOnly ? subParts.reduce((a,b)=>a+Number(b), 0) : val;

                  return (
                    <div key={idx} style={{ marginBottom: '12px' }}>
                      <div className="question-row">
                        <input type="text" className="question-label-input" placeholder={`Question ${idx+1}`} 
                          value={qDetails.label || `Question ${idx+1}`}
                          onChange={(e) => updateLabel(uniqueKey, e.target.value)}
                        />
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <input type="number" className="question-input" min="0" step="0.5" 
                            readOnly={isReadOnly}
                            value={displayValue}
                            onChange={(e) => !isReadOnly && handleModalQuestionChange(idx, e.target.value)}
                          />
                          <button className="btn-tiny" onClick={() => addSubPart(uniqueKey)}>+ Sub</button>
                          {gradingState.type === 'SEM' && (
                            <button className="btn btn-ghost" style={{ padding: '4px 8px', color: 'var(--danger-text)' }} onClick={() => removeSemQuestion(idx)}>✕</button>
                          )}
                        </div>
                      </div>
                      {subParts.length > 0 && (
                        <div className="sub-parts-container">
                          {subParts.map((subVal, sIdx) => (
                            <div className="sub-part-row" key={sIdx}>
                              <span>Part {String.fromCharCode(65 + sIdx)}</span>
                              <div style={{ display: 'flex', alignItems: 'center' }}>
                                <input type="number" className="question-input" style={{ width: '60px', padding: '6px' }} step="0.5" min="0"
                                  value={subVal}
                                  onChange={(e) => updateSubPart(uniqueKey, sIdx, e.target.value, idx)}
                                />
                                <button className="btn-tiny btn-tiny-remove" onClick={() => removeSubPart(uniqueKey, sIdx, idx)}>✕</button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
                {gradingState.type === 'SEM' && (
                  <button className="btn btn-ghost" style={{ width: '100%', borderStyle: 'dashed', marginTop: '12px' }} onClick={addSemQuestion}>+ Add Question</button>
                )}
              </div>
            )}
            <button className="btn btn-primary" style={{ width: '100%', marginTop: '20px' }} onClick={saveModalData}>Save Changes</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyPortal;