// import React from "react";
// import { useNavigate } from "react-router-dom";

// export default function TeacherRegistration({ onRegister, departments = [] }) {
//   const navigate = useNavigate();

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const formData = new FormData(e.target);

//     const teacherData = {
//       teacherName: formData.get("teacherName"),
//       email: formData.get("email"),
//       phone: formData.get("phone"),
//       dept: formData.get("dept"),
//       qualification: formData.get("qualification"),
//       experience: formData.get("experience"),
//       username: formData.get("username"),
//       password: formData.get("password"),
//     };

//       if (onRegister) onRegister(teacherData);
//   };
//   //   if (onRegister) onRegister(teacherData);
//   // };

//   return (
//     <div className="pt-16 bg-gray-100 min-h-screen flex items-center justify-center">
//       <div className="flex flex-col md:flex-row bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-5xl">
        
//         {/* Left Branding */}
//         <div className="hidden md:flex flex-1 flex-col justify-center bg-purple-700 text-white p-12">
//           <h1 className="text-4xl font-black mb-4 tracking-tighter">Add New Teacher</h1>
//           <p className="opacity-80">
//             Assigning faculty to verified institutional departments.
//           </p>
//         </div>

//         {/* Right Form */}
//         <div className="flex-[1.5] p-8 md:p-12 flex flex-col justify-center">
//           <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
//             <div className="col-span-2 md:col-span-1">
//               <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name *</label>
//               <input
//                 name="teacherName"
//                 type="text"
//                 required
//                 className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50"
//                 placeholder="e.g. Dr. John Smith"
//               />
//             </div>

//             <div className="col-span-2 md:col-span-1">
//               <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email *</label>
//               <input
//                 name="email"
//                 type="email"
//                 required
//                 className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50"
//                 placeholder="john@college.edu"
//               />
//             </div>

//             <div className="col-span-2">
//               <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
//                 Select Department *
//               </label>
//               <select
//                 name="dept"
//                 required
//                 className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-purple-500 bg-white cursor-pointer"
//               >
//                 <option value="">-- Choose from Created Departments --</option>
//                 {departments.map((d) => (
//                   <option key={d.id} value={d.name}>
//                     {d.name} ({d.code})
//                   </option>
//                 ))}
//               </select>
//               {departments.length === 0 && (
//                 <p className="text-[10px] text-red-600 mt-1 font-bold animate-pulse">
//                   ⚠️ No departments found! Please create one in the Dashboard first.
//                 </p>
//               )}
//             </div>

//             <div>
//               <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Phone *</label>
//               <input
//                 name="phone"
//                 type="tel"
//                 required
//                 className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50"
//                 placeholder="+1..."
//               />
//             </div>

//             <div>
//               <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Qualification *</label>
//               <input
//                 name="qualification"
//                 type="text"
//                 required
//                 className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50"
//                 placeholder="e.g. M.Tech, PhD"
//               />
//             </div>

//             <div>
//               <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
//                 Experience (Years) *
//               </label>
//               <input
//                 name="experience"
//                 type="number"
//                 required
//                 className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50"
//                 placeholder="0"
//               />
//             </div>

//             <div>
//               <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Username *</label>
//               <input
//                 name="username"
//                 type="text"
//                 required
//                 className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50"
//                 placeholder="login_id"
//               />
//             </div>

//             <div className="col-span-2 md:col-span-1">
//               <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Password *</label>
//               <input
//                 name="password"
//                 type="password"
//                 required
//                 className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50"
//                 placeholder="••••••••"
//               />
//             </div>

//             <div className="col-span-2 mt-4">
//               <button
//                 type="submit"
//                 disabled={departments.length === 0}
//                 className={`w-full py-3 text-white font-bold rounded-lg transition-all uppercase text-sm tracking-widest shadow-lg ${
//                   departments.length === 0
//                     ? "bg-gray-400 cursor-not-allowed"
//                     : "bg-purple-700 hover:bg-purple-800 active:scale-95"
//                 }`}
//               >
//                 Register Faculty Member
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }






