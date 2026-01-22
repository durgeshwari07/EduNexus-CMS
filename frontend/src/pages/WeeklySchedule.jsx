import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Plus, X, Info, AlertTriangle, Filter, Edit3, Download } from 'lucide-react';

export default function WeeklySchedule({ semesterSchedule, onSaveLecture, departments }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedSlot, setSelectedSlot] = useState({ day: '', time: '' });
  const [formData, setFormData] = useState({ batch: '', subject: '', teacher: '', room: '', dept: '' });

  const timeSlots = ['08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM'];

  // --- HELPER: SUBJECT COLOR MAPPER ---
  const getSubjectColor = (subject) => {
    const s = subject?.toLowerCase() || '';
    if (s.includes('dbms')) return 'border-blue-500 bg-blue-50/60 text-blue-700';
    if (s.includes('ml') || s.includes('machine')) return 'border-purple-500 bg-purple-50/60 text-purple-700';
    if (s.includes('dsa') || s.includes('data structure')) return 'border-emerald-500 bg-emerald-50/60 text-emerald-700';
    if (s.includes('ai') || s.includes('intelligence')) return 'border-orange-500 bg-orange-50/60 text-orange-700';
    if (s.includes('math') || s.includes('algebra')) return 'border-rose-500 bg-rose-50/60 text-rose-700';
    return 'border-gray-500 bg-gray-50/60 text-gray-700'; // Default
  };

  const weekDays = useMemo(() => {
    const now = new Date();
    const start = new Date(now);
    start.setDate(now.getDate() - (now.getDay() === 0 ? 6 : now.getDay() - 1));
    return ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return { name: day, date: d.getDate(), isToday: d.toDateString() === now.toDateString() };
    });
  }, []);

  const filteredSchedule = useMemo(() => {
    if (selectedDept === 'All') return semesterSchedule;
    return semesterSchedule.filter(l => l.dept === selectedDept);
  }, [semesterSchedule, selectedDept]);

  return (
    <div className="flex bg-[#F8F9FB] min-h-screen font-sans">
      {/* Sidebar - Conflict Checker */}
      <aside className="w-80 border-r border-gray-100 p-6 bg-white hidden xl:block">
        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Conflict Checker</h3>
        <div className="p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-[11px] font-bold flex gap-2">
          <AlertTriangle size={14} className="shrink-0 mt-0.5" /> 
          Room Conflict: CS-A and CS-B assigned to Room 102.
        </div>
      </aside>

      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4 bg-white border border-gray-200 px-4 py-2.5 rounded-xl shadow-sm">
            <Filter size={16} className="text-gray-400" />
            <select className="font-bold text-sm outline-none cursor-pointer" value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)}>
              <option value="All">All Departments</option>
              {/* TAKEN DYNAMICALLY FROM DEPARTMENTS PAGE DATA */}
              {departments.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
            </select>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="bg-[#2563EB] text-white px-6 py-2.5 rounded-xl text-xs font-black shadow-lg">+ Publish Schedule</button>
        </div>

        <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
          <div className="grid grid-cols-8 bg-gray-50/50 border-b">
            <div className="p-6 text-[10px] font-black text-gray-400 text-center uppercase tracking-widest self-center">Time</div>
            {weekDays.map(d => (
              <div key={d.name} className={`p-6 text-center border-l ${d.isToday ? 'bg-blue-50/30' : ''}`}>
                <div className={`text-[10px] font-black uppercase ${d.isToday ? 'text-blue-600' : 'text-gray-400'}`}>{d.name}</div>
                <div className={`text-sm font-black mt-1 ${d.isToday ? 'text-blue-600' : 'text-gray-900'}`}>{d.date}</div>
              </div>
            ))}
          </div>

          {timeSlots.map(time => (
            <div key={time} className="grid grid-cols-8 border-b border-gray-50 min-h-[120px]">
              <div className="p-4 text-[10px] font-bold text-gray-400 text-center flex items-center justify-center">{time}</div>
              {weekDays.map(d => {
                const lecture = filteredSchedule.find(l => l.day === d.name && l.startTime === time);
                return (
                  <div key={d.name} className="border-l border-gray-50 p-2 group relative">
                    {lecture ? (
                      <div className={`h-full w-full rounded-2xl p-3 border-l-4 shadow-sm transition-transform hover:scale-[1.02] ${getSubjectColor(lecture.subject)}`}>
                        <span className="text-[9px] font-black uppercase opacity-80">{lecture.batch}</span>
                        <h5 className="text-[11px] font-black leading-tight mt-1">{lecture.subject}</h5>
                        <div className="flex justify-between text-[9px] font-bold opacity-70 mt-2">
                          <span>{lecture.teacher}</span><span>{lecture.room}</span>
                        </div>
                      </div>
                    ) : (
                      <button onClick={() => {setSelectedSlot({day: d.name, time}); setIsModalOpen(true)}} className="w-full h-full opacity-0 group-hover:opacity-100 flex items-center justify-center text-gray-300">
                        <Plus size={20}/>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </main>

      {/* MODAL FORM */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-[32px] p-8 shadow-2xl animate-in zoom-in duration-300">
             <div className="flex justify-between mb-8 items-center font-black">
                <h3 className="text-xl">Schedule Semester Lecture</h3>
                <X className="cursor-pointer text-gray-400 hover:text-red-500" onClick={() => setIsModalOpen(false)} />
             </div>
             <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block -mb-2">Select Department</label>
                <select 
                   className="w-full bg-slate-50 p-4 rounded-xl font-bold text-sm outline-none border border-transparent focus:border-blue-500" 
                   onChange={(e) => setFormData({...formData, dept: e.target.value})}
                >
                  <option value="">Choose Department...</option>
                  {/* PULLING FROM DEPARTMENTS PROPS */}
                  {departments.map(dept => <option key={dept.id} value={dept.name}>{dept.name}</option>)}
                </select>
                
                <input placeholder="Batch (e.g. CS-A)" className="w-full bg-slate-50 p-4 rounded-xl font-bold text-sm outline-none" onChange={(e) => setFormData({...formData, batch: e.target.value})} />
                <input placeholder="Subject (e.g. DBMS)" className="w-full bg-slate-50 p-4 rounded-xl font-bold text-sm outline-none" onChange={(e) => setFormData({...formData, subject: e.target.value})} />
                
                <div className="grid grid-cols-2 gap-4">
                  <input placeholder="Teacher" className="bg-slate-50 p-4 rounded-xl font-bold text-sm outline-none" onChange={(e) => setFormData({...formData, teacher: e.target.value})} />
                  <input placeholder="Room" className="bg-slate-50 p-4 rounded-xl font-bold text-sm outline-none" onChange={(e) => setFormData({...formData, room: e.target.value})} />
                </div>
                
                <button 
                  className="w-full bg-[#2563EB] text-white py-4 rounded-2xl font-black shadow-lg shadow-blue-200 mt-4"
                  onClick={() => { onSaveLecture({...formData, day: selectedSlot.day, startTime: selectedSlot.time}); setIsModalOpen(false); }}
                >Publish Semester Schedule</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}