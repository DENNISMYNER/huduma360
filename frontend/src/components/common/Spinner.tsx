export default function Spinner({ label }: { label?: string }) {
  return (
    <div className="route-loading">
      <div>
        <div className="loading-spinner" />
        {label && <p className="loading-text">{label}</p>}
      </div>
    </div>
  );
}
