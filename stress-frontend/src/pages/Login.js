// import { useState } from "react";
// import API from "../services/api";
// import { useNavigate } from "react-router-dom";

// function Login() {
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     email: "",
//     password: "",
//   });

//   const [showForgot, setShowForgot] = useState(false);
//   const [otpStep, setOtpStep] = useState(false);

//   const [resetData, setResetData] = useState({
//     email: "",
//     otp: "",
//     new_password: "",
//   });

//   // ================= LOGIN =================
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const data = new URLSearchParams();
//     data.append("username", form.email);
//     data.append("password", form.password);

//     try {
//       const res = await API.post("/login", data);
//       localStorage.setItem("token", res.data.access_token);
//       navigate("/dashboard");
//     } catch (error) {
//       alert("Login failed");
//     }
//   };

//   // ================= SEND OTP =================
//   const handleForgotPassword = async () => {
//     try {
//       await API.post("/forgot-password", null, {
//         params: { email: resetData.email },
//       });

//       alert("OTP sent to your email");
//       setOtpStep(true);
//     } catch (error) {
//       alert("Error sending OTP");
//     }
//   };

//   // ================= RESET PASSWORD =================
//   const handleResetPassword = async () => {
//     try {
//       await API.post("/reset-password", resetData);
//       alert("Password reset successful");

//       setShowForgot(false);
//       setOtpStep(false);
//     } catch (error) {
//       alert("Reset failed");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">

//       <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md">

//         <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
//           Student Stress Login
//         </h2>

//         {!showForgot ? (
//           <>
//             {/* ================= LOGIN FORM ================= */}
//             <form onSubmit={handleSubmit} className="space-y-5">

//               <div>
//                 <label className="block font-semibold mb-1">Email</label>
//                 <input
//                   type="email"
//                   required
//                   placeholder="Enter your email"
//                   onChange={(e) =>
//                     setForm({ ...form, email: e.target.value })
//                   }
//                   className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
//                 />
//               </div>

//               <div>
//                 <label className="block font-semibold mb-1">Password</label>
//                 <input
//                   type="password"
//                   required
//                   placeholder="Enter your password"
//                   onChange={(e) =>
//                     setForm({ ...form, password: e.target.value })
//                   }
//                   className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
//                 />
//               </div>

//               <button
//                 type="submit"
//                 className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
//               >
//                 Login
//               </button>
//             </form>

//             {/* Forgot Password */}
//             <p
//               onClick={() => setShowForgot(true)}
//               className="text-right mt-2 text-sm text-blue-600 cursor-pointer hover:underline"
//             >
//               Forgot Password?
//             </p>

//             <p className="text-center mt-6 text-gray-600">
//               Don’t have an account?{" "}
//               <span
//                 onClick={() => navigate("/register")}
//                 className="text-blue-600 cursor-pointer hover:underline font-medium"
//               >
//                 Register
//               </span>
//             </p>
//           </>
//         ) : (
//           <>
//             {/* ================= FORGOT PASSWORD ================= */}

//             <h3 className="text-xl font-semibold mb-4 text-center">
//               Reset Password
//             </h3>

//             {!otpStep ? (
//               <>
//                 {/* Email Input */}
//                 <input
//                   type="email"
//                   placeholder="Enter your registered email"
//                   onChange={(e) =>
//                     setResetData({ ...resetData, email: e.target.value })
//                   }
//                   className="w-full p-3 border rounded-lg mb-4"
//                 />

//                 <button
//                   onClick={handleForgotPassword}
//                   className="w-full bg-blue-500 text-white py-2 rounded-lg"
//                 >
//                   Send OTP
//                 </button>
//               </>
//             ) : (
//               <>
//                 {/* OTP + New Password */}
//                 <input
//                   type="text"
//                   placeholder="Enter OTP"
//                   onChange={(e) =>
//                     setResetData({ ...resetData, otp: e.target.value })
//                   }
//                   className="w-full p-3 border rounded-lg mb-3"
//                 />

//                 <input
//                   type="password"
//                   placeholder="New Password"
//                   onChange={(e) =>
//                     setResetData({
//                       ...resetData,
//                       new_password: e.target.value,
//                     })
//                   }
//                   className="w-full p-3 border rounded-lg mb-4"
//                 />

//                 <button
//                   onClick={handleResetPassword}
//                   className="w-full bg-green-500 text-white py-2 rounded-lg"
//                 >
//                   Reset Password
//                 </button>
//               </>
//             )}

//             {/* Back */}
            
//             <p
//               onClick={() => {
//                 setShowForgot(false);
//                 setOtpStep(false);
//               }}
//               className="text-center mt-4 text-blue-600 cursor-pointer hover:underline"
//             >
//               Back to Login
//             </p>
//           </>
//         )}

//       </div>
//     </div>
//   );
// }

// export default Login;
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

  /* -------------------------
      Handle Login
  ------------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new URLSearchParams();
    data.append("username", form.email);   // IMPORTANT for FastAPI
    data.append("password", form.password);

    try {
      const res = await API.post("/login", data);

      localStorage.setItem("token", res.data.access_token);

      alert("Login successful 🚀");
      navigate("/dashboard");

    } catch (error) {
      if (error.response?.status === 401) {
        alert("Invalid email or password");
      } else if (error.response?.status === 403) {
        alert("Please verify your email first");
      } else {
        alert("Login failed. Try again.");
      }
    }

    setLoading(false);
  };

  /* -------------------------
      UI
  ------------------------- */
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">

      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md">

        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
          Student Stress Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email */}
          <div>
            <label className="block font-semibold mb-1">Email</label>
            <input
              type="email"
              required
              placeholder="Enter your email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block font-semibold mb-1">Password</label>
            <input
              type="password"
              required
              placeholder="Enter your password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        {/* Forgot Password */}
        <p
          onClick={() => navigate("/reset-password")}
          className="text-blue-600 cursor-pointer text-center mt-4 hover:underline"
        >
          Forgot Password?
        </p>

        {/* Register */}
        <p className="text-center mt-6 text-gray-600">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-blue-600 cursor-pointer hover:underline font-medium"
          >
            Register
          </span>
        </p>

      </div>
    </div>
  );
}

export default Login;