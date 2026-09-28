import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function MobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    onClose();
    navigate("/");
  }

  return (
    <>
      <div className={`drawer-overlay${open ? " open" : ""}`} onClick={onClose} />
      <nav className={`drawer${open ? " open" : ""}`}>
        <div className="drawer-header">
          <span className="logo-text">
            Huduma<b>360</b>
          </span>
          <button aria-label="Close menu" onClick={onClose}>
            &times;
          </button>
        </div>
        <Link to="/" className="drawer-link" onClick={onClose}>
          Home
        </Link>
        <Link to="/#categories" className="drawer-link" onClick={onClose}>
          Service Categories
        </Link>
        <Link to="/applications" className="drawer-link" onClick={onClose}>
          My Applications
        </Link>
        <Link to="/saved" className="drawer-link" onClick={onClose}>
          Saved Services
        </Link>
        <Link to="/recent" className="drawer-link" onClick={onClose}>
          Recently Viewed
        </Link>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {user ? (
            <>
              {(user.role === "ADMIN" || user.role === "STAFF") && (
                <Link to="/admin" className="drawer-link" onClick={onClose}>
                  Admin
                </Link>
              )}
              <a href="#" className="drawer-link" onClick={(e) => { e.preventDefault(); handleLogout(); }}>
                Log out ({user.fullName.split(" ")[0]})
              </a>
            </>
          ) : (
            <>
              <Link to="/login" className="drawer-link" onClick={onClose}>
                Log in
              </Link>
              <Link to="/register" className="drawer-link" onClick={onClose}>
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>
    </>
  );
}
