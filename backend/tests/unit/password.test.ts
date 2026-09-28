import { hashPassword, comparePassword } from "../../src/utils/password";

describe("password utils", () => {
  it("hashes a password to a bcrypt string distinct from the original", async () => {
    const hash = await hashPassword("Sup3rSecret!");
    expect(hash).not.toEqual("Sup3rSecret!");
    expect(hash.startsWith("$2")).toBe(true); // bcrypt hash prefix
  });

  it("verifies a correct password against its hash", async () => {
    const hash = await hashPassword("Correct1Horse");
    await expect(comparePassword("Correct1Horse", hash)).resolves.toBe(true);
  });

  it("rejects an incorrect password", async () => {
    const hash = await hashPassword("Correct1Horse");
    await expect(comparePassword("WrongPassword1", hash)).resolves.toBe(false);
  });

  it("produces a different hash each time (unique salt)", async () => {
    const [a, b] = await Promise.all([hashPassword("SamePassword1"), hashPassword("SamePassword1")]);
    expect(a).not.toEqual(b);
  });
});
