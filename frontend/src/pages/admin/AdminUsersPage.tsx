import { useCallback, useEffect, useState } from "react";
import type { User, Role } from "../../types/user";
import { adminApi } from "../../services/adminApi";
import { useAuth } from "../../context/AuthContext";
import Spinner from "../../components/common/Spinner";
import { useToast } from "../../context/ToastContext";

const ROLE_OPTIONS: Role[] = ["USER", "STAFF", "ADMIN"];

export default function AdminUsersPage() {
  const { user: me } = useAuth();
  const [items, setItems] = useState<User[]>([]);
  const [drafts, setDrafts] = useState<Record<string, Role>>({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { items: users } = await adminApi.listUsers({ pageSize: 50 });
      setItems(users);
    } catch {
      toast("Couldn't load users", "error");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  async function saveRole(id: string) {
    const role = drafts[id];
    if (!role) return;
    try {
      await adminApi.setUserRole(id, role);
      toast("User role updated", "success");
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
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Update</th>
            </tr>
          </thead>
          <tbody>
            {items.map((u) => (
              <tr key={u.id}>
                <td>{u.fullName}</td>
                <td>{u.email}</td>
                <td>
                  <span className="pill">{u.role}</span>
                </td>
                <td>
                  {u.id === me?.id ? (
                    <span style={{ color: "var(--text-faint)" }}>(you)</span>
                  ) : (
                    <>
                      <select
                        className="mini-select"
                        value={drafts[u.id] ?? u.role}
                        onChange={(e) => setDrafts((prev) => ({ ...prev, [u.id]: e.target.value as Role }))}
                      >
                        {ROLE_OPTIONS.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                      <button className="btn btn-outline btn-mini" onClick={() => saveRole(u.id)}>
                        Save
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
