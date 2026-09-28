import { MockPaymentService } from "../../src/integrations/payments/MockPaymentService";

describe("MockPaymentService", () => {
  const provider = new MockPaymentService();

  it("resolves with either SUCCESS or FAILED and a providerRef", async () => {
    const result = await provider.initiate({
      amountCents: 100000,
      reference: "PAY-2026-TEST01",
      description: "Test payment",
    });
    expect(["SUCCESS", "FAILED"]).toContain(result.status);
    expect(result.providerRef).toMatch(/^MOCK-/);
    if (result.status === "FAILED") {
      expect(result.failureReason).toBeTruthy();
    }
  });

  it("succeeds most of the time (statistical sanity check)", async () => {
    const results = await Promise.all(
      Array.from({ length: 60 }, () =>
        provider.initiate({ amountCents: 1000, reference: "PAY-2026-BULK", description: "bulk test" })
      )
    );
    const successRate = results.filter((r) => r.status === "SUCCESS").length / results.length;
    // ~90% expected; allow generous margin to avoid test flakiness
    expect(successRate).toBeGreaterThan(0.6);
  });
});

describe("MpesaPaymentService", () => {
  it("refuses to run without credentials configured", async () => {
    const { MpesaPaymentService } = await import("../../src/integrations/payments/MpesaPaymentService");
    const provider = new MpesaPaymentService();
    await expect(
      provider.initiate({ amountCents: 1000, reference: "PAY-2026-MPESA", description: "test" })
    ).rejects.toThrow(/not configured|structural stub/);
  });
});
