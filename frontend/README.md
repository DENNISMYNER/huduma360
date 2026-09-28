# Huduma360 frontend

React + TypeScript + Vite. See the repo root `README.md` for full setup instructions.

## Quick start

```bash
npm install
npm run dev      # http://localhost:5173, proxies /api to the backend on :4000
```

## Structure

- `src/types/` — TypeScript types mirroring the backend's API responses
- `src/services/` — typed API client (one module per resource), all going through `httpClient.ts`
  (handles the CSRF double-submit cookie automatically)
- `src/context/` — React Context providers: `AuthContext`, `CatalogContext` (categories/services
  cache), `SavedContext`, `ThemeContext`, `ToastContext`
- `src/components/` — reusable UI pieces, grouped by domain (`layout/`, `common/`, `services/`,
  `applications/`, `admin/`)
- `src/layouts/` — `MainLayout` (public/user-facing chrome) and `AdminLayout` (admin dashboard chrome)
- `src/pages/` — one component per route, including `pages/admin/` for the admin dashboard

## Notes

- In development, `vite.config.ts` proxies `/api` to `http://localhost:4000`, so the browser sees
  every request as same-origin — no CORS configuration needed, and cookies (session + CSRF) just
  work. In production, set `VITE_API_BASE_URL` if the frontend and backend are on different origins.
- Route guards (`RequireAuth`, `RequireAdmin`) redirect to `/login` (preserving the page you were
  on via router state) or show a simple "admin access required" message.
