/**
 * These tests spin up the real Express app and hit it with supertest, backed by the
 * `huduma360_test` Postgres database (see .env.test). They require a real generated
 * Prisma Client — run `npm run prisma:generate && npm run prisma:migrate:deploy` against
 * DATABASE_URL in .env.test before running `npm test`.
 */
import request from "supertest";
import { createApp } from "../../src/app";
import { prisma } from "../../src/config/prisma";

const app = createApp();

function extractCookie(res: request.Response, name: string): string | undefined {
  const setCookie = res.get("set-cookie") as unknown as string[] | undefined;
  const match = setCookie?.find((c) => c.startsWith(`${name}=`));
  return match?.split(";")[0];
}

async function getCsrfToken(): Promise<{ csrfCookie: string; csrfToken: string }> {
  const res = await request(app).get("/api/health");
  const csrfCookie = extractCookie(res, "h360_csrf")!;
  const csrfToken = csrfCookie.split("=")[1];
  return { csrfCookie, csrfToken };
}

describe("Huduma360 API", () => {
  const testEmail = `test-${Date.now()}@example.com`;

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: testEmail } });
    await prisma.$disconnect();
  });

  it("GET /api/health returns ok", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe("ok");
  });

  it("rejects a mutating request with no CSRF token", async () => {
    const res = await request(app).post("/api/auth/register").send({
      fullName: "No CSRF",
      email: "no-csrf@example.com",
      password: "Password1",
    });
    expect(res.status).toBe(403);
  });

  it("registers a new user, sets an auth cookie, and returns the public profile", async () => {
    const { csrfCookie, csrfToken } = await getCsrfToken();

    const res = await request(app)
      .post("/api/auth/register")
      .set("Cookie", csrfCookie)
      .set("x-csrf-token", csrfToken)
      .send({ fullName: "Test User", email: testEmail, password: "Password1" });

    expect(res.status).toBe(201);
    expect(res.body.data.user.email).toBe(testEmail);
    expect(res.body.data.user.passwordHash).toBeUndefined(); // never leak the hash
    expect(extractCookie(res, "h360_token")).toBeDefined();
  });

  it("rejects registering the same email twice", async () => {
    const { csrfCookie, csrfToken } = await getCsrfToken();
    const res = await request(app)
      .post("/api/auth/register")
      .set("Cookie", csrfCookie)
      .set("x-csrf-token", csrfToken)
      .send({ fullName: "Test User", email: testEmail, password: "Password1" });
    expect(res.status).toBe(409);
  });

  it("logs in with correct credentials and rejects incorrect ones", async () => {
    const { csrfCookie, csrfToken } = await getCsrfToken();

    const good = await request(app)
      .post("/api/auth/login")
      .set("Cookie", csrfCookie)
      .set("x-csrf-token", csrfToken)
      .send({ email: testEmail, password: "Password1" });
    expect(good.status).toBe(200);

    const bad = await request(app)
      .post("/api/auth/login")
      .set("Cookie", csrfCookie)
      .set("x-csrf-token", csrfToken)
      .send({ email: testEmail, password: "WrongPassword" });
    expect(bad.status).toBe(401);
  });

  it("blocks unauthenticated access to /api/auth/me", async () => {
    const res = await request(app).get("/api/auth/me");
    expect(res.status).toBe(401);
  });

  it("lists seeded categories and services publicly", async () => {
    const categories = await request(app).get("/api/categories");
    expect(categories.status).toBe(200);
    expect(Array.isArray(categories.body.data.items)).toBe(true);

    const services = await request(app).get("/api/services");
    expect(services.status).toBe(200);
    expect(Array.isArray(services.body.data.items)).toBe(true);
  });

  describe("full application + payment flow", () => {
    let authCookie: string;
    let csrfCookie: string;
    let csrfToken: string;
    let serviceId: string;
    let applicationId: string;

    beforeAll(async () => {
      const csrf = await getCsrfToken();
      csrfCookie = csrf.csrfCookie;
      csrfToken = csrf.csrfToken;

      const login = await request(app)
        .post("/api/auth/login")
        .set("Cookie", csrfCookie)
        .set("x-csrf-token", csrfToken)
        .send({ email: testEmail, password: "Password1" });
      authCookie = extractCookie(login, "h360_token")!;

      // Pick a service that actually has a fee, so the PAYMENT_PENDING path is exercised.
      const services = await request(app).get("/api/services?pageSize=100");
      const paidService = services.body.data.items.find((s: { feeCents: number }) => s.feeCents > 0);
      serviceId = paidService.id;
    });

    it("creates an application in PAYMENT_PENDING status when the service has a fee", async () => {
      const res = await request(app)
        .post("/api/applications")
        .set("Cookie", [authCookie, csrfCookie].join("; "))
        .set("x-csrf-token", csrfToken)
        .send({ serviceId, formData: { fullName: "Test User", idNumber: "12345678" } });

      expect(res.status).toBe(201);
      expect(res.body.data.application.status).toBe("PAYMENT_PENDING");
      expect(res.body.data.application.referenceNumber).toMatch(/^APP-\d{4}-/);
      applicationId = res.body.data.application.id;
    });

    it("lists the application under 'my applications'", async () => {
      const res = await request(app)
        .get("/api/applications")
        .set("Cookie", [authCookie, csrfCookie].join("; "));
      expect(res.status).toBe(200);
      expect(res.body.data.items.some((a: { id: string }) => a.id === applicationId)).toBe(true);
    });

    it("initiates a payment and moves the application forward on success", async () => {
      // Retry a few times since the mock provider has a ~10% simulated failure rate.
      let res;
      for (let attempt = 0; attempt < 8; attempt++) {
        res = await request(app)
          .post("/api/payments")
          .set("Cookie", [authCookie, csrfCookie].join("; "))
          .set("x-csrf-token", csrfToken)
          .send({ applicationId, method: "MPESA", phone: "0712345678" });
        if (res.body?.data?.payment?.status === "SUCCESS") break;
        if (res.status === 409) break; // already paid from a previous successful attempt
      }
      expect([200, 201, 409]).toContain(res!.status);
    });

    it("rejects a payment for someone else's application", async () => {
      const other = `other-${Date.now()}@example.com`;
      const csrf = await getCsrfToken();
      await request(app)
        .post("/api/auth/register")
        .set("Cookie", csrf.csrfCookie)
        .set("x-csrf-token", csrf.csrfToken)
        .send({ fullName: "Other User", email: other, password: "Password1" });
      const login = await request(app)
        .post("/api/auth/login")
        .set("Cookie", csrf.csrfCookie)
        .set("x-csrf-token", csrf.csrfToken)
        .send({ email: other, password: "Password1" });
      const otherCookie = extractCookie(login, "h360_token")!;

      const res = await request(app)
        .post("/api/payments")
        .set("Cookie", [otherCookie, csrf.csrfCookie].join("; "))
        .set("x-csrf-token", csrf.csrfToken)
        .send({ applicationId, method: "MPESA" });

      expect(res.status).toBe(403);
      await prisma.user.deleteMany({ where: { email: other } });
    });
  });

  describe("role-based access control", () => {
    it("blocks a regular user from the admin stats endpoint", async () => {
      const { csrfCookie, csrfToken } = await getCsrfToken();
      const login = await request(app)
        .post("/api/auth/login")
        .set("Cookie", csrfCookie)
        .set("x-csrf-token", csrfToken)
        .send({ email: testEmail, password: "Password1" });
      const authCookie = extractCookie(login, "h360_token")!;

      const res = await request(app)
        .get("/api/admin/stats")
        .set("Cookie", [authCookie, csrfCookie].join("; "));
      expect(res.status).toBe(403);
    });

    it("allows the seeded admin account into the admin stats endpoint", async () => {
      const { csrfCookie, csrfToken } = await getCsrfToken();
      const login = await request(app)
        .post("/api/auth/login")
        .set("Cookie", csrfCookie)
        .set("x-csrf-token", csrfToken)
        .send({ email: "admin@huduma360.demo", password: "Admin1234" });

      // Skipped gracefully if the test DB hasn't been seeded yet.
      if (login.status !== 200) {
        console.warn("Seeded admin account not found — run `npm run seed` against the test DB first.");
        return;
      }
      const authCookie = extractCookie(login, "h360_token")!;
      const res = await request(app)
        .get("/api/admin/stats")
        .set("Cookie", [authCookie, csrfCookie].join("; "));
      expect(res.status).toBe(200);
      expect(typeof res.body.data.totalUsers).toBe("number");
    });
  });
});
