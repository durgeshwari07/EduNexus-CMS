


import React, { useState } from 'react';
import { Plus, ArrowLeft, LayoutGrid } from 'lucide-react';
import StudentBatchCard from '../components/students/StudentBatchCard';
import StudentListTable from '../components/students/StudentListTable';

// FIX: Added "= []" to batches and allStudents to prevent the map error
export default function Students({ userRole, batches = [], allStudents = [], onAddBatch, onAddStudent }) {
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const isAdmin = userRole === 'admin';

  // Dynamic filter options
  const filterOptions = ['All', ...new Set(batches.map(b => b.dept))];
  const filteredBatches = activeFilter === 'All' ? batches : batches.filter(b => b.dept === activeFilter);

  return (
    <div className="max-w-7xl mx-auto p-8 animate-in fade-in duration-500">
      <div className="mb-10">
        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
          <LayoutGrid size={12} /> Dashboard / <span className="text-blue-600">Students</span>
        </div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Student Directory</h1>
        <p className="text-slate-500 font-medium mt-1">Manage departmental enrollment and batch-based student records.</p>
      </div>

      {!selectedBatch ? (
        <div className="space-y-10">
          {isAdmin && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm border-t-4 border-t-blue-600">
              <h3 className="font-bold text-xs text-slate-400 uppercase tracking-wider mb-4">Register New Batch</h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.target);
                onAddBatch({ 
                  dept: fd.get('dept'), 
                  batch: fd.get('batch'), 
                  hod: fd.get('hod'), 
                  year: fd.get('year') 
                });
                e.target.reset();
              }} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                <FormGroup label="Department" name="dept" placeholder="BCA" />
                <FormGroup label="Batch Year" name="batch" placeholder="2024" />
                <FormGroup label="HoD" name="hod" placeholder="Dr. Turing" />
                <FormGroup label="Year" name="year" placeholder="Year 1" />
                <button type="submit" className="bg-blue-600 text-white py-3 rounded-xl font-bold text-xs shadow-lg shadow-blue-200 hover:bg-blue-700 transition">Create Batch</button>
              </form>
            </div>
          )}

          <div className="flex justify-between items-center border-b border-slate-100 pb-6">
            <h3 className="font-black text-xl">Batch Management</h3>
            <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-1 border border-slate-200">
              {filterOptions.map(f => (
                <button key={f} onClick={() => setActiveFilter(f)} className={`px-6 py-2 text-xs font-black rounded-xl transition-all ${activeFilter === f ? 'bg-white text-blue-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500'}`}>{f}</button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {filteredBatches.map(b => (
              <StudentBatchCard key={b.id} batch={b} onSelect={setSelectedBatch} students={allStudents} />
            ))}
          </div>
        </div>
      ) : (
        <div className="animate-in slide-in-from-right-4 duration-500">
          <button onClick={() => setSelectedBatch(null)} className="flex items-center gap-2 text-xs font-black text-slate-500 hover:text-blue-600 mb-6 transition-colors">
            <ArrowLeft size={16} /> Back to Batches
          </button>
          <StudentListTable 
            batch={selectedBatch} 
            students={allStudents.filter(s => s.batchId === selectedBatch.id)} 
            onAddStudent={onAddStudent} 
            isAdmin={isAdmin} 
          />
        </div>
      )}
    </div>
  );
}

const FormGroup = ({ label, name, placeholder }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-400 uppercase">{label}</label>
    <input name={name} placeholder={placeholder} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none focus:ring-2 focus:ring-blue-100 transition font-medium" required />
  </div>
);