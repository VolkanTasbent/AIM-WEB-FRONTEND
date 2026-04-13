import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCrew } from "../services/ApiService";
import CrewCard from "../components/CrewCard";
import "../App.css";

const OurCrew = () => {
  const [crewList, setCrewList] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    getCrew()
      .then((res) => setCrewList(res.data))
      .catch((err) => console.error("Crew yüklenemedi:", err));
  }, []);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section className="ourcrew-section">
      <h1 className="ourcrew-title">Our Crew</h1>

      {crewList.length === 0 ? (
        <div className="crew-empty">
          <p>
            Crew profiles are loading or not published yet. Check back soon, or get in
            touch—we&apos;d love to hear from you.
          </p>
          <Link to="/contact">Contact us</Link>
        </div>
      ) : (
        <div className="crew-grid">
          {crewList.map((crew) => (
            <CrewCard
              key={crew.id}
              crew={crew}
              expanded={expandedId === crew.id}
              onToggle={() => toggleExpand(crew.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default OurCrew;
