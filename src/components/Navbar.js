import React, { useEffect, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { NavLink } from "react-router-dom";
import "../App.css";
import aimLogo from "../assets/AIM-P-RGB.png"; // Logo

const Navbar = () => {
  const [menuAcik, setMenuAcik] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("nav-open", menuAcik);
    return () => document.body.classList.remove("nav-open");
  }, [menuAcik]);

  const kapat = () => setMenuAcik(false);

  return (
    <nav className="navbar">
      {/* 🔹 Sol tarafta AIM logosu */}
      <div className="nav-logo">
        <NavLink to="/" onClick={kapat}>
          <img src={aimLogo} alt="AIM" className="aim-logo" />
        </NavLink>
      </div>

      {/* 🔹 Mobil Menü Butonu */}
      <button
        type="button"
        className="mobile-menu-btn"
        aria-label={menuAcik ? "Menüyü kapat" : "Menüyü aç"}
        aria-expanded={menuAcik}
        onClick={() => setMenuAcik(!menuAcik)}
      >
        {menuAcik ? <FiX size={28} /> : <FiMenu size={28} />}
      </button>

      {menuAcik && (
        <button
          type="button"
          className="nav-backdrop"
          aria-label="Menüyü kapat"
          onClick={kapat}
        />
      )}

      {/* 🔹 Menü linkleri */}
      <div className={`nav-links ${menuAcik ? "acik" : ""}`}>
        <NavLink to="/" className="nav-item" onClick={kapat}>
          Home
        </NavLink>
        <NavLink to="/works" className="nav-item" onClick={kapat}>
          Works
        </NavLink>
        <NavLink to="/references" className="nav-item" onClick={kapat}>
          References
        </NavLink>
        <NavLink to="/contact" className="nav-item" onClick={kapat}>
          Contact
        </NavLink>
        <NavLink to="/ourcrew" className="nav-item" onClick={kapat}>
          Our Crew
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
