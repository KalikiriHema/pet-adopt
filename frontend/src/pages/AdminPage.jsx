import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import API_BASE_URL from "../api";
import "./AdminPage.css";

const PLATFORM_PETS = [
  { id: "DOG-101", breed: "Labrador Retriever", type: "Dog", age: "3 years", img: "/dog1.jpg" },
  { id: "DOG-102", breed: "German Shepherd", type: "Dog", age: "2 years", img: "/dog2.jpg" },
  { id: "DOG-103", breed: "Beagle", type: "Dog", age: "4 years", img: "/dog3.jpg" },
  { id: "DOG-104", breed: "Bulldog", type: "Dog", age: "3 years", img: "/dog4.jpg" },
  { id: "DOG-105", breed: "Poodle", type: "Dog", age: "2 years", img: "/dog5.jpg" },
  { id: "DOG-106", breed: "Golden Retriever", type: "Dog", age: "1 year", img: "/dog6.jpg" },
  { id: "CAT-101", breed: "Persian Cat", type: "Cat", age: "2 years", img: "/cat1.jpg" },
  { id: "CAT-102", breed: "Siamese Cat", type: "Cat", age: "1.5 years", img: "/cat2.jpg" },
  { id: "CAT-103", breed: "Maine Coon", type: "Cat", age: "3 years", img: "/cat3.jpg" },
  { id: "CAT-104", breed: "British Shorthair", type: "Cat", age: "2 years", img: "/cat4.jpg" },
];

