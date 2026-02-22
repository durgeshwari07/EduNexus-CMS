import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar'; 
import BatchCard from './components/BatchCard';
import mockBatches from './data/mockBatches.json';
// CRITICAL: This line restores your beautiful design!
import './styles/results.css'; 

const GatewayView = ({ userRole, currentUser, setCurrentPage, onLogout }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All Departments');

  const filteredBatches = mockBatches.filter(batch => {
    const matchesSearch = batch.batchYear.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === 'All Departments' || batch.courseCode === selectedDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="app-layout w-full">
      <Sidebar 
        isHidden={false} 
        userRole={userRole} 
        currentUser={currentUser} 
        currentPage="result-ledger" 
        setCurrentPage={setCurrentPage} 
        onLogout={onLogout} 
      />
      <main className="main-content">
        <div className="container">
          
          <div className="header-section">
            <div className="page-title">
              <h1>Result Management</h1>
              <p>Select an active batch to view Master Registers and Supplementary Ledgers.</p>
            </div>
          </div>

          <div className="filter-bar toolbar" style={{ marginBottom: '24px', borderRadius: '8px' }}>
            <div className="toolbar-left">
              <input 
                type="text" 
                className="search-input" 
                placeholder="Search by batch year (e.g., 2023)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select 
                className="select-filter"
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
              >
                <option>All Departments</option>
                <option>BCA</option>
                <option>BBA</option>
                <option>B.Sc. IT</option>
              </select>
            </div>
          </div>

          {filteredBatches.length === 0 ? (
            <div className="no-data-container">
              <h3>No batches found</h3>
              <p>Try adjusting your search or department filter.</p>
            </div>
          ) : (
            <div className="batch-grid">
              {filteredBatches.map(batch => (
                <BatchCard 
                  key={batch.id} 
                  batch={batch} 
                  onRegularClick={(id) => navigate(`/results/master/${id}?tab=regular`)}
                  onSupplementaryClick={(id) => navigate(`/results/master/${id}?tab=supplementary`)}
                />
              ))}
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default GatewayView;