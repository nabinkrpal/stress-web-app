import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale, LinearScale, BarElement,
  LineElement, PointElement, Title, Tooltip, Legend
);

/* ── Styles ── */
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

  .hist-root {
    min-height: 100vh;
    background: var(--bg);
    font-family: 'DM Sans', sans-serif;
    color: var(--text-primary);
    overflow-x: hidden;
    position: relative;
  }

  .hist-root::before {
    content: '';
    position: fixed;
    top: -200px; left: -200px;
    width: 600px; height: 600px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(79,142,247,0.10) 0%, transparent 70%);
    pointer-events: none; z-index: 0;
  }
  .hist-root::after {
    content: '';
    position: fixed;
    bottom: -150px; right: -100px;
    width: 500px; height: 500px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(34,197,94,0.07) 0%, transparent 70%);
    pointer-events: none; z-index: 0;
  }

  .hist-inner {
    position: relative; z-index: 1;
    max-width: 1000px; margin: 0 auto;
    padding: 32px 20px 80px;
  }

  /* Header */
  .hist-header {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 40px; flex-wrap: wrap; gap: 16px;
  }
  .hist-logo { font-family: 'Syne', sans-serif; font-size: 26px; font-weight: 800; letter-spacing: -0.5px; }
  .hist-logo span { color: var(--accent); }

  /* Glass */
  .glass {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    backdrop-filter: blur(20px);
    transition: border-color .2s;
  }

  /* Section title */
  .section-title {
    font-family: 'Syne', sans-serif;
    font-size: 15px; font-weight: 700; letter-spacing: 0.5px;
    margin-bottom: 18px;
    display: flex; align-items: center; gap: 10px;
  }
  .section-title .dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: var(--accent); box-shadow: 0 0 10px var(--accent);
    flex-shrink: 0;
  }
  .divider { height: 1px; background: var(--border); margin: 0 0 20px; }

  /* Records list */
  .records-wrap { padding: 24px; margin-bottom: 24px; }
  .records-scroll { max-height: 420px; overflow-y: auto; padding-right: 4px; }
  .records-scroll::-webkit-scrollbar { width: 4px; }
  .records-scroll::-webkit-scrollbar-track { background: transparent; }
  .records-scroll::-webkit-scrollbar-thumb { background: var(--border-bright); border-radius: 4px; }

  .record-item {
    padding: 16px 18px;
    border-radius: 12px;
    border: 1px solid var(--border);
    background: rgba(255,255,255,0.03);
    margin-bottom: 12px;
    animation: fadeUp .25s ease;
    transition: border-color .2s, background .2s;
  }
  .record-item:hover { border-color: var(--border-bright); background: rgba(255,255,255,0.055); }
  .record-item:last-child { margin-bottom: 0; }

  .record-header {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 12px;
  }
  .record-type {
    font-size: 12px; font-weight: 600; text-transform: uppercase;
    letter-spacing: 1.5px; display: flex; align-items: center; gap: 6px;
  }
  .record-type.webcam { color: var(--accent); }
  .record-type.form   { color: var(--green); }

  .stress-badge {
    font-family: 'Syne', sans-serif;
    font-size: 13px; font-weight: 700;
    padding: 3px 12px; border-radius: 20px;
  }
  .stress-badge.low    { background: rgba(34,197,94,0.15);  color: var(--green); border: 1px solid rgba(34,197,94,0.3); }
  .stress-badge.medium { background: rgba(245,158,11,0.15); color: var(--yellow); border: 1px solid rgba(245,158,11,0.3); }
  .stress-badge.high   { background: rgba(239,68,68,0.15);  color: var(--red);   border: 1px solid rgba(239,68,68,0.3); }

  .record-img { width: 120px; height: 80px; object-fit: cover; border-radius: 8px; border: 1px solid var(--border); margin-bottom: 10px; display: block; }

  .record-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px 16px; font-size: 13px; color: var(--text-muted); }
  .record-grid span { color: var(--text-primary); font-weight: 500; }

  .record-emotion { font-size: 13px; color: var(--text-muted); margin-bottom: 4px; }
  .record-emotion span { color: var(--text-primary); font-weight: 600; }

  .record-time { font-size: 11px; color: var(--text-muted); margin-top: 10px; letter-spacing: 0.5px; }

  /* Chart cards */
  .chart-wrap { padding: 24px; margin-bottom: 24px; }

  /* Empty state */
  .empty-state {
    text-align: center; padding: 48px 20px;
    color: var(--text-muted); font-size: 14px;
  }
  .empty-icon { font-size: 40px; margin-bottom: 12px; }

  /* Buttons */
  .btn {
    border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif; font-weight: 500;
    border-radius: 10px; transition: all .2s;
    display: inline-flex; align-items: center; justify-content: center; gap: 6px;
  }
  .btn-outline {
    background: transparent;
    border: 1px solid var(--border-bright);
    color: var(--text-primary);
    padding: 10px 20px; font-size: 13px;
  }
  .btn-outline:hover { background: var(--surface-hover); border-color: var(--accent); color: var(--accent); }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

/* Chart shared options */
const chartOptions = (title) => ({
  responsive: true,
  plugins: {
    legend: { labels: { color: "rgba(241,245,249,0.6)", font: { family: "DM Sans", size: 12 } } },
    title:  { display: false },
    tooltip: {
      backgroundColor: "rgba(8,12,20,0.95)",
      borderColor: "rgba(255,255,255,0.1)",
      borderWidth: 1,
      titleColor: "#f1f5f9",
      bodyColor: "rgba(241,245,249,0.7)",
    },
  },
  scales: {
    x: { ticks: { color: "rgba(241,245,249,0.45)", font: { family: "DM Sans", size: 11 } }, grid: { color: "rgba(255,255,255,0.05)" } },
    y: { ticks: { color: "rgba(241,245,249,0.45)", font: { family: "DM Sans", size: 11 } }, grid: { color: "rgba(255,255,255,0.05)" } },
  },
});

