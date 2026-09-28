import { useState } from "react";
import type { FormEvent, MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import type { Service } from "../../types/service";
import type { Application } from "../../types/application";
import type { PaymentMethod } from "../../types/payment";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { applicationsApi } from "../../services/applicationsApi";
import { paymentsApi } from "../../services/paymentsApi";
import { formatFee } from "../../utils/format";

type Step = "form" | "pay" | "processing" | "success" | "fail";

const COUNTIES = ["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Kilifi", "Uasin Gishu", "Machakos", "Kiambu"];

interface ApplyFlowModalProps {
  service: Service;
  /** When resuming payment on an application that already exists (e.g. from "Pay now"). */
  existingApplication?: Application;
  onClose: () => void;
  onSubmitted?: () => void;
}

export default function ApplyFlowModal({ service, existingApplication, onClose, onSubmitted }: ApplyFlowModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>(existingApplication ? "pay" : "form");
  const [application, setApplication] = useState<Application | undefined>(existingApplication);
  const [payMethod, setPayMethod] = useState<PaymentMethod>("MPESA");
  const [submitting, setSubmitting] = useState(false);

  const [name, setName] = useState(user?.fullName || "");
  const [idNumber, setIdNumber] = useState(user?.nationalId || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [county, setCounty] = useState(user?.county || "");
  const [mpesaPhone, setMpesaPhone] = useState(user?.phone || "");
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  function overlayClick(e: MouseEvent) {
    if (e.target === e.currentTarget) onClose();
  }

  async function handleFormSubmit(e: FormEvent) {
    e.preventDefault();
    const nextErrors: Record<string, boolean> = {
      name: name.trim().length <= 2,
      id: !/^\d{7,8}$/.test(idNumber.trim()),
      phone: !/^(0|\+254)\d{9}$/.test(phone.replace(/\s/g, "")),
      county: county === "",
    };
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) {
      toast("Please fix the highlighted fields", "error");
      return;
    }

    setSubmitting(true);
    try {
      const { application: created } = await applicationsApi.create(service.id, {
        fullName: name,
        idNumber,
        phone,
        county,
      });
      setApplication(created);
      setStep(created.status === "PAYMENT_PENDING" ? "pay" : "success");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Couldn't submit your application", "error");
    } finally {
      setSubmitting(false);
    }
  }

  async function processPayment() {
    if (!application) return;
    setStep("processing");
    try {
      const { payment } = await paymentsApi.create(application.id, payMethod, mpesaPhone || undefined);
      setStep(payment.status === "SUCCESS" ? "success" : "fail");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Payment could not be processed", "error");
      setStep("fail");
    }
  }

  function finishSuccess() {
    onClose();
    onSubmitted?.();
    toast("Application submitted successfully", "success");
    navigate("/applications");
  }

  return (
    <div className="modal-overlay open" onClick={overlayClick}>
      <div className="modal apply-modal" role="dialog" aria-modal="true">
        <button className="modal-close" aria-label="Close" onClick={onClose}>
          &times;
        </button>
        <div className="modal-body">
          {step === "form" && (
            <form onSubmit={handleFormSubmit}>
              <div className="progress-steps">
                <div className="ps-dot active"></div>
                <div className="ps-dot"></div>
                <div className="ps-dot"></div>
              </div>
              <div className="am-title">Apply — {service.name}</div>
              <div className="am-sub">Fill in your details to begin this application.</div>

              <div className={`form-group${errors.name ? " invalid" : ""}`}>
                <label>Full name</label>
                <input type="text" placeholder="e.g. Wanjiru Kamau" value={name} onChange={(e) => setName(e.target.value)} />
                <div className="form-error">Please enter your full name.</div>
              </div>
              <div className={`form-group${errors.id ? " invalid" : ""}`}>
                <label>National ID number</label>
                <input
                  type="text"
                  placeholder="e.g. 30xxxxxx"
                  inputMode="numeric"
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                />
                <div className="form-error">Enter a valid ID number (7–8 digits).</div>
              </div>
              <div className={`form-group${errors.phone ? " invalid" : ""}`}>
                <label>Phone number</label>
                <input
                  type="text"
                  placeholder="e.g. 07xx xxx xxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <div className="form-error">Enter a valid Kenyan phone number.</div>
              </div>
              <div className={`form-group${errors.county ? " invalid" : ""}`}>
                <label>County</label>
                <select value={county} onChange={(e) => setCounty(e.target.value)}>
                  <option value="">Select county</option>
                  {COUNTIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
                <div className="form-error">Please select your county.</div>
              </div>
              <button className="btn btn-primary btn-full" type="submit" disabled={submitting}>
                {submitting ? "Submitting…" : "Continue"}
              </button>
            </form>
          )}

          {step === "pay" && application && (
            <div>
              <div className="progress-steps">
                <div className="ps-dot active"></div>
                <div className="ps-dot active"></div>
                <div className="ps-dot"></div>
              </div>
              <div className="am-title">
                Payment <span className="demo-tag">DEMO</span>
              </div>
              <div className="am-sub">This service requires a fee before submission.</div>

              <div className="pay-methods">
                {(["MPESA", "CARD", "BANK"] as PaymentMethod[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    className={`pay-method${payMethod === m ? " active" : ""}`}
                    onClick={() => setPayMethod(m)}
                  >
                    <span className="pm-emoji">{m === "MPESA" ? "📱" : m === "CARD" ? "💳" : "🏦"}</span>
                    {m === "MPESA" ? "M-Pesa" : m === "CARD" ? "Card" : "Bank"}
                  </button>
                ))}
              </div>

              {payMethod === "MPESA" && (
                <div className="form-group">
                  <label>M-Pesa phone number</label>
                  <input type="text" placeholder="07xx xxx xxx" value={mpesaPhone} onChange={(e) => setMpesaPhone(e.target.value)} />
                </div>
              )}
              {payMethod === "CARD" && (
                <>
                  <div className="form-group">
                    <label>Card number</label>
                    <input type="text" placeholder="4111 1111 1111 1111" />
                  </div>
                  <div className="form-group" style={{ display: "flex", gap: 10 }}>
                    <div style={{ flex: 1 }}>
                      <label>Expiry</label>
                      <input type="text" placeholder="MM/YY" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label>CVV</label>
                      <input type="text" placeholder="123" />
                    </div>
                  </div>
                </>
              )}
              {payMethod === "BANK" && (
                <div className="form-group">
                  <label>Bank</label>
                  <select>
                    <option>KCB</option>
                    <option>Equity Bank</option>
                    <option>Co-operative Bank</option>
                    <option>NCBA</option>
                  </select>
                </div>
              )}

              <div className="pay-summary">
                <div className="pay-summary-row">
                  <span>{service.name}</span>
                  <span>{formatFee(service.feeCents)}</span>
                </div>
                <div className="pay-summary-row">
                  <span>Processing fee</span>
                  <span>KES 0</span>
                </div>
                <div className="pay-summary-row total">
                  <span>Total</span>
                  <span>{formatFee(service.feeCents)}</span>
                </div>
              </div>
              <button className="btn btn-green btn-full" onClick={processPayment}>
                Pay &amp; Submit (Demo)
              </button>
            </div>
          )}

          {step === "processing" && (
            <div>
              <div className="progress-steps">
                <div className="ps-dot active"></div>
                <div className="ps-dot active"></div>
                <div className="ps-dot active"></div>
              </div>
              <div className="loading-spinner" />
              <p className="loading-text">Processing your payment…</p>
            </div>
          )}

          {(step === "success" || step === "fail") && (
            <div className="result-state">
              <div className={`result-icon ${step === "success" ? "success" : "fail"}`}>
                {step === "success" ? "✓" : "✕"}
              </div>
              <div className="am-title">{step === "success" ? "Application submitted" : "Payment failed"}</div>
              <div className="am-sub">
                {step === "success"
                  ? `Your application for ${service.name} has been received and is now being processed.`
                  : "We couldn't process your demo payment. No real charge was made — please try again."}
              </div>
              {step === "success" && application && (
                <div className="result-ref">Reference number: {application.referenceNumber}</div>
              )}
              <button
                className={`btn ${step === "success" ? "btn-primary" : "btn-green"} btn-full`}
                style={{ marginTop: 24 }}
                onClick={() => (step === "success" ? finishSuccess() : setStep("pay"))}
              >
                {step === "success" ? "View in My Applications" : "Try again"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
