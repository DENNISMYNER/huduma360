import { request } from "./httpClient";
import type { Category } from "../types/category";
import type { Service } from "../types/service";

export const categoriesApi = {
  list: () => request<{ items: Category[] }>("/categories"),
  getBySlug: (slug: string) => request<{ category: Category & { services: Service[] } }>(`/categories/${slug}`),
};
