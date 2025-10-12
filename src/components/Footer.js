import React from "react";
import "../App.css";

const Footer = ({ ayar }) => {
  if (!ayar) return null;

  return (
    <footer className="footer" id="contact">
      <div className="footer-info">
        <div>
          <h4>Türkiye Office</h4>
          <p>{ayar.ofisTr}</p>
        </div>
        <div>
          <h4>Germany Office</h4>
          <p>{ayar.ofisDe}</p>
        </div>
      </div>

      <div className="footer-social">
        <h4>Social Media</h4>
        <div className="social-links">
          <a href={ayar.sosyalInstagram} target="_blank" rel="noreferrer">Instagram</a>
          <a href={ayar.sosyalX} target="_blank" rel="noreferrer">X</a>
          <a href={ayar.sosyalLinkedin} target="_blank" rel="noreferrer">LinkedIn</a>
        </div>
        <p>Email: {ayar.email}</p>
      </div>
    </footer>
  );
};

export default Footer;
