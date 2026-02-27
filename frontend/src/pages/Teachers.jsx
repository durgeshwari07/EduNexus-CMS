import React, { useState, useMemo } from 'react';
import { 
  Search, Edit2, Trash2, Mail, Phone, 
  LayoutGrid, Users, ShieldCheck, 
  Briefcase, Filter, ChevronLeft, ChevronRight 
} from 'lucide-react';
import axios from 'axios';

export default function Teachers({ userRole, teachers = [], departments = [], onRefresh }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('all'); // NEW STATE
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const isAdmin = userRole?.toLowerCase() === 'admin';

  // --- 1. STATISTICS LOGIC ---
  const stats = [
    { label: 'TOTAL FACULTY', value: teachers.length, icon: <Users size={18} />, color: 'bg-blue-50 text-blue-600' },
    { label: 'PERMANENT', value: teachers.filter(t => t.employmentType?.toLowerCase() === 'permanent').length, icon: <ShieldCheck size={18} />, color: 'bg-indigo-50 text-indigo-600' },
    { label: 'LECTURE BASED', value: teachers.filter(t => t.employmentType?.toLowerCase() !== 'permanent').length, icon: <Briefcase size={18} />, color: 'bg-green-50 text-green-600' },
    { label: 'DEPARTMENTS', value: departments.length, icon: <LayoutGrid size={18} />, color: 'bg-slate-50 text-slate-600' },
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

  // --- 3. FILTERING LOGIC (Search + Department Filter) ---
  const filteredTeachers = useMemo(() => {
    return teachers.filter((t) => {
      const name = t.name || `${t.first_name} ${t.last_name}` || "";
      const email = t.email || "";
      const searchTerm = searchQuery.toLowerCase();
      const teacherDeptId = String(t.dept_id || "");
      const deptName = departments.find(d => String(d.id) === teacherDeptId)?.name || "";

      // Check Search Query
      const matchesSearch = (
        name.toLowerCase().includes(searchTerm) ||
        email.toLowerCase().includes(searchTerm) ||
        deptName.toLowerCase().includes(searchTerm) ||
        (t.qualification || "").toLowerCase().includes(searchTerm)
      );

      // Check Department Filter
      const matchesDept = selectedDept === 'all' || teacherDeptId === selectedDept;

      return matchesSearch && matchesDept;
    });
  }, [teachers, searchQuery, departments, selectedDept]);

  // --- 4. PAGINATION CALCULATIONS ---
  const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTeachers = filteredTeachers.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="max-w-7xl mx-auto p-2 animate-in fade-in duration-500 min-h-screen bg-[#f8fafc]">
      
      {/* 🏛️ HEADER SECTION */}
      <div className="mb-10 text-left flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          {/* <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">
            <LayoutGrid size={12} /> DASHBOARD / <span className="text-blue-600">FACULTY</span>
          </div> */}
          <h1 className="text-[2rem] font-black text-[#0f172a] leading-tight tracking-tight">
            Faculty Directory
          </h1>
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

      {/* 🔍 SEARCH & FILTER TOOLBAR */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-8">
        <div className="p-5 flex flex-wrap gap-4 items-center bg-white">
          <div className="relative flex-1 min-w-[350px]">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name, department, or qualification..." 
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full pl-14 pr-6 py-4 text-sm font-bold border-2 border-slate-50 rounded-xl outline-none focus:border-blue-100 transition-all text-slate-900 placeholder:text-slate-300"
            />
          </div>

          {/* 🚀 WORKING DEPARTMENT FILTER */}
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <select 
              value={selectedDept}
              onChange={(e) => { setSelectedDept(e.target.value); setCurrentPage(1); }}
              className="pl-12 pr-10 py-4 border-2 border-slate-50 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-700 bg-white outline-none focus:border-blue-100 appearance-none cursor-pointer transition-all hover:bg-slate-50"
            >
              <option value="all">All Departments</option>
              {departments.map((dept) => (
                <option key={dept.id} value={String(dept.id)}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 📋 DATA TABLE */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-white border-b border-slate-100">
              <tr>
                <th className="px-8 py-7 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">NAME</th>
                <th className="px-8 py-7 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">DEPT</th>
                <th className="px-8 py-7 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">QUALIFICATION</th>
                <th className="px-8 py-7 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">EXP</th>
                <th className="px-8 py-7 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">EMAIL</th>
                <th className="px-8 py-7 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">PHONE</th>
                <th className="px-8 py-7 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 bg-white">
              {currentTeachers.map((teacher) => (
                <tr key={teacher.id} className="hover:bg-blue-50/20 transition-colors group">
                  <td className="px-8 py-6 whitespace-nowrap text-sm font-black text-[#0f172a] uppercase tracking-tight">
                    {teacher.name || `${teacher.first_name} ${teacher.last_name}`}
                  </td>
                   <td className="px-8 py-6 whitespace-nowrap">
                    <span className="text-[13px] font-black text-[#0f172a] uppercase tracking-tighter">
                      {departments.find(d => String(d.id) === String(teacher.dept_id))?.name || 'GENERAL'}
                    </span>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap text-center text-sm font-black text-[#0f172a] uppercase tracking-tighter">
                    {teacher.qualification}
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap text-center">
                    <div className="text-sm font-black text-[#0f172a]">{teacher.experience} Yrs</div>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-sm text-blue-600 font-black tracking-tighter">
                      <Mail size={14} className="text-blue-400" /> {teacher.email}
                    </div>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap text-sm font-bold text-slate-500 tracking-tight">
                    {teacher.phone}
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-4">
                      <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-tighter shadow-sm ${
                        teacher.employmentType?.toLowerCase() === 'permanent' ? 'bg-blue-600 text-white' : 'bg-[#00b341] text-white'
                      }`}>
                        {teacher.employmentType || "LECTURE BASE"}
                      </span>
                      <div className="flex items-center gap-1 ml-4 opacity-30 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-slate-400 hover:text-blue-600 rounded-lg transition-all"><Edit2 size={18} /></button>
                        {isAdmin && (
                          <button 
                            onClick={() => handleDelete(teacher.id, teacher.name || `${teacher.first_name} ${teacher.last_name}`)}
                            className="p-2 text-slate-400 hover:text-red-600 rounded-lg transition-all"
                          ><Trash2 size={18} /></button>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 🚀 PAGINATION CONTROL */}
        {totalPages > 1 && (
          <div className="p-6 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredTeachers.length)} of {filteredTeachers.length} Faculty
            </p>
            <div className="flex gap-2">
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className={`p-2 rounded-xl border transition-all ${currentPage === 1 ? 'text-slate-200 border-slate-100 cursor-not-allowed' : 'text-slate-600 border-slate-200 hover:bg-white hover:text-blue-600'}`}
              >
                <ChevronLeft size={20} />
              </button>
              
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`size-10 rounded-xl text-[11px] font-black transition-all ${
                    currentPage === i + 1 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' 
                      : 'bg-white text-slate-400 border border-slate-200 hover:border-blue-400 hover:text-blue-600'
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className={`p-2 rounded-xl border transition-all ${currentPage === totalPages ? 'text-slate-200 border-slate-100 cursor-not-allowed' : 'text-slate-600 border-slate-200 hover:bg-white hover:text-blue-600'}`}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
      
      {filteredTeachers.length === 0 && (
        <div className="py-32 text-center">
          <Users size={48} className="mx-auto text-slate-200 mb-4" />
          <p className="text-slate-400 text-sm font-black uppercase tracking-widest">No faculty records found for this department.</p>
        </div>
      )}
    </div>
  );
}