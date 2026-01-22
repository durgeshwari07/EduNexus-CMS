// import React from "react";
// import { useNavigate } from "react-router-dom";

// export default function AdminRegistration({ onRegister }) {
//   const navigate = useNavigate();

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const formData = new FormData(e.target);
    
//     // Joint Logic: Capture admin data
//     const adminData = {
//       collegeName: formData.get("collegeName"),
//       collegeEmail: formData.get("collegeEmail"),
//       collegeCode: formData.get("collegeCode"),
//       address: formData.get("address"),
//       academicYear: formData.get("academicYear"),
//       board: formData.get("board"),
//       adminName: formData.get("adminName"),
//       adminPhone: formData.get("adminPhone"),
//       adminEmail: formData.get("adminEmail"),
//     };

//     // This updates the role and logs the admin in within App.js
//     if (onRegister) {
//       onRegister(adminData.adminName);
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
//       <div className="flex flex-col md:flex-row bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-6xl h-auto md:h-[90vh]">

//         {/* Left Hero Section */}
//         <div className="hidden md:flex flex-1 flex-col justify-between bg-gradient-to-br from-blue-900 to-blue-500 text-white p-12">
//           <div className="text-2xl font-extrabold tracking-wide uppercase italic">ACADEMIA CMS</div>
//           <div className="mt-12">
//             <h1 className="text-4xl font-extrabold leading-snug mb-6 tracking-tight">Manage Your <br /> Institution with Ease</h1>
//             <p className="text-lg opacity-80 leading-relaxed">Take full control of your college operations, from academic year setups to faculty management, all in one secure portal.</p>
//           </div>
//           <div className="mt-12 opacity-80 text-sm font-medium border-t border-blue-400 pt-4">
//             Security-first institutional management system.
//           </div>
//         </div>

//         {/* Right Form Section */}
//         <div className="flex-1 p-8 md:p-12 overflow-y-auto custom-scrollbar">
//           <div className="max-w-2xl w-full mx-auto">
//             <div className="mb-8 flex justify-between items-start">
//               <div>
//                 <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Admin Registration</h2>
//                 <p className="text-gray-500 mt-2 font-medium">Register your college or university</p>
//               </div>
//               {/* <button 
//                 type="button" 
//                 onClick={() => navigate("/home")}
//                 className="text-xs font-bold text-blue-600 uppercase hover:underline"
//               >
//                 Change Role
//               </button> */}
//             </div>

//             <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">

//               {/* Institutional Details */}
//               <div className="col-span-2 text-sm font-bold text-blue-500 uppercase tracking-wide mt-2">Institutional Details</div>

//               <div>
//                 <label className="block text-gray-700 font-bold text-sm mb-1 uppercase">College Name</label>
//                 <input name="collegeName" type="text" placeholder="e.g. Imperial Institute" required className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none" />
//               </div>
              
//               <div>
//                 <label className="block text-gray-700 font-bold text-sm mb-1 uppercase">College Email </label>
//                 <input name="collegeEmail" type="email" placeholder="e.g. info@imperial.edu" required className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none" />
//               </div>

//               <div>
//                 <label className="block text-gray-700 font-bold text-sm mb-1 uppercase">College Code / ID</label>
//                 <input name="collegeCode" type="text" placeholder="e.g. CLG-2026-X" required className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none" />
//               </div>

//               <div className="col-span-2 text-sm">
//                 <label className="block text-gray-700 font-bold text-sm mb-1 uppercase">College Address / City</label>
//                 <input name="address" type="text" placeholder="123 Education Lane, New York" required className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none" />
//               </div>

//               <div>
//                 <label className="block text-gray-700 font-bold text-sm mb-1 uppercase">Academic Year</label>
//                 <input name="academicYear" type="text" placeholder="2025-26" required className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none" />
//               </div>

//               <div>
//                 <label className="block text-gray-700 font-bold text-sm mb-1 uppercase">College Board</label>
//                 <select name="board" required defaultValue="" className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none">
//                   <option value="" disabled>Select Board</option>
//                   <option>State Board</option>
//                   <option>CBSE / ICSE</option>
//                   <option>International Baccalaureate</option>
//                 </select>
//               </div>

//               {/* Admin Info */}
//               <div className="col-span-2 text-sm font-bold text-blue-500 uppercase tracking-wide mt-4 border-t border-gray-100 pt-4">Admin Personal Info</div>

//               <div>
//                 <label className="block text-gray-700 font-bold text-sm mb-1 uppercase">Admin Full Name</label>
//                 <input name="adminName" type="text" placeholder="Johnathan Doe" required className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none" />
//               </div>

