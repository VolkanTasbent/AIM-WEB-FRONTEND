import React, { useEffect, useState } from "react";
import {
  getEtkinlikler,
  getHaberler,
  getServisler,
  getAltServisler,
  getSponsorlar,
  uploadToCloudinary,
} from "../services/ApiService";
import axios from "axios";
import "../App.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api";

const AdminDashboard = () => {
  const [etkinlikler, setEtkinlikler] = useState([]);
  const [haberler, setHaberler] = useState([]);
  const [servisler, setServisler] = useState([]);
  const [altServisler, setAltServisler] = useState([]);
  const [sponsorlar, setSponsorlar] = useState([]);
  const [activeSection, setActiveSection] = useState("etkinlik");

  const [formData, setFormData] = useState({
    id: null,
    baslik: "",
    aciklama: "",
    detay: "",
    ozet: "",
    ad: "",
  });

  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // 🔹 Verileri yükle
  useEffect(() => {
    getEtkinlikler().then((r) => setEtkinlikler(r.data));
    getHaberler().then((r) => setHaberler(r.data));
    getServisler().then((r) => setServisler(r.data));
    getAltServisler().then((r) => setAltServisler(r.data));
    getSponsorlar().then((r) => setSponsorlar(r.data));
  }, []);

  // 🔹 Cloudinary Görsel Yükleme
  const handleUpload = async () => {
    if (!file) return alert("Lütfen resim seçin!");
    setLoading(true);
    try {
      console.log("Cloudinary’ye yükleniyor:", file.name);
const url = await uploadToCloudinary(file, activeSection);
      setImageUrl(url);
      alert("Resim başarıyla yüklendi ✅");
    } catch (err) {
      console.error("Cloudinary hata:", err);
      alert("Resim yüklenemedi ❌");
    } finally {
      setLoading(false);
    }
  };

const handleRemoveImage = () => {
  if (!window.confirm("Resmi kaldırmak istiyor musun?")) return;
  setImageUrl("");
  setFile(null);
  alert("Resim kaldırıldı. Kaydet'e basarak güncellemeyi tamamla ✅");
};


  // 🔹 Ekleme / Güncelleme
const handleAddOrUpdate = async () => {
  if (activeSection === "sponsor" && !formData.ad)
    return alert("Sponsor adı zorunludur!");
  if (activeSection !== "sponsor" && !formData.baslik)
    return alert("Başlık zorunludur!");

  setLoading(true);

  try {
    // 🔹 1. Resim otomatik yüklensin
    let finalImageUrl = imageUrl;
    if (!finalImageUrl && file) {
      const uploadedUrl = await uploadToCloudinary(file);
      finalImageUrl = uploadedUrl;
      setImageUrl(uploadedUrl);
    }

    // 🔹 2. Gönderilecek veriyi hazırla
    let data = {};
    if (activeSection === "sponsor") {
      data = {
        ad: formData.ad,
        logoUrl: finalImageUrl || "",
      };
    } else if (activeSection === "altservis") {
      data = {
        baslik: formData.baslik,
        aciklama: formData.aciklama,
        ikonUrl: finalImageUrl || "",
      };
    } else if (activeSection === "haber") {
   data = {
  baslik: formData.baslik,
  icerik: formData.aciklama, // 🔹 backend’deki icerik alanına eşitliyoruz
  detay: formData.detay,
  resimUrl: finalImageUrl || "",
};

    } else {
      // etkinlik, servis vs.
      data = {
        baslik: formData.baslik,
        aciklama: formData.aciklama,
        detay: formData.detay,
        ozet: formData.ozet,
        resimUrl: finalImageUrl || "",
      };
    }

    // 🔹 3. Endpoint seçimi
    let endpoint = "";
    if (activeSection === "etkinlik") endpoint = "/etkinlikler";
    else if (activeSection === "haber") endpoint = "/haberler";
    else if (activeSection === "servis") endpoint = "/servisler";
    else if (activeSection === "altservis") endpoint = "/alt-servisler";
    else if (activeSection === "sponsor") endpoint = "/sponsorlar";

    // 🔹 4. PUT veya POST işlemi
    if (isEditing && formData.id) {
      await axios.put(`${API_URL}${endpoint}/${formData.id}`, data);
      alert("Güncellendi ✅");
    } else {
      await axios.post(`${API_URL}${endpoint}`, data);
      alert("Yeni kayıt eklendi 🎉");
    }

    // 🔹 5. Listeyi yenile
    if (activeSection === "etkinlik")
      getEtkinlikler().then((r) => setEtkinlikler(r.data));
    else if (activeSection === "haber")
      getHaberler().then((r) => setHaberler(r.data));
    else if (activeSection === "servis")
      getServisler().then((r) => setServisler(r.data));
    else if (activeSection === "altservis")
      getAltServisler().then((r) => setAltServisler(r.data));
    else if (activeSection === "sponsor")
      getSponsorlar().then((r) => setSponsorlar(r.data));

    // 🔹 6. Form sıfırlama
    setFormData({
      id: null,
      baslik: "",
      aciklama: "",
      detay: "",
      ozet: "",
      ad: "",
    });
    setImageUrl("");
    setFile(null);
    setIsEditing(false);
  } catch (err) {
    console.error("Kaydetme hatası:", err);
    alert("Kayıt işlemi sırasında hata oluştu ❌");
  } finally {
    setLoading(false);
  }
};


  const refreshList = (section) => {
    if (section === "etkinlik")
      getEtkinlikler().then((r) => setEtkinlikler(r.data));
    else if (section === "haber") getHaberler().then((r) => setHaberler(r.data));
    else if (section === "servis")
      getServisler().then((r) => setServisler(r.data));
    else if (section === "altservis")
      getAltServisler().then((r) => setAltServisler(r.data));
    else if (section === "sponsor")
      getSponsorlar().then((r) => setSponsorlar(r.data));
  };

  const resetForm = () => {
    setFormData({
      id: null,
      baslik: "",
      aciklama: "",
      detay: "",
      ozet: "",
      ad: "",
    });
    setImageUrl("");
    setFile(null);
    setIsEditing(false);
  };

  // 🔹 Düzenleme
const handleEdit = (item) => {
  setFormData({
    id: item.id,
    baslik: item.baslik || "",
    aciklama: item.aciklama || "",
    detay: item.detay || "",
    ozet: item.ozet || "",
    ad: item.ad || "",
  });
  setImageUrl(item.resimUrl || item.logoUrl || item.ikonUrl || "");
  setIsEditing(true);
};

  // 🔹 Silme
  const handleDelete = async (id) => {
    if (!window.confirm("Silmek istediğine emin misin?")) return;

    let endpoint = "";
    switch (activeSection) {
      case "etkinlik":
        endpoint = "/etkinlikler";
        break;
      case "haber":
        endpoint = "/haberler";
        break;
      case "servis":
        endpoint = "/servisler";
        break;
      case "altservis":
        endpoint = "/alt-servisler";
        break;
      case "sponsor":
        endpoint = "/sponsorlar";
        break;
      default:
        break;
    }

    await axios.delete(`${API_URL}${endpoint}/${id}`);
    alert("Silindi ✅");
    refreshList(activeSection);
  };

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>

      {/* 🔹 Sekmeler */}
      <div className="tab-buttons">
        {["etkinlik", "haber", "servis", "altservis", "sponsor"].map((sec) => (
          <button
            key={sec}
            onClick={() => {
              setActiveSection(sec);
              resetForm();
            }}
            className={activeSection === sec ? "active" : ""}
          >
            {sec === "etkinlik"
              ? "Etkinlikler"
              : sec === "haber"
              ? "Haberler"
              : sec === "servis"
              ? "Servisler"
              : sec === "altservis"
              ? "Alt Servisler"
              : "Sponsorlar"}
          </button>
        ))}
      </div>

      {/* 🔹 Liste */}
      <section>
        <h3>
          {activeSection === "sponsor"
            ? "Sponsor Listesi"
            : `${activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} Listesi`}
        </h3>
        <ul>
          {(activeSection === "etkinlik"
            ? etkinlikler
            : activeSection === "haber"
            ? haberler
            : activeSection === "servis"
            ? servisler
            : activeSection === "altservis"
            ? altServisler
            : sponsorlar
          ).map((item) => (
            <li key={item.id}>
              <b>{item.baslik || item.ad}</b>
              <button onClick={() => handleEdit(item)}>✏️ Düzenle</button>
              <button onClick={() => handleDelete(item.id)}>🗑 Sil</button>
            </li>
          ))}
        </ul>
      </section>

      {/* 🔹 Form */}
      <div className="admin-form">
        <h4>{isEditing ? `${activeSection} Güncelle` : `Yeni ${activeSection} Ekle`}</h4>

        {activeSection === "sponsor" ? (
          <input
            type="text"
            placeholder="Sponsor Adı"
            value={formData.ad}
            onChange={(e) => setFormData({ ...formData, ad: e.target.value })}
          />
        ) : (
          <>
            <input
              type="text"
              placeholder="Başlık"
              value={formData.baslik}
              onChange={(e) => setFormData({ ...formData, baslik: e.target.value })}
            />
            {activeSection === "servis" && (
              <textarea
                placeholder="Özet"
                value={formData.ozet}
                onChange={(e) => setFormData({ ...formData, ozet: e.target.value })}
              />
            )}
            <textarea
              placeholder="Açıklama / Detay"
              value={formData.aciklama}
              onChange={(e) => setFormData({ ...formData, aciklama: e.target.value })}
            />
          </>
        )}

        {/* Görsel Alanı */}
        <div className="image-upload-box">
          {imageUrl ? (
            <div className="image-preview">
              <img
                src={imageUrl}
                alt="Mevcut Görsel"
                width="200"
                style={{ borderRadius: "10px", marginBottom: "10px" }}
              />
              <button onClick={handleRemoveImage}>🗑 Resmi Kaldır</button>
            </div>
          ) : (
            <>
              <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
              <button onClick={handleUpload} disabled={loading}>
                {loading ? "Yükleniyor..." : "Resmi Yükle"}
              </button>
            </>
          )}
        </div>

        <button onClick={handleAddOrUpdate}>{isEditing ? "Güncelle" : "Kaydet"}</button>
      </div>
    </div>
  );
};

export default AdminDashboard;
