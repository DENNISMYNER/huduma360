import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import type { ReactNode } from "react";
import type { Category } from "../types/category";
import type { Service } from "../types/service";
import { categoriesApi } from "../services/categoriesApi";
import { servicesApi } from "../services/servicesApi";

interface CatalogContextValue {
  categories: Category[];
  services: Service[];
  loading: boolean;
  error: string | null;
  getBySlug: (slug: string) => Service | undefined;
  refresh: () => Promise<void>;
}

const CatalogContext = createContext<CatalogContextValue | null>(null);

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [{ items: cats }, { items: svcs }] = await Promise.all([
        categoriesApi.list(),
        servicesApi.list({ pageSize: 100 }),
      ]);
      setCategories(cats);
      setServices(svcs);
    } catch {
      setError("Couldn't reach the Huduma360 API — is the backend running?");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const getBySlug = useCallback((slug: string) => services.find((s) => s.slug === slug), [services]);

  const value = useMemo(
    () => ({ categories, services, loading, error, getBySlug, refresh: load }),
    [categories, services, loading, error, getBySlug, load]
  );

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog(): CatalogContextValue {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error("useCatalog must be used within a CatalogProvider");
  return ctx;
}
