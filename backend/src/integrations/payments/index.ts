import { env } from "../../config/env";
import { PaymentProvider } from "./PaymentProvider";
import { MockPaymentService } from "./MockPaymentService";
import { MpesaPaymentService } from "./MpesaPaymentService";

let instance: PaymentProvider | null = null;

/** Returns the active payment provider based on PAYMENT_PROVIDER, cached as a singleton. */
export function getPaymentProvider(): PaymentProvider {
  if (instance) return instance;
  switch (env.paymentProvider) {
    case "mpesa":
      instance = new MpesaPaymentService();
      break;
    case "mock":
    default:
      instance = new MockPaymentService();
      break;
  }
  return instance;
}
