import { registerSchema, loginSchema } from "../../src/modules/auth/schemas";
import { createApplicationSchema } from "../../src/modules/applications/schemas";
import { createPaymentSchema } from "../../src/modules/payments/schemas";

describe("auth schemas", () => {
  it("accepts a valid registration payload", () => {
    const result = registerSchema.safeParse({
      fullName: "Grace Mwikali",
      email: "Grace@Example.com",
      password: "Password1",
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.email).toBe("grace@example.com"); // lowercased
  });

  it("rejects a password without a number", () => {
    const result = registerSchema.safeParse({
      fullName: "Grace Mwikali",
      email: "grace@example.com",
      password: "PasswordOnly",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a password without an uppercase letter", () => {
    const result = registerSchema.safeParse({
      fullName: "Grace Mwikali",
      email: "grace@example.com",
      password: "password1",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid email", () => {
    const result = loginSchema.safeParse({ email: "not-an-email", password: "x" });
    expect(result.success).toBe(false);
  });

  it("rejects a national ID that is not 7-8 digits", () => {
    const result = registerSchema.safeParse({
      fullName: "Grace Mwikali",
      email: "grace@example.com",
      password: "Password1",
      nationalId: "12",
    });
    expect(result.success).toBe(false);
  });
});

describe("application schema", () => {
  it("rejects empty form data", () => {
    const result = createApplicationSchema.safeParse({
      serviceId: "550e8400-e29b-41d4-a716-446655440000",
      formData: {},
    });
    expect(result.success).toBe(false);
  });

  it("accepts populated form data", () => {
    const result = createApplicationSchema.safeParse({
      serviceId: "550e8400-e29b-41d4-a716-446655440000",
      formData: { fullName: "Grace", idNumber: "12345678" },
    });
    expect(result.success).toBe(true);
  });

  it("rejects a non-UUID serviceId", () => {
    const result = createApplicationSchema.safeParse({ serviceId: "not-a-uuid", formData: { a: 1 } });
    expect(result.success).toBe(false);
  });
});

describe("payment schema", () => {
  it("accepts a valid Kenyan phone number in local format", () => {
    const result = createPaymentSchema.safeParse({
      applicationId: "550e8400-e29b-41d4-a716-446655440000",
      method: "MPESA",
      phone: "0712345678",
    });
    expect(result.success).toBe(true);
  });

  it("accepts a valid Kenyan phone number in international format", () => {
    const result = createPaymentSchema.safeParse({
      applicationId: "550e8400-e29b-41d4-a716-446655440000",
      method: "MPESA",
      phone: "+254712345678",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a malformed phone number", () => {
    const result = createPaymentSchema.safeParse({
      applicationId: "550e8400-e29b-41d4-a716-446655440000",
      method: "MPESA",
      phone: "12345",
    });
    expect(result.success).toBe(false);
  });
});
