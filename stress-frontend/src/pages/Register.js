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

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       await API.post("/register", formData);
//       alert("Registration successful! Please login.");
//       navigate("/");
//     } catch (error) {
//       alert("Registration failed. Email may already exist.");
//     }

//     setLoading(false);
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">

//       <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md">

//         <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
//           Create Account
//         </h2>

//         <form onSubmit={handleRegister} className="space-y-5">

//           {/* Name */}
//           <div>
//             <label className="block font-semibold mb-1">
//               Full Name
//             </label>
//             <input
//               type="text"
//               name="name"
//               required
//               onChange={handleChange}
//               className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
//             />
//           </div>

//           {/* Email */}
//           <div>
//             <label className="block font-semibold mb-1">
//               Email
//             </label>
//             <input
//               type="email"
//               name="email"
//               required
//               onChange={handleChange}
//               className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
//             />
//           </div>

//           {/* Password */}
//           <div>
//             <label className="block font-semibold mb-1">
//               Password
//             </label>
//             <input
//               type="password"
//               name="password"
//               required
//               onChange={handleChange}
//               className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
//           >
//             {loading ? "Registering..." : "Register"}
//           </button>
//         </form>

//         <p className="text-center mt-6 text-gray-600">
//           Already have an account?{" "}
//           <span
//             onClick={() => navigate("/")}
//             className="text-blue-600 cursor-pointer hover:underline"
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

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await API.post("/register", formData);
      setSuccess("Account created successfully! Redirecting...");

      setTimeout(() => {
        navigate("/");
      }, 1500);

    } catch (error) {
      setError("Registration failed. Email may already exist.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-black px-4">

      {/* Card */}
      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">

        {/* Title */}
        <h2 className="text-3xl font-bold text-center text-white mb-2">
          Stress<span className="text-blue-500">Lens</span>
        </h2>
        <p className="text-center text-white/60 mb-6">
          Create your account
        </p>

        {/* Error */}
        {error && (
          <div className="mb-4 text-red-400 text-sm text-center bg-red-500/10 py-2 rounded-lg">
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="mb-4 text-green-400 text-sm text-center bg-green-500/10 py-2 rounded-lg">
            {success}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-5">

          {/* Name */}
          <div>
            <label className="block text-sm text-white/70 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              required
              placeholder="Enter your name"
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-white/10 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm text-white/70 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="Enter your email"
              onChange={handleChange}
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
              name="password"
              required
              placeholder="Create a password"
              onChange={handleChange}
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
              "Create Account"
            )}
          </button>
        </form>

        {/* Login Redirect */}
        <p className="text-center mt-6 text-white/60 text-sm">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/")}
            className="text-blue-400 cursor-pointer hover:underline font-medium"
          >
            Login
          </span>
        </p>

      </div>
    </div>
  );
}

export default Register;
