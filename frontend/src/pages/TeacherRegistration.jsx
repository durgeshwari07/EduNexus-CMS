<<<<<<< HEAD
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
//       dept: formData.get("dept"), // This captures the name chosen from your admin's list
//       qualification: formData.get("qualification"),
//       experience: formData.get("experience"),
//       username: formData.get("username"),
//       password: formData.get("password"),
//     };

//     if (onRegister) onRegister(teacherData);
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4 font-sans">
//       <div className="flex flex-col md:flex-row bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-5xl">
        
//         {/* Left Branding */}
//         <div className="hidden md:flex flex-1 flex-col justify-center bg-purple-700 text-white p-12">
//           <h1 className="text-4xl font-black mb-4 tracking-tighter">Add New Teacher</h1>
//           <p className="opacity-80">Assigning faculty to verified institutional departments.</p>
//         </div>

//         {/* Right Form */}
//         <div className="flex-[1.5] p-8 md:p-12">
//           <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
//             <div className="col-span-2 md:col-span-1">
//               <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name *</label>
//               <input name="teacherName" type="text" required className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50" placeholder="e.g. Dr. John Smith" />
//             </div>

//             <div className="col-span-2 md:col-span-1">
//               <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email *</label>
//               <input name="email" type="email" required className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50" placeholder="john@college.edu" />
//             </div>

//             {/* THE ADMIN-CREATED DEPARTMENT DROPDOWN */}
//             <div className="col-span-2">
//               <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Select Department *</label>
//               <select 
//                 name="dept" 
//                 required 
//                 className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-purple-500 bg-white cursor-pointer"
//               >
//                 <option value="">-- Choose from Created Departments --</option>
//                 {/* This maps exactly what the Admin created in the database */}
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
//               <input name="phone" type="tel" required className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50" placeholder="+1..." />
//             </div>

//             <div>
//               <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Qualification *</label>
//               <input name="qualification" type="text" required className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50" placeholder="e.g. M.Tech, PhD" />
//             </div>

//             <div>
//               <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Experience (Years) *</label>
//               <input name="experience" type="number" required className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50" placeholder="0" />
//             </div>

//             <div>
//               <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Username *</label>
//               <input name="username" type="text" required className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50" placeholder="login_id" />
//             </div>

//             <div className="col-span-2 md:col-span-1">
//               <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Password *</label>
//               <input name="password" type="password" required className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50" placeholder="••••••••" />
//             </div>

//             <div className="col-span-2 mt-4">
//               <button 
//                 type="submit" 
//                 disabled={departments.length === 0}
//                 className={`w-full py-3 text-white font-bold rounded-lg transition-all uppercase text-sm tracking-widest shadow-lg ${
//                   departments.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-700 hover:bg-purple-800 active:scale-95'
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

=======
>>>>>>> df0a27e457b27d604f94213b51ed7d8fa2233864
import React from "react";
import { useNavigate } from "react-router-dom";

export default function TeacherRegistration({ onRegister, departments = [] }) {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const teacherData = {
      teacherName: formData.get("teacherName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      dept: formData.get("dept"),
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
          <h1 className="text-4xl font-black mb-4 tracking-tighter">Add New Teacher</h1>
          <p className="opacity-80">
            Assigning faculty to verified institutional departments.
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
                placeholder="e.g. Dr. John Smith"
              />
            </div>

            <div className="col-span-2 md:col-span-1">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email *</label>
              <input
                name="email"
                type="email"
                required
                className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50"
                placeholder="john@college.edu"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                Select Department *
              </label>
              <select
                name="dept"
                required
                className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-purple-500 bg-white cursor-pointer"
              >
                <option value="">-- Choose from Created Departments --</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name} ({d.code})
                  </option>
                ))}
              </select>
              {departments.length === 0 && (
                <p className="text-[10px] text-red-600 mt-1 font-bold animate-pulse">
                  ⚠️ No departments found! Please create one in the Dashboard first.
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
                placeholder="+1..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Qualification *</label>
              <input
                name="qualification"
                type="text"
                required
                className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50"
                placeholder="e.g. M.Tech, PhD"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                Experience (Years) *
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
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Username *</label>
              <input
                name="username"
                type="text"
                required
                className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50"
                placeholder="login_id"
              />
            </div>

            <div className="col-span-2 md:col-span-1">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Password *</label>
              <input
                name="password"
                type="password"
                required
                className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50"
                placeholder="••••••••"
              />
            </div>

            <div className="col-span-2 mt-4">
              <button
                type="submit"
                disabled={departments.length === 0}
                className={`w-full py-3 text-white font-bold rounded-lg transition-all uppercase text-sm tracking-widest shadow-lg ${
                  departments.length === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-purple-700 hover:bg-purple-800 active:scale-95"
                }`}
              >
                Register Faculty Member
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
