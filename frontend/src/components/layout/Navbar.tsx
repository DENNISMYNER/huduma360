import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useToast } from "../../context/ToastContext";

export default function Navbar({ onOpenDrawer }: { onOpenDrawer: () => void }) {
  const { user, logout } = useAuth();
  const { toggle } = useTheme();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  function submitSearch(e: FormEvent) {
    e.preventDefault();
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  }

  async function handleLogout() {
    await logout();
    toast("You've been logged out");
    navigate("/");
  }

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <button className="menu-toggle" aria-label="Open menu" onClick={onOpenDrawer}>
          <span></span>
          <span></span>
          <span></span>
        </button>

        <Link to="/" className="logo">
          <span className="logo-mark">H360</span>
          <span className="logo-text">
            Huduma<b>360</b>
          </span>
        </Link>

        <form className="navbar-search" onSubmit={submitSearch}>
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
            placeholder="Search for a service, e.g. passport, land rates..."
            autoComplete="off"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </form>

        <nav className="navbar-links">
          <Link to="/applications" className="nav-link">
            My Applications
          </Link>
          <Link to="/saved" className="nav-link">
            Saved
          </Link>
          <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {user ? (
              <>
                {(user.role === "ADMIN" || user.role === "STAFF") && (
                  <Link to="/admin" className="nav-link">
                    Admin
                  </Link>
                )}
                <span className="nav-link" style={{ cursor: "default" }}>
                  Hi, {user.fullName.split(" ")[0]}
                </span>
                <button className="btn btn-outline" style={{ padding: "8px 14px" }} onClick={handleLogout}>
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">
                  Log in
                </Link>
                <Link to="/register" className="btn btn-primary" style={{ padding: "8px 16px" }}>
                  Sign up
                </Link>
              </>
            )}
          </span>
          <button className="theme-toggle" aria-label="Toggle dark mode" onClick={toggle}>
            <svg className="icon icon-sun" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
              <path
                d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <svg className="icon icon-moon" viewBox="0 0 24 24">
              <path
                d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </nav>
      </div>

      <div className="navbar-search navbar-search-mobile">
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
          placeholder="Search for a service..."
          autoComplete="off"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`);
          }}
        />
      </div>
    </header>
  );
}
