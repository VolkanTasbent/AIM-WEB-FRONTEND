import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const CrewCard = ({ crew, expanded, onToggle }) => {
  return (
    <div className={`crew-card ${expanded ? "expanded" : ""}`}>
      <div className="crew-image">
        <img
          src={crew.resimUrl || "/assets/default-user.jpg"}
          alt={crew.adSoyad}
          loading="lazy"
        />
      </div>

      <div className="crew-info">
        <h3>{crew.adSoyad}</h3>
        <p>{crew.unvan}</p>
        <button onClick={onToggle}>
          {expanded ? "▲ Kapat" : "Read More"}
        </button>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            className="crew-details"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {crew.diller && (
              <p className="crew-languages">
                <b>Languages:</b> {crew.diller}
              </p>
            )}

            {crew.detay && (
              <p className="crew-description">{crew.detay}</p>
            )}

            <div className="crew-socials">
              <p><b>Social Media</b></p>
              <div className="icons">
                {crew.instagram && (
                  <a href={crew.instagram} target="_blank" rel="noreferrer">
                    <i className="fab fa-instagram"></i>
                  </a>
                )}
                {crew.linkedin && (
                  <a href={crew.linkedin} target="_blank" rel="noreferrer">
                    <i className="fab fa-linkedin"></i>
                  </a>
                )}
                {crew.youtube && (
                  <a href={crew.youtube} target="_blank" rel="noreferrer">
                    <i className="fab fa-youtube"></i>
                  </a>
                )}
                {crew.tiktok && (
                  <a href={crew.tiktok} target="_blank" rel="noreferrer">
                    <i className="fab fa-tiktok"></i>
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CrewCard;
