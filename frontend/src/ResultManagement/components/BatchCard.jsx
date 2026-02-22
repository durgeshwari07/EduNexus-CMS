import React from 'react';

const BatchCard = ({ batch, onRegularClick, onSupplementaryClick }) => {
  const isBBA = batch.courseCode === 'BBA';
  const badgeStyle = {
    background: isBBA ? '#fef3c7' : '#e0e7ff',
    color: isBBA ? '#92400e' : '#3730a3'
  };

  return (
    <div className="batch-card">
      <div className="card-top">
        <span className="course-badge" style={badgeStyle}>
          {batch.courseCode}
        </span>
        <span className="status-dot-active" title="Active Batch"></span>
      </div>
      
      <h2>{batch.batchYear}</h2>
      <p>{batch.courseName}</p>
      
      <div className="card-stats">
        <div className="stat">
          <span className="stat-val">{batch.totalStudents}</span>
          <span className="stat-lbl">Students</span>
        </div>
        <div className="stat">
          <span className="stat-val">{batch.latestExam}</span>
          <span className="stat-lbl">Latest Exam</span>
        </div>
      </div>
      
      <div className="card-actions">
        <button className="btn-half btn-main" onClick={() => onRegularClick(batch.id)}>Regular Results</button>
        <button className="btn-half btn-supp" onClick={() => onSupplementaryClick(batch.id)}>Supplementary</button>
      </div>
    </div>
  );
};

export default BatchCard;