function History() {
  const [records, setRecords] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await API.get("/history");
        setRecords(res.data);
      } catch { console.error("Error fetching history"); }
    };
    fetchHistory();
  }, []);

  const formRecords = records.filter(r => r.type === "form");

  /* Stress distribution */
  const stressCount = { Low: 0, Medium: 0, High: 0 };
  formRecords.forEach(item => { if (stressCount[item.predicted_stress] !== undefined) stressCount[item.predicted_stress]++; });

  const barData = {
    labels: ["Low", "Medium", "High"],
    datasets: [{
      label: "Stress Level Count",
      data: [stressCount.Low, stressCount.Medium, stressCount.High],
      backgroundColor: ["rgba(34,197,94,0.6)", "rgba(245,158,11,0.6)", "rgba(239,68,68,0.6)"],
      borderColor:     ["rgba(34,197,94,1)",   "rgba(245,158,11,1)",   "rgba(239,68,68,1)"],
      borderWidth: 1,
      borderRadius: 8,
    }],
  };

  /* Trend */
  const sortedFormRecords = [...formRecords].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

  const trendData = {
    labels: sortedFormRecords.map(r => new Date(r.created_at).toLocaleDateString()),
    datasets: [{
      label: "Stress Trend",
      data: sortedFormRecords.map(r => r.predicted_stress === "Low" ? 1 : r.predicted_stress === "Medium" ? 2 : 3),
      borderColor: "rgba(79,142,247,0.9)",
      backgroundColor: "rgba(79,142,247,0.08)",
      pointBackgroundColor: "rgba(79,142,247,1)",
      pointRadius: 5,
      fill: true,
      tension: 0.4,
    }],
  };
  const exportPDF = async () => {
    try {
      const token = localStorage.getItem("token");
  
      const response = await fetch("https://stress-web.onrender.com/export-pdf", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
  
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
  
      const a = document.createElement("a");
      a.href = url;
      a.download = "stress_report.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
  
    } catch (err) {
      alert("Failed to download PDF");
    }
  };

  const badgeClass = s => s === "Low" ? "low" : s === "Medium" ? "medium" : "high";

  return (
    <>
      <style>{STYLES}</style>
      <div className="hist-root">
        <div className="hist-inner">

          {/* Header */}
          <header className="hist-header">
            <div className="hist-logo">Stress<span>Sens</span> <span style={{ fontSize: 14, fontWeight: 400, color: "var(--text-muted)", fontFamily: "DM Sans" }}>/ History</span></div>
            <button className="btn btn-outline" onClick={() => navigate("/dashboard")}>
              ← Back to Dashboard
            </button>
          </header>

          {/* Records */}
          <div className="glass records-wrap">
            <p className="section-title"><span className="dot"></span>Recent Records</p>
            <div className="divider"></div>

            {records.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📭</div>
                <p>No records found yet.</p>
              </div>
            ) : (
              <div className="records-scroll">
                {records.map(item => (
                  <div key={item.id} className="record-item">
                    <div className="record-header">
                      {item.type === "webcam"
                        ? <span className="record-type webcam">📸 Webcam Detection</span>
                        : <span className="record-type form">📝 Manual Input</span>
                      }
                      <span className={`stress-badge ${badgeClass(item.predicted_stress)}`}>
                        {item.predicted_stress}
                      </span>
                    </div>

                    {item.type === "webcam" ? (
                      <>
                        {item.image && <img src={item.image} alt="Captured" className="record-img" />}
                        <p className="record-emotion">Emotion: <span>{item.emotion || "N/A"}</span></p>
                      </>
                    ) : (
                      <div className="record-grid">
                        <p>😴 Sleep <span>{item.sleep_hours} hrs</span></p>
                        <p>📚 Study <span>{item.study_hours} hrs</span></p>
                        <p>📱 Screen <span>{item.screen_time} hrs</span></p>
                        <p>🎯 Attendance <span>{item.attendance}%</span></p>
                        <p>⚡ Pressure <span>{item.deadline_pressure}</span></p>
                      </div>
                    )}

                    <p className="record-time">{new Date(item.created_at).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bar Chart */}
          <div className="glass chart-wrap">
            <p className="section-title"><span className="dot" style={{ background: "var(--yellow)", boxShadow: "0 0 10px var(--yellow)" }}></span>Stress Distribution</p>
            <div className="divider"></div>
            <Bar data={barData} options={chartOptions()} />
          </div>

          {/* Line Chart */}
          <div className="glass chart-wrap">

            <p className="section-title"><span className="dot"></span>Stress Trend Over Time</p>
            <div className="divider"></div>
            <Line data={trendData} options={{
              ...chartOptions(),
              scales: {
                ...chartOptions().scales,
                y: {
                  ...chartOptions().scales.y,
                  min: 0, max: 4,
                  ticks: {
                    ...chartOptions().scales.y.ticks,
                    callback: v => ["", "Low", "Medium", "High"][v] || "",
                    stepSize: 1,
                  },
                },
              },
            }} />
          </div>
          <button className="btn btn-outline" onClick={exportPDF} className="btn btn-primary">
            📄 Download Report
          </button>
        </div>
      </div>
    </>
  );
}

export default History;
