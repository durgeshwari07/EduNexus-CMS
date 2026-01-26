// import React from "react";
// import { useNavigate } from "react-router-dom";

// /* Floating Input Component */
// function FloatingInput({ label, name, type = "text", required = false }) {
//   return (
//     <div className="relative">
//       <input
//         type={type}
//         name={name}
//         required={required}
//         placeholder=" "
//         className="
//           peer w-full border border-gray-300 rounded-xl
//           px-4 pt-6 pb-2 text-gray-900 bg-white
//           focus:outline-none focus:border-blue-600
//           focus:ring-2 focus:ring-blue-100
//         "
//       />
//       <label
//         className="
//           absolute left-4 top-2 text-gray-400 text-sm
//           transition-all duration-200 ease-in-out
//           peer-placeholder-shown:top-5
//           peer-placeholder-shown:text-base
//           peer-placeholder-shown:text-gray-400
//           peer-focus:top-2
//           peer-focus:text-sm
//           peer-focus:text-blue-600
//         "
//       >
//         {label}
//       </label>
//     </div>
//   );
// }

// export default function AdminRegistration({ onRegister }) {
//   const navigate = useNavigate();



//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const formData = new FormData(e.target);

//     const adminData = {
//       collegeName: formData.get("collegeName"),
//       collegeCode: formData.get("collegeCode"),
//       collegeEmail: formData.get("collegeEmail"),
//       address: formData.get("address"),
//       academicYear: formData.get("academicYear"),
//       board: formData.get("board"),
//       adminName: formData.get("adminName"),
//       adminPhone: formData.get("adminPhone"),
//       adminEmail: formData.get("adminEmail"),
//     };

//     if (onRegister) {
//       onRegister(adminData.adminName);
//     }
//   };

//   return (
//     <div className="pt-16 bg-gray-100 min-h-screen">
//       <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
//         <div className="flex flex-col md:flex-row bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-6xl md:h-[90vh]">

//           {/* LEFT SECTION */}
//           <div className="hidden md:flex flex-1 flex-col justify-between bg-gradient-to-br from-blue-900 to-blue-500 text-white p-12">
//             <div className="text-2xl font-extrabold uppercase italic">
//               ACADEMIA CMS
//             </div>

//             <div className="mt-12">
//               <h1 className="text-4xl font-extrabold mb-6">
//                 Manage Your <br /> Institution with Ease
//               </h1>
//               <p className="text-lg opacity-80">
//                 Control academics, faculty, and administration from one secure platform.
//               </p>
//             </div>

//             <div className="text-sm opacity-80 border-t border-blue-400 pt-4">
//               Security-first institutional management system.
//             </div>
//           </div>

//           {/* RIGHT FORM */}
//           <div className="flex-1 p-8 md:p-12 overflow-y-auto">
//             <div className="max-w-2xl mx-auto">

//               {/* HEADER */}
//               <div className="mb-8 flex justify-between items-start">
//                 <div>
//                   <h2 className="text-3xl font-extrabold text-gray-900">
//                     Admin Registration
//                   </h2>
//                   <p className="text-gray-500 mt-2">
//                     Register your college or university
//                   </p>
//                 </div>

//                 <button
//                   onClick={() => navigate("/portal")}
//                   className="text-xs font-bold text-blue-600 uppercase hover:underline"
//                 >
//                   Change Role
//                 </button>
//               </div>

//               {/* FORM */}
//               <form
//                 onSubmit={handleSubmit}
//                 className="grid grid-cols-1 md:grid-cols-2 gap-5"
//               >
//                 <div className="col-span-2 text-sm font-bold text-blue-500 uppercase">
//                   Institutional Details
//                 </div>

//                 <div className="col-span-2">
//                 <FloatingInput label="College Name" name="collegeName" required />
//                 </div>
//                 <FloatingInput label="College Code" name="collegeCode" required />
//                 <FloatingInput label="College Email" name="collegeEmail" required />
                

//                 <div className="col-span-2">
//                   <FloatingInput label="Address / City" name="address" required />
//                 </div>

//                 <FloatingInput label="Academic Year" name="academicYear" required />

//                 {/* Board Select */}
//                 <div className="relative">
//                   <select
//                     name="board"
//                     required
//                     className="
//                       w-full border border-gray-300 rounded-xl
//                       px-4 pt-6 pb-2 text-gray-900 bg-white
//                       focus:outline-none focus:border-blue-600
//                       focus:ring-2 focus:ring-blue-100
//                     "
//                   >
//                     <option value="">Select Board</option>
//                     <option>State Board</option>
//                     <option>CBSE / ICSE</option>
//                     <option>IB</option>
//                   </select>
//                   <label className="absolute left-4 top-2 text-sm text-gray-400">
//                     Board
//                   </label>
//                 </div>

//                 <div className="col-span-2 text-sm font-bold text-blue-500 uppercase border-t pt-4">
//                   Admin Info
//                 </div>

//                 <FloatingInput label="Admin Name" name="adminName" required />
//                 <FloatingInput label="Phone Number" name="adminPhone" required />

//                 <div className="col-span-2">
//                   <FloatingInput
//                     label="Admin Email"
//                     name="adminEmail"
//                     type="email"
//                     required
//                   />
//                 </div>

//                 <div className="col-span-2 text-sm font-bold text-blue-500 uppercase border-t pt-4">
//                   Security
//                 </div>

