import { request } from "./httpClient";
import type { Service } from "../types/service";

export const recentApi = {
  list: () => request<{ items: { serviceId: string; service: Service; viewedAt: string }[] }>("/recent"),
  markViewed: (serviceId: string) => request<{ viewed: unknown }>(`/recent/${serviceId}`, { method: "POST" }),
};
