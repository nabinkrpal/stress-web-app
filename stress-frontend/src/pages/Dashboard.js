import { useState, useEffect, useRef } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null); // 🔥 important

  const [formData, setFormData] = useState({
    sleep_hours: "",
    study_hours: "",
    screen_time: "",
    attendance: "",
    deadline_pressure: "",
  });

  const [result, setResult] = useState(null);
  const [webcamResult, setWebcamResult] = useState(null);

  const [loading, setLoading] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);

  const [stats, setStats] = useState({
    total: 0,
    high: 0,
    avgSleep: 0,
  });

  /* -------------------------
      LOAD STATS
  ------------------------- */
  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const res = await API.get("/history");
      const records = res.data;

      const highCount = records.filter(
        (r) => r.predicted_stress === "High"
      ).length;

      const formRecords = records.filter((r) => r.type === "form");

      const avgSleep =
        formRecords.reduce((a, b) => a + (b.sleep_hours || 0), 0) /
        (formRecords.length || 1);

      setStats({
        total: records.length,
        high: highCount,
        avgSleep: avgSleep.toFixed(1),
      });
    } catch {
      console.log("Stats load error");
    }
  };

  /* -------------------------
      CLEANUP CAMERA ON EXIT
  ------------------------- */
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  /* -------------------------
      STOP CAMERA ON TAB CHANGE (MOBILE FIX)
  ------------------------- */
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        stopCamera();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  /* -------------------------
      INPUT CHANGE
  ------------------------- */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: Number(e.target.value),
    });
  };

  /* -------------------------
      PREDICT
  ------------------------- */
  const handlePredict = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post("/predict", formData);
      setResult(res.data);
      loadStats();
    } catch {
      alert("Prediction failed");
    }

    setLoading(false);
  };

  const getSuggestion = (stress) => {
    if (stress === "High") return "Reduce screen time & improve sleep.";
    if (stress === "Medium") return "Balance study with relaxation.";
    return "Great! Maintain your routine.";
  };

  /* -------------------------
      START CAMERA (MOBILE FIX)
  ------------------------- */
  const startCamera = async () => {
    try {
      stopCamera(); // prevent duplicate

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user", // 🔥 mobile front cam
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setCameraOn(true);
    } catch {
      alert("Camera access denied or not supported");
    }
  };

  /* -------------------------
      STOP CAMERA
  ------------------------- */
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setCameraOn(false);
  };

  /* -------------------------
      CAPTURE IMAGE
  ------------------------- */
  const captureImage = async () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    canvas.toBlob(async (blob) => {
      const formData = new FormData();
      formData.append("file", blob, "capture.jpg");

      try {
        const res = await API.post("/webcam-stress", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        setWebcamResult(res.data);
        loadStats();
      } catch {
        alert("Webcam detection failed");
      }
    });
  };

  /* -------------------------
      NAVIGATION
  ------------------------- */
  const handleLogout = () => {
    stopCamera();
    localStorage.removeItem("token");
    navigate("/");
  };

  const goToResetPassword = () => navigate("/reset-password");

  const handleDeactivate = async () => {
    if (!window.confirm("Are you sure?")) return;

    await API.delete("/deactivate-account");
    localStorage.removeItem("token");
    navigate("/");
  };

  /* -------------------------
      COLORS
  ------------------------- */
  const getColor = (stress) => {
    if (stress === "Low") return "text-green-600";
    if (stress === "Medium") return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 p-4">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between max-w-6xl mx-auto mb-6 gap-3">
        <h1 className="text-2xl md:text-3xl font-bold text-blue-700">
          Stress Dashboard
        </h1>

        <div className="flex flex-wrap gap-2">
          <button onClick={goToResetPassword} className="bg-yellow-500 text-white px-4 py-2 rounded w-full md:w-auto">
            Reset Password
          </button>

          <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded w-full md:w-auto">
            Logout
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-6xl mx-auto mb-6">
        <div className="bg-white p-4 rounded shadow text-center">
          <p>Total</p>
          <h2 className="text-xl font-bold">{stats.total}</h2>
        </div>

        <div className="bg-white p-4 rounded shadow text-center">
          <p>High Stress</p>
          <h2 className="text-xl font-bold text-red-500">{stats.high}</h2>
        </div>

        <div className="bg-white p-4 rounded shadow text-center">
          <p>Avg Sleep</p>
          <h2 className="text-xl font-bold">{stats.avgSleep}</h2>
        </div>
      </div>

      {/* MAIN */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">

        {/* FORM */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-bold mb-4">Manual Prediction</h2>

          <form onSubmit={handlePredict} className="space-y-3">
            <input name="sleep_hours" placeholder="Sleep Hours" onChange={handleChange} className="w-full p-2 border rounded"/>
            <input name="study_hours" placeholder="Study Hours" onChange={handleChange} className="w-full p-2 border rounded"/>
            <input name="screen_time" placeholder="Screen Time" onChange={handleChange} className="w-full p-2 border rounded"/>
            <input name="attendance" placeholder="Attendance %" onChange={handleChange} className="w-full p-2 border rounded"/>
            <input name="deadline_pressure" placeholder="Deadline Pressure (1-3)" onChange={handleChange} className="w-full p-2 border rounded"/>

            <button className="w-full bg-blue-600 text-white py-2 rounded">
              {loading ? "Predicting..." : "Predict"}
            </button>
          </form>

          {result && (
            <div className="mt-4 text-center">
              <p className={`text-2xl font-bold ${getColor(result.predicted_stress)}`}>
                {result.predicted_stress}
              </p>
              <p>{getSuggestion(result.predicted_stress)}</p>
            </div>
          )}
        </div>

        {/* WEBCAM */}
        <div className="bg-white p-6 rounded-xl shadow text-center">
          <h2 className="font-bold mb-4">Webcam Stress Detection</h2>

          {!cameraOn ? (
            <button onClick={startCamera} className="bg-green-600 text-white px-4 py-2 rounded w-full">
              Start Camera
            </button>
          ) : (
            <button onClick={stopCamera} className="bg-red-600 text-white px-4 py-2 rounded w-full">
              Stop Camera
            </button>
          )}

          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full rounded mt-3"
          ></video>

          <canvas ref={canvasRef} className="hidden"></canvas>

          {cameraOn && (
            <button
              onClick={captureImage}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded w-full"
            >
              Detect Stress
            </button>
          )}

          {webcamResult && (
            <div className="mt-4">
              <p>Emotion: {webcamResult.emotion}</p>
              <p className={`text-xl font-bold ${getColor(webcamResult.predicted_stress)}`}>
                {webcamResult.predicted_stress}
              </p>
            </div>
          )}
        </div>

      </div>

      {/* FOOTER */}
      <div className="text-center mt-8">
        <button onClick={() => navigate("/history")} className="text-blue-600">
          View History
        </button>
      </div>

      {/* DANGER */}
      <div className="text-center mt-6">
        <button onClick={handleDeactivate} className="bg-red-600 text-white px-4 py-2 rounded w-full md:w-auto">
          Deactivate Account
        </button>
      </div>

    </div>
  );
}

export default Dashboard;