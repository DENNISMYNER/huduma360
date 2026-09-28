import { request } from "./httpClient";
import type { Application, ApplicationStatus } from "../types/application";
import type { Paginated } from "../types/common";

export const applicationsApi = {
  create: (serviceId: string, formData: Record<string, unknown>) =>
    request<{ application: Application }>("/applications", { method: "POST", body: { serviceId, formData } }),
  listMine: (query: { status?: ApplicationStatus; page?: number; pageSize?: number } = {}) =>
    request<Paginated<Application>>("/applications", { query }),
  get: (id: string) => request<{ application: Application }>(`/applications/${id}`),

  adminList: (query: { status?: ApplicationStatus; q?: string; page?: number; pageSize?: number } = {}) =>
    request<Paginated<Application>>("/applications/admin", { query }),
  adminUpdateStatus: (id: string, status: ApplicationStatus, note?: string) =>
    request<{ application: Application }>(`/applications/${id}/status`, { method: "PATCH", body: { status, note } }),
};
