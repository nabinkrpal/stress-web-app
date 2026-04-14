// import { useState } from "react";
// import API from "../services/api";
// import { useNavigate } from "react-router-dom";

// const styles = {
//   container: {
//     minHeight: "100vh",
//     background: "#080c14",
//     color: "#f1f5f9",
//     padding: "40px",
//     fontFamily: "DM Sans, sans-serif"
//   },
//   card: {
//     maxWidth: "700px",
//     margin: "0 auto",
//     background: "rgba(255,255,255,0.05)",
//     border: "1px solid rgba(255,255,255,0.1)",
//     borderRadius: "16px",
//     padding: "30px",
//     backdropFilter: "blur(15px)"
//   },
//   input: {
//     width: "100%",
//     padding: "12px",
//     marginTop: "10px",
//     marginBottom: "15px",
//     borderRadius: "8px",
//     border: "1px solid rgba(255,255,255,0.2)",
//     background: "rgba(255,255,255,0.05)",
//     color: "white",
//     outline: "none"
//   },
//   button: {
//     background: "#4f8ef7",
//     color: "white",
//     padding: "12px 20px",
//     border: "none",
//     borderRadius: "8px",
//     cursor: "pointer",
//     marginTop: "10px"
//   },
//   backBtn: {
//     marginBottom: "20px",
//     background: "transparent",
//     border: "1px solid rgba(255,255,255,0.3)",
//     color: "white",
//     padding: "8px 16px",
//     borderRadius: "8px",
//     cursor: "pointer"
//   }
// };

// function AboutFeedback() {
//   const navigate = useNavigate();

//   const [name, setName] = useState("");
//   const [message, setMessage] = useState("");
//   const [success, setSuccess] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       await API.post("/feedback", { name, message });
//       setSuccess("✅ Feedback submitted successfully!");
//       setName("");
//       setMessage("");
//     } catch (err) {
//       console.error(err);
//       alert("Error submitting feedback");
//     }
//   };

//   return (
//     <div style={styles.container}>
//       <div style={styles.card}>

//         <button style={styles.backBtn} onClick={() => navigate("/dashboard")}>
//           ← Back to Dashboard
//         </button>

//         <h1>About StressSens</h1>
//         <p style={{ opacity: 0.8 }}>
//           StressSens helps students analyze stress using AI.
//           It combines manual input and webcam-based emotion detection
//           to give accurate stress insights and improve mental well-being.
//         </p>

//         <h2 style={{ marginTop: "30px" }}>Feedback</h2>

//         <form onSubmit={handleSubmit}>
//           <input
//             style={styles.input}
//             placeholder="Your Name"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             required
//           />

//           <textarea
//             style={styles.input}
//             placeholder="Your Feedback"
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             required
//           />

//           <button type="submit" style={styles.button}>
//             Submit Feedback
//           </button>
//         </form>

//         {success && (
//           <p style={{ marginTop: "15px", color: "#22c55e" }}>
//             {success}
//           </p>
//         )}

//       </div>
//     </div>
//   );
// }

// export default AboutFeedback;







