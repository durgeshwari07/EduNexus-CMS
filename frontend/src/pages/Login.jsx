import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Lock, Mail, ArrowRight, ChevronLeft } from "lucide-react";

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const [step, setStep] = useState("login"); // login | otp
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [tempUser, setTempUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle Input Changes
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  // Stage 1: Verify Credentials
  const handleCredentialSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/login/verify-credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const result = await res.json();

      if (result.requiresOtp) {
        setTempUser(result.tempUser);
        setStep("otp");
      } else {
        setError(result.message || "Access Denied");
      }
    } catch (err) {
      setError("Database connection failed.");
    } finally {
      setLoading(false);
    }
  };

  // Stage 2: Verify OTP
  const handleOtpVerify = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/login/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp: otp.join(""), tempUser })
      });
      const result = await res.json();

      if (result.success) {
        // Access Granted - Sync with App.js
        onLogin(result.role, result.user);
      } else {
        setError("Invalid Security Code");
      }
    } catch (err) {
      setError("Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP digit entry
  const updateOtp = (val, index) => {
    if (!/^[0-9]?$/.test(val)) return;
    const nextOtp = [...otp];
    nextOtp[index] = val;
    setOtp(nextOtp);
    if (val && index < 3) document.getElementById(`otp-${index + 1}`).focus();
  };

  return (
    <div className="login-viewport">
      <style>{twinkleStyles}</style>
      
      <div className="glass-container">
        <div className="form-slider" style={{ transform: step === "otp" ? "translateX(-50%)" : "translateX(0)" }}>
          
          {/* PANEL 1: CREDENTIALS */}
          <div className="auth-panel">
            <div className="icon-badge"><Lock size={20} /></div>
            <h2 className="brand-title">COLLEGE.OS</h2>
            <p className="brand-sub">Secure Gateway for Faculty & Admins</p>
            
            {error && <div className="error-pill">{error}</div>}

            <form onSubmit={handleCredentialSubmit} className="input-stack">
              <div className="input-group">
                <Mail className="input-icon" size={18} />
                <input name="email" type="email" placeholder="Institutional Email" onChange={handleInputChange} required />
              </div>
              <div className="input-group">
                <ShieldCheck className="input-icon" size={18} />
                <input name="password" type="password" placeholder="Password" onChange={handleInputChange} required />
              </div>
              <button type="submit" className="action-btn" disabled={loading}>
                {loading ? "Authenticating..." : "Continue"} <ArrowRight size={16} />
              </button>
            </form>
            <button onClick={() => navigate("/")} className="text-btn">Return to Portal</button>
          </div>

          {/* PANEL 2: TWINKLE OTP */}
          <div className="auth-panel">
            <div className="icon-badge otp-badge"><ShieldCheck size={20} /></div>
            <h2 className="brand-title">Verification</h2>
            <p className="brand-sub">Enter the 4-digit code (Default: 1234)</p>
            
            <div className="otp-row">
              {otp.map((d, i) => (
                <input
                  key={i} id={`otp-${i}`} maxLength={1} value={d}
                  onChange={(e) => updateOtp(e.target.value, i)}
                  className="otp-digit"
                />
              ))}
            </div>

            <button onClick={handleOtpVerify} className="action-btn otp-btn" disabled={loading}>
              {loading ? "Verifying..." : "Verify & Access"}
            </button>
            <button onClick={() => setStep("login")} className="text-btn">
              <ChevronLeft size={14} /> Back to Login
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

const twinkleStyles = `
.login-viewport { min-height: 100vh; display: flex; align-items: center; justify-content: center; font-family: 'Inter', sans-serif; overflow: hidden; }
.glass-container { 
  width: 420px; height: 560px; background: rgba(255, 255, 255, 0.03); 
  backdrop-filter: blur(25px); border: 1px solid rgba(255, 255, 255, 0.1); 
  border-radius: 40px; overflow: hidden; box-shadow: 0 40px 100px rgba(0,0,0,0.4);
}
.form-slider { display: flex; width: 200%; height: 100%; transition: transform 0.8s cubic-bezier(0.65, 0, 0.35, 1); }
.auth-panel { width: 50%; padding: 60px 45px; display: flex; flex-direction: column; align-items: center; justify-content: center; }

.icon-badge { width: 50px; height: 50px; background: #136dec; color: white; border-radius: 15px; display: flex; align-items: center; justify-content: center; margin-bottom: 25px; box-shadow: 0 10px 20px rgba(19, 109, 236, 0.3); }
.brand-title { color: white; font-size: 28px; font-weight: 900; margin: 0; letter-spacing: -1px; }
.brand-sub { color: #94a3b8; font-size: 13px; margin: 8px 0 35px; text-align: center; }

.input-stack { width: 100%; display: flex; flex-direction: column; gap: 15px; }
.input-group { position: relative; width: 100%; }
.input-icon { position: absolute; left: 15px; top: 15px; color: #64748b; }
.input-stack input { width: 100%; padding: 15px 15px 15px 45px; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; color: white; outline: none; transition: 0.3s; }
.input-stack input:focus { border-color: #136dec; background: rgba(19, 109, 236, 0.05); }

.action-btn { width: 100%; padding: 16px; background: #136dec; color: white; border: none; border-radius: 16px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; transition: 0.3s; margin-top: 10px; }
.action-btn:hover { background: #1e40af; transform: translateY(-2px); box-shadow: 0 15px 30px rgba(19, 109, 236, 0.4); }
.otp-btn { background: #059669; box-shadow: 0 10px 20px rgba(5, 150, 105, 0.3); }

.otp-row { display: flex; gap: 12px; margin-bottom: 35px; }
.otp-digit { width: 60px; height: 65px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; text-align: center; color: white; font-size: 24px; font-weight: 900; }
.error-pill { background: rgba(239, 68, 68, 0.15); color: #f87171; padding: 10px 20px; border-radius: 12px; font-size: 12px; font-weight: 700; margin-bottom: 20px; width: 100%; text-align: center; border: 1px solid rgba(239, 68, 68, 0.2); }
.text-btn { background: none; border: none; color: #64748b; font-size: 12px; font-weight: 800; text-transform: uppercase; margin-top: 25px; cursor: pointer; letter-spacing: 1px; display: flex; align-items: center; gap: 5px; }
`;