import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import DonatePage from "./pages/DonatePage";
import VolunteerPage from "./pages/VolunteerPage";
import MoreDogsPage from "./pages/MoreDogsPage";
import MoreCatsPage from "./pages/MoreCatsPage";
import AdminPage from "./pages/AdminPage";
import DemoAdminPage from "./pages/DemoAdminPage";

function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace("#", "");
      const timer = setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
      return () => clearTimeout(timer);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [pathname, hash]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollManager />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/donate" element={<DonatePage />} />
          <Route path="/volunteer" element={<VolunteerPage />} />
          <Route path="/more-dogs" element={<MoreDogsPage />} />
          <Route path="/more-cats" element={<MoreCatsPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/demo-admin" element={<DemoAdminPage />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}
