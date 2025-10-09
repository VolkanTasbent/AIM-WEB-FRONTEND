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
  const [aktifHaber, setAktifHaber] = useState(0);


  // Popup için state
  const [popupIcerik, setPopupIcerik] = useState(null);
  const [popupListe, setPopupListe] = useState([]);
  const [popupIndex, setPopupIndex] = useState(0);

  // Slider & Navigation
  const [aktifEtkinlik, setAktifEtkinlik] = useState(0);
  const sliderRef = useRef(null);
  const navigate = useNavigate();

  // 🔹 Verileri backend'den çek
  useEffect(() => {
    getEtkinlikler().then((r) => setEtkinlikler(r.data));
    getSponsorlar().then((r) => setSponsorlar(r.data));
    getServisler().then((r) => setServisler(r.data));
    getHaberler().then((r) => setHaberler(r.data));
    getAyarlar().then((r) => setAyarlar(r.data));
    getAltServisler().then((r) => setAltServisler(r.data));
  }, []);

  // 🔹 Etkinlik slider (otomatik geçiş)
  useEffect(() => {
    if (etkinlikler.length === 0) return;
    const timer = setInterval(() => {
      setAktifEtkinlik((prev) => (prev + 1) % etkinlikler.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [etkinlikler]);

  // 🔹 Services kısmı kaydırma fonksiyonu
  const kaydir = (yon) => {
    const scrollMiktar = 350;
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        left: yon * scrollMiktar,
        behavior: "smooth",
      });
    }
  };

  return (
    <div id="home" className="home-page">
      {/* 🏁 ETKİNLİKLER + SPONSORLAR */}
      <section id="hero" className="hero-section">
        {etkinlikler.length > 0 && (
          <div className="etkinlik-container">
            <div className="etkinlik-slider">
              <img
                src={etkinlikler[aktifEtkinlik].resimUrl}
                alt="etkinlik"
                className="etkinlik-image"
              />
              <div className="etkinlik-text">
                <h1>{etkinlikler[aktifEtkinlik].baslik}</h1>
                <p>{etkinlikler[aktifEtkinlik].aciklama}</p>
                <button
                  onClick={() =>
                    navigate(`/haber/${etkinlikler[aktifEtkinlik].id}`)
                  }
                >
                  Detaylı İncele
                </button>
              </div>

              {/* 🔹 Ok butonları */}
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

        {/* 🔹 Sürekli kayan sponsor logoları */}
        <div className="sponsor-container">
          <div className="sponsor-marquee">
            {sponsorlar.concat(sponsorlar).map((s, i) => (
              <img
                key={i}
                src={s.logoUrl}
                alt="sponsor"
                className="sponsor-logo"
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
                <img src={srv.resimUrl} alt="servis" />
                <h3>{srv.baslik}</h3>
                <p>{srv.ozet}</p>
                <button
                  onClick={() =>
                    navigate(
                      `/services/${srv.baslik
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`
                    )
                  }
                >
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
              {as.ikonUrl && <img src={as.ikonUrl} alt={as.baslik} />}
              <h3>{as.baslik}</h3>
              <p>{as.aciklama}</p>
              <button
                onClick={() => {
                  setPopupListe(altServisler);
                  setPopupIndex(index);
                  setPopupIcerik({
                    baslik: as.baslik,
                    icerik: as.aciklama,
                    resimUrl: as.ikonUrl,
                  });
                }}
              >
                Read More
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 📰 HABERLER */}
{/* 📰 HABERLER */}
<section className="haberler-section">
  <h2>Latest News</h2>

  <div className="haberler-slider-container">
    {/* Sol ok */}
    <button
      className="slider-btn prev"
      onClick={() =>
        setAktifHaber((prev) =>
          prev > 0 ? prev - 1 : Math.max(0, haberler.length - 3)
        )
      }
    >
      ‹
    </button>

    <div
      className="haberler-slider"
      style={{
        transform: `translateX(-${aktifHaber * 360}px)`,
      }}
    >
      {haberler.map((hab, index) => (
        <div key={hab.id} className="haber-card">
          <img src={hab.resimUrl} alt={hab.baslik} className="haber-image" />
          <h3>{hab.baslik}</h3>
          <p>{hab.icerik}</p>
          <button
            onClick={() => {
              setPopupListe(haberler);
              setPopupIndex(index);
              setPopupIcerik({
                baslik: hab.baslik,
                icerik: hab.icerik || hab.detay,
                resimUrl: hab.resimUrl,
              });
            }}
          >
            Read More
          </button>
        </div>
      ))}
    </div>

    {/* Sağ ok */}
    <button
      className="slider-btn next"
      onClick={() =>
        setAktifHaber((prev) =>
          prev < haberler.length - 3 ? prev + 1 : 0
        )
      }
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
