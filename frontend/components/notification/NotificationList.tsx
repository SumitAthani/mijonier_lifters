import { useAtom, useAtomValue } from "jotai";
import { notificationsAtom } from "../../store/notificationAtoms";
import { Check, X } from "lucide-react";
import { updateTicketService } from "../../services/api/tickets/updateTicket";
import ReferPatientModal from "../modal/ReferPatientModal";
import { userAtom } from "../../store/userAtom";

export default function NotificationList({ fetchTickets, setOpen }:{ 
  fetchTickets: () => void, setOpen : () => void }) {
  const [notifications] = useAtom(notificationsAtom);

  const user = useAtomValue(userAtom);
  if (notifications.length === 0) return null;

  const acceptTicket = async(ticketId:string) => {
    const data = await updateTicketService(ticketId, {
      status : "accepted"
    });
    console.log("data:",data)
    fetchTickets();
  }

  // const deleteTicket = async(ticketId:string) => {
  //   fetchTickets();
  // }
  return (
    <div className="absolute right-6 top-20 w-80 bg-white shadow-lg rounded-xl border border-gray-200 p-4 z-50">
      <h3 className="font-semibold text-gray-700 mb-3">Notifications</h3>

      <div className="flex flex-col gap-3">
        {notifications.map((n) => (
          <div
            key={n._id}
            className="p-3 rounded-lg border bg-gray-50 flex flex-col gap-2"
          >
            <p className="text-sm text-gray-700">
              {n.userIds[0]._id === user?._id ? ("Referred Patient: " + n.patient.name + " to " + n.userIds[1].name) : n.title}
            </p>
            {n.userIds[0]._id !== user?._id && (
              
            n.status === "open" ? (
              <div className="flex gap-2">
                <button
                  onClick={() => acceptTicket(n._id)}
                  className="flex-1 flex items-center justify-center gap-1 bg-green-100 text-green-700 py-1 rounded-md cursor-pointer"
                >
                  <Check className="w-4 h-4" /> Accept
                </button>
                {/* <button
                  onClick={() => deleteTicket(n._id)}
                  className="flex-1 flex items-center justify-center gap-1 bg-red-100 text-red-700 py-1 rounded-md cursor-pointer"
                >
                  <X className="w-4 h-4" /> Decline
                </button> */}
                <ReferPatientModal text="Decline" userObj={user} setOpen={setOpen} />
              </div>
            ) : (
              <p
                className={`text-xs font-medium ${
                  n.status === "closed" ? "text-red-600" : "text-green-600"
                }`}
              >
                {n.status.charAt(0).toUpperCase() + n.status.slice(1)}
              </p>
            )
            )}

          </div>
        ))}
      </div>
    </div>
  );
}
