import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

export default function DashboardLayout({ children, userRole, currentPage, setCurrentPage, onLogout }) {
  return (
    <div className="flex h-screen bg-[#f6f7f8] font-['Lexend'] overflow-hidden">
      {/* Sidebar gets the navigation props */}
      <Sidebar 
        userRole={userRole} 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
        onLogout={onLogout} 
      />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header stays at the top */}
        <Header userRole={userRole} />
        
        {/* Main content area where Overview, Departments, etc. appear */}
        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}