//                 <FloatingInput label="Password" type="password" required />
//                 <FloatingInput label="Confirm Password" type="password" required />

//                 <button
//                   type="submit"
//                   className="col-span-2 mt-6 p-4 bg-blue-900 text-white font-extrabold rounded-xl hover:bg-black transition"
//                 >
//                   REGISTER INSTITUTION
//                 </button>
//               </form>

//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }









import React from "react";
import { useNavigate } from "react-router-dom";

/* Floating Input Component */
function FloatingInput({ label, name, type = "text", required = false }) {
  return (
    <div className="relative">
      <input
        type={type}
        name={name}
        required={required}
        placeholder=" "
        className="
          peer w-full border border-gray-300 rounded-xl
          px-4 pt-6 pb-2 text-gray-900 bg-white
          focus:outline-none focus:border-blue-600
          focus:ring-2 focus:ring-blue-100
        "
      />
      <label
        className="
          absolute left-4 top-2 text-gray-400 text-sm
          transition-all duration-200 ease-in-out
          peer-placeholder-shown:top-5
          peer-placeholder-shown:text-base
          peer-placeholder-shown:text-gray-400
          peer-focus:top-2
          peer-focus:text-sm
          peer-focus:text-blue-600
        "
      >
        {label}
      </label>
    </div>
  );
}

export default function AdminRegistration({ onRegister }) {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    // Security Check: Validate Passwords Match
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Creating a complete object that matches your MySQL table structure
    const adminData = {
      collegeName: formData.get("collegeName"),
      collegeCode: formData.get("collegeCode"),
      collegeEmail: formData.get("collegeEmail"),
      address: formData.get("address"),
      academicYear: formData.get("academicYear"),
      board: formData.get("board"),
      name: formData.get("adminName"),      // Mapped to SQL 'name'
      phone: formData.get("adminPhone"),    // Mapped to SQL 'phone'
      email: formData.get("adminEmail"),    // Mapped to SQL 'email'
      username: formData.get("adminEmail"), // Using email as username for login
      password: password,
    };

    // Pass the full object to App.js to trigger the API.post call
    if (onRegister) {
      onRegister(adminData);
    }
  };

  return (
    <div className="pt-16 bg-gray-100 min-h-screen">
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
        <div className="flex flex-col md:flex-row bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-6xl md:h-[90vh]">

          {/* LEFT SECTION - Branding */}
          <div className="hidden md:flex flex-1 flex-col justify-between bg-gradient-to-br from-blue-900 to-blue-500 text-white p-12">
            <div className="text-2xl font-extrabold uppercase italic">
              ACADEMIA CMS
            </div>

            <div className="mt-12">
              <h1 className="text-4xl font-extrabold mb-6">
                Manage Your <br /> Institution with Ease
              </h1>
              <p className="text-lg opacity-80">
                Control academics, faculty, and administration from one secure platform.
              </p>
            </div>

            <div className="text-sm opacity-80 border-t border-blue-400 pt-4">
              Security-first institutional management system.
            </div>
          </div>

          {/* RIGHT SECTION - Form */}
          <div className="flex-1 p-8 md:p-12 overflow-y-auto">
            <div className="max-w-2xl mx-auto">
              <div className="mb-8 flex justify-between items-start">
                <div>
                  <h2 className="text-3xl font-extrabold text-gray-900">
                    Admin Registration
                  </h2>
                  <p className="text-gray-500 mt-2">
                    Register your college or university
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-xs font-bold text-blue-600 uppercase hover:underline"
                >
                  Back to Login
                </button>
              </div>

              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="col-span-2 text-sm font-bold text-blue-500 uppercase">
                  Institutional Details
                </div>

                <div className="col-span-2">
                  <FloatingInput label="College Name" name="collegeName" required />
                </div>
                <FloatingInput label="College Code" name="collegeCode" required />
                <FloatingInput label="College Email" name="collegeEmail" type="email" required />

                <div className="col-span-2">
                  <FloatingInput label="Address / City" name="address" required />
                </div>

                <FloatingInput label="Academic Year (2025-26)" name="academicYear" required />

                <div className="relative">
                  <select
                    name="board"
                    required
                    className="w-full border border-gray-300 rounded-xl px-4 pt-6 pb-2 text-gray-900 bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 appearance-none"
                  >
                    <option value="">Select Board</option>
                    <option>State Board</option>
                    <option>CBSE / ICSE</option>
                    <option>IB / University</option>
                  </select>
                  <label className="absolute left-4 top-2 text-sm text-gray-400">Board / University</label>
                </div>

                <div className="col-span-2 text-sm font-bold text-blue-500 uppercase border-t pt-4">
                  Admin Personal Info
                </div>

                <FloatingInput label="Admin Full Name" name="adminName" required />
                <FloatingInput label="Phone Number" name="adminPhone" type="tel" required />

                <div className="col-span-2">
                  <FloatingInput label="Login Email" name="adminEmail" type="email" required />
                </div>

                <div className="col-span-2 text-sm font-bold text-blue-500 uppercase border-t pt-4">
                  Security
                </div>

                <FloatingInput label="Password" name="password" type="password" required />
                <FloatingInput label="Confirm Password" name="confirmPassword" type="password" required />

                <button
                  type="submit"
                  className="col-span-2 mt-6 p-4 bg-blue-900 text-white font-extrabold rounded-xl hover:bg-black transition shadow-lg shadow-blue-200"
                >
                  REGISTER INSTITUTION
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
