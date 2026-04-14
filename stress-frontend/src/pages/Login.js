import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* -------------------------
      Handle Login
  ------------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const data = new URLSearchParams();
    data.append("username", form.email);
    data.append("password", form.password);

    try {
      const res = await API.post("/login", data);

      localStorage.setItem("token", res.data.access_token);
      navigate("/dashboard");

    } catch (error) {
      if (error.response?.status === 401) {
        setError("Invalid email or password");
      } else if (error.response?.status === 403) {
        setError("Please verify your email first");
      } else {
        setError("Something went wrong. Try again.");
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-black px-4">

      {/* Card */}
      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">

        {/* Title */}
        <h2 className="text-3xl font-bold text-center text-white mb-2">
          Stress<span className="text-blue-500">Sens</span>
        </h2>
        <p className="text-center text-white/60 mb-6">
          Login to your account
        </p>

        {/* Error Message */}
        {error && (
          <div className="mb-4 text-red-400 text-sm text-center bg-red-500/10 py-2 rounded-lg">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email */}
          <div>
            <label className="block text-sm text-white/70 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              placeholder="Enter your email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              className="w-full p-3 rounded-lg bg-white/10 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm text-white/70 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="Enter your password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              className="w-full p-3 rounded-lg bg-white/10 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition font-semibold flex items-center justify-center"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Login"
            )}
          </button>
        </form>

        {/* Forgot Password */}
        <p
          onClick={() => navigate("/reset-password")}
          className="text-blue-400 cursor-pointer text-center mt-4 hover:underline text-sm"
        >
          Forgot Password?
        </p>

        {/* Register */}
        <p className="text-center mt-6 text-white/60 text-sm">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-blue-400 cursor-pointer hover:underline font-medium"
          >
            Register
          </span>
        </p>

      </div>
    </div>
  );
}

export default Login;
