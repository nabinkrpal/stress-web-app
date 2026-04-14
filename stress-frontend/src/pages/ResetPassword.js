// import { useState } from "react";
// import API from "../services/api";
// import { useNavigate } from "react-router-dom";

// function ResetPassword() {
//   const navigate = useNavigate();

//   const [email, setEmail] = useState("");
//   const [otp, setOtp] = useState("");
//   const [password, setPassword] = useState("");

//   const [loadingOtp, setLoadingOtp] = useState(false);
//   const [loadingReset, setLoadingReset] = useState(false);

//   const [step, setStep] = useState(1); // 1 = send OTP, 2 = reset
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   /* ---------------- SEND OTP ---------------- */
//   const sendCode = async () => {
//     setLoadingOtp(true);
//     setError("");
//     setSuccess("");

//     try {
//       await API.post("/forgot-password", { email });
//       setSuccess("OTP sent to your email");
//       setStep(2);
//     } catch (err) {
//       setError("Failed to send OTP");
//     }

//     setLoadingOtp(false);
//   };

//   /* ---------------- RESET PASSWORD ---------------- */
//   const resetPassword = async () => {
//     setLoadingReset(true);
//     setError("");
//     setSuccess("");

//     try {
//       await API.post("/reset-password", {
//         email: email,
//         otp: otp,
//         new_password: password,
//       });

//       setSuccess("Password reset successful! Redirecting...");

//       setTimeout(() => {
//         navigate("/");
//       }, 1500);

//     } catch (err) {
//       setError("Invalid OTP or error resetting password");
//     }

//     setLoadingReset(false);
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-black px-4">

//       {/* Card */}
//       <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">

//         {/* Title */}
//         <h2 className="text-3xl font-bold text-center text-white mb-2">
//           Reset <span className="text-blue-500">Password</span>
//         </h2>
//         <p className="text-center text-white/60 mb-6">
//           {step === 1 ? "Enter your email to receive OTP" : "Enter OTP and new password"}
//         </p>

//         {/* Error */}
//         {error && (
//           <div className="mb-4 text-red-400 text-sm text-center bg-red-500/10 py-2 rounded-lg">
//             {error}
//           </div>
//         )}

//         {/* Success */}
//         {success && (
//           <div className="mb-4 text-green-400 text-sm text-center bg-green-500/10 py-2 rounded-lg">
//             {success}
//           </div>
//         )}

//         {/* STEP 1: EMAIL */}
//         {step === 1 && (
//           <>
//             <input
//               type="email"
//               placeholder="Enter your email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full p-3 rounded-lg bg-white/10 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
//             />

//             <button
//               onClick={sendCode}
//               disabled={loadingOtp}
//               className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition font-semibold flex items-center justify-center"
//             >
//               {loadingOtp ? (
//                 <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//               ) : (
//                 "Send OTP"
//               )}
//             </button>
//           </>
//         )}

//         {/* STEP 2: OTP + PASSWORD */}
//         {step === 2 && (
//           <>
//             <input
//               placeholder="Enter OTP"
//               value={otp}
//               onChange={(e) => setOtp(e.target.value)}
//               className="w-full p-3 rounded-lg bg-white/10 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
//             />

//             <input
//               type="password"
//               placeholder="New Password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full p-3 rounded-lg bg-white/10 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
//             />

//             <button
//               onClick={resetPassword}
//               disabled={loadingReset}
//               className="w-full py-3 rounded-lg bg-green-600 hover:bg-green-700 transition font-semibold flex items-center justify-center"
//             >
//               {loadingReset ? (
//                 <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//               ) : (
//                 "Reset Password"
//               )}
//             </button>
//           </>
//         )}

//         {/* Back to Login */}
//         <p
//           onClick={() => navigate("/")}
//           className="text-blue-400 cursor-pointer text-center mt-6 text-sm hover:underline"
//         >
//           Back to Login
//         </p>

//       </div>
//     </div>
//   );
// }

