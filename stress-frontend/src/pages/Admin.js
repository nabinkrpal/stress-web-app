// import { useEffect, useState } from "react";
import { useEffect, useState, useCallback } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

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
    overflow-x: auto;
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
`;

function Admin() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [records, setRecords] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);

  // useEffect(() => {
  //   fetchAll();
  // }, []);
  useEffect(() => {
    fetchAll();
  }, [fetchAll]);
  const fetchAll = useCallback(async () => {
    try {
      const u = await API.get("/admin/users");
      const r = await API.get("/admin/stress-records");
      const f = await API.get("/admin/feedbacks");
  
      setUsers(u.data);
      setRecords(r.data);
      setFeedbacks(f.data);
    } catch (err) {
      alert("Admin access denied");
      navigate("/dashboard");
    }
  }, [navigate]);
  // const fetchAll = async () => {
  //   try {
  //     const u = await API.get("/admin/users");
  //     const r = await API.get("/admin/stress-records");
  //     const f = await API.get("/admin/feedbacks");

  //     setUsers(u.data);
  //     setRecords(r.data);
  //     setFeedbacks(f.data);
  //   } catch (err) {
  //     alert("Admin access denied");
  //     navigate("/dashboard");
  //   }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      await API.delete(`/admin/delete-user/${id}`);
      setUsers(users.filter(u => u.id !== id));
    } catch {
      alert("Delete failed");
    }
  };

  return (
    <>
      <style>{STYLES}</style>

      <div className="admin-root">
        <button className="btn-back" onClick={() => navigate("/dashboard")}>
          ← Back
        </button>

        <div className="admin-title">Admin Panel</div>

        {/* USERS */}
        <div className="admin-section">
          <h3>👥 Users</h3>
          <div className="admin-card">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Admin</th>
                  <th>Verified</th>
                  <th>Action</th>
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
                      <button
                        className="btn btn-delete"
                        onClick={() => deleteUser(u.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* RECORDS */}
        <div className="admin-section">
          <h3>📊 Stress Records</h3>
          <div className="admin-card">
            <table>
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Stress</th>
                  <th>Source</th>
                  <th>Emotion</th>
                  <th>Date</th>
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
          <div className="admin-card">
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

export default AdminPage;
