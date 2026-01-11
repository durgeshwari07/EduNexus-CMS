
import React, { useState } from 'react';
import { 
  Search, Filter, Download, Plus, Eye, Edit2, 
  Users, User, CheckCircle, AlertCircle, Calendar,
  ChevronLeft, ChevronRight, X, Camera, Mail, Phone
} from 'lucide-react';

export default function StudentListTable({ batch, students, onAddStudent, isAdmin }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // 1. DYNAMIC STATISTICS
  const stats = [
    { label: 'Total Students', value: students.length, icon: <Users size={18} />, color: 'bg-blue-50 text-blue-600' },
    { label: 'Male', value: '75', icon: <User size={18} />, color: 'bg-indigo-50 text-indigo-600' },
    { label: 'Female', value: '45', icon: <User size={18} />, color: 'bg-pink-50 text-pink-600' },
    { label: 'Avg. Attendance', value: '88%', icon: <Calendar size={18} />, color: 'bg-cyan-50 text-cyan-600' },
    { label: 'Students Passed', value: '108', icon: <CheckCircle size={18} />, color: 'bg-green-50 text-green-600' },
    { label: 'Backlogs', value: '12', icon: <AlertCircle size={18} />, color: 'bg-red-50 text-red-600' },
  ];

  // 2. LIVE FILTERING
  const filteredStudents = students.filter(s => 
    s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.id?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    onAddStudent({
      name: fd.get('name'),
      email: fd.get('email'),
      batchId: batch.id,
      status: 'ACTIVE'
    });
    setIsModalOpen(false);
    e.target.reset();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* STATISTICS CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{stat.label}</p>
              <div className={`p-1.5 rounded-lg ${stat.color}`}>{stat.icon}</div>
            </div>
            <p className="text-xl font-black text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* TABLE ACTION BAR */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-wrap justify-between items-center gap-4 bg-slate-50/30">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search by name, ID or roll number..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs font-medium border border-slate-200 rounded-xl outline-none"
            />
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 bg-white"><Download size={14} /> Download List</button>
            {isAdmin && (
              <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-xl font-bold text-xs shadow-lg"
              >
                <Plus size={16} /> Add Student
              </button>
            )}
          </div>
        </div>

        {/* STUDENT NAME LIST TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <tr>
                <th className="px-6 py-5">Student Name</th>
                <th className="px-6 py-5 text-center">Student ID</th>
                <th className="px-6 py-5 text-center">Roll No</th>
                <th className="px-6 py-5 text-center">Contact</th>
                <th className="px-6 py-5 text-center">Status</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredStudents.map((s, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors group">
                  {/* Student Name with Avatar */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-full bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center overflow-hidden">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">{s.initial}</span>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">{s.name}</p>
                        <p className="text-[10px] text-slate-400 font-medium">{s.email || 'student@edu.com'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center text-[11px] font-bold text-slate-500">{s.id}</td>
                  <td className="px-6 py-4 text-center text-[11px] font-bold text-slate-500">24BCA0{idx+1}</td>
                  <td className="px-6 py-4 text-center text-[11px] font-bold text-slate-500">+1 (555) 000-0000</td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-[9px] font-black px-2.5 py-1 rounded-full uppercase bg-green-50 text-green-600">Active</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 hover:text-blue-600"><Eye size={16}/></button>
                      <button className="p-2 hover:text-blue-600"><Edit2 size={16}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="p-4 bg-slate-50/30 border-t flex justify-between items-center text-[11px] font-bold text-slate-400">
          <p>Showing 1 to {filteredStudents.length} of {students.length} students</p>
          <div className="flex items-center gap-1">
            <button className="p-2 border rounded-lg bg-white"><ChevronLeft size={16}/></button>
            <button className="size-8 flex items-center justify-center bg-blue-600 text-white rounded-lg shadow-md shadow-blue-100">1</button>
            <button className="size-8 flex items-center justify-center bg-white border rounded-lg">2</button>
            <button className="p-2 border rounded-lg bg-white"><ChevronRight size={16}/></button>
          </div>
        </div>
      </div>

      {/* FORM MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="p-6 border-b flex justify-between items-center">
              <div><h2 className="text-xl font-black text-slate-900">Add New Student</h2><p className="text-xs text-slate-500">Enrolling in {batch.dept} - {batch.batch}</p></div>
              <X className="cursor-pointer text-slate-400" onClick={() => setIsModalOpen(false)} />
            </div>
            <form onSubmit={handleFormSubmit} className="p-8 space-y-6">
              <div className="flex flex-col items-center mb-4">
                <div className="size-20 rounded-full border-2 border-dashed border-slate-200 flex items-center justify-center bg-slate-50 relative">
                  <Camera size={24} className="text-slate-300" />
                  <div className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full border-2 border-white"><Edit2 size={10} /></div>
                </div>
                <p className="text-[10px] font-black text-blue-600 mt-2 uppercase tracking-widest">Upload Photo</p>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2"><label className="block text-[10px] font-black text-slate-400 uppercase">Full Name</label><input name="name" placeholder="Alexander Miller" className="w-full border rounded-xl p-3 text-xs outline-none focus:ring-2 focus:ring-blue-100" required /></div>
                <div className="space-y-2"><label className="block text-[10px] font-black text-slate-400 uppercase">Email</label><input name="email" type="email" placeholder="alex@edu.com" className="w-full border rounded-xl p-3 text-xs outline-none focus:ring-2 focus:ring-blue-100" required /></div>
              </div>
              <div className="flex justify-end gap-3 pt-6 border-t">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 rounded-xl font-bold text-xs bg-slate-100">Cancel</button>
                <button type="submit" className="px-10 py-2.5 rounded-xl font-bold text-xs bg-blue-600 text-white shadow-lg">Save Student</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}