import { useEffect, useState } from "react";
import { savedApi } from "../services/savedApi";
import type { Service } from "../types/service";
import { MiniServiceCard } from "../components/services/ServiceCard";
import Spinner from "../components/common/Spinner";

export default function SavedPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    savedApi
      .list()
      .then(({ items }) => setServices(items.map((i) => i.service)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="section">
      <div className="section-inner">
        <div className="section-head">
          <h2>Saved services</h2>
        </div>
        {loading && <Spinner />}
        {!loading && services.length === 0 && (
          <p className="empty-inline">Save a service to find it here quickly next time.</p>
        )}
        {!loading && (
          <div className="popular-row">
            {services.map((s) => (
              <MiniServiceCard key={s.id} service={s} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
