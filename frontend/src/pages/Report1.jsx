import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie, Legend
} from 'recharts';
import { ArrowUp, ChevronDown } from 'lucide-react';

// --- MOCK DATA ---
const gpaData = [
  { name: 'Fall 2022', gpa: 3.4 },
  { name: 'Spring 2023', gpa: 3.5 },
  { name: 'Summer 2023', gpa: 3.58 },
  { name: 'Fall 2023', gpa: 3.65 },
  { name: 'Spring 2024', gpa: 3.70 },
  { name: 'Fall 2024', gpa: 3.72 },
];

const gradeData = [
  { grade: 'A', count: 18 },
  { grade: 'B', count: 15 },
  { grade: 'C', count: 8 },
  { grade: 'D', count: 3 },
  { grade: 'F', count: 1 },
];

const creditData = [
  { name: 'Major Requirements', value: 28, color: '#1A1A5E' },
  { name: 'General Education', value: 24, color: '#4F46E5' },
  { name: 'Electives', value: 18, color: '#818CF8' },
  { name: 'Minor Requirements', value: 12, color: '#93C5FD' },
  { name: 'Free Electives', value: 4, color: '#BFDBFE' },
];

const standingData = [
  { semester: 'Fall 2022', standing: 1 },
  { semester: 'Spring 2023', standing: 1 },
  { semester: 'Summer 2023', standing: 1 },
  { semester: 'Fall 2023', standing: 1 },
  { semester: 'Spring 2024', standing: 1 },
  { semester: 'Fall 2024', standing: 1 },
];

// --- SUB-COMPONENTS ---

const StatCard = ({ title, value, prevValue, trend }) => (
  <div className="bg-white p-4 rounded-sm border border-gray-100 shadow-sm">
    <h3 className="text-[#1A1A5E] text-sm font-semibold mb-2">{title}</h3>
    <div className="flex items-center gap-2">
      <span className="text-3xl font-bold text-slate-800">{value}</span>
      <ArrowUp className="text-green-500 w-5 h-5" strokeWidth={3} />
    </div>
    <p className="text-gray-400 text-xs mt-1">
      vs prev semester {prevValue} <span className="text-green-600 font-medium">({trend})</span>
    </p>
  </div>
);

const FulfillmentGauge = ({ title, percent }) => {
  const radius = 60;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percent / 100) * (circumference / 2);
  const rotation = (percent / 100) * 180 - 90;

  return (
    <div className="bg-white p-4 rounded-sm border border-gray-100 flex flex-col items-center shadow-sm">
      <h3 className="text-[#1A1A5E] font-bold text-xs mb-4 self-start">{title}</h3>
      <div className="relative flex items-center justify-center h-32 w-full">
        <svg height={radius * 2} width={radius * 2} className="transform -rotate-180">
          <circle stroke="#E5E7EB" fill="transparent" strokeWidth={stroke} strokeDasharray={`${circumference / 2} ${circumference}`} r={normalizedRadius} cx={radius} cy={radius} />
          <circle stroke="#4F46E5" fill="transparent" strokeWidth={stroke} strokeDasharray={`${circumference / 2} ${circumference}`} style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.5s ease' }} r={normalizedRadius} cx={radius} cy={radius} />
        </svg>
        <div className="absolute bottom-12 w-1 h-16 bg-gray-700 origin-bottom transition-transform duration-500" style={{ transform: `rotate(${rotation}deg)` }}>
          <div className="absolute top-0 -left-1 w-3 h-3 bg-gray-700 rounded-full" />
        </div>
        <div className="absolute bottom-6 flex justify-between w-32 text-[10px] text-gray-400">
          <span>0%</span><span>33%</span><span>67%</span><span>100%</span>
        </div>
        <div className="absolute bottom-0 text-center">
          <span className="text-xl font-bold">{percent}%</span>
          <p className="text-[10px] text-gray-400">Target Achievement</p>
        </div>
      </div>
    </div>
  );
};

// --- MAIN DASHBOARD ---

const Report1 = () => {
  return (
    <div className="bg-gray-50 min-h-screen p-6 font-sans overflow-y-auto">
      {/* 1. Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Student Academic Reports Dashboard</h1>
        <div className="bg-[#1A1A5E] text-white px-4 py-1 text-sm rounded shadow-md">
          Data Last Updated on | 1st Jan 2025
        </div>
      </div>

      {/* 2. Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div>
          <label className="text-xs font-bold text-blue-800 block mb-1">Start date / End date</label>
          <div className="flex gap-2">
            <input type="text" defaultValue="01/01/2023" className="w-full border p-1 text-sm rounded bg-white" />
            <input type="text" defaultValue="31/12/2024" className="w-full border p-1 text-sm rounded bg-white" />
          </div>
        </div>
        {['Semester', 'Academic Standing', 'Program'].map((label) => (
          <div key={label}>
            <label className="text-xs font-bold text-blue-800 block mb-1">{label}</label>
            <div className="relative">
              <select className="w-full border p-1 text-sm appearance-none bg-white pr-8 rounded">
                <option>All</option>
              </select>
              <ChevronDown className="absolute right-2 top-2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        ))}
      </div>

      {/* 3. KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Cumulative GPA (points)" value="3.72" prevValue="3.58" trend="+3.9%" />
        <StatCard title="Current Semester GPA (points)" value="3.85" prevValue="3.72" trend="+3.5%" />
        <StatCard title="Degree Progress (%)" value="72" prevValue="64" trend="+12.5%" />
        <StatCard title="Credits Completed (count)" value="86" prevValue="76" trend="+13.2%" />
      </div>

      {/* 4. First Charts Row (GPA & Grade Distribution) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-sm border border-gray-100 shadow-sm">
          <h3 className="text-[#1A1A5E] font-bold mb-6 text-sm uppercase tracking-wide">Semester-to-Semester GPA Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={gpaData}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis domain={[3, 4]} ticks={[3, 3.5, 4]} fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="gpa" stroke="#3B3B98" strokeWidth={3} dot={{ r: 5, fill: "#3B3B98" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-sm border border-gray-100 shadow-sm">
          <h3 className="text-[#1A1A5E] font-bold mb-6 text-sm uppercase tracking-wide">Grade Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gradeData}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="grade" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#3B3B98" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 5. Second Charts Row (Credits & Standing History) */}
      <div className="grid grid-cols-12 gap-6 mb-6">
        <div className="col-span-12 lg:col-span-4 bg-white p-6 rounded-sm border border-gray-100 shadow-sm h-[400px]">
          <h3 className="text-[#1A1A5E] font-bold mb-4 text-sm uppercase tracking-wide">Credits by Category</h3>
          <div className="h-full pb-10">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={creditData} innerRadius={60} outerRadius={80} paddingAngle={3} dataKey="value">
                  {creditData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" align="center" iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-8 bg-white p-6 rounded-sm border border-gray-100 shadow-sm h-[400px]">
          <h3 className="text-[#1A1A5E] font-bold mb-4 text-sm uppercase tracking-wide">Academic Standing History</h3>
          <div className="h-full pb-10">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={standingData}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="semester" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis domain={[-0.1, 1.5]} ticks={[0, 1]} fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="standing" fill="#1A1A5E" barSize={40} radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 6. Fulfillment Gauges Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FulfillmentGauge title="Degree Requirements Fulfillment" percent={72} />
        <FulfillmentGauge title="Prerequisite Completion Status" percent={88} />
        <FulfillmentGauge title="Electives Completed" percent={65} />
      </div>
    </div>
  );
};

export default Report1;