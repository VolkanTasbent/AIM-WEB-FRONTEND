import React from "react";
import { Link } from "react-router-dom";
import "../App.css";

const Contact = () => (
  <section className="content-page">
    <div className="content-page-inner">
      <h1>Contact</h1>
      <p className="content-page-lead">
        Whether you&apos;re planning a campaign, a production, or an esports
        collaboration, we&apos;re happy to hear from you. Reach out through the channels
        below or visit our offices.
      </p>

      <div className="contact-offices">
        <div className="contact-office">
          <h3>Türkiye Office</h3>
          <p>
            İstiklal C. No:45, 34000
            <br />
            İstanbul, Beyoğlu
          </p>
        </div>
        <div className="contact-office">
          <h3>Germany Office</h3>
          <p>
            Kurfürstendamm N.32, 10716
            <br />
            Berlin, Kurfürstendamm
          </p>
        </div>
      </div>

      <p className="content-page-lead" style={{ marginTop: "40px", marginBottom: "12px" }}>
        Social
      </p>
      <p style={{ color: "#aaa", margin: "0 0 8px" }}>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#ffcc00", textDecoration: "none" }}
        >
          Instagram
        </a>
        {" · "}
        <a
          href="https://x.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#ffcc00", textDecoration: "none" }}
        >
          X (Twitter)
        </a>
        {" · "}
        <a
          href="https://linkedin.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#ffcc00", textDecoration: "none" }}
        >
          LinkedIn
        </a>
      </p>

      <div className="content-page-actions">
        <Link to="/" className="btn-ghost">
          Home
        </Link>
        <Link to="/works" className="btn-primary">
          View works
        </Link>
      </div>
    </div>
  </section>
);

export default Contact;
