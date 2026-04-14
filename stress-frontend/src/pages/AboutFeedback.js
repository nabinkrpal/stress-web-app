import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function AboutFeedback() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/feedback", { name, message });
      setSuccess("✅ Feedback submitted!");
      setName("");
      setMessage("");
    } catch {
      alert("Failed to submit feedback");
    }
  };

  return (
    <div style={{ padding: "40px", color: "white" }}>
      
      <button onClick={() => navigate("/dashboard")}>
        ← Back to Dashboard
      </button>

      <h1>About Us</h1>
      <p>
        StressSens helps students analyze stress using AI. 
        It uses both manual input and webcam-based emotion detection 
        to give accurate stress insights.
      </p>

      <h2 style={{ marginTop: "30px" }}>Feedback</h2>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <br /><br />

        <textarea
          placeholder="Your Feedback"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
        <br /><br />

        <button type="submit">Submit Feedback</button>
      </form>

      {success && <p>{success}</p>}
    </div>
  );
}

export default AboutFeedback;
