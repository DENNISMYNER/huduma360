# Huduma360

A concept "single doorway" into Kenyan government services — browse service categories,
apply for services, pay (simulated) fees, and track application status. This repo contains
a full-stack rebuild of the original static prototype: a real PostgreSQL-backed API with
authentication, role-based access control, and a payment-provider abstraction, behind the
original frontend design.

**This is a demo/portfolio project.** It is not affiliated with the Government of Kenya, and
no real payments are ever processed — all payments go through a local mock provider.

---

## 1. Stack & architecture

| Layer      | Choice                                             | Why                                                                 |
|------------|-----------------------------------------------------|----------------------------------------------------------------------|
| Frontend   | React + TypeScript + Vite                          | Component-based UI with routing, typed API contracts, and a fast dev loop. The original design (HTML/CSS) is preserved — only the implementation moved from vanilla JS to React. |
| Backend    | Node.js + Express + TypeScript                      | Express is the right size for this API's scope (10 resource groups, no heavy real-time/streaming needs). NestJS would add DI/module ceremony this project doesn't need yet. |
| Database   | PostgreSQL                                          | Relational data (users, applications, payments, audit trail) with real foreign keys and constraints. |
| ORM        | Prisma                                              | Type-safe queries, migrations, and a schema that doubles as documentation. |
| Auth       | JWT in an httpOnly cookie                           | Simpler and safer against XSS than storing tokens in `localStorage`; no refresh-token complexity needed at this scale. |
| Payments   | Provider abstraction (`PaymentProvider` interface)  | `MockPaymentService` today, `MpesaPaymentService` stub ready for real Daraja credentials later — swapping providers never touches business logic. |

```
huduma360/
├── backend/           Express + TypeScript API
│   ├── prisma/        schema.prisma, migrations, seed script + seed data
│   ├── src/
│   │   ├── config/     env loading, Prisma client singleton
│   │   ├── middleware/ auth, error handling, validation, CSRF, rate limiting
│   │   ├── modules/    auth, users, categories, services, applications, payments,
│   │   │               notifications, saved, recent, admin (each: routes + schemas + service)
│   │   ├── integrations/ payment providers (mock/M-Pesa), identity verification (mock)
│   │   └── utils/       AppError, JWT, password hashing, reference numbers, audit log
│   └── tests/          unit tests (no DB needed) + integration tests (need a real DB)
├── frontend/          React + TypeScript + Vite
│   ├── src/
│   │   ├── types/       TypeScript types mirroring backend API responses
│   │   ├── services/    typed API client (one module per resource) + httpClient.ts (CSRF handling)
│   │   ├── context/     AuthContext, CatalogContext, SavedContext, ThemeContext, ToastContext
│   │   ├── components/  layout/, common/, services/, applications/, admin/
│   │   ├── layouts/     MainLayout (public/user chrome), AdminLayout (admin dashboard chrome)
│   │   └── pages/       one component per route, incl. pages/admin/ for the admin dashboard
│   └── vite.config.ts  dev proxy: /api -> backend, so there's no CORS in development
└── docs/API.md        endpoint reference
```

---

## 2. Prerequisites

- Node.js 18+
- PostgreSQL 14+ running locally (or a connection string to a hosted instance)
- A way to serve static files for the frontend (see step 5) — anything works; a browser
  opening `index.html` directly via `file://` will **not** work because cookies/CORS need a real origin.

---

## 3. Backend setup

```bash
cd backend
npm install

cp .env.example .env
# edit .env — at minimum set DATABASE_URL to your Postgres connection string
# and CLIENT_ORIGIN to whatever origin you'll serve the frontend from (step 5)

npm run prisma:generate   # generates the Prisma Client (needs network access)
npm run prisma:migrate    # creates the database schema (creates & applies a migration)
npm run seed               # loads the 10 categories / 60 services + 3 demo accounts

npm run dev                 # starts the API on http://localhost:4000
```

Demo accounts created by the seed script:

| Role   | Email                     | Password     |
|--------|---------------------------|--------------|
| Admin  | admin@huduma360.demo      | Admin1234    |
| Staff  | staff@huduma360.demo      | Staff1234    |
| Citizen| citizen@huduma360.demo    | Citizen123   |

### Running tests

```bash
npm test               # unit tests — pure logic, no database needed
npm run test:integration  # full HTTP API tests — needs prisma:generate + prisma:migrate against
                            # the DATABASE_URL in .env.test first
```

