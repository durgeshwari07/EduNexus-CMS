import React, { useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { 
  Search, Download, Plus, Users, CheckCircle, 
  X, UserCircle, Hash, GraduationCap, Trash2, 
  Upload, ChevronLeft, ChevronRight, Filter 
} from 'lucide-react';

// --- HELPER: MAP EXCEL HEADERS TO DATABASE KEYS ---
const mapExcelDataToStudent = (row, batchId) => {
  return {
    name: row['Name'] || row['name'] || 'Unknown',
    enrollmentNo: row['Enrollment'] || row['enrollmentNo'] || null,
    prNo: row['PR No'] || row['prNo'] || null,
    email: row['Email'] || row['email'] || null,
    phone: row['Phone'] || row['phone'] || "",
    division: row['Division'] || 'A',
    dob: row['DOB'] || null, 
    address: row['Address'] || "",
    guardianName: row['Guardian'] || "",
    guardianPhone: row['Guardian Contact'] || "",
    passCount: parseInt(row['Pass']) || 0,
    failCount: parseInt(row['Fail']) || 0,
    username: row['Username'] || row['Enrollment'] || `user_${Math.floor(Math.random() * 1000)}`, 
    password: row['Password'] || 'Student@123',
    status: 'Active',
    batchId: batchId
  };
};

export default function StudentListTable({ batch, students, onAddStudent, onDeleteStudent, isAdmin }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [academicFilter, setAcademicFilter] = useState('All'); // New state for All, Pass, Fail
  
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10;

  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // --- NEW: DYNAMIC PASS/FAIL LOGIC ENGINE ---
  const getLiveStats = (student) => {
    let failCount = 0;
    let passCount = 0;

    // Scan academicRecords for any Grade "F"
    if (student.academicRecords && Array.isArray(student.academicRecords)) {
      student.academicRecords.forEach(sem => {
        sem.subjects?.forEach(sub => {
          if (sub.grade?.toUpperCase() === 'F') {
            failCount++;
          } else if (sub.grade && sub.grade.trim() !== '') {
            passCount++;
          }
        });
      });
    } else {
      // Fallback to static props if records aren't provided
      failCount = Number(student.failCount) || 0;
      passCount = Number(student.passCount) || 0;
    }

    return { failCount, passCount, isClear: failCount === 0 };
  };

  // 1. DYNAMIC STATISTICS
  const stats = [
    { label: 'Total Students', value: students.length, icon: <Users size={18} />, color: 'bg-blue-50 text-blue-600' },
    { label: 'Current Sem', value: batch.sem || '1', icon: <GraduationCap size={18} />, color: 'bg-indigo-50 text-indigo-600' },
    { label: 'Batch ID', value: batch.batch || '2024', icon: <Hash size={18} />, color: 'bg-slate-50 text-slate-600' },
    { label: 'Active', value: students.filter(s => s.status === 'Active').length, icon: <CheckCircle size={18} />, color: 'bg-green-50 text-green-600' },
  ];

  // 2. UPDATED FILTERING LOGIC
  const filteredStudents = students.filter(s => {
    const { isClear } = getLiveStats(s);

    // Filter Logic
    if (academicFilter === 'Pass' && !isClear) return false;
    if (academicFilter === 'Fail' && isClear) return false;

    // Search Query Filter
    const matchesSearch = 
      s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.enrollmentNo?.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.prNo?.toString().toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      setIsImporting(true);
      const bstr = evt.target.result;
      const workbook = XLSX.read(bstr, { type: 'binary' });
      const ws = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(ws);

      for (const row of data) {
        try {
          const studentData = mapExcelDataToStudent(row, batch.id);
          await onAddStudent(studentData); 
        } catch (err) {
          console.error("Failed to import student:", row.Name, err);
        }
      }
      setIsImporting(false);
      e.target.value = null; 
      alert(`Import process finished. Processed ${data.length} rows.`);
    };
    reader.readAsBinaryString(file);
  };

  const triggerFileUpload = () => fileInputRef.current.click();

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const phone = fd.get('phone');
    const name = fd.get('name');

    if (!/^[a-zA-Z\s]+$/.test(name)) {
      alert("Name must only contain letters and spaces.");
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      alert("Phone number must be exactly 10 digits.");
      return;
    }

    const studentData = {
      name: name,
      enrollmentNo: fd.get('enrollmentNo'),
      prNo: fd.get('prNo'),
      email: fd.get('email'),
      phone: phone,
      semester: parseInt(batch.sem) || 1,
      division: fd.get('division'),
      academicYear: batch.year || '2024-25',
      dob: fd.get('dob'),
      address: fd.get('address'),
      guardianName: fd.get('guardianName'),
      guardianPhone: fd.get('guardianPhone'),
      username: fd.get('username'),
      password: fd.get('password'),
      batchId: batch.id, 
      status: 'Active'
    };

    onAddStudent(studentData);
    setIsModalOpen(false);
    e.target.reset();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* STATISTICS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
              <div className={`p-2 rounded-lg ${stat.color}`}>{stat.icon}</div>
            </div>
            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* TABLE ACTION BAR */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-wrap justify-between items-center gap-4 bg-slate-50/30">
          
          {/* SEARCH INPUT */}
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search students..." 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-12 pr-4 py-3 text-sm font-medium border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>

          {/* NEW ACADEMIC FILTER TOGGLE */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            {['All', 'Pass', 'Fail'].map((status) => (
              <button
                key={status}
                onClick={() => {
                  setAcademicFilter(status);
                  setCurrentPage(1);
                }}
                className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${
                  academicFilter === status 
                    ? 'bg-white text-blue-600 shadow-sm border border-slate-200/50' 
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
          
          {/* ACTIONS */}
          <div className="flex gap-3">
            <input type="file" accept=".xlsx, .xls" hidden ref={fileInputRef} onChange={handleFileUpload} />

            {isAdmin && (
              <button 
                onClick={triggerFileUpload}
                disabled={isImporting}
                className={`flex items-center gap-2 px-5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${isImporting ? 'bg-slate-100 text-slate-400' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
              >
                <Upload size={16} /> {isImporting ? 'Importing...' : 'Import Excel'}
              </button>
            )}

            <button className="flex items-center gap-2 px-5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 bg-white hover:bg-slate-50 uppercase tracking-wider">
              <Download size={16} /> Export
            </button>
            
            {isAdmin && (
              <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">
                <Plus size={18} /> New Student
              </button>
            )}
          </div>
        </div>

        {/* STUDENT TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b text-xs font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-6">Student Profile</th>
                <th className="px-6 py-6 text-center">Enrollment / PR</th>
                <th className="px-6 py-6 text-center">Academic Health</th>
                <th className="px-6 py-6 text-center">Contact</th>
                <th className="px-6 py-6 text-center">Status</th>
                <th className="px-6 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentStudents.length > 0 ? currentStudents.map((s, idx) => {
                const { failCount, passCount, isClear } = getLiveStats(s);
                return (
                <tr key={s.id || idx} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="size-11 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
                        {s.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{s.name}</p>
                        <p className="text-xs text-slate-500 font-medium">{s.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <p className="text-sm font-bold text-slate-600">{s.enrollmentNo}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">PR: {s.prNo || 'N/A'}</p>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="flex flex-col items-center gap-1.5">
                       <div className="flex gap-1">
                          <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-2 py-0.5 rounded border border-emerald-100">{passCount} Pass</span>
                          <span className={`${failCount > 0 ? 'bg-red-50 text-red-600 border-red-100 font-black shadow-sm' : 'bg-slate-50 text-slate-400 border-slate-100'} text-[10px] font-black px-2 py-0.5 rounded border`}>
                            {failCount} Fail
                          </span>
                       </div>
                       <span className="text-[10px] text-slate-500 font-bold uppercase">Sem {s.semester} • Div {s.division}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center text-sm font-medium text-slate-500">{s.phone}</td>
                  <td className="px-6 py-5 text-center">
                    <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase border ${
                      isClear ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'
                    }`}>
                      {isClear ? 'Clear' : 'Failed'}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => navigate(`/student-portal/${s.id}`)} className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                        <UserCircle size={22}/>
                      </button>
                      {isAdmin && (
                        <button onClick={() => onDeleteStudent(s.id)} className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                          <Trash2 size={22}/>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}) : (
                <tr>
                  <td colSpan="6" className="px-6 py-24 text-center text-slate-400 text-sm font-bold uppercase tracking-widest">
                    No students found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION FOOTER */}
        {filteredStudents.length > studentsPerPage && (
          <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Showing {indexOfFirstStudent + 1} to {Math.min(indexOfLastStudent, filteredStudents.length)} of {filteredStudents.length} Students
            </p>
            <div className="flex items-center gap-2">
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
                className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 disabled:opacity-30 hover:bg-slate-100 transition-all"
              >
                <ChevronLeft size={20} />
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`size-10 rounded-xl text-xs font-bold transition-all ${currentPage === i + 1 ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'}`}
                >
                  {i + 1}
                </button>
              ))}
              <button 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
                className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 disabled:opacity-30 hover:bg-slate-100 transition-all"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* REGISTRATION MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
            <div className="p-10 border-b flex justify-between items-center bg-white">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Student Registration</h2>
                <p className="text-sm font-bold text-blue-600 uppercase tracking-widest mt-1">Batch: {batch.dept} • {batch.batch}</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-3 bg-slate-100 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleFormSubmit} className="p-10 space-y-10 overflow-y-auto text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                <InputGroup label="Full Name" name="name" placeholder="Enter Full Name" pattern="[a-zA-Z\s]+" title="Only letters and spaces allowed" />
                <InputGroup label="Enrollment No" name="enrollmentNo" placeholder="e.g. ENR2024001" />
                <InputGroup label="PR No (Permanent Registration)" name="prNo" placeholder="e.g. PR202400512" />
                <InputGroup label="Institutional Email" name="email" type="email" placeholder="student@college.edu" />
                <InputGroup label="Contact Number" name="phone" placeholder="10-digit Number" type="tel" pattern="\d{10}" maxLength="10" title="Please enter exactly 10 digits" />
                <div className="space-y-3">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Semester</label>
                    <div className="w-full border-2 border-slate-100 bg-slate-50 rounded-2xl p-5 text-sm font-black text-blue-600">
                        Semester {batch.sem || 1} (Locked to Batch)
                    </div>
                </div>
                <SelectGroup label="Division" name="division" options={['A', 'B', 'C', 'D']} />
                <div className="space-y-3">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Academic Cycle</label>
                    <div className="w-full border-2 border-slate-100 bg-slate-50 rounded-2xl p-5 text-sm font-black text-slate-700">
                        {batch.year || '2024-25'} (From Batch)
                    </div>
                </div>
                <InputGroup label="Date of Birth" name="dob" type="date" />
                <div className="md:col-span-2 space-y-3">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Permanent Address</label>
                  <textarea name="address" className="w-full border-2 border-slate-100 rounded-2xl p-5 text-sm font-medium outline-none focus:border-blue-200 transition-all min-h-[120px] text-slate-800" placeholder="Street, City, State, ZIP..."></textarea>
                </div>
                <InputGroup label="Guardian Name" name="guardianName" placeholder="Father/Mother Name" />
                <InputGroup label="Guardian Contact" name="guardianPhone" placeholder="10-digit Number" maxLength="10" />
                <InputGroup label="System Username" name="username" placeholder="johndoe_24" />
                <InputGroup label="System Password" name="password" type="password" placeholder="••••••••" />
              </div>
              <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-10 py-4 rounded-2xl font-bold text-sm uppercase tracking-wider bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">Cancel</button>
                <button type="submit" className="px-14 py-4 rounded-2xl font-bold text-sm uppercase tracking-wider bg-blue-600 text-white shadow-xl hover:bg-blue-700 transition-all">Submit Enrollment</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// --- REUSABLE UI COMPONENTS ---
const InputGroup = ({ label, name, type = "text", placeholder, ...props }) => (
  <div className="space-y-3">
    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</label>
    <input 
      name={name} 
      type={type} 
      placeholder={placeholder} 
      className="w-full border-2 border-slate-100 rounded-2xl p-5 text-sm font-medium outline-none focus:border-blue-200 transition-all text-slate-800" 
      required 
      {...props}
    />
  </div>
);

const SelectGroup = ({ label, name, options }) => (
  <div className="space-y-3">
    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</label>
    <select 
      name={name} 
      className="w-full border-2 border-slate-100 rounded-2xl p-5 text-sm font-medium outline-none focus:border-blue-200 bg-white text-slate-800 transition-all appearance-none" 
      required
    >
      <option value="">Select Option</option>
      {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  </div>
);