//               <div>
//                 <label className="block text-gray-700 font-bold text-sm mb-1 uppercase">Phone Number</label>
//                 <input name="adminPhone" type="tel" placeholder="+1 (555) 000-0000" required className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none" />
//               </div>

//               <div className="col-span-2">
//                 <label className="block text-gray-700 font-bold text-sm mb-1 uppercase">Admin Email</label>
//                 <input name="adminEmail" type="email" placeholder="admin@college.edu" required className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none" />
//               </div>

//               {/* Security */}
//               <div className="col-span-2 text-sm font-bold text-blue-500 uppercase tracking-wide mt-4 border-t border-gray-100 pt-4">Security Credentials</div>

//               <div>
//                 <label className="block text-gray-700 font-bold text-sm mb-1 uppercase">Password</label>
//                 <input type="password" placeholder="••••••••" required className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none" />
//               </div>

//               <div>
//                 <label className="block text-gray-700 font-bold text-sm mb-1 uppercase">Confirm</label>
//                 <input type="password" placeholder="••••••••" required className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none" />
//               </div>

//               <div className="col-span-2 mt-6 pb-8">
//                 <button type="submit" className="w-full p-4 bg-blue-900 text-white font-extrabold rounded-xl hover:shadow-2xl hover:bg-black transition-all duration-300 uppercase tracking-tighter text-lg">
//                   REGISTER INSTITUTION
//                 </button>
//                 <p className="text-center text-gray-500 mt-4 text-sm font-medium">
//                   Already registered? <button type="button" onClick={() => navigate("/")} className="text-blue-500 font-black hover:underline">Log In Here</button>
//                 </p>
//               </div>

//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



import React from "react";
import { useNavigate } from "react-router-dom";

export default function AdminRegistration({ onRegister }) {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    if (data.password !== data.confirmPassword) return alert("Passwords mismatch");

    try {
      const response = await fetch('http://localhost:5000/api/register/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const res = await response.json();
      if (res.success) {
        onRegister(data.adminName);
        navigate('/dashboard');
      } else { alert(res.error); }
    } catch (err) { alert("Server Error"); }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="flex flex-col md:flex-row bg-white rounded-[32px] shadow-2xl overflow-hidden w-full max-w-6xl md:h-[90vh]">
        <div className="hidden md:flex flex-1 flex-col justify-between bg-gradient-to-br from-blue-900 to-blue-500 text-white p-12">
          <div className="text-2xl font-black italic tracking-tighter">ACADEMIA CMS</div>
          <div>
            <h1 className="text-4xl font-black mb-6">Manage Your <br /> Institution</h1>
            <p className="opacity-80">Full control over institutional settings and faculty portal.</p>
          </div>
          <div className="border-t border-white/20 pt-4 text-xs font-bold uppercase tracking-widest opacity-60">Security Encrypted</div>
        </div>
        
        <div className="flex-1 p-12 overflow-y-auto">
          <h2 className="text-3xl font-black text-slate-900">Admin Registration</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mt-8">
            <input name="collegeName" placeholder="College Name" className="col-span-2 p-3 bg-slate-50 border rounded-xl" required />
            <input name="collegeEmail" type="email" placeholder="College Email" className="p-3 bg-slate-50 border rounded-xl" required />
            <input name="collegeCode" placeholder="College Code" className="p-3 bg-slate-50 border rounded-xl" required />
            <input name="address" placeholder="City/Address" className="col-span-2 p-3 bg-slate-50 border rounded-xl" required />
            <input name="academicYear" placeholder="2025-26" className="p-3 bg-slate-50 border rounded-xl" required />
            <select name="board" className="p-3 bg-slate-50 border rounded-xl" required>
              <option value="">Select Board</option>
              <option>State Board</option><option>CBSE</option>
            </select>
            <div className="col-span-2 text-blue-500 font-black text-[10px] uppercase mt-4">Personal Info</div>
            <input name="adminName" placeholder="Admin Full Name" className="p-3 bg-slate-50 border rounded-xl" required />
            <input name="adminPhone" placeholder="Phone Number" className="p-3 bg-slate-50 border rounded-xl" required />
            <input name="adminEmail" type="email" placeholder="Personal Email" className="col-span-2 p-3 bg-slate-50 border rounded-xl" required />
            <input name="password" type="password" placeholder="Password" className="p-3 bg-slate-50 border rounded-xl" required />
            <input name="confirmPassword" type="password" placeholder="Confirm" className="p-3 bg-slate-50 border rounded-xl" required />
            <button type="submit" className="col-span-2 p-4 bg-blue-900 text-white font-black rounded-xl hover:bg-black transition-all">REGISTER INSTITUTION</button>
          </form>
        </div>
      </div>
    </div>
  );
}