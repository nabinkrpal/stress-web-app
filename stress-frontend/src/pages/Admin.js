import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Admin() {
  const [users, setUsers] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const u = await API.get("/admin/users");
      const f = await API.get("/admin/feedbacks");
      setUsers(u.data);
      setFeedbacks(f.data);
    } catch {
      alert("Admin access denied");
      navigate("/dashboard");
    }
  };

  const deleteUser = async (id) => {
    await API.delete(`/admin/user/${id}`);
    loadData();
  };

  const deleteFeedback = async (id) => {
    await API.delete(`/admin/feedback/${id}`);
    loadData();
  };

  return (
    <div style={{ padding: 30, color: "white" }}>
      <h1>🛠 Admin Panel</h1>

      <button onClick={() => navigate("/dashboard")}>
        ← Back
      </button>

      <h2 style={{ marginTop: 20 }}>Users</h2>
      {users.map(u => (
        <div key={u.id} style={{ marginBottom: 10 }}>
          {u.name} ({u.email})
          <button onClick={() => deleteUser(u.id)} style={{ marginLeft: 10 }}>
            Delete
          </button>
        </div>
      ))}

      <h2 style={{ marginTop: 30 }}>Feedback</h2>
      {feedbacks.map(f => (
        <div key={f.id} style={{ marginBottom: 10 }}>
          {f.name}: {f.message}
          <button onClick={() => deleteFeedback(f.id)} style={{ marginLeft: 10 }}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default Admin;
