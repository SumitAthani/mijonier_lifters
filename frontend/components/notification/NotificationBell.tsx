import { Bell } from "lucide-react";
import { useAtom, useAtomValue } from "jotai";
import { notificationsAtom } from "../../store/notificationAtoms";
import { useEffect, useState } from "react";
import NotificationList from "./NotificationList";
import { getTicketsByDoctor } from "../../services/api/tickets/getTicketsByDoctor";
import { userAtom } from "../../store/userAtom";

export default function NotificationBell() {
  const [notifications, setNotifications] = useAtom(notificationsAtom);
  const [open, setOpen] = useState(false);

  const user = useAtomValue(userAtom);

  const unread = notifications.filter(n => n.status === "open").length;

  const fetchTickets = async () => {
    const data = await getTicketsByDoctor(user?._id);
    console.log("data",data);
    setNotifications(data);
  };

  useEffect(() => {
    fetchTickets();
  }, [])
  
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-full hover:bg-gray-200"
      >
        <Bell className="w-6 h-6 text-gray-700" />

        {unread > 0 && (
          <span className="absolute -top-1 -right-1 bg-[#5b0f00] text-white w-4 h-4 text-xs flex items-center justify-center rounded-full">
            {unread}
          </span>
        )}
      </button>

      {open && <NotificationList fetchTickets={fetchTickets} />}
    </div>
  );
}
