import { InitiatePaymentInput, InitiatePaymentResult, PaymentProvider } from "./PaymentProvider";

/**
 * Simulates a payment gateway locally so the full application flow works out of the box.
 * Never talks to any real financial system. ~90% of payments succeed, mirroring the kind
 * of occasional failure a real gateway would produce, so the UI's failure states are exercised too.
 */
export class MockPaymentService implements PaymentProvider {
  async initiate(input: InitiatePaymentInput): Promise<InitiatePaymentResult> {
    const succeeds = Math.random() < 0.9;
    const providerRef = `MOCK-${Date.now().toString(36).toUpperCase()}`;

    if (succeeds) {
      return { status: "SUCCESS", providerRef };
    }
    return {
      status: "FAILED",
      providerRef,
      failureReason: "Simulated gateway decline (mock provider)",
    };
  }
}
