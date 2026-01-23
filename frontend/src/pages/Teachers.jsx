import React, { useState, useMemo } from 'react';
import { Search, Edit2, Trash2, Mail, Phone } from 'lucide-react';
import axios from 'axios';

export default function Teachers({ userRole, teachers = [], onRefresh }) {
  const [searchQuery, setSearchQuery] = useState('');
  const isAdmin = userRole === 'admin';

  // 1. DELETE HANDLER
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

  // 2. FILTERING LOGIC
  const filteredTeachers = useMemo(() => {
    return teachers.filter((t) => {
      // Logic handles both 'name' and 'teacherName' keys from database
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
    <div className="p-8 bg-white min-h-screen font-sans text-slate-900">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-[#0f172a] tracking-tight">Faculty Directory</h1>
          <p className="text-slate-500 text-sm font-medium">Manage and view all registered faculty members.</p>
        </div>
        <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-xl text-xs font-bold border border-blue-100">
          Showing {filteredTeachers.length} Members
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="relative mb-8">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-12 pr-4 py-3 border border-slate-200 rounded-2xl bg-slate-50 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm font-medium"
          placeholder="Search by name, department, or qualification..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* DATA TABLE */}
      <div className="overflow-hidden border border-slate-100 rounded-3xl shadow-sm">
        <table className="min-w-full divide-y divide-slate-100">
          <thead className="bg-[#f8fafc]">
            <tr>
              <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Name</th>
              <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</th>
              <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone Number</th>
              <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Dept</th>
              <th className="px-6 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Qualification</th>
              <th className="px-6 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Exp</th>
              <th className="px-6 py-3 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-50">
            {filteredTeachers.map((teacher) => (
              <tr key={teacher.id} className="hover:bg-blue-50/30 transition-colors group">
                {/* 1. FIXED NAME COLUMN */}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">
                  {teacher.name || teacher.teacherName || "Unknown"}
                </td>

                {/* 2. SEPARATE EMAIL COLUMN */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2 text-sm text-blue-600 font-medium">
                    <Mail size={14} className="text-blue-400" />
                    {teacher.email}
                  </div>
                </td>

                {/* 3. SEPARATE PHONE COLUMN */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                    <Phone size={14} className="text-slate-300" />
                    {teacher.phone}
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-tight">
                    {teacher.dept_id || 'N/A'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                  {teacher.qualification}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-bold">
                  {teacher.experience} <span className="text-[10px] text-slate-400 font-medium">YRS</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex justify-end gap-2">
                    <button className="p-2 text-slate-300 hover:text-blue-600 transition-all">
                      <Edit2 size={16} />
                    </button>
                    {isAdmin && (
                      <button 
                        onClick={() => handleDelete(teacher.id, teacher.name || teacher.teacherName)}
                        className="p-2 text-slate-300 hover:text-red-600 transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredTeachers.length === 0 && (
          <div className="py-24 text-center text-slate-400 text-sm italic">
            No faculty records found.
          </div>
        )}
      </div>
    </div>
  );
}