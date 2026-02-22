import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { User, Mail, Phone, Briefcase, GraduationCap, Lock, ShieldCheck, ArrowRight, CheckCircle2, Clock, CheckCircle } from "lucide-react";

export default function TeacherRegistration({ onRegister, departments: propDepartments = [] }) {
  const navigate = useNavigate();
  const [localDepts, setLocalDepts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false); // Track if registration is done

  useEffect(() => {
    const getDepts = async () => {
      if (propDepartments.length === 0) {
        try {
          const res = await axios.get('http://localhost:5000/api/dashboard/data');
          setLocalDepts(res.data.departments || []);
        } catch (err) {
          console.error("Could not load departments.");
        }
      }
    };
    getDepts();
  }, [propDepartments]);

  const displayDepts = propDepartments.length > 0 ? propDepartments : localDepts;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.target);

    const teacherData = {
      first_name: formData.get("first_name"),
      middle_name: formData.get("middle_name"),
      last_name: formData.get("last_name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      dept_id: formData.get("dept"),
      employmentType: formData.get("employmentType"),
      qualification: formData.get("qualification"),
      experience: formData.get("experience"),
      username: formData.get("username"),
      password: formData.get("password"),
      is_approved: 0 // New field for approval logic
    };

    if (onRegister) {
      const result = await onRegister(teacherData);
      // Assuming onRegister returns true or success on backend response
      setIsSubmitted(true); 
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center p-4 md:p-8 font-sans">
      <div className="flex flex-col md:flex-row bg-white rounded-[2.5rem] shadow-2xl overflow-hidden w-full max-w-6xl border border-slate-100">
        
        {/* --- LEFT SIDE: THE INFO PANEL --- */}
        <div className="flex-1 bg-[#136dec] p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 size-64 bg-white/10 rounded-full -translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 size-48 bg-purple-500/20 rounded-full translate-y-1/2 translate-x-1/2 blur-2xl"></div>

          <div className="relative z-10">
            <div className="size-14 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center mb-8 border border-white/30">
              <ShieldCheck size={32} strokeWidth={2.5} />
            </div>
            <h1 className="text-4xl font-black mb-6 leading-tight uppercase tracking-tighter">
              Institutional <br />Access.
            </h1>
            <p className="text-blue-100 text-base leading-relaxed opacity-90 mb-8">
              Join a secure ecosystem designed for streamlined academic management and real-time student performance tracking.
            </p>

            <div className="space-y-6">
              {[
                { title: "Department Sync", desc: "Direct integration with college departments." },
                { title: "Admin Verification", desc: "Secure vetting process for all new faculty." },
                { title: "Result Management", desc: "Automated ledger systems for grade entry." }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <CheckCircle2 className="shrink-0 text-blue-300" size={20} />
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-wider">{item.title}</h4>
                    <p className="text-xs text-blue-100 opacity-70">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 pt-10 border-t border-white/10 mt-12">
            <div className="flex items-center gap-3">
              <div className="size-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-200">System Gateway Active</span>
            </div>
          </div>
        </div>

        {/* --- RIGHT SIDE: THE FORM --- */}
        <div className="flex-[1.6] p-8 md:p-12 bg-white flex flex-col justify-center">
          
          {!isSubmitted ? (
            <>
              <div className="mb-8">
                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Faculty Registration</h2>
                <p className="text-slate-500 text-sm font-medium">Initialize your academic profile within the CMS network.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* NAME ROW */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1">First Name</label>
                    <input required name="first_name" type="text" className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-50 rounded-xl outline-none focus:border-[#136dec] focus:bg-white transition-all text-sm font-bold text-slate-800" placeholder="John" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Middle Name</label>
                    <input name="middle_name" type="text" className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-50 rounded-xl outline-none focus:border-[#136dec] focus:bg-white transition-all text-sm font-bold text-slate-800" placeholder="Optional" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Last Name</label>
                    <input required name="last_name" type="text" className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-50 rounded-xl outline-none focus:border-[#136dec] focus:bg-white transition-all text-sm font-bold text-slate-800" placeholder="Doe" />
                  </div>
                </div>

                {/* CONTACT ROW */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Official Email</label>
                    <input required name="email" type="email" className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-50 rounded-xl outline-none focus:border-[#136dec] focus:bg-white transition-all text-sm font-bold text-slate-800" placeholder="j.doe@college.edu" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Contact Number</label>
                    <input required name="phone" type="tel" maxLength="10" className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-50 rounded-xl outline-none focus:border-[#136dec] focus:bg-white transition-all text-sm font-bold text-slate-800" placeholder="9876543210" />
                  </div>
                </div>

                {/* DEPARTMENT & EXPERIENCE */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                  <div className="md:col-span-8 space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Assigned Department</label>
                    <select required name="dept" className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-50 rounded-xl outline-none focus:border-[#136dec] focus:bg-white transition-all text-sm font-bold text-slate-700 cursor-pointer">
                      <option value="">-- Choose Department --</option>
                      {displayDepts.map((d) => (
                        <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-4 space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Years of Exp.</label>
                    <input required name="experience" type="number" className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-50 rounded-xl outline-none focus:border-[#136dec] focus:bg-white transition-all text-sm font-bold text-slate-800" placeholder="0" />
                  </div>
                </div>

                {/* EMPLOYMENT & QUALIFICATION */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Employment Type</label>
                    <select name="employmentType" className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-50 rounded-xl outline-none focus:border-[#136dec] focus:bg-white transition-all text-sm font-bold text-slate-700">
                      <option value="Permanent">Permanent</option>
                      <option value="Lecture-based">Lecture-based</option>
                      <option value="Contract-based">Contract-based</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Qualification</label>
                    <input required name="qualification" type="text" className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-50 rounded-xl outline-none focus:border-[#136dec] focus:bg-white transition-all text-sm font-bold text-slate-800" placeholder="e.g. M.Tech, PhD" />
                  </div>
                </div>

                {/* CREDENTIALS */}
                <div className="pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Username</label>
                    <input required name="username" type="text" className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-50 rounded-xl outline-none focus:border-[#136dec] focus:bg-white transition-all text-sm font-bold text-slate-800" placeholder="Create ID" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Password</label>
                    <input required name="password" type="password" className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-50 rounded-xl outline-none focus:border-[#136dec] focus:bg-white transition-all text-sm font-bold text-slate-800" placeholder="••••••••" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || displayDepts.length === 0}
                  className={`w-full py-4 rounded-xl text-white font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-100 mt-4 ${
                    isLoading || displayDepts.length === 0
                      ? "bg-slate-300 cursor-not-allowed"
                      : "bg-[#136dec] hover:bg-[#0f56bc] active:scale-95"
                  }`}
                >
                  {isLoading ? "Validating..." : "Register Faculty Account"}
                  {!isLoading && <ArrowRight size={18} />}
                </button>
              </form>
            </>
          ) : (
            /* --- THE WAITING MESSAGE (After Register) --- */
            <div className="text-center space-y-6">
              <div className="size-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle size={48} />
              </div>
              <div>
                <h2 className="text-3xl font-black text-slate-900 uppercase">Application Sent!</h2>
                <p className="text-slate-500 font-medium mt-2 max-w-xs mx-auto">
                  Your profile is now under review by the **College Admin**. You can log in once your account is approved.
                </p>
              </div>
              <button 
                onClick={() => navigate("/login")}
                className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-black transition-all"
              >
                Go to Login
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}