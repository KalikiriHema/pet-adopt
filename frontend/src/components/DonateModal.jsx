import React, { useState } from "react";
import API_BASE_URL from "../api";

export default function DonateModal({ isOpen, onClose }) {
  const [moneyData, setMoneyData] = useState({ amount: "", name: "", email: "" });
  const [itemData, setItemData] = useState({
    item: "",
    quantity: "",
    description: "",
    name: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleMoneySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/donations/money`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number(moneyData.amount),
          name: moneyData.name,
          email: moneyData.email,
        }),
      });

      const data = await res.json();
      if (data.ok) {
        alert(`✅ Thank you ${moneyData.name}! Your donation of ₹${moneyData.amount} was received.`);
        setMoneyData({ amount: "", name: "", email: "" });
        onClose();
      } else {
        alert("❌ Failed: " + (data.error || "Try again"));
      }
    } catch (err) {
      alert("⚠️ Server connection failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleItemSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/donations/item`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          item: itemData.item,
          quantity: Number(itemData.quantity),
          description: itemData.description,
          name: itemData.name,
          email: itemData.email,
        }),
      });

      const data = await res.json();
      if (data.ok) {
        alert(`🎁 Thank you ${itemData.name}! Your ${itemData.item} donation has been recorded.`);
        setItemData({ item: "", quantity: "", description: "", name: "", email: "" });
        onClose();
      } else {
        alert("❌ Failed: " + (data.error || "Try again"));
      }
    } catch (err) {
      alert("⚠️ Server connection failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="donateModal" className="modal" style={{ display: "flex" }}>
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>Donate to Support Animals</h2>

        {/* External Payment Info Banner */}
        <div style={{
          background: "#fff7ed",
          border: "1px solid #fed7aa",
          borderRadius: "12px",
          padding: "16px",
          marginBottom: "20px",
          fontSize: "0.88rem",
          color: "#9a3412"
        }}>
          <div style={{ fontWeight: "700", marginBottom: "6px", display: "flex", alignItems: "center", gap: "6px" }}>
            <span>💳</span> Direct Transfer / UPI Payment Details
          </div>
          <p style={{ margin: "4px 0", color: "#431407" }}>
            <strong>UPI ID:</strong> <code>petcaretrust@upi</code> or <code>+91 9876543210@paytm</code>
          </p>
          <p style={{ margin: "4px 0", color: "#431407" }}>
            <strong>Bank A/C:</strong> 50200012345678 • <strong>IFSC:</strong> HDFC0001234
          </p>
          <p style={{ margin: "6px 0 0", fontSize: "0.8rem", color: "#c2410c" }}>
            ✨ After making your transfer, please enter your details below so our shelter team can record your contribution.
          </p>
        </div>

        {/* Monetary Donation Form */}
        <form id="donation-form" onSubmit={handleMoneySubmit}>
          <h3>Monetary Donation Record</h3>
          <label htmlFor="donation-amount">Amount (₹):</label>
          <input
            type="number"
            id="donation-amount"
            placeholder="Enter Amount (e.g. 1000)"
            value={moneyData.amount}
            onChange={(e) => setMoneyData({ ...moneyData, amount: e.target.value })}
            required
          />

          <label htmlFor="donor-name">Your Full Name:</label>
          <input
            type="text"
            id="donor-name"
            placeholder="Your Name"
            value={moneyData.name}
            onChange={(e) => setMoneyData({ ...moneyData, name: e.target.value })}
            required
          />

          <label htmlFor="donor-email">Email:</label>
          <input
            type="email"
            id="donor-email"
            placeholder="your.email@example.com"
            value={moneyData.email}
            onChange={(e) => setMoneyData({ ...moneyData, email: e.target.value })}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Recording..." : "Submit Donation Record"}
          </button>
        </form>

        <hr style={{ margin: "20px 0" }} />

        {/* Item Donation Form */}
        <form id="item-donation-form" onSubmit={handleItemSubmit}>
          <h3>Item Donation</h3>
          <label htmlFor="donation-item">Items You Want to Donate:</label>
          <select
            id="donation-item"
            value={itemData.item}
            onChange={(e) => setItemData({ ...itemData, item: e.target.value })}
            required
          >
            <option value="" disabled>
              Select an item
            </option>
            <option value="dog-food">Dog Food</option>
            <option value="cat-food">Cat Food</option>
            <option value="blankets">Blankets</option>
            <option value="toys">Toys</option>
            <option value="medicine">Medicine</option>
            <option value="other">Other</option>
          </select>

          <label htmlFor="quantity">Quantity:</label>
          <input
            type="number"
            id="quantity"
            placeholder="Enter Quantity"
            value={itemData.quantity}
            onChange={(e) => setItemData({ ...itemData, quantity: e.target.value })}
            required
          />

          <label htmlFor="item-description">Additional Description (if any):</label>
          <textarea
            id="item-description"
            placeholder="Describe the items (optional)"
            value={itemData.description}
            onChange={(e) => setItemData({ ...itemData, description: e.target.value })}
          ></textarea>

          <label htmlFor="item-donor-name">Name:</label>
          <input
            type="text"
            id="item-donor-name"
            placeholder="Your Name"
            value={itemData.name}
            onChange={(e) => setItemData({ ...itemData, name: e.target.value })}
            required
          />

          <label htmlFor="item-donor-email">Email:</label>
          <input
            type="email"
            id="item-donor-email"
            placeholder="Your Email"
            value={itemData.email}
            onChange={(e) => setItemData({ ...itemData, email: e.target.value })}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Processing..." : "Donate Items"}
          </button>
        </form>
      </div>
    </div>
  );
}
