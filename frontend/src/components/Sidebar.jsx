import React from 'react';
import { LayoutDashboard, Building2, Users, GraduationCap, FileText, BarChart3, Settings, LogOut } from 'lucide-react';

export default function Sidebar({ userRole, currentPage, setCurrentPage, onLogout }) {
  const isAdmin = userRole === 'admin';

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, adminOnly: false },
    { id: 'departments', label: 'Departments', icon: Building2, adminOnly: false },
    { id: 'teachers', label: 'Teachers', icon: Users, adminOnly: true },
    { id: 'subjects', label: 'Subjects', icon: FileText, adminOnly: false },
    { id: 'students', label: 'Students', icon: GraduationCap, adminOnly: false },
    { id: 'documents', label: 'Documents', icon: FileText, adminOnly: false },
    { id: 'reports', label: 'Reports', icon: BarChart3, adminOnly: true },
  ];

  return (
    <aside className="w-64 border-r border-slate-200 bg-white flex flex-col h-full shrink-0">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="size-10 rounded-full bg-[#136dec] flex items-center justify-center text-white font-bold">AU</div>
          <div>
            <h1 className="text-sm font-bold leading-tight">Admin User</h1>
            <p className="text-slate-500 text-xs font-normal">System Administrator</p>
          </div>
        </div>
        <nav className="space-y-1">
          {menuItems.map((item) => {
            if (item.adminOnly && !isAdmin) return null;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  currentPage === item.id ? 'bg-[#136dec]/10 text-[#136dec] font-semibold' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon size={18} />
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
      <div className="mt-auto p-6 border-t border-slate-100">
        <div className="bg-emerald-50 text-emerald-600 px-3 py-2 rounded-lg text-[10px] font-bold uppercase mb-4 flex items-center gap-2">
          <span className="size-2 bg-emerald-500 rounded-full animate-pulse"></span> SYSTEM ONLINE
        </div>
        <button className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:text-[#136dec] w-full text-sm font-medium"><Settings size={18}/> Settings</button>
        <button onClick={onLogout} className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:text-red-500 w-full text-sm font-medium"><LogOut size={18}/> Logout</button>
      </div>
    </aside>
  );
}







// import React from 'react';
// import { 
//   LayoutDashboard, Building2, Users, GraduationCap, 
//   FileText, BarChart3, Settings, LogOut, Calendar 
// } from 'lucide-react';

// export default function Sidebar({ userRole, currentPage, setCurrentPage, onLogout }) {
//   const isAdmin = userRole === 'admin';

//   // Updated menu items to include "Weekly Schedule" as seen in your screenshots
//   const menuItems = [
//     { id: 'overview', label: 'Dashboard', icon: LayoutDashboard, adminOnly: false },
//     { id: 'schedule', label: 'Weekly Schedule', icon: Calendar, adminOnly: false },
//     { id: 'departments', label: 'Departments', icon: Building2, adminOnly: false },
//     { id: 'teachers', label: 'Staff', icon: Users, adminOnly: true },
//     { id: 'students', label: 'Students', icon: GraduationCap, adminOnly: false },
//     { id: 'reports', label: 'Reports', icon: BarChart3, adminOnly: true },
//   ];

//   return (
//     <aside className="w-64 border-r border-slate-200 bg-white flex flex-col h-full shrink-0">
//       <div className="p-6">
        
//         {/* --- NEW LOGO SECTION --- */}
//         <div 
//           className="flex items-center gap-2 mb-10 cursor-pointer"
//           onClick={() => setCurrentPage('overview')}
//         >
//           {/* Logo Icon Box */}
//           <div className="size-8 bg-[#136dec] rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-100">
//             <Building2 size={18} fill="currentColor" />
//           </div>
          
//           {/* Logo Text: UniDesk */}
//           <div className="text-[22px] font-bold tracking-tighter text-slate-800">
//             Uni<span className="text-[#136dec]">Desk</span>
//           </div>
//         </div>

//         {/* NAVIGATION LINKS */}
//         <nav className="space-y-1.5">
//           {menuItems.map((item) => {
//             if (item.adminOnly && !isAdmin) return null;
//             const Icon = item.icon;
//             const isActive = currentPage === item.id;
            
//             return (
//               <button
//                 key={item.id}
//                 onClick={() => setCurrentPage(item.id)}
//                 className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
//                   isActive 
//                     ? 'bg-[#136dec] text-white shadow-md shadow-blue-100 font-bold' 
//                     : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
//                 }`}
//               >
//                 <Icon size={19} strokeWidth={isActive ? 2.5 : 2} />
//                 <span className="text-[13px]">{item.label}</span>
//               </button>
//             );
//           })}
//         </nav>
//       </div>

//       {/* FOOTER SECTION */}
//       <div className="mt-auto p-6 border-t border-slate-50">
//         <div className="bg-emerald-50 text-emerald-600 px-3 py-2.5 rounded-xl text-[10px] font-black uppercase mb-4 flex items-center gap-2 tracking-widest">
//           <span className="size-2 bg-emerald-500 rounded-full animate-pulse"></span> 
//           System Live
//         </div>
        
//         <div className="space-y-1">
//           <button className="flex items-center gap-3 px-4 py-2 text-slate-500 hover:text-[#136dec] w-full text-sm font-bold transition-colors">
//             <Settings size={18}/> Settings
//           </button>
//           <button 
//             onClick={onLogout} 
//             className="flex items-center gap-3 px-4 py-2 text-slate-500 hover:text-red-500 w-full text-sm font-bold transition-colors"
//           >
//             <LogOut size={18}/> Logout
//           </button>
//         </div>
//       </div>
//     </aside>
//   );
// }