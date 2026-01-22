import React from 'react';

/**
 * StatCard Component with Hover Glow Effect
 *
 */
const StatCard = ({ icon, label, value, trend, color }) => {
  return (
    <div className="group bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#136dec]/10 hover:border-[#136dec]/40 cursor-pointer">
      <div className="flex justify-between items-start mb-4">
        {/* Icon box that changes color on group hover */}
        <div className="p-3 bg-[#136dec]/10 text-[#136dec] rounded-lg group-hover:bg-[#136dec] group-hover:text-white transition-colors duration-300">
          {icon}
        </div>
        <span className={`${color} text-xs font-bold`}>{trend}</span>
      </div>
      <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">{label}</p>
      <h4 className="text-3xl font-bold text-slate-900 mt-1">{value}</h4>
    </div>
  );
};

export default StatCard;