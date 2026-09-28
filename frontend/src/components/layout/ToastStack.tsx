import { useToast } from "../../context/ToastContext";

export default function ToastStack() {
  const { toasts, dismiss } = useToast();
  return (
    <div className="toast-stack">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.type}`} onClick={() => dismiss(t.id)}>
          {t.message}
        </div>
      ))}
    </div>
  );
}
