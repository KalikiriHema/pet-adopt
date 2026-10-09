import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import API_BASE_URL from "../api";
import ContactSection from "../components/ContactSection";
import AdoptModal from "../components/AdoptModal";

const ALL_DOGS = [
  { id: "DOG-101", breed: "Labrador Retriever", age: "3 yrs", ageNum: 3, gender: "Male", size: "Large", img: "/dog1.jpg", personality: "Friendly & Loyal", status: "available" },
  { id: "DOG-102", breed: "German Shepherd", age: "2 yrs", ageNum: 2, gender: "Male", size: "Large", img: "/dog2.jpg", personality: "Protective & Smart", status: "available" },
  { id: "DOG-103", breed: "Beagle", age: "4 yrs", ageNum: 4, gender: "Female", size: "Medium", img: "/dog3.jpg", personality: "Curious & Playful", status: "available" },
  { id: "DOG-104", breed: "English Bulldog", age: "3 yrs", ageNum: 3, gender: "Male", size: "Medium", img: "/dog4.jpg", personality: "Calm & Gentle", status: "available" },
  { id: "DOG-105", breed: "Standard Poodle", age: "2 yrs", ageNum: 2, gender: "Female", size: "Medium", img: "/dog5.jpg", personality: "Smart & Hypoallergenic", status: "available" },
  { id: "DOG-106", breed: "Golden Retriever", age: "1 yr", ageNum: 1, gender: "Male", size: "Large", img: "/dog6.jpg", personality: "Affectionate & Active", status: "available" },
  { id: "DOG-107", breed: "Rottweiler", age: "3 yrs", ageNum: 3, gender: "Male", size: "Large", img: "/dog7.jpg", personality: "Devoted & Confident", status: "available" },
  { id: "DOG-108", breed: "Boxer", age: "5 yrs", ageNum: 5, gender: "Female", size: "Large", img: "/dog8.jpg", personality: "Energetic & Loving", status: "available" },
  { id: "DOG-109", breed: "Dachshund", age: "2 yrs", ageNum: 2, gender: "Male", size: "Small", img: "/dog9.jpg", personality: "Spunky & Brave", status: "available" },
  { id: "DOG-110", breed: "Cocker Spaniel", age: "3 yrs", ageNum: 3, gender: "Female", size: "Medium", img: "/dog10.jpg", personality: "Sweet & Gentle", status: "available" },
  { id: "DOG-111", breed: "Chihuahua", age: "4 yrs", ageNum: 4, gender: "Female", size: "Small", img: "/dog11.jpg", personality: "Charming & Sassy", status: "available" },
  { id: "DOG-112", breed: "Shih Tzu", age: "2 yrs", ageNum: 2, gender: "Male", size: "Small", img: "/dog12.jpg", personality: "Affectionate Lapdog", status: "available" },
  { id: "DOG-113", breed: "Border Collie", age: "5 yrs", ageNum: 5, gender: "Male", size: "Medium", img: "/dog13.jpg", personality: "Agile & Highly Intelligent", status: "available" },
  { id: "DOG-114", breed: "Pug", age: "1 yr", ageNum: 1, gender: "Female", size: "Small", img: "/dog14.jpg", personality: "Playful & Mischievous", status: "available" },
  { id: "DOG-115", breed: "Australian Shepherd", age: "4 yrs", ageNum: 4, gender: "Female", size: "Large", img: "/dog15.jpg", personality: "Work-Oriented & Smart", status: "available" },
  { id: "DOG-116", breed: "Dalmatian", age: "3 yrs", ageNum: 3, gender: "Male", size: "Large", img: "/dog16.jpg", personality: "Energetic & Outgoing", status: "available" },
  { id: "DOG-117", breed: "Schnauzer", age: "2 yrs", ageNum: 2, gender: "Male", size: "Medium", img: "/dog17.jpg", personality: "Fearless & Friendly", status: "available" },
  { id: "DOG-118", breed: "Siberian Husky", age: "3 yrs", ageNum: 3, gender: "Female", size: "Large", img: "/dog18.jpg", personality: "Athletic & Vocal", status: "available" },
  { id: "DOG-119", breed: "Maltese", age: "4 yrs", ageNum: 4, gender: "Female", size: "Small", img: "/dog19.jpg", personality: "Gentle & Playful", status: "available" },
  { id: "DOG-120", breed: "Great Dane", age: "5 yrs", ageNum: 5, gender: "Male", size: "Large", img: "/dog20.jpg", personality: "Gentle Giant & Patient", status: "available" },
];

function parseAgeNum(ageStr) {
  if (!ageStr) return 2;
  const match = String(ageStr).match(/\d+(\.\d+)?/);
  return match ? parseFloat(match[0]) : 2;
}

