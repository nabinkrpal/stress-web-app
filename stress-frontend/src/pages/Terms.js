import { useNavigate } from "react-router-dom";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  :root {
    --bg: #080c14;
    --surface: rgba(255,255,255,0.04);
    --border: rgba(255,255,255,0.08);
    --accent: #4f8ef7;
    --text-primary: #f1f5f9;
    --text-muted: rgba(241,245,249,0.6);
    --radius: 18px;
  }

  .terms-root {
    min-height: 100vh;
    background: var(--bg);
    font-family: 'DM Sans', sans-serif;
    color: var(--text-primary);
    padding: 32px 20px 80px;
  }

  .terms-inner {
    max-width: 800px;
    margin: 0 auto;
  }

  .terms-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
  }

  .terms-logo {
    font-family: 'Syne', sans-serif;
    font-size: 24px;
    font-weight: 800;
  }

  .terms-logo span {
    color: var(--accent);
  }

  .btn-outline {
    background: transparent;
    border: 1px solid var(--border);
    color: var(--text-primary);
    padding: 8px 16px;
    border-radius: 10px;
    cursor: pointer;
  }

  .glass {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 28px;
  }

  h1 {
    font-family: 'Syne', sans-serif;
    margin-bottom: 20px;
  }

  h2 {
    margin-top: 20px;
    font-size: 16px;
  }

  p {
    color: var(--text-muted);
    line-height: 1.6;
    margin-top: 8px;
  }

  ul {
    margin-top: 10px;
    padding-left: 20px;
    color: var(--text-muted);
  }
`;

function Terms() {
  const navigate = useNavigate();

  return (
    <>
      <style>{STYLES}</style>

      <div className="terms-root">
        <div className="terms-inner">

          {/* Header */}
          <div className="terms-header">
            <div className="terms-logo">Stress<span>Sens</span></div>
            <button className="btn-outline" onClick={() => navigate("/dashboard")}>
              ← Dashboard
            </button>
          </div>

          {/* Content */}
          <div className="glass">
            <h1>Terms & Conditions</h1>

            <h2>1. Purpose</h2>
            <p>
              StressSens is an AI-based application designed to analyze user stress
              levels using manual input and webcam-based emotion detection.
            </p>

            <h2>2. Camera Usage</h2>
            <p>
              This application may request access to your device camera. Camera
              access is used only for stress detection and only when enabled by you.
            </p>

            <h2>3. Data Storage</h2>
            <p>
              Captured images may be securely stored using third-party cloud
              services (such as Cloudinary) for history and analysis purposes.
            </p>

            <h2>4. Privacy</h2>
            <p>
              We do not sell or share your personal data. All data is used only
              for application functionality.
            </p>

            <h2>5. Accuracy Disclaimer</h2>
            <p>
              Stress predictions are based on machine learning models and may not
              be 100% accurate. This application is not a medical tool.
            </p>

            <h2>6. User Responsibility</h2>
            <p>
              Users are responsible for how they use the application. Misuse of
              the platform is strictly discouraged.
            </p>

            <h2>7. Consent</h2>
            <p>
              By using this application, you agree to the collection and usage of
              data as described above.
            </p>

            <h2>8. Changes to Terms</h2>
            <p>
              These terms may be updated in the future. Continued use of the app
              means you accept those changes.
            </p>

          </div>

        </div>
      </div>
    </>
  );
}

export default Terms;
