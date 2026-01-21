import React from 'react';
import { Search, Bell, Mail } from 'lucide-react';

export default function Header({ userRole }) {
  return (
    <header className="h-16 flex items-center justify-between px-8 bg-white border-b border-slate-200 shrink-0">
      <div className="max-w-md w-full relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-[#136dec]/30" placeholder="Search data..." />
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
        </button>
        <div className="flex items-center gap-3 pl-4 border-l">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-slate-900">{userRole === 'admin' ? 'Admin User' : 'Teacher'}</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest">{userRole}</p>
          </div>
          <div className="h-9 w-9 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-[#136dec] font-bold">
            {userRole === 'admin' ? 'A' : 'T'}
          </div>
        </div>
      </div>
    </header>
  );
}