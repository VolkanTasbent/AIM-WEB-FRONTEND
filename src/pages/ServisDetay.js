import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../App.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api";

const ServisDetay = () => {
  const { id } = useParams();
  const [servis, setServis] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${API_URL}/servisler/${id}`)
      .then((res) => setServis(res.data))
      .catch((err) => console.error("Servis yüklenemedi:", err));
  }, [id]);

  if (!servis) {
    return (
      <div className="servis-detay-loading">
        <p>Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="servis-detay-container">
      {/* 🔹 Üstte Resim */}
      <div className="servis-detay-header">
        <img
          src={servis.resimUrl || "/assets/AIM-bg.png"}
          alt={servis.baslik}
          className="servis-detay-image"
          onError={(e) => (e.target.src = "/assets/AIM-bg.png")}
        />
      </div>

      {/* 🔹 İçerik */}
      <div className="servis-detay-content">
        <h1>{servis.baslik}</h1>
        <p className="servis-ozet">{servis.ozet}</p>

        {servis.detay ? (
          <p className="servis-detay-text">{servis.detay}</p>
        ) : (
          <p className="servis-detay-text">
            Bu servis için detaylı açıklama henüz eklenmemiş.
          </p>
        )}

        <button className="geri-don-btn" onClick={() => navigate("/")}>
          ← Ana Sayfaya Dön
        </button>
      </div>
    </div>
  );
};

export default ServisDetay;
