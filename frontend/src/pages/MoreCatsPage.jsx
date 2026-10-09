import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import API_BASE_URL from "../api";
import ContactSection from "../components/ContactSection";
import AdoptModal from "../components/AdoptModal";

const ALL_CATS = [
  { id: "CAT-101", breed: "Persian", age: "3 yrs", ageNum: 3, gender: "Female", size: "Small", img: "/cat1.jpg", personality: "Quiet & Sweet", status: "available" },
  { id: "CAT-102", breed: "Maine Coon", age: "2 yrs", ageNum: 2, gender: "Male", size: "Large", img: "/cat2.jpg", personality: "Gentle Giant", status: "available" },
  { id: "CAT-103", breed: "Siamese", age: "4 yrs", ageNum: 4, gender: "Male", size: "Small", img: "/cat3.jpg", personality: "Vocal & Affectionate", status: "available" },
  { id: "CAT-104", breed: "British Shorthair", age: "3 yrs", ageNum: 3, gender: "Female", size: "Medium", img: "/cat4.jpg", personality: "Easygoing & Calm", status: "available" },
  { id: "CAT-105", breed: "Ragdoll", age: "2 yrs", ageNum: 2, gender: "Female", size: "Medium", img: "/cat5.jpg", personality: "Lap Cat & Relaxed", status: "available" },
  { id: "CAT-106", breed: "Sphynx", age: "1 yr", ageNum: 1, gender: "Male", size: "Small", img: "/cat6.jpg", personality: "Warm, Energetic & Loving", status: "available" },
  { id: "CAT-107", breed: "Bengal", age: "3 yrs", ageNum: 3, gender: "Male", size: "Medium", img: "/cat7.jpg", personality: "Active & Curious Explorer", status: "available" },
  { id: "CAT-108", breed: "Russian Blue", age: "5 yrs", ageNum: 5, gender: "Female", size: "Small", img: "/cat8.jpg", personality: "Gentle, Reserved & Loyal", status: "available" },
  { id: "CAT-109", breed: "Abyssinian", age: "2 yrs", ageNum: 2, gender: "Female", size: "Small", img: "/cat9.jpg", personality: "Playful & Athletic", status: "available" },
  { id: "CAT-110", breed: "Burmese", age: "3 yrs", ageNum: 3, gender: "Male", size: "Medium", img: "/cat10.jpg", personality: "Social & People-Oriented", status: "available" },
  { id: "CAT-111", breed: "Scottish Fold", age: "4 yrs", ageNum: 4, gender: "Female", size: "Small", img: "/cat11.jpg", personality: "Sweet Owl-Like Cuddler", status: "available" },
  { id: "CAT-112", breed: "American Shorthair", age: "2 yrs", ageNum: 2, gender: "Male", size: "Medium", img: "/cat12.jpg", personality: "Adaptable & Good-Natured", status: "available" },
  { id: "CAT-113", breed: "Chartreux", age: "5 yrs", ageNum: 5, gender: "Male", size: "Medium", img: "/cat13.jpg", personality: "Silent Hunter & Loving", status: "available" },
  { id: "CAT-114", breed: "Devon Rex", age: "1 yr", ageNum: 1, gender: "Female", size: "Small", img: "/cat14.jpg", personality: "Mischievous & Cuddly", status: "available" },
  { id: "CAT-115", breed: "Oriental Shorthair", age: "4 yrs", ageNum: 4, gender: "Male", size: "Small", img: "/cat15.jpg", personality: "Slender, Vocal & Playful", status: "available" },
  { id: "CAT-116", breed: "Cornish Rex", age: "3 yrs", ageNum: 3, gender: "Female", size: "Small", img: "/cat16.jpg", personality: "Silky Waves & Acrobat", status: "available" },
  { id: "CAT-117", breed: "Manx", age: "2 yrs", ageNum: 2, gender: "Male", size: "Medium", img: "/cat17.jpg", personality: "Tailless, Happy & Watchful", status: "available" },
  { id: "CAT-118", breed: "Turkish Angora", age: "4 yrs", ageNum: 4, gender: "Female", size: "Small", img: "/cat18.jpg", personality: "Silky Coat & Regal", status: "available" },
  { id: "CAT-119", breed: "Balinese", age: "3 yrs", ageNum: 3, gender: "Female", size: "Small", img: "/cat19.jpg", personality: "Longhair Siamese Charm", status: "available" },
  { id: "CAT-120", breed: "Egyptian Mau", age: "2 yrs", ageNum: 2, gender: "Male", size: "Medium", img: "/cat20.jpg", personality: "Spotted Cheetah Speed", status: "available" },
];

function parseAgeNum(ageStr) {
  if (!ageStr) return 2;
  const match = String(ageStr).match(/\d+(\.\d+)?/);
  return match ? parseFloat(match[0]) : 2;
}

