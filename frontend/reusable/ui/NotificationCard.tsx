import { useSetAtom } from "jotai";
import { updateNotificationStatusAtom } from "../../store/notificationAtoms";
import type { NotificationItem } from "../../utils/types/notification";

type NotificationCardProps = {
  notification: NotificationItem;
};
export default function NotificationCard({ notification }:NotificationCardProps) {
  const updateStatus = useSetAtom(updateNotificationStatusAtom);

   const handleAction = async (status: "accepted" | "declined") => {
    updateStatus({ id: notification.id, status });

    // optional backend call
    await fetch(`/api/notifications/${notification.id}/${status}`, {
      method: "POST",
    });
  };

  return (
    <div className="p-3 border-b last:border-0">
      <p className="text-sm text-gray-800">{notification.message}</p>
      <p className="text-xs text-gray-400 mt-1">
        {new Date(notification.createdAt).toLocaleString()}
      </p>

      {notification.status === "pending" ? (
        <div className="mt-3 flex gap-2">
          <button
            onClick={() => handleAction("accepted")}
            className="px-3 py-1 bg-green-600 text-white rounded-md text-xs"
          >
            Accept
          </button>
          <button
            onClick={() => handleAction("declined")}
            className="px-3 py-1 bg-red-500 text-white rounded-md text-xs"
          >
            Decline
          </button>
        </div>
      ) : (
        <p
          className={`mt-3 text-xs font-semibold ${
            notification.status === "accepted"
              ? "text-green-600"
              : "text-red-500"
          }`}
        >
          {notification.status.toUpperCase()}
        </p>
      )}
    </div>
  );
}
