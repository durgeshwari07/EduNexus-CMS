import React from 'react';
import { ChevronRight, GraduationCap, Users } from 'lucide-react';

export default function StudentBatchCard({ batch, onSelect, students }) {
  // 🔄 ONE-FLOW: Compare batchId (ensuring string/number compatibility)
  const count = students.filter(s => String(s.batchId) === String(batch.id)).length;

  return (
    <div 
      onClick={() => onSelect(batch)} 
      className={`bg-white border-2 rounded-[2rem] p-8 hover:border-blue-600 hover:shadow-2xl hover:shadow-blue-500/10 transition-all cursor-pointer group 
      ${batch.active ? 'border-blue-600 ring-4 ring-blue-50' : 'border-slate-100'}`}
    >
      <div className="flex justify-between items-start mb-6">
        <div className="p-4 bg-blue-50 rounded-2xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
          <GraduationCap size={24} />
        </div>
        
        {/* Year Badge */}
        <span className="text-[10px] font-black px-3 py-1.5 rounded-full uppercase bg-blue-50 text-blue-600 border border-blue-100 tracking-wider">
          Year {batch.year}
        </span>
      </div>
      
      {/* 🏛️ DEPARTMENT NAME - Big, Bold, Blue, and CAPITALIZED */}
      <h3 className="text-2xl font-black text-blue-600 leading-tight mb-2 uppercase tracking-tight">
        {batch.dept}
      </h3>
      
      {/* 📅 BATCH INFO - Bold Black */}
      <p className="text-sm font-black text-black uppercase tracking-[0.15em] mb-8">
        Batch {batch.batch}
      </p>
      
      <div className="flex justify-between items-center pt-5 border-t border-slate-100">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-full bg-slate-50 flex items-center justify-center">
             <Users size={18} className="text-slate-400" />
          </div>
          <p className="text-sm font-black text-slate-700">{count} Registered</p>
        </div>
        
        <div className="size-10 rounded-full bg-slate-50 group-hover:bg-blue-600 flex items-center justify-center transition-all">
          <ChevronRight size={20} className="text-slate-300 group-hover:text-white transition-all" />
        </div>
      </div>
    </div>
  );
}