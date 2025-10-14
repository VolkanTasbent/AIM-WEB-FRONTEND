import React from "react";
import { Link } from "react-router-dom";
import { FaInstagram, FaXTwitter, FaLinkedin } from "react-icons/fa6";
import { FaMapMarkerAlt } from "react-icons/fa"; // 🔹 FA5'ten geliyor
import "../App.css";
import aimLogo from "../assets/aim-logo.png"; // kendi logonu buraya koy

const Footer = () => {
  return (
    <footer className="custom-footer">
      <div className="footer-container">
        {/* Sol kısım - Ofisler */}
        <div className="footer-column">
          <h4>🇹🇷 Türkiye Office</h4>
          <p>
            <FaMapMarkerAlt className="footer-icon" /> İstiklal C. No:45, 34000 <br />
            İstanbul, Beyoğlu
          </p>

          <h4>🇩🇪 Germany Office</h4>
          <p>
            <FaMapMarkerAlt className="footer-icon" /> Kurfürstendamm N.32, 10716 <br />
            Berlin, Kurfürstendamm
          </p>
        </div>

        {/* Orta kısım - Logo + Sosyal Medya */}
        <div className="footer-center">
          <img src={aimLogo} alt="AIM Logo" className="footer-logo" />
          <h4>Social Media</h4>
          <div className="footer-social">
            <a href="https://instagram.com" target="_blank" rel="noreferrer">
              <FaInstagram />
            </a>
            <a href="https://x.com" target="_blank" rel="noreferrer">
              <FaXTwitter />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer">
              <FaLinkedin />
            </a>
          </div>
        </div>

        {/* Sağ kısım - Sayfalar */}
        <div className="footer-column footer-links">
          <Link to="/">Home</Link>
          <Link to="/works">Works</Link>
          <Link to="/references">References</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/ourcrew">Our Crew</Link>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 AIM Agency. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
