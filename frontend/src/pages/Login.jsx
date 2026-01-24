import { useState } from "react";

export default function LoginOtpApp() {
  const [step, setStep] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);

  const handleLogin = () => {
    if (!email || !password) {
      alert("Email and password required");
      return;
    }
    setStep("otp");
  };

  const handleOtpChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  };

  const verifyOtp = () => {
    if (otp.some(d => d === "")) {
      alert("Please enter complete OTP");
      return;
    }
    alert("OTP verified. Login successful");
  };

  return (
    <div className="page-container">
      <style>{css}</style>

      {/* Main Content Centered on White */}
      <main className="main-content">
        <div className="auth-card">
          <div className="visual-panel">
            <h1>Welcome Back</h1>
            <p>
              Secure login experience with mandatory OTP verification. 
              Smooth animations, clean layout, modern design.
            </p>
          </div>

          <div className="form-panel">
            <div
              className="slider"
              style={{ transform: step === "otp" ? "translateX(-50%)" : "translateX(0)" }}
            >
              {/* Sign In Slide */}
              <div className="slide">
                <h2 className="form-title">Sign In</h2>
                <p className="form-subtitle">OTP verification is mandatory</p>

                <input
                  type="email"
                  placeholder="Email address"
                  className="form-input"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />

                <input
                  type="password"
                  placeholder="Password"
                  className="form-input"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />

                <button className="btn-continue" onClick={handleLogin}>
                  Continue
                </button>
              </div>

              {/* OTP Slide */}
              <div className="slide">
                <h2 className="form-title">OTP Verification</h2>
                <p className="form-subtitle">Enter the 4 digit OTP</p>

                <div className="otp-group">
                  {otp.map((d, i) => (
                    <input
                      key={i}
                      maxLength={1}
                      className="otp-input"
                      value={d}
                      onChange={e => handleOtpChange(e.target.value, i)}
                    />
                  ))}
                </div>

                <button className="btn-continue" onClick={verifyOtp}>
                  Verify OTP
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

.page-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: var(--bg-white);
}

/* Navbar Styling */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 50px;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
}

.nav-logo { display: flex; align-items: center; gap: 10px; }
.logo-box {
  background: var(--primary-blue);
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}
.logo-text { font-weight: 700; font-size: 1.2rem; color: #cbd5e0; }

.nav-actions { display: flex; gap: 12px; }

.btn-register {
  background: #f0f7ff;
  color: var(--primary-blue);
  border: none;
  padding: 8px 18px;
  border-radius: 20px;
  font-weight: 500;
  cursor: pointer;
}

.btn-login {
  background: #2d3748;
  color: white;
  border: none;
  padding: 8px 24px;
  border-radius: 20px;
  font-weight: 500;
  cursor: pointer;
}

/* Centering Content */
.main-content {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.auth-card {
  width: 950px;
  height: 520px;
  display: flex;
  background: #fff;
  border-radius: 25px;
  overflow: hidden;
  box-shadow: 0 15px 50px rgba(0,0,0,0.05);
  border: 1px solid #f0f0f0;
}

.visual-panel {
  width: 40%;
  background: var(--primary-blue);
  color: #fff;
  padding: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.visual-panel h1 { font-size: 2.2rem; margin-bottom: 15px; }
.visual-panel p { opacity: 0.8; line-height: 1.6; }

.form-panel { width: 60%; overflow: hidden; }

.slider {
  display: flex;
  width: 200%;
  height: 100%;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide {
  width: 50%;
  padding: 70px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.form-title { font-size: 1.1rem; color: #b0b8c1; margin: 0; }
.form-subtitle { color: var(--primary-blue); margin: 5px 0 30px 0; font-weight: 500; }

.form-input {
  width: 100%;
  padding: 16px;
  margin-bottom: 15px;
  border: none;
  border-radius: 12px;
  background: var(--input-bg);
  font-size: 1rem;
  color: #333;
}

.btn-continue {
  background: var(--secondary-blue);
  color: #fff;
  padding: 16px;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 10px;
}

.otp-group { display: flex; gap: 15px; margin-bottom: 25px; }
.otp-input {
  width: 60px;
  height: 60px;
  text-align: center;
  font-size: 1.4rem;
  font-weight: bold;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
}

.btn-link {
  background: none;
  border: none;
  color: #a0aec0;
  margin-top: 20px;
  cursor: pointer;
}
`;