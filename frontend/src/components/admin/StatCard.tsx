export function StatCard({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="stat-card">
      <div className="num">{value}</div>
      <div className="label">{label}</div>
    </div>
  );
}

export function StatusPill({ status }: { status: string }) {
  return <span className={`pill pill-${status}`}>{status.replace("_", " ")}</span>;
}
