import { Bell } from "lucide-react";
import { useAtom } from "jotai";
import { notificationsAtom } from "../../store/notificationAtoms";
import { useState } from "react";
import NotificationList from "./NotificationList";

export default function NotificationBell() {
  const [notifications] = useAtom(notificationsAtom);
  const [open, setOpen] = useState(false);

  const unread = notifications.filter(n => n.status === "pending").length;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-full hover:bg-gray-200"
      >
        <Bell className="w-6 h-6 text-gray-700" />

        {unread > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white w-4 h-4 text-xs flex items-center justify-center rounded-full">
            {unread}
          </span>
        )}
      </button>

      {open && <NotificationList />}
    </div>
  );
}
