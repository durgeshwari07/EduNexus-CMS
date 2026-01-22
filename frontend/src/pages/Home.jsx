
// import React from 'react';
// import { School, LogIn } from 'lucide-react';

// export default function Home({ onLoginClick, onSignInClick }) {
//   return (
//     <div className="min-h-screen flex items-center justify-center p-6">
//       <div className="bg-white/80 backdrop-blur-md p-10 rounded-[40px] shadow-2xl max-w-md w-full text-center border border-white">
//         <div className="inline-flex p-5 bg-blue-600 rounded-3xl text-white mb-6 shadow-xl shadow-blue-200">
//           <School size={40} />
//         </div>
        
//         <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tighter">Academia</h1>
//         <p className="text-slate-500 mb-10 font-medium">Institutional Management System</p>
        
//         <div className="space-y-4">
//           {/* Main Action: Registration/Portal Access */}
//           <button 
//             onClick={onLoginClick} 
//             className="w-full py-5 bg-blue-600 text-white rounded-2xl font-bold shadow-xl hover:bg-blue-700 transition active:scale-95 uppercase tracking-widest text-xs flex items-center justify-center gap-2"
//           >
//             Access Portal
//           </button>

//           {/* New Action: Login for existing users */}
//           <button 
//             onClick={onSignInClick} 
//             className="w-full py-4 bg-white text-slate-700 border-2 border-slate-100 rounded-2xl font-bold hover:bg-slate-50 transition active:scale-95 uppercase tracking-widest text-[10px] flex items-center justify-center gap-2"
//           >
//             <LogIn size={16} className="text-blue-600" />
//             Sign In to Account
//           </button>
//         </div>
        
//         <p className="mt-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
//           Secure Institutional Access
//         </p>
//       </div>
//     </div>
//   );
// }




import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, GraduationCap, X } from 'lucide-react';

export default function Home({ onSignInClick }) {
  const navigate = useNavigate();
  const [showGateway, setShowGateway] = useState(false);

  return (
    <div className="min-h-screen bg-[#0f172a] relative overflow-hidden font-sans">
      {/* 1. TOP NAVIGATION */}
     // src/pages/Home.jsx
<nav className="flex justify-between items-center px-10 py-6 relative z-10">
  <div className="text-white font-black text-2xl tracking-tighter">COLLEGE.OS</div>
  <div className="flex items-center gap-4">
    {/* SIGN IN LINK */}
    <button onClick={onSignInClick} className="text-slate-400 font-bold hover:text-white transition-all mr-4 text-sm">
      Login
    </button>
    
    {/* DIRECT ADMIN REGISTER */}
    <button 
      onClick={() => navigate("/register/admin")} 
      className="bg-white/5 border border-white/10 text-white px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all"
    >
      Admin Register
    </button>

    {/* DIRECT TEACHER REGISTER */}
    <button 
      onClick={() => navigate("/register/teacher")} 
      className="bg-[#136dec] text-white px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-all"
    >
      Teacher Register
    </button>
  </div>
</nav>
      {/* 2. HERO CONTENT (Existing content) */}
      <div className="flex flex-col items-center justify-center pt-20 text-center relative z-10">
        <h1 className="text-7xl font-black text-white tracking-tighter mb-6">
          The Operating System <br /> for Modern Education.
        </h1>
      </div>

      {/* 3. GATEWAY MODAL (Your Code Integrated) */}
      {showGateway && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-[#0f172a]/80 backdrop-blur-xl animate-in fade-in duration-300" 
            onClick={() => setShowGateway(false)} 
          />
          
          {/* Selection Card */}
          <div className="max-w-4xl w-full relative z-10 animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-12">
               <h2 className="text-white text-4xl font-black">Select Gateway</h2>
               <button onClick={() => setShowGateway(false)} className="text-slate-500 hover:text-white transition-colors">
                 <X size={32} />
               </button>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <button 
                onClick={() => navigate("/register/admin")} 
                className="p-10 bg-white/5 border border-white/10 rounded-[32px] text-left hover:bg-white/10 hover:border-blue-500/50 transition-all group"
              >
                <ShieldCheck className="text-blue-400 mb-4 group-hover:scale-110 transition-transform" size={48} />
                <h3 className="text-white text-2xl font-bold mb-2">Administrator</h3>
                <p className="text-slate-400 text-sm font-medium">Full control over institutional settings, departments, and faculty approval.</p>
              </button>

              <button 
                onClick={() => navigate("/register/teacher")} 
                className="p-10 bg-white/5 border border-white/10 rounded-[32px] text-left hover:bg-white/10 hover:border-purple-500/50 transition-all group"
              >
                <GraduationCap className="text-purple-400 mb-4 group-hover:scale-110 transition-transform" size={48} />
                <h3 className="text-white text-2xl font-bold mb-2">Teacher</h3>
                <p className="text-slate-400 text-sm font-medium">Access your classrooms, manage attendance, and view student performance data.</p>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}