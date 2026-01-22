
import React from 'react';
import { School, LogIn } from 'lucide-react';

export default function Home({ onLoginClick, onSignInClick }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="bg-white/80 backdrop-blur-md p-10 rounded-[40px] shadow-2xl max-w-md w-full text-center border border-white">
        <div className="inline-flex p-5 bg-blue-600 rounded-3xl text-white mb-6 shadow-xl shadow-blue-200">
          <School size={40} />
        </div>
        
        <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tighter">Academia</h1>
        <p className="text-slate-500 mb-10 font-medium">Institutional Management System</p>
        
        <div className="space-y-4">
          {/* Main Action: Registration/Portal Access */}
          <button 
            onClick={onLoginClick} 
            className="w-full py-5 bg-blue-600 text-white rounded-2xl font-bold shadow-xl hover:bg-blue-700 transition active:scale-95 uppercase tracking-widest text-xs flex items-center justify-center gap-2"
          >
            Access Portal
          </button>

          {/* New Action: Login for existing users */}
          <button 
            onClick={onSignInClick} 
            className="w-full py-4 bg-white text-slate-700 border-2 border-slate-100 rounded-2xl font-bold hover:bg-slate-50 transition active:scale-95 uppercase tracking-widest text-[10px] flex items-center justify-center gap-2"
          >
            <LogIn size={16} className="text-blue-600" />
            Sign In to Account
          </button>
        </div>
        
        <p className="mt-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Secure Institutional Access
        </p>
      </div>
    </div>
  );
}