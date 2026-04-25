// // import { useEffect, useState } from "react";
// import { useEffect, useState, useCallback } from "react";
// import API from "../services/api";
// import { useNavigate } from "react-router-dom";

// const STYLES = `
//   .admin-root {
//     min-height: 100vh;
//     background: #080c14;
//     color: #f1f5f9;
//     padding: 30px;
//     font-family: 'DM Sans', sans-serif;
//   }

//   .admin-title {
//     font-size: 28px;
//     font-weight: 800;
//     margin-bottom: 20px;
//   }

//   .admin-section {
//     margin-top: 30px;
//   }

//   .admin-card {
//     background: rgba(255,255,255,0.05);
//     padding: 20px;
//     border-radius: 12px;
//     border: 1px solid rgba(255,255,255,0.1);
//     overflow-x: auto;
//   }

//   table {
//     width: 100%;
//     border-collapse: collapse;
//     font-size: 14px;
//   }

//   th, td {
//     padding: 10px;
//     border-bottom: 1px solid rgba(255,255,255,0.1);
//     text-align: left;
//   }

//   th {
//     color: #94a3b8;
//     font-size: 12px;
//     text-transform: uppercase;
//   }

//   .btn {
//     padding: 6px 10px;
//     border-radius: 6px;
//     border: none;
//     cursor: pointer;
//   }

//   .btn-delete {
//     background: rgba(239,68,68,0.2);
//     color: #ef4444;
//   }

//   .btn-delete:hover {
//     background: rgba(239,68,68,0.3);
//   }

//   .btn-back {
//     margin-bottom: 20px;
//     background: transparent;
//     border: 1px solid rgba(255,255,255,0.2);
//     color: white;
//     padding: 8px 14px;
//     border-radius: 8px;
//     cursor: pointer;
//   }

//   .feedback-box {
//     background: rgba(255,255,255,0.04);
//     padding: 12px;
//     border-radius: 10px;
//     margin-bottom: 10px;
//   }
// `;

// function Admin() {
//   const navigate = useNavigate();

//   const [users, setUsers] = useState([]);
//   const [records, setRecords] = useState([]);
//   const [feedbacks, setFeedbacks] = useState([]);

//   // const fetchAll = useCallback(async () => {
//   //   try {
//   //     const res = await API.get("/admin/all-data");
//   //     setUsers(res.data.users);
//   //     setRecords(res.data.records);
//   //     setFeedbacks(res.data.feedbacks);
//   //   } catch (err) {
//   //     console.log("Admin fetch error", err);
//   //   }
//   // }, []);
//   const fetchAll = useCallback(async () => {
//     try {
//       const [usersRes, recordsRes, feedbackRes] = await Promise.all([
//         API.get("/admin/users"),
//         API.get("/admin/stress-records"),
//         API.get("/admin/feedbacks"),
//       ]);
  
//       setUsers(usersRes.data);
//       setRecords(recordsRes.data);
//       setFeedbacks(feedbackRes.data);
  
//     } catch (err) {
//       console.log("Admin fetch error:", err);
//     }
//   }, []);
  
//   useEffect(() => {
//     fetchAll();
//   }, [fetchAll]);


  
//   const deleteUser = async (id) => {
//     if (!window.confirm("Delete this user?")) return;

//     try {
//       await API.delete(`/admin/delete-user/${id}`);
//       setUsers(users.filter(u => u.id !== id));
//     } catch {
//       alert("Delete failed");
//     }
//   };

//   return (
//     <>
//       <style>{STYLES}</style>

//       <div className="admin-root">
//         <button className="btn-back" onClick={() => navigate("/dashboard")}>
//           ← Back
//         </button>

//         <div className="admin-title">Admin Panel</div>

//         {/* USERS */}
//         <div className="admin-section">
//           <h3>👥 Users</h3>
//           <div className="admin-card">
//             <table>
//               <thead>
//                 <tr>
//                   <th>ID</th>
//                   <th>Name</th>
//                   <th>Email</th>
//                   <th>Admin</th>
//                   <th>Verified</th>
//                   <th>Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {users.map(u => (
//                   <tr key={u.id}>
//                     <td>{u.id}</td>
//                     <td>{u.name}</td>
//                     <td>{u.email}</td>
//                     <td>{u.is_admin ? "Yes" : "No"}</td>
//                     <td>{u.is_verified ? "Yes" : "No"}</td>
//                     <td>
//                       <button
//                         className="btn btn-delete"
//                         onClick={() => deleteUser(u.id)}
//                       >
//                         Delete
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* RECORDS */}
//         <div className="admin-section">
//           <h3>📊 Stress Records</h3>
//           <div className="admin-card">
//             <table>
//               <thead>
//                 <tr>
//                   <th>User ID</th>
//                   <th>Stress</th>
//                   <th>Source</th>
//                   <th>Emotion</th>
//                   <th>Date</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {records.map(r => (
//                   <tr key={r.id}>
//                     <td>{r.user_id}</td>
//                     <td>{r.stress}</td>
//                     <td>{r.source}</td>
//                     <td>{r.emotion || "-"}</td>
//                     <td>{new Date(r.created_at).toLocaleString()}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* FEEDBACK */}
//         <div className="admin-section">
//           <h3>💬 Feedback</h3>
//           <div className="admin-card">
//             {feedbacks.map(f => (
//               <div key={f.id} className="feedback-box">
//                 <strong>{f.name}</strong> (User {f.user_id})
//                 <p>{f.message}</p>
//               </div>
//             ))}
//           </div>
//         </div>

