import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const COUNTIES = ["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Kilifi", "Uasin Gishu", "Machakos", "Kiambu"];

export default function RegisterPage() {
  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [county, setCounty] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await register({
        fullName,
        email,
        password,
        phone: phone || undefined,
        nationalId: nationalId || undefined,
        county: county || undefined,
      });
      toast("Account created — welcome to Huduma360!", "success");
      navigate("/", { replace: true });
    } catch (err) {
      toast(err instanceof Error ? err.message : "Registration failed", "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <h1>Create your account</h1>
        <p className="sub">Sign up to apply for services, track applications and make payments.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full name</label>
            <input autoComplete="name" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Email address</label>
            <input type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="field-row">
            <div className="form-group">
              <label>Phone number</label>
              <input placeholder="07xx xxx xxx" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className="form-group">
              <label>National ID (optional)</label>
              <input
                inputMode="numeric"
                placeholder="7-8 digits"
                value={nationalId}
                onChange={(e) => setNationalId(e.target.value)}
              />
            </div>
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
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="hint">At least 8 characters, including an uppercase letter and a number.</div>
          </div>
          <button className="btn btn-primary btn-full" type="submit" disabled={submitting}>
            {submitting ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="auth-foot">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}
