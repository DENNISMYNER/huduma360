# Huduma360 API reference

Base URL: `http://localhost:4000/api` (see `backend/.env` → `PORT`)

All responses share this envelope:

```json
{ "success": true, "data": { ... } }
{ "success": false, "error": { "message": "...", "details": {...} } }
```

Authentication is a JWT stored in an httpOnly cookie (`h360_token`), set automatically by
`/auth/login` and `/auth/register`. Every request that sends cookies must use
`credentials: "include"` (fetch) or equivalent.

**CSRF:** every `POST`/`PATCH`/`DELETE` request must echo back the `h360_csrf` cookie value in
an `x-csrf-token` header (double-submit pattern). The cookie is issued automatically on any `GET`
request. See `frontend/js/api.js` for a working example.

---

## Auth — `/auth`

| Method | Path                  | Auth | Description |
|--------|-----------------------|------|-------------|
| POST   | `/auth/register`      | —    | `{ fullName, email, password, phone?, county?, nationalId? }` |
| POST   | `/auth/login`         | —    | `{ email, password }` |
| POST   | `/auth/logout`        | —    | Clears the session cookie |
| GET    | `/auth/me`            | ✓    | Current user's public profile |
| POST   | `/auth/verify-email`  | —    | `{ token }` |
| POST   | `/auth/forgot-password` | —  | `{ email }` — always returns success (doesn't leak account existence) |
| POST   | `/auth/reset-password`  | —  | `{ token, password }` |

## Users — `/users`

| Method | Path                        | Auth        | Description |
|--------|-----------------------------|-------------|-------------|
| GET    | `/users/profile`            | ✓           | Own profile |
| PATCH  | `/users/profile`            | ✓           | `{ fullName?, phone?, county? }` |
| GET    | `/users/admin`              | ADMIN/STAFF | Paginated list, `?q=&role=&page=&pageSize=` |
| PATCH  | `/users/admin/:id/role`     | ADMIN       | `{ role: "USER"\|"STAFF"\|"ADMIN" }` |
| PATCH  | `/users/admin/:id/deactivate` | ADMIN     | Soft-disables an account |

## Categories — `/categories`

| Method | Path              | Auth  | Description |
|--------|-------------------|-------|-------------|
| GET    | `/categories`     | —     | All categories with service counts |
| GET    | `/categories/:slug` | —   | One category + its active services |
| POST   | `/categories`     | ADMIN | Create |
| PATCH  | `/categories/:id` | ADMIN | Update |
| DELETE | `/categories/:id` | ADMIN | Delete (blocked if it still has services) |

## Services — `/services`

| Method | Path            | Auth  | Description |
|--------|-----------------|-------|-------------|
| GET    | `/services`     | —     | `?q=&category=&popular=&page=&pageSize=` |
| GET    | `/services/:id` | —     | One service (by id) |
| POST   | `/services`     | ADMIN | Create |
| PATCH  | `/services/:id` | ADMIN | Update |
| DELETE | `/services/:id` | ADMIN | Soft-delete (`isActive: false`) |

## Applications — `/applications`

| Method | Path                     | Auth        | Description |
|--------|--------------------------|-------------|-------------|
| POST   | `/applications`          | ✓           | `{ serviceId, formData }` — creates in `SUBMITTED` or `PAYMENT_PENDING` depending on the service's fee |
| GET    | `/applications`          | ✓           | Own applications, `?status=&page=&pageSize=` |
| GET    | `/applications/:id`      | ✓ (owner/staff/admin) | One application + payments + status history |
| GET    | `/applications/admin`    | ADMIN/STAFF | All applications, `?status=&q=&page=&pageSize=` |
| PATCH  | `/applications/:id/status` | ADMIN/STAFF | `{ status, note? }` |

Status flow: `SUBMITTED → (PAYMENT_PENDING →) PROCESSING → APPROVED | REJECTED`

## Payments — `/payments`

| Method | Path                  | Auth        | Description |
|--------|-----------------------|-------------|-------------|
| POST   | `/payments`           | ✓           | `{ applicationId, method: "MPESA"\|"CARD"\|"BANK", phone? }` |
| GET    | `/payments/:id`       | ✓ (owner/staff/admin) | One payment |
| POST   | `/payments/webhook`   | —           | Provider callback: `{ transactionRef, status, providerRef?, failureReason? }` |
| GET    | `/payments/admin/all` | ADMIN/STAFF | `?status=&page=&pageSize=` |

## Notifications — `/notifications`

| Method | Path                     | Auth | Description |
|--------|--------------------------|------|-------------|
| GET    | `/notifications`         | ✓    | Latest 50 + unread count |
| PATCH  | `/notifications/:id/read`| ✓    | Mark one as read |
| PATCH  | `/notifications/read-all`| ✓    | Mark all as read |

## Saved services — `/saved`

| Method | Path                | Auth | Description |
|--------|---------------------|------|-------------|
| GET    | `/saved`            | ✓    | List saved services |
| POST   | `/saved/:serviceId` | ✓    | Save |
| DELETE | `/saved/:serviceId` | ✓    | Unsave |

## Recently viewed — `/recent`

| Method | Path                 | Auth | Description |
|--------|----------------------|------|-------------|
| GET    | `/recent`            | ✓    | Last 12 viewed services |
| POST   | `/recent/:serviceId` | ✓    | Record a view |

## Admin — `/admin`

| Method | Path          | Auth        | Description |
|--------|---------------|-------------|-------------|
| GET    | `/admin/stats`| ADMIN/STAFF | Dashboard totals: users, services, applications by status, revenue, recent applications |
