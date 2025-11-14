import { useAtom } from "jotai";
import { notificationsAtom, updateNotificationStatusAtom } from "../../store/notificationAtoms";
import { Check, X } from "lucide-react";

export default function NotificationList() {
  const [notifications] = useAtom(notificationsAtom);
  const updateStatus = useAtom(updateNotificationStatusAtom)[1];

  if (notifications.length === 0) return null;

  return (
    <div className="absolute right-6 top-20 w-80 bg-white shadow-lg rounded-xl border border-gray-200 p-4 z-50">
      <h3 className="font-semibold text-gray-700 mb-3">Notifications</h3>

      <div className="flex flex-col gap-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            className="p-3 rounded-lg border bg-gray-50 flex flex-col gap-2"
          >
            <p className="text-sm text-gray-700">{n.message}</p>

            {n.status === "pending" ? (
              <div className="flex gap-2">
                <button
                  onClick={() => updateStatus({ id: n.id, status: "accepted" })}
                  className="flex-1 flex items-center justify-center gap-1 bg-green-100 text-green-700 py-1 rounded-md cursor-pointer"
                >
                  <Check className="w-4 h-4" /> Accept
                </button>
                <button
                  onClick={() => updateStatus({ id: n.id, status: "declined" })}
                  className="flex-1 flex items-center justify-center gap-1 bg-red-100 text-red-700 py-1 rounded-md cursor-pointer"
                >
                  <X className="w-4 h-4" /> Decline
                </button>
              </div>
            ) : (
              <p
                className={`text-xs font-medium ${
                  n.status === "accepted" ? "text-green-600" : "text-red-600"
                }`}
              >
                {n.status === "accepted" ? "Accepted" : "Declined"}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
