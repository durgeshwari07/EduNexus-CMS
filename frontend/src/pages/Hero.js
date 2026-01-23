
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




import React from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
 <header className="hero" style={{
  width: '100%',            // Ensures it covers the full width
  padding: '200px 20px 120px', // Adds space so it doesn't look cramped
  textAlign: 'center', 
  maxWidth: '100%',         // REMOVES the "box" constraint
  margin: '0',              // Removes side margins
  background: '#ffffff',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
}}>
      <motion.span 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          display: 'inline-block',
          padding: '6px 16px',
          background: '#f1f5f9', // Light gray-blue tag background
          color: '#1a73e8',      // Blue tag text
          borderRadius: '100px',
          fontSize: '14px',
          fontWeight: '600',
          marginBottom: '24px'
        }}
      >
        2026 Academic Edition
      </motion.span>

      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{
          fontSize: 'clamp(48px, 8vw, 84px)', 
          fontWeight: 800, 
          letterSpacing: '-3px', 
          lineHeight: 1,
          color: '#000000' // FIXED: Explicitly Black text
        }}
      >
        The single source of truth for <span style={{
          background: 'linear-gradient(to right, #1a73e8, #8b5cf6)', 
          WebkitBackgroundClip: 'text', 
          WebkitTextFillColor: 'transparent'
        }}>College Records.</span>
      </motion.h1>

      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        style={{
          fontSize: '22px', 
          color: '#4b5563', // FIXED: Dark gray for visibility
          margin: '24px auto 48px', 
          maxWidth: '800px',
          lineHeight: '1.6'
        }}
      >
        Centralized student information management. From admission through graduation—secure, paperless, and instantaneous.
      </motion.p>
    </header>
  );
};

export default Hero;

