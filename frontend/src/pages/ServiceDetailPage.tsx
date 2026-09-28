import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useCatalog } from "../context/CatalogContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { recentApi } from "../services/recentApi";
import { formatFee } from "../utils/format";
import SaveButton from "../components/services/SaveButton";
import ApplyFlowModal from "../components/applications/ApplyFlowModal";
import Spinner from "../components/common/Spinner";

export default function ServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { getBySlug, loading } = useCatalog();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [applyOpen, setApplyOpen] = useState(false);

  const service = slug ? getBySlug(slug) : undefined;

  useEffect(() => {
    if (service && user) {
      recentApi.markViewed(service.id).catch(() => {
        // non-critical
      });
    }
  }, [service, user]);

  if (loading) return <Spinner label="Loading service…" />;

  if (!service) {
    return (
      <div className="route-error">
        <p>Service not found.</p>
        <Link to="/" className="btn btn-outline">
          Back home
        </Link>
      </div>
    );
  }

  function handleStartApplication() {
    if (!user) {
      toast("Please log in to start an application", "error");
      navigate("/login", { state: { from: { pathname: `/services/${slug}`, search: "" } } });
      return;
    }
    setApplyOpen(true);
  }

  return (
    <section className="section">
      <div className="section-inner" style={{ maxWidth: 720 }}>
        <Link to={`/categories/${service.category.slug}`} className="back-btn">
          &larr; Back to {service.category.name}
        </Link>

        <div className="sm-header" style={{ marginTop: 16 }}>
          <span className="sm-icon">{service.category.icon}</span>
          <div>
            <div className="sm-title">{service.name}</div>
            <div className="sm-cat">{service.category.name}</div>
          </div>
        </div>
        <p className="sm-desc">{service.description}</p>

        <div className="sm-grid">
          <div className="sm-fact">
            <div className="sm-fact-label">Processing time</div>
            <div className="sm-fact-value">{service.processingTime}</div>
          </div>
          <div className="sm-fact">
            <div className="sm-fact-label">Service fee</div>
            <div className="sm-fact-value">{formatFee(service.feeCents)}</div>
          </div>
        </div>

        <div className="sm-block">
          <h4>Eligibility</h4>
          <ul className="sm-list">
            {service.eligibility.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
        <div className="sm-block">
          <h4>Required documents</h4>
          <ul className="sm-list">
            {service.documents.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
        <div className="sm-block">
          <h4>Step-by-step process</h4>
          <ol className="sm-steps">
            {service.steps.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ol>
        </div>

        <div className="sm-actions">
          <button className="btn btn-green" onClick={handleStartApplication}>
            Start Application
          </button>
          <SaveButton serviceId={service.id} className="btn btn-outline" />
        </div>
      </div>

      {applyOpen && <ApplyFlowModal service={service} onClose={() => setApplyOpen(false)} />}
    </section>
  );
}
