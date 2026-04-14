// import { useState } from "react";
// import API from "../services/api";
// import { useNavigate } from "react-router-dom";

// function ResetPassword() {
//   const navigate = useNavigate();

//   const [email, setEmail] = useState("");
//   const [otp, setOtp] = useState(""); // ✅ FIXED (was code)
//   const [password, setPassword] = useState("");

//   // ---------------- SEND OTP ----------------
//   const sendCode = async () => {
//     try {
//       await API.post("/forgot-password", { email }); // ✅ JSON
//       alert("OTP sent to email");
//     } catch (err) {
//       console.log(err.response?.data);
//       alert("Error sending OTP");
//     }
//   };

//   // ---------------- RESET PASSWORD ----------------
//   const resetPassword = async () => {
//     try {
//       await API.post("/reset-password", {
//         email: email,
//         otp: otp, // ✅ FIXED
//         new_password: password,
//       });

//       alert("Password reset successful");
//       navigate("/");

//     } catch (err) {
//       console.log(err.response?.data); // 🔥 debug
//       alert("Reset failed");
//     }
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gray-100">
//       <div className="bg-white p-6 rounded shadow w-96">

//         <h2 className="text-xl font-bold mb-4">Reset Password</h2>

//         {/* EMAIL */}
//         <input
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           className="w-full p-2 border mb-2"
//         />

//         <button
//           onClick={sendCode}
//           className="w-full bg-blue-500 text-white p-2 mb-3"
//         >
//           Send OTP
//         </button>

//         {/* OTP */}
//         <input
//           placeholder="Enter OTP"
//           value={otp}
//           onChange={(e) => setOtp(e.target.value)} // ✅ FIXED
//           className="w-full p-2 border mb-2"
//         />

//         {/* PASSWORD */}
//         <input
//           type="password"
//           placeholder="New Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="w-full p-2 border mb-3"
//         />

//         <button
//           onClick={resetPassword}
//           className="w-full bg-green-600 text-white p-2"
//         >
//           Reset Password
//         </button>

//       </div>
//     </div>
//   );
// }

// export default ResetPassword;
import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function ResetPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");

  const [loadingOtp, setLoadingOtp] = useState(false);
  const [loadingReset, setLoadingReset] = useState(false);

  const [step, setStep] = useState(1); // 1 = send OTP, 2 = reset
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* ---------------- SEND OTP ---------------- */
  const sendCode = async () => {
    setLoadingOtp(true);
    setError("");
    setSuccess("");

    try {
      await API.post("/forgot-password", { email });
      setSuccess("OTP sent to your email");
      setStep(2);
    } catch (err) {
      setError("Failed to send OTP");
    }

    setLoadingOtp(false);
  };

  /* ---------------- RESET PASSWORD ---------------- */
  const resetPassword = async () => {
    setLoadingReset(true);
    setError("");
    setSuccess("");

    try {
      await API.post("/reset-password", {
        email: email,
        otp: otp,
        new_password: password,
      });

      setSuccess("Password reset successful! Redirecting...");

      setTimeout(() => {
        navigate("/");
      }, 1500);

    } catch (err) {
      setError("Invalid OTP or error resetting password");
    }

    setLoadingReset(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-black px-4">

      {/* Card */}
      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">

        {/* Title */}
        <h2 className="text-3xl font-bold text-center text-white mb-2">
          Reset <span className="text-blue-500">Password</span>
        </h2>
        <p className="text-center text-white/60 mb-6">
          {step === 1 ? "Enter your email to receive OTP" : "Enter OTP and new password"}
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

        {/* STEP 1: EMAIL */}
        {step === 1 && (
          <>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-lg bg-white/10 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />

            <button
              onClick={sendCode}
              disabled={loadingOtp}
              className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition font-semibold flex items-center justify-center"
            >
              {loadingOtp ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Send OTP"
              )}
            </button>
          </>
        )}

        {/* STEP 2: OTP + PASSWORD */}
        {step === 2 && (
          <>
            <input
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-3 rounded-lg bg-white/10 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
            />

            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg bg-white/10 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />

            <button
              onClick={resetPassword}
              disabled={loadingReset}
              className="w-full py-3 rounded-lg bg-green-600 hover:bg-green-700 transition font-semibold flex items-center justify-center"
            >
              {loadingReset ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Reset Password"
              )}
            </button>
          </>
        )}

        {/* Back to Login */}
        <p
          onClick={() => navigate("/")}
          className="text-blue-400 cursor-pointer text-center mt-6 text-sm hover:underline"
        >
          Back to Login
        </p>

      </div>
    </div>
  );
}

export default ResetPassword;
