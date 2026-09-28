export type InitiatePaymentInput = {
  amountCents: number;
  phone?: string;
  reference: string; // our internal transactionRef, passed through to the provider
  description: string;
};

export type InitiatePaymentResult = {
  status: "PENDING" | "SUCCESS" | "FAILED";
  providerRef?: string;
  failureReason?: string;
};

/**
 * Every payment provider (mock, M-Pesa, card processor, ...) implements this interface.
 * Business logic in the payments module only ever talks to `PaymentProvider` — never to a
 * concrete provider — so a real provider can be dropped in later without touching anything else.
 */
export interface PaymentProvider {
  /** Kicks off a payment. May resolve synchronously (mock) or return PENDING and settle later via a webhook (M-Pesa STK push). */
  initiate(input: InitiatePaymentInput): Promise<InitiatePaymentResult>;
}
