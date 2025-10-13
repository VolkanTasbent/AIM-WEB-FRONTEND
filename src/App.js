import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import EtkinlikDetay from "./pages/EtkinlikDetay";
import HaberDetay from "./pages/HaberDetay";
import ServisDetay from "./pages/ServisDetay";

function App() {
  return (
    <Router>
      <Routes>
        {/* 🌍 Kullanıcı anasayfası */}
        <Route path="/" element={<Home />} />

        {/* 🔒 Admin Panel Girişi */}
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* 🧠 Admin Dashboard */}
        <Route path="/admin" element={<AdminDashboard />} />

        {/* 🎉 Etkinlik, Haber, Servis detay sayfaları */}
        <Route path="/etkinlik/:id" element={<EtkinlikDetay />} />
        <Route path="/haber/:id" element={<HaberDetay />} />
        <Route path="/servis/:id" element={<ServisDetay />} />
      </Routes>
    </Router>
  );
}

export default App;
