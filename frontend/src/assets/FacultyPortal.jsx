











import React, { useState, useEffect } from 'react';
import useLocalStorageSync from './useLocalStorageSync';
import './FacultyPortal.css';

const FacultyPortal = () => {
  // --- SYNC & API STATE ---
  const [db, setDb] = useLocalStorageSync('unidesk_faculty_v1', {});
  const [faculties, setFaculties] = useState([]);
  const [subjectsList, setSubjectsList] = useState({});
  const [allStudents, setAllStudents] = useState([]); 
  const [loading, setLoading] = useState(true);
  const token = JSON.parse(localStorage.getItem('current_user'))?.token;

  // --- VIEW FLOW ---
  const [view, setView] = useState('login'); 
  const [activeUser, setActiveUser] = useState(null);
  const [currentSubIdx, setCurrentSubIdx] = useState(null);
  const [loginError, setLoginError] = useState('');

  // --- MODALS & FORMS ---
  const [subjectModalOpen, setSubjectModalOpen] = useState(false);
  const [gradingModalOpen, setGradingModalOpen] = useState(false);
  
  const [newSubject, setNewSubject] = useState({
    subjectId: '',
    isaMax: 10, // Default Max for each ISA
    semMax: 70,
    hasPractical: false,
    practicalMax: 25,
    selectedISAs: ['isa1', 'isa2', 'isa3']
  });

  const [gradingState, setGradingState] = useState({ studentIdx: null, type: null, subType: null });
  const [modalStudentData, setModalStudentData] = useState(null);

  // --- 1. MASTER DATA FETCH ---
  useEffect(() => {
    const loadMasterData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/dashboard/data', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();

        const mappedFaculties = (data.teachers || []).map(t => ({
          id: t.id, 
          name: t.name, 
          username: t.username,
          assignedSubjects: (data.teacherAssignments || [])
            .filter(a => (a.teacherId === t.id || a.teacher_id === t.id))
            .map(a => a.subjectId || a.subject_id)
        }));
        setFaculties(mappedFaculties);

        const subMap = {};
        (data.subjects || []).forEach(s => { subMap[s.id] = s; });
        setSubjectsList(subMap);

        setAllStudents(data.students || []);
        setLoading(false);
      } catch (err) { 
        console.error("Master Data Error:", err);
        setLoading(false); 
      }
    };
    if (token) loadMasterData();
  }, [token]);

  // --- 2. BACKEND SYNC LOGIC ---

  // Standard Sync for LocalStorage backup on Cloud
  const syncGradebookToBackend = async (gradebookData) => {
    try {
      await fetch('http://localhost:5000/api/faculty/sync-gradebook', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          username: activeUser.username,
          gradebook: gradebookData
        })
      });
    } catch (err) {
      console.error("Cloud Sync Error:", err);
    }
  };

  // NEW: Bulk Sync to Relational 'marks' table
  const handleBulkSyncToServer = async () => {
    const sub = db[activeUser.username][currentSubIdx];
    const maxPossible = (sub.isaMax * 2) + sub.semMax + (sub.hasPractical ? sub.practicalMax : 0);

    // Prepare relational payload
    const marksPayload = sub.students.map(st => {
      const total = getFinalScore(st);
      const { grade, status } = getGradeAndStatus(total, maxPossible);
      return {
        student_id: st.id,
        subject_id: sub.subjectId,
        batch_id: sub.batchId,
        isa1: sumArr(st.isa.isa1),
        isa2: sumArr(st.isa.isa2),
        isa3: sumArr(st.isa.isa3),
        theory: sumArr(st.semMarks),
        practical: st.practicalMarks || 0,
        total_marks: total,
        grade: grade,
        result_status: status
      };
    });

    try {
      const response = await fetch('http://localhost:5000/api/faculty/bulk-save-marks', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ marks: marksPayload })
      });
      const result = await response.json();
      if (result.success) alert("Successfully synced marks to server database!");
      else alert("Sync failed: " + result.message);
    } catch (err) {
      alert("Network Error: Could not reach server.");
    }
  };

  // --- 3. LOGIN VALIDATION ---
  const handleWorkspaceValidation = async (e) => {
    e.preventDefault();
    setLoginError('');
    const inputUser = e.target.elements.workspaceUser.value.trim();
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/workspace-validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ username: inputUser })
      });
      const data = await response.json();

      if (data.success) {
        const masterFaculty = faculties.find(f => f.username.toLowerCase() === inputUser.toLowerCase());
        const userObj = {
          ...data.teacher,
          assignedSubjects: masterFaculty ? masterFaculty.assignedSubjects : []
        };
        setActiveUser(userObj);
        if (!db[userObj.username]) setDb({ ...db, [userObj.username]: [] });
        setView('dashboard');
      } else {
        setLoginError(data.message || "Invalid Workspace User");
      }
    } catch (err) { 
        setLoginError("Validation Server Offline"); 
    }
  };

  // --- 4. CALCULATION HELPERS ---
  const sumArr = (arr) => (Array.isArray(arr) ? arr.reduce((a, b) => a + Number(b), 0) : Number(arr) || 0);

  const getBestTwoISA = (st) => {
    const scores = ['isa1', 'isa2', 'isa3'].map(k => sumArr(st.isa[k]));
    const sorted = [...scores].sort((a, b) => b - a);
    return sorted[0] + sorted[1];
  };

  const getFinalScore = (st) => {
    const sub = db[activeUser.username][currentSubIdx];
    const bestISA = getBestTwoISA(st);
    const theory = sumArr(st.semMarks);
    const practical = sub.hasPractical ? Number(st.practicalMarks || 0) : 0;
    return bestISA + theory + practical;
  };

  const getGradeAndStatus = (score, max) => {
    const percentage = (score / max) * 100;
    if (percentage >= 40) {
        if (percentage >= 90) return { grade: 'O', status: 'PASS' };
        if (percentage >= 80) return { grade: 'A+', status: 'PASS' };
        if (percentage >= 70) return { grade: 'A', status: 'PASS' };
        if (percentage >= 60) return { grade: 'B', status: 'PASS' };
        if (percentage >= 50) return { grade: 'C', status: 'PASS' };
        return { grade: 'P', status: 'PASS' };
    }
    return { grade: 'F', status: 'FAIL' };
  };

  // --- 5. CREATE GRADEBOOK ---
  const handleCreateSubject = async () => {
    if (!newSubject.subjectId) return alert("Select a subject");
    
    const targetSubject = subjectsList[newSubject.subjectId];
    const liveBatchId = targetSubject.batchId || targetSubject.batch_id || "";
    const liveBatchYear = targetSubject.batch_name || targetSubject.batchYear || targetSubject.academic_year || "2024-2027";
    
    const userGradebooks = db[activeUser.username] || [];
    const isDuplicate = userGradebooks.some(gb => 
      String(gb.subjectId) === String(newSubject.subjectId) && 
      String(gb.batchId) === String(liveBatchId)
    );

    if (isDuplicate) return alert(`Gradebook already exists!`);

    const filteredStudents = allStudents.filter(st => String(st.batchId || st.batch_id) === String(liveBatchId));
    if (filteredStudents.length === 0) return alert(`No students found for Batch ID: ${liveBatchId}`);

    const enrolledStudents = filteredStudents.map(st => ({
      id: st.id,
      name: st.name,
      enrollmentNo: st.enrollment_no || st.roll_no || `UN-${st.id}`,
      isa: { isa1: [0,0,0], isa2: [0,0,0], isa3: [0,0,0] },
      semMarks: [0,0,0],
      practicalMarks: 0,
      result: 'pending'
    }));

    const newSubData = {
      id: Date.now(),
      subjectId: newSubject.subjectId,
      batchId: liveBatchId,           
      academicYear: liveBatchYear,    
      name: targetSubject.name,
      semester: targetSubject.semester || "N/A",
      isaMax: Number(newSubject.isaMax), 
      semMax: Number(newSubject.semMax),
      selectedISAs: newSubject.selectedISAs,
      hasPractical: newSubject.hasPractical,
      practicalMax: newSubject.hasPractical ? Number(newSubject.practicalMax) : 0,
      students: enrolledStudents
    };

    const updatedGradebooks = [...userGradebooks, newSubData];
    setDb({ ...db, [activeUser.username]: updatedGradebooks });
    await syncGradebookToBackend(newSubData);
    setSubjectModalOpen(false);
  };

  const deleteGradebook = (e, idx) => {
    e.stopPropagation(); 
    if (window.confirm("Are you sure?")) {
      const updated = (db[activeUser.username] || []).filter((_, i) => i !== idx);
      setDb({ ...db, [activeUser.username]: updated });
    }
  };

  const openGradingModal = (sIdx, type, subType = null) => {
    const sub = db[activeUser.username][currentSubIdx];
    const studentData = JSON.parse(JSON.stringify(sub.students[sIdx]));
    setGradingState({ studentIdx: sIdx, type, subType });
    setModalStudentData(studentData);
    setGradingModalOpen(true);
  };

  const handleModalQuestionChange = (qIdx, val) => {
    const newData = { ...modalStudentData };
    const numVal = Number(val);
    if (gradingState.type === 'ISA') newData.isa[gradingState.subType][qIdx] = numVal;
    else if (gradingState.type === 'SEM') newData.semMarks[qIdx] = numVal;
    else if (gradingState.type === 'PRACTICAL') newData.practicalMarks = numVal;
    setModalStudentData(newData);
  };

  const addNewQuestion = () => {
    const newData = { ...modalStudentData };
    if (gradingState.type === 'ISA') {
        newData.isa[gradingState.subType].push(0);
    } else if (gradingState.type === 'SEM') {
        newData.semMarks.push(0);
    }
    setModalStudentData(newData);
  };

  const saveModalData = async () => {
    const sub = db[activeUser.username][currentSubIdx];
    
    let currentTotal = 0;
    let maxAllowed = 0;

    if (gradingState.type === 'ISA') {
        currentTotal = sumArr(modalStudentData.isa[gradingState.subType]);
        maxAllowed = sub.isaMax;
    } else if (gradingState.type === 'SEM') {
        currentTotal = sumArr(modalStudentData.semMarks);
        maxAllowed = sub.semMax;
    } else if (gradingState.type === 'PRACTICAL') {
        currentTotal = Number(modalStudentData.practicalMarks);
        maxAllowed = sub.practicalMax;
    }

    if (currentTotal > maxAllowed) {
        return alert(`Validation Error: Total entered marks (${currentTotal}) exceed the maximum allowed limit (${maxAllowed}) for this component.`);
    }

    const newDb = { ...db };
    newDb[activeUser.username][currentSubIdx].students[gradingState.studentIdx] = modalStudentData;
    setDb(newDb);
    await syncGradebookToBackend(newDb[activeUser.username][currentSubIdx]);
    setGradingModalOpen(false);
  };

  if (loading) return <div className="loader">Initializing...</div>;

  if (view === 'login') {
    return (
      <div className="login-wrapper">
        <div className="login-card" style={{borderRadius: '32px'}}>
          <div className="logo">Uni<span>Desk</span></div>
          <h3 style={{fontSize: '1.2rem', margin: '10px 0'}}>Faculty Workspace</h3>
          <form onSubmit={handleWorkspaceValidation}>
            <input name="workspaceUser" type="text" className="form-input" placeholder="Enter Username" required style={{textAlign:'center', marginBottom:'15px'}} />
            {loginError && <div className="error-msg" style={{color:'red', fontSize:'0.8rem', marginBottom:'10px'}}>{loginError}</div>}
            <button type="submit" className="btn btn-primary" style={{width:'100%'}}>Login</button>
          </form>
        </div>
      </div>
    );
  }

  const userGradebooks = db[activeUser.username] || [];
  const currentSubject = currentSubIdx !== null ? userGradebooks[currentSubIdx] : null;

  return (
    <div className="faculty-container" style={{ padding: '40px' }}>
      
      {/* HEADER */}
      <div className="section-header" style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
           <div className="logo" style={{fontSize:'24px'}}>Uni<span>Desk</span></div>
           <p style={{color: '#64748b', margin: 0}}>Faculty: <strong>{activeUser.name}</strong></p>
        </div>
        <button className="btn btn-ghost" onClick={() => window.location.reload()}>Sign Out</button>
      </div>

      {/* DASHBOARD */}
      {view === 'dashboard' && (
        <div className="faculty-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          <div className="card-add" onClick={() => setSubjectModalOpen(true)} style={{ border: '2px dashed #cbd5e1', borderRadius: '24px', minHeight: '180px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <span style={{ fontSize: '40px', color: '#94a3b8' }}>+</span>
            <span style={{ color: '#64748b', fontWeight: '600' }}>Setup Gradebook</span>
          </div>

          {userGradebooks.map((sub, idx) => (
            <div key={idx} className="subject-card" onClick={() => { setCurrentSubIdx(idx); setView('grading'); }}
                 style={{ background: '#fff', borderRadius: '24px', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', cursor: 'pointer', position: 'relative' }}>
              
              <button onClick={(e) => deleteGradebook(e, idx)} style={{position:'absolute', top:'20px', right:'20px', background:'none', border:'none', color:'#ef4444', cursor:'pointer', fontSize:'1.2rem'}}>×</button>

              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'15px', paddingRight:'20px' }}>
                <div style={{ width: '40px', height: '40px', background: 'var(--primary)', borderRadius: '10px', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                  {sub.name.substring(0,2).toUpperCase()}
                </div>
                <div style={{display:'flex', gap:'5px'}}>
                    <span className="badge" style={{background: '#e0f2fe', color: '#0369a1', padding: '4px 10px', borderRadius: '8px', fontSize: '0.7rem', fontWeight:'bold'}}>Sem {sub.semester}</span>
                    <span className="badge" style={{background: '#f1f5f9', padding: '4px 10px', borderRadius: '8px', fontSize: '0.7rem', fontWeight:'bold'}}>{sub.academicYear}</span>
                </div>
              </div>
              <h3 style={{margin: '0 0 5px 0', fontSize:'1.1rem'}}>{sub.name}</h3>
              <p style={{fontSize: '0.8rem', color: '#64748b', margin: '0 0 10px 0'}}>Batch ID: {sub.batchId}</p>
              <div style={{borderTop:'1px solid #f1f5f9', paddingTop:'10px', fontSize:'0.8rem', color:'#94a3b8'}}>
                {sub.students.length} Students enrolled
              </div>
            </div>
          ))}
        </div>
      )}

      {/* GRADING VIEW */}
      {view === 'grading' && currentSubject && (
        <div className="grading-session">
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'25px'}}>
            <button className="btn btn-ghost" onClick={() => setView('dashboard')}>← Back to Dashboard</button>
            <div style={{textAlign:'center'}}>
              <h2 style={{margin: 0, color: '#1e293b'}}>{currentSubject.name}</h2>
              <p style={{margin:0, color:'#64748b', fontSize:'0.9rem', fontWeight:'500'}}>Grade Management System</p>
            </div>
            <div style={{display:'flex', gap:'10px'}}>
                <button className="btn btn-primary" style={{fontSize:'0.8rem', background: '#10b981'}} onClick={handleBulkSyncToServer}>Sync to Server</button>
                <button className="btn btn-primary" style={{fontSize:'0.8rem'}} onClick={() => window.print()}>Export PDF</button>
            </div>
          </div>

          <div className="table-container-modern" style={{ background: '#fff', borderRadius: '20px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
            <div style={{ maxHeight: '65vh', overflowY: 'auto' }}>
              <table className="grading-table-final">
                <thead style={{ position: 'sticky', top: 0, zIndex: 10, background: '#f8fafc' }}>
                  <tr>
                    <th>ENROLLMENT NO</th>
                    <th>STUDENT NAME</th>
                    {['ISA 1', 'ISA 2', 'ISA 3'].map(isa => <th key={isa} className="text-center">{isa} ({currentSubject.isaMax})</th>)}
                    <th className="text-center" style={{background: '#f1f5f9', color: 'var(--primary)'}}>BEST 2</th>
                    <th className="text-center">EXT ({currentSubject.semMax})</th>
                    {currentSubject.hasPractical && <th className="text-center">PRAC ({currentSubject.practicalMax})</th>}
                    <th className="text-center" style={{background: '#e2e8f0'}}>TOTAL</th>
                    <th className="text-center">GRADE</th>
                    <th className="text-center">RESULT</th>
                  </tr>
                </thead>
                <tbody>
                  {currentSubject.students.map((st, sIdx) => {
                    const best2 = getBestTwoISA(st);
                    const total = getFinalScore(st);
                    const maxPossible = (currentSubject.isaMax * 2) + currentSubject.semMax + (currentSubject.hasPractical ? currentSubject.practicalMax : 0);
                    const { grade, status } = getGradeAndStatus(total, maxPossible);

                    return (
                      <tr key={st.id}>
                        <td style={{fontWeight: '700', color: '#64748b'}}>{st.enrollmentNo}</td>
                        <td style={{fontWeight: '600'}}>{st.name}</td>
                        <td className="score-cell clickable" onClick={() => openGradingModal(sIdx, 'ISA', 'isa1')}>{sumArr(st.isa.isa1)}</td>
                        <td className="score-cell clickable" onClick={() => openGradingModal(sIdx, 'ISA', 'isa2')}>{sumArr(st.isa.isa2)}</td>
                        <td className="score-cell clickable" onClick={() => openGradingModal(sIdx, 'ISA', 'isa3')}>{sumArr(st.isa.isa3)}</td>
                        <td className="score-cell" style={{background: '#f8fafc', fontWeight: '800', color: 'var(--primary)'}}>{best2}</td>
                        <td className="score-cell clickable theory" onClick={() => openGradingModal(sIdx, 'SEM')}>{sumArr(st.semMarks)}</td>
                        {currentSubject.hasPractical && <td className="score-cell clickable practical" onClick={() => openGradingModal(sIdx, 'PRACTICAL')}>{st.practicalMarks}</td>}
                        <td className="score-cell" style={{background: '#f1f5f9', fontWeight: '900'}}>{total}</td>
                        <td className="text-center"><span className={`grade-chip grade-${grade}`}>{grade}</span></td>
                        <td className="text-center"><span className={`status-pill ${status.toLowerCase()}`}>{status}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MARKS ENTRY MODAL */}
      {gradingModalOpen && modalStudentData && (
        <div className="modal-overlay">
          <div className="modal" style={{borderRadius: '24px', maxWidth: '380px', padding: '25px'}}>
              <div style={{marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div>
                  <h4 style={{margin: 0, fontSize: '1.2rem'}}>{gradingState.type} Entry</h4>
                  <p style={{fontSize: '0.85rem', color: '#64748b'}}>Max: 
                      <strong> {gradingState.type === 'ISA' ? currentSubject.isaMax : gradingState.type === 'SEM' ? currentSubject.semMax : currentSubject.practicalMax}</strong>
                  </p>
                </div>
                {gradingState.type !== 'PRACTICAL' && (
                  <button onClick={addNewQuestion} className="btn btn-ghost" style={{padding: '5px 10px', fontSize: '0.7rem', color: 'var(--primary)', border: '1px solid var(--primary)'}}>
                    + Add Q
                  </button>
                )}
              </div>

              <div style={{maxHeight: '300px', overflowY: 'auto', paddingRight: '5px'}}>
                {gradingState.type !== 'PRACTICAL' ? (
                   (gradingState.type === 'ISA' ? modalStudentData.isa[gradingState.subType] : modalStudentData.semMarks).map((val, idx) => (
                     <div key={idx} style={{marginBottom:'12px', display:'flex', alignItems:'center', justifyContent:'space-between', background: '#f8fafc', padding: '10px', borderRadius: '12px'}}>
                        <span style={{fontWeight:'600'}}>Question {idx+1}</span>
                        <input type="number" className="form-input" style={{width:'85px', textAlign: 'center'}} value={val} onChange={(e) => handleModalQuestionChange(idx, e.target.value)} />
                     </div>
                   ))
                ) : (
                  <div style={{background: '#f8fafc', padding: '15px', borderRadius: '12px'}}>
                    <label style={{display:'block', marginBottom:'8px', fontWeight:'600'}}>Practical Marks</label>
                    <input type="number" className="form-input" value={modalStudentData.practicalMarks} onChange={(e) => handleModalQuestionChange(0, e.target.value)} />
                  </div>
                )}
              </div>
              <button className="btn btn-primary" style={{width:'100%', marginTop: '20px'}} onClick={saveModalData}>Save Marks</button>
              <button className="btn btn-ghost" style={{width:'100%', marginTop:'8px'}} onClick={() => setGradingModalOpen(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* SETUP MODAL */}
      {subjectModalOpen && (
        <div className="modal-overlay">
            <div className="modal" style={{borderRadius: '32px', maxWidth: '450px', padding: '30px'}}>
                <h3 style={{marginBottom: '20px'}}>Setup Gradebook</h3>
                
                <div className="form-group" style={{marginBottom: '15px'}}>
                  <label className="label-sm">SELECT SUBJECT</label>
                  <select className="form-input" value={newSubject.subjectId} onChange={(e) => setNewSubject({...newSubject, subjectId: e.target.value})}>
                      <option value="">-- Select --</option>
                      {activeUser.assignedSubjects.map(id => {
                        const s = subjectsList[id];
                        return <option key={id} value={id}>{s?.name} ({s?.batch_name || "Unknown"})</option>
                      })}
                  </select>
                </div>

                <div className="form-group" style={{marginBottom: '15px'}}>
                  <label className="label-sm">MAX MARKS PER ISA</label>
                  <input type="number" className="form-input" value={newSubject.isaMax} onChange={(e) => setNewSubject({...newSubject, isaMax: e.target.value})} />
                </div>

                <div className="form-group" style={{marginBottom: '15px'}}>
                  <label className="label-sm">EXTERNAL (SEM) MAX MARKS</label>
                  <input type="number" className="form-input" value={newSubject.semMax} onChange={(e) => setNewSubject({...newSubject, semMax: e.target.value})} />
                </div>

                <div className="form-group" style={{marginBottom: '15px'}}>
                  <label className="label-sm">ISA SELECTION</label>
                  <div style={{display:'flex', gap:'12px', marginTop:'5px'}}>
                    {['isa1', 'isa2', 'isa3'].map(isa => (
                      <label key={isa} style={{fontSize: '0.85rem', display:'flex', alignItems:'center', gap:'5px', cursor:'pointer'}}>
                        <input type="checkbox" checked={newSubject.selectedISAs.includes(isa)} 
                          onChange={(e) => {
                            const next = e.target.checked ? [...newSubject.selectedISAs, isa] : newSubject.selectedISAs.filter(i => i !== isa);
                            setNewSubject({...newSubject, selectedISAs: next});
                          }} 
                        /> {isa.toUpperCase()}
                      </label>
                    ))}
                  </div>
                </div>

                <div style={{background: '#f8fafc', padding: '15px', borderRadius: '16px', marginBottom: '20px', border:'1px solid #e2e8f0'}}>
                    <label style={{display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '600', cursor:'pointer'}}>
                      <input type="checkbox" checked={newSubject.hasPractical} onChange={(e) => setNewSubject({...newSubject, hasPractical: e.target.checked})} /> 
                      Has Practical Component?
                    </label>
                    {newSubject.hasPractical && (
                      <div style={{marginTop:'12px'}}>
                        <label className="label-sm">PRACTICAL MAX MARKS</label>
                        <input type="number" className="form-input" value={newSubject.practicalMax} onChange={(e) => setNewSubject({...newSubject, practicalMax: e.target.value})} />
                      </div>
                    )}
                </div>

                <button className="btn btn-primary" style={{width:'100%', padding:'14px'}} onClick={handleCreateSubject}>Create Gradebook</button>
                <button className="btn btn-ghost" style={{width:'100%', marginTop:'8px'}} onClick={() => setSubjectModalOpen(false)}>Cancel</button>
            </div>
        </div>  
      )}
    </div>
  );
};

export default FacultyPortal;