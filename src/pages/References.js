import React from "react";
import { Link } from "react-router-dom";
import "../App.css";

const References = () => (
  <section className="content-page">
    <div className="content-page-inner">
      <h1>References</h1>
      <p className="content-page-lead">
        We collaborate with brands, publishers, and teams that care about craft, clarity,
        and measurable impact—from Istanbul to Berlin and beyond.
      </p>

      <ul className="content-page-list">
        <li>
          Long-term partnerships in influencer and creator campaigns, tuned to brand
          safety and audience fit.
        </li>
        <li>
          Media and production pipelines for launches, always-on social, and flagship
          events.
        </li>
        <li>
          Esports and gaming-native activations that respect community culture while
          delivering sponsor value.
        </li>
        <li>
          Cross-border coordination: local insight with international production standards.
        </li>
      </ul>

      <p className="content-page-lead" style={{ marginTop: "40px", marginBottom: 0 }}>
        Want to see how we could work together? Tell us about your goals—we&apos;ll map a
        clear path.
      </p>

      <div className="content-page-actions">
        <Link to="/contact" className="btn-primary">
          Get in touch
        </Link>
        <Link to="/works" className="btn-ghost">
          Explore works
        </Link>
      </div>
    </div>
  </section>
);

export default References;
