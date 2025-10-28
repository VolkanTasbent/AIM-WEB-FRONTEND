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
  const [videos, setVideos] = useState([]);
  const [shoots, setShoots] = useState([]);
  const [portfolios, setPortfolios] = useState([]);

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
    // 🔹 Yeni medya alanları
    videoBaslik: "",
    videoAciklama: "",
    videoImageUrl: "",
    shootBaslik: "",
    shootAciklama: "",
    shootImageUrl: "",
    portfolioTakim: "",
    portfolioUrls: [],
    portfolioLogo: "",
    videoUrl: ""
  });

  const [file, setFile] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
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
    axios.get(`${API_URL}/videos`).then((r) => setVideos(r.data.sort((a, b) => a.id - b.id))).catch(err => console.error("Videolar yüklenemedi:", err));
    axios.get(`${API_URL}/shoots`).then((r) => setShoots(r.data.sort((a, b) => a.id - b.id))).catch(err => console.error("Çekimler yüklenemedi:", err));
    axios.get(`${API_URL}/portfolio`).then((r) => setPortfolios(r.data.sort((a, b) => a.id - b.id))).catch(err => console.error("Portfolyo yüklenemedi:", err));
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

  // 🔹 Medya Yükleme Fonksiyonları
  const handleMediaUpload = async (type) => {
    let selectedFile = null;
    if (type === "video") selectedFile = file;
    else if (type === "shoot") selectedFile = achievementsFile;

    if (!selectedFile) return alert("Lütfen dosya seçin!");

    setLoading(true);
    try {
      // 🔹 Cloudinary ile yükleme - çekimler için "cekim" tipi kullan (yüksek çözünürlük)
      const uploadType = type === "shoot" ? "cekim" : "genel";
      const url = await uploadToCloudinary(selectedFile, uploadType);
      
      if (type === "video")
        setFormData((prev) => ({ ...prev, videoImageUrl: url }));
      else if (type === "shoot")
        setFormData((prev) => ({ ...prev, shootImageUrl: url }));
      
      alert("Dosya başarıyla yüklendi ✅");
    } catch (err) {
      console.error("Upload hatası:", err);
      alert("Dosya yüklenirken hata oluştu ❌");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Video Kaydet/Güncelle
  const addVideo = async () => {
    if (!formData.videoBaslik || !formData.videoImageUrl)
      return alert("Başlık ve görsel zorunlu!");
    
    try {
      const data = {
        title: formData.videoBaslik,
        description: formData.videoAciklama,
        imageUrl: formData.videoImageUrl,
        videoUrl: formData.videoUrl || "",
        // Backend uyumluluğu için thumbnailUrl olarak da gönder
        thumbnailUrl: formData.videoImageUrl,
        videoImageUrl: formData.videoImageUrl,
      };

      if (isEditing && formData.id) {
        await axios.put(`${API_URL}/videos/${formData.id}`, data);
        alert("Video güncellendi ✅");
      } else {
        await axios.post(`${API_URL}/videos`, data);
        alert("Video eklendi ✅");
      }
      
      // Listeyi yenile ve ID'ye göre sırala
      const res = await axios.get(`${API_URL}/videos`);
      const sortedData = res.data.sort((a, b) => a.id - b.id);
      setVideos(sortedData);
      
      // Formu temizle
      setFormData(prev => ({
        ...prev,
        videoBaslik: "",
        videoAciklama: "",
        videoImageUrl: "",
        videoUrl: ""
      }));
      setFile(null);
      setIsEditing(false);
    } catch (err) {
      console.error("Video ekleme hatası:", err);
      alert("Video eklenirken hata oluştu ❌");
    }
  };

  // 🔹 Çekim Kaydet/Güncelle
  const addShoot = async () => {
    if (!formData.shootBaslik || !formData.shootImageUrl)
      return alert("Başlık ve fotoğraf zorunlu!");
    
    try {
      const data = {
        title: formData.shootBaslik,
        description: formData.shootAciklama,
        imageUrl: formData.shootImageUrl,
        // Backend uyumluluğu için shootImageUrl olarak da gönder
        shootImageUrl: formData.shootImageUrl,
      };

      if (isEditing && formData.id) {
        await axios.put(`${API_URL}/shoots/${formData.id}`, data);
        alert("Çekim güncellendi ✅");
      } else {
        await axios.post(`${API_URL}/shoots`, data);
        alert("Çekim eklendi ✅");
      }
      
      // Listeyi yenile ve ID'ye göre sırala
      const res = await axios.get(`${API_URL}/shoots`);
      const sortedData = res.data.sort((a, b) => a.id - b.id);
      setShoots(sortedData);
      
      // Formu temizle
      setFormData(prev => ({
        ...prev,
        shootBaslik: "",
        shootAciklama: "",
        shootImageUrl: ""
      }));
      setAchievementsFile(null);
      setIsEditing(false);
    } catch (err) {
      console.error("Çekim ekleme hatası:", err);
      alert("Çekim eklenirken hata oluştu ❌");
    }
  };

  // 🔹 Portföy Resim Yükleme
  const handlePortfolioUpload = async () => {
    if (!logosFile || logosFile.length === 0)
      return alert("Lütfen görselleri seçin!");

    console.log("🚀 Yükleme başladı - Dosya sayısı:", logosFile.length);

    // 🔹 Maksimum 12 görsel kontrolü
    if (logosFile.length > 12) {
      alert("Maksimum 12 görsel seçebilirsiniz!");
      return;
    }

    setLoading(true);
    try {
      // 🔹 Önce mevcut portfolioUrls'i kesinlikle temizle
      setFormData((prev) => {
        console.log("🧹 Eski portfolioUrls temizleniyor:", prev.portfolioUrls?.length || 0);
        return { ...prev, portfolioUrls: [] };
      });
      
      // 🔹 Cloudinary ile çoklu yükleme (paralel)
      console.log("☁️ Cloudinary'e yükleniyor...");
      const uploadPromises = logosFile.map((file, index) => {
        console.log(`  Yükleniyor ${index + 1}/${logosFile.length}`);
        return uploadToCloudinary(file, "genel");
      });
      
      const uploadedUrls = await Promise.all(uploadPromises);
      console.log("✅ Yükleme tamamlandı - URL sayısı:", uploadedUrls.length);
      console.log("📋 Yüklenen URL'ler:", uploadedUrls);
      
      // 🔹 Unique URL'ler (tekrarları temizle)
      const uniqueUrls = [...new Set(uploadedUrls)];
      console.log("🔄 Unique URL sayısı:", uniqueUrls.length);
      
      if (uniqueUrls.length !== uploadedUrls.length) {
        console.warn("⚠️ Tekrarlayan URL'ler bulundu!");
      }

      // 🔹 Yeni URL'leri set et
      setFormData((prev) => {
        console.log("📝 Yeni URL'ler set ediliyor:", uniqueUrls.length);
        return { ...prev, portfolioUrls: uniqueUrls };
      });
      
      alert(`${uniqueUrls.length} adet görsel başarıyla yüklendi ✅`);

    } catch (err) {
      console.error("❌ Portföy yükleme hatası:", err);
      alert("Görsel yüklenirken hata oluştu ❌");
    } finally {
      setLoading(false);
      // 🔹 File input'u temizle
      setLogosFile(null);
    }
  };

  // 🔹 Portfolio Logo Yükleme
  const handlePortfolioLogoUpload = async () => {
    console.log("🔍 Logo upload başladı");
    console.log("📁 logoFile:", logoFile);
    
    if (!logoFile) {
      console.error("❌ logoFile boş!");
      return alert("Lütfen logo seçin!");
    }

    setLoading(true);
    try {
      console.log("☁️ Cloudinary'e yükleniyor...");
      const url = await uploadToCloudinary(logoFile, "logos");
      console.log("✅ Logo URL:", url);
      setFormData((prev) => ({ ...prev, portfolioLogo: url }));
      alert("Logo başarıyla yüklendi ✅");
    } catch (err) {
      console.error("Logo yükleme hatası:", err);
      alert("Logo yüklenirken hata oluştu ❌");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Portföy Kaydet/Güncelle
  const addPortfolio = async () => {
    if (!formData.portfolioTakim || !formData.portfolioUrls || formData.portfolioUrls.length === 0)
      return alert("Takım adı ve görseller zorunlu!");
    
    try {
      // 🔹 portfolioUrls'i kontrol et
      let urls = Array.isArray(formData.portfolioUrls) ? formData.portfolioUrls : [];
      console.log("📋 Kaydedilecek URL'ler:", urls);
      console.log("📊 URL sayısı:", urls.length);
      
      if (urls.length > 12) {
        console.error("⚠️ UYARI: 12'den fazla URL var! İlk 12'si alınıyor.");
        urls = urls.slice(0, 12);
      }
      
      const data = {
        team: formData.portfolioTakim,
        imageUrl: urls.join(","),  // 🔹 Backend Java model'i imageUrl bekliyor
        logo: formData.portfolioLogo || null,  // 🔹 Boş string yerine null gönder
      };

      console.log("📤 Backend'e gönderiliyor - URL sayısı:", urls.length);
      console.log("📤 Data objesi:", data);
      console.log("📤 imageUrl length:", data.imageUrl.length);
      console.log("📤 Logo:", data.logo ? "VAR ✅" : "YOK ❌");

      if (isEditing && formData.id) {
        await axios.put(`${API_URL}/portfolio/${formData.id}`, data);
        alert("Portföy güncellendi ✅");
      } else {
        await axios.post(`${API_URL}/portfolio`, data);
        alert("Portföy kaydedildi ✅");
      }
      
      // Listeyi yenile ve ID'ye göre sırala
      const res = await axios.get(`${API_URL}/portfolio`);
      const sortedData = res.data.sort((a, b) => a.id - b.id);
      setPortfolios(sortedData);
      
      // Formu tamamen temizle
      setFormData(prev => ({
        ...prev,
        portfolioTakim: "",
        portfolioUrls: [],
        portfolioLogo: "",
        videoUrl: ""
      }));
      setLogosFile(null);
      setLogoFile(null);
      setIsEditing(false);
    } catch (err) {
      console.error("Portföy kaydetme hatası:", err);
      alert("Portföy kaydedilirken hata oluştu ❌");
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
    // 👇 isimleri backend'e uygun hale getir
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
        videoBaslik: "",
        videoAciklama: "",
        videoImageUrl: "",
        shootBaslik: "",
        shootAciklama: "",
        shootImageUrl: "",
        portfolioTakim: "",
        portfolioUrls: []
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
      videoBaslik: "",
      videoAciklama: "",
      videoImageUrl: "",
      shootBaslik: "",
      shootAciklama: "",
      shootImageUrl: "",
      portfolioTakim: "",
      portfolioUrls: [],
      portfolioLogo: "",
      videoUrl: ""
    });
    setImageUrl("");
    setFile(null);
    setAchievementsFile(null);
    setTeamsFile(null);
    setLogosFile(null);
    setLogoFile(null);
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

  // 🔹 Medya Düzenleme
  const handleEditMedia = (type, item) => {
    if (!item || !item.id) {
      alert("Bu kaydın ID bilgisi bulunamadı!");
      return;
    }

    if (type === "video") {
      setFormData({
        id: Number(item.id),
        videoBaslik: item.title || "",
        videoAciklama: item.description || "",
        videoImageUrl: item.videoImageUrl || item.imageUrl || item.thumbnailUrl || "",
        videoUrl: item.videoUrl || "",
      });
      setFile(null); // Dosya alanını temizle
    } else if (type === "shoot") {
      setFormData({
        id: Number(item.id),
        shootBaslik: item.title || "",
        shootAciklama: item.description || "",
        shootImageUrl: item.shootImageUrl || item.imageUrl || "",
      });
      setAchievementsFile(null);
    } else if (type === "portfolio") {
      // 🔹 Portfolio verilerini temizle ve set et
      const imageUrl = item.imageUrl || item.image_url; // Backend uyumluluğu
      
      // 🔹 Akıllı URL parse - Cloudinary URL'lerindeki virgülleri dikkate al
      let imageUrls = [];
      if (imageUrl) {
        const parts = imageUrl.split(',');
        let currentUrl = '';
        
        for (let i = 0; i < parts.length; i++) {
          const part = parts[i].trim();
          
          // Yeni URL başlıyor mu? (https:// ile başlar)
          if (part.startsWith('https://')) {
            // Önceki URL'i kaydet
            if (currentUrl && (currentUrl.includes('.jpg') || currentUrl.includes('.jpeg') || 
                currentUrl.includes('.png') || currentUrl.includes('.webp') || currentUrl.includes('.gif'))) {
              imageUrls.push(currentUrl.trim());
            }
            currentUrl = part;
          } else if (currentUrl) {
            // URL'in devamı (transform parametreleri)
            currentUrl += ',' + part;
          }
        }
        
        // Son URL'i kaydet
        if (currentUrl && (currentUrl.includes('.jpg') || currentUrl.includes('.jpeg') || 
            currentUrl.includes('.png') || currentUrl.includes('.webp') || currentUrl.includes('.gif'))) {
          imageUrls.push(currentUrl.trim());
        }
      }
      
      console.log("📂 Portfolio düzenleniyor:", item.team);
      console.log("📂 Ham imageUrl:", imageUrl);
      console.log("📂 Parse edilen URL sayısı:", imageUrls.length);
      console.log("📂 İlk 2 URL:", imageUrls.slice(0, 2));
      
      setFormData({
        id: Number(item.id),
        portfolioTakim: item.team || "",
        portfolioUrls: imageUrls.slice(0, 12), // Maksimum 12 al
        portfolioLogo: item.logo || "",
      });
      setLogosFile(null);
      setLogoFile(null);
    }

    setIsEditing(true);
  };

  // 🔹 Medya Silme
  const handleDeleteMedia = async (type, id) => {
    if (!window.confirm("Silmek istediğine emin misin?")) return;

    try {
      if (type === "video") {
        await axios.delete(`${API_URL}/videos/${id}`);
        setVideos(videos.filter((v) => v.id !== id));
      } else if (type === "shoot") {
        await axios.delete(`${API_URL}/shoots/${id}`);
        setShoots(shoots.filter((s) => s.id !== id));
      } else if (type === "portfolio") {
        await axios.delete(`${API_URL}/portfolio/${id}`);
        setPortfolios(portfolios.filter((p) => p.id !== id));
      }
      alert("Silindi ✅");
    } catch (err) {
      console.error("Silme hatası:", err);
      alert("Silinirken hata oluştu ❌");
    }
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
          "medya" // 🔹 yeni sekme
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
              : sec === "influencer"
              ? "Influencerlar"
              : sec === "medya"
              ? "Medya Yönetimi"
              : ""}
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
            : activeSection === "medya"
            ? "Medya Yönetimi"
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
            : activeSection === "influencer"
            ? influencers
            : []) // Medya için boş
          .map((item) => (
            <li key={item.id}>
              <b>{item.baslik || item.adSoyad || item.ad || item.title}</b>
              {activeSection !== "medya" && (
                <>
                  <button onClick={() => handleEdit(item)}>✏️ Düzenle</button>
                  <button onClick={() => handleDelete(item.id)}>🗑 Sil</button>
                </>
              )}
            </li>
          ))}
        </ul>
        
        {/* Medya Listesi */}
        {activeSection === "medya" && (
          <>
            <h4>Videolar</h4>
            <ul>
              {videos.map((item) => (
                <li key={item.id}>
                  <b>{item.title}</b>
                  <button onClick={() => handleDeleteMedia("video", item.id)}>🗑 Sil</button>
                </li>
              ))}
            </ul>
            
            <h4>Çekimler</h4>
            <ul>
              {shoots.map((item) => (
                <li key={item.id}>
                  <b>{item.title}</b>
                  <button onClick={() => handleDeleteMedia("shoot", item.id)}>🗑 Sil</button>
                </li>
              ))}
            </ul>
            
            <h4>Portfolyo</h4>
            <ul>
              {portfolios.map((item) => (
                <li key={item.id}>
                  <b>{item.team}</b>
                  <button onClick={() => handleEditMedia("portfolio", item)}>✏️ Düzenle</button>
                  <button onClick={() => handleDeleteMedia("portfolio", item.id)}>🗑 Sil</button>
                </li>
              ))}
            </ul>
          </>
        )}
        
      </section>

      {/* 🔹 Form */}
      <div className="admin-form">
        <h4>
          {isEditing
            ? `${activeSection} Güncelle`
            : activeSection === "medya" 
              ? "Medya İçerik Ekle"
              : `Yeni ${activeSection} Ekle`}
        </h4>

        {/* 🔹 MEDYA YÖNETİMİ - YENİ EKLENEN KISIM */}
        {activeSection === "medya" && (
          <div className="media-section">
            {/* Mevcut Videolar Listesi */}
            <h3 style={{color: '#333', fontSize: '1.3rem', marginBottom: '10px'}}>📹 Mevcut Videolar</h3>
            {videos.length > 0 ? (
              <ul style={{background: '#f5f5f5', padding: '15px', borderRadius: '5px', marginBottom: '20px', listStyle: 'none'}}>
                {videos.map((item) => (
                  <li key={item.id} style={{marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', background: 'white', borderRadius: '5px'}}>
                    <b style={{flex: 1, color: '#333', fontSize: '1rem'}}>{item.title}</b>
                    <button 
                      onClick={() => handleEditMedia("video", item)} 
                      style={{padding: '8px 15px', background: '#5c2a86', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold'}}
                    >
                      ✏️ Düzenle
                    </button>
                    <button 
                      onClick={() => handleDeleteMedia("video", item.id)} 
                      style={{padding: '8px 15px', background: '#ff4444', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold'}}
                    >
                      🗑 Sil
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{color: '#666', marginBottom: '20px', fontSize: '0.95rem'}}>Henüz video eklenmemiş.</p>
            )}

            {/* Mevcut Çekimler Listesi */}
            <h3 style={{color: '#333', fontSize: '1.3rem', marginBottom: '10px'}}>📸 Mevcut Çekimler</h3>
            {shoots.length > 0 ? (
              <ul style={{background: '#f5f5f5', padding: '15px', borderRadius: '5px', marginBottom: '20px', listStyle: 'none'}}>
                {shoots.map((item) => (
                  <li key={item.id} style={{marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', background: 'white', borderRadius: '5px'}}>
                    <b style={{flex: 1, color: '#333', fontSize: '1rem'}}>{item.title}</b>
                    <button 
                      onClick={() => handleEditMedia("shoot", item)} 
                      style={{padding: '8px 15px', background: '#5c2a86', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold'}}
                    >
                      ✏️ Düzenle
                    </button>
                    <button 
                      onClick={() => handleDeleteMedia("shoot", item.id)} 
                      style={{padding: '8px 15px', background: '#ff4444', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold'}}
                    >
                      🗑 Sil
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{color: '#666', marginBottom: '20px', fontSize: '0.95rem'}}>Henüz çekim eklenmemiş.</p>
            )}

            <hr style={{margin: '30px 0'}} />
            <h3>🎬 Yeni Video Ekle</h3>

            {/* --- Video Ekleme --- */}
            <input
              type="text"
              placeholder="Video Başlık"
              value={formData.videoBaslik || ""}
              onChange={(e) =>
                setFormData({ ...formData, videoBaslik: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Video Açıklama"
              value={formData.videoAciklama || ""}
              onChange={(e) =>
                setFormData({ ...formData, videoAciklama: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Video URL (YouTube linki - örn: https://www.youtube.com/watch?v=ABC123)"
              value={formData.videoUrl || ""}
              onChange={(e) => {
                const url = e.target.value;
                setFormData({ ...formData, videoUrl: url });
                
                // YouTube URL'den otomatik YÜKSEK KALİTE thumbnail çek
                const videoIdMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
                if (videoIdMatch) {
                  const videoId = videoIdMatch[1];
                  // maxresdefault = En yüksek kalite (1920x1080)
                  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
                  setFormData(prev => ({ 
                    ...prev, 
                    videoUrl: url,
                    videoImageUrl: thumbnailUrl 
                  }));
                  console.log("🎬 YouTube Thumbnail otomatik alındı (YÜKSEK KALİTE):", thumbnailUrl);
                }
              }}
            />
            {formData.videoImageUrl && (
              <div style={{marginTop: '10px', marginBottom: '10px', padding: '10px', background: '#f0f0f0', borderRadius: '5px'}}>
                <p><strong>✅ Thumbnail Önizleme:</strong></p>
                <img src={formData.videoImageUrl} alt="Preview" style={{width: '300px', borderRadius: '5px', marginTop: '5px'}} />
              </div>
            )}
            <p style={{fontSize: '0.85rem', color: '#666', margin: '10px 0'}}>
              💡 YouTube linkini yapıştırdığınızda thumbnail otomatik alınır. Manuel değiştirmek isterseniz:
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <button onClick={() => handleMediaUpload("video")} disabled={loading}>
              {loading ? "Yükleniyor..." : "Manuel Thumbnail Yükle (opsiyonel)"}
            </button>
            <button onClick={addVideo} disabled={loading} style={{marginTop: '10px'}}>
              {loading ? "Kaydediliyor..." : isEditing ? "Videoyu Güncelle" : "Videoyu Kaydet"}
            </button>

            <hr />

            {/* --- Çekim Ekleme --- */}
            <h4>📸 Çekim Ekle</h4>
            <input
              type="text"
              placeholder="Çekim Başlık"
              value={formData.shootBaslik || ""}
              onChange={(e) =>
                setFormData({ ...formData, shootBaslik: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Çekim Açıklama"
              value={formData.shootAciklama || ""}
              onChange={(e) =>
                setFormData({ ...formData, shootAciklama: e.target.value })
              }
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setAchievementsFile(e.target.files[0])}
            />
            <button onClick={() => handleMediaUpload("shoot")} disabled={loading}>
              {loading ? "Yükleniyor..." : "Çekim Fotoğrafı Yükle"}
            </button>
            {formData.shootImageUrl && (
              <div style={{marginTop: '10px'}}>
                <img src={formData.shootImageUrl} alt="Preview" width="100" />
              </div>
            )}
            <button onClick={addShoot} disabled={loading} style={{marginTop: '10px'}}>
              {loading ? "Kaydediliyor..." : isEditing ? "Çekimi Güncelle" : "Çekimi Kaydet"}
            </button>

            <hr />

            {/* --- Portföy Yükleme --- */}
            <h4>🖼 Portföy Görselleri</h4>
            <input
              type="text"
              placeholder="Takım Adı"
              value={formData.portfolioTakim || ""}
              onChange={(e) =>
                setFormData({ ...formData, portfolioTakim: e.target.value })
              }
            />
                          <input
              type="file"
              accept="image/*"
              multiple
              key={formData.portfolioUrls?.length || 0}
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                console.log("📁 Seçilen dosya sayısı:", files.length);
                
                // Maksimum 12 dosya kontrolü
                if (files.length > 12) {
                  alert("Maksimum 12 görsel seçebilirsiniz!");
                  e.target.value = ''; // Input'u temizle
                  return;
                }
                
                // Önceki dosyaları temizle
                setLogosFile(null);
                setFormData(prev => ({ ...prev, portfolioUrls: [] }));
                
                // Yeni dosyaları set et
                setLogosFile(files);
                console.log("✅ LogosFile set edildi:", files.length);
              }}
            />
            <button onClick={handlePortfolioUpload} disabled={loading}>
              {loading ? "Yükleniyor..." : "12 Görseli Yükle"}
            </button>
            {formData.portfolioUrls && formData.portfolioUrls.length > 0 && (
              <div style={{marginTop: '10px', padding: '10px', background: '#f0f0f0', borderRadius: '5px'}}>
                <p><strong>✅ {formData.portfolioUrls.length} adet görsel yüklendi</strong></p>
                {/* Görsel önizlemeleri */}
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginTop: '10px'}}>
                  {formData.portfolioUrls.slice(0, 12).map((url, idx) => (
                    <img 
                      key={idx} 
                      src={url} 
                      alt={`Portfolio ${idx + 1}`} 
                      style={{width: '100%', height: '80px', objectFit: 'cover', borderRadius: '4px'}}
                    />
                  ))}
                </div>
                <button 
                  onClick={() => {
                    console.log("🗑️ Temizleniyor - Mevcut URL sayısı:", formData.portfolioUrls.length);
                    setFormData(prev => ({ ...prev, portfolioUrls: [] }));
                    setLogosFile(null);
                  }}
                  style={{padding: '5px 10px', background: '#ff4444', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', marginTop: '10px'}}
                >
                  Temizle ve Yeniden Başla
                </button>
              </div>
            )}

            <hr style={{margin: '20px 0'}} />
            <h4>Portfolio Logo</h4>
            {formData.portfolioLogo && (
              <div style={{marginTop: '10px', marginBottom: '10px', padding: '10px', background: '#f0f0f0', borderRadius: '5px'}}>
                <p><strong>Mevcut Logo:</strong></p>
                <img src={formData.portfolioLogo} alt="Logo" width="100" />
                <br />
                <button 
                  onClick={async () => {
                    if (!window.confirm("Logoyu silmek istediğinize emin misiniz?")) return;
                    
                    console.log("🗑️ Logo siliniyor");
                    setFormData(prev => ({ ...prev, portfolioLogo: "" }));
                    setLogoFile(null);
                    
                    // Eğer düzenleme modundaysa backend'i de güncelle
                    if (isEditing && formData.id) {
                      try {
                        await axios.put(`${API_URL}/portfolio/${formData.id}`, {
                          team: formData.portfolioTakim,
                          imageUrl: formData.portfolioUrls.join(","),
                          logo: "" // Boş logo gönder
                        });
                        alert("Logo silindi ✅");
                        
                        // Listeyi yenile
                        const res = await axios.get(`${API_URL}/portfolio`);
                        setPortfolios(res.data);
                      } catch (err) {
                        console.error("Logo silme hatası:", err);
                        alert("Logo silinirken hata oluştu ❌");
                      }
                    }
                  }}
                  style={{marginTop: '10px', padding: '5px 10px', background: '#ff4444', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer'}}
                >
                  Logoyu Sil
                </button>
              </div>
            )}
            <p style={{fontSize: '0.9rem', color: '#666', marginBottom: '5px'}}>
              {logoFile ? `✅ Seçilen: ${logoFile.name}` : "Yeni logo seçin (isteğe bağlı)"}
            </p>
            <div style={{display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px'}}>
              <input
                type="file"
                accept="image/*"
                key={formData.portfolioLogo || 'logo-input'} // Force re-render
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  console.log("📁 Logo dosyası seçildi:", file);
                  if (file) {
                    setLogoFile(file);
                  }
                }}
              />
              <button 
                onClick={handlePortfolioLogoUpload} 
                disabled={loading || !logoFile}
                style={{
                  padding: '8px 15px',
                  background: logoFile ? '#5c2a86' : '#ccc',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: logoFile ? 'pointer' : 'not-allowed',
                  opacity: logoFile ? 1 : 0.6
                }}
              >
                {loading ? "Yükleniyor..." : "Logoyu Yükle"}
              </button>
            </div>
            <button onClick={addPortfolio} disabled={loading} style={{marginTop: '10px'}}>
              {loading ? "Kaydediliyor..." : isEditing ? "Portföyü Güncelle" : "Portföyü Kaydet"}
            </button>
          </div>
        )}

        {/* 🔹 DİĞER FORMLAR (MEVCUT KOD - DEĞİŞMEDİ) */}
        {activeSection !== "medya" && (
          <>
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
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;