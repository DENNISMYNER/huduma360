import { useState } from "react";
import type { MouseEvent } from "react";
import { Link } from "react-router-dom";
import InfoModal from "../common/InfoModal";

const INFO_CONTENT: Record<string, { title: string; body: string }> = {
  help: {
    title: "Help centre",
    body: "This is a concept/demo project — the help centre here is illustrative. In a production platform, this space would host FAQs, live chat and support ticketing.",
  },
  accessibility: {
    title: "Accessibility",
    body: "Huduma360 aims for keyboard-navigable menus, visible focus states, and support for reduced-motion preferences throughout this demo.",
  },
  about: {
    title: "About this project",
    body: "Huduma360 is a portfolio concept exploring how a unified digital front door to Kenyan government services could look and feel, backed by a real registration/login/application/payment system. It is not affiliated with, or endorsed by, the Government of Kenya.",
  },
  privacy: {
    title: "Privacy (demo)",
    body: "Account, application and payment data in this demo is stored in a real database so the full flow works end to end, but no real payments are ever processed — all payments here are simulated.",
  },
  contact: {
    title: "Contact",
    body: "This is a demo project built for portfolio purposes. For the real equivalent services, please visit the official eCitizen platform.",
  },
};

export default function Footer() {
  const [infoKey, setInfoKey] = useState<string | null>(null);

  function openInfo(key: string, e: MouseEvent) {
    e.preventDefault();
    setInfoKey(key);
  }

  return (
    <>
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <span className="logo-mark">H360</span>
            <span className="logo-text">
              Huduma<b>360</b>
            </span>
            <p className="footer-tag">
              A concept platform demonstrating what a unified Kenyan government services experience could look
              like. Built as a portfolio project — not affiliated with the Government of Kenya.
            </p>
          </div>
          <div className="footer-col">
            <h4>Services</h4>
            <Link to="/#categories">All categories</Link>
            <Link to="/#popular">Popular services</Link>
            <Link to="/applications">My applications</Link>
          </div>
          <div className="footer-col">
            <h4>Resources</h4>
            <Link to="/#announcements">Announcements</Link>
            <a href="#" onClick={(e) => openInfo("help", e)}>
              Help centre
            </a>
            <a href="#" onClick={(e) => openInfo("accessibility", e)}>
              Accessibility
            </a>
          </div>
          <div className="footer-col">
            <h4>About</h4>
            <a href="#" onClick={(e) => openInfo("about", e)}>
              About this project
            </a>
            <a href="#" onClick={(e) => openInfo("privacy", e)}>
              Privacy (demo)
            </a>
            <a href="#" onClick={(e) => openInfo("contact", e)}>
              Contact
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>&copy; 2026 Huduma360 — a concept project. Not a government website.</span>
        </div>
      </footer>

      <InfoModal info={infoKey ? INFO_CONTENT[infoKey] : null} onClose={() => setInfoKey(null)} />
    </>
  );
}
