import { signToken, verifyToken } from "../../src/utils/jwt";

describe("jwt utils", () => {
  it("signs and verifies a token round-trip", () => {
    const token = signToken({ sub: "user-123", role: "USER" as never });
    const payload = verifyToken(token);
    expect(payload.sub).toBe("user-123");
    expect(payload.role).toBe("USER");
  });

  it("throws when verifying a tampered token", () => {
    const token = signToken({ sub: "user-123", role: "USER" as never });
    const tampered = token.slice(0, -2) + "xx";
    expect(() => verifyToken(tampered)).toThrow();
  });

  it("throws when verifying garbage input", () => {
    expect(() => verifyToken("not-a-real-token")).toThrow();
  });
});