const INITIAL_DEMO_DATA = {
  donations: [
    {
      _id: "demo-don-1",
      type: "money",
      amount: 15000,
      donorName: "Rahul Sharma",
      donorEmail: "rahul.sharma@example.com",
      description: "Monthly sponsorship for shelter medical & vaccination care",
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    },
    {
      _id: "demo-don-2",
      type: "item",
      item: "Pedigree High-Protein Dog Food",
      quantity: 12,
      donorName: "Priya Nair",
      donorEmail: "priya.nair@gmail.com",
      description: "12 large bags of adult dry food for shelter kennels",
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    },
    {
      _id: "demo-don-3",
      type: "money",
      amount: 25000,
      donorName: "Vikram Patel",
      donorEmail: "vikram.patel@techcorp.io",
      description: "Corporate CSR donation towards winter shelter beds",
      createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    },
    {
      _id: "demo-don-4",
      type: "item",
      item: "Fleece Pet Blankets & Plush Beds",
      quantity: 20,
      donorName: "Ananya Roy",
      donorEmail: "ananya.roy@outlook.com",
      description: "Warm bedding sets for newly rescued puppies and kittens",
      createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
    },
    {
      _id: "demo-don-5",
      type: "money",
      amount: 7500,
      donorName: "Karthik Sundaram",
      donorEmail: "karthik.s@gmail.com",
      description: "Monthly sponsorship donation for shelter medical care",
      createdAt: new Date(Date.now() - 3600000 * 96).toISOString(),
    },
  ],
  adoptions: [
    {
      _id: "demo-adopt-1",
      petName: "DOG-106 - Golden Retriever",
      name: "Aryan Kapoor",
      email: "aryan.k@example.com",
      mobile: "+91 98765 43210",
      status: "approved",
      createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    },
    {
      _id: "demo-adopt-2",
      petName: "CAT-101 - Persian Cat",
      name: "Meera Joshi",
      email: "meera.j@gmail.com",
      mobile: "+91 98234 56789",
      status: "reviewed",
      createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    },
    {
      _id: "demo-adopt-3",
      petName: "DOG-102 - German Shepherd",
      name: "Rohan Varma",
      email: "rohan.v@yahoo.com",
      mobile: "+91 99112 23344",
      status: "pending",
      createdAt: new Date(Date.now() - 3600000 * 30).toISOString(),
    },
    {
      _id: "demo-adopt-4",
      petName: "CAT-103 - Maine Coon",
      name: "Sunita Rao",
      email: "sunita.rao@gmail.com",
      mobile: "+91 97654 32109",
      status: "approved",
      createdAt: new Date(Date.now() - 3600000 * 50).toISOString(),
    },
    {
      _id: "demo-adopt-5",
      petName: "DOG-101 - Labrador",
      name: "Deepak Menon",
      email: "deepak.m@rediffmail.com",
      mobile: "+91 98321 45678",
      status: "rejected",
      createdAt: new Date(Date.now() - 3600000 * 90).toISOString(),
    },
  ],
  volunteers: [
    {
      _id: "demo-vol-1",
      name: "Tanvi Deshmukh",
      email: "tanvi.d@gmail.com",
      phone: "+91 98123 45670",
      status: "accepted",
      message: "Final-year veterinary student eager to assist with medical checkups, grooming, and recovery care on weekends.",
      createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    },
    {
      _id: "demo-vol-2",
      name: "Amitav Roy",
      email: "amitav.r@techcorp.com",
      phone: "+91 98765 12345",
      status: "contacted",
      message: "Professional pet photographer offering free weekend photoshoots to boost adoption profiles and social media reach.",
      createdAt: new Date(Date.now() - 3600000 * 40).toISOString(),
    },
    {
      _id: "demo-vol-3",
      name: "Pooja Reddy",
      email: "pooja.reddy@gmail.com",
      phone: "+91 97123 89012",
      status: "pending",
      message: "Dog walking and shelter cleaning volunteer available 3 weekdays per week.",
      createdAt: new Date(Date.now() - 3600000 * 80).toISOString(),
    },
  ],
  contacts: [
    {
      _id: "demo-con-1",
      name: "Neha Gupta",
      email: "neha.g@gmail.com",
      status: "unread",
      message: "Hello team! Can you let me know visiting hours for adopting a puppy this Saturday?",
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
    {
      _id: "demo-con-2",
      name: "Rajesh Khanna",
      email: "rajesh.k@gmail.com",
      status: "replied",
      message: "Do you accept direct UPI / QR code payments for pet sponsor donations?",
      createdAt: new Date(Date.now() - 3600000 * 20).toISOString(),
    },
    {
      _id: "demo-con-3",
      name: "Farhan Ali",
      email: "farhan.a@gmail.com",
      status: "read",
      message: "I noticed an injured stray puppy near Sector 14 market, who can I contact for rescue support?",
      createdAt: new Date(Date.now() - 3600000 * 60).toISOString(),
    },
  ],
};

export default function AdminPage() {
  const [token, setToken] = useState(localStorage.getItem("admin_live_token") || "");
  const [isDemo, setIsDemo] = useState(localStorage.getItem("admin_is_demo") === "true");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [dateRangeFilter, setDateRangeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Tab-specific filters
  const [overviewModuleFilter, setOverviewModuleFilter] = useState("all");
  const [donationFilter, setDonationFilter] = useState("all");
  const [adoptionStatusFilter, setAdoptionStatusFilter] = useState("all");
  const [volunteerStatusFilter, setVolunteerStatusFilter] = useState("all");
  const [contactStatusFilter, setContactStatusFilter] = useState("all");
  const [petCategoryFilter, setPetCategoryFilter] = useState("all");
  const [petInquiryFilter, setPetInquiryFilter] = useState("all");

  const [selectedRecord, setSelectedRecord] = useState(null);
  const [modalType, setModalType] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successToast, setSuccessToast] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState("");

  const [petsList, setPetsList] = useState(PLATFORM_PETS);
  const [petModalOpen, setPetModalOpen] = useState(false);
  const [editingPet, setEditingPet] = useState(null);
  const [petFormData, setPetFormData] = useState({
    name: "",
    type: "Dog",
    breed: "",
    age: "",
    gender: "Male",
    size: "Medium",
    img: "/dog1.jpg",
    status: "available",
    description: "",
  });

  const [data, setData] = useState(() => {
    if (localStorage.getItem("admin_is_demo") === "true") {
      return INITIAL_DEMO_DATA;
    }
    return { donations: [], volunteers: [], adoptions: [], contacts: [] };
  });

  const showToast = (msg) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(""), 3500);
  };

  useEffect(() => {
    if (petsList && petsList.length > 0) {
      try {
        localStorage.setItem("admin_custom_pets", JSON.stringify(petsList));
        window.dispatchEvent(new Event("petsUpdated"));
      } catch {}
    }
  }, [petsList]);

  // Reset pagination when active tab or filters change
  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    setCurrentPage(1);
    setSearchQuery("");
    setDateRangeFilter("all");
  };

  const loadLiveBackendData = useCallback(async (authToken) => {
    if (isDemo) {
      setRefreshing(true);
      setTimeout(() => {
        setData(INITIAL_DEMO_DATA);
        setPetsList(PLATFORM_PETS);
        setLastSyncTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
        setRefreshing(false);
        showToast("Demo datasets refreshed.");
      }, 300);
      return;
    }

    const activeToken = authToken || token;
    if (!activeToken) return;

    setRefreshing(true);
    const routes = ["donations", "volunteers", "adoptions", "contacts"];
    const results = {};

    for (const route of routes) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/${route}`, {
          headers: { Authorization: `Bearer ${activeToken}` },
        });
        const json = await res.json();
        if (json.ok) {
          results[route] = json.data || [];
        } else {
          results[route] = [];
        }
      } catch (err) {
        console.error(`Error loading ${route}:`, err);
        results[route] = [];
      }
    }

    // Also load pets catalog from backend
    try {
      const petRes = await fetch(`${API_BASE_URL}/api/pets`);
      const petJson = await petRes.json();
      if (petJson.ok && petJson.data && petJson.data.length > 0) {
        setPetsList(
          petJson.data.map((p) => ({
            id: p.petId || p._id,
            _id: p._id,
            name: p.name,
            breed: p.breed,
            type: p.type,
            age: p.age,
            gender: p.gender || "Male",
            size: p.size || "Medium",
            img: p.img || (p.type === "Cat" ? "/cat1.jpg" : "/dog1.jpg"),
            status: p.status || "available",
            description: p.description || "",
          }))
        );
      }
    } catch (e) {
      console.error("Pet catalog fetch error:", e);
    }

    setData(results);
    setLastSyncTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    setRefreshing(false);
  }, [token, isDemo]);


  useEffect(() => {
    if (token) {
      loadLiveBackendData(token);
    }
  }, [token, loadLiveBackendData]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setErrorMessage("");

    const cleanEmail = email.toLowerCase().trim();

    // Check if demo credentials entered in form
    if (cleanEmail === "demo@petcare.com" && password === "demo123") {
      handleLaunchDemoMode();
      setLoginLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const resData = await res.json();
      if (resData.ok) {
        if (resData.isDemo) {
          handleLaunchDemoMode();
        } else {
          setIsDemo(false);
          localStorage.removeItem("admin_is_demo");
          setToken(resData.token);
          localStorage.setItem("admin_live_token", resData.token);
          loadLiveBackendData(resData.token);
          showToast("Connected to live database.");
        }
      } else {
        setErrorMessage(resData.error || "Invalid administrator credentials.");
      }
    } catch (err) {
      // If server unreachable or error, allow demo mode fallback
      setErrorMessage(`Network error: ${err.message || "Unable to reach server. Try Demo Admin Mode below."}`);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLaunchDemoMode = () => {
    setIsDemo(true);
    localStorage.setItem("admin_is_demo", "true");
    setToken("demo_sandbox_token");
    localStorage.setItem("admin_live_token", "demo_sandbox_token");
    setData(INITIAL_DEMO_DATA);
    setLastSyncTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    showToast("Logged in with Demo Admin Sandbox data.");
  };

  const handleLogout = () => {
    setToken("");
    setIsDemo(false);
    localStorage.removeItem("admin_live_token");
    localStorage.removeItem("admin_is_demo");
    setData({ donations: [], volunteers: [], adoptions: [], contacts: [] });
    setSelectedRecord(null);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setDateRangeFilter("all");
    setOverviewModuleFilter("all");
    setDonationFilter("all");
    setAdoptionStatusFilter("all");
    setVolunteerStatusFilter("all");
    setContactStatusFilter("all");
    setPetCategoryFilter("all");
    setPetInquiryFilter("all");
    setSortBy("newest");
    setCurrentPage(1);
    showToast("All filters reset.");
  };

  const handleUpdateStatus = async (type, id, newStatus) => {
    if (isDemo) {
      const key = type.endsWith("s") ? type : type + "s";
      setData((prev) => ({
        ...prev,
        [key]: (prev[key] || []).map((item) =>
          item._id === id ? { ...item, status: newStatus } : item
        ),
      }));
      showToast(`Status updated to: ${newStatus}`);
      if (selectedRecord && selectedRecord._id === id) {
        setSelectedRecord({ ...selectedRecord, status: newStatus });
      }
      return;
    }

    try {
      let endpoint = "";
      if (type === "adoptions" || type === "adoption") endpoint = `${API_BASE_URL}/api/adoptions/${id}/status`;
      else if (type === "volunteers" || type === "volunteer") endpoint = `${API_BASE_URL}/api/volunteers/${id}/status`;
      else if (type === "contacts" || type === "contact") endpoint = `${API_BASE_URL}/api/contacts/${id}/status`;

      if (!endpoint) return;

      const res = await fetch(endpoint, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const json = await res.json();
      if (json.ok) {
        showToast(`Status updated to: ${newStatus}`);
        loadLiveBackendData(token);
        if (selectedRecord && selectedRecord._id === id) {
          setSelectedRecord({ ...selectedRecord, status: newStatus });
        }
      } else {
        alert("Error updating status: " + (json.error || "Failed"));
      }
    } catch (err) {
      alert("Network error: " + err.message);
    }
  };

  const handleDeleteRecord = async (type, id) => {
    if (!window.confirm("Are you sure you want to permanently delete this record?")) return;

    if (isDemo) {
      const key = type.endsWith("s") ? type : type + "s";
      setData((prev) => ({
        ...prev,
        [key]: (prev[key] || []).filter((item) => item._id !== id),
      }));
      showToast("Record permanently deleted.");
      if (selectedRecord && selectedRecord._id === id) {
        closeDetailsModal();
      }
      return;
    }

    try {
      const endpoint = `${API_BASE_URL}/api/${type}/${id}`;
      const res = await fetch(endpoint, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const json = await res.json();
      if (json.ok) {
        showToast("Record permanently deleted.");
        loadLiveBackendData(token);
        if (selectedRecord && selectedRecord._id === id) {
          closeDetailsModal();
        }
      } else {
        alert("Error deleting record: " + (json.error || "Failed"));
      }
    } catch (err) {
      alert("Network error: " + err.message);
    }
  };

  const handleOpenAddPetModal = () => {
    setEditingPet(null);
    setPetFormData({
      name: "",
      type: "Dog",
      breed: "",
      age: "",
      gender: "Male",
      size: "Medium",
      img: "/dog1.jpg",
      status: "available",
      description: "",
    });
    setPetModalOpen(true);
  };

  const handleOpenEditPetModal = (pet) => {
    setEditingPet(pet);
    setPetFormData({
      name: pet.name || "",
      type: pet.type || "Dog",
      breed: pet.breed || "",
      age: pet.age || "",
      gender: pet.gender || "Male",
      size: pet.size || "Medium",
      img: pet.img || "/dog1.jpg",
      status: pet.status || "available",
      description: pet.description || "",
    });
    setPetModalOpen(true);
  };

  const handleSavePet = async (e) => {
    e.preventDefault();
    const effectiveBreed = petFormData.breed?.trim();
    const effectiveAge = petFormData.age?.trim();
    const effectiveName = petFormData.name?.trim() || effectiveBreed;

    if (!effectiveBreed || !effectiveAge) {
      alert("Please provide pet breed and age.");
      return;
    }

    const payload = {
      ...petFormData,
      name: effectiveName,
      breed: effectiveBreed,
      age: effectiveAge,
    };

    if (isDemo) {
      if (editingPet) {
        setPetsList((prev) =>
          prev.map((p) => (p.id === editingPet.id ? { ...p, ...payload } : p))
        );
        showToast(`Pet "${effectiveBreed}" updated successfully.`);
      } else {
        const prefix = petFormData.type === "Dog" ? "DOG" : "CAT";
        const newId = `${prefix}-${Math.floor(100 + Math.random() * 900)}`;
        setPetsList((prev) => [{ id: newId, ...payload }, ...prev]);
        showToast(`New pet "${effectiveBreed}" (${newId}) added to inventory.`);
      }
      setPetModalOpen(false);
      return;
    }

    try {
      if (editingPet && editingPet._id) {
        const res = await fetch(`${API_BASE_URL}/api/pets/${editingPet._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (json.ok) {
          showToast(`Pet "${effectiveBreed}" updated successfully.`);
          loadLiveBackendData(token);
        } else {
          alert("Failed to update pet: " + (json.error || "Error"));
        }
      } else {
        const res = await fetch(`${API_BASE_URL}/api/pets`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (json.ok) {
          showToast(`New pet "${effectiveBreed}" added to database.`);
          loadLiveBackendData(token);
        } else {
          alert("Failed to create pet: " + (json.error || "Error"));
        }
      }
      setPetModalOpen(false);
    } catch (err) {
      alert("Network error saving pet: " + err.message);
    }
  };

  const handleDeletePet = async (pet) => {
    if (!window.confirm(`Are you sure you want to permanently delete ${pet.breed} (${pet.id}) from inventory?`)) return;

    if (isDemo || !pet._id) {
      setPetsList((prev) => prev.filter((p) => p.id !== pet.id));
      showToast(`Pet "${pet.breed}" (${pet.id}) deleted from catalog.`);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/pets/${pet._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.ok) {
        showToast(`Pet "${pet.breed}" (${pet.id}) deleted.`);
        loadLiveBackendData(token);
      } else {
        alert("Failed to delete pet: " + (json.error || "Error"));
      }
    } catch (err) {
      alert("Network error: " + err.message);
    }
  };

  const handleUpdatePetStatus = async (pet, newStatus) => {
    if (isDemo || !pet._id) {
      setPetsList((prev) => prev.map((p) => (p.id === pet.id ? { ...p, status: newStatus } : p)));
      showToast(`Status updated to ${newStatus}.`);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/pets/${pet._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (json.ok) {
        showToast(`Status updated to ${newStatus}.`);
        loadLiveBackendData(token);
      } else {
        alert("Failed to update status: " + (json.error || "Error"));
      }
    } catch (err) {
      alert("Network error: " + err.message);
    }
  };

  const formatDate = (isoStr) => {
    if (!isoStr) return "Just now";
    try {
      return new Date(isoStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoStr;
    }
  };

  const getInitials = (name) => {
    if (!name) return "AD";
    const parts = name.trim().split(" ");
    if (parts.length > 1) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  // Date Range Filtering Helper
  const matchesDateRange = useCallback((dateStr, range) => {
    if (range === "all" || !range) return true;
    if (!dateStr) return false;
    const itemTime = new Date(dateStr).getTime();
    const now = Date.now();
    if (isNaN(itemTime)) return true;
    if (range === "today") return (now - itemTime) <= 24 * 60 * 60 * 1000;
    if (range === "7days") return (now - itemTime) <= 7 * 24 * 60 * 60 * 1000;
    if (range === "30days") return (now - itemTime) <= 30 * 24 * 60 * 60 * 1000;
    return true;
  }, []);

  // KPI Metrics Calculation
  const totalMoneyRaised = useMemo(() => {
    return (data.donations || [])
      .filter((d) => d.type === "money" && d.amount)
      .reduce((sum, d) => sum + Number(d.amount), 0);
  }, [data.donations]);

  const totalItemDonations = useMemo(() => {
    return (data.donations || []).filter((d) => d.type === "item").length;
  }, [data.donations]);

  const pendingAdoptionsCount = useMemo(() => {
    return (data.adoptions || []).filter((a) => (a.status || "pending") === "pending").length;
  }, [data.adoptions]);

  const approvedAdoptionsCount = useMemo(() => {
    return (data.adoptions || []).filter((a) => a.status === "approved").length;
  }, [data.adoptions]);

  const unreadContactsCount = useMemo(() => {
    return (data.contacts || []).filter((c) => (c.status || "unread") === "unread").length;
  }, [data.contacts]);

  // Combined Inquiries count for Pets
  const petDemandMap = useMemo(() => {
    const map = {};
    (data.adoptions || []).forEach((a) => {
      const pName = (a.petName || "").toLowerCase();
      (petsList || PLATFORM_PETS).forEach((pet) => {
        if (
          (pet.id && pName.includes(pet.id.toLowerCase())) ||
          (pet.breed && pName.includes(pet.breed.toLowerCase()))
        ) {
          map[pet.id] = (map[pet.id] || 0) + 1;
        }
      });
    });
    return map;
  }, [data.adoptions, petsList]);

  const applySort = useCallback((list, nameKey = "name") => {
    return [...list].sort((a, b) => {
      if (sortBy === "newest") return new Date(b.createdAt || b.date || 0) - new Date(a.createdAt || a.date || 0);
      if (sortBy === "oldest") return new Date(a.createdAt || a.date || 0) - new Date(b.createdAt || b.date || 0);
      if (sortBy === "name") return (a[nameKey] || "").localeCompare(b[nameKey] || "");
      if (sortBy === "amount_desc") return (Number(b.amount) || 0) - (Number(a.amount) || 0);
      if (sortBy === "amount_asc") return (Number(a.amount) || 0) - (Number(b.amount) || 0);
      if (sortBy === "inquiries_desc") return ((petDemandMap[b.id] || 0) - (petDemandMap[a.id] || 0));
      return 0;
    });
  }, [sortBy, petDemandMap]);

  // Combined Live Activity Stream with Full Multi-Filter support
  const allOverviewActivities = useMemo(() => {
    const list = [];
    (data.donations || []).forEach((d) => {
      list.push({
        _id: d._id,
        type: "donation",
        personName: d.donorName || "Anonymous Donor",
        personEmail: d.donorEmail || "—",
        targetInfo: d.type === "money" ? `₹${Number(d.amount).toLocaleString()}` : `${d.item || "Supplies"} (Qty: ${d.quantity || 1})`,
        isMoney: d.type === "money",
        status: d.type === "money" ? "Completed" : "Received",
        date: d.createdAt,
        raw: d,
        icon: "💰",
      });
    });
    (data.adoptions || []).forEach((a) => {
      list.push({
        _id: a._id,
        type: "adoption",
        personName: a.name,
        personEmail: a.email,
        targetInfo: a.petName || "Pet Adoption",
        status: a.status || "pending",
        date: a.createdAt,
        raw: a,
        icon: "🐾",
      });
    });
    (data.volunteers || []).forEach((v) => {
      list.push({
        _id: v._id,
        type: "volunteer",
        personName: v.name,
        personEmail: v.email,
        targetInfo: v.phone || "Volunteer Application",
        status: v.status || "pending",
        date: v.createdAt,
        raw: v,
        icon: "🙋",
      });
    });
    (data.contacts || []).forEach((c) => {
      list.push({
        _id: c._id,
        type: "contact",
        personName: c.name,
        personEmail: c.email,
        targetInfo: c.message ? (c.message.length > 40 ? c.message.substring(0, 40) + "..." : c.message) : "General Inquiry",
        status: c.status || "unread",
        date: c.createdAt,
        raw: c,
        icon: "💬",
      });
    });

    return list;
  }, [data]);

  const filteredOverviewActivities = useMemo(() => {
    const list = allOverviewActivities.filter((item) => {
      if (overviewModuleFilter === "pending") {
        const isPending = item.status === "pending" || item.status === "unread";
        if (!isPending) return false;
      } else if (overviewModuleFilter === "completed") {
        const isCompleted = ["approved", "completed", "accepted", "read", "replied"].includes(item.status);
        if (!isCompleted) return false;
      } else if (overviewModuleFilter !== "all" && item.type !== overviewModuleFilter) {
        return false;
      }
      if (!matchesDateRange(item.date, dateRangeFilter)) return false;
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        item.personName?.toLowerCase().includes(q) ||
        item.personEmail?.toLowerCase().includes(q) ||
        item.targetInfo?.toLowerCase().includes(q) ||
        item.status?.toLowerCase().includes(q) ||
        item.type?.toLowerCase().includes(q)
      );
    });
    return applySort(list, "personName");
  }, [allOverviewActivities, overviewModuleFilter, dateRangeFilter, searchQuery, matchesDateRange, applySort]);

  // Filtered & Sorted lists for specific tabs
  const filteredDonations = useMemo(() => {
    const list = (data.donations || []).filter((item) => {
      if (donationFilter === "money" && item.type !== "money") return false;
      if (donationFilter === "item" && item.type !== "item") return false;
      if (!matchesDateRange(item.createdAt, dateRangeFilter)) return false;
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        item.donorName?.toLowerCase().includes(q) ||
        item.donorEmail?.toLowerCase().includes(q) ||
        item.item?.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q) ||
        item.amount?.toString().includes(q)
      );
    });
    return applySort(list, "donorName");
  }, [data.donations, searchQuery, donationFilter, dateRangeFilter, matchesDateRange, applySort]);

  const filteredVolunteers = useMemo(() => {
    const list = (data.volunteers || []).filter((item) => {
      if (volunteerStatusFilter !== "all" && (item.status || "pending") !== volunteerStatusFilter) return false;
      if (!matchesDateRange(item.createdAt, dateRangeFilter)) return false;
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        item.name?.toLowerCase().includes(q) ||
        item.email?.toLowerCase().includes(q) ||
        item.phone?.toLowerCase().includes(q) ||
        item.message?.toLowerCase().includes(q)
      );
    });
    return applySort(list, "name");
  }, [data.volunteers, searchQuery, volunteerStatusFilter, dateRangeFilter, matchesDateRange, applySort]);

  const filteredAdoptions = useMemo(() => {
    const list = (data.adoptions || []).filter((item) => {
      if (adoptionStatusFilter !== "all" && (item.status || "pending") !== adoptionStatusFilter) return false;
      if (!matchesDateRange(item.createdAt, dateRangeFilter)) return false;
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        item.petName?.toLowerCase().includes(q) ||
        item.name?.toLowerCase().includes(q) ||
        item.email?.toLowerCase().includes(q) ||
        item.mobile?.toLowerCase().includes(q)
      );
    });
    return applySort(list, "name");
  }, [data.adoptions, searchQuery, adoptionStatusFilter, dateRangeFilter, matchesDateRange, applySort]);

  const filteredContacts = useMemo(() => {
    const list = (data.contacts || []).filter((item) => {
      if (contactStatusFilter !== "all" && (item.status || "unread") !== contactStatusFilter) return false;
      if (!matchesDateRange(item.createdAt, dateRangeFilter)) return false;
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        item.name?.toLowerCase().includes(q) ||
        item.email?.toLowerCase().includes(q) ||
        item.message?.toLowerCase().includes(q)
      );
    });
    return applySort(list, "name");
  }, [data.contacts, searchQuery, contactStatusFilter, dateRangeFilter, matchesDateRange, applySort]);

  const filteredPets = useMemo(() => {
    const list = petsList.filter((pet) => {
      if (petCategoryFilter !== "all" && pet.type !== petCategoryFilter) return false;
      const count = petDemandMap[pet.id] || 0;
      if (petInquiryFilter === "inquiries" && count === 0) return false;
      if (petInquiryFilter === "zero" && count > 0) return false;
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        pet.breed?.toLowerCase().includes(q) ||
        pet.id?.toLowerCase().includes(q) ||
        pet.type?.toLowerCase().includes(q)
      );
    });
    return applySort(list, "breed");
  }, [petsList, petCategoryFilter, petInquiryFilter, searchQuery, petDemandMap, applySort]);

  // Counts for Segmented Filter Chips
  const overviewModuleCounts = useMemo(() => {
    const total = allOverviewActivities.length;
    const pending = allOverviewActivities.filter((a) => a.status === "pending" || a.status === "unread").length;
    const completed = allOverviewActivities.filter((a) => ["approved", "completed", "accepted", "read", "replied"].includes(a.status)).length;
    return { total, pending, completed };
  }, [allOverviewActivities]);

  const adoptionCounts = useMemo(() => {
    const total = data.adoptions?.length || 0;
    const pending = (data.adoptions || []).filter((a) => (a.status || "pending") === "pending").length;
    const reviewed = (data.adoptions || []).filter((a) => a.status === "reviewed").length;
    const approved = (data.adoptions || []).filter((a) => a.status === "approved").length;
    const rejected = (data.adoptions || []).filter((a) => a.status === "rejected").length;
    return { total, pending, reviewed, approved, rejected };
  }, [data.adoptions]);

  const donationCounts = useMemo(() => {
    const total = data.donations?.length || 0;
    const money = (data.donations || []).filter((d) => d.type === "money").length;
    const item = (data.donations || []).filter((d) => d.type === "item").length;
    return { total, money, item };
  }, [data.donations]);

  const volunteerCounts = useMemo(() => {
    const total = data.volunteers?.length || 0;
    const pending = (data.volunteers || []).filter((v) => (v.status || "pending") === "pending").length;
    const accepted = (data.volunteers || []).filter((v) => v.status === "accepted").length;
    const contacted = (data.volunteers || []).filter((v) => v.status === "contacted").length;
    return { total, pending, accepted, contacted };
  }, [data.volunteers]);

  const contactCounts = useMemo(() => {
    const total = data.contacts?.length || 0;
    const unread = (data.contacts || []).filter((c) => (c.status || "unread") === "unread").length;
    const read = (data.contacts || []).filter((c) => c.status === "read").length;
    const replied = (data.contacts || []).filter((c) => c.status === "replied").length;
    return { total, unread, read, replied };
  }, [data.contacts]);

  const petCounts = useMemo(() => {
    const total = petsList.length;
    const dogs = petsList.filter((p) => p.type === "Dog" || p.type === "dog").length;
    const cats = petsList.filter((p) => p.type === "Cat" || p.type === "cat").length;
    return { total, dogs, cats };
  }, [petsList]);

  // Check if any filter is currently active
  const isFilterActive = useMemo(() => {
    if (searchQuery) return true;
    if (dateRangeFilter !== "all") return true;
    if (activeTab === "overview" && overviewModuleFilter !== "all") return true;
    if (activeTab === "adoptions" && adoptionStatusFilter !== "all") return true;
    if (activeTab === "donations" && donationFilter !== "all") return true;
    if (activeTab === "volunteers" && volunteerStatusFilter !== "all") return true;
    if (activeTab === "contacts" && contactStatusFilter !== "all") return true;
    if (activeTab === "catalog" && (petCategoryFilter !== "all" || petInquiryFilter !== "all")) return true;
    if (sortBy !== "newest") return true;
    return false;
  }, [searchQuery, dateRangeFilter, activeTab, overviewModuleFilter, adoptionStatusFilter, donationFilter, volunteerStatusFilter, contactStatusFilter, petCategoryFilter, petInquiryFilter, sortBy]);

  // Paginate items based on current page and rows per page
  const paginateList = (list) => {
    if (rowsPerPage >= 999) return list;
    const start = (currentPage - 1) * rowsPerPage;
    return list.slice(start, start + rowsPerPage);
  };

  const renderPagination = (totalItems) => {
    if (totalItems === 0) return null;
    const totalPages = Math.ceil(totalItems / (rowsPerPage >= 999 ? totalItems : rowsPerPage)) || 1;
    const startIdx = rowsPerPage >= 999 ? 1 : Math.min((currentPage - 1) * rowsPerPage + 1, totalItems);
    const endIdx = rowsPerPage >= 999 ? totalItems : Math.min(currentPage * rowsPerPage, totalItems);

    return (
      <div className="table-pagination-bar">
        <div className="pagination-left">
          <span className="pagination-info">
            Showing <strong>{startIdx} – {endIdx}</strong> of <strong>{totalItems}</strong> entries
          </span>
          <div className="pagination-page-size">
            <span style={{ color: "#64748b", fontSize: "0.82rem", fontWeight: "600" }}>Rows per page:</span>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="page-size-select"
            >
              <option value={10}>10 rows</option>
              <option value={25}>25 rows</option>
              <option value={50}>50 rows</option>
              <option value={999}>Show All</option>
            </select>
          </div>
        </div>

        {totalPages > 1 && (
          <div className="pagination-right">
            <button
              type="button"
              className="pagination-btn nav-btn"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            >
              ‹ Previous
            </button>

            <div className="pagination-numbers">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                .map((p, idx, arr) => {
                  const showEllipsis = idx > 0 && p - arr[idx - 1] > 1;
                  return (
                    <React.Fragment key={p}>
                      {showEllipsis && <span className="pagination-ellipsis">…</span>}
                      <button
                        type="button"
                        className={`pagination-btn number-btn ${currentPage === p ? "active" : ""}`}
                        onClick={() => setCurrentPage(p)}
                      >
                        {p}
                      </button>
                    </React.Fragment>
                  );
                })}
            </div>

            <button
              type="button"
              className="pagination-btn nav-btn"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            >
              Next ›
            </button>
          </div>
        )}
      </div>
    );
  };

  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    let rows = [];

    if (activeTab === "overview") {
      csvContent += "Module,Name,Email,Target/Details,Status,Date\n";
      rows = filteredOverviewActivities.map((act) =>
        [
          act.type,
          `"${act.personName || ""}"`,
          `"${act.personEmail || ""}"`,
          `"${(act.targetInfo || "").replace(/"/g, '""')}"`,
          `"${act.status || ""}"`,
          `"${formatDate(act.date)}"`,
        ].join(",")
      );
    } else if (activeTab === "donations") {
      csvContent += "Type,Donor Name,Donor Email,Amount/Item,Quantity,Notes,Date\n";
      rows = filteredDonations.map((d) =>
        [
          d.type,
          `"${d.donorName || ""}"`,
          `"${d.donorEmail || ""}"`,
          d.type === "money" ? `₹${d.amount}` : `"${d.item || ""}"`,
          d.quantity || 1,
          `"${(d.description || "").replace(/"/g, '""')}"`,
          `"${formatDate(d.createdAt)}"`,
        ].join(",")
      );
    } else if (activeTab === "volunteers") {
      csvContent += "Name,Email,Phone,Status,Message,Date\n";
      rows = filteredVolunteers.map((v) =>
        [
          `"${v.name || ""}"`,
          `"${v.email || ""}"`,
          `"${v.phone || ""}"`,
          `"${v.status || "pending"}"`,
          `"${(v.message || "").replace(/"/g, '""')}"`,
          `"${formatDate(v.createdAt)}"`,
        ].join(",")
      );
    } else if (activeTab === "adoptions") {
      csvContent += "Pet Name,Applicant Name,Email,Mobile,Status,Date\n";
      rows = filteredAdoptions.map((a) =>
        [
          `"${a.petName || ""}"`,
          `"${a.name || ""}"`,
          `"${a.email || ""}"`,
          `"${a.mobile || ""}"`,
          `"${a.status || "pending"}"`,
          `"${formatDate(a.createdAt)}"`,
        ].join(",")
      );
    } else if (activeTab === "catalog") {
      csvContent += "Pet ID,Category,Breed,Age,Inquiries\n";
      rows = filteredPets.map((p) =>
        [
          `"${p.id || ""}"`,
          `"${p.type || ""}"`,
          `"${p.breed || ""}"`,
          `"${p.age || ""}"`,
          petDemandMap[p.id] || 0,
        ].join(",")
      );
    } else {
      csvContent += "Name,Email,Status,Message,Date\n";
      rows = filteredContacts.map((c) =>
        [
          `"${c.name || ""}"`,
          `"${c.email || ""}"`,
          `"${c.status || "unread"}"`,
          `"${(c.message || "").replace(/"/g, '""')}"`,
          `"${formatDate(c.createdAt)}"`,
        ].join(",")
      );
    }

    csvContent += rows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `live_admin_${activeTab}_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${activeTab} CSV report!`);
  };

  const openDetailsModal = (record, type) => {
    setSelectedRecord(record);
    setModalType(type);
  };

  const closeDetailsModal = () => {
    setSelectedRecord(null);
    setModalType("");
  };

  return (
    <div className="admin-page-wrapper">
      {/* Toast Notification */}
      {successToast && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            background: "var(--brand-dark)",
            color: "#ffffff",
            padding: "12px 20px",
            borderRadius: "10px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
            fontSize: "0.875rem",
            fontWeight: "600",
            zIndex: 10000,
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span>🟢</span>
          <span>{successToast}</span>
        </div>
      )}

      {!token ? (
        /* Minimalist Admin Sign In Screen */
        <div className="admin-login-wrapper">
          <div className="admin-login-card live-theme" style={{ maxWidth: "400px", padding: "30px 24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <Link to="/" style={{ color: "#ea580c", textDecoration: "none", fontWeight: "600", fontSize: "0.85rem" }}>
                &larr; Home
              </Link>
              <span style={{ fontSize: "0.75rem", background: "#fff7ed", color: "#ea580c", padding: "2px 8px", borderRadius: "12px", fontWeight: "700", border: "1px solid #fed7aa" }}>
                Admin Portal
              </span>
            </div>

            <h2 style={{ fontSize: "1.6rem", marginBottom: "4px", color: "#1e293b", fontWeight: "800" }}>Sign In</h2>
            <p style={{ color: "#64748b", fontSize: "0.88rem", marginBottom: "18px" }}>
              Enter your credentials to manage shelter records
            </p>

            {errorMessage && (
              <div
                style={{
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  color: "#b91c1c",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  fontSize: "0.82rem",
                  marginBottom: "14px",
                }}
              >
                ⚠️ {errorMessage}
              </div>
            )}

            <form onSubmit={handleLogin} className="login-form">
              <div className="login-input-group">
                <label>Email</label>
                <div className="login-input-wrapper">
                  <span className="login-input-icon">✉️</span>
                  <input
                    type="email"
                    className="login-input"
                    placeholder="admin@petcare.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="login-input-group">
                <label>Password</label>
                <div className="login-input-wrapper" style={{ position: "relative" }}>
                  <span className="login-input-icon">🔒</span>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="login-input"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ paddingRight: "40px" }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    title={showPassword ? "Hide password" : "Show password"}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      color: "#94a3b8",
                      padding: "4px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {showPassword ? (
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                    ) : (
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="primary-login-btn"
                disabled={loginLoading}
                style={{ width: "100%", marginTop: "6px" }}
              >
                {loginLoading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                margin: "16px 0",
                color: "#94a3b8",
                fontSize: "0.75rem",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }}></div>
              <span>or</span>
              <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }}></div>
            </div>

            {/* QUICK ACCESS BUTTON BELOW SIGN IN */}
            <button
              type="button"
              onClick={handleLaunchDemoMode}
              style={{
                width: "100%",
                padding: "11px 16px",
                background: "#f8fafc",
                color: "#475569",
                border: "1.5px solid #cbd5e1",
                borderRadius: "8px",
                fontSize: "0.88rem",
                fontWeight: "700",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#f1f5f9";
                e.currentTarget.style.borderColor = "#94a3b8";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#f8fafc";
                e.currentTarget.style.borderColor = "#cbd5e1";
              }}
            >
              <span>⚡</span>
              <span>Quick Preview Access</span>
            </button>

            <div style={{ textAlign: "center", marginTop: "14px" }}>
              <button
                type="button"
                onClick={() => {
                  setEmail("admin@petcare.com");
                  setPassword("admin123");
                }}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#94a3b8",
                  fontSize: "0.75rem",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                Auto-fill admin credentials
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Admin Dashboard */
        <div className="dashboard-container">
          {/* Header Bar */}
          <header className="dashboard-header">
            <div className="header-branding">
              <div className="brand-icon-box">🛡️</div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <h1 className="brand-title">Admin Dashboard</h1>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: "700",
                      padding: "3px 10px",
                      borderRadius: "20px",
                      background: "#ecfdf5",
                      color: "#047857",
                      border: "1px solid #a7f3d0",
                    }}
                  >
                    🟢 Active Session
                  </span>
                </div>
                <div className="brand-subtitle">
                  <span>Manage adoptions, donations, volunteers, and pet inventory</span>
                  {lastSyncTime && <span style={{ marginLeft: "8px", fontSize: "0.78rem", color: "#94a3b8" }}>• Synced {lastSyncTime}</span>}
                </div>
              </div>
            </div>

            <div className="header-actions">
              <button
                onClick={() => loadLiveBackendData(token)}
                className="header-action-btn"
                title="Refresh database records"
                disabled={refreshing}
              >
                <span className={refreshing ? "refresh-spin" : ""}>🔄</span>
                <span>{refreshing ? "Refreshing..." : "Refresh"}</span>
              </button>

              <button
                onClick={handleLogout}
                className="logout-action-btn"
                title="Sign out of admin session"
              >
                Sign Out
              </button>
            </div>
          </header>

          {/* KPI Stat Cards Grid */}
          <section className="kpi-grid">
            <div
              className={`kpi-card ${activeTab === "overview" ? "active-kpi" : ""}`}
              onClick={() => handleTabChange("overview")}
            >
              <div className="kpi-info">
                <h4>Total Records</h4>
                <div className="kpi-value">{(data.adoptions?.length || 0) + (data.donations?.length || 0) + (data.volunteers?.length || 0) + (data.contacts?.length || 0)}</div>
                <div className="kpi-subtext">
                  <span>Across all shelter categories</span>
                </div>
              </div>
              <div className="kpi-icon-pill kpi-icon-gold">📈</div>
            </div>

            <div
              className={`kpi-card ${activeTab === "donations" ? "active-kpi" : ""}`}
              onClick={() => handleTabChange("donations")}
            >
              <div className="kpi-info">
                <h4>Donations Raised</h4>
                <div className="kpi-value">₹{totalMoneyRaised.toLocaleString()}</div>
                <div className="kpi-subtext">
                  <span>{data.donations?.length || 0} donations • {totalItemDonations} supply items</span>
                </div>
              </div>
              <div className="kpi-icon-pill kpi-icon-emerald">💰</div>
            </div>

            <div
              className={`kpi-card ${activeTab === "adoptions" ? "active-kpi" : ""}`}
              onClick={() => handleTabChange("adoptions")}
            >
              <div className="kpi-info">
                <h4>Adoption Inquiries</h4>
                <div className="kpi-value">{data.adoptions?.length || 0}</div>
                <div className="kpi-subtext">
                  <span>{pendingAdoptionsCount} pending • {approvedAdoptionsCount} approved</span>
                </div>
              </div>
              <div className="kpi-icon-pill kpi-icon-sky">🐶</div>
            </div>

            <div
              className={`kpi-card ${activeTab === "volunteers" ? "active-kpi" : ""}`}
              onClick={() => handleTabChange("volunteers")}
            >
              <div className="kpi-info">
                <h4>Volunteers</h4>
                <div className="kpi-value">{data.volunteers?.length || 0}</div>
                <div className="kpi-subtext">
                  <span>Registered supporters</span>
                </div>
              </div>
              <div className="kpi-icon-pill kpi-icon-purple">🙋</div>
            </div>

            <div
              className={`kpi-card ${activeTab === "contacts" ? "active-kpi" : ""}`}
              onClick={() => handleTabChange("contacts")}
            >
              <div className="kpi-info">
                <h4>Messages</h4>
                <div className="kpi-value">{data.contacts?.length || 0}</div>
                <div className="kpi-subtext">
                  <span>{unreadContactsCount} unread messages</span>
                </div>
              </div>
              <div className="kpi-icon-pill kpi-icon-amber">💬</div>
            </div>
          </section>

          {/* Main Container Card */}
          <div className="dashboard-main-card">
            {/* Level 1: Navigation Tabs */}
            <div className="dashboard-tab-bar">
              <div className="tabs-nav">
                <button
                  className={`tab-btn ${activeTab === "overview" ? "active-tab" : ""}`}
                  onClick={() => handleTabChange("overview")}
                >
                  <span>📊 Overview</span>
                  <span className="tab-count-badge">{allOverviewActivities.length}</span>
                </button>
                <button
                  className={`tab-btn ${activeTab === "adoptions" ? "active-tab" : ""}`}
                  onClick={() => handleTabChange("adoptions")}
                >
                  <span>🐶 Adoptions</span>
                  <span className="tab-count-badge">{data.adoptions?.length || 0}</span>
                </button>
                <button
                  className={`tab-btn ${activeTab === "donations" ? "active-tab" : ""}`}
                  onClick={() => handleTabChange("donations")}
                >
                  <span>💰 Donations</span>
                  <span className="tab-count-badge">{data.donations?.length || 0}</span>
                </button>
                <button
                  className={`tab-btn ${activeTab === "volunteers" ? "active-tab" : ""}`}
                  onClick={() => handleTabChange("volunteers")}
                >
                  <span>🙋 Volunteers</span>
                  <span className="tab-count-badge">{data.volunteers?.length || 0}</span>
                </button>
                <button
                  className={`tab-btn ${activeTab === "contacts" ? "active-tab" : ""}`}
                  onClick={() => handleTabChange("contacts")}
                >
                  <span>💬 Messages</span>
                  <span className="tab-count-badge">{data.contacts?.length || 0}</span>
                </button>
                <button
                  className={`tab-btn ${activeTab === "catalog" ? "active-tab" : ""}`}
                  onClick={() => handleTabChange("catalog")}
                >
                  <span>🐾 Pet Inventory</span>
                  <span className="tab-count-badge">{petsList.length}</span>
                </button>
              </div>
            </div>

            {/* Level 2: Clean, Modern Command Bar */}
            <div className="dashboard-command-bar">
              <div className="command-bar-row">
                {/* Search Box */}
                <div className="pro-search-box">
                  <span className="pro-search-icon">🔍</span>
                  <input
                    type="text"
                    className="pro-search-input"
                    placeholder={
                      activeTab === "catalog"
                        ? "Search pets by breed, name, ID..."
                        : activeTab === "overview"
                        ? "Search all activities..."
                        : `Search ${activeTab}...`
                    }
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      className="pro-search-clear"
                      onClick={() => setSearchQuery("")}
                      title="Clear search"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Filter Controls & Actions Group */}
                <div className="search-and-tools">
                  {/* Contextual Status / Category Filter */}
                  {activeTab === "overview" && (
                    <select
                      value={overviewModuleFilter}
                      onChange={(e) => { setOverviewModuleFilter(e.target.value); setCurrentPage(1); }}
                      className="sort-select"
                      aria-label="Filter activity"
                    >
                      <option value="all">All Activities ({overviewModuleCounts.total})</option>
                      <option value="pending">⏳ Needs Action ({overviewModuleCounts.pending})</option>
                      <option value="completed">✅ Completed ({overviewModuleCounts.completed})</option>
                    </select>
                  )}

                  {activeTab === "adoptions" && (
                    <select
                      value={adoptionStatusFilter}
                      onChange={(e) => { setAdoptionStatusFilter(e.target.value); setCurrentPage(1); }}
                      className="sort-select"
                      aria-label="Filter by adoption status"
                    >
                      <option value="all">Status: All ({adoptionCounts.total})</option>
                      <option value="pending">⏳ Pending ({adoptionCounts.pending})</option>
                      <option value="reviewed">👀 Reviewed ({adoptionCounts.reviewed})</option>
                      <option value="approved">✅ Approved ({adoptionCounts.approved})</option>
                      <option value="rejected">❌ Rejected ({adoptionCounts.rejected})</option>
                    </select>
                  )}

                  {activeTab === "donations" && (
                    <select
                      value={donationFilter}
                      onChange={(e) => { setDonationFilter(e.target.value); setCurrentPage(1); }}
                      className="sort-select"
                      aria-label="Filter donations"
                    >
                      <option value="all">Type: All ({donationCounts.total})</option>
                      <option value="money">💵 Monetary (₹)</option>
                      <option value="item">📦 Supplies</option>
                    </select>
                  )}

                  {activeTab === "volunteers" && (
                    <select
                      value={volunteerStatusFilter}
                      onChange={(e) => { setVolunteerStatusFilter(e.target.value); setCurrentPage(1); }}
                      className="sort-select"
                      aria-label="Filter volunteers"
                    >
                      <option value="all">Status: All ({volunteerCounts.total})</option>
                      <option value="pending">⏳ Pending ({volunteerCounts.pending})</option>
                      <option value="accepted">✅ Accepted ({volunteerCounts.accepted})</option>
                      <option value="contacted">📞 Contacted ({volunteerCounts.contacted})</option>
                    </select>
                  )}

                  {activeTab === "contacts" && (
                    <select
                      value={contactStatusFilter}
                      onChange={(e) => { setContactStatusFilter(e.target.value); setCurrentPage(1); }}
                      className="sort-select"
                      aria-label="Filter messages"
                    >
                      <option value="all">Status: All ({contactCounts.total})</option>
                      <option value="unread">📬 Unread ({contactCounts.unread})</option>
                      <option value="read">📖 Read ({contactCounts.read})</option>
                      <option value="replied">✉️ Replied ({contactCounts.replied})</option>
                    </select>
                  )}

                  {activeTab === "catalog" && (
                    <select
                      value={petCategoryFilter}
                      onChange={(e) => { setPetCategoryFilter(e.target.value); setCurrentPage(1); }}
                      className="sort-select"
                      aria-label="Filter pets by category"
                    >
                      <option value="all">Category: All ({petCounts.total})</option>
                      <option value="Dog">🐕 Dogs ({petCounts.dogs})</option>
                      <option value="Cat">🐱 Cats ({petCounts.cats})</option>
                    </select>
                  )}

                  {/* Date Range (Temporal tabs) */}
                  {activeTab !== "catalog" && (
                    <select
                      value={dateRangeFilter}
                      onChange={(e) => { setDateRangeFilter(e.target.value); setCurrentPage(1); }}
                      className="date-select"
                      aria-label="Filter by time"
                    >
                      <option value="all">📅 All Time</option>
                      <option value="today">⚡ Today</option>
                      <option value="7days">📆 Past 7 Days</option>
                      <option value="30days">🗓️ Past 30 Days</option>
                    </select>
                  )}

                  {/* Sort */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="sort-select"
                    aria-label="Sort records"
                  >
                    {activeTab === "catalog" ? (
                      <>
                        <option value="name">🔤 Name (A - Z)</option>
                        <option value="inquiries_desc">🔥 Most Inquiries</option>
                      </>
                    ) : (
                      <>
                        <option value="newest">📅 Newest First</option>
                        <option value="oldest">📅 Oldest First</option>
                        <option value="name">🔤 Name (A - Z)</option>
                      </>
                    )}
                  </select>

                  {/* Add Pet Button (Prominently displayed in Catalog tab) */}
                  {activeTab === "catalog" && (
                    <button
                      type="button"
                      onClick={handleOpenAddPetModal}
                      style={{
                        background: "#ea580c",
                        color: "#ffffff",
                        border: "none",
                        borderRadius: "8px",
                        padding: "8px 16px",
                        fontSize: "0.85rem",
                        fontWeight: "700",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        whiteSpace: "nowrap",
                        boxShadow: "0 2px 8px rgba(234, 88, 12, 0.25)",
                      }}
                    >
                      <span>➕</span>
                      <span>Add New Pet</span>
                    </button>
                  )}

                  <button
                    onClick={handleExportCSV}
                    className="export-btn"
                    title="Export records to CSV"
                  >
                    📥 Export CSV
                  </button>

                  {isFilterActive && (
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      style={{
                        background: "#fef2f2",
                        border: "1px solid #fecaca",
                        color: "#b91c1c",
                        borderRadius: "8px",
                        padding: "8px 12px",
                        fontSize: "0.8rem",
                        fontWeight: "700",
                        cursor: "pointer",
                      }}
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* TAB VIEWS */}

            {/* 1. EXECUTIVE OVERVIEW TAB */}
            {activeTab === "overview" && (
              <div className="overview-dashboard-grid">
                <div className="overview-banner-card">
                  <div className="overview-banner-text">
                    <h3>🐾 Live Shelter Control Center</h3>
                    <p>
                      Real-time overview of incoming adoption requests, donation transactions, volunteer signups, and user inquiries with full search and filtering capabilities.
                    </p>
                  </div>
                  <div className="overview-quick-metrics">
                    <div className="quick-metric-box">
                      <div className="quick-metric-num">₹{totalMoneyRaised.toLocaleString()}</div>
                      <div className="quick-metric-lbl">Total Funds</div>
                    </div>
                    <div className="quick-metric-box">
                      <div className="quick-metric-num">{pendingAdoptionsCount}</div>
                      <div className="quick-metric-lbl">Pending Review</div>
                    </div>
                    <div className="quick-metric-box">
                      <div className="quick-metric-num">{unreadContactsCount}</div>
                      <div className="quick-metric-lbl">New Messages</div>
                    </div>
                  </div>
                </div>

                {/* Direct Pet Inventory Quick Action Card */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "12px",
                    background: "#ffffff",
                    padding: "14px 20px",
                    borderRadius: "12px",
                    border: "1.5px solid #fed7aa",
                    boxShadow: "0 2px 8px rgba(234, 88, 12, 0.08)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ background: "#fff7ed", padding: "8px 12px", borderRadius: "10px", fontSize: "1.3rem" }}>🐾</div>
                    <div>
                      <strong style={{ color: "#0f172a", fontSize: "0.95rem" }}>Pet Catalog & Inventory ({petsList.length} Active Animals)</strong>
                      <div style={{ fontSize: "0.82rem", color: "#64748b" }}>Add new pets, edit profiles, or manage adoption availability</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    <button
                      type="button"
                      onClick={() => handleTabChange("catalog")}
                      style={{
                        background: "#f1f5f9",
                        border: "1px solid #cbd5e1",
                        color: "#334155",
                        padding: "8px 16px",
                        borderRadius: "8px",
                        fontWeight: "700",
                        fontSize: "0.85rem",
                        cursor: "pointer",
                      }}
                    >
                      View All Pets &rarr;
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleTabChange("catalog");
                        handleOpenAddPetModal();
                      }}
                      style={{
                        background: "#ea580c",
                        color: "#ffffff",
                        border: "none",
                        padding: "8px 18px",
                        borderRadius: "8px",
                        fontWeight: "800",
                        fontSize: "0.85rem",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        boxShadow: "0 2px 8px rgba(234, 88, 12, 0.25)",
                      }}
                    >
                      <span>➕</span>
                      <span>Add New Pet</span>
                    </button>
                  </div>
                </div>

                {/* Unified Recent Submissions Table */}
                <div style={{ marginTop: "10px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                    <div>
                      <h4 style={{ fontSize: "1.1rem", fontWeight: "800", color: "#0f172a", margin: 0 }}>
                        📋 System Submissions & Inquiries Table
                      </h4>
                      <p style={{ margin: "2px 0 0 0", fontSize: "0.8rem", color: "#64748b" }}>
                        Aggregated live feed across all platform operations
                      </p>
                    </div>
                  </div>

                  {filteredOverviewActivities.length === 0 ? (
                    <div className="table-wrapper" style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}>
                      <div style={{ fontSize: "2rem", marginBottom: "8px" }}>🔍</div>
                      <h3 style={{ margin: "0 0 4px 0", color: "#475569" }}>No records match your filters</h3>
                      <p style={{ margin: 0, fontSize: "0.85rem" }}>Try adjusting your search query, module filter, or date range.</p>
                      {isFilterActive && (
                        <button
                          onClick={handleResetFilters}
                          className="export-btn"
                          style={{ marginTop: "12px", display: "inline-flex" }}
                        >
                          Clear Filters
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="table-wrapper">
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th style={{ width: "130px" }}>Module</th>
                            <th>Applicant / Donor</th>
                            <th>Target / Details</th>
                            <th style={{ width: "120px" }}>Status</th>
                            <th style={{ width: "160px" }}>Date & Time</th>
                            <th style={{ width: "100px", textAlign: "center" }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paginateList(filteredOverviewActivities).map((act, i) => (
                            <tr key={act._id || i}>
                              <td>
                                <span
                                  className="badge"
                                  style={{
                                    background:
                                      act.type === "adoption" ? "#fff7ed" :
                                      act.type === "donation" ? "#ecfdf5" :
                                      act.type === "volunteer" ? "#faf5ff" : "#f0f9ff",
                                    color:
                                      act.type === "adoption" ? "#c2410c" :
                                      act.type === "donation" ? "#047857" :
                                      act.type === "volunteer" ? "#7e22ce" : "#0284c7",
                                    border:
                                      act.type === "adoption" ? "1px solid #fed7aa" :
                                      act.type === "donation" ? "1px solid #a7f3d0" :
                                      act.type === "volunteer" ? "1px solid #e9d5ff" : "1px solid #bae6fd",
                                    textTransform: "uppercase",
                                    fontSize: "0.72rem",
                                    fontWeight: "800",
                                  }}
                                >
                                  {act.icon} {act.type}
                                </span>
                              </td>
                              <td>
                                <div className="user-cell">
                                  <div className="user-avatar">
                                    {getInitials(act.personName)}
                                  </div>
                                  <div>
                                    <div className="user-name">{act.personName}</div>
                                    <div className="user-email">{act.personEmail}</div>
                                  </div>
                                </div>
                              </td>
                              <td>
                                {act.type === "adoption" ? (
                                  <span className="badge badge-pet">
                                    {act.targetInfo}
                                  </span>
                                ) : act.type === "donation" ? (
                                  <strong style={{ color: "#047857", fontSize: "0.92rem" }}>
                                    {act.targetInfo}
                                  </strong>
                                ) : (
                                  <span style={{ color: "#334155", fontSize: "0.88rem" }}>
                                    {act.targetInfo}
                                  </span>
                                )}
                              </td>
                              <td>
                                <span
                                  className="badge"
                                  style={{
                                    background:
                                      act.status === "approved" || act.status === "accepted" || act.status === "Completed" ? "#ecfdf5" :
                                      act.status === "rejected" ? "#fef2f2" :
                                      act.status === "reviewed" || act.status === "contacted" || act.status === "read" ? "#f0f9ff" :
                                      "#fffbeb",
                                    color:
                                      act.status === "approved" || act.status === "accepted" || act.status === "Completed" ? "#047857" :
                                      act.status === "rejected" ? "#dc2626" :
                                      act.status === "reviewed" || act.status === "contacted" || act.status === "read" ? "#0284c7" :
                                      "#b45309",
                                    border:
                                      act.status === "approved" || act.status === "accepted" || act.status === "Completed" ? "1px solid #a7f3d0" :
                                      act.status === "rejected" ? "1px solid #fecaca" :
                                      act.status === "reviewed" || act.status === "contacted" || act.status === "read" ? "1px solid #bae6fd" :
                                      "1px solid #fde68a",
                                    textTransform: "capitalize",
                                  }}
                                >
                                  {act.status}
                                </span>
                              </td>
                              <td>
                                <span style={{ color: "#64748b", fontSize: "0.82rem" }}>
                                  {formatDate(act.date)}
                                </span>
                              </td>
                              <td style={{ textAlign: "center" }}>
                                <button
                                  onClick={() => openDetailsModal(act.raw, act.type)}
                                  className="action-link-btn"
                                >
                                  View
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {renderPagination(filteredOverviewActivities.length)}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 2. ADOPTIONS TAB */}
            {activeTab === "adoptions" && (
              <div className="table-wrapper">
                {filteredAdoptions.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">🐶</div>
                    <h3>No Adoption Inquiries Found</h3>
                    <p>
                      {isFilterActive
                        ? "No adoption applications match your filter, date range, or search query."
                        : "Adoption requests submitted through the website catalog will appear here."}
                    </p>
                    {isFilterActive && (
                      <button
                        onClick={handleResetFilters}
                        className="export-btn"
                        style={{ marginTop: "12px", display: "inline-flex" }}
                      >
                        Clear Search & Filters
                      </button>
                    )}
                  </div>
                ) : (
                  <>
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Requested Pet</th>
                          <th>Applicant</th>
                          <th>Mobile</th>
                          <th>Status</th>
                          <th>Date Submitted</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginateList(filteredAdoptions).map((item, idx) => (
                          <tr key={item._id || `adopt-${idx}`}>
                            <td>
                              <span className="badge badge-pet">
                                🐾 {item.petName || "Pet"}
                              </span>
                            </td>
                            <td>
                              <div className="user-cell">
                                <div className="user-avatar">
                                  {getInitials(item.name)}
                                </div>
                                <div>
                                  <div className="user-name">{item.name}</div>
                                  <div className="user-email">{item.email}</div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <a
                                href={`tel:${item.mobile}`}
                                className="table-contact-link"
                              >
                                📞 {item.mobile || "—"}
                              </a>
                            </td>
                            <td>
                              <select
                                value={item.status || "pending"}
                                onChange={(e) => handleUpdateStatus("adoptions", item._id, e.target.value)}
                                className="status-changer-select"
                              >
                                <option value="pending">⏳ Pending</option>
                                <option value="reviewed">👀 Reviewed</option>
                                <option value="approved">✅ Approved</option>
                                <option value="rejected">❌ Rejected</option>
                              </select>
                            </td>
                            <td>
                              <span style={{ fontSize: "0.825rem", color: "var(--brand-muted)" }}>
                                {formatDate(item.createdAt)}
                              </span>
                            </td>
                            <td>
                              <div className="action-buttons-cell">
                                <button
                                  onClick={() => openDetailsModal(item, "adoption")}
                                  className="action-link-btn"
                                >
                                  View
                                </button>
                                <button
                                  onClick={() => handleDeleteRecord("adoptions", item._id)}
                                  className="action-delete-btn"
                                  title="Delete application"
                                >
                                  🗑️
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {renderPagination(filteredAdoptions.length)}
                  </>
                )}
              </div>
            )}

            {/* 3. DONATIONS TAB */}
            {activeTab === "donations" && (
              <div className="table-wrapper">
                {filteredDonations.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">💰</div>
                    <h3>No Donations Found</h3>
                    <p>
                      {isFilterActive
                        ? "No donation entries match your search, date range, or filter criteria."
                        : "Donations submitted from the Donate page will display here."}
                    </p>
                    {isFilterActive && (
                      <button
                        onClick={handleResetFilters}
                        className="export-btn"
                        style={{ marginTop: "12px", display: "inline-flex" }}
                      >
                        Clear Search & Filters
                      </button>
                    )}
                  </div>
                ) : (
                  <>
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Donor</th>
                          <th>Category</th>
                          <th>Contribution</th>
                          <th>Notes / Specs</th>
                          <th>Date Received</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginateList(filteredDonations).map((item, idx) => (
                          <tr key={item._id || `don-${idx}`}>
                            <td>
                              <div className="user-cell">
                                <div className="user-avatar">
                                  {getInitials(item.donorName)}
                                </div>
                                <div>
                                  <div className="user-name">{item.donorName || "Anonymous"}</div>
                                  <div className="user-email">{item.donorEmail || "—"}</div>
                                </div>
                              </div>
                            </td>
                            <td>
                              {item.type === "money" ? (
                                <span className="badge badge-money">💵 Money</span>
                              ) : (
                                <span className="badge badge-item">📦 Pet Supplies</span>
                              )}
                            </td>
                            <td>
                              <strong style={{ color: "var(--brand-dark)", fontSize: "0.925rem" }}>
                                {item.type === "money"
                                  ? `₹${Number(item.amount || 0).toLocaleString()}`
                                  : `${item.item || "Supplies"} (Qty: ${item.quantity || 1})`}
                              </strong>
                            </td>
                            <td>
                              <span style={{ color: "var(--brand-muted)", fontSize: "0.825rem" }}>
                                {item.description || "No note provided"}
                              </span>
                            </td>
                            <td>
                              <span style={{ fontSize: "0.825rem", color: "var(--brand-muted)" }}>
                                {formatDate(item.createdAt)}
                              </span>
                            </td>
                            <td>
                              <div className="action-buttons-cell">
                                <button
                                  onClick={() => openDetailsModal(item, "donation")}
                                  className="action-link-btn"
                                >
                                  View
                                </button>
                                <button
                                  onClick={() => handleDeleteRecord("donations", item._id)}
                                  className="action-delete-btn"
                                  title="Delete donation"
                                >
                                  🗑️
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {renderPagination(filteredDonations.length)}
                  </>
                )}
              </div>
            )}

            {/* 4. VOLUNTEERS TAB */}
            {activeTab === "volunteers" && (
              <div className="table-wrapper">
                {filteredVolunteers.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">🙋</div>
                    <h3>No Volunteers Found</h3>
                    <p>
                      {isFilterActive
                        ? "No volunteer applications matched your search or filters."
                        : "Volunteer registrations submitted through the website will appear here."}
                    </p>
                    {isFilterActive && (
                      <button
                        onClick={handleResetFilters}
                        className="export-btn"
                        style={{ marginTop: "12px", display: "inline-flex" }}
                      >
                        Clear Search & Filters
                      </button>
                    )}
                  </div>
                ) : (
                  <>
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Volunteer</th>
                          <th>Phone</th>
                          <th>Motivation & Skills</th>
                          <th>Status</th>
                          <th>Date Registered</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginateList(filteredVolunteers).map((item, idx) => (
                          <tr key={item._id || `vol-${idx}`}>
                            <td>
                              <div className="user-cell">
                                <div className="user-avatar">
                                  {getInitials(item.name)}
                                </div>
                                <div>
                                  <div className="user-name">{item.name}</div>
                                  <div className="user-email">{item.email}</div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <a
                                href={`tel:${item.phone}`}
                                className="table-contact-link"
                              >
                                📞 {item.phone || "—"}
                              </a>
                            </td>
                            <td>
                              <div
                                style={{
                                  maxWidth: "260px",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                  color: "var(--brand-slate)",
                                  fontSize: "0.825rem",
                                }}
                                title={item.message}
                              >
                                {item.message || "—"}
                              </div>
                            </td>
                            <td>
                              <select
                                value={item.status || "pending"}
                                onChange={(e) => handleUpdateStatus("volunteers", item._id, e.target.value)}
                                className="status-changer-select"
                              >
                                <option value="pending">⏳ Pending</option>
                                <option value="accepted">✅ Accepted</option>
                                <option value="contacted">📞 Contacted</option>
                              </select>
                            </td>
                            <td>
                              <span style={{ fontSize: "0.825rem", color: "var(--brand-muted)" }}>
                                {formatDate(item.createdAt)}
                              </span>
                            </td>
                            <td>
                              <div className="action-buttons-cell">
                                <button
                                  onClick={() => openDetailsModal(item, "volunteer")}
                                  className="action-link-btn"
                                >
                                  View
                                </button>
                                <button
                                  onClick={() => handleDeleteRecord("volunteers", item._id)}
                                  className="action-delete-btn"
                                  title="Delete volunteer"
                                >
                                  🗑️
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {renderPagination(filteredVolunteers.length)}
                  </>
                )}
              </div>
            )}

            {/* 5. MESSAGES / INQUIRIES TAB */}
            {activeTab === "contacts" && (
              <div className="table-wrapper">
                {filteredContacts.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">💬</div>
                    <h3>No Messages Found</h3>
                    <p>
                      {isFilterActive
                        ? "No contact submissions matched your search or filters."
                        : "Messages submitted via the contact form will appear here."}
                    </p>
                    {isFilterActive && (
                      <button
                        onClick={handleResetFilters}
                        className="export-btn"
                        style={{ marginTop: "12px", display: "inline-flex" }}
                      >
                        Clear Search & Filters
                      </button>
                    )}
                  </div>
                ) : (
                  <>
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Sender</th>
                          <th>Message Content</th>
                          <th>Status</th>
                          <th>Received Date</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginateList(filteredContacts).map((item, idx) => (
                          <tr key={item._id || `contact-${idx}`}>
                            <td>
                              <div className="user-cell">
                                <div className="user-avatar">
                                  {getInitials(item.name)}
                                </div>
                                <div>
                                  <div className="user-name">{item.name}</div>
                                  <div className="user-email">{item.email}</div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div
                                style={{
                                  maxWidth: "340px",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                  color: "var(--brand-slate)",
                                  fontSize: "0.825rem",
                                }}
                                title={item.message}
                              >
                                {item.message}
                              </div>
                            </td>
                            <td>
                              <select
                                value={item.status || "unread"}
                                onChange={(e) => handleUpdateStatus("contacts", item._id, e.target.value)}
                                className="status-changer-select"
                              >
                                <option value="unread">📬 Unread</option>
                                <option value="read">📖 Read</option>
                                <option value="replied">✉️ Replied</option>
                              </select>
                            </td>
                            <td>
                              <span style={{ fontSize: "0.825rem", color: "var(--brand-muted)" }}>
                                {formatDate(item.createdAt)}
                              </span>
                            </td>
                            <td>
                              <div className="action-buttons-cell">
                                <button
                                  onClick={() => openDetailsModal(item, "contact")}
                                  className="action-link-btn"
                                >
                                  Read
                                </button>
                                <button
                                  onClick={() => handleDeleteRecord("contacts", item._id)}
                                  className="action-delete-btn"
                                  title="Delete message"
                                >
                                  🗑️
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {renderPagination(filteredContacts.length)}
                  </>
                )}
              </div>
            )}

            {/* 6. PET CATALOG INVENTORY TAB */}
            {activeTab === "catalog" && (
              <div className="table-wrapper">
                {/* Prominent Pet Inventory Action Header */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "16px",
                    background: "#0f172a",
                    color: "#ffffff",
                    padding: "20px 24px",
                    borderRadius: "12px",
                    marginBottom: "20px",
                    boxShadow: "0 4px 16px rgba(15, 23, 42, 0.15)",
                  }}
                >
                  <div>
                    <h3 style={{ margin: 0, fontSize: "1.2rem", color: "#ffffff", fontWeight: "800", display: "flex", alignItems: "center", gap: "10px" }}>
                      <span>🐾</span> Pet Inventory & Catalog Management
                    </h3>
                    <p style={{ margin: "4px 0 0", fontSize: "0.86rem", color: "#94a3b8" }}>
                      Add new animals, update adoption availability, or remove pet profiles in real time.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleOpenAddPetModal}
                    style={{
                      background: "#ea580c",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "8px",
                      padding: "12px 24px",
                      fontSize: "0.95rem",
                      fontWeight: "800",
                      fontFamily: "var(--admin-font)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      boxShadow: "0 4px 14px rgba(234, 88, 12, 0.4)",
                      transition: "all 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#c2410c";
                      e.currentTarget.style.transform = "translateY(-1px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#ea580c";
                      e.currentTarget.style.transform = "none";
                    }}
                  >
                    <span style={{ fontSize: "1.2rem" }}>➕</span>
                    <span>Add New Pet</span>
                  </button>
                </div>

                {filteredPets.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">🐾</div>
                    <h3>No Pets Found</h3>
                    <p>No platform animals matched your breed or category search.</p>
                    <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "14px" }}>
                      <button
                        type="button"
                        onClick={handleOpenAddPetModal}
                        style={{
                          background: "#ea580c",
                          color: "#ffffff",
                          border: "none",
                          borderRadius: "8px",
                          padding: "10px 20px",
                          fontWeight: "800",
                          cursor: "pointer",
                        }}
                      >
                        ➕ Add Pet Now
                      </button>
                      {isFilterActive && (
                        <button
                          onClick={handleResetFilters}
                          className="export-btn"
                        >
                          Clear Filters
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <>
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Photo</th>
                          <th>Pet ID</th>
                          <th>Category</th>
                          <th>Breed</th>
                          <th>Age / Gender</th>
                          <th>Inquiries</th>
                          <th>Status</th>
                          <th style={{ textAlign: "center" }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginateList(filteredPets).map((pet, idx) => {
                          const inquiryCount = petDemandMap[pet.id] || 0;
                          return (
                            <tr key={pet.id || idx}>
                              <td>
                                <img
                                  src={pet.img || (pet.type === "Cat" ? "/cat1.jpg" : "/dog1.jpg")}
                                  alt={pet.breed}
                                  style={{
                                    width: "50px",
                                    height: "50px",
                                    borderRadius: "10px",
                                    objectFit: "cover",
                                    border: "1.5px solid #cbd5e1",
                                    boxShadow: "0 2px 4px rgba(0,0,0,0.06)",
                                  }}
                                />
                              </td>
                              <td>
                                <span className="badge-pet">{pet.id}</span>
                              </td>
                              <td>
                                <span
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "5px",
                                    padding: "4px 10px",
                                    borderRadius: "20px",
                                    fontSize: "0.78rem",
                                    fontWeight: "800",
                                    background: pet.type === "Dog" ? "#fff7ed" : "#eff6ff",
                                    color: pet.type === "Dog" ? "#c2410c" : "#1d4ed8",
                                    border: pet.type === "Dog" ? "1.5px solid #fed7aa" : "1.5px solid #bfdbfe",
                                  }}
                                >
                                  {pet.type === "Dog" ? "🐕 Dog" : "🐱 Cat"}
                                </span>
                              </td>
                              <td>
                                <strong style={{ color: "#0f172a", fontSize: "0.95rem" }}>{pet.breed}</strong>
                                {pet.size && <div style={{ fontSize: "0.76rem", color: "#64748b", marginTop: "2px" }}>{pet.size} Size</div>}
                              </td>
                              <td>
                                <span style={{ color: "#334155", fontWeight: "700" }}>
                                  {pet.age} {pet.gender ? `• ${pet.gender}` : ""}
                                </span>
                              </td>
                              <td>
                                <span
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "4px",
                                    padding: "4px 10px",
                                    borderRadius: "20px",
                                    fontSize: "0.78rem",
                                    fontWeight: "700",
                                    background: inquiryCount > 0 ? "#fef3c7" : "#f1f5f9",
                                    color: inquiryCount > 0 ? "#92400e" : "#475569",
                                    border: inquiryCount > 0 ? "1.5px solid #fde68a" : "1px solid #cbd5e1",
                                  }}
                                >
                                  🐾 {inquiryCount} {inquiryCount === 1 ? "Inquiry" : "Inquiries"}
                                </span>
                              </td>
                              <td>
                                <select
                                  value={pet.status || "available"}
                                  onChange={(e) => handleUpdatePetStatus(pet, e.target.value)}
                                  className="status-changer-select"
                                  style={{
                                    background:
                                      pet.status === "available" ? "#ecfdf5" :
                                      pet.status === "pending" ? "#fffbeb" : "#eff6ff",
                                    color:
                                      pet.status === "available" ? "#047857" :
                                      pet.status === "pending" ? "#b45309" : "#1d4ed8",
                                    borderColor:
                                      pet.status === "available" ? "#6ee7b7" :
                                      pet.status === "pending" ? "#fcd34d" : "#93c5fd",
                                  }}
                                >
                                  <option value="available">🟢 Available</option>
                                  <option value="pending">🟡 Pending</option>
                                  <option value="adopted">🟣 Adopted</option>
                                </select>
                              </td>
                              <td>
                                <div className="action-buttons-cell" style={{ justifyContent: "center" }}>
                                  <button
                                    onClick={() => handleOpenEditPetModal(pet)}
                                    className="action-link-btn"
                                    title="Edit pet profile"
                                  >
                                    ✏️ Edit
                                  </button>
                                  <button
                                    onClick={() => handleDeletePet(pet)}
                                    className="action-delete-btn"
                                    title="Delete pet from inventory"
                                  >
                                    🗑️
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    {renderPagination(filteredPets.length)}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Record Details Modal */}
      {selectedRecord && (
        <div className="admin-modal-overlay" onClick={closeDetailsModal}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>
                {modalType === "donation" && "📦 Donation Record"}
                {modalType === "volunteer" && "🙋 Volunteer Profile"}
                {modalType === "adoption" && "🐶 Adoption Application"}
                {modalType === "contact" && "💬 User Message"}
              </h3>
              <button
                className="modal-close-icon"
                onClick={closeDetailsModal}
                title="Close"
              >
                ✕
              </button>
            </div>

            <div className="admin-modal-body">
              {/* DONATION MODAL */}
              {modalType === "donation" && (
                <>
                  <div className="detail-row">
                    <span className="detail-label">Donor Name</span>
                    <span className="detail-value">{selectedRecord.donorName || "Anonymous"}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Email Address</span>
                    <a
                      href={`mailto:${selectedRecord.donorEmail}`}
                      className="detail-value detail-contact-link"
                    >
                      ✉️ {selectedRecord.donorEmail || "None"}
                    </a>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Contribution</span>
                    <span className="detail-value">
                      {selectedRecord.type === "money"
                        ? `💵 ₹${Number(selectedRecord.amount || 0).toLocaleString()} (Monetary Donation)`
                        : `📦 ${selectedRecord.item} (Quantity: ${selectedRecord.quantity || 1})`}
                    </span>
                  </div>
                  {selectedRecord.description && (
                    <div className="detail-row">
                      <span className="detail-label">Note / Specification</span>
                      <div className="detail-msg-box">{selectedRecord.description}</div>
                    </div>
                  )}
                  <div className="detail-row">
                    <span className="detail-label">Date Submitted</span>
                    <span className="detail-value">{formatDate(selectedRecord.createdAt)}</span>
                  </div>
                </>
              )}

              {/* VOLUNTEER MODAL */}
              {modalType === "volunteer" && (
                <>
                  <div className="detail-row">
                    <span className="detail-label">Volunteer Name</span>
                    <span className="detail-value">{selectedRecord.name}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Email Address</span>
                    <a
                      href={`mailto:${selectedRecord.email}`}
                      className="detail-value detail-contact-link"
                    >
                      ✉️ {selectedRecord.email}
                    </a>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Phone Number</span>
                    <a
                      href={`tel:${selectedRecord.phone}`}
                      className="detail-value detail-contact-link"
                    >
                      📞 {selectedRecord.phone}
                    </a>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Approval Status</span>
                    <select
                      value={selectedRecord.status || "pending"}
                      onChange={(e) => handleUpdateStatus("volunteers", selectedRecord._id, e.target.value)}
                      className="status-changer-select"
                      style={{ padding: "8px 12px", fontSize: "0.875rem" }}
                    >
                      <option value="pending">⏳ Pending</option>
                      <option value="accepted">✅ Accepted</option>
                      <option value="contacted">📞 Contacted</option>
                    </select>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Skills & Motivation</span>
                    <div className="detail-msg-box">{selectedRecord.message}</div>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Registered At</span>
                    <span className="detail-value">{formatDate(selectedRecord.createdAt)}</span>
                  </div>
                </>
              )}

              {/* ADOPTION MODAL */}
              {modalType === "adoption" && (
                <>
                  <div className="detail-row">
                    <span className="detail-label">Requested Pet</span>
                    <span className="detail-value" style={{ fontWeight: "700", color: "var(--brand-tomato)" }}>
                      🐾 {selectedRecord.petName}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Adopter Full Name</span>
                    <span className="detail-value">{selectedRecord.name}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Email Address</span>
                    <a
                      href={`mailto:${selectedRecord.email}`}
                      className="detail-value detail-contact-link"
                    >
                      ✉️ {selectedRecord.email}
                    </a>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Mobile Number</span>
                    <a
                      href={`tel:${selectedRecord.mobile}`}
                      className="detail-value detail-contact-link"
                    >
                      📞 {selectedRecord.mobile}
                    </a>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Application Status</span>
                    <select
                      value={selectedRecord.status || "pending"}
                      onChange={(e) => handleUpdateStatus("adoptions", selectedRecord._id, e.target.value)}
                      className="status-changer-select"
                      style={{ padding: "8px 12px", fontSize: "0.875rem" }}
                    >
                      <option value="pending">⏳ Pending</option>
                      <option value="reviewed">👀 Reviewed</option>
                      <option value="approved">✅ Approved</option>
                      <option value="rejected">❌ Rejected</option>
                    </select>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Date Submitted</span>
                    <span className="detail-value">{formatDate(selectedRecord.createdAt)}</span>
                  </div>
                </>
              )}

              {/* CONTACT MODAL */}
              {modalType === "contact" && (
                <>
                  <div className="detail-row">
                    <span className="detail-label">Sender Name</span>
                    <span className="detail-value">{selectedRecord.name}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Email Address</span>
                    <a
                      href={`mailto:${selectedRecord.email}`}
                      className="detail-value detail-contact-link"
                    >
                      ✉️ {selectedRecord.email}
                    </a>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Inquiry Status</span>
                    <select
                      value={selectedRecord.status || "unread"}
                      onChange={(e) => handleUpdateStatus("contacts", selectedRecord._id, e.target.value)}
                      className="status-changer-select"
                      style={{ padding: "8px 12px", fontSize: "0.875rem" }}
                    >
                      <option value="unread">📬 Unread</option>
                      <option value="read">📖 Read</option>
                      <option value="replied">✉️ Replied</option>
                    </select>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Message Content</span>
                    <div className="detail-msg-box">{selectedRecord.message}</div>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Received At</span>
                    <span className="detail-value">{formatDate(selectedRecord.createdAt)}</span>
                  </div>
                </>
              )}
            </div>

            <div className="admin-modal-footer">
              <a
                href={
                  modalType === "donation"
                    ? `mailto:${selectedRecord.donorEmail}`
                    : `mailto:${selectedRecord.email}`
                }
                className="action-link-btn"
                style={{ textDecoration: "none" }}
              >
                ✉️ Draft Email Reply
              </a>
              <button
                onClick={closeDetailsModal}
                className="action-link-btn"
                style={{ background: "var(--brand-dark)", color: "#ffffff", padding: "8px 18px", border: "none", cursor: "pointer" }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT PET MODAL */}
      {petModalOpen && (
        <div className="admin-modal-overlay" onClick={() => setPetModalOpen(false)}>
          <div className="admin-modal-card" style={{ maxWidth: "520px" }} onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>{editingPet ? `✏️ Edit Pet: ${editingPet.breed} (${editingPet.id})` : "🐾 Add New Animal to Catalog"}</h3>
              <button className="modal-close-icon" onClick={() => setPetModalOpen(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSavePet}>
              <div className="admin-modal-body" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", fontWeight: "700", marginBottom: "4px" }}>
                      Category / Type *
                    </label>
                    <select
                      value={petFormData.type}
                      onChange={(e) => setPetFormData({ ...petFormData, type: e.target.value, img: e.target.value === "Cat" ? "/cat1.jpg" : "/dog1.jpg" })}
                      style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                    >
                      <option value="Dog">🐕 Dog</option>
                      <option value="Cat">🐱 Cat</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", fontWeight: "700", marginBottom: "4px" }}>
                      Breed *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Golden Retriever, Labrador..."
                      value={petFormData.breed}
                      onChange={(e) => setPetFormData({ ...petFormData, breed: e.target.value, name: e.target.value })}
                      style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", boxSizing: "border-box" }}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", fontWeight: "700", marginBottom: "4px" }}>
                      Age *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 2 years, 6 months..."
                      value={petFormData.age}
                      onChange={(e) => setPetFormData({ ...petFormData, age: e.target.value })}
                      style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", boxSizing: "border-box" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", fontWeight: "700", marginBottom: "4px" }}>
                      Gender
                    </label>
                    <select
                      value={petFormData.gender}
                      onChange={(e) => setPetFormData({ ...petFormData, gender: e.target.value })}
                      style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", fontWeight: "700", marginBottom: "4px" }}>
                      Size
                    </label>
                    <select
                      value={petFormData.size}
                      onChange={(e) => setPetFormData({ ...petFormData, size: e.target.value })}
                      style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                    >
                      <option value="Small">Small</option>
                      <option value="Medium">Medium</option>
                      <option value="Large">Large</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", fontWeight: "700", marginBottom: "4px" }}>
                      Status
                    </label>
                    <select
                      value={petFormData.status}
                      onChange={(e) => setPetFormData({ ...petFormData, status: e.target.value })}
                      style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                    >
                      <option value="available">Available</option>
                      <option value="pending">Pending</option>
                      <option value="adopted">Adopted</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: "700", marginBottom: "4px" }}>
                    Image Path or URL
                  </label>
                  <input
                    type="text"
                    placeholder="/dog1.jpg or https://..."
                    value={petFormData.img}
                    onChange={(e) => setPetFormData({ ...petFormData, img: e.target.value })}
                    style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", boxSizing: "border-box" }}
                  />
                  <div style={{ display: "flex", gap: "6px", marginTop: "6px", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "0.7rem", color: "#64748b" }}>Quick presets:</span>
                    {(petFormData.type === "Dog" ? ["/dog1.jpg", "/dog2.jpg", "/dog3.jpg", "/dog4.jpg", "/dog5.jpg", "/dog6.jpg"] : ["/cat1.jpg", "/cat2.jpg", "/cat3.jpg", "/cat4.jpg", "/cat5.jpg"]).map((preset, pIdx) => (
                      <button
                        key={pIdx}
                        type="button"
                        onClick={() => setPetFormData({ ...petFormData, img: preset })}
                        style={{
                          fontSize: "0.68rem",
                          background: petFormData.img === preset ? "#ea580c" : "#f1f5f9",
                          color: petFormData.img === preset ? "#ffffff" : "#475569",
                          border: "none",
                          padding: "2px 6px",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        {preset.replace("/", "")}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: "700", marginBottom: "4px" }}>
                    Description / Bio
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Describe personality, favorite activities, temperament..."
                    value={petFormData.description}
                    onChange={(e) => setPetFormData({ ...petFormData, description: e.target.value })}
                    style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", boxSizing: "border-box" }}
                  />
                </div>
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  onClick={() => setPetModalOpen(false)}
                  style={{ background: "#f1f5f9", border: "1px solid #cbd5e1", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: "600" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ background: "#ea580c", color: "#ffffff", border: "none", padding: "8px 20px", borderRadius: "6px", cursor: "pointer", fontWeight: "700" }}
                >
                  {editingPet ? "Save Changes" : "Create Pet"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
