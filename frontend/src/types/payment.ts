export type PaymentMethod = "MPESA" | "CARD" | "BANK";
export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED";

export interface Payment {
  id: string;
  applicationId: string;
  amountCents: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionRef: string;
  providerRef: string | null;
  failureReason: string | null;
  user?: { fullName: string; email: string };
  application?: { referenceNumber: string };
  createdAt: string;
}
