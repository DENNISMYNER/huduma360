import { env } from "../../config/env";
import { AppError } from "../../utils/AppError";
import { InitiatePaymentInput, InitiatePaymentResult, PaymentProvider } from "./PaymentProvider";

/**
 * Structured for Safaricom's Daraja M-Pesa STK Push API. This is NOT a working integration —
 * it is the seam where a real integration goes. It intentionally refuses to run without
 * credentials rather than silently pretending to charge anyone.
 *
 * To finish this integration:
 *  1. Fill in MPESA_* variables in .env with real Daraja credentials.
 *  2. Implement OAuth token fetch (POST /oauth/v1/generate) and cache the token until it expires.
 *  3. Implement STK push (POST /mpesa/stkpush/v1/processrequest) using the reference as
 *     AccountReference and MPESA_CALLBACK_URL as the callback.
 *  4. Handle the callback in the payments webhook route to move the payment from PENDING to
 *     SUCCESS/FAILED based on the ResultCode M-Pesa sends back.
 */
export class MpesaPaymentService implements PaymentProvider {
  async initiate(_input: InitiatePaymentInput): Promise<InitiatePaymentResult> {
    if (!env.mpesa.consumerKey || !env.mpesa.shortcode || !env.mpesa.passkey) {
      throw AppError.internal(
        "M-Pesa is not configured. Set MPESA_CONSUMER_KEY, MPESA_SHORTCODE and MPESA_PASSKEY in .env, " +
          "or set PAYMENT_PROVIDER=mock to use the local simulator."
      );
    }
    // Real Daraja OAuth + STK push call goes here.
    throw AppError.internal("MpesaPaymentService is a structural stub — implement the Daraja API call before use.");
  }
}
