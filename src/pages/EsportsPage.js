import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../App.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api";

const EsportsPage = () => {
  const [players, setPlayers] = useState([]);
  const navigate = useNavigate();

  // Yedek resim path'i
  const yedekResim = process.env.PUBLIC_URL + "/assets/default-player.jpg";

  useEffect(() => {
    axios
      .get(`${API_URL}/esports`)
      .then((res) => setPlayers(res.data))
      .catch((err) => console.error("Oyuncular yüklenemedi:", err));
  }, []);

  return (
    <div className="esports-page">
      <div className="esports-header">
        <h1>Espor Oyuncuları</h1>
        <p>Takımlarımızdaki profesyonel oyuncuları tanıyın</p>
      </div>

      <div className="esports-grid">
        {players.map((player) => (
          <div
            key={player.id}
            className="esports-card"
            onClick={() => navigate(`/esports/${player.id}`)}
          >
            <img
              src={player.resimUrl || yedekResim}
              alt={player.adSoyad}
              onError={(e) => (e.target.src = yedekResim)}
            />
            <div className="esports-card-content">
              <button className="read-more">Read More</button>
              <p className="team-role">{player.unvan || player.takim}</p>
              <h2 className="player-name">{player.adSoyad}</h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EsportsPage;