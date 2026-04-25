import { useEffect, useState, useCallback } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import {
  PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts";

const COLORS = ["#22c55e", "#f59e0b", "#ef4444"];

const STYLES = `
  .admin-root {
    min-height: 100vh;
    background: #080c14;
    color: #f1f5f9;
    padding: 30px;
    font-family: 'DM Sans', sans-serif;
  }

  .admin-title {
    font-size: 28px;
    font-weight: 800;
    margin-bottom: 20px;
  }

  .admin-section {
    margin-top: 30px;
  }

  .admin-card {
    background: rgba(255,255,255,0.05);
    padding: 20px;
    border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.1);
  }

  .scroll-box {
    max-height: 300px;
    overflow-y: auto;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
  }

  th, td {
    padding: 10px;
    border-bottom: 1px solid rgba(255,255,255,0.1);
    text-align: left;
  }

  th {
    color: #94a3b8;
    font-size: 12px;
    text-transform: uppercase;
  }

  .btn {
    padding: 6px 10px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
  }

  .btn-delete {
    background: rgba(239,68,68,0.2);
    color: #ef4444;
  }

  .btn-delete:hover {
    background: rgba(239,68,68,0.3);
  }

  .btn-back {
    margin-bottom: 20px;
    background: transparent;
    border: 1px solid rgba(255,255,255,0.2);
    color: white;
    padding: 8px 14px;
    border-radius: 8px;
    cursor: pointer;
  }

  .feedback-box {
    background: rgba(255,255,255,0.04);
    padding: 12px;
    border-radius: 10px;
    margin-bottom: 10px;
  }

  .stats-grid {
    display: flex;
    gap: 15px;
    flex-wrap: wrap;
  }

  .stat-box {
    flex: 1;
    min-width: 150px;
    background: rgba(255,255,255,0.05);
    padding: 15px;
    border-radius: 10px;
    text-align: center;
  }

  .charts {
    display: flex;
    gap: 30px;
    flex-wrap: wrap;
    justify-content: space-between;
  }
`;

function Admin() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [records, setRecords] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);

  const fetchAll = useCallback(async () => {
    try {
      const [usersRes, recordsRes, feedbackRes] = await Promise.all([
        API.get("/admin/users"),
        API.get("/admin/stress-records"),
        API.get("/admin/feedbacks"),
      ]);

      setUsers(usersRes.data);
      setRecords(recordsRes.data);
      setFeedbacks(feedbackRes.data);
    } catch (err) {
      console.log("Admin fetch error:", err);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await API.delete(`/admin/delete-user/${id}`);
      setUsers(users.filter(u => u.id !== id));
    } catch {
      alert("Delete failed");
    }
  };

  // 📊 DATA
  const stressData = [
    { name: "Low", value: records.filter(r => r.stress === "Low").length },
    { name: "Medium", value: records.filter(r => r.stress === "Medium").length },
    { name: "High", value: records.filter(r => r.stress === "High").length },
  ];

  const sourceData = [
    { name: "Form", value: records.filter(r => r.source === "form").length },
    { name: "Webcam", value: records.filter(r => r.source === "webcam").length },
  ];

  return (
    <>
      <style>{STYLES}</style>

      <div className="admin-root">
        <button className="btn-back" onClick={() => navigate("/dashboard")}>
          ← Back
        </button>

        <div className="admin-title">Admin Panel</div>

        {/* 📊 STATS */}
        <div className="stats-grid">
          <div className="stat-box">👤 Users: {users.length}</div>
          <div className="stat-box">📊 Records: {records.length}</div>
          <div className="stat-box">💬 Feedback: {feedbacks.length}</div>
        </div>

        {/* 📈 CHARTS */}
        <div className="admin-section charts">

          {/* Pie */}
          <div className="admin-card">
            <h4>Stress Distribution</h4>
            <PieChart width={250} height={250}>
              <Pie data={stressData} dataKey="value" outerRadius={80}>
                {stressData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </div>

          {/* Bar */}
          <div className="admin-card">
            <h4>Source Analysis</h4>
            <BarChart width={250} height={250} data={sourceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#4f8ef7" />
            </BarChart>
          </div>

        </div>

        {/* USERS */}
        <div className="admin-section">
          <h3>👥 Users</h3>
          <div className="admin-card scroll-box">
            <table>
              <thead>
                <tr>
                  <th>ID</th><th>Name</th><th>Email</th>
                  <th>Admin</th><th>Verified</th><th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.is_admin ? "Yes" : "No"}</td>
                    <td>{u.is_verified ? "Yes" : "No"}</td>
                    <td>
                      <button className="btn btn-delete" onClick={() => deleteUser(u.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* RECORDS (SCROLL FIXED HEIGHT) */}
        <div className="admin-section">
          <h3>📊 Stress Records</h3>
          <div className="admin-card scroll-box">
            <table>
              <thead>
                <tr>
                  <th>User</th><th>Stress</th><th>Source</th><th>Emotion</th><th>Date</th>
                </tr>
              </thead>
              <tbody>
                {records.map(r => (
                  <tr key={r.id}>
                    <td>{r.user_id}</td>
                    <td>{r.stress}</td>
                    <td>{r.source}</td>
                    <td>{r.emotion || "-"}</td>
                    <td>{new Date(r.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FEEDBACK */}
        <div className="admin-section">
          <h3>💬 Feedback</h3>
          <div className="admin-card scroll-box">
            {feedbacks.map(f => (
              <div key={f.id} className="feedback-box">
                <strong>{f.name}</strong> (User {f.user_id})
                <p>{f.message}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </>
  );
}

export default Admin;
