import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="route-error">
      <h2 style={{ fontFamily: "var(--font-head)" }}>Page not found</h2>
      <p>The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn btn-primary" style={{ marginTop: 16, display: "inline-block" }}>
        Back home
      </Link>
    </div>
  );
}
