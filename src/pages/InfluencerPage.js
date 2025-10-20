import React, { useState, useEffect } from 'react';
import { Youtube, Music2, Instagram } from 'lucide-react';

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
                {/* Foto */}
                <img
                  src={influencer.resimUrl || "/assets/default-influencer.jpg"}
                  alt={influencer.adSoyad}
                  className="w-full h-[500px] object-cover relative z-0"
                />

                {/* Sarı efekt (foto üstünde kalır) */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#b38b2e] via-[#d4b253cc] to-transparent pointer-events-none transition-all duration-500 z-10" />

                {/* İsim + unvan (HER ZAMAN aynı yerde) */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-center z-20">
                  <p className="text-white text-sm font-medium mb-2">
                    {influencer.unvan}
                  </p>
                  <h2 className="text-white text-6xl font-bold tracking-wider">
                    {influencer.adSoyad}
                  </h2>

                  {/* Read More sadece kapalıyken */}
                  {expandedId !== influencer.id && (
                    <button
                      onClick={() => toggleExpand(influencer.id)}
                      style={{
                        background: '#ffffff',
                        color: '#c9a84a',
                        border: 'none',
                        padding: '12px 35px',
                        borderRadius: '25px',
                        fontWeight: '700',
                        fontSize: '16px',
                        marginTop: '20px',
                        cursor: 'pointer',
                        display: 'inline-block',
                      }}
                      className="read-more-btn"
                    >
                      Read More
                    </button>
                  )}
                </div>
              </div>

              {/* AÇILAN KISIM — sadece rengi sarı gradient yaptık, BOYUTLARA DOKUNMADIK */}
              {expandedId === influencer.id && (
<div className="rounded-lg p-8 -mt-2 relative z-30 bg-gradient-to-b from-[#d4b253] via-[#c9a84a] to-[#b38b2e]">
                  <div className="text-center mb-6">
                    <p className="text-white/90 text-base leading-relaxed">
                      {influencer.aciklama}
                    </p>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-4 text-white">
                      <Youtube className="w-8 h-8" />
                      <span className="text-2xl font-bold">
                        {influencer.youtubeTakipci || "297B Abone"}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-white">
                      <Music2 className="w-8 h-8" />
                      <span className="text-2xl font-bold">
                        {influencer.tiktokTakipci || "297B Takipçi"}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-white">
                      <Instagram className="w-8 h-8" />
                      <span className="text-2xl font-bold">
                        {influencer.instagramTakipci || "297B Takipçi"}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleExpand(influencer.id)}
                    style={{
                      width: '100%',
                      background: '#ffffff',
                      color: '#c9a84a',
                      border: 'none',
                      padding: '14px',
                      borderRadius: '25px',
                      fontWeight: '700',
                      fontSize: '16px',
                      cursor: 'pointer',
                      position: 'relative',
                      zIndex: 50,
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
