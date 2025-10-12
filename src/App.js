import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin"; // (isteğe bağlı giriş ekranı)

function App() {
  return (
    <Router>
      <Routes>
        {/* 🌍 Kullanıcı anasayfası */}
        <Route path="/" element={<Home />} />

        {/* 🔒 Admin Panel Girişi (isteğe bağlı) */}
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* 🧠 Admin Dashboard */}
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