//       </div>
//     </>
//   );
// }

// export default Admin;

import { useState, useEffect, useCallback } from "react";
import API from "../services/api";
import {
  PieChart, Pie, Cell, Tooltip,
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, BarChart, Bar
} from "recharts";

const COLORS = ["#22c55e", "#f59e0b", "#ef4444"];

function Admin() {
  const [users, setUsers] = useState([]);
  const [records, setRecords] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);

  const fetchAll = useCallback(async () => {
    try {
      const [u, r, f] = await Promise.all([
        API.get("/admin/users"),
        API.get("/admin/stress-records"),
        API.get("/admin/feedbacks"),
      ]);
      setUsers(u.data);
      setRecords(r.data);
      setFeedbacks(f.data);
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // ======================
  // 📊 DATA PROCESSING
  // ======================

  const stressData = [
    { name: "Low", value: records.filter(r => r.stress === "Low").length },
    { name: "Medium", value: records.filter(r => r.stress === "Medium").length },
    { name: "High", value: records.filter(r => r.stress === "High").length },
  ];

  const sourceData = [
    { name: "Form", value: records.filter(r => r.source === "form").length },
    { name: "Webcam", value: records.filter(r => r.source === "webcam").length },
  ];

  const timelineData = records.map(r => ({
    date: new Date(r.created_at).toLocaleDateString(),
    stress: r.stress === "High" ? 3 : r.stress === "Medium" ? 2 : 1
  }));

  const highPercent = (
    (records.filter(r => r.stress === "High").length / (records.length || 1)) * 100
  ).toFixed(1);

  // ======================
  // 🎨 UI
  // ======================

  return (
    <div style={{ padding: 30, color: "white", background: "#080c14", minHeight: "100vh" }}>

      <h1 style={{ marginBottom: 20 }}>🛠 Admin Dashboard</h1>

      {/* 🔢 Stats */}
      <div style={{ display: "flex", gap: 20, marginBottom: 30 }}>
        <div className="card">👤 Users: {users.length}</div>
        <div className="card">📊 Records: {records.length}</div>
        <div className="card">🔥 High Stress: {highPercent}%</div>
        <div className="card">💬 Feedbacks: {feedbacks.length}</div>
      </div>

      {/* 📊 Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 30 }}>

        {/* Pie */}
        <div className="card">
          <h3>Stress Distribution</h3>
          <PieChart width={300} height={250}>
            <Pie data={stressData} dataKey="value" outerRadius={80}>
              {stressData.map((_, i) => (
                <Cell key={i} fill={COLORS[i]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>

        {/* Bar */}
        <div className="card">
          <h3>Source Analysis</h3>
          <BarChart width={300} height={250} data={sourceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#4f8ef7" />
          </BarChart>
        </div>

        {/* Line */}
        <div className="card" style={{ gridColumn: "span 2" }}>
          <h3>Stress Trend</h3>
          <LineChart width={600} height={250} data={timelineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="stress" stroke="#ef4444" />
          </LineChart>
        </div>

      </div>

      {/* 💬 Feedback */}
      <div className="card" style={{ marginTop: 40 }}>
        <h3>Recent Feedback</h3>
        {feedbacks.slice(0, 5).map(f => (
          <p key={f.id}>
            <strong>{f.name}:</strong> {f.message}
          </p>
        ))}
      </div>

      {/* 👤 Users */}
      <div className="card" style={{ marginTop: 30 }}>
        <h3>Users</h3>
        {users.map(u => (
          <p key={u.id}>
            {u.name} ({u.email}) {u.is_admin && "🛡"}
          </p>
        ))}
      </div>

      {/* 🎨 Styles */}
      <style>{`
        .card {
          background: rgba(255,255,255,0.05);
          padding: 20px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.1);
        }
      `}</style>

    </div>
  );
}

export default Admin;
