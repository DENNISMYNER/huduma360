import type { MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useSaved } from "../../context/SavedContext";
import { useToast } from "../../context/ToastContext";

export default function SaveButton({ serviceId, className }: { serviceId: string; className?: string }) {
  const { user } = useAuth();
  const { isSaved, toggle } = useSaved();
  const { toast } = useToast();
  const navigate = useNavigate();
  const saved = isSaved(serviceId);

  async function handleClick(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast("Log in to save services", "error");
      navigate("/login");
      return;
    }
    try {
      await toggle(serviceId);
      toast(saved ? "Removed from saved" : "Service saved", saved ? "" : "success");
    } catch {
      toast("Something went wrong", "error");
    }
  }

  return (
    <button className={`save-btn${saved ? " saved" : ""} ${className || ""}`} onClick={handleClick} aria-label="Save service">
      <svg viewBox="0 0 24 24" width="18" height="18">
        <path
          d="M12 21s-7.5-4.6-10-9.3C.5 8 2.4 4.5 6 4.2c2-.2 3.7 1 4.9 2.6C12.3 5.2 14 4 16 4.2c3.6.3 5.5 3.8 4 7.5C19.5 16.4 12 21 12 21z"
          fill={saved ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.8"
        />
      </svg>
    </button>
  );
}
