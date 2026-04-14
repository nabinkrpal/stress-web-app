import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function AboutFeedback() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    try {
      await API.post("/feedback", form);
      setSuccess("Feedback submitted successfully!");
      setForm({ name: "", message: "" });
    } catch {
      setError("Failed to submit feedback");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white px-6 py-10">

      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold">
            About <span className="text-blue-500">StressLens</span>
          </h1>

          <button
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 border border-white/20 rounded-lg hover:bg-white/10"
          >
            ← Back
          </button>
        </div>

        {/* About Section */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 backdrop-blur-xl">
          <h2 className="text-xl font-semibold mb-3">About Us</h2>

          <p className="text-white/70 leading-relaxed">
            StressLens is an AI-powered student stress detection system that helps
            analyze stress levels using both manual inputs and webcam-based emotion detection.
            The goal is to help students understand their mental health patterns and improve productivity.
          </p>
        </div>

        {/* Feedback Section */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
          <h2 className="text-xl font-semibold mb-4">Give Feedback</h2>

          {/* Messages */}
          {error && <p className="text-red-400 mb-3">{error}</p>}
          {success && <p className="text-green-400 mb-3">{success}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              type="text"
              placeholder="Your Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              required
              className="w-full p-3 rounded-lg bg-white/10 border border-white/10 focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <textarea
              placeholder="Write your feedback..."
              value={form.message}
              onChange={(e) =>
                setForm({ ...form, message: e.target.value })
              }
              required
              rows={4}
              className="w-full p-3 rounded-lg bg-white/10 border border-white/10 focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-semibold"
            >
              {loading ? "Submitting..." : "Submit Feedback"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}

export default AboutFeedback;
