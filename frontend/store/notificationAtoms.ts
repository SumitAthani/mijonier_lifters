import { atom } from "jotai";
import type { NotificationItem } from "../utils/types/notification";

export const notificationsAtom = atom<NotificationItem[]>([]);

export const addNotificationAtom = atom(
  null,
  (get, set, newNotification: NotificationItem) => {
    const current = get(notificationsAtom);
    set(notificationsAtom, [newNotification, ...current]);
  }
);

export const updateNotificationStatusAtom = atom(
  null,
  (get, set, { id, status }: { id: string; status: "accepted" | "declined" }) => {
    const updated = get(notificationsAtom).map((n) =>
      n.id === id ? { ...n, status } : n
    );
    set(notificationsAtom, updated);
  }
);
