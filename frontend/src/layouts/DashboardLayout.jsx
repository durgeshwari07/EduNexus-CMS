import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

export default function DashboardLayout({ 
  children, 
  userRole, 
  currentUser, 
  currentPage, 
  setCurrentPage, 
  onLogout 
}) {
  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans overflow-hidden">
      
      {/* 1. SIDEBAR: Handles navigation state */}
      <Sidebar 
        userRole={userRole} 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
        onLogout={onLogout} 
      />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* 2. HEADER: Ensure currentUser is passed properly */}
        {/* We pass currentUser ?? {} to prevent undefined errors in child components */}
        <Header 
          userRole={userRole} 
          currentUser={currentUser ?? {}} 
          onLogout={onLogout} 
        />
        
        {/* 3. MAIN CONTENT: Scrollable area with smooth transition */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar bg-[#f8fafc]/50">
          <div className="max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500">
            {children}
          </div>
        </main>
      </div>

      {/* Modern thin scrollbar styling */}
      <style jsx="true">{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  );
}