import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../AdminLogin.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api";

const AdminLogin = () => {
  const [kullaniciAdi, setKullaniciAdi] = useState("");
  const [sifre, setSifre] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Eğer zaten giriş yapılmışsa direkt admin'e git
  useEffect(() => {
    const auth = localStorage.getItem("adminAuth");
    if (auth === "true") {
      navigate("/admin");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 🔒 Backend'e giriş isteği gönder
      const response = await axios.post(`${API_URL}/kullanicilar/login`, {
        kullaniciAdi,
        sifre
      });

      // Başarılı giriş
      if (response.data.includes("Giriş başarılı")) {
        localStorage.setItem("adminAuth", "true");
        localStorage.setItem("adminUsername", kullaniciAdi);
        navigate("/admin");
      } else {
        setError("Kullanıcı adı veya şifre hatalı!");
        setKullaniciAdi("");
        setSifre("");
      }
    } catch (err) {
      console.error("Login hatası:", err);
      setError("Kullanıcı adı veya şifre hatalı!");
      setKullaniciAdi("");
      setSifre("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h2>Admin Paneli</h2>
          <p>İçerik Yönetim Sistemi</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="login-form-group">
            <label htmlFor="username">Kullanıcı Adı</label>
            <input
              type="text"
              id="username"
              placeholder="Kullanıcı adınızı girin"
              value={kullaniciAdi}
              onChange={(e) => setKullaniciAdi(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="login-form-group">
            <label htmlFor="password">Şifre</label>
            <input
              type="password"
              id="password"
              placeholder="Şifrenizi girin"
              value={sifre}
              onChange={(e) => setSifre(e.target.value)}
              required
            />
          </div>

          {error && <div className="login-error">{error}</div>}

          <button type="submit" disabled={loading}>
            {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
          </button>

          <div className="login-security-note">
            <p>
              <i className="fas fa-shield-alt"></i>
              Güvenli admin paneli - Yetkisiz erişim yasaktır
            </p>
          </div>
        </form>

        <div className="login-footer">
          <p>© 2024 AIM Agency - Tüm hakları saklıdır</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
