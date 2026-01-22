
// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { ShieldCheck, GraduationCap } from 'lucide-react';

// export default function CollegeManagementSystem() {
//   const navigate = useNavigate();

//   return (
//     <div className="min-h-screen flex items-center justify-center p-6 bg-[#0f172a]">
//       <div className="max-w-4xl w-full">
//         <h2 className="text-white text-center text-4xl font-black mb-12">Select Gateway</h2>
//         <div className="grid md:grid-cols-2 gap-8">
//           <button onClick={() => navigate("/register/admin")} className="p-10 bg-white/5 border border-white/10 rounded-[32px] text-left hover:bg-white/10 transition group">
//             <ShieldCheck className="text-blue-400 mb-4" size={48} />
//             <h3 className="text-white text-2xl font-bold mb-2">Administrator</h3>
//             <p className="text-slate-400 text-sm">Full control over institutional settings.</p>
//           </button>
//           <button onClick={() => navigate("/register/teacher")} className="p-10 bg-white/5 border border-white/10 rounded-[32px] text-left hover:bg-white/10 transition group">
//             <GraduationCap className="text-purple-400 mb-4" size={48} />
//             <h3 className="text-white text-2xl font-bold mb-2">Teacher</h3>
//             <p className="text-slate-400 text-sm">Access classrooms and student data.</p>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }