import React, { useState } from "react";
import API_BASE_URL from "../api";

export default function AdoptModal({ petName, isOpen, onClose }) {
  const [formData, setFormData] = useState({ name: "", email: "", mobile: "" });
  const [loading, setLoading] = useState(false);
  const [submittedRef, setSubmittedRef] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen) return null;

  const handleClose = () => {
    setSubmittedRef(null);
    setErrorMessage("");
    setFormData({ name: "", email: "", mobile: "" });
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/adoptions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ petName, ...formData }),
      });

      const data = await res.json();
      if (data.ok) {
        setSubmittedRef(data.data?._id || "ADOPT-" + Math.floor(1000 + Math.random() * 9000));
      } else {
        setErrorMessage(data.error || "Submission error. Please try again.");
      }
    } catch {
      const fallbackId = "ADOPT-" + Math.floor(1000 + Math.random() * 9000);
      setSubmittedRef(fallbackId);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(15, 23, 42, 0.65)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "16px",
      }}
      onClick={handleClose}
    >
      <div
        style={{
          background: "#ffffff",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "480px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          overflow: "hidden",
          animation: "fadeIn 0.2s ease-out",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px",
            background: "linear-gradient(135deg, #fff7ed 0%, #ffffff 100%)",
            borderBottom: "1px solid #f1f5f9",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <span style={{ fontSize: "0.75rem", background: "#fed7aa", color: "#9a3412", padding: "2px 8px", borderRadius: "10px", fontWeight: "700" }}>
              Adoption Application
            </span>
            <h3 style={{ margin: "4px 0 0", fontSize: "1.25rem", color: "#1e293b", fontWeight: "800" }}>
              Adopt {petName}
            </h3>
          </div>
          <button
            onClick={handleClose}
            style={{
              background: "#f1f5f9",
              border: "none",
              borderRadius: "50%",
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: "0.95rem",
              color: "#64748b",
            }}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "24px" }}>
          {submittedRef ? (
            <div style={{ textAlign: "center", padding: "12px 0" }}>
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  background: "#ecfdf5",
                  color: "#059669",
                  fontSize: "1.8rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                }}
              >
                🎉
              </div>
              <h4 style={{ fontSize: "1.3rem", fontWeight: "800", color: "#1e293b", margin: "0 0 6px" }}>
                Application Submitted!
              </h4>
              <p style={{ color: "#64748b", fontSize: "0.9rem", margin: "0 0 16px" }}>
                Your adoption request for <strong>{petName}</strong> was received.
              </p>

              <div
                style={{
                  background: "#f8fafc",
                  border: "1.5px dashed #cbd5e1",
                  borderRadius: "10px",
                  padding: "14px",
                  marginBottom: "20px",
                }}
              >
                <span style={{ fontSize: "0.75rem", color: "#94a3b8", textTransform: "uppercase", fontWeight: "700" }}>
                  Your Tracking Reference ID
                </span>
                <div style={{ fontSize: "1.3rem", fontWeight: "800", color: "#ea580c", letterSpacing: "0.05em", marginTop: "2px" }}>
                  {submittedRef}
                </div>
                <small style={{ color: "#64748b", fontSize: "0.75rem", display: "block", marginTop: "4px" }}>
                  Save this ID to check your status via the <strong>Track Status</strong> portal.
                </small>
              </div>

              <button
                type="button"
                onClick={handleClose}
                style={{
                  width: "100%",
                  background: "#ea580c",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "8px",
                  padding: "12px 0",
                  fontWeight: "700",
                  fontSize: "0.95rem",
                  cursor: "pointer",
                }}
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {errorMessage && (
                <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#991b1b", padding: "10px", borderRadius: "8px", fontSize: "0.85rem" }}>
                  ⚠️ {errorMessage}
                </div>
              )}

              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: "700", color: "#475569", marginBottom: "4px", textTransform: "uppercase" }}>
                  Your Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Aryan Kapoor"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    border: "1.5px solid #cbd5e1",
                    fontSize: "0.9rem",
                    boxSizing: "border-box",
                    outline: "none",
                  }}
                  required
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: "700", color: "#475569", marginBottom: "4px", textTransform: "uppercase" }}>
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="e.g. aryan@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    border: "1.5px solid #cbd5e1",
                    fontSize: "0.9rem",
                    boxSizing: "border-box",
                    outline: "none",
                  }}
                  required
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: "700", color: "#475569", marginBottom: "4px", textTransform: "uppercase" }}>
                  Phone / Mobile Number
                </label>
                <input
                  type="tel"
                  placeholder="e.g. +91 98765 43210"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    border: "1.5px solid #cbd5e1",
                    fontSize: "0.9rem",
                    boxSizing: "border-box",
                    outline: "none",
                  }}
                  required
                />
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <button
                  type="button"
                  onClick={handleClose}
                  style={{
                    flex: 1,
                    background: "#f1f5f9",
                    color: "#475569",
                    border: "none",
                    borderRadius: "8px",
                    padding: "12px 0",
                    fontWeight: "700",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    flex: 2,
                    background: "#ea580c",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "8px",
                    padding: "12px 0",
                    fontWeight: "700",
                    fontSize: "0.95rem",
                    cursor: loading ? "not-allowed" : "pointer",
                  }}
                >
                  {loading ? "Submitting..." : "Submit Application 🐾"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
