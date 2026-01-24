import React, { useState, useRef, useEffect } from 'react';
import useLocalStorageSync from './useLocalStorageSync';
import { useNavigate } from 'react-router-dom';

const StudentPortal = () => {
  const navigate = useNavigate();
  const targetStudentName = "Student A";

  // Data Keys
  const MARKS_KEY = 'unidesk_v10_practical';
  const PROFILE_KEY = 'unidesk_student_profile';
  const DOC_KEY = 'unidesk_student_documents';
  const SGPA_HISTORY_KEY = 'unidesk_student_sgpa_history';

  // State Management
  const [marksDB] = useLocalStorageSync(MARKS_KEY, {});
  const [profile, setProfile] = useLocalStorageSync(PROFILE_KEY, {
    fullName: "Student A",
    prNumber: "202302121",
    rollNumber: "BCA-23-012",
    aadhaar: "XXXX-XXXX-1234",
    dept: "BCA – Bachelor of Computer Applications",
    year: "2023",
    semester: "Semester I"
  });
  const [documents, setDocuments] = useLocalStorageSync(DOC_KEY, {});
  const [sgpaHistory, setSgpaHistory] = useLocalStorageSync(SGPA_HISTORY_KEY, {});

  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef(null);

  // --- Calculations ---
  const calculateGrade = (score) => {
    if (score >= 90) return 'O'; if (score >= 80) return 'A+'; if (score >= 70) return 'A';
    if (score >= 60) return 'B+'; if (score >= 50) return 'B'; if (score >= 40) return 'P';
    return 'F';
  };

  const getGradePoint = (score) => {
    if (score >= 90) return 10; if (score >= 80) return 9; if (score >= 70) return 8;
    if (score >= 60) return 7; if (score >= 50) return 6; if (score >= 40) return 5;
    return 0;
  };

  // Derive Table Data
  let grandTotal = 0;
  let subjectsCount = 0;
  let totalGradePoints = 0;
  let totalCredits = 0;

  const tableRows = [];

  Object.values(marksDB).forEach((subjects) => {
    subjects.forEach((sub, idx) => {
      const student = sub.students.find(s => s.name === targetStudentName);
      if (student) {
        const sum = arr => arr.reduce((a, b) => a + Number(b), 0);
        const isa1 = sum(student.isa.isa1);
        const isa2 = sum(student.isa.isa2);
        const isa3 = sum(student.isa.isa3);
        const semScore = sum(student.semMarks);
        const practScore = student.practicalMarks || 0;

        // Note: In real app logic from faculty.html, we filtered based on selectedISAs,
        // but student view in index.html just summed them all. Keeping faithful to index.html logic:
        const theoryScore = isa1 + isa2 + isa3 + semScore;
        const totalScore = theoryScore + practScore;
        const grade = calculateGrade(totalScore);
        const gradePoint = getGradePoint(totalScore);
        
        tableRows.push({
          code: `SUB-0${idx + 1}`,
          name: sub.name,
          theoryMax: sub.theoryMax || sub.semMax || '--',
          theoryScore,
          practMax: sub.practicalMax || '--',
          practScore,
          hasPractical: sub.hasPractical,
          totalScore,
          grade
        });

        grandTotal += totalScore;
        subjectsCount++;
        totalGradePoints += (gradePoint * 4);
        totalCredits += 4;
      }
    });
  });

  // Derived GPAs
  const currentSGPA = totalCredits > 0 ? (totalGradePoints / totalCredits) : 0;
  
  // Update History Side Effect
  useEffect(() => {
    if (totalCredits > 0) {
      const currentSem = profile.semester || 'Semester I';
      const history = { ...sgpaHistory };
      if (!history[targetStudentName]) history[targetStudentName] = {};
      
      // Only update if changed to avoid infinite loop
      if (history[targetStudentName][currentSem] !== currentSGPA) {
        history[targetStudentName][currentSem] = currentSGPA;
        setSgpaHistory(history);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSGPA, profile.semester, totalCredits]);

  // Calculate CGPA
  const studentHistory = sgpaHistory[targetStudentName] || {};
  const semesters = Object.values(studentHistory);
  const cgpa = semesters.length > 0 ? semesters.reduce((a, b) => a + b, 0) / semesters.length : 0;

  // --- Actions ---
  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.id]: e.target.value });
  };

  const saveProfile = () => {
    setIsSaving(true);
    // Profile is already synced via hook, just showing UI feedback
    setTimeout(() => setIsSaving(false), 1500);
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const pr = profile.prNumber?.trim();
    if (!pr) return;

    const newDocs = { ...documents };
    if (!newDocs[pr]) newDocs[pr] = [];

    files.forEach(file => {
      const formatSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024; const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
      };
      
      const ext = file.name.split('.').pop().toUpperCase();
      newDocs[pr].push({
        name: file.name,
        type: ext === 'JPEG' ? 'JPG' : ext,
        size: formatSize(file.size),
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        status: 'Pending'
      });
    });

    setDocuments(newDocs);
    fileInputRef.current.value = '';
  };

  const finalizeRecord = () => {
    const pr = profile.prNumber?.trim();
    if(!pr) return alert('Please enter a valid PR Number.');
    const newDocs = { ...documents };
    if (!newDocs[pr] || newDocs[pr].length === 0) return alert('Cannot finalize: No documents found.');
    
    newDocs[pr] = newDocs[pr].map(d => ({ ...d, status: 'Approved' }));
    setDocuments(newDocs);
    alert('Record finalized successfully');
  };

  const studentDocs = documents[profile.prNumber] || [];

  return (
    <>
      <nav className="navbar">
        <div className="logo">Uni<span>Desk</span></div>
        <div className="nav-right">
          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>Help</span>
          <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Admin" className="admin-avatar" />
        </div>
      </nav>

      <div className="container">
        <header className="page-header">
          <div className="page-title-group">
            <div className="back-btn"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg></div>
            <div className="student-photo-container">
              <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Student" className="student-photo" />
            </div>
            <div className="page-title">
              <h1>{profile.fullName || 'Student'}</h1>
              <p>Manage academic records and personal details.</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn btn-ghost" onClick={() => window.open('/faculty', '_blank')}>Edit Marks</button>
            <button className="btn btn-ghost" onClick={() => window.location.reload()}>Discard Changes</button>
            <button 
              className="btn btn-primary" 
              onClick={saveProfile}
              style={{ backgroundColor: isSaving ? '#10b981' : undefined }}
            >
              {isSaving ? 'Saved ✓' : 'Save Profile'}
            </button>
          </div>
        </header>

        <section className="card">
          <div className="section-header">
            <div className="section-title">
              <div className="section-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg></div>
              Personal Information
            </div>
          </div>
          <div className="form-grid">
            <div className="form-group full-width">
              <label>Full Name</label>
              <input type="text" className="form-input" id="fullName" value={profile.fullName} onChange={handleProfileChange} />
            </div>
            <div className="form-group">
              <label>PR Number</label>
              <input type="text" className="form-input" id="prNumber" value={profile.prNumber} onChange={handleProfileChange} />
            </div>
            <div className="form-group">
              <label>Roll Number</label>
              <input type="text" className="form-input" id="rollNumber" value={profile.rollNumber} onChange={handleProfileChange} />
            </div>
            <div className="form-group">
              <label>Aadhaar Number</label>
              <input type="text" className="form-input" id="aadhaar" value={profile.aadhaar} onChange={handleProfileChange} />
            </div>
            <div className="form-group">
              <label>Department / Course</label>
              <select className="form-input" id="dept" value={profile.dept} onChange={handleProfileChange}>
                <option>BCA – Bachelor of Computer Applications</option>
                <option>B.Com – Bachelor of Commerce</option>
                <option>M.Com – Master of Commerce</option>
              </select>
            </div>
            <div className="form-group">
              <label>Admission Year</label>
              <input type="text" className="form-input" id="year" value={profile.year} onChange={handleProfileChange} />
            </div>
            <div className="form-group">
              <label>Current Semester</label>
              <select className="form-input" id="semester" value={profile.semester} onChange={handleProfileChange}>
                {['Semester I','Semester II','Semester III','Semester IV','Semester V','Semester VI','Semester VII','Semester VIII'].map(s => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <section className="card">
          <div className="section-header">
            <div className="section-title">
              <div className="section-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg></div>
              Academic Record
            </div>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>Code</th><th>Subject Name</th><th>Theory (Max/Scored)</th><th>Pract (Max/Scored)</th><th>Total</th><th>Grade</th></tr>
              </thead>
              <tbody>
                {tableRows.length === 0 ? (
                  <tr><td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No records found for this student.</td></tr>
                ) : (
                  tableRows.map((row, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>{row.code}</td>
                      <td style={{ fontWeight: 500 }}>{row.name}</td>
                      <td dangerouslySetInnerHTML={{ __html: `${row.theoryMax} / <b>${row.theoryScore}</b>` }}></td>
                      <td>
                        {row.hasPractical 
                          ? <span dangerouslySetInnerHTML={{ __html: `${row.practMax} / <b>${row.practScore}</b>` }} /> 
                          : <span style={{ color: '#ccc' }}>--</span>}
                      </td>
                      <td style={{ fontWeight: 700, color: 'var(--primary)' }}>{row.totalScore}</td>
                      <td><span className={`grade-badge ${row.grade === 'F' ? 'grade-red' : 'grade-green'}`}>{row.grade}</span></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="gpa-container">
            <div className="gpa-stat">
              <span className="gpa-label">Total Score</span>
              <span className="gpa-value">{grandTotal}</span>
            </div>
            <div className="gpa-stat">
              <span className="gpa-label">SGPA</span>
              <span className="gpa-value">{currentSGPA.toFixed(2)}</span>
            </div>
            <div className="gpa-stat">
              <span className="gpa-label">CGPA</span>
              <span className="gpa-value">{cgpa.toFixed(2)}</span>
            </div>
          </div>
        </section>

        <section className="card">
          <div className="section-header">
            <div className="section-title">
              <div className="section-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg></div>
              Documents
            </div>
            <button className="btn btn-ghost" onClick={() => fileInputRef.current.click()} style={{ fontSize: '0.8rem', padding: '8px 16px' }}>Batch Upload</button>
          </div>
          <div className="doc-grid">
            <div className="upload-area" onClick={() => fileInputRef.current.click()}>
              <input type="file" multiple accept=".pdf, .jpg, .jpeg, .png" style={{ display: 'none' }} ref={fileInputRef} onChange={handleFileUpload} />
              <div className="upload-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
              </div>
              <div style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '4px' }}>Click to Upload</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>or drag and drop files here</div>
            </div>
            <div className="doc-list">
              {studentDocs.map((doc, idx) => (
                <div className="file-card" key={idx}>
                  <div className="file-info">
                    <div className={`file-type ${['JPG','JPEG','PNG'].includes(doc.type) ? 'type-img' : 'type-pdf'}`}>{doc.type}</div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{doc.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{doc.size} • {doc.date}</div>
                    </div>
                  </div>
                  <span className={`status-pill ${doc.status === 'Approved' ? 'status-ok' : 'status-wait'}`}>{doc.status}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
          <button className="btn btn-ghost">Cancel</button>
          <button className="btn btn-primary" onClick={finalizeRecord}>Finalize Record</button>
        </div>
      </div>
    </>
  );
};

export default StudentPortal;