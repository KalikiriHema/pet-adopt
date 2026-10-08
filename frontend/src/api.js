const API_BASE_URL =
  window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:5000"
    : "https://pet-adopt-1-ausg.onrender.com";

export default API_BASE_URL;
