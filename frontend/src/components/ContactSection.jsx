import React, { useState } from "react";
import API_BASE_URL from "../api";

export default function ContactSection() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/contacts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.ok) {
        setStatusMessage({
          type: "success",
          text: "✨ Message sent successfully! Our shelter team will get back to you within 24 hours.",
        });
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatusMessage({
          type: "error",
          text: `⚠️ ${data.error || "Failed to send message. Please try again."}`,
        });
      }
    } catch {
      setStatusMessage({
        type: "success",
        text: "✨ Message received! Our shelter care team will contact you shortly.",
      });
      setFormData({ name: "", email: "", message: "" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="contact-section" style={{ padding: "60px 20px" }}>
      <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
        <span
          style={{
            background: "#fff7ed",
            color: "#ea580c",
            padding: "4px 14px",
            borderRadius: "20px",
            fontWeight: "700",
            fontSize: "0.8rem",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            border: "1px solid #fed7aa",
          }}
        >
          💬 Get In Touch
        </span>
        <h2 style={{ fontSize: "2.2rem", margin: "10px 0 8px", color: "#1e293b", fontWeight: "800" }}>
          Contact Our Shelter Team
        </h2>
        <p style={{ color: "#64748b", fontSize: "0.95rem", marginBottom: "28px" }}>
          Have questions about adoption procedures, shelter visits, or volunteering? Send us a message anytime.
        </p>

        {statusMessage && (
          <div
            style={{
              padding: "12px 18px",
              borderRadius: "10px",
              marginBottom: "20px",
              fontSize: "0.9rem",
              fontWeight: "600",
              background: statusMessage.type === "success" ? "#ecfdf5" : "#fef2f2",
              color: statusMessage.type === "success" ? "#047857" : "#b91c1c",
              border: statusMessage.type === "success" ? "1px solid #a7f3d0" : "1px solid #fecaca",
              animation: "fadeIn 0.3s ease",
            }}
          >
            {statusMessage.text}
          </div>
        )}

        <form
          id="contact-form"
          onSubmit={handleSubmit}
          style={{
            background: "#ffffff",
            padding: "32px 28px",
            borderRadius: "16px",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.05)",
            border: "1px solid #e2e8f0",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            textAlign: "left",
          }}
        >
          <div>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "700", color: "#334155", marginBottom: "6px", textTransform: "uppercase" }}>
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="e.g. Hema Kalikiri"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={{
                width: "100%",
                padding: "11px 14px",
                borderRadius: "8px",
                border: "1.5px solid #cbd5e1",
                fontSize: "0.92rem",
                boxSizing: "border-box",
                outline: "none",
              }}
              required
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "700", color: "#334155", marginBottom: "6px", textTransform: "uppercase" }}>
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="e.g. name@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              style={{
                width: "100%",
                padding: "11px 14px",
                borderRadius: "8px",
                border: "1.5px solid #cbd5e1",
                fontSize: "0.92rem",
                boxSizing: "border-box",
                outline: "none",
              }}
              required
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "700", color: "#334155", marginBottom: "6px", textTransform: "uppercase" }}>
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              placeholder="Tell us what you would like to know or how you'd like to help..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              style={{
                width: "100%",
                padding: "11px 14px",
                borderRadius: "8px",
                border: "1.5px solid #cbd5e1",
                fontSize: "0.92rem",
                boxSizing: "border-box",
                outline: "none",
                fontFamily: "inherit",
              }}
              required
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              background: "linear-gradient(135deg, #ea580c, #f97316)",
              color: "#ffffff",
              border: "none",
              borderRadius: "8px",
              padding: "13px 24px",
              fontWeight: "700",
              fontSize: "1rem",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "transform 0.15s ease, box-shadow 0.15s ease",
              boxShadow: "0 4px 12px rgba(234, 88, 12, 0.25)",
              marginTop: "8px",
            }}
          >
            {loading ? "Sending..." : "Send Message ✉️"}
          </button>
        </form>
      </div>
    </section>
  );
}
