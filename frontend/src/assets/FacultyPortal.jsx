import React, { useState } from 'react';
import useLocalStorageSync from './useLocalStorageSync';
// Removed unused imports

const FacultyPortal = () => {
  const [db, setDb] = useLocalStorageSync('unidesk_v10_practical', {});
  const [currentUser, setCurrentUser] = useState(null);
  const [view, setView] = useState('login'); // login, dashboard, grading
  const [currentSubIdx, setCurrentSubIdx] = useState(null);
  const [loginError, setLoginError] = useState(false);
  
  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [filterYear, setFilterYear] = useState("All Years");
  
  // Modal States
  const [subjectModalOpen, setSubjectModalOpen] = useState(false);
  const [gradingModalOpen, setGradingModalOpen] = useState(false);
  
  // Subject Creation State
  const [newSubject, setNewSubject] = useState({
    name: '', 
    semMax: 100, 
    hasPractical: false, 
    practicalMax: 25, 
    selectedISAs: ['isa1', 'isa2'], 
    theoryCredits: 4,     // Default 100/25 = 4
    practicalCredits: 1   // Default 25/25 = 1
  });
  const [isaError, setIsaError] = useState(false);

  // Grading Modal State
  const [gradingState, setGradingState] = useState({ studentIdx: null, type: null, subType: null });
  const [modalStudentData, setModalStudentData] = useState(null); 
  const [modalError, setModalError] = useState('');

  // --- Auth ---
  const handleLogin = (e) => {
    e.preventDefault();
    const val = e.target.elements.user.value.trim();
    if (!val) { setLoginError(true); return; }
    
    if (!db[val]) {
      setDb({ ...db, [val]: [] });
    }
    
    setCurrentUser(val);
    setView('dashboard');
  };

  const logout = () => { setCurrentUser(null); setView('login'); window.location.reload(); };

  // --- Helpers ---
  // Defined BEFORE usage to fix the "used before defined" error
  const createStudent = (name) => ({
    id: Date.now() + Math.random(),
    name,
    year: (Math.floor(Math.random() * (2026 - 2005 + 1)) + 2005).toString(),
    isa: { isa1: [0,0,0,0,0], isa2: [0,0,0,0,0], isa3: [0,0,0,0,0] },
    semMarks: [0,0,0,0],
    practicalMarks: 0,
    questionDetails: {},
    result: 'pending'
  });

  // --- Dashboard Logic ---
  const handleCreateSubject = () => {
    if (!newSubject.name) return;
    if (newSubject.selectedISAs.length === 0) { setIsaError(true); return; }

    const newSubData = {
      name: newSubject.name,
      semMax: Number(newSubject.semMax),
      selectedISAs: newSubject.selectedISAs,
      hasPractical: newSubject.hasPractical,
      practicalMax: newSubject.hasPractical ? Number(newSubject.practicalMax) : 25,
      // Ensure credits are numbers
      theoryCredits: Number(newSubject.theoryCredits),
      practicalCredits: newSubject.hasPractical ? Number(newSubject.practicalCredits) : 0,
      students: [createStudent("Student A"), createStudent("Student B")]
    };

    const userSubjects = db[currentUser] || [];
    setDb({ ...db, [currentUser]: [...userSubjects, newSubData] });
    setSubjectModalOpen(false);
    
    // Reset form
    setNewSubject({ 
      name: '', semMax: 100, hasPractical: false, practicalMax: 25, selectedISAs: ['isa1', 'isa2'], 
      theoryCredits: 4, practicalCredits: 1 
    });
  };

  const handleIsaCheckbox = (e) => {
    const val = e.target.value;
    const current = newSubject.selectedISAs;
    if (current.includes(val)) {
      setNewSubject({ ...newSubject, selectedISAs: current.filter(i => i !== val) });
    } else {
      setNewSubject({ ...newSubject, selectedISAs: [...current, val] });
    }
    setIsaError(false);
  };

  // --- Grading Logic ---
  const openSubject = (idx) => {
    setCurrentSubIdx(idx);
    setView('grading');
  };

  const openGradingModal = (sIdx, type, subType = null) => {
    const sub = db[currentUser][currentSubIdx];
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
    if (gradingState.type === 'ISA') newData.isa[gradingState.subType][qIdx] = Number(val);
    else if (gradingState.type === 'SEM') newData.semMarks[qIdx] = Number(val);
    else if (gradingState.type === 'PRACTICAL') newData.practicalMarks = Number(val);
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
    newData.semMarks.push(0);
    setModalStudentData(newData);
  };

  const removeSemQuestion = (idx) => {
    const newData = { ...modalStudentData };
    newData.semMarks.splice(idx, 1);
    setModalStudentData(newData);
  };

  const saveModalData = () => {
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
  };

  // --- Helpers for Grading Table ---
  const getStudentScore = (student) => {
    const sub = db[currentUser][currentSubIdx];
    const sum = arr => arr.reduce((a,b) => a+Number(b), 0);
    let isaTotal = 0;
    if (sub.selectedISAs.includes('isa1')) isaTotal += sum(student.isa.isa1);
    if (sub.selectedISAs.includes('isa2')) isaTotal += sum(student.isa.isa2);
    if (sub.selectedISAs.includes('isa3')) isaTotal += sum(student.isa.isa3);
    const sem = sum(student.semMarks);
    const pract = sub.hasPractical ? (student.practicalMarks || 0) : 0;
    return isaTotal + sem + pract;
  };

  const updateStudentField = (sIdx, field, val) => {
    const newDb = { ...db };
    newDb[currentUser][currentSubIdx].students[sIdx][field] = val;
    setDb(newDb);
  };

  const deleteStudent = (sIdx) => {
    if(window.confirm("Delete?")) {
      const newDb = { ...db };
      newDb[currentUser][currentSubIdx].students.splice(sIdx, 1);
      setDb(newDb);
    }
  };

  const addStudent = () => {
    const newDb = { ...db };
    newDb[currentUser][currentSubIdx].students.push(createStudent("New Student"));
    setDb(newDb);
  };

  // --- RENDERERS ---

  if (view === 'login') {
    return (
      <div className="login-wrapper">
        <div className="login-card">
          <div className="logo">Uni<span>Desk</span></div>
          <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Faculty Grading Portal</p>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <input name="user" type="text" className="form-input" placeholder="Enter Faculty Name" style={{ textAlign: 'center' }} />
              {loginError && <div className="error-msg" style={{ textAlign: 'center' }}>⚠ Please enter your name</div>}
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Access Dashboard</button>
          </form>
        </div>
      </div>
    );
  }

  const currentSubject = currentSubIdx !== null ? db[currentUser][currentSubIdx] : null;

  return (
    <div className="container" style={{ animation: 'slideUp 0.4s ease' }}>
      
      {/* Header */}
      <div className="section-header">
        <div>
          <div className="logo" style={{ fontSize: '24px' }}>Uni<span>Desk</span></div>
          {view === 'dashboard' && <div style={{ color: 'var(--text-muted)', marginTop: '4px' }}>Welcome back, <strong style={{ color: 'var(--text-main)' }}>{currentUser}</strong></div>}
        </div>
        <div>
          {view === 'grading' && <button className="btn btn-ghost" onClick={() => setView('dashboard')} style={{ marginRight: '12px' }}>← Back</button>}
          <button className="btn btn-ghost" onClick={logout}>Sign Out</button>
        </div>
      </div>

      {/* Dashboard View */}
      {view === 'dashboard' && (
        <div className="faculty-grid">
          <div className="card card-add" onClick={() => setSubjectModalOpen(true)}>
            <span style={{ fontSize: '3rem', color: 'var(--border)' }}>+</span>
            <span style={{ fontWeight: 600, marginTop: '8px' }}>New Subject</span>
          </div>
          {(db[currentUser] || []).map((sub, idx) => {
            // FIX: Calculate defaults if data is undefined (Marks / 25)
            // This prevents "undefined Credits"
            const tCr = sub.theoryCredits !== undefined ? sub.theoryCredits : (sub.semMax ? sub.semMax / 25 : 4);
            const pCr = sub.practicalCredits !== undefined ? sub.practicalCredits : (sub.practicalMax ? sub.practicalMax / 25 : 1);
            
            return (
              <div className="card faculty-card" key={idx} onClick={() => openSubject(idx)} style={{ cursor: 'pointer' }}>
                <div>
                  <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #4f46e5, #8b5cf6)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '1.2rem', marginBottom: '16px' }}>
                    {sub.name.substring(0,2).toUpperCase()}
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>{sub.name}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{sub.students.length} Students</p>
                </div>
                <div style={{ marginTop: '24px', borderTop: '1px solid var(--border)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                     {sub.hasPractical && <span style={{ fontSize: '0.75rem', background: '#dbeafe', color: '#1e40af', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>Prac ({sub.practicalMax})</span>}
                     
                     {/* FIX: Display "Credits" instead of "Cr" */}
                     <span style={{ fontSize: '0.75rem', background: '#f3f4f6', color: '#4b5563', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>
                       {sub.hasPractical ? `${tCr}+${pCr} Credits` : `${tCr} Credits`}
                     </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Grading View */}
      {view === 'grading' && currentSubject && (
        <>
          <div className="section-header">
            <div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{currentSubject.name}</h2>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                ISAs Used: {currentSubject.selectedISAs.join(', ').toUpperCase()} 
                {currentSubject.hasPractical ? ` | Practical (${currentSubject.practicalMax})` : ''} 
                {/* FIX: Ensure values aren't undefined here either */}
                {` | Credits: T:${currentSubject.theoryCredits || (currentSubject.semMax/25)} ${currentSubject.hasPractical ? `+ P:${currentSubject.practicalCredits || (currentSubject.practicalMax/25)}` : ''}`}
              </div>
            </div>
            <button className="btn btn-primary">Save Grades</button>
          </div>

          {/* Search and Filter Row */}
          <div className="filter-container">
            <div className="search-bar">
              <span className="search-icon">🔍</span>
              <input 
                type="text" 
                placeholder="Search by name..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select 
              className="year-filter" 
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
            >
              <option value="All Years">FILTER YEAR</option>
              {Array.from({ length: 2026 - 2005 + 1 }, (_, i) => 2005 + i).reverse().map((year) => (
                <option key={year} value={year.toString()}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th style={{ width: '25%' }}>Student Name</th>
                  <th style={{ textAlign: 'center' }}>ISA 1</th>
                  <th style={{ textAlign: 'center' }}>ISA 2</th>
                  <th style={{ textAlign: 'center' }}>ISA 3</th>
                  <th style={{ textAlign: 'center' }}>SEM ({currentSubject.semMax || 100})</th>
                  {currentSubject.hasPractical && <th style={{ textAlign: 'center' }}>Practical ({currentSubject.practicalMax})</th>}
                  <th style={{ textAlign: 'center' }}>Final Score</th>
                  <th style={{ textAlign: 'center' }}>Result</th>
                  <th style={{ width: '50px' }}></th>
                </tr>
              </thead>
              <tbody>
                {currentSubject.students
                  .map((st, originalIdx) => ({ ...st, originalIdx })) 
                  .filter(st => {
                    const matchesSearch = st.name.toLowerCase().includes(searchTerm.toLowerCase());
                    const matchesYear = filterYear === "All Years" || st.year === filterYear;
                    return matchesSearch && matchesYear;
                  })
                  .map((st) => {
                    const sum = arr => arr.reduce((a, b) => a + Number(b), 0);
                    const idx = st.originalIdx; 
                    return (
                      <tr key={st.id}>
                        <td><input type="text" className="name-input" value={st.name} onChange={(e) => updateStudentField(idx, 'name', e.target.value)} /></td>
                        <td style={{ textAlign: 'center' }}><div className="clickable-score" onClick={() => openGradingModal(idx, 'ISA', 'isa1')}>{sum(st.isa.isa1)}</div></td>
                        <td style={{ textAlign: 'center' }}><div className="clickable-score" onClick={() => openGradingModal(idx, 'ISA', 'isa2')}>{sum(st.isa.isa2)}</div></td>
                        <td style={{ textAlign: 'center' }}><div className="clickable-score" onClick={() => openGradingModal(idx, 'ISA', 'isa3')}>{sum(st.isa.isa3)}</div></td>
                        <td style={{ textAlign: 'center' }}><div className="clickable-score" onClick={() => openGradingModal(idx, 'SEM')}>{sum(st.semMarks)}</div></td>
                        {currentSubject.hasPractical && (
                          <td style={{ textAlign: 'center' }}><div className="clickable-score" onClick={() => openGradingModal(idx, 'PRACTICAL')}>{st.practicalMarks || 0}</div></td>
                        )}
                        <td style={{ textAlign: 'center' }}><strong style={{ color: 'var(--text-main)', fontSize: '1rem' }}>{getStudentScore(st)}</strong></td>
                        <td style={{ textAlign: 'center' }}>
                          <select 
                            className={`status-select status-${st.result}`} 
                            value={st.result}
                            onChange={(e) => updateStudentField(idx, 'result', e.target.value)}
                          >
                            <option value="pending">--</option>
                            <option value="pass">Pass</option>
                            <option value="fail">Fail</option>
                          </select>
                        </td>
                        <td style={{ textAlign: 'center' }}><button className="btn btn-ghost" style={{ padding: '6px', border: 'none' }} onClick={() => deleteStudent(idx)}>✕</button></td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: '32px', textAlign: 'center' }}>
            <button className="btn btn-ghost" onClick={addStudent}>+ Add New Student</button>
          </div>
        </>
      )}

      {/* --- SUBJECT CREATION MODAL --- */}
      {subjectModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h3 style={{ marginBottom: '24px', fontSize: '1.5rem', fontWeight: 800 }}>Create New Subject</h3>
            <div className="form-group">
              <label>Subject Name</label>
              <input type="text" className="form-input" placeholder="e.g. Advanced Physics" 
                value={newSubject.name} onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })} 
              />
            </div>
            
            <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', background: '#f9fafb', padding: '12px', borderRadius: '10px', border: '1px solid var(--border)', marginBottom: '16px' }}>
              <div>
                <label style={{ marginBottom: '2px' }}>Has Practical?</label>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Enable practical marks & credits</span>
              </div>
              <input type="checkbox" style={{ width: '20px', height: '20px', accentColor: 'var(--primary)' }} 
                checked={newSubject.hasPractical} onChange={(e) => setNewSubject({ ...newSubject, hasPractical: e.target.checked })}
              />
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <div className="form-group" style={{ flex: 1 }}>
                 <label>Theory Credits</label>
                 <input 
                   type="number" className="form-input" min="1" max="10" 
                   value={newSubject.theoryCredits} 
                   onChange={(e) => setNewSubject({ ...newSubject, theoryCredits: e.target.value })} 
                 />
              </div>
              {newSubject.hasPractical && (
                <div className="form-group" style={{ flex: 1 }}>
                   <label>Practical Credits</label>
                   <input 
                     type="number" className="form-input" min="1" max="10" 
                     value={newSubject.practicalCredits} 
                     onChange={(e) => setNewSubject({ ...newSubject, practicalCredits: e.target.value })} 
                   />
                </div>
              )}
            </div>

            <div className="form-group">
              <label>Max SEM Marks</label>
              <select 
                className="form-input" 
                value={newSubject.semMax} 
                onChange={(e) => {
                  const val = Number(e.target.value);
                  // FIX: Auto-calculate credits when marks change (1 Cr = 25 Marks)
                  setNewSubject({ ...newSubject, semMax: val, theoryCredits: val / 25 })
                }}
              >
                {/* FIX: Full "Credits" name */}
                <option value="20">20 Marks (0.8 Credits)</option>
                <option value="40">40 Marks (1.6 Credits)</option>
                <option value="60">60 Marks (2.4 Credits)</option>
                <option value="80">80 Marks (3.2 Credits)</option>
                <option value="100">100 Marks (4 Credits)</option>
              </select>
            </div>

            {newSubject.hasPractical && (
              <div className="form-group">
                <label>Max Practical Marks</label>
                <select 
                  className="form-input" 
                  value={newSubject.practicalMax} 
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    // FIX: Auto-calculate credits when practical marks change
                    setNewSubject({ ...newSubject, practicalMax: val, practicalCredits: val / 25 })
                  }}
                >
                  {/* FIX: Full "Credits" name */}
                  <option value="25">25 Marks (1 Credits)</option>
                  <option value="40">40 Marks (1.6 Credits)</option>
                  <option value="50">50 Marks (2 Credits)</option>
                  <option value="80">80 Marks (3.2 Credits)</option>
                </select>
              </div>
            )}

            <div className="form-group">
              <label>Select ISAs for Calculation</label>
              <div className="isa-checkbox-group">
                {['isa1', 'isa2', 'isa3'].map(isa => (
                  <label key={isa} className="isa-checkbox-label">
                    <input type="checkbox" value={isa} checked={newSubject.selectedISAs.includes(isa)} onChange={handleIsaCheckbox} />
                    {isa.toUpperCase()}
                  </label>
                ))}
              </div>
              {isaError && <div className="error-msg">⚠ Please select at least one ISA</div>}
            </div>

            <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
              <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setSubjectModalOpen(false)}>Cancel</button>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleCreateSubject}>Create Subject</button>
            </div>
          </div>
        </div>
      )}

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
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '0.9rem' }}>
              {gradingState.type === 'PRACTICAL' ? 'Enter total practical marks.' : 'Enter marks below. Rename labels or add sub-parts.'}
            </p>

            {gradingState.type === 'PRACTICAL' ? (
              <div className="form-group">
                <label>Marks Scored</label>
                <input type="number" className="form-input" min="0" step="0.5" 
                  value={modalStudentData.practicalMarks} 
                  onChange={(e) => handleModalQuestionChange(0, e.target.value)} 
                />
              </div>
            ) : (
              <div>
                {(gradingState.type === 'ISA' ? modalStudentData.isa[gradingState.subType] : modalStudentData.semMarks).map((val, idx) => {
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

            {modalError && <div className="error-msg" style={{ textAlign: 'center', marginBottom: '12px' }}>{modalError}</div>}
            <button className="btn btn-primary" style={{ width: '100%', marginTop: '20px' }} onClick={saveModalData}>Save Changes</button>
          </div>
        </div>
      )}

    </div>
  );
};

export default FacultyPortal;