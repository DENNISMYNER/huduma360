export function formatFee(feeCents: number): string {
  return feeCents > 0 ? `KES ${(feeCents / 100).toLocaleString()}` : "Free";
}

export function formatMoney(cents: number): string {
  return `KES ${(cents / 100).toLocaleString()}`;
}

export const STATUS_LABEL: Record<string, string> = {
  SUBMITTED: "Submitted",
  PAYMENT_PENDING: "Payment Required",
  PROCESSING: "Processing",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  PENDING: "Pending",
  SUCCESS: "Success",
  FAILED: "Failed",
};

export const STATUS_CLASS: Record<string, string> = {
  SUBMITTED: "submitted",
  PAYMENT_PENDING: "payment",
  PROCESSING: "processing",
  APPROVED: "approved",
  REJECTED: "rejected",
  PENDING: "payment",
  SUCCESS: "approved",
  FAILED: "rejected",
};
