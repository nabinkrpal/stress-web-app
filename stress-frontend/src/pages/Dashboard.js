import { useState, useEffect, useRef } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

/* ── Styles unchanged ── */
// const STYLES = `...YOUR SAME STYLES HERE (NO CHANGE)...`;
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  :root {
    --bg: #080c14;
    --surface: rgba(255,255,255,0.04);
    --surface-hover: rgba(255,255,255,0.07);
    --border: rgba(255,255,255,0.08);
    --border-bright: rgba(255,255,255,0.16);
    --accent: #4f8ef7;
    --accent-glow: rgba(79,142,247,0.25);
    --green: #22c55e;
    --yellow: #f59e0b;
    --red: #ef4444;
    --text-primary: #f1f5f9;
    --text-muted: rgba(241,245,249,0.45);
    --radius: 18px;
  }

  .dash-root {
    min-height: 100vh;
    background: var(--bg);
    font-family: 'DM Sans', sans-serif;
    color: var(--text-primary);
    overflow-x: hidden;
    position: relative;
  }

  /* Ambient background blobs */
  .dash-root::before {
    content: '';
    position: fixed;
    top: -200px; left: -200px;
    width: 600px; height: 600px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(79,142,247,0.12) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }
  .dash-root::after {
    content: '';
    position: fixed;
    bottom: -150px; right: -100px;
    width: 500px; height: 500px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(239,68,68,0.08) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }

  .dash-inner { position: relative; z-index: 1; max-width: 1100px; margin: 0 auto; padding: 32px 20px 80px; }

  /* Header */
  .dash-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 40px;
    flex-wrap: wrap;
    gap: 16px;
  }
  .dash-logo { font-family: 'Syne', sans-serif; font-size: 26px; font-weight: 800; letter-spacing: -0.5px; }
  .dash-logo span { color: var(--accent); }

  .header-actions { display: flex; gap: 10px; flex-wrap: wrap; }

  /* Glass card */
  .glass {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    backdrop-filter: blur(20px);
    transition: border-color .2s, background .2s;
  }
  .glass:hover { border-color: var(--border-bright); background: var(--surface-hover); }

  /* Stat cards */
  .stats-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; margin-bottom: 28px; }
  @media(max-width:640px){ .stats-grid { grid-template-columns: 1fr; } }

  .stat-card {
    padding: 24px 20px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .stat-card::before {
    content: '';
    position: absolute;
    top: 0; left: 50%; transform: translateX(-50%);
    width: 60%; height: 1px;
    background: linear-gradient(90deg, transparent, var(--accent), transparent);
  }
  .stat-label { font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: var(--text-muted); margin-bottom: 10px; }
  .stat-value { font-family: 'Syne', sans-serif; font-size: 36px; font-weight: 800; line-height: 1; }
  .stat-value.danger { color: var(--red); }
  .stat-value.accent { color: var(--accent); }

  /* Main grid */
  .main-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  @media(max-width:768px){ .main-grid { grid-template-columns: 1fr; } }

  /* Section headings */
  .section-title {
    font-family: 'Syne', sans-serif;
    font-size: 15px;
    font-weight: 700;
    letter-spacing: 0.5px;
    margin-bottom: 22px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .section-title .dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    background: var(--accent);
    box-shadow: 0 0 10px var(--accent);
  }

  /* Form */
  .form-card { padding: 28px; }

  .input-group { margin-bottom: 14px; }
  .input-label { font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: var(--text-muted); margin-bottom: 6px; display: block; }
  .dash-input {
    width: 100%;
    background: rgba(255,255,255,0.05);
    border: 1px solid var(--border);
    border-radius: 10px;
    color: var(--text-primary);
    padding: 11px 14px;
    font-size: 14px;
    font-family: 'DM Sans', sans-serif;
    outline: none;
    box-sizing: border-box;
    transition: border-color .2s, box-shadow .2s;
  }
  .dash-input::placeholder { color: rgba(241,245,249,0.25); }
  .dash-input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px var(--accent-glow);
  }

  /* Buttons */
  .btn {
    border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    font-weight: 500;
    border-radius: 10px;
    transition: all .2s;
    display: inline-flex; align-items: center; justify-content: center; gap: 6px;
  }
  .btn-primary {
    background: var(--accent);
    color: #fff;
    padding: 12px 20px;
    font-size: 14px;
    width: 100%;
    box-shadow: 0 4px 20px var(--accent-glow);
  }
  .btn-primary:hover { background: #6aa0ff; transform: translateY(-1px); box-shadow: 0 6px 28px var(--accent-glow); }
  .btn-primary:active { transform: translateY(0); }

  .btn-outline {
    background: transparent;
    border: 1px solid var(--border-bright);
    color: var(--text-primary);
    padding: 9px 18px;
    font-size: 13px;
  }
  .btn-outline:hover { background: var(--surface-hover); border-color: var(--accent); color: var(--accent); }

  .btn-danger { background: rgba(239,68,68,0.15); border: 1px solid rgba(239,68,68,0.3); color: var(--red); padding: 9px 18px; font-size: 13px; }
  .btn-danger:hover { background: rgba(239,68,68,0.25); }

  .btn-green { background: rgba(34,197,94,0.15); border: 1px solid rgba(34,197,94,0.3); color: var(--green); padding: 11px 20px; font-size: 14px; width: 100%; }
  .btn-green:hover { background: rgba(34,197,94,0.25); }

  .btn-red-full { background: rgba(239,68,68,0.15); border: 1px solid rgba(239,68,68,0.3); color: var(--red); padding: 11px 20px; font-size: 14px; width: 100%; }
  .btn-red-full:hover { background: rgba(239,68,68,0.25); }

  /* Result pill */
  .result-box {
    margin-top: 20px;
    padding: 18px;
    border-radius: 12px;
    text-align: center;
    background: rgba(255,255,255,0.03);
    border: 1px solid var(--border);
    animation: fadeUp .3s ease;
  }
  .result-level { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 800; }
  .result-level.low { color: var(--green); text-shadow: 0 0 20px rgba(34,197,94,0.4); }
  .result-level.medium { color: var(--yellow); text-shadow: 0 0 20px rgba(245,158,11,0.4); }
  .result-level.high { color: var(--red); text-shadow: 0 0 20px rgba(239,68,68,0.4); }
  .result-hint { font-size: 13px; color: var(--text-muted); margin-top: 6px; }

  /* Webcam card */
  .webcam-card { padding: 28px; }
  .video-frame {
    width: 100%;
    border-radius: 12px;
    margin: 16px 0 0;
    background: rgba(0,0,0,0.4);
    border: 1px solid var(--border);
    display: block;
  }

  /* Footer actions */
  .footer-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 36px;
    flex-wrap: wrap;
    gap: 12px;
  }
  .btn-link {
    background: none; border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    color: var(--accent);
    font-size: 14px;
    padding: 0;
    display: flex; align-items: center; gap: 6px;
    transition: opacity .2s;
  }
  .btn-link:hover { opacity: .7; }
  .btn-link svg { transition: transform .2s; }
  .btn-link:hover svg { transform: translateX(3px); }

  /* Divider */
  .divider { height: 1px; background: var(--border); margin: 8px 0 20px; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .pulse-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: var(--green);
    animation: pulse 1.5s infinite;
    display: inline-block;
  }
  @keyframes pulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.6); }
    50%       { box-shadow: 0 0 0 5px rgba(34,197,94,0); }
  }
