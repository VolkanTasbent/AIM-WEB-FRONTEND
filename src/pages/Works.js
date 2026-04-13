import React from "react";
import { Link } from "react-router-dom";
import "../App.css";

const Works = () => (
  <section className="content-page">
    <div className="content-page-inner">
      <h1>Works</h1>
      <p className="content-page-lead">
        Campaigns, content, and experiences across influencer marketing, media production,
        and esports. Explore the areas where AIM Agency builds visibility and culture for
        brands.
      </p>

      <div className="content-page-grid">
        <Link to="/services/media" className="content-page-card">
          <h2>Media &amp; production</h2>
          <p>
            Video, shoots, and portfolio work—visual storytelling crafted for digital and
            live audiences.
          </p>
          <span className="content-page-card-cta">View media →</span>
        </Link>
        <Link to="/esports" className="content-page-card">
          <h2>Esports</h2>
          <p>
            Talent, events, and brand moments in competitive gaming and creator-led
            communities.
          </p>
          <span className="content-page-card-cta">View esports →</span>
        </Link>
        <Link to="/services/influencers" className="content-page-card">
          <h2>Influencers</h2>
          <p>
            Strategic partnerships with creators who align with your brand and reach the
            right audiences.
          </p>
          <span className="content-page-card-cta">View influencers →</span>
        </Link>
      </div>

      <div className="content-page-actions">
        <Link to="/" className="btn-primary">
          Back to Home
        </Link>
        <Link to="/contact" className="btn-ghost">
          Start a project
        </Link>
      </div>
    </div>
  </section>
);

export default Works;
