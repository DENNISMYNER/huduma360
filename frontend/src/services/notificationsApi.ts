import { request } from "./httpClient";
import type { Notification } from "../types/notification";

export const notificationsApi = {
  list: () => request<{ items: Notification[]; unreadCount: number }>("/notifications"),
  markRead: (id: string) => request<{ notification: Notification }>(`/notifications/${id}/read`, { method: "PATCH" }),
  markAllRead: () => request<{ updated: boolean }>("/notifications/read-all", { method: "PATCH" }),
};
