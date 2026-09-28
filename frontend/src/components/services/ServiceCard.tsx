import { Link } from "react-router-dom";
import type { Service } from "../../types/service";
import { formatFee } from "../../utils/format";
import SaveButton from "./SaveButton";

export function MiniServiceCard({ service }: { service: Service }) {
  return (
    <Link to={`/services/${service.slug}`} className="mini-card">
      <div className="mini-card-top">
        <span className="mini-card-icon">{service.category.icon}</span>
        {service.isPopular && <span className="mini-card-badge">Popular</span>}
      </div>
      <h3>{service.name}</h3>
      <p>{service.description}</p>
      <span className="mini-card-cat">{service.category.name}</span>
    </Link>
  );
}

export function FullServiceCard({ service }: { service: Service }) {
  return (
    <div className="service-card">
      <div className="service-card-top">
        <h3>{service.name}</h3>
        <SaveButton serviceId={service.id} />
      </div>
      <p className="service-card-desc">{service.description}</p>
      <div className="service-card-meta">
        <span>⏱ {service.processingTime}</span>
        <span className={`badge ${service.feeCents > 0 ? "badge-fee" : "badge-free"}`}>
          {formatFee(service.feeCents)}
        </span>
      </div>
      <div className="service-card-actions">
        <Link to={`/services/${service.slug}`} className="btn btn-outline">
          View details
        </Link>
      </div>
    </div>
  );
}
