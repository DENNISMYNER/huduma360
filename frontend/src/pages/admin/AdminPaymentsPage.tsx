import { useEffect, useState } from "react";
import type { Payment } from "../../types/payment";
import { paymentsApi } from "../../services/paymentsApi";
import { formatMoney } from "../../utils/format";
import { StatusPill } from "../../components/admin/StatCard";
import Spinner from "../../components/common/Spinner";
import { useToast } from "../../context/ToastContext";

export default function AdminPaymentsPage() {
  const [items, setItems] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    paymentsApi
      .adminList({ pageSize: 50 })
      .then(({ items }) => setItems(items))
      .catch(() => toast("Couldn't load payments", "error"))
      .finally(() => setLoading(false));
  }, [toast]);

  if (loading) return <Spinner />;

  return (
    <section>
      <div className="table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Transaction Ref</th>
              <th>User</th>
              <th>Application</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p.id}>
                <td>{p.transactionRef}</td>
                <td>{p.user?.fullName}</td>
                <td>{p.application?.referenceNumber}</td>
                <td>{formatMoney(p.amountCents)}</td>
                <td>{p.method}</td>
                <td>
                  <StatusPill status={p.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
