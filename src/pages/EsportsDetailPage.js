import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../App.css";
import { FaChevronLeft } from "react-icons/fa";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api";

const EsportsDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [player, setPlayer] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    axios
      .get(`${API_URL}/esports/${id}`)
      .then((res) => setPlayer(res.data))
      .catch((err) => console.error("Oyuncu yüklenemedi:", err));
    window.scrollTo(0, 0);
  }, [id]);

  if (!player) return <p>Yükleniyor...</p>;

  return (
    <div className="esports-detail-container">
      {/* 🔹 Sol Kart */}
      <div className="esports-detail-left">
        <div className="esports-detail-card">
          {/* 🔙 Geri Butonu */}
          <button className="geri-btn" onClick={() => navigate("/esports")}>
            <FaChevronLeft />
          </button>

          <img
            src={player.resimUrl || "/assets/default-player.jpg"}
            alt={player.adSoyad}
            className="esports-detail-image"
          />

          <div className="esports-detail-overlay">
            {!showDetails ? (
              <>
                <button
                  className="esports-read-btn"
                  onClick={() => setShowDetails(true)}
                >
                  Read More
                </button>
                <div className="esports-detail-info">
                  <p className="esports-team">
                    {player.takim?.toUpperCase()} | {player.unvan}
                  </p>
                  <h1 className="esports-name">{player.adSoyad}</h1>
                </div>
              </>
            ) : (
              <div className="esports-expanded-info">
                <h2>About</h2>
                <p>{player.aciklama}</p>
                <button
                  className="esports-read-btn"
                  onClick={() => setShowDetails(false)}
                >
                  Show Less
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 🔹 Sağ Taraf */}
      <div className="esports-detail-right">
        <div
          className="esports-achievements"
          style={{
            background: `linear-gradient(
              135deg,
              rgba(255, 0, 0, 0.35) 0%,
              rgba(255, 0, 0, 0.25) 30%,
              rgba(255, 0, 0, 0.1) 60%,
              rgba(255, 0, 0, 0.05) 100%
            ), url(${player.achievementsBgUrl || player.resimUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <h2>ACHIEVEMENTS</h2>
          <ul>
            {player.basarilar?.split("\n").map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        </div>

        <div
          className="esports-teams"
          style={{
            background: `linear-gradient(
              135deg,
              rgba(0, 0, 0, 0.7) 0%,
              rgba(0, 0, 0, 0.4) 50%,
              rgba(0, 0, 0, 0.2) 80%,
              rgba(0, 0, 0, 0.1) 100%
            ), url(${player.teamsBgUrl || player.resimUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <h2>TEAMS
            
          </h2>
          {player.teamLogos && (
  <div className="team-logos">
    {(() => {
      try {
        return JSON.parse(player.teamLogos).map((logo, i) => (
          <img key={i} src={logo} alt={`team-logo-${i}`} className="team-logo" />
        ));
      } catch (e) {
        console.error("Logo JSON parse hatası:", e);
        return <p>Logo yüklenemedi</p>;
      }
    })()}
  </div>
)}

          <p>{player.detay}</p>
        </div>
      </div>
    </div>
  );
};

export default EsportsDetailPage;