// export default ResetPassword;
import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  :root {
    --bg: #080c14;
    --surface: rgba(255,255,255,0.04);
    --border: rgba(255,255,255,0.08);
    --accent: #4f8ef7;
    --accent-glow: rgba(79,142,247,0.25);
    --green: #22c55e;
    --red: #ef4444;
    --text-primary: #f1f5f9;
    --text-muted: rgba(241,245,249,0.45);
  }

  .auth-root {
    min-height: 100vh;
    background: var(--bg);
    display: flex; align-items: center; justify-content: center;
    font-family: 'DM Sans', sans-serif;
    color: var(--text-primary);
    padding: 20px; position: relative; overflow: hidden;
  }
  .auth-root::before {
    content: ''; position: fixed; top: -200px; left: -200px;
    width: 600px; height: 600px; border-radius: 50%;
    background: radial-gradient(circle, rgba(79,142,247,0.12) 0%, transparent 70%);
    pointer-events: none;
  }
  .auth-root::after {
    content: ''; position: fixed; bottom: -150px; right: -100px;
    width: 500px; height: 500px; border-radius: 50%;
    background: radial-gradient(circle, rgba(245,158,11,0.07) 0%, transparent 70%);
    pointer-events: none;
  }

  .auth-card {
    position: relative; z-index: 1;
    width: 100%; max-width: 420px;
    background: var(--surface);
    border: 1px solid var(--border); border-radius: 24px;
    padding: 40px 36px; backdrop-filter: blur(20px);
    animation: fadeUp .4s ease;
  }

  .auth-logo { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 800; text-align: center; margin-bottom: 6px; }
  .auth-logo span { color: var(--accent); }
  .auth-sub { text-align: center; color: var(--text-muted); font-size: 14px; margin-bottom: 32px; }
  .auth-divider { height: 1px; background: var(--border); margin-bottom: 28px; }

  /* Step indicator */
  .steps {
    display: flex; align-items: center; justify-content: center;
    gap: 0; margin-bottom: 28px;
  }
  .step-item { display: flex; flex-direction: column; align-items: center; gap: 6px; }
  .step-circle {
    width: 32px; height: 32px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700;
    border: 1px solid var(--border);
    background: rgba(255,255,255,0.04);
    color: var(--text-muted);
    transition: all .3s;
  }
  .step-circle.active { background: var(--accent); border-color: var(--accent); color: #fff; box-shadow: 0 0 14px var(--accent-glow); }
  .step-circle.done   { background: rgba(34,197,94,0.15); border-color: rgba(34,197,94,0.4); color: var(--green); }
  .step-label { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: var(--text-muted); }
  .step-label.active { color: var(--accent); }
  .step-connector { width: 48px; height: 1px; background: var(--border); margin: 0 8px; margin-bottom: 20px; }

  .input-group { margin-bottom: 18px; }
  .input-label { font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: var(--text-muted); margin-bottom: 8px; display: block; }
  .auth-input {
    width: 100%; box-sizing: border-box;
    background: rgba(255,255,255,0.05); border: 1px solid var(--border);
    border-radius: 10px; color: var(--text-primary); padding: 12px 14px;
    font-size: 14px; font-family: 'DM Sans', sans-serif;
    outline: none; transition: border-color .2s, box-shadow .2s;
  }
  .auth-input::placeholder { color: rgba(241,245,249,0.25); }
  .auth-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-glow); }

  .btn-primary {
    width: 100%; padding: 13px;
    background: var(--accent); color: #fff; border: none;
    border-radius: 10px; cursor: pointer;
    font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 600;
    box-shadow: 0 4px 20px var(--accent-glow); transition: all .2s;
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }
  .btn-primary:hover { background: #6aa0ff; transform: translateY(-1px); }
  .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

  .btn-green {
    width: 100%; padding: 13px;
    background: rgba(34,197,94,0.15); color: var(--green);
    border: 1px solid rgba(34,197,94,0.3); border-radius: 10px;
    cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 600;
    transition: all .2s; display: flex; align-items: center; justify-content: center; gap: 8px;
  }
  .btn-green:hover { background: rgba(34,197,94,0.25); transform: translateY(-1px); }
  .btn-green:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

  .spinner { width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.3); border-top-color: currentColor; border-radius: 50%; animation: spin .7s linear infinite; }

  .alert { padding: 11px 14px; border-radius: 10px; font-size: 13px; text-align: center; margin-bottom: 20px; }
  .alert-error   { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2); color: #fca5a5; }
  .alert-success { background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.2); color: #86efac; }

  .auth-link { background: none; border: none; cursor: pointer; color: var(--accent); font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; transition: opacity .2s; }
  .auth-link:hover { opacity: .7; text-decoration: underline; }

  .auth-footer { text-align: center; margin-top: 24px; font-size: 13px; color: var(--text-muted); }

  @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes spin { to { transform: rotate(360deg); } }
