import type { ReactNode } from "react";
import { useAuth } from "../../context/AuthContext";
import Spinner from "./Spinner";

export default function RequireAdmin({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <Spinner />;

  if (!user || (user.role !== "ADMIN" && user.role !== "STAFF")) {
    return (
      <div className="denied-box">
        <h2 style={{ fontFamily: "var(--font-head)" }}>Admin access required</h2>
        <p style={{ color: "var(--text-muted)" }}>You need an admin or staff account to view this page.</p>
        <a href="/login" className="btn btn-primary" style={{ marginTop: 16, display: "inline-block" }}>
          Log in
        </a>
      </div>
    );
  }
  return <>{children}</>;
}
