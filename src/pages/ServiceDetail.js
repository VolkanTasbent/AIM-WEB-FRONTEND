import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getServisler } from "../services/ApiService";
import "../App.css";

const ServiceDetail = () => {
  const { slug } = useParams();
  const [servis, setServis] = useState(null);

  useEffect(() => {
    getServisler().then((r) => {
      const data = r.data;
      // slug eşleşmesi (örneğin 'e-sports' == E-Sports)
      const found = data.find(
        (s) =>
          s.baslik.toLowerCase().replace(/\s+/g, "-") === slug.toLowerCase()
      );
      setServis(found);
    });
  }, [slug]);

  if (!servis) return <p className="loading">Loading...</p>;

  return (
    <div className="service-detail-page">
      <div className="service-detail-hero">
        <img src={servis.resimUrl} alt={servis.baslik} />
        <div className="overlay">
          <h1>{servis.baslik}</h1>
        </div>
      </div>

      <div className="service-detail-content">
        <h2>{servis.baslik}</h2>
        <p>{servis.detay}</p>
      </div>
    </div>
  );
};

export default ServiceDetail;