`;

function ResetPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [loadingOtp, setLoadingOtp] = useState(false);
  const [loadingReset, setLoadingReset] = useState(false);
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const sendCode = async () => {
    setLoadingOtp(true); setError(""); setSuccess("");
    try {
      await API.post("/forgot-password", { email });
      setSuccess("OTP sent to your email.");
      setStep(2);
    } catch { setError("Failed to send OTP. Check your email."); }
    setLoadingOtp(false);
  };

  const resetPassword = async () => {
    setLoadingReset(true); setError(""); setSuccess("");
    try {
      await API.post("/reset-password", { email, otp, new_password: password });
      setSuccess("Password reset! Redirecting…");
      setTimeout(() => navigate("/"), 1500);
    } catch { setError("Invalid OTP or error resetting password."); }
    setLoadingReset(false);
  };

  return (
    <>
      <style>{STYLES}</style>
      <div className="auth-root">
        <div className="auth-card">
          <p className="auth-logo">Reset <span>Password</span></p>
          <p className="auth-sub">{step === 1 ? "We'll send an OTP to your email" : "Enter the OTP and your new password"}</p>
          <div className="auth-divider" />

          {/* Step indicator */}
          <div className="steps">
            <div className="step-item">
              <div className={`step-circle ${step >= 1 ? (step > 1 ? "done" : "active") : ""}`}>
                {step > 1 ? "✓" : "1"}
              </div>
              <span className={`step-label ${step === 1 ? "active" : ""}`}>Email</span>
            </div>
            <div className="step-connector" />
            <div className="step-item">
              <div className={`step-circle ${step === 2 ? "active" : ""}`}>2</div>
              <span className={`step-label ${step === 2 ? "active" : ""}`}>Reset</span>
            </div>
          </div>

          {error   && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          {step === 1 && (
            <>
              <div className="input-group">
                <label className="input-label">Email Address</label>
                <input className="auth-input" type="email" placeholder="you@example.com"
                  value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <button className="btn-primary" onClick={sendCode} disabled={loadingOtp || !email}>
                {loadingOtp ? <span className="spinner" /> : "Send OTP →"}
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <div className="input-group">
                <label className="input-label">OTP Code</label>
                <input className="auth-input" placeholder="Enter 6-digit code"
                  value={otp} onChange={e => setOtp(e.target.value)} />
              </div>
              <div className="input-group">
                <label className="input-label">New Password</label>
                <input className="auth-input" type="password" placeholder="••••••••"
                  value={password} onChange={e => setPassword(e.target.value)} />
              </div>
              <button className="btn-green" onClick={resetPassword} disabled={loadingReset || !otp || !password}>
                {loadingReset ? <span className="spinner" /> : "✓ Reset Password"}
              </button>
            </>
          )}

          <p className="auth-footer">
            <button className="auth-link" onClick={() => navigate("/")}>← Back to Login</button>
          </p>
        </div>
      </div>
    </>
  );
}

export default ResetPassword;
