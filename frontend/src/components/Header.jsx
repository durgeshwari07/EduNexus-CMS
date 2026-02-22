import React from 'react';
import { Building2 } from 'lucide-react';

/**
 * Header Component - Text-Only Identity
 * Displays the logged-in user's name and role directly as text.
 */
export default function Header({ userRole, currentUser }) {
  // Pulls the institution name from the synced database record
  const institutionName = currentUser?.collegeName || "GVMS GGPR";

  return (
    <header className="h-16 flex items-center justify-between px-8 bg-white border-b border-slate-200 shrink-0 shadow-sm">
      
      {/* 1. LEFT SIDE: INSTITUTION IDENTITY */}
      <div className="flex items-center gap-3 text-[#136dec]">
        <div className="p-2 bg-blue-50 rounded-xl border border-blue-100 shadow-sm">
          <Building2 size={20} />
        </div>
        <div className="flex flex-col">
           <h1 className="text-[15px] font-black uppercase tracking-[0.15em] text-slate-800 leading-none mb-1">
             {institutionName}
           </h1>
           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
             UNIDESK GATEWAY
           </span>
        </div>
      </div>

      {/* 2. RIGHT SIDE: DIRECT TEXT LABELS (No Avatar Box) */}
      <div className="flex items-center pl-6 border-l border-slate-100">
        <div className="text-right">
          {/* USER NAME: Pulled from MySQL 'name' column */}
          <p className="text-sm font-black text-slate-900 uppercase tracking-tight leading-none mb-1.5">
            {currentUser?.name || (userRole === 'admin' ? 'Admin User' : 'Faculty Teacher')}
          </p>
          
          {/* ROLE DESCRIPTION: Clean text sub-label */}
          <p className="text-[10px] font-bold text-[#136dec] uppercase tracking-[0.2em] opacity-90">
            {userRole === 'admin' ? 'System Administrator' : 'Academic Faculty Member'}
          </p>
        </div>
      </div>
    </header>
  );
}