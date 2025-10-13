import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  getEtkinlikler,
  getSponsorlar,
  getServisler,
  getHaberler,
  getAyarlar,
  getAltServisler,
} from "../services/ApiService";
import Popup from "../components/Popup";
import Footer from "../components/Footer";
import "../App.css";

const Home = () => {
  const [etkinlikler, setEtkinlikler] = useState([]);
  const [sponsorlar, setSponsorlar] = useState([]);
  const [servisler, setServisler] = useState([]);
  const [haberler, setHaberler] = useState([]);
  const [ayarlar, setAyarlar] = useState([]);
  const [altServisler, setAltServisler] = useState([]);
  const [aktifEtkinlik, setAktifEtkinlik] = useState(0);
  const [aktifHaber, setAktifHaber] = useState(0);
  const [kartGenisligi, setKartGenisligi] = useState(0);

  const sliderRef = useRef(null);
  const haberSliderRef = useRef(null);
  const navigate = useNavigate();

  // Popup state
  const [popupIcerik, setPopupIcerik] = useState(null);
  const [popupListe, setPopupListe] = useState([]);
  const [popupIndex, setPopupIndex] = useState(0);

  // 🔹 Backend verilerini çek
  useEffect(() => {
    getEtkinlikler().then((r) => setEtkinlikler(r.data));
    getSponsorlar().then((r) => setSponsorlar(r.data));
    getServisler().then((r) => setServisler(r.data));
    getHaberler().then((r) => setHaberler(r.data));
    getAyarlar().then((r) => setAyarlar(r.data));
    getAltServisler().then((r) => setAltServisler(r.data));
  }, []);

  // 🔹 Etkinlik slider otomatik geçiş
  useEffect(() => {
    if (!etkinlikler || etkinlikler.length === 0) return;

    setAktifEtkinlik(0);

    const timer = setInterval(() => {
      setAktifEtkinlik((prev) => {
        if (prev >= etkinlikler.length - 1) return 0;
        return prev + 1;
      });
    }, 7000);

    return () => clearInterval(timer);
  }, [etkinlikler]);

  // 🔹 Kart genişliğini hesapla
  useEffect(() => {
    const calculateCardWidth = () => {
      const width = window.innerWidth;
      if (width <= 768) {
        return 100; // mobil: 1 kart
      } else if (width <= 1024) {
        return 50; // tablet: 2 kart
      } else {
        return 33.333; // desktop: 3 kart
      }
    };

    setKartGenisligi(calculateCardWidth());

    const handleResize = () => {
      setKartGenisligi(calculateCardWidth());
      // Ekran boyutu değiştiğinde slider'ı sıfırla
      setAktifHaber(0);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 🔹 Services kaydırma
  const kaydir = (yon) => {
    const scrollMiktar = 350;
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        left: yon * scrollMiktar,
        behavior: "smooth",
      });
    }
  };

  // 🔹 Haber slider fonksiyonları - KESİN ÇÖZÜM
  const nextHaberSlide = () => {
    const maxSlide = Math.max(0, haberler.length - getVisibleCardsCount());
    if (aktifHaber < maxSlide) {
      setAktifHaber(prev => prev + 1);
    }
  };

  const prevHaberSlide = () => {
    if (aktifHaber > 0) {
      setAktifHaber(prev => prev - 1);
    }
  };

  // 🔹 Görünen kart sayısını hesapla
  const getVisibleCardsCount = () => {
    const width = window.innerWidth;
    if (width <= 768) return 1;
    if (width <= 1024) return 2;
    return 3;
  };

  // 🔹 Maksimum slide sayısını hesapla
  const getMaxSlide = () => {
    return Math.max(0, haberler.length - getVisibleCardsCount());
  };

  // 🔹 Yedek resim (Cloudinary gelmezse)
  const yedekResim = "/assets/AIM-bg.png";

  return (
    <div id="home" className="home-page">
      {/* 🏁 ETKİNLİKLER + SPONSORLAR */}
      <section
        id="hero"
        className="hero-section"
        style={{
          background:
            etkinlikler.length === 0
              ? `url(${yedekResim}) no-repeat center center / cover`
              : "none",
        }}
      >
        {etkinlikler.length > 0 && (
          <div className="etkinlik-container">
            <div className="etkinlik-slider">
              <img
                src={etkinlikler[aktifEtkinlik]?.resimUrl || "/assets/AIM-bg.png"}
                alt="etkinlik"
                className="etkinlik-image"
                onError={(e) => (e.target.src = "/assets/AIM-bg.png")}
              />
              <div className="etkinlik-text">
                <h1>{etkinlikler[aktifEtkinlik].baslik}</h1>
                <p>{etkinlikler[aktifEtkinlik].aciklama}</p>
                <button
                  onClick={() =>
navigate(`/etkinlik/${etkinlikler[aktifEtkinlik].id}`)                  }
                >
                  Detaylı İncele
                </button>
              </div>

              {/* Ok butonları */}
              <button
                className="slider-btn prev"
                onClick={() =>
                  setAktifEtkinlik(
                    (prev) =>
                      (prev - 1 + etkinlikler.length) % etkinlikler.length
                  )
                }
              >
                ‹
              </button>
              <button
                className="slider-btn next"
                onClick={() =>
                  setAktifEtkinlik(
                    (prev) => (prev + 1) % etkinlikler.length
                  )
                }
              >
                ›
              </button>
            </div>
          </div>
        )}

        {/* Sponsor logoları */}
        <div className="sponsor-container">
          <div className="sponsor-marquee">
            {sponsorlar.concat(sponsorlar).map((s, i) => (
              <img
                key={i}
                src={s.logoUrl || yedekResim}
                alt="sponsor"
                className="sponsor-logo"
                onError={(e) => (e.target.src = yedekResim)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 💼 SERVICES */}
<section id="services" className="services-section">
  <h2>Services</h2>
  <div className="services-slider">
    <button className="services-btn prev" onClick={() => kaydir(-1)}>
      ‹
    </button>

    <div className="services-wrapper" ref={sliderRef}>
      {servisler.map((srv) => (
        <div key={srv.id} className="service-card">
          <img
            src={srv.resimUrl || yedekResim}
            alt="servis"
            onError={(e) => (e.target.src = yedekResim)}
          />
          <h3>{srv.baslik}</h3>
          <p>{srv.ozet}</p>
          <button onClick={() => navigate(`/servis/${srv.id}`)}>
            Read More
          </button>
        </div>
      ))}
    </div>

    <button className="services-btn next" onClick={() => kaydir(1)}>
      ›
    </button>
  </div>
</section>


      {/* 🧩 ALT SERVİSLER */}
      <section className="alt-servisler-section">
        <h2>Our comprehensive range of services</h2>
        <div className="alt-servisler-grid">
          {altServisler.map((as, index) => (
            <div key={as.id} className="alt-servis-card">
              {/* 🔹 İkon / Görsel */}
              {as.ikonUrl && (
                <div className="alt-servis-icon">
                  <img
                    src={as.ikonUrl}
                    alt={as.baslik}
                    onError={(e) => (e.target.style.display = "none")}
                  />
                </div>
              )}

              {/* 🔹 Başlık ve Açıklama */}
              <h3>{as.baslik}</h3>
              <p>{as.aciklama}</p>

              {/* 🔹 Popup butonu */}
           
            </div>
          ))}
        </div>
      </section>

      {/* 📰 HABERLER - DÜZELTİLMİŞ */}
      <section className="haberler-section">
        <h2>Latest News</h2>

        <div className="haberler-slider-container">
          {/* Sol ok */}
          <button
            className="slider-btn prev"
            onClick={prevHaberSlide}
            disabled={aktifHaber === 0}
          >
            ‹
          </button>

          {/* Slider Wrapper */}
          <div className="haberler-slider-wrapper">
            {/* Slider - GRID YÖNTEMİ */}
            <div
              className="haberler-slider"
              ref={haberSliderRef}
              style={{
                transform: `translateX(-${aktifHaber * (100 / getVisibleCardsCount())}%)`
              }}
            >
              {haberler.map((hab, index) => (
                <div key={hab.id} className="haber-card">
                  <img
                    src={hab.resimUrl || "/assets/AIM-bg.png"}
                    alt={hab.baslik}
                    className="haber-image"
                    onError={(e) => (e.target.src = "/assets/AIM-bg.png")}
                  />
                  <h3>{hab.baslik}</h3>
                  <p>
                    {hab.icerik?.length > 120
                      ? `${hab.icerik.substring(0, 120)}...`
                      : hab.icerik}
                  </p>
                  <button
                    onClick={() => navigate(`/haber/${hab.id}`)}
                  >
                    Read More
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Sağ ok */}
          <button
            className="slider-btn next"
            onClick={nextHaberSlide}
            disabled={aktifHaber >= getMaxSlide()}
          >
            ›
          </button>
        </div>
      </section>

      {/* 🧭 FOOTER */}
      <section id="contact" className="footer-section">
        {ayarlar.length > 0 && <Footer ayar={ayarlar[0]} />}
      </section>

      {/* 💬 POPUP */}
      {popupIcerik && (
        <Popup
          baslik={popupIcerik.baslik}
          icerik={popupIcerik.icerik}
          resimUrl={popupIcerik.resimUrl}
          onClose={() => setPopupIcerik(null)}
          onNext={() => {
            const nextIndex = (popupIndex + 1) % popupListe.length;
            const nextItem = popupListe[nextIndex];
            setPopupIndex(nextIndex);
            setPopupIcerik({
              baslik: nextItem.baslik,
              icerik: nextItem.detay || nextItem.aciklama || nextItem.icerik,
              resimUrl: nextItem.resimUrl || nextItem.ikonUrl,
            });
          }}
          onPrev={() => {
            const prevIndex =
              (popupIndex - 1 + popupListe.length) % popupListe.length;
            const prevItem = popupListe[prevIndex];
            setPopupIndex(prevIndex);
            setPopupIcerik({
              baslik: prevItem.baslik,
              icerik: prevItem.detay || prevItem.aciklama || prevItem.icerik,
              resimUrl: prevItem.resimUrl || prevItem.ikonUrl,
            });
          }}
          hasNext={popupListe.length > 1}
          hasPrev={popupListe.length > 1}
        />
      )}
    </div>
  );
};

export default Home;