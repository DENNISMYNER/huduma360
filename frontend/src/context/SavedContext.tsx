import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import type { ReactNode } from "react";
import { savedApi } from "../services/savedApi";
import { useAuth } from "./AuthContext";

interface SavedContextValue {
  savedIds: Set<string>;
  isSaved: (serviceId: string) => boolean;
  toggle: (serviceId: string) => Promise<void>;
  refresh: () => Promise<void>;
}

const SavedContext = createContext<SavedContextValue | null>(null);

export function SavedProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  const refresh = useCallback(async () => {
    if (!user) {
      setSavedIds(new Set());
      return;
    }
    try {
      const { items } = await savedApi.list();
      setSavedIds(new Set(items.map((i) => i.serviceId)));
    } catch {
      setSavedIds(new Set());
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const toggle = useCallback(
    async (serviceId: string) => {
      const currentlySaved = savedIds.has(serviceId);
      // optimistic update
      setSavedIds((prev) => {
        const next = new Set(prev);
        if (currentlySaved) next.delete(serviceId);
        else next.add(serviceId);
        return next;
      });
      try {
        if (currentlySaved) await savedApi.unsave(serviceId);
        else await savedApi.save(serviceId);
      } catch (err) {
        // revert on failure
        setSavedIds((prev) => {
          const next = new Set(prev);
          if (currentlySaved) next.add(serviceId);
          else next.delete(serviceId);
          return next;
        });
        throw err;
      }
    },
    [savedIds]
  );

  const isSaved = useCallback((serviceId: string) => savedIds.has(serviceId), [savedIds]);

  const value = useMemo(() => ({ savedIds, isSaved, toggle, refresh }), [savedIds, isSaved, toggle, refresh]);

  return <SavedContext.Provider value={value}>{children}</SavedContext.Provider>;
}

export function useSaved(): SavedContextValue {
  const ctx = useContext(SavedContext);
  if (!ctx) throw new Error("useSaved must be used within a SavedProvider");
  return ctx;
}
