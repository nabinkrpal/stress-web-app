// import { useState } from "react";
// import API from "../services/api";
// import { useNavigate } from "react-router-dom";

// function Login() {
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     email: "",
//     password: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   /* -------------------------
//       Handle Login
//   ------------------------- */
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     const data = new URLSearchParams();
//     data.append("username", form.email);
//     data.append("password", form.password);

//     try {
//       const res = await API.post("/login", data);

//       localStorage.setItem("token", res.data.access_token);
//       navigate("/dashboard");

//     } catch (error) {
//       if (error.response?.status === 401) {
//         setError("Invalid email or password");
//       } else if (error.response?.status === 403) {
//         setError("Please verify your email first");
//       } else {
//         setError("Something went wrong. Try again.");
//       }
//     }

//     setLoading(false);
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-black px-4">

//       {/* Card */}
//       <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">

//         {/* Title */}
//         <h2 className="text-3xl font-bold text-center text-white mb-2">
//           Stress<span className="text-blue-500">Sens</span>
//         </h2>
//         <p className="text-center text-white/60 mb-6">
//           Login to your account
//         </p>

//         {/* Error Message */}
//         {error && (
//           <div className="mb-4 text-red-400 text-sm text-center bg-red-500/10 py-2 rounded-lg">
//             {error}
//           </div>
//         )}

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="space-y-5">

//           {/* Email */}
//           <div>
//             <label className="block text-sm text-white/70 mb-1">
//               Email
//             </label>
//             <input
//               type="email"
//               required
//               placeholder="Enter your email"
//               value={form.email}
//               onChange={(e) =>
//                 setForm({ ...form, email: e.target.value })
//               }
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
//               required
//               placeholder="Enter your password"
//               value={form.password}
//               onChange={(e) =>
//                 setForm({ ...form, password: e.target.value })
//               }
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
//               "Login"
//             )}
//           </button>
//         </form>

//         {/* Forgot Password */}
//         <p
//           onClick={() => navigate("/reset-password")}
//           className="text-blue-400 cursor-pointer text-center mt-4 hover:underline text-sm"
//         >
//           Forgot Password?
//         </p>

//         {/* Register */}
//         <p className="text-center mt-6 text-white/60 text-sm">
//           Don’t have an account?{" "}
//           <span
//             onClick={() => navigate("/register")}
//             className="text-blue-400 cursor-pointer hover:underline font-medium"
//           >
//             Register
//           </span>
//         </p>

//       </div>
//     </div>
//   );
// }

// export default Login;
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
    position: relative;
    overflow: hidden;
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
    background: radial-gradient(circle, rgba(79,142,247,0.07) 0%, transparent 70%);
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

  .auth-logo {
    font-family: 'Syne', sans-serif;
    font-size: 28px; font-weight: 800;
    text-align: center; margin-bottom: 6px;
  }
  .auth-logo span { color: var(--accent); }

  .auth-sub {
    text-align: center; color: var(--text-muted);
    font-size: 14px; margin-bottom: 32px;
  }

  .auth-divider {
    height: 1px; background: var(--border); margin-bottom: 28px;
  }

  .input-group { margin-bottom: 18px; }
  .input-label {
    font-size: 11px; text-transform: uppercase;
    letter-spacing: 1.5px; color: var(--text-muted);
    margin-bottom: 8px; display: block;
  }
  .auth-input {
    width: 100%; box-sizing: border-box;
    background: rgba(255,255,255,0.05);
    border: 1px solid var(--border);
    border-radius: 10px;
    color: var(--text-primary);
    padding: 12px 14px;
    font-size: 14px;
    font-family: 'DM Sans', sans-serif;
    outline: none;
    transition: border-color .2s, box-shadow .2s;
  }
  .auth-input::placeholder { color: rgba(241,245,249,0.25); }
  .auth-input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px var(--accent-glow);
  }

  .btn-primary {
    width: 100%; padding: 13px;
    background: var(--accent);
    color: #fff; border: none;
    border-radius: 10px; cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px; font-weight: 600;
    margin-top: 8px;
    box-shadow: 0 4px 20px var(--accent-glow);
    transition: all .2s;
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }
  .btn-primary:hover { background: #6aa0ff; transform: translateY(-1px); box-shadow: 0 6px 28px var(--accent-glow); }
  .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

  .spinner {
    width: 18px; height: 18px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin .7s linear infinite;
  }

  .alert {
    padding: 11px 14px; border-radius: 10px;
    font-size: 13px; text-align: center; margin-bottom: 20px;
  }
  .alert-error { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2); color: #fca5a5; }
  .alert-success { background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.2); color: #86efac; }

  .auth-link {
    background: none; border: none; cursor: pointer;
    color: var(--accent); font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 500;
    transition: opacity .2s;
  }
  .auth-link:hover { opacity: .7; text-decoration: underline; }

  .auth-footer {
    text-align: center; margin-top: 24px;
    font-size: 13px; color: var(--text-muted);
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes spin { to { transform: rotate(360deg); } }
`;

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    const data = new URLSearchParams();
    data.append("username", form.email);
    data.append("password", form.password);
    try {
      const res = await API.post("/login", data);
      localStorage.setItem("token", res.data.access_token);
      navigate("/dashboard");
    } catch (err) {
      if (err.response?.status === 401) setError("Invalid email or password.");
      else if (err.response?.status === 403) setError("Please verify your email first.");
      else setError("Something went wrong. Try again.");
    }
    setLoading(false);
  };

  return (
    <>
      <style>{STYLES}</style>
      <div className="auth-root">
        <div className="auth-card">
          <p className="auth-logo">Stress<span>Sens</span></p>
          <p className="auth-sub">Sign in to your account</p>
          <div className="auth-divider" />

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="input-label">Email</label>
              <input className="auth-input" type="email" required placeholder="you@example.com"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>

            <div className="input-group">
              <label className="input-label">Password</label>
              <input className="auth-input" type="password" required placeholder="••••••••"
                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? <span className="spinner" /> : "Sign In →"}
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: 16 }}>
            <button className="auth-link" onClick={() => navigate("/reset-password")}>Forgot password?</button>
          </div>

          <p className="auth-footer">
            Don't have an account?{" "}
            <button className="auth-link" onClick={() => navigate("/register")}>Create one</button>
          </p>
        </div>
      </div>
    </>
  );
}

export default Login;
