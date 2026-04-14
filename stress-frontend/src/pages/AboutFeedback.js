import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

const styles = {
  container: {
    minHeight: "100vh",
    background: "#080c14",
    color: "#f1f5f9",
    padding: "40px",
    fontFamily: "DM Sans, sans-serif"
  },
  card: {
    maxWidth: "700px",
    margin: "0 auto",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "16px",
    padding: "30px",
    backdropFilter: "blur(15px)"
  },
  input: {
    width: "100%",
    padding: "12px",
    marginTop: "10px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "1px solid rgba(255,255,255,0.2)",
    background: "rgba(255,255,255,0.05)",
    color: "white",
    outline: "none"
  },
  button: {
    background: "#4f8ef7",
    color: "white",
    padding: "12px 20px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    marginTop: "10px"
  },
  backBtn: {
    marginBottom: "20px",
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.3)",
    color: "white",
    padding: "8px 16px",
    borderRadius: "8px",
    cursor: "pointer"
  }
};

function AboutFeedback() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/feedback", { name, message });
      setSuccess("✅ Feedback submitted successfully!");
      setName("");
      setMessage("");
    } catch (err) {
      console.error(err);
      alert("Error submitting feedback");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        <button style={styles.backBtn} onClick={() => navigate("/dashboard")}>
          ← Back to Dashboard
        </button>

        <h1>About StressSens</h1>
        <p style={{ opacity: 0.8 }}>
          StressSens helps students analyze stress using AI.
          It combines manual input and webcam-based emotion detection
          to give accurate stress insights and improve mental well-being.
        </p>

        <h2 style={{ marginTop: "30px" }}>Feedback</h2>

        <form onSubmit={handleSubmit}>
          <input
            style={styles.input}
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <textarea
            style={styles.input}
            placeholder="Your Feedback"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />

          <button type="submit" style={styles.button}>
            Submit Feedback
          </button>
        </form>

        {success && (
          <p style={{ marginTop: "15px", color: "#22c55e" }}>
            {success}
          </p>
        )}

      </div>
    </div>
  );
}

export default AboutFeedback;
