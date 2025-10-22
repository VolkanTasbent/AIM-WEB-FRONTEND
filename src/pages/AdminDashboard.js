import React, { useEffect, useState } from "react";
import {
  getEtkinlikler,
  getHaberler,
  getServisler,
  getAltServisler,
  getSponsorlar,
  getCrew,
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
  const [crewList, setCrewList] = useState([]);
  const [esportsList, setEsportsList] = useState([]);
  const [influencers, setInfluencers] = useState([]);

  const [activeSection, setActiveSection] = useState("etkinlik");

  const [achievementsFile, setAchievementsFile] = useState(null);
  const [teamsFile, setTeamsFile] = useState(null);
  const [logosFile, setLogosFile] = useState(null);

  const [formData, setFormData] = useState({
    id: null,
    baslik: "",
    aciklama: "",
    detay: "",
    ozet: "",
    ad: "",
    adSoyad: "",
    unvan: "",
    diller: "",
    linkedin: "",
    instagram: "",
    youtube: "",
    tiktok: "",
    takim: "",
    basarilar: "",
    achievementsBgUrl: "",
    teamsBgUrl: "",
    teamLogos: "",
    youtubeTakipci: "",
    twitterTakipci: "",
    instagramTakipci: "",
    youtubeUrl: "", // EKSİK OLAN
    instagramUrl: "", // EKSİK OLAN
    twitterUrl: "", // EKSİK OLAN
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
    getCrew().then((r) => setCrewList(r.data));
    axios.get(`${API_URL}/esports`).then((r) => setEsportsList(r.data));
    axios.get(`${API_URL}/influencers`).then((r) => setInfluencers(r.data));
  }, []);

  // 🔹 Cloudinary Görsel Yükleme
  const handleUpload = async (type) => {
    let selectedFile;

    if (type === "main") selectedFile = file;
    else if (type === "achievements") selectedFile = achievementsFile;
    else if (type === "teams") selectedFile = teamsFile;
    else if (type === "logos") selectedFile = logosFile;

    if (!selectedFile || (Array.isArray(selectedFile) && selectedFile.length === 0)) {
      alert("Lütfen resim seçin!");
      return;
    }

    setLoading(true);
    try {
      if (type === "logos" && Array.isArray(selectedFile)) {
        // 🔸 Çoklu logo yükleme (paralel)
        const uploadPromises = selectedFile.map((file) =>
          uploadToCloudinary(file, "logos")
        );
        const uploadedUrls = await Promise.all(uploadPromises);
        const jsonString = JSON.stringify(uploadedUrls);

        // 🔸 formData'ya yaz
        setFormData((prev) => ({ ...prev, teamLogos: jsonString }));

        alert("Tüm logolar başarıyla yüklendi ✅");
      } else {
        // 🔸 Tekil resim yükleme
        const url = await uploadToCloudinary(selectedFile, type);
        if (type === "main") setImageUrl(url);
        else if (type === "achievements")
          setFormData((prev) => ({ ...prev, achievementsBgUrl: url }));
        else if (type === "teams")
          setFormData((prev) => ({ ...prev, teamsBgUrl: url }));

        alert("Resim başarıyla yüklendi ✅");
      }
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

  // 🔹 Logo yükleme fonksiyonu
  const handleLogoUpload = async () => {
    if (!logosFile || logosFile.length === 0) {
      alert("Lütfen en az bir logo seçin!");
      return;
    }

    setLoading(true);
    try {
      const uploadPromises = logosFile.map((file) =>
        uploadToCloudinary(file, "logos")
      );

      const uploadedUrls = await Promise.all(uploadPromises);
      const jsonString = JSON.stringify(uploadedUrls);

      console.log("✅ Cloudinary URL'ler:", uploadedUrls);

      setFormData((prev) => ({ ...prev, teamLogos: jsonString }));

      alert("Logolar başarıyla yüklendi ✅\n\nArtık Kaydet'e basabilirsin!");
    } catch (err) {
      console.error("Logo yükleme hatası:", err);
      alert("Logo yüklenirken hata oluştu ❌");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Ekleme / Güncelleme
  const handleAddOrUpdate = async () => {
    if (activeSection === "sponsor" && !formData.ad)
      return alert("Sponsor adı zorunludur!");
    if (activeSection === "crew" && !formData.adSoyad)
      return alert("Ad Soyad zorunludur!");
    if (activeSection === "esports" && !formData.adSoyad)
      return alert("Oyuncu Ad Soyad zorunludur!");
    if (activeSection === "influencer" && !formData.adSoyad)
      return alert("Influencer Ad Soyad zorunludur!");
    if (
      activeSection !== "sponsor" &&
      activeSection !== "crew" && 
      activeSection !== "esports" &&
      activeSection !== "influencer" &&
      !formData.baslik
    )
      return alert("Başlık zorunludur!");

    setLoading(true);

    try {
      // 🔹 1. Görsel yükle
      let finalImageUrl = imageUrl;
      if (!finalImageUrl && file) {
        const uploadedUrl = await uploadToCloudinary(file);
        finalImageUrl = uploadedUrl;
        setImageUrl(uploadedUrl);
      }

      // 🔹 2. Veri oluştur
      let data = {};
      if (activeSection === "sponsor") {
        data = { ad: formData.ad, logoUrl: finalImageUrl || "" };
      } else if (activeSection === "altservis") {
        data = {
          baslik: formData.baslik,
          aciklama: formData.aciklama,
          detay: formData.detay,
          ikonUrl: finalImageUrl || "",
        };
      } else if (activeSection === "haber") {
        data = {
          baslik: formData.baslik,
          icerik: formData.aciklama,
          detay: formData.detay,
          resimUrl: finalImageUrl || "",
        };
      } else if (activeSection === "etkinlik") {
        data = {
          baslik: formData.baslik,
          aciklama: formData.aciklama,
          detay: formData.detay,
          resimUrl: finalImageUrl || "",
        };
      } else if (activeSection === "servis") {
        data = {
          baslik: formData.baslik,
          ozet: formData.ozet,
          detay: formData.detay,
          resimUrl: finalImageUrl || "",
        };
      } else if (activeSection === "crew") {
        data = {
          adSoyad: formData.adSoyad,
          unvan: formData.unvan,
          aciklama: formData.aciklama,
          detay: formData.detay,
          diller: formData.diller,
          linkedin: formData.linkedin,
          instagram: formData.instagram,
          youtube: formData.youtube,
          tiktok: formData.tiktok,
          resimUrl: finalImageUrl || "",
        };
      } else if (activeSection === "esports") {
        data = {
          adSoyad: formData.adSoyad,
          unvan: formData.unvan,
          takim: formData.takim,
          basarilar: formData.basarilar,
          aciklama: formData.aciklama,
          detay: formData.detay,
          linkedin: formData.linkedin,
          instagram: formData.instagram,
          youtube: formData.youtube,
          tiktok: formData.tiktok,
          achievementsBgUrl: formData.achievementsBgUrl,
          teamsBgUrl: formData.teamsBgUrl,
          teamLogos: formData.teamLogos,
          resimUrl: finalImageUrl || "",
        };
      } else if (activeSection === "influencer") {
      data = {
    adSoyad: formData.adSoyad,
    unvan: formData.unvan,
    aciklama: formData.aciklama,
    resimUrl: finalImageUrl || "",
    youtubeTakipci: formData.youtubeTakipci,
    twitterTakipci: formData.twitterTakipci,
    instagramTakipci: formData.instagramTakipci,
    // 👇 isimleri backend’e uygun hale getir
    youtube: formData.youtubeUrl,
    instagram: formData.instagramUrl,
    twitter: formData.twitterUrl,
  };
      } else {
        data = {
          baslik: formData.baslik,
          aciklama: formData.aciklama,
          detay: formData.detay,
          ozet: formData.ozet,
          resimUrl: finalImageUrl || "",
        };
      }

      // 🔹 3. Endpoint seç
      let endpoint = "";
      if (activeSection === "etkinlik") endpoint = "/etkinlikler";
      else if (activeSection === "haber") endpoint = "/haberler";
      else if (activeSection === "servis") endpoint = "/servisler";
      else if (activeSection === "altservis") endpoint = "/alt-servisler";
      else if (activeSection === "sponsor") endpoint = "/sponsorlar";
      else if (activeSection === "crew") endpoint = "/crew";
      else if (activeSection === "esports") endpoint = "/esports";
      else if (activeSection === "influencer") endpoint = "/influencers";

      // 🔹 4. Güncelle / Ekle
      if (isEditing) {
        if (!formData.id || isNaN(formData.id)) {
          alert("ID geçersiz! Lütfen düzenlemek istediğin kaydı yeniden seç.");
          setLoading(false);
          return;
        }
        await axios.put(`${API_URL}${endpoint}/${Number(formData.id)}`, data);
        alert("Güncellendi ✅");
      } else {
        await axios.post(`${API_URL}${endpoint}`, data);
        alert("Yeni kayıt eklendi 🎉");
      }

      // 🔹 5. Liste yenile
      refreshList(activeSection);

      // 🔹 6. Form sıfırla
      setFormData({
        id: null,
        baslik: "",
        aciklama: "",
        detay: "",
        ozet: "",
        ad: "",
        adSoyad: "",
        unvan: "",
        diller: "",
        linkedin: "",
        instagram: "",
        youtube: "",
        tiktok: "",
        takim: "",
        basarilar: "",
        teamsBgUrl: "",
        achievementsBgUrl: "",
        teamLogos: "",
        resimUrl: "",
        youtubeTakipci: "",
        twitterTakipci: "",
        instagramTakipci: "",
        youtubeUrl: "", // EKSİK OLAN
        instagramUrl: "", // EKSİK OLAN
        twitterUrl: "", // EKSİK OLAN
      });
      setImageUrl("");
      setFile(null);
      setAchievementsFile(null);
      setTeamsFile(null);
      setLogosFile(null);
      setIsEditing(false);
    } catch (err) {
      console.error("Kaydetme hatası:", err);
      alert("Kayıt işlemi sırasında hata oluştu ❌");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Liste yenileme
  const refreshList = (section) => {
    if (section === "etkinlik")
      getEtkinlikler().then((r) => setEtkinlikler(r.data));
    else if (section === "haber")
      getHaberler().then((r) => setHaberler(r.data));
    else if (section === "servis")
      getServisler().then((r) => setServisler(r.data));
    else if (section === "altservis")
      getAltServisler().then((r) => setAltServisler(r.data));
    else if (section === "sponsor")
      getSponsorlar().then((r) => setSponsorlar(r.data));
    else if (section === "crew")
      getCrew().then((r) => setCrewList(r.data));
    else if (section === "esports")
      axios.get(`${API_URL}/esports`).then((r) => setEsportsList(r.data));
    else if (section === "influencer")
      axios.get(`${API_URL}/influencers`).then((r) => setInfluencers(r.data));
  };

  // 🔹 Form sıfırlama
  const resetForm = () => {
    setFormData({
      id: null,
      baslik: "",
      aciklama: "",
      detay: "",
      ozet: "",
      ad: "",
      adSoyad: "",
      unvan: "",
      diller: "",
      linkedin: "",
      instagram: "",
      youtube: "",
      tiktok: "",
      takim: "",
      basarilar: "",
      youtubeTakipci: "",
      twitterTakipci: "",
      instagramTakipci: "",
      achievementsBgUrl: "",
      teamsBgUrl: "",
      teamLogos: "",
      youtubeUrl: "", // EKSİK OLAN
      instagramUrl: "", // EKSİK OLAN
      twitterUrl: "", // EKSİK OLAN
    });
    setImageUrl("");
    setFile(null);
    setAchievementsFile(null);
    setTeamsFile(null);
    setLogosFile(null);
    setIsEditing(false);
  };

  // 🔹 Düzenleme
  const handleEdit = (item) => {
    if (!item || !item.id) {
      alert("Bu kaydın ID bilgisi bulunamadı!");
      return;
    }

    if (activeSection === "crew" || activeSection === "esports" || activeSection === "influencer") {
    setFormData({
    id: Number(item.id),
    adSoyad: item.adSoyad || "",
    unvan: item.unvan || "",
    takim: item.takim || "",
    basarilar: item.basarilar || "",
    aciklama: item.aciklama || "",
    detay: item.detay || "",
    diller: item.diller || "",
    // 🔹 URL alanlarını backend'e uygun hale getirdik
   youtubeUrl: item.youtube || "",
instagramUrl: item.instagram || "",
twitterUrl: item.twitter || "",

    
    achievementsBgUrl: item.achievementsBgUrl || "",
    teamsBgUrl: item.teamsBgUrl || "",
    teamLogos: item.teamLogos || "",
    youtubeTakipci: item.youtubeTakipci || "",
    twitterTakipci: item.twitterTakipci || "",
    instagramTakipci: item.instagramTakipci || "",
  });
  setImageUrl(item.resimUrl || "");
} else {
      setFormData({
        id: Number(item.id),
        baslik: item.baslik || "",
        aciklama: item.aciklama || item.icerik || "",
        detay: item.detay || "",
        ozet: item.ozet || "",
        ad: item.ad || "",
      });
      setImageUrl(item.resimUrl || item.logoUrl || item.ikonUrl || "");
    }

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
      case "crew":
        endpoint = "/crew";
        break;
      case "esports":
        endpoint = "/esports";
        break;
      case "influencer":
        endpoint = "/influencers";
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
        {[
          "etkinlik",
          "haber",
          "servis",
          "altservis",
          "sponsor",
          "crew",
          "esports",
          "influencer",
        ].map((sec) => (
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
              : sec === "sponsor"
              ? "Sponsorlar"
              : sec === "crew"
              ? "Crew"
              : sec === "esports"
              ? "E-Spor Oyuncuları"
              : "Influencerlar"}
          </button>
        ))}
      </div>

      {/* 🔹 Liste */}
      <section>
        <h3>
          {activeSection === "sponsor"
            ? "Sponsor Listesi"
            : activeSection === "crew"
            ? "Crew Listesi"
            : activeSection === "esports"
            ? "Esports Oyuncuları"
            : activeSection === "influencer"
            ? "Influencer Listesi"
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
            : activeSection === "sponsor"
            ? sponsorlar
            : activeSection === "crew"
            ? crewList
            : activeSection === "esports"
            ? esportsList
            : influencers
          ).map((item) => (
            <li key={item.id}>
              <b>{item.baslik || item.adSoyad || item.ad}</b>
              <button onClick={() => handleEdit(item)}>✏️ Düzenle</button>
              <button onClick={() => handleDelete(item.id)}>🗑 Sil</button>
            </li>
          ))}
        </ul>
      </section>

      {/* 🔹 Form */}
      <div className="admin-form">
        <h4>
          {isEditing
            ? `${activeSection} Güncelle`
            : `Yeni ${activeSection} Ekle`}
        </h4>

        {activeSection === "sponsor" ? (
          <input
            type="text"
            placeholder="Sponsor Adı"
            value={formData.ad}
            onChange={(e) =>
              setFormData({ ...formData, ad: e.target.value })
            }
          />
        ) : activeSection === "crew" || activeSection === "esports" || activeSection === "influencer" ? (
          <>
            <input
              type="text"
              placeholder="Ad Soyad"
              value={formData.adSoyad}
              onChange={(e) =>
                setFormData({ ...formData, adSoyad: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Ünvan"
              value={formData.unvan}
              onChange={(e) =>
                setFormData({ ...formData, unvan: e.target.value })
              }
            />
            {activeSection === "esports" && (
              <>
                <div style={{ marginTop: "20px" }}>
                  <h4>Achievements Arka Plan</h4>
                  {formData.achievementsBgUrl ? (
                    <div className="image-preview">
                      <img
                        src={formData.achievementsBgUrl}
                        alt="Achievements BG"
                        width="200"
                        style={{ borderRadius: "10px", marginBottom: "10px" }}
                      />
                      <button
                        onClick={() =>
                          setFormData({ ...formData, achievementsBgUrl: "" })
                        }
                      >
                        🗑 Resmi Kaldır
                      </button>
                    </div>
                  ) : (
                    <>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setAchievementsFile(e.target.files[0])}
                      />
                      <button
                        onClick={() => handleUpload("achievements")}
                        disabled={loading}
                      >
                        {loading ? "Yükleniyor..." : "Achievements Yükle"}
                      </button>
                    </>
                  )}

                  <h4 style={{ marginTop: "20px" }}>Teams Arka Plan</h4>
                  {formData.teamsBgUrl ? (
                    <div className="image-preview">
                      <img
                        src={formData.teamsBgUrl}
                        alt="Teams BG"
                        width="200"
                        style={{ borderRadius: "10px", marginBottom: "10px" }}
                      />
                      <button
                        onClick={() => setFormData({ ...formData, teamsBgUrl: "" })}
                      >
                        🗑 Resmi Kaldır
                      </button>
                    </div>
                  ) : (
                    <>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setTeamsFile(e.target.files[0])}
                      />
                      <button
                        onClick={() => handleUpload("teams")}
                        disabled={loading}
                      >
                        {loading ? "Yükleniyor..." : "Teams Yükle"}
                      </button>
                    </>
                  )}

                  <h4 style={{ marginTop: "20px" }}>Takım Logoları</h4>
                  {formData.teamLogos && (
                    <div style={{ display: "flex", gap: "10px", marginTop: "10px", flexWrap: "wrap" }}>
                      {JSON.parse(formData.teamLogos).map((logo, i) => (
                        <img
                          key={i}
                          src={logo}
                          alt={`team-logo-${i}`}
                          width="60"
                          height="60"
                          style={{ borderRadius: "8px", objectFit: "cover" }}
                        />
                      ))}
                    </div>
                  )}
                  
                  <div style={{ marginTop: "10px" }}>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => setLogosFile(Array.from(e.target.files))}
                    />
                    <button
                      onClick={handleLogoUpload}
                      disabled={loading}
                    >
                      {loading ? "Yükleniyor..." : "Logoları Yükle"}
                    </button>
                  </div>
                </div>

                <input
                  type="text"
                  placeholder="Takım"
                  value={formData.takim}
                  onChange={(e) =>
                    setFormData({ ...formData, takim: e.target.value })
                  }
                />
                
                <textarea
                  placeholder="Başarılar (örnek: Turnuva 1. - 2023)"
                  value={formData.basarilar}
                  onChange={(e) =>
                    setFormData({ ...formData, basarilar: e.target.value })
                  }
                  rows={3}
                />
              </>
            )}
            
            {activeSection === "influencer" && (
              <>
                <input
                  type="text"
                  placeholder="YouTube Takipçi"
                  value={formData.youtubeTakipci}
                  onChange={(e) =>
                    setFormData({ ...formData, youtubeTakipci: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Twitter Takipçi"
                  value={formData.twitterTakipci}
                  onChange={(e) =>
                    setFormData({ ...formData, twitterTakipci: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Instagram Takipçi"
                  value={formData.instagramTakipci}
                  onChange={(e) =>
                    setFormData({ ...formData, instagramTakipci: e.target.value })
                  }
                />
                {/* EKSİK OLAN URL ALANLARI */}
                <input
                  type="text"
                  placeholder="YouTube URL"
                  value={formData.youtubeUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, youtubeUrl: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Instagram URL"
                  value={formData.instagramUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, instagramUrl: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Twitter URL"
                  value={formData.twitterUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, twitterUrl: e.target.value })
                  }
                />
              </>
            )}
            
            <textarea
              placeholder="Kısa Açıklama"
              value={formData.aciklama}
              onChange={(e) =>
                setFormData({ ...formData, aciklama: e.target.value })
              }
            />
            <textarea
              placeholder="Detaylı Açıklama"
              value={formData.detay}
              onChange={(e) =>
                setFormData({ ...formData, detay: e.target.value })
              }
              rows={5}
            />
            {activeSection === "crew" && (
              <input
                type="text"
                placeholder="Diller (örnek: 🇹🇷 🇬🇧 🇩🇪)"
                value={formData.diller}
                onChange={(e) =>
                  setFormData({ ...formData, diller: e.target.value })
                }
              />
            )}
           
            <input
              type="text"
              placeholder="Instagram URL"
              value={formData.instagram}
              onChange={(e) =>
                setFormData({ ...formData, instagram: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="YouTube URL"
              value={formData.youtube}
              onChange={(e) =>
                setFormData({ ...formData, youtube: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="TikTok URL"
              value={formData.tiktok}
              onChange={(e) =>
                setFormData({ ...formData, tiktok: e.target.value })
              }
            />
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Başlık"
              value={formData.baslik}
              onChange={(e) =>
                setFormData({ ...formData, baslik: e.target.value })
              }
            />

            {activeSection === "servis" && (
              <>
                <textarea
                  placeholder="Özet"
                  value={formData.ozet}
                  onChange={(e) =>
                    setFormData({ ...formData, ozet: e.target.value })
                  }
                />
                <textarea
                  placeholder="Servis Detay (detay sayfasında gözükecek)"
                  value={formData.detay}
                  onChange={(e) =>
                    setFormData({ ...formData, detay: e.target.value })
                  }
                  rows={6}
                />
              </>
            )}

            {activeSection === "etkinlik" && (
              <>
                <textarea
                  placeholder="Kısa Açıklama (ana sayfada gözükecek)"
                  value={formData.aciklama}
                  onChange={(e) =>
                    setFormData({ ...formData, aciklama: e.target.value })
                  }
                  rows={3}
                />
                <textarea
                  placeholder="Detaylı Açıklama (detay sayfasında gözükecek)"
                  value={formData.detay}
                  onChange={(e) =>
                    setFormData({ ...formData, detay: e.target.value })
                  }
                  rows={8}
                />
              </>
            )}

            {activeSection === "haber" && (
              <>
                <textarea
                  placeholder="Kısa Açıklama (ana sayfada gözükecek)"
                  value={formData.aciklama}
                  onChange={(e) =>
                    setFormData({ ...formData, aciklama: e.target.value })
                  }
                  rows={3}
                />
                <textarea
                  placeholder="Detaylı Açıklama (Read More sayfasında gözükecek)"
                  value={formData.detay}
                  onChange={(e) =>
                    setFormData({ ...formData, detay: e.target.value })
                  }
                  rows={8}
                />
              </>
            )}

            {activeSection === "altservis" && (
              <textarea
                placeholder="Açıklama"
                value={formData.aciklama}
                onChange={(e) =>
                  setFormData({ ...formData, aciklama: e.target.value })
                }
              />
            )}
          </>
        )}

        {/* 🔹 Görsel Yükleme */}
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
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
              />
              <button onClick={() => handleUpload("main")} disabled={loading}>
                {loading ? "Yükleniyor..." : "Resmi Yükle"}
              </button>
            </>
          )}
        </div>

        <button onClick={handleAddOrUpdate}>
          {isEditing ? "Güncelle" : "Kaydet"}
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;