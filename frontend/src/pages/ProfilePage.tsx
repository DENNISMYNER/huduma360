import { useState } from "react";
import type { FormEvent } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { request } from "../services/httpClient";
import type { User } from "../types/user";

const COUNTIES = ["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Kilifi", "Uasin Gishu", "Machakos", "Kiambu"];

export default function ProfilePage() {
  const { user, refresh } = useAuth();
  const { toast } = useToast();
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [county, setCounty] = useState(user?.county || "");
  const [submitting, setSubmitting] = useState(false);

  if (!user) return null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await request<{ user: User }>("/users/profile", { method: "PATCH", body: { fullName, phone, county } });
      await refresh();
      toast("Profile updated", "success");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Couldn't update profile", "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="section">
      <div className="section-inner" style={{ maxWidth: 480 }}>
        <div className="section-head">
          <h2>My profile</h2>
          <p className="section-sub">{user.email}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full name</label>
            <input value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Phone number</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div className="form-group">
            <label>County</label>
            <select value={county} onChange={(e) => setCounty(e.target.value)}>
              <option value="">Select county</option>
              {COUNTIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <button className="btn btn-primary" type="submit" disabled={submitting}>
            {submitting ? "Saving…" : "Save changes"}
          </button>
        </form>
      </div>
    </section>
  );
}