---

## 4. Switching to real M-Pesa (optional)

By default `PAYMENT_PROVIDER=mock` in `.env`, which simulates payments (~90% success) with no
real money movement. To wire up real M-Pesa:

1. Get Daraja API credentials from Safaricom.
2. Fill in `MPESA_*` variables in `.env`.
3. Set `PAYMENT_PROVIDER=mpesa`.
4. Finish the implementation in `backend/src/integrations/payments/MpesaPaymentService.ts` —
   it's a structural stub with the exact steps documented inline (OAuth token fetch, STK push,
   and wiring the callback into `POST /api/payments/webhook`).

Nothing else in the codebase needs to change — `getPaymentProvider()` picks the provider based
on this one environment variable.

---

## 5. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173`. In development, Vite proxies `/api` requests straight to the
backend on `http://localhost:4000` (see `vite.config.ts`), so the browser sees everything as
same-origin — no CORS setup needed, and cookies (session + CSRF) just work automatically.

If you deploy the frontend and backend on different origins in production, set
`VITE_API_BASE_URL` (e.g. in a `.env.production` file in `frontend/`) to the backend's full API
URL, and make sure the backend's `CLIENT_ORIGIN` matches the frontend's deployed origin exactly.

```bash
npm run build      # production build -> frontend/dist/
npm run preview    # serve the production build locally to sanity-check it
```

---

## 6. What's implemented

- Registration / login / logout with hashed passwords (bcrypt) and JWT-in-httpOnly-cookie sessions
- Email verification & password reset token flow (tokens are logged to the console instead of
  emailed, since no email provider is configured — see `backend/src/modules/auth/service.ts`)
- Role-based access control (`USER` / `STAFF` / `ADMIN`), enforced server-side on every protected route
- Service catalogue (10 categories, 60 services) seeded from the original frontend's real data
- Application submission → payment (when the service has a fee) → status tracking, with a full
  status history and user-facing notifications at each step
- Admin dashboard: stats, application status management, payment records, user role management
- CSRF protection (double-submit cookie), rate limiting, helmet security headers, centralized
  error handling, audit logging on sensitive actions
- Mock payment provider with a real interface (`PaymentProvider`) so a real gateway can be
  dropped in later without touching business logic
- Automated tests: 26 passing unit tests (schemas, JWT, password hashing, reference generation,
  mock payment provider) + a full integration suite (registration → application → payment →
  admin RBAC) that runs against a real database

## 7. Deliberate simplifications (and why)

- **No separate roles/permissions tables** — a `Role` enum (`USER`/`STAFF`/`ADMIN`) covers this
  app's actual access patterns. A full permissions matrix would be over-engineering for three roles.
- **Saved services / recently-viewed / applications require login** — matches how a real
  government portal like eCitizen behaves, and avoids the complexity of merging anonymous
  local state into an account on login.
- **Password reset/verification emails are logged, not sent** — there's no email provider
  configured. The token generation, storage, and consumption flow is fully real; only the
  "send an email" step is a stand-in (clearly marked in the code).
- **Categories/services caching on the frontend** — the full catalogue (70 rows) is fetched
  once on page load and filtered/searched client-side, rather than a request per interaction.
  At this data size that's simpler and faster than adding a debounced server-search dependency.

## 8. Troubleshooting

- **`prisma generate` fails to download engines** — this needs outbound network access to
  Prisma's CDN. If you're behind a restrictive firewall/proxy, allow `binaries.prisma.sh`, or
  see Prisma's docs on custom binary mirrors.
- **CORS errors in the browser console** — in development this shouldn't happen (Vite's proxy
  makes requests same-origin). In production, `CLIENT_ORIGIN` in the backend's `.env` must
  exactly match the origin (protocol + host + port) the frontend is deployed at.
- **Login works but subsequent requests get 403 "Invalid or missing CSRF token"** — the frontend
  needs to have made at least one `GET` request (it does this automatically in
  `frontend/src/services/httpClient.ts`) before its first `POST`/`PATCH`/`DELETE`, so the CSRF
  cookie has been issued. Clear cookies and reload if you're testing manually with a REST client
  and skipped this.
- **"Application not found" right after creating one** — make sure the frontend's dev server was
  started after the backend (so its `/api` proxy target is reachable), and that you're not
  running two different `DATABASE_URL`s by accident.
