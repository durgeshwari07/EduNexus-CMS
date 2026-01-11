import React, { useState } from 'react';
import { PlusCircle, X } from 'lucide-react';
import DepartmentCard from '../components/DepartmentCard';

export default function Departments({ userRole, departments, onAddDept, onDeleteDept }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const isAdmin = userRole === 'admin';

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
    <div className="max-w-7xl mx-auto animate-in fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-black text-slate-900">Departments</h2>
        {isAdmin && (
          <button onClick={() => setIsDrawerOpen(true)} className="flex items-center gap-2 bg-[#136dec] text-white px-4 py-2 rounded-lg text-xs font-bold shadow-lg shadow-blue-200">
            <PlusCircle size={16} /> Add New Department
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {departments.map(dept => (
          <DepartmentCard key={dept.id} dept={dept} isAdmin={isAdmin} onDelete={onDeleteDept} />
        ))}
      </div>

      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsDrawerOpen(false)} />
          <div className="relative w-full max-w-sm bg-white h-full shadow-2xl p-6 animate-in slide-in-from-right">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-black">Add Department</h3>
              <button onClick={() => setIsDrawerOpen(false)}><X size={20}/></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input name="deptName" placeholder="Department Name" className="w-full bg-slate-50 border rounded-lg p-2 text-xs" required />
              <input name="deptCode" placeholder="Code (e.g. CS-101)" className="w-full bg-slate-50 border rounded-lg p-2 text-xs" required />
              <input name="hod" placeholder="Head of Department" className="w-full bg-slate-50 border rounded-lg p-2 text-xs" required />
              <button type="submit" className="w-full py-3 bg-[#136dec] text-white rounded-lg font-bold text-xs">Save Department</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}