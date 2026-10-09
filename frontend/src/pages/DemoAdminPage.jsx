import React, { useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
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
      description: "In memory of our beloved Beagle Bruno 🐾",
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

export default function DemoAdminPage() {
  const [token, setToken] = useState(localStorage.getItem("admin_demo_token") || "");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const [donationFilter, setDonationFilter] = useState("all");
  const [adoptionStatusFilter, setAdoptionStatusFilter] = useState("all");
  const [volunteerStatusFilter, setVolunteerStatusFilter] = useState("all");
  const [contactStatusFilter, setContactStatusFilter] = useState("all");

  const [selectedRecord, setSelectedRecord] = useState(null);
  const [modalType, setModalType] = useState("");
  const [successToast, setSuccessToast] = useState("");

  const [data, setData] = useState(() => {
    const stored = localStorage.getItem("demo_standalone_store");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return INITIAL_DEMO_DATA;
      }
    }
    return INITIAL_DEMO_DATA;
  });

  const showToast = (msg) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(""), 3500);
  };

  const handleLogin = (e) => {
    if (e) e.preventDefault();
    setToken("demo_sandbox_active_session");
    localStorage.setItem("admin_demo_token", "demo_sandbox_active_session");
    showToast("✨ Welcome to the Demo Sandbox!");
  };

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("admin_demo_token");
    setSelectedRecord(null);
  };

  const handleResetDemoData = () => {
    localStorage.removeItem("demo_standalone_store");
    setData(INITIAL_DEMO_DATA);
    showToast("Demo records reset to default sample dataset.");
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setDonationFilter("all");
    setAdoptionStatusFilter("all");
    setVolunteerStatusFilter("all");
    setContactStatusFilter("all");
    setSortBy("newest");
    showToast("Filters reset to default.");
  };

  const handleUpdateStatus = (type, id, newStatus) => {
    setData((prev) => {
      const next = {
        ...prev,
        [type]: prev[type].map((item) => (item._id === id ? { ...item, status: newStatus } : item)),
      };
      localStorage.setItem("demo_standalone_store", JSON.stringify(next));
      return next;
    });
    showToast(`[Demo] Status updated to: ${newStatus}`);
    if (selectedRecord && selectedRecord._id === id) {
      setSelectedRecord({ ...selectedRecord, status: newStatus });
    }
  };

  const handleDeleteRecord = (type, id) => {
    if (!window.confirm("Are you sure you want to delete this sample record?")) return;

    setData((prev) => {
      const next = {
        ...prev,
        [type]: prev[type].filter((item) => item._id !== id),
      };
      localStorage.setItem("demo_standalone_store", JSON.stringify(next));
      return next;
    });
    showToast("[Demo] Record deleted from sandbox.");
    if (selectedRecord && selectedRecord._id === id) {
      closeDetailsModal();
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

  const recentActivities = useMemo(() => {
    const list = [];
    (data.donations || []).forEach((d) => {
      list.push({
        type: "donation",
        title: d.type === "money" ? `Donation: ₹${Number(d.amount).toLocaleString()} from ${d.donorName}` : `Item Donation: ${d.item} from ${d.donorName}`,
        date: d.createdAt,
        raw: d,
        icon: "💰",
      });
    });
    (data.adoptions || []).forEach((a) => {
      list.push({
        type: "adoption",
        title: `Adoption Request: ${a.petName} by ${a.name}`,
        date: a.createdAt,
        raw: a,
        icon: "🐾",
      });
    });
    (data.volunteers || []).forEach((v) => {
      list.push({
        type: "volunteer",
        title: `Volunteer Registration: ${v.name}`,
        date: v.createdAt,
        raw: v,
        icon: "🙋",
      });
    });
    (data.contacts || []).forEach((c) => {
      list.push({
        type: "contact",
        title: `Contact Message from ${c.name}`,
        date: c.createdAt,
        raw: c,
        icon: "💬",
      });
    });

    return list
      .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
      .slice(0, 8);
  }, [data]);

  const petDemandMap = useMemo(() => {
    const map = {};
    (data.adoptions || []).forEach((a) => {
      const pName = (a.petName || "").toLowerCase();
      PLATFORM_PETS.forEach((pet) => {
        if (
          (pet.id && pName.includes(pet.id.toLowerCase())) ||
          (pet.breed && pName.includes(pet.breed.toLowerCase()))
        ) {
          map[pet.id] = (map[pet.id] || 0) + 1;
        }
      });
    });
    return map;
  }, [data.adoptions]);

  const applySort = useCallback((list, nameKey = "name") => {
    return [...list].sort((a, b) => {
      if (sortBy === "newest") return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      if (sortBy === "oldest") return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      if (sortBy === "name") return (a[nameKey] || "").localeCompare(b[nameKey] || "");
      if (sortBy === "amount") return (Number(b.amount) || 0) - (Number(a.amount) || 0);
      return 0;
    });
  }, [sortBy]);

  // Filtered lists
  const filteredDonations = useMemo(() => {
    const list = (data.donations || []).filter((item) => {
      if (donationFilter === "money" && item.type !== "money") return false;
      if (donationFilter === "item" && item.type !== "item") return false;
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
  }, [data.donations, searchQuery, donationFilter, applySort]);

  const filteredVolunteers = useMemo(() => {
    const list = (data.volunteers || []).filter((item) => {
      if (volunteerStatusFilter !== "all" && (item.status || "pending") !== volunteerStatusFilter) return false;
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
  }, [data.volunteers, searchQuery, volunteerStatusFilter, applySort]);

  const filteredAdoptions = useMemo(() => {
    const list = (data.adoptions || []).filter((item) => {
      if (adoptionStatusFilter !== "all" && (item.status || "pending") !== adoptionStatusFilter) return false;
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
  }, [data.adoptions, searchQuery, adoptionStatusFilter, applySort]);

  const filteredContacts = useMemo(() => {
    const list = (data.contacts || []).filter((item) => {
      if (contactStatusFilter !== "all" && (item.status || "unread") !== contactStatusFilter) return false;
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        item.name?.toLowerCase().includes(q) ||
        item.email?.toLowerCase().includes(q) ||
        item.message?.toLowerCase().includes(q)
      );
    });
    return applySort(list, "name");
  }, [data.contacts, searchQuery, contactStatusFilter, applySort]);

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

  const isFilterActive = useMemo(() => {
    if (searchQuery) return true;
    if (activeTab === "adoptions" && adoptionStatusFilter !== "all") return true;
    if (activeTab === "donations" && donationFilter !== "all") return true;
    if (activeTab === "volunteers" && volunteerStatusFilter !== "all") return true;
    if (activeTab === "contacts" && contactStatusFilter !== "all") return true;
    if (sortBy !== "newest") return true;
    return false;
  }, [searchQuery, activeTab, adoptionStatusFilter, donationFilter, volunteerStatusFilter, contactStatusFilter, sortBy]);

  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    let rows = [];

    if (activeTab === "donations") {
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
    link.setAttribute("download", `demo_sandbox_${activeTab}_report_${Date.now()}.csv`);
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
          <span>✨</span>
          <span>{successToast}</span>
        </div>
      )}

      {!token ? (
        /* Demo Sandbox Login Screen */
        <div className="admin-login-wrapper">
          <div className="admin-login-card demo-theme">
            <div className="login-top-badge badge-demo-top">
              ✨ Interactive Demo Sandbox
            </div>

            <h2>Demo Administrator</h2>
            <p>Explore the fully populated administrative workspace with sample datasets.</p>

            <form onSubmit={handleLogin} className="login-form">
              <div className="login-input-group">
                <label>Demo Email</label>
                <div className="login-input-wrapper">
                  <span className="login-input-icon">✉️</span>
                  <input
                    type="email"
                    className="login-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="login-input-group">
                <label>Demo Password</label>
                <div className="login-input-wrapper" style={{ position: "relative" }}>
                  <span className="login-input-icon">🔒</span>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="login-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ paddingRight: "42px" }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    title={showPassword ? "Hide password" : "Show password"}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    style={{
                      position: "absolute",
                      right: "12px",
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
                      transition: "color 0.2s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#ea580c")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#94a3b8")}
                  >
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="primary-login-btn demo-btn-theme"
              >
                Launch Demo Sandbox →
              </button>
            </form>

            <div className="login-footer-nav">
              Need real live production database access?{" "}
              <Link to="/admin">Go to Live Admin →</Link>
            </div>
          </div>
        </div>
      ) : (
        /* Demo Admin Sandbox Dashboard */
        <div className="dashboard-container">
          {/* Header Bar */}
          <header className="dashboard-header">
            <div className="header-branding">
              <div className="brand-icon-box" style={{ background: "var(--brand-gold-light)", color: "var(--brand-gold-dark)", border: "1px solid #ffe699" }}>✨</div>
              <div>
                <h1 className="brand-title">Demo Admin Sandbox</h1>
                <div className="brand-subtitle">
                  <span className="environment-pill pill-demo">✨ Sample Records Dataset</span>
                  <span>Sandbox mode active</span>
                </div>
              </div>
            </div>

            <div className="header-actions">
              <Link
                to="/admin"
                className="header-action-btn"
                style={{ textDecoration: "none", color: "var(--brand-tomato-dark)", background: "var(--brand-tomato-light)", borderColor: "#ffdcd6", fontWeight: "700" }}
                title="Switch to Real Live Admin"
              >
                🟢 Switch to Live Admin
              </Link>

              <button
                onClick={handleResetDemoData}
                className="header-action-btn"
                title="Reset sample records to default"
              >
                ↺ Reset Demo Data
              </button>

              <button
                onClick={handleLogout}
                className="logout-action-btn"
                title="Exit Demo Sandbox"
              >
                Exit Demo
              </button>
            </div>
          </header>

          {/* KPI Stat Cards Grid */}
          <section className="kpi-grid">
            <div
              className={`kpi-card ${activeTab === "overview" ? "active-kpi" : ""}`}
              onClick={() => { setActiveTab("overview"); setSearchQuery(""); }}
            >
              <div className="kpi-info">
                <h4>System Overview</h4>
                <div className="kpi-value">📊 Hub</div>
                <div className="kpi-subtext">
                  <span>{(data.adoptions?.length || 0) + (data.donations?.length || 0) + (data.volunteers?.length || 0) + (data.contacts?.length || 0)} Sample records</span>
                </div>
              </div>
              <div className="kpi-icon-pill kpi-icon-gold">📈</div>
            </div>

            <div
              className={`kpi-card ${activeTab === "donations" ? "active-kpi" : ""}`}
              onClick={() => { setActiveTab("donations"); setSearchQuery(""); }}
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
              onClick={() => { setActiveTab("adoptions"); setSearchQuery(""); }}
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
              onClick={() => { setActiveTab("volunteers"); setSearchQuery(""); }}
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
              onClick={() => { setActiveTab("contacts"); setSearchQuery(""); }}
            >
              <div className="kpi-info">
                <h4>Inquiries</h4>
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
                  onClick={() => { setActiveTab("overview"); setSearchQuery(""); }}
                >
                  <span>📊 Executive Overview</span>
                </button>
                <button
                  className={`tab-btn ${activeTab === "adoptions" ? "active-tab" : ""}`}
                  onClick={() => { setActiveTab("adoptions"); setSearchQuery(""); }}
                >
                  <span>🐶 Adoptions</span>
                  <span className="tab-count-badge">{data.adoptions?.length || 0}</span>
                </button>
                <button
                  className={`tab-btn ${activeTab === "donations" ? "active-tab" : ""}`}
                  onClick={() => { setActiveTab("donations"); setSearchQuery(""); }}
                >
                  <span>💰 Donations</span>
                  <span className="tab-count-badge">{data.donations?.length || 0}</span>
                </button>
                <button
                  className={`tab-btn ${activeTab === "volunteers" ? "active-tab" : ""}`}
                  onClick={() => { setActiveTab("volunteers"); setSearchQuery(""); }}
                >
                  <span>🙋 Volunteers</span>
                  <span className="tab-count-badge">{data.volunteers?.length || 0}</span>
                </button>
                <button
                  className={`tab-btn ${activeTab === "contacts" ? "active-tab" : ""}`}
                  onClick={() => { setActiveTab("contacts"); setSearchQuery(""); }}
                >
                  <span>💬 Messages</span>
                  <span className="tab-count-badge">{data.contacts?.length || 0}</span>
                </button>
                <button
                  className={`tab-btn ${activeTab === "catalog" ? "active-tab" : ""}`}
                  onClick={() => { setActiveTab("catalog"); setSearchQuery(""); }}
                >
                  <span>🐾 Pet Catalog</span>
                </button>
              </div>
            </div>

            {/* Level 2: Command Toolbar */}
            {activeTab !== "overview" && activeTab !== "catalog" && (
              <div className="dashboard-command-bar">
                <div className="command-bar-row">
                  {/* Segmented Filter Chips */}
                  <div className="filter-chips-strip">
                    <span className="filter-chip-label">Filter:</span>

                    {activeTab === "adoptions" && (
                      <>
                        <button
                          className={`filter-chip-btn ${adoptionStatusFilter === "all" ? "active" : ""}`}
                          onClick={() => setAdoptionStatusFilter("all")}
                        >
                          <span>All</span>
                          <span className="filter-chip-badge">{adoptionCounts.total}</span>
                        </button>
                        <button
                          className={`filter-chip-btn ${adoptionStatusFilter === "pending" ? "active" : ""}`}
                          onClick={() => setAdoptionStatusFilter("pending")}
                        >
                          <span>⏳ Pending</span>
                          <span className="filter-chip-badge">{adoptionCounts.pending}</span>
                        </button>
                        <button
                          className={`filter-chip-btn ${adoptionStatusFilter === "reviewed" ? "active" : ""}`}
                          onClick={() => setAdoptionStatusFilter("reviewed")}
                        >
                          <span>👀 Reviewed</span>
                          <span className="filter-chip-badge">{adoptionCounts.reviewed}</span>
                        </button>
                        <button
                          className={`filter-chip-btn ${adoptionStatusFilter === "approved" ? "active" : ""}`}
                          onClick={() => setAdoptionStatusFilter("approved")}
                        >
                          <span>✅ Approved</span>
                          <span className="filter-chip-badge">{adoptionCounts.approved}</span>
                        </button>
                        <button
                          className={`filter-chip-btn ${adoptionStatusFilter === "rejected" ? "active" : ""}`}
                          onClick={() => setAdoptionStatusFilter("rejected")}
                        >
                          <span>❌ Rejected</span>
                          <span className="filter-chip-badge">{adoptionCounts.rejected}</span>
                        </button>
                      </>
                    )}

                    {activeTab === "donations" && (
                      <>
                        <button
                          className={`filter-chip-btn ${donationFilter === "all" ? "active" : ""}`}
                          onClick={() => setDonationFilter("all")}
                        >
                          <span>All Contributions</span>
                          <span className="filter-chip-badge">{donationCounts.total}</span>
                        </button>
                        <button
                          className={`filter-chip-btn ${donationFilter === "money" ? "active" : ""}`}
                          onClick={() => setDonationFilter("money")}
                        >
                          <span>💵 Monetary (₹)</span>
                          <span className="filter-chip-badge">{donationCounts.money}</span>
                        </button>
                        <button
                          className={`filter-chip-btn ${donationFilter === "item" ? "active" : ""}`}
                          onClick={() => setDonationFilter("item")}
                        >
                          <span>📦 Pet Supplies</span>
                          <span className="filter-chip-badge">{donationCounts.item}</span>
                        </button>
                      </>
                    )}

                    {activeTab === "volunteers" && (
                      <>
                        <button
                          className={`filter-chip-btn ${volunteerStatusFilter === "all" ? "active" : ""}`}
                          onClick={() => setVolunteerStatusFilter("all")}
                        >
                          <span>All Volunteers</span>
                          <span className="filter-chip-badge">{volunteerCounts.total}</span>
                        </button>
                        <button
                          className={`filter-chip-btn ${volunteerStatusFilter === "pending" ? "active" : ""}`}
                          onClick={() => setVolunteerStatusFilter("pending")}
                        >
                          <span>⏳ Pending</span>
                          <span className="filter-chip-badge">{volunteerCounts.pending}</span>
                        </button>
                        <button
                          className={`filter-chip-btn ${volunteerStatusFilter === "accepted" ? "active" : ""}`}
                          onClick={() => setVolunteerStatusFilter("accepted")}
                        >
                          <span>✅ Accepted</span>
                          <span className="filter-chip-badge">{volunteerCounts.accepted}</span>
                        </button>
                        <button
                          className={`filter-chip-btn ${volunteerStatusFilter === "contacted" ? "active" : ""}`}
                          onClick={() => setVolunteerStatusFilter("contacted")}
                        >
                          <span>📞 Contacted</span>
                          <span className="filter-chip-badge">{volunteerCounts.contacted}</span>
                        </button>
                      </>
                    )}

                    {activeTab === "contacts" && (
                      <>
                        <button
                          className={`filter-chip-btn ${contactStatusFilter === "all" ? "active" : ""}`}
                          onClick={() => setContactStatusFilter("all")}
                        >
                          <span>All Messages</span>
                          <span className="filter-chip-badge">{contactCounts.total}</span>
                        </button>
                        <button
                          className={`filter-chip-btn ${contactStatusFilter === "unread" ? "active" : ""}`}
                          onClick={() => setContactStatusFilter("unread")}
                        >
                          <span>📬 Unread</span>
                          <span className="filter-chip-badge">{contactCounts.unread}</span>
                        </button>
                        <button
                          className={`filter-chip-btn ${contactStatusFilter === "read" ? "active" : ""}`}
                          onClick={() => setContactStatusFilter("read")}
                        >
                          <span>📖 Read</span>
                          <span className="filter-chip-badge">{contactCounts.read}</span>
                        </button>
                        <button
                          className={`filter-chip-btn ${contactStatusFilter === "replied" ? "active" : ""}`}
                          onClick={() => setContactStatusFilter("replied")}
                        >
                          <span>✉️ Replied</span>
                          <span className="filter-chip-badge">{contactCounts.replied}</span>
                        </button>
                      </>
                    )}
                  </div>

                  {/* Search & Sort Tools */}
                  <div className="search-and-tools">
                    <div className="pro-search-box">
                      <span className="pro-search-icon">🔍</span>
                      <input
                        type="text"
                        className="pro-search-input"
                        placeholder={`Search ${activeTab}...`}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
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

                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="sort-select"
                      title="Sort records"
                    >
                      <option value="newest">📅 Newest First</option>
                      <option value="oldest">📅 Oldest First</option>
                      <option value="name">🔤 Name (A - Z)</option>
                      {activeTab === "donations" && <option value="amount">💰 Amount (High to Low)</option>}
                    </select>

                    <button
                      onClick={handleExportCSV}
                      className="export-btn"
                      title="Export filtered records to CSV"
                    >
                      📥 Export CSV
                    </button>
                  </div>
                </div>

                {isFilterActive && (
                  <div className="active-filters-info-bar">
                    <div>
                      <span>Showing </span>
                      <strong>
                        {activeTab === "adoptions" && filteredAdoptions.length}
                        {activeTab === "donations" && filteredDonations.length}
                        {activeTab === "volunteers" && filteredVolunteers.length}
                        {activeTab === "contacts" && filteredContacts.length}
                      </strong>
                      <span> of </span>
                      <strong>
                        {activeTab === "adoptions" && data.adoptions?.length}
                        {activeTab === "donations" && data.donations?.length}
                        {activeTab === "volunteers" && data.volunteers?.length}
                        {activeTab === "contacts" && data.contacts?.length}
                      </strong>
                      <span> demo records</span>
                      {searchQuery && <span> • Matching "<em>{searchQuery}</em>"</span>}
                    </div>

                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="reset-all-filters-btn"
                    >
                      Reset All Filters
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB VIEWS */}

            {/* 1. EXECUTIVE OVERVIEW TAB */}
            {activeTab === "overview" && (
              <div className="overview-dashboard-grid">
                <div className="overview-banner-card">
                  <div className="overview-banner-text">
                    <h3>✨ Interactive Sandbox Dashboard</h3>
                    <p>
                      Pre-populated with dummy records so you can test and demonstrate the administrative workflows without altering real database collections.
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

                <div className="overview-sections-row">
                  {/* Left: Activity Stream */}
                  <div className="overview-subcard">
                    <div className="overview-subcard-header">
                      <h4>⚡ Activity Stream</h4>
                      <span style={{ fontSize: "0.775rem", color: "#64748b" }}>Demo Feed</span>
                    </div>

                    {recentActivities.length === 0 ? (
                      <div style={{ textAlign: "center", padding: "26px 0", color: "#94a3b8" }}>
                        No records in sandbox. Click "↺ Reset Demo Data" to restore.
                      </div>
                    ) : (
                      <div className="activity-feed-list">
                        {recentActivities.map((act, i) => (
                          <div key={i} className="activity-item">
                            <div className="activity-icon">{act.icon}</div>
                            <div className="activity-content">
                              <div className="activity-title">{act.title}</div>
                              <div className="activity-time">{formatDate(act.date)}</div>
                            </div>
                            <button
                              onClick={() => openDetailsModal(act.raw, act.type)}
                              className="action-link-btn"
                              style={{ padding: "4px 8px", fontSize: "0.725rem" }}
                            >
                              View
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right: Pet Demand */}
                  <div className="overview-subcard">
                    <div className="overview-subcard-header">
                      <h4>🔥 Shelter Pet Demand</h4>
                      <button
                        onClick={() => setActiveTab("catalog")}
                        className="action-link-btn"
                        style={{ fontSize: "0.725rem" }}
                      >
                        All Pets →
                      </button>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {PLATFORM_PETS.slice(0, 5).map((pet, idx) => {
                        const count = petDemandMap[pet.id] || 0;
                        return (
                          <div
                            key={idx}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              padding: "8px 12px",
                              background: "#f8fafc",
                              borderRadius: "8px",
                              border: "1px solid #e2e8f0",
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                              <img
                                src={pet.img}
                                alt={pet.breed}
                                style={{ width: "36px", height: "36px", borderRadius: "6px", objectFit: "cover" }}
                              />
                              <div>
                                <strong style={{ color: "var(--brand-dark)", fontSize: "0.85rem" }}>{pet.breed}</strong>
                                <div style={{ fontSize: "0.75rem", color: "var(--brand-muted)" }}>{pet.id} • {pet.age}</div>
                              </div>
                            </div>
                            <span
                              style={{
                                background: count > 0 ? "var(--brand-gold-light)" : "var(--brand-border-light)",
                                color: count > 0 ? "var(--brand-gold-dark)" : "var(--brand-muted)",
                                fontWeight: "700",
                                fontSize: "0.75rem",
                                padding: "3px 8px",
                                borderRadius: "9999px",
                              }}
                            >
                              {count} {count === 1 ? "Inquiry" : "Inquiries"}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
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
                      {searchQuery || adoptionStatusFilter !== "all"
                        ? "No adoption applications match your filter or search query."
                        : "Click '↺ Reset Demo Data' in the header to reload sample records."}
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
                      {filteredAdoptions.map((item, idx) => (
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
                      {searchQuery || donationFilter !== "all"
                        ? "No donation entries match your search or filter."
                        : "Click '↺ Reset Demo Data' to reload sample donations."}
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
                      {filteredDonations.map((item, idx) => (
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
                      {searchQuery || volunteerStatusFilter !== "all"
                        ? "No volunteer applications matched your query."
                        : "Click '↺ Reset Demo Data' to reload sample volunteers."}
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
                      {filteredVolunteers.map((item, idx) => (
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
                      {searchQuery || contactStatusFilter !== "all"
                        ? "No contact submissions matched your query."
                        : "Click '↺ Reset Demo Data' to reload sample inquiries."}
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
                      {filteredContacts.map((item, idx) => (
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
                )}
              </div>
            )}

            {/* 6. PET CATALOG INVENTORY TAB */}
            {activeTab === "catalog" && (
              <div className="admin-pet-grid">
                {PLATFORM_PETS.map((pet, idx) => {
                  const inquiryCount = petDemandMap[pet.id] || 0;
                  return (
                    <div key={idx} className="admin-pet-card">
                      <img src={pet.img} alt={pet.breed} className="admin-pet-img" />
                      <div className="admin-pet-info">
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "6px" }}>
                          <div className="admin-pet-name">{pet.breed}</div>
                          <span className="pet-id-tag" style={{ margin: 0 }}>{pet.id}</span>
                        </div>
                        <div className="admin-pet-meta">
                          {pet.age} • {pet.type}
                        </div>
                        <div className="admin-pet-demand">
                          <span>🐾 {inquiryCount} Adoption {inquiryCount === 1 ? "Inquiry" : "Inquiries"}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
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
                style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px" }}
              >
                ✉️ Draft Email Reply
              </a>

              <button
                onClick={closeDetailsModal}
                className="action-link-btn"
                style={{ background: "var(--brand-dark)", color: "#ffffff", padding: "8px 18px", border: "none" }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
