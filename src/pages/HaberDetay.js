import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../App.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api";

const HaberDetay = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [haber, setHaber] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
    
      .get(`${API_URL}/haberler/${id}`)
      .then((r) => {
        console.log("Haber Detay Verisi:", r.data); // 👀 DEBUG
        setHaber(r.data);
      })
      .catch((err) => console.error("Haber yüklenemedi:", err))
      .finally(() => setLoading(false));
  }, [id]);
useEffect(() => {
  // Sayfa her render olduğunda en üste kaydırır
  window.scrollTo({
    top: 0,
    behavior: "smooth", // yumuşak kayma
  });
}, []);
  if (loading)
    return <p style={{ color: "white", textAlign: "center" }}>Yükleniyor...</p>;

  if (!haber)
    return (
      <p style={{ color: "white", textAlign: "center" }}>
        Haber bulunamadı ❌
      </p>
    );

  return (
    <div className="haber-detay-container">
      <img
        src={haber.resimUrl || "/assets/AIM-bg.png"}
        alt={haber.baslik}
        className="haber-detay-resim"
        onError={(e) => (e.target.src = "/assets/AIM-bg.png")}
      />

      <div className="haber-detay-icerik">
        <h1>{haber.baslik}</h1>

        {haber.icerik && (
          <p className="haber-detay-kisa">
            {haber.icerik}
          </p>
        )}

        {haber.detay && (
          <div className="haber-detay-tam">
            {haber.detay}
          </div>
        )}

        {!haber.detay && (
          <p style={{ color: "#aaa", marginTop: "10px" }}>
            (Bu haberin detaylı açıklaması bulunamadı.)
          </p>
        )}

        <button
          onClick={() => navigate(-1)}
          className="geri-btn"
          style={{
            marginTop: "30px",
            background: "#e50914",
            border: "none",
            padding: "10px 25px",
            color: "white",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          ← Geri Dön
        </button>
      </div>
    </div>
  );
};

export default HaberDetay;
