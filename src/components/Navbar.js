import React from "react";
import { NavLink } from "react-router-dom";
import "../App.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-links">
        <NavLink to="/" className="nav-item">
          Home
        </NavLink>
        <NavLink to="/works" className="nav-item">
          Works
        </NavLink>
        <NavLink to="/references" className="nav-item">
          References
        </NavLink>
        <NavLink to="/contact" className="nav-item">
          Contact
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
