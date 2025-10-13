import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import EtkinlikDetay from "./pages/EtkinlikDetay";
import HaberDetay from "./pages/HaberDetay";
import ServisDetay from "./pages/ServisDetay";
import Works from "./pages/Works";
import References from "./pages/References";
import Contact from "./pages/Contact";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* 🔹 Üst Menü */}
        <Navbar />

        <main>
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

            {/* 💼 Boş sayfalar (ileride doldurulacak) */}
            <Route path="/works" element={<Works />} />
            <Route path="/references" element={<References />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>

        {/* 🔹 Alt Bilgi (Footer) */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