export default function MoreCatsPage() {
  const [selectedPet, setSelectedPet] = useState(null);
  const [catsList, setCatsList] = useState(ALL_CATS);
  const [searchQuery, setSearchQuery] = useState("");
  const [ageFilter, setAgeFilter] = useState("all");
  const [sizeFilter, setSizeFilter] = useState("all");
  const [genderFilter, setGenderFilter] = useState("all");
  const [sortBy, setSortBy] = useState("featured");

  const loadCats = useCallback(async () => {
    let customCats = [];
    try {
      const saved = localStorage.getItem("admin_custom_pets");
      if (saved) {
        const parsed = JSON.parse(saved);
        customCats = parsed.filter((p) => (p.type || "").toLowerCase() === "cat");
      }
    } catch {}

    try {
      const res = await fetch(`${API_BASE_URL}/api/pets?type=cat`);
      const json = await res.json();
      if (json.ok && Array.isArray(json.data) && json.data.length > 0) {
        const apiCats = json.data.map((p) => ({
          id: p.petId || p._id,
          breed: p.breed,
          age: p.age,
          ageNum: parseAgeNum(p.age),
          gender: p.gender || "Female",
          size: p.size || "Small",
          img: p.img || "/cat1.jpg",
          personality: p.description || "Sweet & Gentle Feline Friend",
          status: p.status || "available",
        }));

        const apiIds = new Set(apiCats.map((c) => c.id));
        const remainingDefaults = ALL_CATS.filter((c) => !apiIds.has(c.id));
        setCatsList([...apiCats, ...remainingDefaults]);
        return;
      }
    } catch {
      // Offline fallback
    }

    if (customCats && customCats.length > 0) {
      const formattedCustom = customCats.map((p) => ({
        id: p.id,
        breed: p.breed,
        age: p.age,
        ageNum: parseAgeNum(p.age),
        gender: p.gender || "Female",
        size: p.size || "Small",
        img: p.img || "/cat1.jpg",
        personality: p.description || "Sweet & Gentle Feline Friend",
        status: p.status || "available",
      }));
      const customIds = new Set(formattedCustom.map((c) => c.id));
      const remainingDefaults = ALL_CATS.filter((c) => !customIds.has(c.id));
      setCatsList([...formattedCustom, ...remainingDefaults]);
    }
  }, []);

  useEffect(() => {
    loadCats();
    window.addEventListener("petsUpdated", loadCats);
    window.addEventListener("storage", loadCats);
    return () => {
      window.removeEventListener("petsUpdated", loadCats);
      window.removeEventListener("storage", loadCats);
    };
  }, [loadCats]);

  const filteredCats = useMemo(() => {
    return catsList.filter((cat) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          (cat.breed && cat.breed.toLowerCase().includes(q)) ||
          (cat.id && cat.id.toLowerCase().includes(q)) ||
          (cat.personality && cat.personality.toLowerCase().includes(q));
        if (!matches) return false;
      }

      if (ageFilter === "kitten" && cat.ageNum > 1) return false;
      if (ageFilter === "young" && (cat.ageNum < 2 || cat.ageNum > 3)) return false;
      if (ageFilter === "adult" && (cat.ageNum < 4 || cat.ageNum > 5)) return false;
      if (ageFilter === "senior" && cat.ageNum < 6) return false;

      if (sizeFilter !== "all" && (cat.size || "").toLowerCase() !== sizeFilter.toLowerCase()) return false;
      if (genderFilter !== "all" && (cat.gender || "").toLowerCase() !== genderFilter.toLowerCase()) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === "breed-asc") return (a.breed || "").localeCompare(b.breed || "");
      if (sortBy === "breed-desc") return (b.breed || "").localeCompare(a.breed || "");
      if (sortBy === "age-asc") return a.ageNum - b.ageNum;
      if (sortBy === "age-desc") return b.ageNum - a.ageNum;
      return 0;
    });
  }, [catsList, searchQuery, ageFilter, sizeFilter, genderFilter, sortBy]);

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
      <section className="pets-section" id="cats" style={{ paddingTop: "20px", minHeight: "80vh" }}>
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
            <span style={{ fontSize: "1.3rem", fontWeight: "800", color: "#1e293b" }}>Adoptable Cats</span>
            <span style={{ background: "#fff7ed", color: "#ea580c", fontSize: "0.78rem", fontWeight: "800", padding: "2px 8px", borderRadius: "12px", border: "1px solid #fed7aa" }}>
              {filteredCats.length} Available
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
              <option value="kitten">Kitten (≤ 1 yr)</option>
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
        {filteredCats.length > 0 ? (
          <div className="pet-cards">
            {filteredCats.map((cat) => (
              <div className="pet-card" key={cat.id} style={{ position: "relative" }}>
                <img src={cat.img} alt={cat.breed} />
                <span className="pet-id-tag">{cat.id}</span>
                <h4 style={{ margin: "4px 0 2px", fontSize: "1.15rem", fontWeight: "800", color: "#1e293b" }}>{cat.breed}</h4>
                <p style={{ margin: "2px 0 6px", color: "#64748b", fontSize: "0.88rem", fontWeight: "600" }}>
                  Age: {cat.age}
                </p>
                <div style={{ display: "flex", gap: "4px", justifyContent: "center", marginBottom: "8px", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "0.72rem", background: "#f1f5f9", color: "#475569", padding: "2px 6px", borderRadius: "8px" }}>
                    {cat.gender}
                  </span>
                  <span style={{ fontSize: "0.72rem", background: "#f1f5f9", color: "#475569", padding: "2px 6px", borderRadius: "8px" }}>
                    {cat.size}
                  </span>
                  <span style={{ fontSize: "0.72rem", background: "#ecfdf5", color: "#047857", padding: "2px 6px", borderRadius: "8px" }}>
                    ✓ Vaccinated
                  </span>
                </div>
                <button className="adopt-btn" onClick={() => setSelectedPet(`${cat.id} - ${cat.breed}`)}>
                  Adopt Me 🐾
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "48px 20px", background: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
            <h3 style={{ margin: "0 0 6px", color: "#1e293b" }}>No matching cats found</h3>
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
              Show All Cats
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
