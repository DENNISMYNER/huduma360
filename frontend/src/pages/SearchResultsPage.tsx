import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useCatalog } from "../context/CatalogContext";
import { FullServiceCard } from "../components/services/ServiceCard";
import Spinner from "../components/common/Spinner";

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const { services, loading } = useCatalog();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return services.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.category.name.toLowerCase().includes(q)
    );
  }, [services, query]);

  if (loading) return <Spinner label="Searching…" />;

  return (
    <section className="search-results">
      <div className="section-inner">
        <div className="section-head">
          <h2>Results for "{query}"</h2>
        </div>
        {results.length > 0 ? (
          <div className="results-grid">
            {results.map((s) => (
              <FullServiceCard key={s.id} service={s} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p className="empty-title">No matching services</p>
            <p className="empty-sub">Try a different keyword, or browse the categories from the home page.</p>
          </div>
        )}
      </div>
    </section>
  );
}
