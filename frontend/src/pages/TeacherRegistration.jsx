import React from "react";
import { useNavigate } from "react-router-dom";

export default function TeacherRegistration({ onRegister }) {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    // Capture data from the form
    const teacherData = {
      name: formData.get("teacherName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      dept: formData.get("dept"),
      designation: formData.get("designation"),
      employeeId: formData.get("employeeId"),
      classes: formData.get("classes"),
      subjects: formData.get("subjects"),
      username: formData.get("username"),
      initial: formData.get("teacherName")?.charAt(0).toUpperCase() || "T"
    };

    // Send data to App.js
    if (onRegister) {
      onRegister(teacherData);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="flex flex-col md:flex-row bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-6xl h-auto md:h-[90vh]">

        {/* Left Hero Section */}
        <div className="hidden md:flex flex-1 flex-col justify-between bg-gradient-to-br from-purple-700 to-purple-500 text-white p-12">
          <div className="text-2xl font-extrabold tracking-wide uppercase italic">ACADEMIA CMS</div>
          <div className="mt-12">
            <h1 className="text-4xl font-extrabold leading-snug mb-6 tracking-tight">Shape the Future <br /> of Education</h1>
            <p className="text-lg opacity-80 leading-relaxed">Join our elite faculty portal and manage your classes, subjects, and students with advanced digital tools.</p>
          </div>
          <div className="mt-12 opacity-80 text-sm font-medium italic border-t border-purple-400 pt-4">
            Requires Institutional Administrator Approval
          </div>
        </div>

        {/* Right Form Section */}
        <div className="flex-1 p-8 md:p-12 overflow-y-auto custom-scrollbar">
          <div className="max-w-2xl w-full mx-auto">
            <div className="mb-8 flex justify-between items-start">
              <div>
                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Teacher Registration</h2>
                <p className="text-gray-500 mt-2 font-medium">Complete your professional profile</p>
              </div>
              <button 
                type="button" 
                onClick={() => navigate("/portal")}
                className="text-xs font-bold text-purple-600 uppercase hover:underline"
              >
                Change Role
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* Basic Info */}
              <div>
                <label className="block text-gray-700 font-bold text-sm mb-1 uppercase tracking-wide">Full Name</label>
                <input name="teacherName" type="text" placeholder="Dr. Jane Doe" required className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-purple-500 outline-none" />
              </div>

              <div>
                <label className="block text-gray-700 font-bold text-sm mb-1 uppercase tracking-wide">Email Address</label>
                <input name="email" type="email" placeholder="jane.doe@college.edu" required className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-purple-500 outline-none" />
              </div>

              <div className="col-span-2 md:col-span-1">
                <label className="block text-gray-700 font-bold text-sm mb-1 uppercase tracking-wide">Phone Number</label>
                <input name="phone" type="tel" placeholder="+1 (555) 000-0000" className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-purple-500 outline-none" />
              </div>

              <div>
                <label className="block text-gray-700 font-bold text-sm mb-1 uppercase tracking-wide">Department</label>
                <select name="dept" required className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-purple-500 outline-none">
                  <option value="Computer Science">Computer Science</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                </select>
              </div>

              {/* Academic Info */}
              <div>
                <label className="block text-gray-700 font-bold text-sm mb-1 uppercase tracking-wide">Designation</label>
                <input name="designation" type="text" placeholder="Assistant Professor" className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-purple-500 outline-none" />
              </div>

              <div>
                <label className="block text-gray-700 font-bold text-sm mb-1 uppercase tracking-wide">Employee ID</label>
                <input name="employeeId" type="text" placeholder="TCH-2026-01" className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-purple-500 outline-none" />
              </div>

              <div className="col-span-2">
                <label className="block text-gray-700 font-bold text-sm mb-1 uppercase tracking-wide">Assigned Classes</label>
                <input name="classes" type="text" placeholder="Sem 3, Sem 5, BCA-B" className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-purple-500 outline-none" />
              </div>

              <div className="col-span-2">
                <label className="block text-gray-700 font-bold text-sm mb-1 uppercase tracking-wide">Subjects</label>
                <input name="subjects" type="text" placeholder="e.g. AI, Data Structures, Calculus" className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-purple-500 outline-none" />
              </div>

              {/* Login Credentials */}
              <div className="col-span-2">
                <label className="block text-gray-700 font-bold text-sm mb-1 uppercase tracking-wide">System Username</label>
                <input name="username" type="text" placeholder="Preferred Username" className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-purple-500 outline-none" />
              </div>

              <div>
                <label className="block text-gray-700 font-bold text-sm mb-1 uppercase tracking-wide">Password</label>
                <input type="password" placeholder="••••••••" className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-purple-500 outline-none" />
              </div>

              <div>
                <label className="block text-gray-700 font-bold text-sm mb-1 uppercase tracking-wide">Confirm</label>
                <input type="password" placeholder="••••••••" className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-purple-500 outline-none" />
              </div>

              <div className="col-span-2 mt-4 pb-8">
                <button type="submit" className="w-full p-4 bg-purple-700 text-white font-black rounded-xl hover:shadow-2xl hover:bg-purple-800 transition-all duration-300 uppercase tracking-tighter text-lg">
                  Submit Access Request
                </button>
                <p className="text-center text-gray-500 mt-4 text-sm font-medium">
                  Already registered? <button type="button" onClick={() => navigate("/")} className="text-purple-600 font-black hover:underline">Log In Here</button>
                </p>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}