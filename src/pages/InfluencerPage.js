import React, { useState, useEffect } from 'react';
import { FaYoutube, FaTwitter, FaInstagram } from "react-icons/fa";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api";

const InfluencerPage = () => {
  const [influencers, setInfluencers] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/influencers`)
      .then((res) => res.json())
      .then((data) => {
        setInfluencers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Influencer listesi yüklenemedi:", err);
        setLoading(false);
      });
  }, []);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-xl">Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-4">Influencerlarımız</h1>
        <p className="text-center text-gray-400 mb-16 text-lg">
          Sosyal medya dünyasında markamızı temsil eden yüzlerle tanışın.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {influencers.map((influencer) => (
            <div
              key={influencer.id}
              className={`influencer-card ${expandedId === influencer.id ? "expanded" : ""}`}
            >
              <div className="relative overflow-hidden rounded-lg">
                {/* 📸 Fotoğraf */}
                <img
                  src={influencer.resimUrl || "/assets/default-influencer.jpg"}
                  alt={influencer.adSoyad}
                  className="w-full h-[500px] object-cover relative z-0"
                />

                {/* 🟡 Sarı efekt */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#b38b2e] via-[#d4b253cc] to-transparent pointer-events-none z-10" />

                {/* 📍 İsim + unvan */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-center z-20">
                  <p className="text-white text-sm font-medium mb-2">
                    {influencer.unvan}
                  </p>
                  <h2 className="text-white text-6xl font-bold tracking-wider">
                    {influencer.adSoyad}
                  </h2>

                  {/* 📍 Read More butonu */}
                  {expandedId !== influencer.id && (
                    <button
                      onClick={() => toggleExpand(influencer.id)}
                      style={{
                        background: "#ffffff",
                        color: "#c9a84a",
                        border: "none",
                        padding: "12px 35px",
                        borderRadius: "25px",
                        fontWeight: "700",
                        fontSize: "16px",
                        marginTop: "20px",
                        cursor: "pointer",
                        display: "inline-block",
                      }}
                      className="read-more-btn"
                    >
                      Read More
                    </button>
                  )}
                </div>
              </div>

              {/* 📍 Read More sonrası detay alanı */}
              {expandedId === influencer.id && (
                <div
                  className="rounded-lg p-8 -mt-2 relative z-30"
                  style={{
                    background: "linear-gradient(to bottom, #d4b253,)",
                  }}
                >
                  <div className="text-center mb-6">
                    <p className="text-white/90 text-base leading-relaxed">
                      {influencer.aciklama}
                    </p>
                  </div>

                   {/* 🎯 HİZALANMIŞ SOSYAL MEDYA SATIRLARI */}
                  <div className="space-y-4 mb-6">
                    {/* 🔴 YouTube */}
                    <a
                      href={influencer.youtube || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center justify-center gap-4 text-white transition-colors duration-200 relative z-40 ${
                        influencer.youtube ? "hover:text-red-500" : "opacity-50 pointer-events-none"
                      }`}
                    >
                      <FaYoutube className="w-8 h-8 flex-shrink-0" />
                      <span
                        className="text-2xl font-bold inline-block text-center"
                        style={{ minWidth: "140px" }}
                      >
                        {influencer.youtubeTakipci || "—"} Abone
                      </span>
                    </a>

                    {/* 🔵 Twitter */}
                    <a
                      href={influencer.twitter || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center justify-center gap-4 text-white transition-colors duration-200 relative z-40 ${
                        influencer.twitter ? "hover:text-sky-400" : "opacity-50 pointer-events-none"
                      }`}
                    >
                      <FaTwitter className="w-8 h-8 flex-shrink-0" />
                      <span
                        className="text-2xl font-bold inline-block text-center"
                        style={{ minWidth: "140px" }}
                      >
                        {influencer.twitterTakipci || "—"} Takipçi
                      </span>
                    </a>

                    {/* 🟣 Instagram */}
                    <a
                      href={influencer.instagram || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center justify-center gap-4 text-white transition-colors duration-200 relative z-40 ${
                        influencer.instagram ? "hover:text-pink-400" : "opacity-50 pointer-events-none"
                      }`}
                    >
                      <FaInstagram className="w-8 h-8 flex-shrink-0" />
                      <span
                        className="text-2xl font-bold inline-block text-center"
                        style={{ minWidth: "140px" }}
                      >
                        {influencer.instagramTakipci || "—"} Takipçi
                      </span>
                    </a>
                  </div>
                  {/* ✅ Kapat butonu */}
                  <button
                    onClick={() => toggleExpand(influencer.id)}
                    style={{
                      width: "100%",
                      background: "#ffffff",
                      color: "#c9a84a",
                      border: "none",
                      padding: "14px",
                      borderRadius: "25px",
                      fontWeight: "700",
                      fontSize: "16px",
                      cursor: "pointer",
                      zIndex: 50,
                      position: "relative",
                    }}
                  >
                    Kapat
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InfluencerPage;
