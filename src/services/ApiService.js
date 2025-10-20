import axios from "axios";

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

    // 🔹 Boyutlandırma değerleri (yakınlaşma yok, yüksek kalite)
    const sizeMap = {
      etkinlik: "w_1920,h_1080,c_fit",
      haber: "w_1200,h_700,c_fit",
      servis: "w_600,h_400,c_fit",
      altservis: "w_400,h_400,c_fit",
      sponsor: "w_300,h_150,c_fit",
      genel: "w_800,h_500,c_fit",
    };

    const transform = sizeMap[type] || sizeMap.genel;

    // 🔹 URL güvenli dönüştürme + kalite
    let transformedUrl = originalUrl;
    if (originalUrl.includes("/upload/")) {
      transformedUrl = originalUrl.replace(
        "/upload/",
        `/upload/${transform},q_auto:best,f_auto/`
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
