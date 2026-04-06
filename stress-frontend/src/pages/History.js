// export default History;
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
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

function History() {
  const [records, setRecords] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await API.get("/history");
        setRecords(res.data);
      } catch (err) {
        console.error("Error fetching history");
      }
    };

    fetchHistory();
  }, []);

  /* -----------------------------
     FILTER FORM DATA ONLY
  ----------------------------- */

  const formRecords = records.filter((r) => r.type === "form");

  /* -----------------------------
     Stress Distribution Chart
  ----------------------------- */

  const stressCount = {
    Low: 0,
    Medium: 0,
    High: 0,
  };

  formRecords.forEach((item) => {
    if (stressCount[item.predicted_stress] !== undefined) {
      stressCount[item.predicted_stress]++;
    }
  });

  const barData = {
    labels: ["Low", "Medium", "High"],
    datasets: [
      {
        label: "Stress Level Count",
        data: [
          stressCount.Low,
          stressCount.Medium,
          stressCount.High,
        ],
        backgroundColor: [
          "rgba(34,197,94,0.7)",
          "rgba(234,179,8,0.7)",
          "rgba(239,68,68,0.7)",
        ],
        borderRadius: 8,
      },
    ],
  };

  /* -----------------------------
     Stress Trend Graph
  ----------------------------- */

  const trendData = {
    labels: formRecords.map((r) =>
      new Date(r.created_at).toLocaleDateString()
    ),
    datasets: [
      {
        label: "Stress Trend",
        data: formRecords.map((r) => {
          if (r.predicted_stress === "Low") return 1;
          if (r.predicted_stress === "Medium") return 2;
          return 3;
        }),
        borderColor: "rgb(59,130,246)",
        tension: 0.3,
      },
    ],
  };

  /* -----------------------------
     COLOR HELPER
  ----------------------------- */

  const getColor = (stress) => {
    if (stress === "Low") return "text-green-500";
    if (stress === "Medium") return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-6">

      <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-2xl p-8">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">
            📊 Prediction History
          </h2>

          <button
            onClick={() => navigate("/dashboard")}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Back
          </button>
        </div>

        {/* HISTORY LIST */}
        <div className="mb-8">

          <h3 className="text-xl font-semibold mb-4 text-gray-700">
            Recent Records
          </h3>

          {records.length === 0 ? (
            <p className="text-gray-500">No records found.</p>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">

              {records.map((item) => (

                <div
                  key={item.id}
                  className="p-4 bg-gray-50 rounded-xl shadow border"
                >

                  {/* 🔥 WEBCAM RECORD */}
                  {item.type === "webcam" ? (
                    <div>

                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-blue-600 font-semibold">
                          📸 Webcam Detection
                        </span>

                        <span className={`font-bold ${getColor(item.predicted_stress)}`}>
                          {item.predicted_stress}
                        </span>
                      </div>

                      {/* IMAGE */}
                      {item.image && (
                        <img
                          src={item.image}
                          // src={`https://stress-web.onrender.com${item.image}`}
                          alt="Captured"
                          className="w-40 h-28 object-cover rounded mb-2 border"
                        />
                      )}

                      {/* EMOTION */}
                      <p className="text-sm">
                        😊 Emotion: <strong>{item.emotion || "N/A"}</strong>
                      </p>

                      {/* TIME */}
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(item.created_at).toLocaleString()}
                      </p>

                    </div>
                  ) : (

                    /* 🔥 FORM RECORD */
                    <div>

                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-green-600 font-semibold">
                          📝 Manual Input
                        </span>

                        <span className={`font-bold ${getColor(item.predicted_stress)}`}>
                          {item.predicted_stress}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-sm">

                        <p>😴 Sleep: {item.sleep_hours}</p>
                        <p>📚 Study: {item.study_hours}</p>
                        <p>📱 Screen: {item.screen_time}</p>
                        <p>🎯 Attendance: {item.attendance}%</p>
                        <p>⚡ Pressure: {item.deadline_pressure}</p>

                      </div>

                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(item.created_at).toLocaleString()}
                      </p>

                    </div>
                  )}

                </div>
              ))}

            </div>
          )}
        </div>

        {/* BAR CHART */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">
            Stress Distribution (Form Data)
          </h3>

          <div className="bg-gray-50 p-4 rounded-xl shadow">
            <Bar data={barData} />
          </div>
        </div>

        {/* LINE CHART */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-700">
            Stress Trend Over Time (Form Data)
          </h3>

          <div className="bg-gray-50 p-4 rounded-xl shadow">
            <Line data={trendData} />
          </div>
        </div>

      </div>
    </div>
  );
}

export default History;
