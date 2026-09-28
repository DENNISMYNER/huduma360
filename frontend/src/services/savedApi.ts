import { request } from "./httpClient";
import type { Service } from "../types/service";

export const savedApi = {
  list: () => request<{ items: { serviceId: string; service: Service }[] }>("/saved"),
  save: (serviceId: string) => request<{ saved: unknown }>(`/saved/${serviceId}`, { method: "POST" }),
  unsave: (serviceId: string) => request<{ removed: boolean }>(`/saved/${serviceId}`, { method: "DELETE" }),
};