export default function MoreDogsPage() {
  const [selectedPet, setSelectedPet] = useState(null);
  const [dogsList, setDogsList] = useState(ALL_DOGS);
  const [searchQuery, setSearchQuery] = useState("");
  const [ageFilter, setAgeFilter] = useState("all");
  const [sizeFilter, setSizeFilter] = useState("all");
  const [genderFilter, setGenderFilter] = useState("all");
  const [sortBy, setSortBy] = useState("featured");

  const loadDogs = useCallback(async () => {
    let customDogs = [];
    try {
      const saved = localStorage.getItem("admin_custom_pets");
      if (saved) {
        const parsed = JSON.parse(saved);
        customDogs = parsed.filter((p) => (p.type || "").toLowerCase() === "dog");
      }
    } catch {}

    try {
      const res = await fetch(`${API_BASE_URL}/api/pets?type=dog`);
      const json = await res.json();
      if (json.ok && Array.isArray(json.data) && json.data.length > 0) {
        const apiDogs = json.data.map((p) => ({
          id: p.petId || p._id,
          breed: p.breed,
          age: p.age,
          ageNum: parseAgeNum(p.age),
          gender: p.gender || "Male",
          size: p.size || "Medium",
          img: p.img || "/dog1.jpg",
          personality: p.description || "Loving & Friendly Companion",
          status: p.status || "available",
        }));

        // Merge API dogs with defaults, keeping api/admin dogs first
        const apiIds = new Set(apiDogs.map((d) => d.id));
        const remainingDefaults = ALL_DOGS.filter((d) => !apiIds.has(d.id));
        setDogsList([...apiDogs, ...remainingDefaults]);
        return;
      }
    } catch {
      // Offline fallback
    }

    if (customDogs && customDogs.length > 0) {
      const formattedCustom = customDogs.map((p) => ({
        id: p.id,
        breed: p.breed,
        age: p.age,
        ageNum: parseAgeNum(p.age),
        gender: p.gender || "Male",
        size: p.size || "Medium",
        img: p.img || "/dog1.jpg",
        personality: p.description || "Loving & Friendly Companion",
        status: p.status || "available",
      }));
      const customIds = new Set(formattedCustom.map((d) => d.id));
      const remainingDefaults = ALL_DOGS.filter((d) => !customIds.has(d.id));
      setDogsList([...formattedCustom, ...remainingDefaults]);
    }
  }, []);

  useEffect(() => {
    loadDogs();
    window.addEventListener("petsUpdated", loadDogs);
    window.addEventListener("storage", loadDogs);
    return () => {
      window.removeEventListener("petsUpdated", loadDogs);
      window.removeEventListener("storage", loadDogs);
    };
  }, [loadDogs]);

  const filteredDogs = useMemo(() => {
    return dogsList.filter((dog) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          (dog.breed && dog.breed.toLowerCase().includes(q)) ||
          (dog.id && dog.id.toLowerCase().includes(q)) ||
          (dog.personality && dog.personality.toLowerCase().includes(q));
        if (!matches) return false;
      }

      if (ageFilter === "puppy" && dog.ageNum > 1) return false;
      if (ageFilter === "young" && (dog.ageNum < 2 || dog.ageNum > 3)) return false;
      if (ageFilter === "adult" && (dog.ageNum < 4 || dog.ageNum > 5)) return false;
      if (ageFilter === "senior" && dog.ageNum < 6) return false;

      if (sizeFilter !== "all" && (dog.size || "").toLowerCase() !== sizeFilter.toLowerCase()) return false;
      if (genderFilter !== "all" && (dog.gender || "").toLowerCase() !== genderFilter.toLowerCase()) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === "breed-asc") return (a.breed || "").localeCompare(b.breed || "");
      if (sortBy === "breed-desc") return (b.breed || "").localeCompare(a.breed || "");
      if (sortBy === "age-asc") return a.ageNum - b.ageNum;
      if (sortBy === "age-desc") return b.ageNum - a.ageNum;
      return 0;
    });
  }, [dogsList, searchQuery, ageFilter, sizeFilter, genderFilter, sortBy]);

  const hasActiveFilters = searchQuery || ageFilter !== "all" || sizeFilter !== "all" || genderFilter !== "all" || sortBy !== "featured";

  const handleResetFilters = () => {
    setSearchQuery("");
    setAgeFilter("all");
    setSizeFilter("all");
    setGenderFilter("all");
    setSortBy("featured");
  };

  return (
    <>
      <section className="pets-section" id="dogs" style={{ paddingTop: "20px", minHeight: "80vh" }}>
        {/* Top Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "10px" }}>
          <Link
            to="/"
            style={{
              color: "#ea580c",
              textDecoration: "none",
              fontWeight: "700",
              fontSize: "0.88rem",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            &larr; Home
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "1.3rem", fontWeight: "800", color: "#1e293b" }}>Adoptable Dogs</span>
            <span style={{ background: "#fff7ed", color: "#ea580c", fontSize: "0.78rem", fontWeight: "800", padding: "2px 8px", borderRadius: "12px", border: "1px solid #fed7aa" }}>
              {filteredDogs.length} Available
            </span>
          </div>
        </div>

        {/* Professional Minimalist Search & Filter Bar */}
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            padding: "12px 16px",
            marginBottom: "28px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            alignItems: "center",
          }}
        >
          {/* Integrated Search Box */}
          <div style={{ flex: "1 1 240px", position: "relative" }}>
            <input
              type="text"
              placeholder="Search by breed, ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid #cbd5e1",
                fontSize: "0.88rem",
                boxSizing: "border-box",
                outline: "none",
              }}
            />
          </div>

          {/* Minimal Filter Dropdowns */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
            <select
              value={ageFilter}
              onChange={(e) => setAgeFilter(e.target.value)}
              style={{
                padding: "8px 10px",
                borderRadius: "8px",
                border: "1px solid #cbd5e1",
                fontSize: "0.85rem",
                background: "#ffffff",
                color: "#334155",
                outline: "none",
                cursor: "pointer",
              }}
            >
              <option value="all">Age: All</option>
              <option value="puppy">Puppy (≤ 1 yr)</option>
              <option value="young">Young (2-3 yrs)</option>
              <option value="adult">Adult (4-5 yrs)</option>
              <option value="senior">Senior (6+ yrs)</option>
            </select>

            <select
              value={sizeFilter}
              onChange={(e) => setSizeFilter(e.target.value)}
              style={{
                padding: "8px 10px",
                borderRadius: "8px",
                border: "1px solid #cbd5e1",
                fontSize: "0.85rem",
                background: "#ffffff",
                color: "#334155",
                outline: "none",
                cursor: "pointer",
              }}
            >
              <option value="all">Size: All</option>
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>

            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              style={{
                padding: "8px 10px",
                borderRadius: "8px",
                border: "1px solid #cbd5e1",
                fontSize: "0.85rem",
                background: "#ffffff",
                color: "#334155",
                outline: "none",
                cursor: "pointer",
              }}
            >
              <option value="all">Gender: All</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: "8px 10px",
                borderRadius: "8px",
                border: "1px solid #cbd5e1",
                fontSize: "0.85rem",
                background: "#ffffff",
                color: "#334155",
                outline: "none",
                cursor: "pointer",
              }}
            >
              <option value="featured">Sort: Featured</option>
              <option value="breed-asc">Breed (A-Z)</option>
              <option value="breed-desc">Breed (Z-A)</option>
              <option value="age-asc">Youngest First</option>
              <option value="age-desc">Oldest First</option>
            </select>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                style={{
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  color: "#b91c1c",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  fontSize: "0.82rem",
                  fontWeight: "700",
                  cursor: "pointer",
                }}
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Pet Cards Grid */}
        {filteredDogs.length > 0 ? (
          <div className="pet-cards">
            {filteredDogs.map((dog) => (
              <div className="pet-card" key={dog.id} style={{ position: "relative" }}>
                <img src={dog.img} alt={dog.breed} />
                <span className="pet-id-tag">{dog.id}</span>
                <h4 style={{ margin: "4px 0 2px", fontSize: "1.15rem", fontWeight: "800", color: "#1e293b" }}>{dog.breed}</h4>
                <p style={{ margin: "2px 0 6px", color: "#64748b", fontSize: "0.88rem", fontWeight: "600" }}>
                  Age: {dog.age}
                </p>
                <div style={{ display: "flex", gap: "4px", justifyContent: "center", marginBottom: "8px", flexWrap: "wrap" }}>
                  {dog.gender && (
                    <span style={{ fontSize: "0.72rem", background: "#f1f5f9", color: "#475569", padding: "2px 6px", borderRadius: "8px" }}>
                      {dog.gender}
                    </span>
                  )}
                  {dog.size && (
                    <span style={{ fontSize: "0.72rem", background: "#f1f5f9", color: "#475569", padding: "2px 6px", borderRadius: "8px" }}>
                      {dog.size}
                    </span>
                  )}
                  <span style={{ fontSize: "0.72rem", background: "#ecfdf5", color: "#047857", padding: "2px 6px", borderRadius: "8px" }}>
                    ✓ Vaccinated
                  </span>
                </div>
                <button className="adopt-btn" onClick={() => setSelectedPet(`${dog.id} - ${dog.breed}`)}>
                  Adopt Me 🐾
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "48px 20px", background: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
            <h3 style={{ margin: "0 0 6px", color: "#1e293b" }}>No matching dogs found</h3>
            <p style={{ color: "#64748b", margin: "0 0 14px", fontSize: "0.9rem" }}>Try clearing search criteria or filters.</p>
            <button
              onClick={handleResetFilters}
              style={{
                background: "#ea580c",
                color: "#ffffff",
                border: "none",
                padding: "8px 18px",
                borderRadius: "8px",
                fontWeight: "700",
                fontSize: "0.88rem",
                cursor: "pointer",
              }}
            >
              Show All Dogs
            </button>
          </div>
        )}
      </section>

      {/* Contact Section */}
      <ContactSection />

      {/* Adopt Modal */}
      <AdoptModal
        petName={selectedPet || ""}
        isOpen={Boolean(selectedPet)}
        onClose={() => setSelectedPet(null)}
      />
    </>
  );
}