`;

function Dashboard() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [formData, setFormData] = useState({
    sleep_hours: "", study_hours: "", screen_time: "",
    attendance: "", deadline_pressure: "",
  });

  const [result, setResult] = useState(null);
  const [webcamResult, setWebcamResult] = useState(null);

  const [loading, setLoading] = useState(false); // form loading
  const [webcamLoading, setWebcamLoading] = useState(false); // 🔥 NEW

  const [cameraOn, setCameraOn] = useState(false);
  const [stats, setStats] = useState({ total: 0, high: 0, avgSleep: 0 });

  useEffect(() => { loadStats(); }, []);

  const loadStats = async () => {
    try {
      const res = await API.get("/history");
      const records = res.data;

      const highCount = records.filter(r => r.predicted_stress === "High").length;
      const formRecords = records.filter(r => r.type === "form");

      const avgSleep = formRecords.reduce((a, b) => a + (b.sleep_hours || 0), 0) / (formRecords.length || 1);

      setStats({
        total: records.length,
        high: highCount,
        avgSleep: avgSleep.toFixed(1)
      });
    } catch {
      console.log("Stats load error");
    }
  };

  useEffect(() => () => stopCamera(), []);

  useEffect(() => {
    const handleVisibility = () => { if (document.hidden) stopCamera(); };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  const handleChange = e =>
    setFormData({ ...formData, [e.target.name]: Number(e.target.value) });

  const handlePredict = async e => {
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

  const getSuggestion = stress => {
    if (stress === "High") return "Reduce screen time & prioritise sleep tonight.";
    if (stress === "Medium") return "Balance your study sessions with short breaks.";
    return "You're doing great — keep up the routine!";
  };

  const startCamera = async () => {
    try {
      stopCamera();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false
      });

      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;

      setCameraOn(true);
    } catch {
      alert("Camera access denied");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraOn(false);
  };

  // 🔥 FIXED FUNCTION
  const captureImage = async () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (!video || !canvas) return;

    setWebcamLoading(true);

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);

    canvas.toBlob(async (blob) => {
      const fd = new FormData();
      fd.append("file", blob, "capture.jpg");

      try {
        const res = await API.post("/webcam-stress", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        setWebcamResult(res.data);
        loadStats();
      } catch {
        alert("Webcam detection failed");
      } finally {
        setWebcamLoading(false);
      }
    });
  };

  const handleLogout = () => {
    stopCamera();
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleDeactivate = async () => {
    if (!window.confirm("Permanently deactivate your account?")) return;
    await API.delete("/deactivate-account");
    localStorage.removeItem("token");
    navigate("/");
  };

  const stressClass = s =>
    s === "Low" ? "low" : s === "Medium" ? "medium" : "high";

  return (
    <>
      <style>{STYLES}</style>

      <div className="dash-root">
        <div className="dash-inner">

          {/* Header */}
          <header className="dash-header">
            <div className="dash-logo">Stress<span>sens</span></div>

            <div className="header-actions">
              <button className="btn btn-outline" onClick={() => navigate("/about-feedback")}>
                ℹ️ About & Feedback
              </button>
              <button className="btn btn-outline" onClick={() => navigate("/reset-password")}>
                🔑 Reset Password
              </button>
              <button className="btn btn-danger" onClick={handleLogout}>
                ← Logout
              </button>
            </div>
          </header>

          {/* Stats */}
          <div className="stats-grid">
            <div className="glass stat-card">
              <p className="stat-label">Total Checks</p>
              <p className="stat-value accent">{stats.total}</p>
            </div>
            <div className="glass stat-card">
              <p className="stat-label">High Stress Events</p>
              <p className="stat-value danger">{stats.high}</p>
            </div>
            <div className="glass stat-card">
              <p className="stat-label">Avg Sleep (hrs)</p>
              <p className="stat-value">{stats.avgSleep}</p>
            </div>
          </div>

          <div className="main-grid">

            {/* Form */}
            <div className="glass form-card">
              <p className="section-title"><span className="dot"></span>Manual Prediction</p>
              <div className="divider"></div>

              <form onSubmit={handlePredict}>
                {["sleep_hours","study_hours","screen_time","attendance","deadline_pressure"].map(name => (
                  <div className="input-group" key={name}>
                    <label className="input-label">{name.replace("_"," ")}</label>
                    <input className="dash-input" name={name} type="number" onChange={handleChange}/>
                  </div>
                ))}

                <button type="submit" className="btn btn-primary">
                  {loading ? "Analysing…" : "⚡ Predict Stress Level"}
                </button>
              </form>

              {result && (
                <div className="result-box">
                  <p className={`result-level ${stressClass(result.predicted_stress)}`}>
                    {result.predicted_stress} Stress
                  </p>
                  <p className="result-hint">{getSuggestion(result.predicted_stress)}</p>
                </div>
              )}
            </div>

            {/* Webcam */}
            <div className="glass webcam-card">
              <p className="section-title">Webcam Detection</p>
              <div className="divider"></div>

              {!cameraOn ? (
                <button className="btn btn-green" onClick={startCamera}>
                  📷 Start Camera
                </button>
              ) : (
                <button className="btn btn-red-full" onClick={stopCamera}>
                  ■ Stop Camera
                </button>
              )}

              <video ref={videoRef} autoPlay className="video-frame"/>
              <canvas ref={canvasRef} style={{ display: "none" }}/>

              {cameraOn && (
                <button
                  className="btn btn-primary"
                  style={{ marginTop: 14 }}
                  onClick={captureImage}
                  disabled={webcamLoading}
                >
                  {webcamLoading ? "Detecting…" : "🔍 Detect Stress Now"}
                </button>
              )}

              {webcamLoading && (
                <p style={{ fontSize: 12, marginTop: 8, color: "#aaa" }}>
                  Processing image...
                </p>
              )}

              {webcamResult && (
                <div className="result-box">
                  <p>{webcamResult.emotion}</p>
                  <p className={`result-level ${stressClass(webcamResult.predicted_stress)}`}>
                    {webcamResult.predicted_stress}
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="footer-row">
            <button className="btn-link" onClick={() => navigate("/history")}>
              View History →
            </button>
          
            <button className="btn-link" onClick={() => navigate("/terms")}>
              Terms & Conditions
            </button>
          
            <button
              className="btn btn-danger"
              onClick={handleDeactivate}
              style={{ padding: "10px 20px", fontSize: 13 }}
            >
              🗑 Deactivate Account
            </button>
          </div>

        </div>
      </div>
    </>
  );
}

export default Dashboard;
