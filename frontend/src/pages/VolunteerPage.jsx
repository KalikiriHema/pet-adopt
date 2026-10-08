import React, { useState } from "react";
import { Link } from "react-router-dom";
import ContactSection from "../components/ContactSection";
import API_BASE_URL from "../api";
import "./VolunteerPage.css";

const ROLES = [
  {
    id: "walker",
    title: "Dog Walker",
    icon: "🐕",
    desc: "Walk, play, and socialize rescue dogs",
    roleName: "Dog Walker",
  },
  {
    id: "foster",
    title: "Foster Parent",
    icon: "🏡",
    desc: "Provide a temporary loving home",
    roleName: "Foster Parent",
  },
  {
    id: "shelter",
    title: "Shelter Care",
    icon: "🧼",
    desc: "Assist with daily feeding and grooming",
    roleName: "Shelter Care Assistant",
  },
  {
    id: "events",
    title: "Adoption Events",
    icon: "🎉",
    desc: "Help connect pets with visiting families",
    roleName: "Event Outreach Volunteer",
  },
  {
    id: "vet",
    title: "Clinic Support",
    icon: "🩺",
    desc: "Assist vets with checkups and care",
    roleName: "Clinic & Vet Assistant",
  },
  {
    id: "media",
    title: "Photo & Media",
    icon: "📸",
    desc: "Take adoption photos & create stories",
    roleName: "Administrative & Media Support",
  },
];

export default function VolunteerPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Dog Walker",
    availability: "Weekends",
    message: "",
  });
  const [selectedRole, setSelectedRole] = useState("Dog Walker");
  const [loading, setLoading] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const handleSelectRole = (roleName) => {
    setSelectedRole(roleName);
    setFormData((prev) => ({ ...prev, role: roleName }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const combinedMessage = `[Role: ${formData.role}] [Availability: ${formData.availability}] ${
      formData.message ? `- ${formData.message}` : ""
    }`;

    try {
      const res = await fetch(`${API_BASE_URL}/api/volunteers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: combinedMessage,
        }),
      });

      const data = await res.json();
      if (data.ok) {
        setSubmittedSuccess(true);
        setFormData({
          name: "",
          email: "",
          phone: "",
          role: "Dog Walker",
          availability: "Weekends",
          message: "",
        });
      } else {
        alert("Failed: " + (data.error || "Please try again"));
      }
    } catch (err) {
      alert("Network error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="volunteer-minimal-page">
      {/* Top Left Navigation Bar */}
      <div className="volunteer-top-bar">
        <Link to="/" className="back-link">&larr; Back to Home</Link>
      </div>

      {/* Header */}
      <section className="volunteer-header">
        <h1>Volunteer With Us</h1>
        <p className="subtitle">
          A few hours of your time brings unconditional love and care to rescued pets.
        </p>
      </section>

      <main className="volunteer-body">
        {/* Role Selection Grid */}
        <section className="roles-section">
          <h2>1. Select a Role</h2>
          <div className="roles-grid">
            {ROLES.map((role) => (
              <button
                key={role.id}
                type="button"
                className={`role-pill ${selectedRole === role.roleName ? "active" : ""}`}
                onClick={() => handleSelectRole(role.roleName)}
              >
                <span className="role-icon">{role.icon}</span>
                <div className="role-info">
                  <span className="role-title">{role.title}</span>
                  <span className="role-desc">{role.desc}</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Application Form */}
        <section className="application-section">
          <h2>2. Your Details</h2>

          {submittedSuccess ? (
            <div className="success-card">
              <span className="success-icon">🎉</span>
              <h3>Application Received!</h3>
              <p>Thank you for volunteering. Our shelter team will contact you shortly.</p>
              <button
                type="button"
                className="reset-btn"
                onClick={() => setSubmittedSuccess(false)}
              >
                Submit another application
              </button>
            </div>
          ) : (
            <form className="minimal-form" onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="field">
                  <label htmlFor="vol-name">Full Name</label>
                  <input
                    id="vol-name"
                    type="text"
                    placeholder="Jane Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="field">
                  <label htmlFor="vol-email">Email Address</label>
                  <input
                    id="vol-email"
                    type="email"
                    placeholder="jane@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="field">
                  <label htmlFor="vol-phone">Phone Number</label>
                  <input
                    id="vol-phone"
                    type="tel"
                    placeholder="10-digit mobile number"
                    pattern="[0-9]{10}"
                    title="Please enter a valid 10-digit phone number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>

                <div className="field">
                  <label htmlFor="vol-avail">Availability</label>
                  <select
                    id="vol-avail"
                    value={formData.availability}
                    onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                  >
                    <option value="Weekends">Weekends Only</option>
                    <option value="Weekdays">Weekdays</option>
                    <option value="Mornings">Morning Shifts</option>
                    <option value="Evenings">Evening Shifts</option>
                    <option value="Flexible">Flexible / On Call</option>
                  </select>
                </div>
              </div>

              <div className="field" style={{ marginTop: "16px" }}>
                <label htmlFor="vol-note">Short Note (Optional)</label>
                <textarea
                  id="vol-note"
                  rows="2"
                  placeholder="Any relevant experience or schedule notes..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                ></textarea>
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? "Submitting Application..." : "🐾 Apply for Volunteer"}
              </button>
            </form>
          )}
        </section>
      </main>

      <ContactSection />
    </div>
  );
}
