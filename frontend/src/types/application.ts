export type ApplicationStatus = "SUBMITTED" | "PAYMENT_PENDING" | "PROCESSING" | "APPROVED" | "REJECTED";

export interface ApplicationStatusEvent {
  id: string;
  status: ApplicationStatus;
  note: string | null;
  createdAt: string;
}

export interface ApplicationServiceRef {
  id?: string;
  name: string;
  slug?: string;
  feeCents?: number;
}

export interface Application {
  id: string;
  referenceNumber: string;
  status: ApplicationStatus;
  progress: number;
  formData: Record<string, unknown>;
  service: ApplicationServiceRef;
  user?: { fullName: string; email: string };
  statusHistory?: ApplicationStatusEvent[];
  payments?: { id: string; status: string; amountCents: number; transactionRef: string }[];
  createdAt: string;
}
