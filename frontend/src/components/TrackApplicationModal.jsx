import React, { useState } from "react";
import API_BASE_URL from "../api";

const DEMO_APPLICATIONS = [
  {
    _id: "ADOPT-7842",
    petName: "Golden Retriever (Buddy)",
    name: "Aryan Kapoor",
    email: "aryan.k@example.com",
    status: "approved",
    notes: "Approved! Shelter visit scheduled for Saturday pickup.",
    updatedAt: "Today, 10:30 AM",
  },
  {
    _id: "ADOPT-9321",
    petName: "Persian Cat (Luna)",
    name: "Meera Joshi",
    email: "meera.j@gmail.com",
    status: "reviewed",
    notes: "Under review by shelter adoption coordinator.",
    updatedAt: "Yesterday, 4:15 PM",
  },
  {
    _id: "ADOPT-4519",
    petName: "German Shepherd (Rocky)",
    name: "Rohan Varma",
    email: "rohan.v@yahoo.com",
    status: "pending",
    notes: "Application received, queued for review.",
    updatedAt: "Oct 6, 2:00 PM",
  },
];

export default function TrackApplicationModal({ isOpen, onClose }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSearch = async (e, directQuery = null) => {
    if (e) e.preventDefault();
    const query = (directQuery || searchQuery).trim();
    if (!query) return;

    if (directQuery) setSearchQuery(directQuery);

    setLoading(true);
    setError("");
    setResults(null);
    setSearched(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/adoptions/track?query=${encodeURIComponent(query)}`);
      const json = await res.json();

      if (json.ok && json.data && json.data.length > 0) {
        setResults(json.data);
      } else {
        const qLower = query.toLowerCase();
        const matches = DEMO_APPLICATIONS.filter(
          (app) =>
            app._id.toLowerCase() === qLower ||
            app.email.toLowerCase() === qLower ||
            app.name?.toLowerCase().includes(qLower)
        );
        if (matches.length > 0) {
          setResults(matches);
        } else {
          setError(json.error || "No application found for that ID or email.");
        }
      }
    } catch {
      const qLower = query.toLowerCase();
      const matches = DEMO_APPLICATIONS.filter(
        (app) =>
          app._id.toLowerCase() === qLower ||
          app.email.toLowerCase() === qLower ||
          app.name?.toLowerCase().includes(qLower)
      );
      if (matches.length > 0) {
        setResults(matches);
      } else {
        setError("No application found. Check your reference ID or email.");
      }
    } finally {
      setLoading(false);
    }
  };

  const getStep = (status) => {
    if (status === "approved") return 3;
    if (status === "reviewed") return 2;
    if (status === "rejected") return -1;
    return 1;
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(15, 23, 42, 0.6)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "16px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#ffffff",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "520px",
          maxHeight: "88vh",
          overflowY: "auto",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)",
          position: "relative",
          animation: "fadeIn 0.2s ease-out",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Minimal Header */}
        <div
          style={{
            padding: "18px 22px 14px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #f1f5f9",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "1.2rem" }}>📋</span>
            <h3 style={{ margin: 0, fontSize: "1.15rem", fontWeight: "800", color: "#1e293b" }}>
              Track Application Status
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "#f8fafc",
              border: "none",
              borderRadius: "50%",
              width: "30px",
              height: "30px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: "0.9rem",
              color: "#64748b",
            }}
          >
            ✕
          </button>
        </div>

        {/* Minimal Search Bar */}
        <div style={{ padding: "20px 22px" }}>
          <form onSubmit={(e) => handleSearch(e)} style={{ display: "flex", gap: "8px" }}>
            <input
              type="text"
              placeholder="Enter Reference ID or Email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                padding: "10px 14px",
                borderRadius: "8px",
                border: "1.5px solid #cbd5e1",
                fontSize: "0.9rem",
                outline: "none",
                boxSizing: "border-box",
              }}
              required
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                background: "#ea580c",
                color: "#ffffff",
                border: "none",
                borderRadius: "8px",
                padding: "0 18px",
                fontWeight: "700",
                fontSize: "0.9rem",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {loading ? "Checking..." : "Track"}
            </button>
          </form>

          {/* Quick Demo query chips */}
          <div style={{ display: "flex", gap: "6px", marginTop: "10px", alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.72rem", color: "#94a3b8" }}>Try:</span>
            <button
              type="button"
              onClick={() => handleSearch(null, "ADOPT-7842")}
              style={{
                background: "#f1f5f9",
                border: "1px solid #e2e8f0",
                borderRadius: "6px",
                fontSize: "0.72rem",
                padding: "2px 8px",
                cursor: "pointer",
                color: "#475569",
                fontWeight: "600",
              }}
            >
              ADOPT-7842
            </button>
            <button
              type="button"
              onClick={() => handleSearch(null, "meera.j@gmail.com")}
              style={{
                background: "#f1f5f9",
                border: "1px solid #e2e8f0",
                borderRadius: "6px",
                fontSize: "0.72rem",
                padding: "2px 8px",
                cursor: "pointer",
                color: "#475569",
                fontWeight: "600",
              }}
            >
              meera.j@gmail.com
            </button>
          </div>

          {/* Error */}
          {error && (
            <div
              style={{
                marginTop: "14px",
                padding: "10px 14px",
                background: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: "8px",
                color: "#b91c1c",
                fontSize: "0.82rem",
              }}
            >
              ⚠️ {error}
            </div>
          )}

          {/* Result Card without Extra Text */}
          {results && results.length > 0 && (
            <div style={{ marginTop: "18px", display: "flex", flexDirection: "column", gap: "14px" }}>
              {results.map((app, idx) => {
                const step = getStep(app.status);
                const isApproved = app.status === "approved";
                const isReviewed = app.status === "reviewed";
                const isRejected = app.status === "rejected";

                return (
                  <div
                    key={idx}
                    style={{
                      border: "1px solid #e2e8f0",
                      borderRadius: "12px",
                      padding: "16px",
                      background: "#fafafa",
                    }}
                  >
                    {/* Top Row: Ref & Status Pill */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                      <span style={{ fontSize: "0.75rem", fontWeight: "800", color: "#64748b", background: "#f1f5f9", padding: "2px 8px", borderRadius: "4px" }}>
                        {app._id}
                      </span>
                      <span
                        style={{
                          fontSize: "0.72rem",
                          fontWeight: "800",
                          padding: "3px 10px",
                          borderRadius: "12px",
                          textTransform: "uppercase",
                          background: isApproved ? "#ecfdf5" : isReviewed ? "#eff6ff" : isRejected ? "#fef2f2" : "#fffbeb",
                          color: isApproved ? "#047857" : isReviewed ? "#1d4ed8" : isRejected ? "#b91c1c" : "#b45309",
                          border: isApproved ? "1px solid #a7f3d0" : isReviewed ? "1px solid #bfdbfe" : isRejected ? "1px solid #fecaca" : "1px solid #fde68a",
                        }}
                      >
                        ● {app.status}
                      </span>
                    </div>

                    {/* Pet & Applicant */}
                    <h4 style={{ margin: "0 0 2px", fontSize: "1.05rem", fontWeight: "800", color: "#1e293b" }}>
                      {app.petName}
                    </h4>
                    <div style={{ fontSize: "0.8rem", color: "#64748b", marginBottom: "16px" }}>
                      Applicant: <strong>{app.name}</strong> • {app.email}
                    </div>

                    {/* Clean Minimal Stepper */}
                    {!isRejected && (
                      <div style={{ margin: "14px 0 12px" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative" }}>
                          {/* Track Line */}
                          <div style={{ position: "absolute", top: "12px", left: "20px", right: "20px", height: "3px", background: "#e2e8f0", zIndex: 1 }}>
                            <div
                              style={{
                                height: "100%",
                                width: step === 3 ? "100%" : step === 2 ? "50%" : "0%",
                                background: "#10b981",
                                transition: "width 0.3s ease",
                              }}
                            />
                          </div>

                          {/* Node 1 */}
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", zIndex: 2 }}>
                            <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "#10b981", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: "700" }}>
                              ✓
                            </div>
                            <span style={{ fontSize: "0.72rem", fontWeight: "700", marginTop: "4px", color: "#334155" }}>
                              Submitted
                            </span>
                          </div>

                          {/* Node 2 */}
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", zIndex: 2 }}>
                            <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: step >= 2 ? "#10b981" : "#ffffff", color: step >= 2 ? "#fff" : "#94a3b8", border: step === 2 ? "2px solid #3b82f6" : "2px solid #cbd5e1", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: "700" }}>
                              {step >= 2 ? "✓" : "2"}
                            </div>
                            <span style={{ fontSize: "0.72rem", fontWeight: "700", marginTop: "4px", color: step >= 2 ? "#334155" : "#94a3b8" }}>
                              In Review
                            </span>
                          </div>

                          {/* Node 3 */}
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", zIndex: 2 }}>
                            <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: step >= 3 ? "#10b981" : "#ffffff", color: step >= 3 ? "#fff" : "#94a3b8", border: step === 3 ? "2px solid #10b981" : "2px solid #cbd5e1", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: "700" }}>
                              {step >= 3 ? "🎉" : "3"}
                            </div>
                            <span style={{ fontSize: "0.72rem", fontWeight: "700", marginTop: "4px", color: step >= 3 ? "#047857" : "#94a3b8" }}>
                              Approved
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Concise 1-line Shelter Note */}
                    <div
                      style={{
                        marginTop: "12px",
                        padding: "8px 12px",
                        borderRadius: "8px",
                        background: "#ffffff",
                        border: "1px solid #e2e8f0",
                        fontSize: "0.8rem",
                        color: "#475569",
                      }}
                    >
                      {app.notes || (isApproved ? "Ready for shelter visit & pickup." : isReviewed ? "Application being reviewed by coordinator." : "Application received, pending review.")}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
