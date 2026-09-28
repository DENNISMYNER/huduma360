import { request } from "./httpClient";
import type { Service } from "../types/service";
import type { Paginated } from "../types/common";

export interface ServiceQuery {
  q?: string;
  category?: string;
  popular?: boolean;
  page?: number;
  pageSize?: number;
}

export const servicesApi = {
  list: (query: ServiceQuery = {}) => request<Paginated<Service>>("/services", { query }),
  get: (id: string) => request<{ service: Service }>(`/services/${id}`),
};
