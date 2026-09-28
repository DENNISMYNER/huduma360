import { Link } from "react-router-dom";
import { useCatalog } from "../../context/CatalogContext";

const QUICK_ACTIONS = [
  { emoji: "🪪", label: "Apply for National ID", serviceSlug: "i1" },
  { emoji: "🛂", label: "Passport Services", serviceSlug: "i4" },
  { emoji: "🏥", label: "SHA Registration", serviceSlug: "h1" },
  { emoji: "🚗", label: "Driving Licence", serviceSlug: "t1" },
];

export default function QuickActions() {
  const { getBySlug } = useCatalog();

  return (
    <div className="quick-actions">
      {QUICK_ACTIONS.filter((qa) => getBySlug(qa.serviceSlug)).map((qa) => (
        <Link key={qa.serviceSlug} to={`/services/${qa.serviceSlug}`} className="quick-action-btn">
          <span className="qa-emoji">{qa.emoji}</span> {qa.label}
        </Link>
      ))}
    </div>
  );
}
