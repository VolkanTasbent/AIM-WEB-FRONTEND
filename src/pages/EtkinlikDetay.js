import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../App.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api";

const EtkinlikDetay = () => {
  const { id } = useParams();
  const [etkinlik, setEtkinlik] = useState(null);
  const navigate = useNavigate();

useEffect(() => {
  axios
    .get(`${API_URL}/etkinlikler/${id}`)
    .then((res) => {
      console.log("ETKİNLİK VERİ:", res.data); // 🟢 Burası kritik
      setEtkinlik(res.data);
    })
    .catch((err) => console.error("Etkinlik yüklenemedi:", err));
}, [id]);


  if (!etkinlik) {
    return (
      <div className="etkinlik-detay-loading">
        <p>Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="etkinlik-detay-container">
      {/* 🔹 Üstte Resim */}
      <div className="etkinlik-detay-header detay-header-gradient">

        <img
          src={etkinlik.resimUrl || "/assets/AIM-bg.png"}
          alt={etkinlik.baslik}
          className="etkinlik-detay-image"
          onError={(e) => (e.target.src = "/assets/AIM-bg.png")}
        />
      </div>

      {/* 🔹 İçerik */}
      <div className="etkinlik-detay-content">
        <h1>{etkinlik.baslik}</h1>
        {etkinlik.detay ? (
          <p className="etkinlik-detay-text">{etkinlik.detay}</p>
        ) : (
          <p className="etkinlik-detay-text">
            Bu etkinlik için detaylı açıklama henüz eklenmemiş.
          </p>
        )}

        <button className="geri-don-btn" onClick={() => navigate("/")}>
          ← Ana Sayfaya Dön
        </button>
      </div>
    </div>
  );
};

export default EtkinlikDetay;
