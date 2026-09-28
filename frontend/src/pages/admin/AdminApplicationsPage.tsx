import { useCallback, useEffect, useState } from "react";
import type { Application, ApplicationStatus } from "../../types/application";
import { applicationsApi } from "../../services/applicationsApi";
import { StatusPill } from "../../components/admin/StatCard";
import Spinner from "../../components/common/Spinner";
import { useToast } from "../../context/ToastContext";

const STATUS_OPTIONS: ApplicationStatus[] = ["SUBMITTED", "PAYMENT_PENDING", "PROCESSING", "APPROVED", "REJECTED"];

export default function AdminApplicationsPage() {
  const [items, setItems] = useState<Application[]>([]);
  const [drafts, setDrafts] = useState<Record<string, ApplicationStatus>>({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { items: apps } = await applicationsApi.adminList({ pageSize: 50 });
      setItems(apps);
    } catch {
      toast("Couldn't load applications", "error");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  async function saveStatus(id: string) {
    const status = drafts[id];
    if (!status) return;
    try {
      await applicationsApi.adminUpdateStatus(id, status);
      toast("Application status updated", "success");
      load();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Update failed", "error");
    }
  }

  if (loading) return <Spinner />;

  return (
    <section>
      <div className="table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Reference</th>
              <th>Applicant</th>
              <th>Service</th>
              <th>Status</th>
              <th>Update</th>
            </tr>
          </thead>
          <tbody>
            {items.map((a) => (
              <tr key={a.id}>
                <td>{a.referenceNumber}</td>
                <td>
                  {a.user?.fullName}
                  <br />
                  <span style={{ color: "var(--text-faint)" }}>{a.user?.email}</span>
                </td>
                <td>{a.service.name}</td>
                <td>
                  <StatusPill status={a.status} />
                </td>
                <td>
                  <select
                    className="mini-select"
                    value={drafts[a.id] ?? a.status}
                    onChange={(e) => setDrafts((prev) => ({ ...prev, [a.id]: e.target.value as ApplicationStatus }))}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s.replace("_", " ")}
                      </option>
                    ))}
                  </select>
                  <button className="btn btn-outline btn-mini" onClick={() => saveStatus(a.id)}>
                    Save
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
