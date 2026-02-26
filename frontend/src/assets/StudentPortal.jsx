


import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './StudentPortal.css';

const API_URL = 'http://localhost:5000/api';

const StudentPortal = ({ id: propId, isPreview = false }) => {
  const navigate = useNavigate();
  const { id: routeId } = useParams();
  const studentId = propId || routeId;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/student-profile/${studentId}`);
        setData(res.data);
      } catch (err) {
        console.error("Error fetching student data:", err);
        setError("Could not load student records. Ensure the backend is running.");
      } finally {
        setLoading(false);
      }
    };
    if (studentId) fetchStudentData();
  }, [studentId]);

  const getGradePoints = (grade) => {
    const pointsMap = { 'O': 10, 'A+': 9, 'A': 8, 'B+': 7, 'B': 6, 'C': 5, 'P': 4, 'F': 0 };
    return pointsMap[grade] || 0;
  };

  const calculateGrade = (score) => {
    if (score >= 90) return 'O'; if (score >= 80) return 'A+'; if (score >= 70) return 'A';
    if (score >= 60) return 'B+'; if (score >= 50) return 'B'; if (score >= 40) return 'P';
    return 'F';
  };

  if (loading) return <div className="p-10 text-center">Loading Student Records...</div>;
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;
  if (!data) return <div className="p-10 text-center">No student found.</div>;

  const { profile, marks = [], documents = [], sgpaHistory = [] } = data;

  const liveSGPA = marks.length > 0 
    ? (marks.reduce((sum, m) => sum + getGradePoints(m.grade || calculateGrade(m.total)), 0) / marks.length).toFixed(2)
    : "0.00";

  const allSGPAs = [...sgpaHistory.map(h => Number(h.sgpa)), Number(liveSGPA)].filter(val => val > 0);
  const liveCGPA = allSGPAs.length > 0 
    ? (allSGPAs.reduce((a, b) => a + b, 0) / allSGPAs.length).toFixed(2)
    : "0.00";

  return (
    <div className={`portal-root ${isPreview ? 'is-preview' : ''}`}>
      {!isPreview && (
        <nav className="navbar">
          <div className="logo">Uni<span>Desk</span></div>
          <div className="nav-right">
            <span className="nav-link">Help</span>
            <img src={`https://ui-avatars.com/api/?name=${profile.name}`} alt="User" className="admin-avatar" />
          </div>
        </nav>
      )}

      <div className="container">
        <header className="page-header">
          <div className="page-title-group">
            {!isPreview && (
              <div className="back-btn" onClick={() => navigate(-1)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              </div>
            )}
            <div className="student-photo-container">
              <img src={`https://ui-avatars.com/api/?name=${profile.name}&background=random`} alt="Student" className="student-photo" />
            </div>
            <div className="page-title">
              <h1>{profile.name}</h1>
              <p>PRN: {profile.prNo} | {profile.dept || 'Department'}</p>
            </div>
          </div>
        </header>

        {/* --- PERSONAL INFORMATION SECTION --- */}
        <section className="card">
          <div className="section-header">
            <div className="section-title">Personal Information</div>
          </div>
          <div className="form-grid">
            <div className="form-group full-width">
              <label>Full Name</label>
              <input type="text" className="form-input" value={profile.name || ''} readOnly />
            </div>
            
            <div className="form-group">
              <label>Enrollment Number</label>
              <input type="text" className="form-input" value={profile.enrollmentNo || 'N/A'} readOnly />
            </div>

            <div className="form-group">
              <label>PR Number (Permanent Registration)</label>
              <input type="text" className="form-input" value={profile.prNo || 'N/A'} readOnly />
            </div>

            <div className="form-group">
              <label>Email ID</label>
              <input type="text" className="form-input" value={profile.email || 'N/A'} readOnly />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input type="text" className="form-input" value={profile.phone || 'N/A'} readOnly />
            </div>

            <div className="form-group">
              <label>Date of Birth</label>
              <input type="text" className="form-input" value={profile.dob || '--/--/----'} readOnly />
            </div>

            <div className="form-group">
              <label>Academic Year</label>
              <input type="text" className="form-input" value={profile.academicYear || 'N/A'} readOnly />
            </div>

            <div className="form-group">
              <label>Semester</label>
              <input type="text" className="form-input" value={profile.semester || 'N/A'} readOnly />
            </div>

            <div className="form-group">
              <label>Division / Section</label>
              <input type="text" className="form-input" value={profile.division || 'N/A'} readOnly />
            </div>
          </div>
        </section>

        {/* Academic Record */}
        <section className="card">
          <div className="section-header">
            <div className="section-title">Academic Record</div>
          </div>
          <div className="table-wrapper">
            <table className="full-width-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Subject Name</th>
                  <th>ISA</th>
                  <th>Theory</th>
                  <th>Practical</th>
                  <th>Total</th>
                  <th>Grade</th>
                </tr>
              </thead>
              <tbody>
                {marks.length === 0 ? (
                  <tr><td colSpan="7" className="empty-table-msg">No marks found.</td></tr>
                ) : (
                  marks.map((m, i) => (
                    <tr key={i}>
                      <td className="code-cell">{m.subjectCode}</td>
                      <td className="subject-cell">{m.subjectName}</td>
                      <td className="score-cell"><b>{m.isaScore}</b></td>
                      <td className="score-cell">{m.theoryScore}</td>
                      <td className="score-cell">{m.practScore || '--'}</td>
                      <td className="total-cell">{m.total}</td>
                      <td className="grade-cell">
                        <span className={`grade-badge ${m.grade === 'F' ? 'grade-red' : 'grade-green'}`}>
                          {m.grade || calculateGrade(m.total)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="gpa-container">
            <div className="gpa-stat">
              <span className="gpa-label">Current SGPA</span>
              <span className="gpa-value">{liveSGPA}</span>
            </div>
            <div className="gpa-stat">
              <span className="gpa-label">Cumulative CGPA</span>
              <span className="gpa-value">{liveCGPA}</span>
            </div>
          </div>
        </section>

        {/* Documents */}
        <section className="card">
          <div className="section-header">
            <div className="section-title">Verified Documents</div>
          </div>
          <div className="doc-list">
            {documents.length === 0 ? (
              <div className="empty-docs">No documents found.</div>
            ) : (
              documents.map((doc, idx) => (
                <div className="file-card" key={idx}>
                  <div className="file-info">
                    <div className="file-type type-pdf">{doc.type || 'PDF'}</div>
                    <div>
                      <div className="file-name">{doc.name}</div>
                      <div className="file-meta">{doc.uploadDate}</div>
                    </div>
                  </div>
                  <span className={`status-pill ${doc.status === 'Approved' ? 'status-ok' : 'status-wait'}`}>
                    {doc.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default StudentPortal;