import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getHaberler } from "../services/ApiService";
import "../App.css";

const HaberDetay = () => {
  const { id } = useParams();
  const [haber, setHaber] = useState(null);

  useEffect(() => {
    getHaberler().then((r) => {
      const secili = r.data.find((h) => h.id === parseInt(id));
      setHaber(secili);
    });
  }, [id]);

  if (!haber) return <p>Loading...</p>;

  return (
    <div className="haber-detay">
      <img src={haber.resimUrl} alt={haber.baslik} className="haber-detay-img" />
      <h1>{haber.baslik}</h1>
      <p>{haber.icerik}</p>
      <div className="haber-detay-icerik">
        {haber.detay && <p>{haber.detay}</p>}
      </div>
    </div>
  );
};

export default HaberDetay;
