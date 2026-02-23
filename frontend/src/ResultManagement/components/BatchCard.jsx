// import React from 'react';

// const BatchCard = ({ batch, onRegularClick, onSupplementaryClick }) => {
//   const isBBA = batch.courseCode === 'BBA';
//   const badgeStyle = {
//     background: isBBA ? '#fef3c7' : '#e0e7ff',
//     color: isBBA ? '#92400e' : '#3730a3'
//   };

//   return (
//     <div className="batch-card">
//       <div className="card-top">
//         <span className="course-badge" style={badgeStyle}>
//           {batch.courseCode}
//         </span>
//         <span className="status-dot-active" title="Active Batch"></span>
//       </div>
      
//       <h2>{batch.batchYear}</h2>
//       <p>{batch.courseName}</p>
      
//       <div className="card-stats">
//         <div className="stat">
//           <span className="stat-val">{batch.totalStudents}</span>
//           <span className="stat-lbl">Students</span>
//         </div>
//         <div className="stat">
//           <span className="stat-val">{batch.latestExam}</span>
//           <span className="stat-lbl">Latest Exam</span>
//         </div>
//       </div>
      
//       <div className="card-actions">
//         <button className="btn-half btn-main" onClick={() => onRegularClick(batch.id)}>Regular Results</button>
//         <button className="btn-half btn-supp" onClick={() => onSupplementaryClick(batch.id)}>Supplementary</button>
//       </div>
//     </div>
//   );
// };

// export default BatchCard;




import React from 'react';

const BatchCard = ({ batch, students = [], onRegularClick, onSupplementaryClick }) => {
  // --- LOGIC FROM STUDENTBATCHCARD ---
  // 1. Calculate stats from the central students array
  const batchStudents = students.filter(s => String(s.batchId) === String(batch.id));
  const totalStudents = batchStudents.length;
  
  // 2. Determine Course Branding (BBA vs Others)
  const courseCode = batch.dept || batch.courseCode || "N/A";
  const isBBA = courseCode === 'BBA';
  
  const badgeStyle = {
    background: isBBA ? '#fef3c7' : '#e0e7ff',
    color: isBBA ? '#92400e' : '#3730a3'
  };

  // 3. Status logic (Matches StudentBatchCard's "Completed" check)
  const currentSem = batch.semester || batch.sem || 1;
  const totalSem = parseInt(batch.batch?.includes('2024-2027') ? 6 : 8);
  const isCompleted = currentSem >= totalSem;

  return (
    <div className="batch-card">
      <div className="card-top">
        <span className="course-badge" style={badgeStyle}>
          {courseCode}
        </span>
        {/* Status dot changes color based on completion logic */}
        <span 
          className={isCompleted ? "status-dot-inactive" : "status-dot-active"} 
          title={isCompleted ? "Batch Completed" : "Active Batch"}
        ></span>
      </div>
      
      {/* Dynamic Data Mapping */}
      <h2>{batch.batch || batch.batchYear}</h2>
      <p>{batch.courseName || `Department of ${batch.dept}`}</p>
      
      <div className="card-stats">
        <div className="stat">
          <span className="stat-val">{totalStudents}</span>
          <span className="stat-lbl">Students</span>
        </div>
        <div className="stat">
          {/* Shows the actual semester stage from the batch data */}
          <span className="stat-val">Sem {currentSem}</span>
          <span className="stat-lbl">Current Stage</span>
        </div>
      </div>
      
      <div className="card-actions">
        {/* These trigger the navigation to MasterView via GatewayView */}
        <button 
          className="btn-half btn-main" 
          onClick={() => onRegularClick(batch.id)}
        >
          Regular Results
        </button>
        <button 
          className="btn-half btn-supp" 
          onClick={() => onSupplementaryClick(batch.id)}
        >
          Supplementary
        </button>
      </div>
    </div>
  );
};

export default BatchCard;