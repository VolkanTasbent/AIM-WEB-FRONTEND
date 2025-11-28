import React, { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { NavLink } from "react-router-dom";
import "../App.css";
import aimLogo from "../assets/AIM-P-RGB.png"; // Logo

const Navbar = () => {
  const [menuAcik, setMenuAcik] = useState(false);

  return (
    <nav className="navbar">
      {/* 🔹 Sol tarafta AIM logosu */}
      <div className="nav-logo">
        <NavLink to="/" onClick={() => setMenuAcik(false)}>
          <img src={aimLogo} alt="AIM" className="aim-logo" />
        </NavLink>
      </div>

      {/* 🔹 Mobil Menü Butonu */}
      <button
        className="mobile-menu-btn"
        onClick={() => setMenuAcik(!menuAcik)}
      >
        {menuAcik ? <FiX size={28} /> : <FiMenu size={28} />}
      </button>

      {/* 🔹 Menü linkleri */}
      <div className={`nav-links ${menuAcik ? "acik" : ""}`}>
        <NavLink to="/" className="nav-item" onClick={() => setMenuAcik(false)}>
          Home
        </NavLink>
        <NavLink to="/works" className="nav-item" onClick={() => setMenuAcik(false)}>
          Works
        </NavLink>
        <NavLink to="/references" className="nav-item" onClick={() => setMenuAcik(false)}>
          References
        </NavLink>
        <NavLink to="/contact" className="nav-item" onClick={() => setMenuAcik(false)}>
          Contact
        </NavLink>
        <NavLink to="/ourcrew" className="nav-item" onClick={() => setMenuAcik(false)}>
          Our Crew
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
