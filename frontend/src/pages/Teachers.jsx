

import React, { useState, useMemo } from 'react';
import { 
  Search, Edit2, Trash2, Mail, Phone, 
  LayoutGrid, UserPlus, Users, ShieldCheck, 
  Briefcase, Filter, Plus 
} from 'lucide-react';
import axios from 'axios';

export default function Teachers({ userRole, teachers = [], onRefresh }) {
  const [searchQuery, setSearchQuery] = useState('');
  const isAdmin = userRole === 'admin';

  // --- 1. STATISTICS LOGIC (Matched to Subjects style) ---
  const stats = [
    { label: 'TOTAL FACULTY', value: teachers.length, icon: <Users size={18} />, color: 'bg-blue-50 text-blue-600' },
    { label: 'PERMANENT', value: teachers.filter(t => t.type?.toLowerCase() === 'permanent').length, icon: <ShieldCheck size={18} />, color: 'bg-indigo-50 text-indigo-600' },
    { label: 'LECTURE BASED', value: teachers.filter(t => t.type?.toLowerCase() !== 'permanent').length, icon: <Briefcase size={18} />, color: 'bg-green-50 text-green-600' },
    { label: 'DEPARTMENTS', value: [...new Set(teachers.map(t => t.dept_id))].length, icon: <LayoutGrid size={18} />, color: 'bg-slate-50 text-slate-600' },
  ];

  // --- 2. DELETE HANDLER ---
  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        await axios.delete(`http://localhost:5000/api/teachers/${id}`);
        alert("Teacher deleted successfully");
        if (onRefresh) onRefresh(); 
      } catch (err) {
        console.error("Delete failed:", err);
        alert("Could not delete teacher.");
      }
    }
  };

  // --- 3. FILTERING LOGIC ---
  const filteredTeachers = useMemo(() => {
    return teachers.filter((t) => {
      const name = t.name || t.teacherName || "";
      const email = t.email || "";
      const dept = String(t.dept_id || "");
      const qual = t.qualification || "";
      const searchTerm = searchQuery.toLowerCase();

      return (
        name.toLowerCase().includes(searchTerm) ||
        email.toLowerCase().includes(searchTerm) ||
        dept.toLowerCase().includes(searchTerm) ||
        qual.toLowerCase().includes(searchTerm)
      );
    });
  }, [teachers, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto p-10 animate-in fade-in duration-500 min-h-screen bg-[#f8fafc]">
      
      {/* 🏛️ HEADER SECTION */}
      <div className="mb-10 text-left flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">
            <LayoutGrid size={12} /> DASHBOARD / <span className="text-blue-600">FACULTY</span>
          </div>
          {/* Main Title */}
          <h1 className="text-[2.5rem] font-black text-[#0f172a] leading-tight tracking-tight">
            Faculty Directory
          </h1>
          {/* Subtitle */}
          <p className="text-slate-500 font-medium text-lg mt-1">
            Manage and view all registered faculty members and their status.
          </p>
        </div>

       
      </div>

      {/* 📊 STATISTICS GRID */}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <div className={`p-1.5 rounded-lg ${stat.color}`}>{stat.icon}</div>
            </div>
            <p className="text-xl font-black text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* 🔍 SEARCH TOOLBAR */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-8">
        <div className="p-5 flex flex-wrap gap-4 items-center bg-white">
          <div className="relative flex-1 min-w-[350px]">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name, department, or qualification..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-4 text-sm font-bold border-2 border-slate-50 rounded-xl outline-none focus:border-blue-100 transition-all text-slate-900 placeholder:text-slate-300"
            />
          </div>
          <button className="flex items-center gap-3 px-6 py-4 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-700 hover:bg-slate-50 transition-all">
             <Filter size={16} /> ALL DEPARTMENTS
          </button>
        </div>

        {/* 📋 DATA TABLE */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-white border-b border-slate-100">
              <tr>
                <th className="px-8 py-7 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">NAME</th>
                <th className="px-8 py-7 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">DEPT</th>
                <th className="px-8 py-7 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">QUALIFICATION</th>
                <th className="px-8 py-7 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">EXP</th>
                <th className="px-8 py-7 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">EMAIL</th>
                <th className="px-8 py-7 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">PHONE</th>
                <th className="px-8 py-7 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 bg-white">
              {filteredTeachers.map((teacher) => (
                <tr key={teacher.id} className="hover:bg-blue-50/20 transition-colors group">
                  <td className="px-8 py-6 whitespace-nowrap text-sm font-black text-[#0f172a] uppercase tracking-tight">
                    {teacher.name || teacher.teacherName || "Unknown"}
                  </td>
                   <td className="px-8 py-6 whitespace-nowrap text-center">
                    <span className="text-[13px] font-black text-[#0f172a] uppercase tracking-tighter">
                      {teacher.dept_id || 'ENGINEERING'}
                    </span>
                  </td>

                  <td className="px-8 py-6 whitespace-nowrap text-center text-sm font-black text-[#0f172a] uppercase tracking-tighter">
                    {teacher.qualification}
                  </td>

                  <td className="px-8 py-6 whitespace-nowrap text-center">
                    <div className="text-sm font-black text-[#0f172a]">
                      {teacher.experience}
                    </div>
                  </td>

                  <td className="px-8 py-6 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-sm text-blue-600 font-black tracking-tighter">
                      <Mail size={14} className="text-blue-400" />
                      {teacher.email}
                    </div>
                  </td>

                  <td className="px-8 py-6 whitespace-nowrap text-sm font-bold text-slate-500 tracking-tight">
                    {teacher.phone}
                  </td>

                 

                  <td className="px-8 py-6 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-4">
                      {/* Teacher Type Tag */}
                      <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-tighter shadow-sm ${
                        teacher.type?.toLowerCase() === 'permanent' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-[#00b341] text-white'
                      }`}>
                        {teacher.type || "LECTURE BASE"}
                      </span>
                      
                      <div className="flex items-center gap-1 ml-4 opacity-30 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-slate-400 hover:text-blue-600 rounded-lg transition-all">
                          <Edit2 size={18} />
                        </button>
                        {isAdmin && (
                          <button 
                            onClick={() => handleDelete(teacher.id, teacher.name || teacher.teacherName)}
                            className="p-2 text-slate-400 hover:text-red-600 rounded-lg transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {filteredTeachers.length === 0 && (
        <div className="py-32 text-center">
          <Users size={48} className="mx-auto text-slate-200 mb-4" />
          <p className="text-slate-400 text-sm font-black uppercase tracking-widest">No faculty records found matching your search.</p>
        </div>
      )}
    </div>
  );
}