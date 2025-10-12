import React from "react";
import "../App.css";

const Popup = ({
  baslik,
  icerik,
  resimUrl,
  onClose,
  onNext,
  onPrev,
  hasNext,
  hasPrev,
}) => {
  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        {/* ✕ Kapat butonu */}
        <button className="popup-close" onClick={onClose}>
          ✕
        </button>

        {/* 📸 Görsel (isteğe bağlı) */}
        {resimUrl && (
          <div className="popup-image-container">
            <img src={resimUrl} alt={baslik} className="popup-image" />
          </div>
        )}

        {/* 🔹 Başlık */}
        <h2 className="popup-title">{baslik}</h2>

        {/* 📜 İçerik */}
        <div className="popup-body">
          <p>{icerik}</p>
        </div>

        {/* 🔁 Gezinme butonları */}
        <div className="popup-nav">
          {hasPrev && (
            <button className="popup-nav-btn" onClick={onPrev}>
              ← Previous
            </button>
          )}
          {hasNext && (
            <button className="popup-nav-btn" onClick={onNext}>
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Popup;
