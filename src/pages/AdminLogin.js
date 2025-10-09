import React, { useState } from "react";
import { login } from "../services/ApiService";
import "../App.css";

const AdminLogin = ({ onLoginSuccess }) => {
  const [kullaniciAdi, setKullaniciAdi] = useState("");
  const [sifre, setSifre] = useState("");
  const [hata, setHata] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(kullaniciAdi, sifre);
      if (res.status === 200) {
        localStorage.setItem("admin", "true");
        onLoginSuccess();
      }
    } catch (err) {
      setHata("Giriş bilgileri hatalı!");
    }
  };

  return (
    <div className="login-container">
      <h2>Admin Paneli Girişi</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Kullanıcı Adı"
          value={kullaniciAdi}
          onChange={(e) => setKullaniciAdi(e.target.value)}
        />
        <input
          type="password"
          placeholder="Şifre"
          value={sifre}
          onChange={(e) => setSifre(e.target.value)}
        />
        <button type="submit">Giriş Yap</button>
      </form>
      {hata && <p className="error-text">{hata}</p>}
    </div>
  );
};

export default AdminLogin;
