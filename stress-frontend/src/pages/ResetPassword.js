import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function ResetPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(""); // ✅ FIXED (was code)
  const [password, setPassword] = useState("");

  // ---------------- SEND OTP ----------------
  const sendCode = async () => {
    try {
      await API.post("/forgot-password", { email }); // ✅ JSON
      alert("OTP sent to email");
    } catch (err) {
      console.log(err.response?.data);
      alert("Error sending OTP");
    }
  };

  // ---------------- RESET PASSWORD ----------------
  const resetPassword = async () => {
    try {
      await API.post("/reset-password", {
        email: email,
        otp: otp, // ✅ FIXED
        new_password: password,
      });

      alert("Password reset successful");
      navigate("/");

    } catch (err) {
      console.log(err.response?.data); // 🔥 debug
      alert("Reset failed");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow w-96">

        <h2 className="text-xl font-bold mb-4">Reset Password</h2>

        {/* EMAIL */}
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border mb-2"
        />

        <button
          onClick={sendCode}
          className="w-full bg-blue-500 text-white p-2 mb-3"
        >
          Send OTP
        </button>

        {/* OTP */}
        <input
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)} // ✅ FIXED
          className="w-full p-2 border mb-2"
        />

        {/* PASSWORD */}
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border mb-3"
        />

        <button
          onClick={resetPassword}
          className="w-full bg-green-600 text-white p-2"
        >
          Reset Password
        </button>

      </div>
    </div>
  );
}

export default ResetPassword;