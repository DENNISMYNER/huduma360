import { useCallback, useEffect, useState } from "react";
import type { Application } from "../types/application";
import type { Service } from "../types/service";
import { applicationsApi } from "../services/applicationsApi";
import { useCatalog } from "../context/CatalogContext";
import { useToast } from "../context/ToastContext";
import ApplicationItem from "../components/applications/ApplicationItem";
import ApplyFlowModal from "../components/applications/ApplyFlowModal";
import Spinner from "../components/common/Spinner";

export default function ApplicationsPage() {
  const [items, setItems] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [payingFor, setPayingFor] = useState<Application | null>(null);
  const { getBySlug } = useCatalog();
  const { toast } = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { items: apps } = await applicationsApi.listMine({ pageSize: 50 });
      setItems(apps);
    } catch {
      toast("Couldn't load your applications", "error");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  async function handlePayNow(id: string) {
    try {
      const { application } = await applicationsApi.get(id);
      setPayingFor(application);
    } catch {
      toast("Couldn't load that application", "error");
    }
  }

  // The apply flow needs a full Service object (for fee/name); resolve it from the cached catalog.
  const payingService: Service | undefined = payingFor ? getBySlug(payingFor.service.slug || "") : undefined;

  return (
    <section className="section">
      <div className="section-inner">
        <div className="section-head">
          <h2>My applications</h2>
          <p className="section-sub">Track the status of services you've applied for</p>
        </div>

        {loading && <Spinner />}
        {!loading && items.length === 0 && <p className="empty-inline">You haven't applied for any services yet.</p>}
        {!loading && (
          <div className="applications-list">
            {items.map((a) => (
              <ApplicationItem key={a.id} application={a} onPayNow={handlePayNow} />
            ))}
          </div>
        )}
      </div>

      {payingFor && payingService && (
        <ApplyFlowModal
          service={payingService}
          existingApplication={payingFor}
          onClose={() => setPayingFor(null)}
          onSubmitted={load}
        />
      )}
    </section>
  );
}
