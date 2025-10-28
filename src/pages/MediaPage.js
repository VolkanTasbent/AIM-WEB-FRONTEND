import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MediaPage.css";

const API_BASE = "http://localhost:8080/api";

export default function MediaPage() {
  const [videos, setVideos] = useState([]);
  const [shoots, setShoots] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0); // Video carousel index
  const [currentShootIndex, setCurrentShootIndex] = useState(0); // Shoot carousel index

  useEffect(() => {
    axios.get(`${API_BASE}/videos`).then((res) => {
      setVideos(res.data);
    }).catch(err => console.error("Videos error:", err));
    
    axios.get(`${API_BASE}/shoots`).then((res) => {
      setShoots(res.data);
    }).catch(err => console.error("Shoots error:", err));
    
    axios.get(`${API_BASE}/portfolio`).then((res) => {
      setPortfolio(res.data);
    }).catch(err => console.error("Portfolio error:", err));
  }, []);

  return (
    <div className="media-container">
      {/* 🧠 Üst Başlık */}
      <section className="media-header">
        <h1>Media</h1>
        <p>
          Ajansımız yayıncılar, içerik üreticileri ve sosyal medya fenomenleriyle
          yaptığı iş birliklerini temel alır.
        </p>
      </section>

      {/* 🎞️ VLOGS AND FILMS - Carousel */}
      <section className="section">
        <h2>Vlogs and Films</h2>

        {videos.length > 0 && (
          <div className="video-carousel-container">
            {/* Sol Ok */}
            {videos.length > 1 && (
              <button 
                className="carousel-arrow carousel-arrow-left"
                onClick={() => setCurrentVideoIndex(prev => prev === 0 ? videos.length - 1 : prev - 1)}
              >
                ‹
              </button>
            )}

            {/* Aktif Video */}
            <div className="video-card-fullwidth">
              <img 
                src={videos[currentVideoIndex].videoImageUrl || videos[currentVideoIndex].imageUrl || videos[currentVideoIndex].thumbnailUrl} 
                alt={videos[currentVideoIndex].title} 
              />
              
              {/* Sağ ALT köşede YouTube Logosu - Fotodaki gibi */}
              {videos[currentVideoIndex].videoUrl && (
                <a
                  href={videos[currentVideoIndex].videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="youtube-logo-bottom"
                  title="YouTube'da İzle"
                >
                  <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Beyaz daire arka plan */}
                    <circle cx="40" cy="40" r="38" fill="white"/>
                    {/* Kırmızı YouTube dikdörtgen */}
                    <rect x="20" y="28" width="40" height="24" rx="3" fill="#FF0000"/>
                    {/* Beyaz play butonu */}
                    <path d="M34 34L34 46L45 40L34 34Z" fill="white"/>
                  </svg>
                </a>
              )}
              
              <div className="video-overlay">
                <h3>{videos[currentVideoIndex].title}</h3>
                <p>{videos[currentVideoIndex].description}</p>
              </div>
            </div>

            {/* Sağ Ok */}
            {videos.length > 1 && (
              <button 
                className="carousel-arrow carousel-arrow-right"
                onClick={() => setCurrentVideoIndex(prev => prev === videos.length - 1 ? 0 : prev + 1)}
              >
                ›
              </button>
            )}
          </div>
        )}
      </section>

      {/* 🎬 ÇEKİMLERİMİZ - CAROUSEL */}
      <section className="section">
        <h2>Çekimlerimiz</h2>

        {shoots.length > 0 && (
          <div className="shoot-carousel-container">
            {shoots.length > 1 && (
              <button 
                className="carousel-arrow carousel-arrow-left"
                onClick={() => setCurrentShootIndex(prev => prev === 0 ? shoots.length - 1 : prev - 1)}
              >
                ‹
              </button>
            )}
            <div className="shoot-card-fullwidth">
              <img 
                src={shoots[currentShootIndex].shootImageUrl || shoots[currentShootIndex].imageUrl} 
                alt={shoots[currentShootIndex].title} 
              />
              <div className="shoot-overlay">
                <h3>{shoots[currentShootIndex].title}</h3>
                <p>{shoots[currentShootIndex].description}</p>
              </div>
            </div>
            {shoots.length > 1 && (
              <button 
                className="carousel-arrow carousel-arrow-right"
                onClick={() => setCurrentShootIndex(prev => prev === shoots.length - 1 ? 0 : prev + 1)}
              >
                ›
              </button>
            )}
          </div>
        )}
      </section>

      {/* 🖼 PORTFOLIO */}
      <section className="section">
        <h2>Portfolio</h2>

        {/* Group portfolios in pairs (2 per row) */}
        {Array.from({ length: Math.ceil(portfolio.length / 2) }).map((_, rowIndex) => (
          <div key={rowIndex} className="portfolios-row">
            {portfolio.slice(rowIndex * 2, (rowIndex * 2) + 2).map((p) => {
              const imageUrl = p.imageUrl || p.image_url;
              let allImages = [];
              
              if (imageUrl) {
                // 🔹 Veritabanındaki URL'ler virgülle birleştirilmiş
                // Cloudinary URL'lerinde w_800,h_500 gibi virgüller var
                // Bu yüzden akıllıca parse etmeliyiz
                
                // Önce virgülle split et
                const parts = imageUrl.split(',');
                
                // URL'leri topla
                let currentUrl = '';
                for (let i = 0; i < parts.length; i++) {
                  const part = parts[i].trim();
                  
                  // Eğer https:// ile başlıyorsa yeni bir URL başlıyor
                  if (part.startsWith('https://')) {
                    // Önceki URL'i kaydet (eğer varsa)
                    if (currentUrl && (currentUrl.includes('.jpg') || currentUrl.includes('.jpeg') || 
                        currentUrl.includes('.png') || currentUrl.includes('.webp') || currentUrl.includes('.gif'))) {
                      allImages.push(currentUrl.trim());
                    }
                    currentUrl = part;
                  } else if (currentUrl) {
                    // URL'in devamı
                    currentUrl += ',' + part;
                  }
                }
                
                // Son URL'i de ekle
                if (currentUrl && (currentUrl.includes('.jpg') || currentUrl.includes('.jpeg') || 
                    currentUrl.includes('.png') || currentUrl.includes('.webp') || currentUrl.includes('.gif'))) {
                  allImages.push(currentUrl.trim());
                }
              }
              
              const uniqueImages = [...new Set(allImages)];
              const images = uniqueImages.slice(0, 12);
              
              if (images.length === 0) {
                return null;
              }
              
              return (
                <div key={p.id} className="single-portfolio">
                  {/* Team Header with Logo */}
                  <div className="team-header">
                    {p.logo ? (
                      <img src={p.logo} alt={`${p.team} Logo`} className="team-logo-img" />
                    ) : (
                      <h3 className="team-name">{p.team}</h3>
                    )}
                  </div>

                  {/* Portfolio Grid - 12 items arranged in 4 columns, 3 rows (4x3) */}
                  <div className="portfolio-grid-4x3">
                    {images.map((img, index) => (
                      <div
                        key={`${p.id}-${index}`}
                        className="portfolio-item-small"
                        onClick={() => {
                          // Modal için görseli göster
                          setSelectedImage(img.trim());
                        }}
                      >
                        <img 
                          src={img.trim()} 
                          alt={`${p.team} Portfolio ${index + 1}`}
                          onError={(e) => {
                            console.error(`❌ Görsel yüklenemedi: ${img.trim()}`);
                            e.target.src = '/placeholder.jpg';
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        {/* 🪟 Modal */}
        {selectedImage && (
          <div className="modal" onClick={() => setSelectedImage(null)}>
            <span className="close-btn" onClick={() => setSelectedImage(null)}>
              ✕
            </span>
            <img src={selectedImage} alt="Expanded" className="modal-img" />
          </div>
        )}
      </section>
    </div>
  );
}