import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function TeacherRegistration({ onRegister, departments: propDepartments = [] }) {
  const navigate = useNavigate();
  const [localDepts, setLocalDepts] = useState([]);

  // --- Logic: Fallback Fetch ---
  // If the 'departments' prop is empty (e.g. user is not logged in), 
  // we fetch them directly so the registration form works for new teachers.
  useEffect(() => {
    const getDepts = async () => {
      if (propDepartments.length === 0) {
        try {
          const res = await axios.get('http://localhost:5000/api/dashboard/data');
          setLocalDepts(res.data.departments || []);
        } catch (err) {
          console.error("Could not load departments for registration.");
        }
      }
    };
    getDepts();
  }, [propDepartments]);

  const displayDepts = propDepartments.length > 0 ? propDepartments : localDepts;

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    // Using 'dept_id' to ensure relational integrity with your MySQL table
    const teacherData = {
      teacherName: formData.get("teacherName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      dept_id: formData.get("dept"), // Captures the ID from the select value
      qualification: formData.get("qualification"),
      experience: formData.get("experience"),
      username: formData.get("username"),
      password: formData.get("password"),
    };

    if (onRegister) onRegister(teacherData);
  };

  return (
    <div className="pt-16 bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="flex flex-col md:flex-row bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-5xl">
        
        {/* Left Branding */}
        <div className="hidden md:flex flex-1 flex-col justify-center bg-purple-700 text-white p-12">
          <h1 className="text-4xl font-black mb-4 tracking-tighter uppercase">Faculty Join</h1>
          <p className="opacity-80 text-lg">
            Request to join a verified institutional department. Your account will require admin approval.
          </p>
        </div>

        {/* Right Form */}
        <div className="flex-[1.5] p-8 md:p-12 flex flex-col justify-center">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="col-span-2 md:col-span-1">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name *</label>
              <input
                name="teacherName"
                type="text"
                required
                className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50"
                placeholder="e.g. Dr. Jane Doe"
              />
            </div>

            <div className="col-span-2 md:col-span-1">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Official Email *</label>
              <input
                name="email"
                type="email"
                required
                className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50"
                placeholder="jane@college.edu"
              />
            </div>

            {/* --- UPDATED DEPARTMENT SELECT --- */}
            <div className="col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                Assigned Department *
              </label>
              <select
                name="dept"
                required
                className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-purple-500 bg-white cursor-pointer font-bold text-slate-700"
              >
                <option value="">-- Choose your Department --</option>
                {displayDepts.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.code})
                  </option>
                ))}
              </select>
              {displayDepts.length === 0 && (
                <p className="text-[10px] text-red-600 mt-2 font-black animate-pulse uppercase tracking-widest">
                  ⚠️ Error: Departments not loaded. Ensure Server is Online.
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Phone *</label>
              <input
                name="phone"
                type="tel"
                required
                className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50"
                placeholder="+91..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Highest Qualification *</label>
              <input
                name="qualification"
                type="text"
                required
                className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50"
                placeholder="e.g. PhD in CS"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                Years of Experience *
              </label>
              <input
                name="experience"
                type="number"
                required
                className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Choose Username *</label>
              <input
                name="username"
                type="text"
                required
                className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50"
                placeholder="Unique ID"
              />
            </div>

            <div className="col-span-2 md:col-span-1">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Set Password *</label>
              <input
                name="password"
                type="password"
                required
                className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50"
                placeholder="••••••••"
              />
            </div>

            <div className="col-span-2 mt-6">
              <button
                type="submit"
                disabled={displayDepts.length === 0}
                className={`w-full py-4 text-white font-black rounded-xl transition-all uppercase text-sm tracking-widest shadow-xl shadow-purple-200 ${
                  displayDepts.length === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-purple-700 hover:bg-purple-800 active:scale-95"
                }`}
              >
                Submit Registration Request
              </button>
              <p className="text-center text-[10px] text-gray-400 font-bold mt-4 uppercase tracking-tighter">
                By registering, you agree to institutional data privacy terms.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}