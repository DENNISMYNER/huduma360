import type { Application } from "../../types/application";
import { STATUS_LABEL, STATUS_CLASS } from "../../utils/format";

export default function ApplicationItem({
  application,
  onPayNow,
}: {
  application: Application;
  onPayNow?: (id: string) => void;
}) {
  return (
    <div className="application-item">
      <div className="application-info">
        <h4>{application.service.name}</h4>
        <span>Ref: {application.referenceNumber}</span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${application.progress}%` }} />
      </div>
      <span className="progress-pct">{application.progress}%</span>
      <span className={`application-status status-${STATUS_CLASS[application.status]}`}>
        {STATUS_LABEL[application.status]}
      </span>
      {application.status === "PAYMENT_PENDING" && onPayNow && (
        <button className="btn btn-green" style={{ marginLeft: 10 }} onClick={() => onPayNow(application.id)}>
          Pay now
        </button>
      )}
    </div>
  );
}
