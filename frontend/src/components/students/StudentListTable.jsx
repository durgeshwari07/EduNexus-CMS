import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { 
  Search, Download, Plus, Users, CheckCircle, 
  X, Camera, UserCircle, Hash, GraduationCap, Trash2, 
  Upload, ChevronLeft, ChevronRight 
} from 'lucide-react';

// --- HELPER: MAP EXCEL HEADERS TO DATABASE KEYS ---
const mapExcelDataToStudent = (row, batchId) => {
  return {
    name: row['Name'] || row['name'] || 'Unknown',
    enrollmentNo: row['Enrollment'] || row['enrollmentNo'] || null,
    email: row['Email'] || row['email'] || null,
    phone: row['Phone'] || row['phone'] || "",
    semester: parseInt(row['Semester']) || 1,
    division: row['Division'] || 'A',
    academicYear: row['Year'] || '2024-25',
    dob: row['DOB'] || null, 
    address: row['Address'] || "",
    guardianName: row['Guardian'] || "",
    guardianPhone: row['Guardian Contact'] || "",
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
  
  // PAGINATION STATE
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10;

  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // 1. DYNAMIC STATISTICS
  const stats = [
    { label: 'Total Students', value: students.length, icon: <Users size={18} />, color: 'bg-blue-50 text-blue-600' },
    { label: 'Current Sem', value: batch.year || '1', icon: <GraduationCap size={18} />, color: 'bg-indigo-50 text-indigo-600' },
    { label: 'Batch ID', value: batch.batch || '2024', icon: <Hash size={18} />, color: 'bg-slate-50 text-slate-600' },
    { label: 'Active', value: students.filter(s => s.status === 'Active').length, icon: <CheckCircle size={18} />, color: 'bg-green-50 text-green-600' },
  ];

  // 2. LIVE FILTERING
  const filteredStudents = students.filter(s => 
    s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.enrollmentNo?.toString().toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 3. PAGINATION CALCULATIONS
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);

  // 4. BULK EXCEL UPLOAD LOGIC
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

  // 5. MANUAL FORM SUBMISSION
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const studentData = {
      name: fd.get('name'),
      enrollmentNo: fd.get('enrollmentNo'),
      email: fd.get('email'),
      phone: fd.get('phone'),
      semester: parseInt(fd.get('semester')) || 1, 
      division: fd.get('division'),
      academicYear: fd.get('academicYear'),
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
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search students by name or enrollment..." 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-12 pr-4 py-3 text-sm font-medium border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>
          
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
                <th className="px-6 py-6 text-center">Enrollment</th>
                <th className="px-6 py-6 text-center">Academic Info</th>
                <th className="px-6 py-6 text-center">Contact</th>
                <th className="px-6 py-6 text-center">Status</th>
                <th className="px-6 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentStudents.length > 0 ? currentStudents.map((s, idx) => (
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
                  <td className="px-6 py-5 text-center text-sm font-bold text-slate-600">{s.enrollmentNo}</td>
                  <td className="px-6 py-5 text-center">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">Sem {s.semester}</span>
                      <span className="text-xs text-slate-500 font-bold uppercase tracking-tighter">Division {s.division}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center text-sm font-medium text-slate-500">{s.phone}</td>
                  <td className="px-6 py-5 text-center">
                    <span className="text-xs font-bold px-3 py-1 rounded-full uppercase bg-green-100 text-green-700 border border-green-200">Active</span>
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
              )) : (
                <tr>
                  <td colSpan="6" className="px-6 py-24 text-center text-slate-400 text-sm font-bold uppercase tracking-widest">
                    No students found in this batch
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
                <InputGroup label="Full Name" name="name" placeholder="Enter Full Name" />
                <InputGroup label="Enrollment No" name="enrollmentNo" placeholder="e.g. ENR2024001" />
                <InputGroup label="Institutional Email" name="email" type="email" placeholder="student@college.edu" />
                <InputGroup label="Contact Number" name="phone" placeholder="+91 00000 00000" />
                <SelectGroup label="Semester" name="semester" options={['1', '2', '3', '4', '5', '6']} />
                <SelectGroup label="Division" name="division" options={['A', 'B', 'C', 'D']} />
                <SelectGroup label="Academic Cycle" name="academicYear" options={['2023-24', '2024-25', '2025-26']} />
                <InputGroup label="Date of Birth" name="dob" type="date" />
                <div className="md:col-span-2 space-y-3">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Permanent Address</label>
                  <textarea name="address" className="w-full border-2 border-slate-100 rounded-2xl p-5 text-sm font-medium outline-none focus:border-blue-200 transition-all min-h-[120px] text-slate-800" placeholder="Street, City, State, ZIP..."></textarea>
                </div>
                <InputGroup label="Guardian Name" name="guardianName" placeholder="Father/Mother Name" />
                <InputGroup label="Guardian Contact" name="guardianPhone" placeholder="+91 00000 00000" />
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
const InputGroup = ({ label, name, type = "text", placeholder }) => (
  <div className="space-y-3">
    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</label>
    <input 
      name={name} 
      type={type} 
      placeholder={placeholder} 
      className="w-full border-2 border-slate-100 rounded-2xl p-5 text-sm font-medium outline-none focus:border-blue-200 transition-all text-slate-800" 
      required 
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