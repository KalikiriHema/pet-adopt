import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import ContactSection from "../components/ContactSection";
import AdoptModal from "../components/AdoptModal";
import TrackApplicationModal from "../components/TrackApplicationModal";

export default function HomePage() {
  const [selectedPet, setSelectedPet] = useState(null);
  const [trackModalOpen, setTrackModalOpen] = useState(false);
  const [petSearch, setPetSearch] = useState("");

  const dogs = [
    { id: "DOG-101", name: "Labrador", breed: "Labrador Retriever", age: "2 Years", img: "/dog1.jpg" },
    { id: "DOG-102", name: "Golden Retriever", breed: "Golden Retriever", age: "1.5 Years", img: "/dog2.jpg" },
    { id: "DOG-103", name: "Bulldog", breed: "English Bulldog", age: "3 Years", img: "/dog3.jpg" },
    { id: "DOG-104", name: "Beagle", breed: "Beagle", age: "4 Years", img: "/dog4.jpg" },
    { id: "DOG-105", name: "Poodle", breed: "Standard Poodle", age: "5 Years", img: "/dog5.jpg" },
  ];

  const cats = [
    { id: "CAT-101", name: "Persian", breed: "Persian Cat", age: "3 Years", img: "/cat1.jpg" },
    { id: "CAT-102", name: "Siamese", breed: "Siamese Cat", age: "2.5 Years", img: "/cat2.jpg" },
    { id: "CAT-103", name: "Maine Coon", breed: "Maine Coon", age: "4 Years", img: "/cat3.jpg" },
    { id: "CAT-104", name: "British Shorthair", breed: "British Shorthair", age: "2 Years", img: "/cat4.jpg" },
    { id: "CAT-105", name: "Ragdoll", breed: "Ragdoll Cat", age: "3 Years", img: "/cat5.jpg" },
  ];

  const filteredDogs = useMemo(() => {
    if (!petSearch.trim()) return dogs;
    const q = petSearch.toLowerCase();
    return dogs.filter((d) => d.name.toLowerCase().includes(q) || d.breed.toLowerCase().includes(q) || d.id.toLowerCase().includes(q));
  }, [dogs, petSearch]);

  const filteredCats = useMemo(() => {
    if (!petSearch.trim()) return cats;
    const q = petSearch.toLowerCase();
    return cats.filter((c) => c.name.toLowerCase().includes(q) || c.breed.toLowerCase().includes(q) || c.id.toLowerCase().includes(q));
  }, [cats, petSearch]);

  return (
    <>
      {/* Clean Hero Section */}
      <section id="home" className="hero" style={{ padding: "3.5rem 1.5rem 3.8rem" }}>
        <h1 style={{ fontSize: "2.8rem", fontWeight: "900", margin: "0 0 10px", letterSpacing: "-0.02em" }}>
          Find Your New Best Friend
        </h1>
        <p style={{ fontSize: "1.2rem", opacity: 0.95, margin: "0 auto 24px", maxWidth: "600px" }}>
          Browse our available pets and give them a forever home.
        </p>
        <button
          className="adopt-btn"
          style={{ width: "auto", padding: "13px 32px", fontSize: "1.05rem", fontWeight: "700" }}
          onClick={() => document.getElementById("pets")?.scrollIntoView({ behavior: "smooth" })}
        >
          🐾 Browse Adoptable Pets
        </button>
      </section>

      {/* Cards Section */}
      <section className="cards-section">
        <div className="card">
          <img src="/istockphoto-154904591-1024x1024-transformed.jpeg" alt="Adopt a Pet" />
          <h3>Adopt a Pet</h3>
          <p>Find your perfect companion among our adorable pets waiting for a loving home.</p>
          <button className="adopt-btn" onClick={() => {
            document.getElementById("pets")?.scrollIntoView({ behavior: "smooth" });
          }}>
            Adopt Now
          </button>
        </div>
        <div className="card">
          <img src="/istockphoto-1364253107-1024x1024-transformed.jpeg" alt="Donate to Animals" />
          <h3>Donate to Animals</h3>
          <p>Your donations help us provide food, shelter, and care for animals in need.</p>
          <button className="donate-btn" onClick={() => window.location.href = "/donate"}>
            Donate Now
          </button>
        </div>
        <div className="card">
          <img src="/volunteer image.png" alt="Become a Volunteer" id="volunteer" />
          <h3>Become a Volunteer</h3>
          <p>Join our team and make a difference in the lives of animals.</p>
          <button className="volunteer-btn" onClick={() => window.location.href = "/volunteer"}>
            Sign Up
          </button>
        </div>
      </section>

      {/* Adoptable Pets Section with Minimalist Search Bar */}
      <section id="pets" className="pets-section" style={{ paddingTop: "40px" }}>
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <h2 style={{ fontSize: "2.3rem", fontWeight: "800", margin: "0 0 8px", color: "#1e293b" }}>
            Available Pets for Adoption
          </h2>
          <p style={{ color: "#64748b", fontSize: "0.95rem", maxWidth: "540px", margin: "0 auto" }}>
            Find your perfect match among our adoptable dogs and cats.
          </p>
        </div>

        {/* Clean Standalone Search Bar */}
        <div
          style={{
            maxWidth: "520px",
            margin: "0 auto 32px",
            background: "#ffffff",
            borderRadius: "12px",
            border: "1.5px solid #cbd5e1",
            padding: "6px 14px",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.04)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <span style={{ fontSize: "1.1rem", color: "#94a3b8" }}>🔍</span>
          <input
            type="text"
            placeholder="Search pets by name or breed..."
            value={petSearch}
            onChange={(e) => setPetSearch(e.target.value)}
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              fontSize: "0.95rem",
              padding: "8px 0",
              color: "#1e293b",
            }}
          />
          {petSearch && (
            <button
              type="button"
              onClick={() => setPetSearch("")}
              style={{
                background: "#f1f5f9",
                border: "none",
                borderRadius: "50%",
                width: "22px",
                height: "22px",
                fontSize: "0.75rem",
                cursor: "pointer",
                color: "#64748b",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Dog Section */}
        <div className="pet-category" style={{ marginBottom: "36px" }}>
          <h3>Dogs</h3>
          {filteredDogs.length > 0 ? (
            <div className="pet-cards">
              {filteredDogs.slice(0, 4).map((dog, idx) => (
                <div className="pet-card" key={idx}>
                  <img src={dog.img} alt={dog.name} />
                  <span className="pet-id-tag">{dog.id}</span>
                  <h4 style={{ margin: "4px 0 2px 0", fontSize: "1.1rem" }}>{dog.name}</h4>
                  <p style={{ margin: "2px 0 8px 0" }}>Breed: {dog.breed} | Age: {dog.age}</p>
                  <button className="adopt-btn" onClick={() => setSelectedPet(`${dog.id} - ${dog.name}`)}>
                    Adopt Me
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ textAlign: "center", color: "#94a3b8", padding: "20px" }}>No dogs match "{petSearch}"</p>
          )}
          <Link to="/more-dogs" className="explore-more">
            See More Dogs &rarr;
          </Link>
        </div>

        {/* Cat Section */}
        <div className="pet-category">
          <h3>Cats</h3>
          {filteredCats.length > 0 ? (
            <div className="pet-cards">
              {filteredCats.slice(0, 4).map((cat, idx) => (
                <div className="pet-card" key={idx}>
                  <img src={cat.img} alt={cat.name} />
                  <span className="pet-id-tag">{cat.id}</span>
                  <h4 style={{ margin: "4px 0 2px 0", fontSize: "1.1rem" }}>{cat.name}</h4>
                  <p style={{ margin: "2px 0 8px 0" }}>Breed: {cat.breed} | Age: {cat.age}</p>
                  <button className="adopt-btn" onClick={() => setSelectedPet(`${cat.id} - ${cat.name}`)}>
                    Adopt Me
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ textAlign: "center", color: "#94a3b8", padding: "20px" }}>No cats match "{petSearch}"</p>
          )}
          <Link to="/more-cats" className="explore-more">
            See More Cats &rarr;
          </Link>
        </div>
      </section>

      {/* Contact Section */}
      <ContactSection />

      {/* Adopt Modal */}
      <AdoptModal
        petName={selectedPet || ""}
        isOpen={Boolean(selectedPet)}
        onClose={() => setSelectedPet(null)}
      />

      {/* Track Application Modal */}
      <TrackApplicationModal
        isOpen={trackModalOpen}
        onClose={() => setTrackModalOpen(false)}
      />
    </>
  );
}
