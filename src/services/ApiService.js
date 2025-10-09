import axios from "axios";

// 🌐 Backend API base URL (örnek: http://localhost:8080/api)
const API_URL = process.env.REACT_APP_API_URL;

// ✅ ETKİNLİKLER
export const getEtkinlikler = () => axios.get(`${API_URL}/etkinlikler`);

// ✅ SPONSORLAR
export const getSponsorlar = () => axios.get(`${API_URL}/sponsorlar`);

// ✅ SERVİSLER
export const getServisler = () => axios.get(`${API_URL}/servisler`);

// ✅ HABERLER
export const getHaberler = () => axios.get(`${API_URL}/haberler`);

// ✅ AYARLAR (Footer Bilgileri)
export const getAyarlar = () => axios.get(`${API_URL}/ayarlar`);

// ✅ ALT SERVİSLER (Our comprehensive range of services)
export const getAltServisler = () => axios.get(`${API_URL}/altservisler`);

// ✅ ADMIN LOGIN (isteğe bağlı)
export const login = (kullaniciAdi, sifre) =>
  axios.post(`${API_URL}/kullanicilar/login`, { kullaniciAdi, sifre });
