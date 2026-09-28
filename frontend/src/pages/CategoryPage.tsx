import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useCatalog } from "../context/CatalogContext";
import { FullServiceCard } from "../components/services/ServiceCard";
import Spinner from "../components/common/Spinner";

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const { categories, services, loading } = useCatalog();
  const [activeService, setActiveService] = useState("all");

  if (loading) return <Spinner label="Loading category…" />;

  const category = categories.find((c) => c.slug === slug);
  const categoryServices = services.filter((s) => s.category.slug === slug);

  if (!category) {
    return (
      <div className="route-error">
        <p>Category not found.</p>
        <Link to="/" className="btn btn-outline">
          Back home
        </Link>
      </div>
    );
  }

  const filtered = activeService === "all" ? categoryServices : categoryServices.filter((s) => s.slug === activeService);

  return (
    <section className="category-view">
      <div className="section-inner">
        <Link to="/" className="back-btn">
          &larr; Back
        </Link>
        <div className="category-view-head">
          <div className="icon-box">{category.icon}</div>
          <div>
            <h2>{category.name}</h2>
            <p>{category.description}</p>
          </div>
        </div>

        <div className="subcat-tabs">
          <button
            className={`subcat-tab${activeService === "all" ? " active" : ""}`}
            onClick={() => setActiveService("all")}
          >
            All ({categoryServices.length})
          </button>
          {categoryServices.map((s) => (
            <button
              key={s.slug}
              className={`subcat-tab${activeService === s.slug ? " active" : ""}`}
              onClick={() => setActiveService(s.slug)}
            >
              {s.name}
            </button>
          ))}
        </div>

        <div className="results-grid">
          {filtered.map((s) => (
            <FullServiceCard key={s.id} service={s} />
          ))}
        </div>
      </div>
    </section>
  );
}
