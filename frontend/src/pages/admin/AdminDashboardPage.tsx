import { useEffect, useState } from "react";
import { adminApi } from "../../services/adminApi";
import type { AdminStats } from "../../services/adminApi";
import { formatMoney } from "../../utils/format";
import { StatCard, StatusPill } from "../../components/admin/StatCard";
import Spinner from "../../components/common/Spinner";
import { useToast } from "../../context/ToastContext";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    adminApi
      .stats()
      .then(setStats)
      .catch(() => toast("Couldn't load stats", "error"))
      .finally(() => setLoading(false));
  }, [toast]);

  if (loading) return <Spinner />;
  if (!stats) return null;

  const processing = stats.applicationsByStatus.find((s) => s.status === "PROCESSING")?.count ?? 0;

  return (
    <section>
      <div className="stat-grid">
        <StatCard value={stats.totalUsers} label="Total users" />
        <StatCard value={stats.totalServices} label="Active services" />
        <StatCard value={stats.totalApplications} label="Total applications" />
        <StatCard value={stats.totalPaymentsSuccess} label="Successful payments" />
        <StatCard value={formatMoney(stats.totalRevenueCents)} label="Total revenue" />
        <StatCard value={processing} label="Processing now" />
      </div>

      <h3>Recent applications</h3>
      <div className="table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Reference</th>
              <th>Applicant</th>
              <th>Service</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {stats.recentApplications.map((a) => (
              <tr key={a.id}>
                <td>{a.referenceNumber}</td>
                <td>{a.user.fullName}</td>
                <td>{a.service.name}</td>
                <td>
                  <StatusPill status={a.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
