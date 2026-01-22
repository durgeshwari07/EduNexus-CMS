
import React, { useState, useMemo } from 'react';
import { Plus, X, LayoutGrid, Search, Building2, User } from 'lucide-react';
import DepartmentCard from '../components/DepartmentCard';

export default function Departments({ userRole, departments = [], onAddDept, onDeleteDept }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const isAdmin = userRole === 'admin';

  // --- Filtering Logic ---
  const filteredDepts = useMemo(() => {
    return departments.filter(dept => 
      dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dept.code.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [departments, searchQuery]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    onAddDept({
      name: formData.get('deptName'),
      code: formData.get('deptCode'),
      hod: formData.get('hod'),
    });
    setIsDrawerOpen(false);
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-7xl mx-auto p-6 space-y-8 font-sans">
      
      {/* 1. BREADCRUMB & HEADER */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
          <LayoutGrid size={12} /> Dashboard / <span className="text-[#136dec]">Departments</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Institutional Departments</h1>
            <p className="text-slate-500 font-medium mt-1">Manage academic branches, HOD assignments, and curriculum codes.</p>
          </div>
          {isAdmin && (
            <button 
              onClick={() => setIsDrawerOpen(true)} 
              className="flex items-center gap-2 bg-[#136dec] text-white px-6 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95"
            >
              <Plus size={16} /> Add New Department
            </button>
          )}
        </div>
      </div>

      {/* 2. SEARCH TOOLBAR */}
      <div className="relative group max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#136dec] transition-colors" size={18} />
        <input 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-semibold focus:ring-4 focus:ring-blue-500/10 focus:border-[#136dec] outline-none transition-all shadow-sm" 
          placeholder="Search departments or codes..." 
        />
      </div>

      {/* 3. DEPARTMENTS GRID */}
      {filteredDepts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDepts.map(dept => (
            <DepartmentCard 
              key={dept.id} 
              dept={dept} 
              isAdmin={isAdmin} 
              onDelete={onDeleteDept} // Ensure this prop is passed correctly in App.js
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-[32px] border-2 border-dashed border-slate-200 p-20 text-center">
          <Building2 size={48} className="mx-auto text-slate-200 mb-4" />
          <p className="text-slate-400 font-bold">No departments found matching your search.</p>
        </div>
      )}

      {/* 4. ADD DEPARTMENT SIDE DRAWER */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in" onClick={() => setIsDrawerOpen(false)} />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl p-10 animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-black tracking-tight">Add Department</h3>
              <button onClick={() => setIsDrawerOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X size={24} className="text-slate-400" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Department Name</label>
                <div className="relative">
                  <Building2 size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                  <input name="deptName" placeholder="e.g. Computer Science" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-11 pr-4 text-sm focus:ring-2 focus:ring-[#136dec]/20 outline-none" required />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Department Code</label>
                <input name="deptCode" placeholder="e.g. CS-2024" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 text-sm focus:ring-2 focus:ring-[#136dec]/20 outline-none uppercase font-bold text-[#136dec]" required />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Head of Department (HOD)</label>
                <div className="relative">
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                  <input name="hod" placeholder="Full Name" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-11 pr-4 text-sm focus:ring-2 focus:ring-[#136dec]/20 outline-none" required />
                </div>
              </div>

              <div className="pt-6">
                <button type="submit" className="w-full py-4 bg-[#136dec] text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95">
                  Save Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}