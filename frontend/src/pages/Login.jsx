import { useState, useEffect } from "react";
import axios from "axios";

export default function LoginOtpApp({ onLoginSuccess }) {
  const [step, setStep] = useState("login");
  const [role, setRole] = useState("admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);

  // --- 1. HANDLE INITIAL LOGIN ---
  const handleLogin = async () => {
    if (!email || !password) {
      alert("Email and password required");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/auth/request-otp", {
        email: email.toLowerCase().trim(),
        password: password.trim(),
        role
      });

      if (response.data.success) {
        alert("OTP has been sent to your registered email.");
        setStep("otp");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Invalid credentials for selected role");
    } finally {
      setLoading(false);
    }
  };

  // --- 2. OTP INPUT LOGIC ---
  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus Next
    if (value && index < 3) {
      const nextInput = document.querySelectorAll('.otp-input')[index + 1];
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Auto-focus Previous on Backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.querySelectorAll('.otp-input')[index - 1];
      if (prevInput) prevInput.focus();
    }
    // Submit on Enter
    if (e.key === "Enter" && otp.join("").length === 4) {
      verifyOtp();
    }
  };

  // --- 3. VERIFY OTP & COMPLETE LOGIN ---
  const verifyOtp = async () => {
    const otpString = otp.join("");
    if (otpString.length < 4) {
      alert("Please enter complete OTP");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/auth/verify-otp", {
        email: email.toLowerCase().trim(),
        otp: otpString
      });

      if (response.data.success) {
        alert("Verification successful!");
        onLoginSuccess(response.data.role, response.data.user);
      }
    } catch (err) {
      alert("Invalid OTP code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <style>{css}</style>
      <main className="main-content">
        <div className="auth-card">
          <div className="visual-panel">
            <h1>Institutional Access</h1>
            <p>
              Welcome to the CMS Portal. Please verify your credentials and 
              complete the secondary email authentication to access your dashboard.
            </p>
          </div>

          <div className="form-panel">
            <div
              className="slider"
              style={{ transform: step === "otp" ? "translateX(-50%)" : "translateX(0)" }}
            >
              {/* Slide 1: Sign In */}
              <div className="slide">
                <h2 className="form-title">Secure Sign In</h2>
                <p className="form-subtitle">Choose your access level</p>

                <div className="role-selector">
                    <button 
                      className={role === 'admin' ? 'active' : ''} 
                      onClick={() => setRole('admin')}
                    >Admin</button>
                    <button 
                      className={role === 'teacher' ? 'active' : ''} 
                      onClick={() => setRole('teacher')}
                    >Teacher</button>
                </div>

                <input
                  type="email"
                  placeholder="Email address"
                  className="form-input"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                />

                <input
                  type="password"
                  placeholder="Password"
                  className="form-input"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                />

                <button className="btn-continue" onClick={handleLogin} disabled={loading}>
                  {loading ? "Processing..." : "Continue"}
                </button>
              </div>

              {/* Slide 2: OTP Verification */}
              <div className="slide">
                <h2 className="form-title">Check Your Email</h2>
                <p className="form-subtitle">Enter the 4 digit OTP sent to you</p>

                <div className="otp-group">
                  {otp.map((d, i) => (
                    <input
                      key={i}
                      maxLength={1}
                      className="otp-input"
                      value={d}
                      onChange={e => handleOtpChange(e, i)}
                      onKeyDown={e => handleKeyDown(e, i)}
                    />
                  ))}
                </div>

                <button className="btn-continue" onClick={verifyOtp} disabled={loading}>
                  {loading ? "Verifying..." : "Verify & Access Dashboard"}
                </button>

                <button className="btn-link" onClick={() => setStep("login")}>
                  ← Back to Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

const css = `
:root {
  --primary-blue: #004dc0;
  --secondary-blue: #002d72;
  --bg-white: #ffffff;
  --input-bg: #f0f4ff;
  --text-gray: #8892b0;
}
* { box-sizing: border-box; font-family: 'Inter', sans-serif; }
body { margin: 0; padding: 0; background: var(--bg-white); }
.page-container { display: flex; flex-direction: column; height: 100vh; background: var(--bg-white); }
.main-content { flex: 1; display: flex; justify-content: center; align-items: center; }
.auth-card { width: 950px; height: 520px; display: flex; background: #fff; border-radius: 25px; overflow: hidden; box-shadow: 0 15px 50px rgba(0,0,0,0.05); border: 1px solid #f0f0f0; }
.visual-panel { width: 40%; background: var(--primary-blue); color: #fff; padding: 50px; display: flex; flex-direction: column; justify-content: center; }
.visual-panel h1 { font-size: 2.2rem; margin-bottom: 15px; }
.visual-panel p { opacity: 0.8; line-height: 1.6; }
.form-panel { width: 60%; overflow: hidden; }
.slider { display: flex; width: 200%; height: 100%; transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1); }
.slide { width: 50%; padding: 70px; display: flex; flex-direction: column; justify-content: center; }
.role-selector { display: flex; gap: 10px; margin-bottom: 25px; }
.role-selector button { flex: 1; padding: 12px; border: 1px solid #e2e8f0; border-radius: 12px; background: #fff; cursor: pointer; font-weight: 600; transition: all 0.3s ease; }
.role-selector button.active { background: var(--primary-blue); color: white; border-color: var(--primary-blue); }
.form-title { font-size: 1.1rem; color: #b0b8c1; margin: 0; }
.form-subtitle { color: var(--primary-blue); margin: 5px 0 20px 0; font-weight: 500; }
.form-input { width: 100%; padding: 16px; margin-bottom: 15px; border: none; border-radius: 12px; background: var(--input-bg); font-size: 1rem; color: #333; }
.btn-continue { background: var(--secondary-blue); color: #fff; padding: 16px; border: none; border-radius: 12px; font-size: 1rem; font-weight: 600; cursor: pointer; margin-top: 10px; }
.btn-continue:disabled { opacity: 0.6; cursor: not-allowed; }
.otp-group { display: flex; gap: 15px; margin-bottom: 25px; }
.otp-input { width: 60px; height: 60px; text-align: center; font-size: 1.4rem; font-weight: bold; border: 1px solid #e2e8f0; border-radius: 12px; background: var(--input-bg); }
.btn-link { background: none; border: none; color: #a0aec0; margin-top: 20px; cursor: pointer; }
`;