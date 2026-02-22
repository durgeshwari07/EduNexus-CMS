import React from 'react';
import { 
  Terminal, Settings, Beaker, Briefcase, 
  Edit2, Trash2, User, MoreVertical 
} from 'lucide-react';

export default function DepartmentCard({ dept, isAdmin, onDelete }) {
  // 1. Precise Theme Mapping for unique colors
  const themes = {
    'Computer Science': { 
      accent: '#136dec', bg: '#eef4ff', 
      glow: 'hover:shadow-[0_20px_50px_rgba(19,109,236,0.2)]',
      icon: <Terminal size={20} className="text-[#136dec]" /> 
    },
    'Mechanical Eng.': { 
      accent: '#f59e0b', bg: '#fff7ed', 
      glow: 'hover:shadow-[0_20px_50px_rgba(245,158,11,0.2)]',
      icon: <Settings size={20} className="text-[#f59e0b]" /> 
    },
    'Physics': { 
      accent: '#a855f7', bg: '#f5f3ff', 
      glow: 'hover:shadow-[0_20px_50px_rgba(168,85,247,0.2)]',
      icon: <Beaker size={20} className="text-[#a855f7]" /> 
    },
    'Business Admin.': { 
      accent: '#22c55e', bg: '#f0fdf4', 
      glow: 'hover:shadow-[0_20px_50px_rgba(34,197,94,0.2)]',
      icon: <Briefcase size={20} className="text-[#22c55e]" /> 
    }
  };

  const theme = themes[dept?.name] || themes['Computer Science'];

  return (
    <div className={`group relative bg-white border border-slate-200 rounded-[24px] overflow-hidden transition-all duration-500 ${theme.glow} hover:-translate-y-1.5`}>
      
      {/* 2. Two-Tone Header Gradient */}
      <div 
        className="h-24 p-5 relative" 
        style={{ background: `linear-gradient(to bottom, ${theme.bg} 80%, white 20%)` }}
      >
        <div className="flex justify-between items-start">
          {/* White Icon Box */}
          <div className="size-11 bg-white rounded-xl shadow-sm flex items-center justify-center border border-slate-100 transition-transform group-hover:scale-110 group-hover:rotate-3">
            {theme.icon}
          </div>
          
          <button className="p-1 text-slate-400 hover:text-slate-600 transition-colors">
            <MoreVertical size={18} />
          </button>
        </div>

        {/* Hover Action Buttons */}
        {isAdmin && (
          <div className="absolute top-4 right-12 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-[-5px] group-hover:translate-y-0">
            <button className="size-7 bg-white rounded-md border flex items-center justify-center text-slate-400 hover:text-blue-600 shadow-sm"><Edit2 size={12}/></button>
            <button onClick={() => onDelete(dept.id)} className="size-7 bg-white rounded-md border flex items-center justify-center text-slate-400 hover:text-red-600 shadow-sm"><Trash2 size={12}/></button>
          </div>
        )}
      </div>

      <div className="px-6 pb-6 relative -mt-3 bg-white">
        {/* Floating Code Badge */}
        <div className="flex mb-3">
          <div 
            className="px-3 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border-b-2"
            style={{ backgroundColor: theme.bg, color: theme.accent, borderColor: theme.accent }}
          >
            {dept?.code}
          </div>
        </div>

        <h3 className="text-[17px] font-black text-slate-900 mb-0.5 leading-tight">{dept?.name}</h3>
        <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mb-3">Academic Department</p>
        
        <div className="flex items-center gap-2 mb-6">
          <div className="size-7 rounded-full bg-slate-100 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center">
            <User size={14} className="text-slate-400" />
          </div>
          <div className="flex flex-col">
            <p className="text-[9px] font-bold text-slate-400 uppercase leading-none mb-0.5">Department Head</p>
            <p className="text-[11px] font-black text-slate-700">{dept?.hod}</p>
          </div>
        </div>

        {/* Inset Metric Boxes */}
        <div className="grid grid-cols-2 gap-3 border-t border-slate-50 pt-5">
          <div className="bg-slate-50/50 rounded-2xl py-3 text-center border border-slate-100/50 group-hover:bg-white transition-all">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-0.5">Total Staff</p>
            <p className="text-base font-black text-slate-900 leading-none">{dept?.faculty || '0'}</p>
          </div>
          <div className="bg-slate-50/50 rounded-2xl py-3 text-center border border-slate-100/50 group-hover:bg-white transition-all">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-0.5">Total Students</p>
            <p className="text-base font-black text-slate-900 leading-none">{dept?.students?.toLocaleString() || '0'}</p>
          </div>
        </div>

        <button className="w-full mt-5 py-2 text-[11px] font-black text-slate-600 bg-slate-50 rounded-xl hover:bg-blue-600 hover:text-white transition-all border border-slate-100">
          View Details
        </button>
      </div>
    </div>
  );
}