import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

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
    --text-primary: #f1f5f9;
    --text-muted: rgba(241,245,249,0.45);
    --radius: 18px;
  }

  .about-root {
    min-height: 100vh;
    background: var(--bg);
    font-family: 'DM Sans', sans-serif;
    color: var(--text-primary);
    padding: 32px 20px 80px;
    position: relative; overflow-x: hidden;
  }
  .about-root::before {
    content: ''; position: fixed; top: -200px; left: -200px;
    width: 600px; height: 600px; border-radius: 50%;
    background: radial-gradient(circle, rgba(79,142,247,0.10) 0%, transparent 70%);
    pointer-events: none; z-index: 0;
  }
  .about-root::after {
    content: ''; position: fixed; bottom: -150px; right: -100px;
    width: 500px; height: 500px; border-radius: 50%;
    background: radial-gradient(circle, rgba(34,197,94,0.06) 0%, transparent 70%);
    pointer-events: none; z-index: 0;
  }

  .about-inner { position: relative; z-index: 1; max-width: 700px; margin: 0 auto; }

  /* Header */
  .about-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; flex-wrap: wrap; gap: 16px; }
  .about-logo { font-family: 'Syne', sans-serif; font-size: 24px; font-weight: 800; }
  .about-logo span { color: var(--accent); }

  /* Glass */
  .glass {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius); backdrop-filter: blur(20px);
  }

  /* Section title */
  .section-title {
    font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700;
    letter-spacing: 0.5px; margin-bottom: 18px;
    display: flex; align-items: center; gap: 10px;
  }
  .section-title .dot { width: 8px; height: 8px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 10px var(--accent); flex-shrink: 0; }
  .divider { height: 1px; background: var(--border); margin-bottom: 20px; }

  /* About card */
  .about-card { padding: 28px; margin-bottom: 20px; }
  .about-desc { font-size: 15px; line-height: 1.75; color: var(--text-muted); }
  .about-desc strong { color: var(--text-primary); font-weight: 600; }

  /* Feature pills */
  .features { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 20px; }
  .feature-pill {
    padding: 7px 14px; border-radius: 20px; font-size: 12px; font-weight: 500;
    background: rgba(79,142,247,0.1); border: 1px solid rgba(79,142,247,0.2); color: var(--accent);
  }

  /* Feedback card */
  .feedback-card { padding: 28px; }

  .input-group { margin-bottom: 18px; }
  .input-label { font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: var(--text-muted); margin-bottom: 8px; display: block; }
  .about-input {
    width: 100%; box-sizing: border-box;
    background: rgba(255,255,255,0.05); border: 1px solid var(--border);
    border-radius: 10px; color: var(--text-primary); padding: 12px 14px;
    font-size: 14px; font-family: 'DM Sans', sans-serif;
    outline: none; transition: border-color .2s, box-shadow .2s;
  }
  .about-input::placeholder { color: rgba(241,245,249,0.25); }
  .about-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-glow); }
  textarea.about-input { resize: vertical; min-height: 120px; }

  .btn-primary {
    width: 100%; padding: 13px;
    background: var(--accent); color: #fff; border: none;
    border-radius: 10px; cursor: pointer;
    font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 600;
    box-shadow: 0 4px 20px var(--accent-glow); transition: all .2s;
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }
  .btn-primary:hover { background: #6aa0ff; transform: translateY(-1px); }

  .btn-outline {
    background: transparent; border: 1px solid var(--border-bright);
    color: var(--text-primary); padding: 10px 20px; font-size: 13px;
    border-radius: 10px; cursor: pointer; font-family: 'DM Sans', sans-serif;
    font-weight: 500; transition: all .2s;
    display: inline-flex; align-items: center; gap: 6px;
  }
  .btn-outline:hover { background: var(--surface-hover); border-color: var(--accent); color: var(--accent); }

  .alert-success { padding: 11px 14px; border-radius: 10px; font-size: 13px; text-align: center; margin-top: 16px; background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.2); color: #86efac; animation: fadeUp .3s ease; }

  @keyframes fadeUp { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
`;

function AboutFeedback() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/feedback", { name, message });
      setSuccess("Feedback submitted — thank you!");
      setName("");
      setMessage("");
    } catch {
      alert("Error submitting feedback");
    }
  };

  return (
    <>
      <style>{STYLES}</style>

      <div className="about-root">
        <div className="about-inner">

          {/* Header */}
          <header className="about-header">
            <div className="about-logo">
              Stress<span>Sens</span>
            </div>

            <button
              className="btn-outline"
              onClick={() => navigate("/dashboard")}
            >
              ← Dashboard
            </button>
          </header>

          {/* About */}
          <div className="glass about-card">
            <p className="section-title">
              <span className="dot" /> About StressLens
            </p>

            <div className="divider" />

            <p className="about-desc">
              <strong>StressLens</strong> helps students understand and manage stress using AI.
              It combines <strong>manual lifestyle input</strong> and{" "}
              <strong>webcam-based emotion detection</strong>
              {" "}to deliver accurate stress insights and actionable recommendations for better mental well-being.
            </p>

            <div className="features">
              {[
                "AI Stress Prediction",
                "Webcam Emotion Detection",
                "Trend Analysis",
                "Personalised Insights",
                "Secure & Private"
              ].map((f) => (
                <span key={f} className="feature-pill">
                  {f}
                </span>
              ))}
            </div>
          </div>

          {/* Feedback */}
          <div className="glass feedback-card">
            <p className="section-title">
              <span
                className="dot"
                style={{
                  background: "var(--green)",
                  boxShadow: "0 0 10px var(--green)"
                }}
              />
              Share Feedback
            </p>

            <div className="divider" />

            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label className="input-label">Your Name</label>
                <input
                  className="about-input"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label className="input-label">Message</label>
                <textarea
                  className="about-input"
                  placeholder="Share your thoughts, suggestions or issues…"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn-primary">
                ⚡ Submit Feedback
              </button>
            </form>

            {success && (
              <div className="alert-success">{success}</div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}

export default AboutFeedback;
