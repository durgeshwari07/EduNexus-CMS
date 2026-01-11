import React from "react";

const TeacherRegister = () => {
  return (
    <div className="min-h-screen flex font-sans">

      {/* LEFT PANEL */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-14 flex-col justify-between">
        
        {/* BRAND */}
        <div className="flex items-center gap-3 text-xl font-bold">
          🎓 EduNexus CMS
        </div>

        {/* MAIN TEXT */}
        <div>
          <h1 className="text-5xl font-extrabold leading-tight">
            Welcome to the <br /> Team
          </h1>
          <p className="mt-6 text-gray-300 max-w-md">
            Join our community of world-class educators and shape the future of learning.
          </p>
        </div>

        {/* FEATURES */}
        <div className="space-y-4">
          <Feature
            title="Advanced Research Facilities"
            desc="Access to cutting-edge labs and resources."
          />
          <Feature
            title="Comprehensive Health Insurance"
            desc="Full coverage for you and your family."
          />
          <Feature
            title="Professional Development Grants"
            desc="Ongoing funding for conferences and skills."
          />
          <Feature
            title="Collaborative Faculty Culture"
            desc="Connect with a network of experts."
          />
        </div>
      </div>

      {/* RIGHT FORM PANEL */}
      <div className="w-full md:w-1/2 bg-white p-10 overflow-y-auto">
        
        {/* HEADER */}
        <h2 className="text-3xl font-bold">Teacher Registration</h2>
        <p className="text-gray-500 mt-2">
          Please fill in your professional details to set up your profile.
        </p>

        {/* PERSONAL DATA */}
        <Section title="Personal Data">
          <div className="grid md:grid-cols-2 gap-4">
            <Input label="Full Name" placeholder="e.g. Dr. Sarah Jenkins" />
            <Input label="Professional Email" placeholder="sarah.j@college.edu" />
            <Input label="Contact Number" placeholder="+1 (555) 000-0000" />
            <Select
              label="Department"
              options={[
                "Computer Science",
                "Mathematics",
                "Physics",
                "Chemistry",
                "Biology",
              ]}
            />
          </div>
        </Section>

        {/* EDUCATION */}
        <Section title="Educational Qualifications">
          <div className="grid md:grid-cols-2 gap-4">
            <Input label="Highest Degree" placeholder="Ph.D. in Data Science" />
            <Input label="University" placeholder="Stanford University" />
          </div>
          <Input label="Teaching Experience (Years)" placeholder="5" />
        </Section>

        {/* DOCUMENT UPLOAD */}
        <Section title="Document Verification">
          <div className="border-2 border-dashed rounded-xl p-10 text-center bg-gray-50">
            <div className="text-4xl">☁️</div>
            <p className="font-semibold mt-3">
              Upload Appointment Letter or ID Proof
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Drag & drop or click to browse <br />
              PDF, JPG, PNG (Max 5MB)
            </p>
            <input type="file" className="hidden" />
          </div>
        </Section>

        {/* SUBMIT */}
        <button className="w-full mt-8 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
          Submit Registration
        </button>

        {/* FOOTER LINKS */}
        <div className="flex justify-center gap-6 text-sm text-gray-500 mt-6">
          <span className="cursor-pointer hover:text-blue-600">Help Center</span>
          <span className="cursor-pointer hover:text-blue-600">Privacy Policy</span>
          <span className="cursor-pointer hover:text-blue-600">Contact Support</span>
        </div>
      </div>
    </div>
  );
};

export default TeacherRegister;

/* ---------- REUSABLE COMPONENTS ---------- */

const Section = ({ title, children }) => (
  <div className="mt-10">
    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
      🔹 {title}
    </h3>
    {children}
  </div>
);

const Input = ({ label, placeholder }) => (
  <div>
    <label className="text-sm font-medium">{label}</label>
    <input
      placeholder={placeholder}
      className="mt-1 w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

const Select = ({ label, options }) => (
  <div>
    <label className="text-sm font-medium">{label}</label>
    <select className="mt-1 w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
      {options.map((opt, i) => (
        <option key={i}>{opt}</option>
      ))}
    </select>
  </div>
);

const Feature = ({ title, desc }) => (
  <div className="bg-white/10 border border-white/10 rounded-xl p-4">
    <h4 className="font-semibold">{title}</h4>
    <p className="text-sm text-gray-300 mt-1">{desc}</p>
  </div>
);
