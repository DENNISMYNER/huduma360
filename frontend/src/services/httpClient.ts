import { ApiError } from "../types/common";

// In dev, Vite's proxy (see vite.config.ts) forwards /api to the backend, so the browser sees
// everything as same-origin — no CORS, and cookies just work. In production, set
// VITE_API_BASE_URL if the frontend and backend are served from different origins.
const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

let csrfEnsured = false;
async function ensureCsrfCookie(): Promise<void> {
  if (csrfEnsured || getCookie("h360_csrf")) {
    csrfEnsured = true;
    return;
  }
  await fetch(`${API_BASE}/health`, { credentials: "include" });
  csrfEnsured = true;
}

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  query?: object;
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, query } = options;
  await ensureCsrfCookie();

  let url = `${API_BASE}${path}`;
  if (query) {
    const params = new URLSearchParams();
    Object.entries(query as Record<string, unknown>).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") params.set(key, String(value));
    });
    const qs = params.toString();
    if (qs) url += `?${qs}`;
  }

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const isMutating = method !== "GET";
  if (isMutating) headers["x-csrf-token"] = getCookie("h360_csrf") || "";

  const res = await fetch(url, {
    method,
    headers,
    credentials: "include",
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  let payload: { data?: T; error?: ApiErrorPayload } | null = null;
  try {
    payload = await res.json();
  } catch {
    // no JSON body (e.g. 204)
  }

  if (!res.ok) {
    const message = payload?.error?.message || `Request failed (${res.status})`;
    throw new ApiError(message, res.status, payload?.error?.details);
  }
  return payload?.data as T;
}

interface ApiErrorPayload {
  message: string;
  details?: unknown;
}
