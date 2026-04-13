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

  const sliderRef = useRef(null);
  const haberSliderRef = useRef(null);
  const hikayeSliderRef = useRef(null);
  const navigate = useNavigate();

  // Popup state
  const [popupIcerik, setPopupIcerik] = useState(null);
  const [popupListe] = useState([]);
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

  // 🔹 UI/UX servisini kaldırıyoruz
  const temizServisler = servisler.filter(
    (s) => s.baslik !== "UI/UX" && s.baslik !== "UIUX"
  );

  // 🔹 Hikaye slider otomatik geçiş
  useEffect(() => {
    if (!etkinlikler || etkinlikler.length === 0) return;

    const timer = setInterval(() => {
      setAktifEtkinlik((prev) =>
        prev >= etkinlikler.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(timer);
  }, [etkinlikler]);

  // 🔹 Hikaye slider scroll
  useEffect(() => {
    if (hikayeSliderRef.current) {
      hikayeSliderRef.current.scrollTo({
        left: aktifEtkinlik * window.innerWidth,
        behavior: "smooth",
      });
    }
  }, [aktifEtkinlik]);

  useEffect(() => {
    const handleResize = () => {
      setAktifHaber(0);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Services kaydırma
  const kaydir = (yon) => {
    if (sliderRef.current) {
      const containerWidth = sliderRef.current.offsetWidth;
      sliderRef.current.scrollBy({
        left: yon * containerWidth,
        behavior: "smooth",
      });
    }
  };

  // Haber slider fonksiyonları
  const nextHaberSlide = () => {
    const maxSlide = Math.max(0, haberler.length - getVisibleCardsCount());
    if (aktifHaber < maxSlide) setAktifHaber((prev) => prev + 1);
  };

  const prevHaberSlide = () => {
    if (aktifHaber > 0) setAktifHaber((prev) => prev - 1);
  };

  const getVisibleCardsCount = () => {
    const width = window.innerWidth;
    if (width <= 768) return 1;
    if (width <= 1024) return 2;
    return 3;
  };

  const getMaxSlide = () => {
    return Math.max(0, haberler.length - getVisibleCardsCount());
  };

  const yedekResim = "/assets/AIM-bg.png";

  return (
    <div id="home" className="home-page">

      {/* 🏁 ETKİNLİKLER - HİKAYE TARZI SLIDER */}
      <section id="hero" className="hero-section hikaye-style">
        <div className="etkinlik-horizontal-scroll" ref={hikayeSliderRef}>
          {etkinlikler.map((etk, index) => (
            <div
              key={etk.id}
              className={`etkinlik-card ${index === aktifEtkinlik ? "aktif" : ""}`}
            >
              <img
                src={etk.resimUrl || "/assets/AIM-bg.png"}
                alt={etk.baslik}
                className="etkinlik-full-image"
                onError={(e) => (e.target.src = "/assets/AIM-bg.png")}
              />
              <div className="etkinlik-overlay">
                <h1>{etk.baslik}</h1>
                <p>{etk.aciklama}</p>
                <button onClick={() => navigate(`/etkinlik/${etk.id}`)}>
                  Detaylı İncele
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Hikaye slider kontrolleri */}
        <div className="hikaye-kontroller">
          <button
            className="slider-btn prev"
            onClick={() =>
              setAktifEtkinlik(
                (prev) => (prev - 1 + etkinlikler.length) % etkinlikler.length
              )
            }
          >
            ‹
          </button>

          {/* İlerleme çubukları */}
          <div className="hikaye-progress">
            {etkinlikler.map((_, index) => (
              <div
                key={index}
                className={`progress-bar ${index === aktifEtkinlik ? "aktif" : ""}`}
                onClick={() => setAktifEtkinlik(index)}
              >
                <div
                  className="progress-fill"
                  style={{
                    width: index === aktifEtkinlik ? "100%" : "0%",
                    animation:
                      index === aktifEtkinlik ? "progress 5s linear" : "none",
                  }}
                />
              </div>
            ))}
          </div>

          <button
            className="slider-btn next"
            onClick={() =>
              setAktifEtkinlik((prev) => (prev + 1) % etkinlikler.length)
            }
          >
            ›
          </button>
        </div>

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
       <h2 className="services-title">
  <img src="/assets/services-icon.svg" alt="icon" className="services-icon" />
  Services
</h2>


        <div className="services-slider">
          <button className="services-btn prev" onClick={() => kaydir(-1)}>‹</button>

          <div className="services-wrapper" ref={sliderRef}>
            {temizServisler.map((srv) => (
              <div
                key={srv.id}
                className="service-card"
                data-type={srv.baslik}
              >
                <img
                  src={srv.resimUrl || yedekResim}
                  alt="servis"
                  onError={(e) => (e.target.src = yedekResim)}
                />
                <div className="service-card-content">
                  <h3>{srv.baslik}</h3>
                  <p>{srv.ozet}</p>
                  <button onClick={() => navigate(`/servis/${srv.id}`)}>
                    Read More
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button className="services-btn next" onClick={() => kaydir(1)}>›</button>
        </div>
      </section>

      {/* 🧩 ALT SERVİSLER */}
      <section className="alt-servisler-section">
        <h2>Our comprehensive range of services</h2>
        <div className="alt-servisler-grid">
          {altServisler.map((as) => (
            <div key={as.id} className="alt-servis-card">
              {as.ikonUrl && (
                <div className="alt-servis-icon">
                  <img
                    src={as.ikonUrl}
                    alt={as.baslik}
                    onError={(e) => (e.target.style.display = "none")}
                  />
                </div>
              )}

              <h3>{as.baslik}</h3>
              <p>{as.aciklama}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 📰 HABERLER */}
      <section className="haberler-section">
        <h2>Latest News</h2>

        <div className="haberler-slider-container">
          <button
            className="slider-btn prev"
            onClick={prevHaberSlide}
            disabled={aktifHaber === 0}
          >
            ‹
          </button>

          <div className="haberler-slider-wrapper">
            <div
              className="haberler-slider"
              ref={haberSliderRef}
              style={{
                transform: `translateX(-${
                  aktifHaber * (100 / getVisibleCardsCount())
                }%)`,
              }}
            >
              {haberler.map((hab) => (
                <div key={hab.id} className="haber-card">
                  <img
                    src={hab.resimUrl || "/assets/AIM-bg.png"}
                    alt={hab.baslik}
                    className="haber-image"
                    onError={(e) => (e.target.src = "/assets/AIM-bg.png")}
                  />

                  <div className="kirmizi-cizgi"></div>

                  <h3>{hab.baslik}</h3>
                  <p>
                    {hab.icerik?.length > 120
                      ? hab.icerik.substring(0, 120) + "..."
                      : hab.icerik}
                  </p>
                  <button onClick={() => navigate(`/haber/${hab.id}`)}>
                    Read More
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            className="slider-btn next"
            onClick={nextHaberSlide}
            disabled={aktifHaber >= getMaxSlide()}
          >
            ›
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <section id="contact" className="footer-section">
        {ayarlar.length > 0 && <Footer ayar={ayarlar[0]} />}
      </section>

      {/* POPUP */}
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
