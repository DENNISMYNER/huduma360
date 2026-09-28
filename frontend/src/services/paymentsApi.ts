import { request } from "./httpClient";
import type { Payment, PaymentMethod, PaymentStatus } from "../types/payment";
import type { Paginated } from "../types/common";

export const paymentsApi = {
  create: (applicationId: string, method: PaymentMethod, phone?: string) =>
    request<{ payment: Payment }>("/payments", { method: "POST", body: { applicationId, method, phone } }),
  get: (id: string) => request<{ payment: Payment }>(`/payments/${id}`),

  adminList: (query: { status?: PaymentStatus; page?: number; pageSize?: number } = {}) =>
    request<Paginated<Payment>>("/payments/admin/all", { query }),
};
