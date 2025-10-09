import React, { useEffect, useState } from "react";
import {
  getEtkinlikler,
  getSponsorlar,
  getServisler,
  getHaberler,
} from "../services/ApiService";
import "../App.css";

const AdminDashboard = () => {
  const [etkinlikler, setEtkinlikler] = useState([]);
  const [sponsorlar, setSponsorlar] = useState([]);
  const [servisler, setServisler] = useState([]);
  const [haberler, setHaberler] = useState([]);

  useEffect(() => {
    getEtkinlikler().then((r) => setEtkinlikler(r.data));
    getSponsorlar().then((r) => setSponsorlar(r.data));
    getServisler().then((r) => setServisler(r.data));
    getHaberler().then((r) => setHaberler(r.data));
  }, []);

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      <section>
        <h3>Etkinlikler</h3>
        <ul>
          {etkinlikler.map((e) => (
            <li key={e.id}>
              {e.baslik}
              <button>Düzenle</button>
              <button>Sil</button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3>Sponsorlar</h3>
        <ul>
          {sponsorlar.map((s) => (
            <li key={s.id}>
              {s.ad}
              <button>Düzenle</button>
              <button>Sil</button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3>Servisler</h3>
        <ul>
          {servisler.map((srv) => (
            <li key={srv.id}>
              {srv.baslik}
              <button>Düzenle</button>
              <button>Sil</button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3>Haberler</h3>
        <ul>
          {haberler.map((h) => (
            <li key={h.id}>
              {h.baslik}
              <button>Düzenle</button>
              <button>Sil</button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default AdminDashboard;
