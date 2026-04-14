// import { useState } from "react";
// import API from "../services/api";
// import { useNavigate } from "react-router-dom";

// function Register() {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     setSuccess("");

//     try {
//       await API.post("/register", formData);
//       setSuccess("Account created successfully! Redirecting...");

//       setTimeout(() => {
//         navigate("/");
//       }, 1500);

//     } catch (error) {
//       setError("Registration failed. Email may already exist.");
//     }

//     setLoading(false);
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-black px-4">

//       {/* Card */}
//       <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">

//         {/* Title */}
//         <h2 className="text-3xl font-bold text-center text-white mb-2">
//           Stress<span className="text-blue-500">Lens</span>
//         </h2>
//         <p className="text-center text-white/60 mb-6">
//           Create your account
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

//         {/* Form */}
//         <form onSubmit={handleRegister} className="space-y-5">

//           {/* Name */}
//           <div>
//             <label className="block text-sm text-white/70 mb-1">
//               Full Name
//             </label>
//             <input
//               type="text"
//               name="name"
//               required
//               placeholder="Enter your name"
//               onChange={handleChange}
//               className="w-full p-3 rounded-lg bg-white/10 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           {/* Email */}
//           <div>
//             <label className="block text-sm text-white/70 mb-1">
//               Email
//             </label>
//             <input
//               type="email"
//               name="email"
//               required
//               placeholder="Enter your email"
//               onChange={handleChange}
//               className="w-full p-3 rounded-lg bg-white/10 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           {/* Password */}
//           <div>
//             <label className="block text-sm text-white/70 mb-1">
//               Password
//             </label>
//             <input
//               type="password"
//               name="password"
//               required
//               placeholder="Create a password"
//               onChange={handleChange}
//               className="w-full p-3 rounded-lg bg-white/10 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           {/* Button */}
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition font-semibold flex items-center justify-center"
//           >
//             {loading ? (
//               <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//             ) : (
//               "Create Account"
//             )}
//           </button>
//         </form>

//         {/* Login Redirect */}
//         <p className="text-center mt-6 text-white/60 text-sm">
//           Already have an account?{" "}
//           <span
//             onClick={() => navigate("/")}
//             className="text-blue-400 cursor-pointer hover:underline font-medium"
//           >
//             Login
//           </span>
//         </p>

//       </div>
//     </div>
//   );
// }

// export default Register;
import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  :root {
    --bg: #080c14;
    --surface: rgba(255,255,255,0.04);
    --border: rgba(255,255,255,0.08);
    --border-bright: rgba(255,255,255,0.16);
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
    padding: 20px;
    position: relative; overflow: hidden;
  }
  .auth-root::before {
    content: '';
    position: fixed; top: -200px; left: -200px;
    width: 600px; height: 600px; border-radius: 50%;
    background: radial-gradient(circle, rgba(79,142,247,0.12) 0%, transparent 70%);
    pointer-events: none;
  }
  .auth-root::after {
    content: '';
    position: fixed; bottom: -150px; right: -100px;
    width: 500px; height: 500px; border-radius: 50%;
    background: radial-gradient(circle, rgba(34,197,94,0.07) 0%, transparent 70%);
    pointer-events: none;
  }

  .auth-card {
    position: relative; z-index: 1;
    width: 100%; max-width: 420px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 24px;
    padding: 40px 36px;
    backdrop-filter: blur(20px);
    animation: fadeUp .4s ease;
  }

  .auth-logo { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 800; text-align: center; margin-bottom: 6px; }
  .auth-logo span { color: var(--accent); }
  .auth-sub { text-align: center; color: var(--text-muted); font-size: 14px; margin-bottom: 32px; }
  .auth-divider { height: 1px; background: var(--border); margin-bottom: 28px; }

  .input-group { margin-bottom: 18px; }
  .input-label { font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: var(--text-muted); margin-bottom: 8px; display: block; }
  .auth-input {
    width: 100%; box-sizing: border-box;
    background: rgba(255,255,255,0.05);
    border: 1px solid var(--border); border-radius: 10px;
    color: var(--text-primary); padding: 12px 14px;
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
    margin-top: 8px; box-shadow: 0 4px 20px var(--accent-glow);
    transition: all .2s;
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }
  .btn-primary:hover { background: #6aa0ff; transform: translateY(-1px); box-shadow: 0 6px 28px var(--accent-glow); }
  .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

  .spinner { width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin .7s linear infinite; }

  .alert { padding: 11px 14px; border-radius: 10px; font-size: 13px; text-align: center; margin-bottom: 20px; }
  .alert-error  { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2); color: #fca5a5; }
  .alert-success { background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.2); color: #86efac; }

  .auth-link { background: none; border: none; cursor: pointer; color: var(--accent); font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; transition: opacity .2s; }
  .auth-link:hover { opacity: .7; text-decoration: underline; }

  .auth-footer { text-align: center; margin-top: 24px; font-size: 13px; color: var(--text-muted); }

  /* Password strength */
  .strength-bar { display: flex; gap: 4px; margin-top: 8px; }
  .strength-seg { height: 3px; flex: 1; border-radius: 4px; background: var(--border); transition: background .3s; }
  .strength-seg.active-weak   { background: var(--red); }
  .strength-seg.active-medium { background: #f59e0b; }
  .strength-seg.active-strong { background: var(--green); }
  .strength-label { font-size: 11px; color: var(--text-muted); margin-top: 5px; }

  @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes spin { to { transform: rotate(360deg); } }
`;

function getStrength(pw) {
  if (!pw) return 0;
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw) || /[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true); setError(""); setSuccess("");
    try {
      await API.post("/register", formData);
      setSuccess("Account created! Redirecting…");
      setTimeout(() => navigate("/"), 1500);
    } catch {
      setError("Registration failed. Email may already exist.");
    }
    setLoading(false);
  };

  const strength = getStrength(formData.password);
  const strengthLabels = ["", "Weak", "Fair", "Strong"];
  const segClass = (i) => {
    if (strength === 0) return "";
    if (i < strength) return strength === 1 ? "active-weak" : strength === 2 ? "active-medium" : "active-strong";
    return "";
  };

  return (
    <>
      <style>{STYLES}</style>
      <div className="auth-root">
        <div className="auth-card">
          <p className="auth-logo">Stress<span>Sens</span></p>
          <p className="auth-sub">Create your account</p>
          <div className="auth-divider" />

          {error   && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleRegister}>
            <div className="input-group">
              <label className="input-label">Full Name</label>
              <input className="auth-input" type="text" name="name" required placeholder="Your name" onChange={handleChange} />
            </div>

            <div className="input-group">
              <label className="input-label">Email</label>
              <input className="auth-input" type="email" name="email" required placeholder="you@example.com" onChange={handleChange} />
            </div>

            <div className="input-group">
              <label className="input-label">Password</label>
              <input className="auth-input" type="password" name="password" required placeholder="••••••••" onChange={handleChange} />
              {formData.password.length > 0 && (
                <>
                  <div className="strength-bar">
                    {[0,1,2].map(i => <div key={i} className={`strength-seg ${segClass(i)}`} />)}
                  </div>
                  <p className="strength-label">{strengthLabels[strength]}</p>
                </>
              )}
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? <span className="spinner" /> : "Create Account →"}
            </button>
          </form>

          <p className="auth-footer">
            Already have an account?{" "}
            <button className="auth-link" onClick={() => navigate("/")}>Sign in</button>
          </p>
        </div>
      </div>
    </>
  );
}

export default Register;
