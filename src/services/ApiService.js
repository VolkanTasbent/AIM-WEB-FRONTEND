import axios from "axios";

// Vercel/Railway: REACT_APP_API_URL must end with /api (e.g. https://host.up.railway.app/api).
// Calls use `${API_URL}/ayarlar` → .../api/ayarlar. Host-only base breaks with Spring context path /api.
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api";

export const uploadToCloudinary = async (file, type = "genel") => {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "aimagency_preset");
  data.append("folder", `aimagency/${type}`);

  try {
    const res = await fetch("https://api.cloudinary.com/v1_1/dedurnabu/image/upload", {
      method: "POST",
      body: data,
    });

    const json = await res.json();
    if (!res.ok || !json.secure_url) {
      console.error("Cloudinary yanıtı:", json);
      throw new Error(json.error?.message || "Cloudinary yüklemesi başarısız!");
    }

    const originalUrl = json.secure_url;

    // 🔹 Portfolio ve Çekimler için ORİJİNAL resmi kullan (hiç dönüştürme yok - maksimum netlik)
    if (type === "genel" || type === "portfolio" || type === "cekim") {
      console.log("🟢 Cloudinary yükleme başarılı (ORİJİNAL - YÜKSEK ÇÖZÜNÜRLÜK):");
      console.log("   URL:", originalUrl);
      return originalUrl; // ORİJİNAL RESMI DÖNDÜR
    }

    // 🔹 Diğer tipler için boyutlandırma
    const sizeMap = {
      etkinlik: "w_1920,h_1080,c_fit",
      haber: "w_1200,h_700,c_fit",
      servis: "w_600,h_400,c_fit",
      altservis: "w_400,h_400,c_fit",
      sponsor: "w_300,h_150,c_fit",
      logos: "w_200,h_200,c_fit",
    };

    const transform = sizeMap[type] || "w_1600,h_1200,c_fit";

    let transformedUrl = originalUrl;
    if (originalUrl.includes("/upload/")) {
      transformedUrl = originalUrl.replace(
        "/upload/",
        `/upload/${transform},q_100,f_auto/`
      );
    }

    console.log("🟢 Cloudinary yükleme başarılı:");
    console.log("   Orijinal:", originalUrl);
    console.log("   Dönüştürülmüş:", transformedUrl);

    return transformedUrl;
  } catch (err) {
    console.error("Cloudinary hata:", err);
    throw new Error("Resim yüklenemedi: " + err.message);
  }
};

// API Çağrıları
export const getEtkinlikler = () => axios.get(`${API_URL}/etkinlikler`, {
  headers: { "Cache-Control": "no-cache" },
});
export const getHaberler = () => axios.get(`${API_URL}/haberler`);
export const getServisler = () => axios.get(`${API_URL}/servisler`);
export const getAltServisler = () => axios.get(`${API_URL}/alt-servisler`);
export const getSponsorlar = () => axios.get(`${API_URL}/sponsorlar`);
export const getAyarlar = () => axios.get(`${API_URL}/ayarlar`);
export const login = (kullaniciAdi, sifre) =>
  axios.post(`${API_URL}/kullanicilar/login`, { kullaniciAdi, sifre });
export const getCrew = () => axios.get(`${API_URL}/crew`);
export const addCrew = (data) => axios.post(`${API_URL}/crew`, data);
export const updateCrew = (id, data) => axios.put(`${API_URL}/crew/${id}`, data);
export const deleteCrew = (id) => axios.delete(`${API_URL}/crew/${id}`);
export const getEsportsPlayers = () => axios.get(`${API_URL}/esports`);
export const getEsportsPlayerById = (id) => axios.get(`${API_URL}/esports/${id}`);
