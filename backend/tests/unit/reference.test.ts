import { generateReference } from "../../src/utils/reference";
import { generateToken, hashToken } from "../../src/utils/token";

describe("generateReference", () => {
  it("produces a reference matching PREFIX-YEAR-XXXXXX", () => {
    const ref = generateReference("APP");
    expect(ref).toMatch(/^APP-\d{4}-[A-Z0-9]{6}$/);
  });

  it("does not use ambiguous characters (0, O, 1, I)", () => {
    for (let i = 0; i < 50; i++) {
      const ref = generateReference("PAY");
      const suffix = ref.split("-")[2];
      expect(suffix).not.toMatch(/[0O1I]/);
    }
  });

  it("generates distinct references across calls", () => {
    const refs = new Set(Array.from({ length: 20 }, () => generateReference("APP")));
    expect(refs.size).toBeGreaterThan(1);
  });
});

describe("token utils", () => {
  it("generates a raw token whose hash matches hashToken(raw)", () => {
    const { raw, hash } = generateToken();
    expect(hashToken(raw)).toBe(hash);
  });

  it("produces different raw tokens each call", () => {
    const a = generateToken();
    const b = generateToken();
    expect(a.raw).not.toBe(b.raw);
  });
});
