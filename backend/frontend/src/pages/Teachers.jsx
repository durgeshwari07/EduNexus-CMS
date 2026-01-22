import React, { useState, useMemo } from 'react';
import { Search, Filter, Edit2, Trash2, Plus } from 'lucide-react';

export default function Teachers({ userRole, teachers = [] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('All Departments');
  const isAdmin = userRole === 'admin';

  // Extract unique departments dynamically
  const uniqueDepts = ['All Departments', ...new Set(teachers.map(t => t.dept))];

  // Live Filtering Logic
  const filteredTeachers = useMemo(() => {
    return teachers.filter((t) => {
      const matchesSearch = 
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDept = deptFilter === 'All Departments' || t.dept === deptFilter;
      return matchesSearch && matchesDept;
    });
  }, [teachers, searchQuery, deptFilter]);

  return (
    <div className="animate-in fade-in duration-500 max-w-full mx-auto p-4 space-y-3 font-sans">
      
      {/* 1. LARGE TITLE / COMPACT HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 leading-none">Teachers Management</h2>
          <p className="text-slate-500 text-[11px] mt-1 font-medium italic">Faculty directory and departmental assignments.</p>
        </div>
        <button className="flex items-center gap-2 bg-[#136dec] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95">
          <Plus size={16} /> Add New Teacher
        </button>
      </div>

      {/* 2. ULTRA-COMPACT TOOLBAR */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-3 py-2 flex flex-col md:flex-row gap-3 items-center">
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#136dec]" size={14} />
          <input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border-none rounded-lg py-1.5 pl-9 pr-4 text-[11px] focus:ring-1 focus:ring-[#136dec]/30 text-slate-900 placeholder:text-slate-400 outline-none" 
            placeholder="Search faculty..." 
            type="text"
          />
        </div>
        <div className="flex gap-2">
          <select 
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="bg-slate-50 border-none rounded-lg py-1.5 pl-2 pr-8 text-[11px] text-slate-700 min-w-[140px] cursor-pointer outline-none"
          >
            {uniqueDepts.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <button className="flex items-center justify-center size-8 bg-slate-100 rounded-lg text-slate-600 hover:bg-slate-200">
            <Filter size={14} />
          </button>
        </div>
      </div>

      {/* 3. ZERO-WASTE DATA TABLE */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse table-fixed">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200">
                <th className="w-[28%] px-4 py-2 text-[12px] font-black uppercase tracking-widest text-slate-400">Name & ID</th>
                <th className="w-[18%] px-4 py-2 text-[12px] font-black uppercase tracking-widest text-slate-400">Department</th>
                <th className="w-[18%] px-4 py-2 text-[12px] font-black uppercase tracking-widest text-slate-400">Subject</th>
                <th className="w-[22%] px-4 py-2 text-[12px] font-black uppercase tracking-widest text-slate-400">Email</th>
                <th className="w-[14%] px-4 py-2 text-[12px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTeachers.map((teacher) => (
                <tr key={teacher.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-4 py-1.5">
                    <div className="flex items-center gap-2">
                      <div className="size-7 rounded-full bg-[#136dec]/5 flex items-center justify-center text-[10px] font-black text-[#136dec] border border-[#136dec]/10">
                        {teacher.initial || 'TR'}
                      </div>
                      <div className="flex flex-col truncate">
                        <span className="text-[11px] font-bold text-slate-900 leading-tight truncate">{teacher.name}</span>
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">ID: {teacher.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-1.5">
                    <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-blue-50 text-blue-600 border border-blue-100">
                      {teacher.dept}
                    </span>
                  </td>
                  <td className="px-4 py-1.5 text-[11px] font-medium text-slate-600 truncate">{teacher.subject || '—'}</td>
                  <td className="px-4 py-1.5 text-[11px] font-medium text-slate-400 lowercase truncate">{teacher.email || '—'}</td>
                  <td className="px-4 py-1.5 text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1 hover:bg-white rounded text-slate-400 hover:text-[#136dec] border border-transparent hover:border-slate-200 transition-all">
                        <Edit2 size={12} />
                      </button>
                      {isAdmin && (
                        <button className="p-1 hover:bg-red-50 rounded text-slate-400 hover:text-red-600 transition-all">
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 4. LOW-PROFILE FOOTER */}
        <div className="px-4 py-1.5 bg-slate-50/30 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[10px] text-slate-400 font-bold uppercase">
            Records: {filteredTeachers.length}
          </span>
          <div className="flex items-center gap-1">
            <button className="px-2 py-0.5 text-[10px] font-bold bg-white border border-slate-200 rounded text-slate-500 hover:bg-slate-50">Prev</button>
            <button className="px-2 py-0.5 text-[10px] font-bold bg-white border border-slate-200 rounded text-slate-500 hover:bg-slate-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}