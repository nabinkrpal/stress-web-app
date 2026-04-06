import { useNavigate } from "react-router-dom";

function Verified() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-blue-100 p-6">
      
      <div className="bg-white shadow-2xl rounded-2xl p-10 text-center max-w-md w-full">
        
        {/* ICON */}
        <div className="text-6xl mb-4">✅</div>

        {/* TITLE */}
        <h1 className="text-3xl font-bold text-green-600 mb-2">
          Email Verified
        </h1>

        {/* MESSAGE */}
        <p className="text-gray-600 mb-6">
          Your account has been successfully verified.  
          You can now login and start using the app.
        </p>

        {/* BUTTON */}
        <button
          onClick={() => navigate("/login")}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition"
        >
          Go to Login
        </button>

      </div>

    </div>
  );
}

export default Verified;
