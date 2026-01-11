import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ShieldCheck, GraduationCap } from 'lucide-react';

export default function Login({ onLogin, approvedTeachers }) {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [selectedRole, setSelectedRole] = useState("admin"); // Default to admin

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");

    if (selectedRole === "admin") {
      // Admin Login Check
      if (email === "admin@college.edu" && password === "admin123") {
        onLogin('admin', { name: "System Administrator", email });
      } else {
        setError("Invalid Admin credentials.");
      }
    } else {
      // Teacher Login Check (Checks only approved teachers)
      const teacher = approvedTeachers.find(
        (t) => t.email === email && t.password === password
      );

      if (teacher) {
        onLogin('teacher', teacher);
      } else {
        setError("Teacher account not found, incorrect password, or pending approval.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-6">
      <div className="bg-white rounded-[40px] shadow-2xl p-10 max-w-md w-full animate-in fade-in zoom-in duration-300">
        <h2 className="text-3xl font-black text-slate-900 mb-2">Login</h2>
        <p className="text-slate-500 mb-8 font-medium">Select your role and sign in</p>

        {/* Role Selector Tabs */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-8 border border-slate-200">
          <button
            onClick={() => {setSelectedRole("admin"); setError("");}}
            className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 text-xs font-black transition-all ${
              selectedRole === "admin" ? "bg-white text-blue-600 shadow-md" : "text-slate-500"
            }`}
          >
            <ShieldCheck size={16} /> Admin
          </button>
          <button
            onClick={() => {setSelectedRole("teacher"); setError("");}}
            className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 text-xs font-black transition-all ${
              selectedRole === "teacher" ? "bg-white text-purple-600 shadow-md" : "text-slate-500"
            }`}
          >
            <GraduationCap size={16} /> Teacher
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-xl text-[10px] font-black uppercase tracking-widest mb-6 border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 text-slate-400" size={18} />
              <input name="email" type="email" required className="w-full bg-slate-50 border-none rounded-2xl p-4 pl-12 text-sm focus:ring-2 focus:ring-blue-600 outline-none" placeholder="name@college.edu" />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 text-slate-400" size={18} />
              <input name="password" type="password" required className="w-full bg-slate-50 border-none rounded-2xl p-4 pl-12 text-sm focus:ring-2 focus:ring-blue-600 outline-none" placeholder="••••••••" />
            </div>
          </div>

          <button 
            type="submit" 
            className={`w-full py-5 text-white rounded-2xl font-bold shadow-xl transition active:scale-95 uppercase tracking-widest text-xs mt-4 ${
              selectedRole === "admin" ? "bg-blue-600 hover:bg-blue-700 shadow-blue-100" : "bg-purple-600 hover:bg-purple-700 shadow-purple-100"
            }`}
          >
            Login as {selectedRole}
          </button>

          <button 
            type="button"
            onClick={() => navigate('/')}
            className="w-full text-center text-slate-400 text-[10px] font-bold uppercase tracking-widest hover:text-slate-600"
          >
            ← Back to Home
          </button>
        </form>
      </div>
    </div>
  );
}