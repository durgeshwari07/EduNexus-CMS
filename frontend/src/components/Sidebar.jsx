import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Building2, Users, GraduationCap, 
  FileText, BarChart3, Settings, LogOut, ExternalLink, BookOpen,
  LayoutGrid 
} from 'lucide-react';

export default function Sidebar({ userRole, currentUser, currentPage, setCurrentPage, onLogout }) {
  const isAdmin = userRole === 'admin';

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, adminOnly: false },
    { id: 'departments', label: 'Departments', icon: Building2, adminOnly: false },
    { id: 'teachers', label: 'Teachers', icon: Users, adminOnly: false },
    { id: 'subjects', label: 'Subjects', icon: FileText, adminOnly: false },
    { id: 'students', label: 'Students', icon: GraduationCap, adminOnly: false },
    // { id: 'documents', label: 'Documents', icon: FileText, adminOnly: false },
    { id: 'reports', label: 'Reports', icon: BarChart3, adminOnly: true },
    { id: 'result-ledger', label: 'Master Result Ledger', icon: LayoutGrid, adminOnly: false },
  ];

  return (
    // Changed h-full to h-screen and added sticky top-0
    <aside className="w-64 border-r border-slate-200 bg-white flex flex-col h-screen sticky top-0 shrink-0 overflow-hidden">
      
      {/* TOP SECTION: PROFILE & NAV */}
      <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
        <div className="flex items-center gap-3 mb-8">
          <div className="size-10 rounded-full bg-[#136dec] flex items-center justify-center text-white font-bold uppercase shrink-0">
            {currentUser?.name?.charAt(0) || (isAdmin ? 'A' : 'T')}
          </div>
          <div className="min-w-0">
            <h1 className="text-sm font-bold leading-tight truncate">
              {currentUser?.name || (isAdmin ? 'Admin User' : 'Teacher')}
            </h1>
            <p className="text-slate-500 text-xs font-normal capitalize">
              {userRole === 'admin' ? 'System Administrator' : 'Faculty Member'}
            </p>
          </div>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            if (item.adminOnly && !isAdmin) return null;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  currentPage === item.id 
                    ? 'bg-[#136dec]/10 text-[#136dec] font-semibold' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon size={18} />
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
      
      {/* BOTTOM ACTION SECTION: LOGOUT & SETTINGS */}
      <div className="p-6 border-t border-slate-100 bg-white">
        <div className="mb-4 space-y-1">
           {userRole === 'teacher' ? (
             <button 
                onClick={() => setCurrentPage('faculty-portal')} 
                className={`flex items-center gap-3 px-3 py-2 w-full text-sm font-medium rounded-lg transition-all ${
                  currentPage === 'faculty-portal' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-blue-600 bg-blue-50 hover:bg-blue-100'
                }`}
             >
                <BookOpen size={18}/> My Workspace
             </button>
           ) : (
             <button 
                onClick={() => setCurrentPage('faculty-view')} 
                className={`flex items-center gap-3 px-3 py-2 w-full text-sm font-medium rounded-lg transition-all ${
                  currentPage === 'faculty-view' 
                    ? 'bg-slate-800 text-white shadow-md' 
                    : 'text-slate-500 hover:text-blue-600 hover:bg-blue-50'
                }`}
             >
                <ExternalLink size={18}/> Faculty Portal View
             </button>
           )}
        </div>

        <div className="bg-emerald-50 text-emerald-600 px-3 py-2 rounded-lg text-[10px] font-bold uppercase mb-4 flex items-center gap-2">
          <span className="size-2 bg-emerald-500 rounded-full animate-pulse"></span> 
          SYSTEM ONLINE
        </div>
        
        <button className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:text-[#136dec] w-full text-sm font-medium">
          <Settings size={18}/> Settings
        </button>
        
        <button onClick={onLogout} className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:text-red-500 w-full text-sm font-medium group">
          <LogOut size={18} className="group-hover:translate-x-1 transition-transform" /> 
          Logout
        </button>
      </div>
    </aside>
  );
}