import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useCatalog } from "../context/CatalogContext";
import { MiniServiceCard } from "../components/services/ServiceCard";
import CategoryCard from "../components/services/CategoryCard";
import QuickActions from "../components/services/QuickActions";
import Spinner from "../components/common/Spinner";

const SUGGESTIONS = ["Passport", "National ID", "SHA registration", "Land search", "HELB", "Business permit"];

const ANNOUNCEMENTS = [
  {
    title: "SHA registration now open nationwide",
    body: "All citizens are encouraged to complete SHA registration to maintain uninterrupted access to health coverage.",
    date: "28 Aug 2026",
  },
  {
    title: "Passport appointment slots added",
    body: "Additional biometric capture slots have been released at regional passport offices for September.",
    date: "20 Aug 2026",
  },
  {
    title: "HELB second-round applications open",
    body: "Continuing students can now apply for the second disbursement cycle of the academic year.",
    date: "12 Aug 2026",
  },
];

export default function HomePage() {
  const { categories, services, loading, error } = useCatalog();
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  function submitSearch(e: FormEvent) {
    e.preventDefault();
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  }

  const popular = services.filter((s) => s.isPopular);

  return (
    <>
      <section className="hero" id="home">
        <div className="hero-inner">
          <p className="hero-eyebrow">A single doorway into Kenya's public services</p>
          <h1 className="hero-title">Essential government services, all in one place</h1>
          <p className="hero-sub">
            Find, understand, and apply for national and county services — from IDs and passports to land records
            and business permits — without hunting across a dozen sites.
          </p>

          <form className="hero-search" onSubmit={submitSearch}>
            <svg viewBox="0 0 24 24" className="icon">
              <path
                d="M21 21l-4.35-4.35M18 11a7 7 0 1 1-14 0 7 7 0 0 1 14 0z"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <input
              type="text"
              placeholder="What service are you looking for?"
              autoComplete="off"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit">Search</button>
          </form>
          <div className="hero-suggestions">
            {SUGGESTIONS.map((s) => (
              <button type="button" key={s} onClick={() => navigate(`/search?q=${encodeURIComponent(s)}`)}>
                {s}
              </button>
            ))}
          </div>

          <QuickActions />
        </div>
      </section>

      {loading && <Spinner label="Loading services…" />}
      {error && (
        <div className="route-error">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div id="browseWrap">
          <section className="section" id="popular">
            <div className="section-inner">
              <div className="section-head">
                <h2>Popular services</h2>
                <p className="section-sub">Most accessed this month</p>
              </div>
              <div className="popular-row">
                {popular.map((s) => (
                  <MiniServiceCard key={s.id} service={s} />
                ))}
              </div>
            </div>
          </section>

          <section className="section" id="categories">
            <div className="section-inner">
              <div className="section-head">
                <h2>Browse by category</h2>
                <p className="section-sub">{categories.length} categories covering national and county services</p>
              </div>
              <div className="category-grid">
                {categories.map((c) => (
                  <CategoryCard key={c.id} category={c} />
                ))}
              </div>
            </div>
          </section>

          <section className="section" id="announcements">
            <div className="section-inner">
              <div className="section-head">
                <h2>Announcements</h2>
              </div>
              <div className="announcement-list">
                {ANNOUNCEMENTS.map((a) => (
                  <div className="announcement-item" key={a.title}>
                    <h4>{a.title}</h4>
                    <p>{a.body}</p>
                    <span className="announcement-date">{a.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
