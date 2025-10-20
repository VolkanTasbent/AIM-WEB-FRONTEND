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
  <div className="esports-card">
    <button className="geri-btn" onClick={() => navigate("/esports")}>
  <FaChevronLeft />
</button>  {/* ✅ Artık resmin üstünde */}
    <img
      src={player.resimUrl || "/assets/default-player.jpg"}
      alt={player.adSoyad}
    />
    <div className="esports-card-content">
      {!showDetails ? (
        <>
          <button
            className="read-more"
            onClick={() => setShowDetails(true)}
          >
            Read More
          </button>
          <p className="team-role">
            {player.takim?.toUpperCase()} | {player.unvan}
          </p>
          <h1 className="player-name">{player.adSoyad}</h1>
        </>
      ) : (
        <>
          <h2>About</h2>
          <p>{player.aciklama}</p>
        </>
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
          <h2>TEAMS</h2>
          <p>{player.detay}</p>
        </div>
      </div>
    </div>
  );
};

export default EsportsDetailPage;
