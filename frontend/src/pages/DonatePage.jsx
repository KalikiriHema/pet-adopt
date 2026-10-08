import React, { useState } from "react";
import ContactSection from "../components/ContactSection";
import DonateModal from "../components/DonateModal";

export default function DonatePage() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      {/* Additional Info Section */}
      <section className="info-section">
        <h3>Why Donate?</h3>
        <p>
          Every contribution helps us provide shelter, food, and medical care to animals in need.{" "}
          <strong>Your kindness saves lives!</strong>
        </p>
      </section>

      {/* Donate Section */}
      <section id="donate" className="donate-section">
        <h2>Support Us</h2>
        <p>Your donations help us provide care for animals in need. Any contribution is appreciated!</p>
        <button className="donate-btn" onClick={() => setModalOpen(true)}>
          Donate Now
        </button>
      </section>

      {/* Contact Section */}
      <ContactSection />

      {/* Donate Modal */}
      <DonateModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
