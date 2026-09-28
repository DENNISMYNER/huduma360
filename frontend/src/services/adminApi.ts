import { request } from "./httpClient";
import type { User, Role } from "../types/user";
import type { Paginated } from "../types/common";

export interface AdminStats {
  totalUsers: number;
  totalServices: number;
  totalApplications: number;
  applicationsByStatus: { status: string; count: number }[];
  totalPaymentsSuccess: number;
  totalRevenueCents: number;
  recentApplications: {
    id: string;
    referenceNumber: string;
    status: string;
    service: { name: string };
    user: { fullName: string };
  }[];
}

export const adminApi = {
  stats: () => request<AdminStats>("/admin/stats"),
  listUsers: (query: { q?: string; role?: Role; page?: number; pageSize?: number } = {}) =>
    request<Paginated<User>>("/users/admin", { query }),
  setUserRole: (id: string, role: Role) =>
    request<{ user: User }>(`/users/admin/${id}/role`, { method: "PATCH", body: { role } }),
};
