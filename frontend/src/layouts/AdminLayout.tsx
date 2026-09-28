import { NavLink, Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DemoBanner from "../components/layout/DemoBanner";
import ToastStack from "../components/layout/ToastStack";

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  return (
    <>
      <DemoBanner />
      <header className="navbar">
        <div className="navbar-inner">
          <Link to="/" className="logo">
            <span className="logo-mark">H360</span>
            <span className="logo-text">
              Huduma<b>360</b>
            </span>
          </Link>
          <nav className="navbar-links">
            <Link to="/" className="nav-link">
              &larr; Back to site
            </Link>
            <span className="nav-link" style={{ cursor: "default" }}>
              {user?.fullName} ({user?.role})
            </span>
            <button className="btn btn-outline" style={{ padding: "8px 14px" }} onClick={handleLogout}>
              Log out
            </button>
          </nav>
        </div>
      </header>

      <main className="admin-wrap">
        <h1 style={{ fontFamily: "var(--font-head)" }}>Admin dashboard</h1>
        <p style={{ color: "var(--text-muted)", marginTop: -6 }}>
          Manage services, applications, payments and users.
        </p>

        <div className="admin-tabs">
          <NavLink to="/admin" end className={({ isActive }) => `admin-tab${isActive ? " active" : ""}`}>
            Overview
          </NavLink>
          <NavLink to="/admin/applications" className={({ isActive }) => `admin-tab${isActive ? " active" : ""}`}>
            Applications
          </NavLink>
          <NavLink to="/admin/payments" className={({ isActive }) => `admin-tab${isActive ? " active" : ""}`}>
            Payments
          </NavLink>
          <NavLink to="/admin/users" className={({ isActive }) => `admin-tab${isActive ? " active" : ""}`}>
            Users
          </NavLink>
        </div>

        <Outlet />
      </main>
      <ToastStack />
    </>
  );
}
