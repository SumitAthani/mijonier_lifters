import * as Dialog from "@radix-ui/react-dialog";
import * as Select from "@radix-ui/react-select";
import { Check, ChevronDown, X } from "lucide-react";
import { useEffect, useState } from "react";
import { getDoctorsByHospitalId } from "../../services/api/users/getDoctorsByHospitalId";
import { useAtomValue } from "jotai";
import { userAtom } from "../../store/userAtom";
import { createTicket } from "../../services/api/tickets/createTicket";
import { updateTicketData } from "../../services/api/tickets/updateTicketData";

type ReferPatientModalProps = {
  userObj: any;
  text?:string;
  setOpen?: any;
};

// {
//   "success": true,
//   "count": 2,
//   "doctors": [
//     {
//       "_id": "6916fea9e47325ff8206e5fa",
//       "user": {
//         "_id": "6916ef8de47325ff8206e5ef",
//         "name": "Dr. Nikhil Mehta",
//         "email": "nikhil@gmail.com",
//         "role": "doctor"
//       },
//       "specialization": "Cardiologist",
//       "experience": 5,
//       "qualification": "MBBS, MD",
//       "hospital": {
//         "_id": "6916fd8fe47325ff8206e5f6",
//         "name": "City Hospital"
//       }
//     },
//     {
//       "_id": "6916ffafe47325ff8206e60f",
//       "user": {
//         "_id": "6916f008e47325ff8206e5f0",
//         "name": "Dr. sumit Shah",
//         "email": "sumit@gmail.com",
//         "role": "doctor"
//       },
//       "specialization": "Cardiologist",
//       "experience": 10,
//       "qualification": "MBBS, MD",
//       "hospital": {
//         "_id": "6916fd8fe47325ff8206e5f6",
//         "name": "City Hospital"
//       }
//     }
//   ]
// }


export default function ReferPatientModal({ userObj, text = "Refer", setOpen }: ReferPatientModalProps) {
  const [selectedDoctor, setSelectedDoctor] = useState<string | undefined>();
  const user = useAtomValue(userAtom);
  const [message, setMessage] = useState("")

  const [doctors, setDoctors] = useState([])
  const loadDoctors = async (hospitalId: string) => {
    try {
      if (!hospitalId) return;

      const data = await getDoctorsByHospitalId(hospitalId,user?._id);
      setDoctors(data.doctors)
      console.log("Doctors:", data);
    } catch (err) {
      console.error("Error fetching doctors:", err);
    }
  };
  const startTicket = async () => {
    try {
      const ticket = await createTicket({
        title: "Patient Refferred by " + user?.name,
        patient: userObj._id,
        userIds: [
          user?._id,
          selectedDoctor
        ],
        messages: [
          {
            text: message,
            sentBy: user?._id
          }
        ],
      });
      console.log("Created:", ticket);
    } catch (err) {
      console.error(err);
    }
  };
  console.log("selectedDoctor:", selectedDoctor)

  const declineTicket = async () => {
    try {
      const updated = await updateTicketData(userObj._id, {
        status: "declined",
        messages: [
          {
            text: message,
            sentBy: user?._id
          }
        ],
        sentBy: user?._id
      })
      setOpen(false);
      console.log("updated",updated)
    } catch (error) {
      console.error("error:",error)
    }

  }
  useEffect(() => {
    loadDoctors(user?.hospital)
  }, [])

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="px-4 py-2 bg-[#5b0f00] text-white rounded cursor-pointer hover:bg-[#981b02] transition flex items-center gap-2">
          {text === "Decline" && <X className="w-4 h-4" />} {text}
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        {/* ---- OVERLAY ---- */}
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm" />

        {/* ---- CONTENT ---- */}
        <Dialog.Content
          className="fixed bg-white rounded-xl p-6 shadow-xl w-[90%] max-w-md
                 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <Dialog.Title className="text-xl font-semibold">
            {text === "Decline" ? "Decline" : "Refer"} Patient
          </Dialog.Title>

          {text === "Decline" && (
            <Dialog.Description className="mt-1 text-gray-600">
              Refer <b>{userObj.name}</b> to another doctor.
            </Dialog.Description>
          )}

          {/* ---- MESSAGE INPUT ---- */}
          <div className="mt-4">
            <label className="text-sm font-medium">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a note or message…"
              className="w-full mt-1 border rounded px-3 py-2 h-24 resize-none outline-none focus:border-blue-500"
              required
            />
          </div>

          {/* ----- RADIX SELECT ----- */}
          <Select.Root value={selectedDoctor} onValueChange={setSelectedDoctor}>
            <Select.Trigger
              className="border px-4 py-2 w-full mt-4 rounded flex items-center justify-between"
            >
              <Select.Value placeholder="Select doctor" />
              <ChevronDown className="w-4 h-4 opacity-70" />
            </Select.Trigger>

            <Select.Portal>
              <Select.Content className="bg-white border rounded shadow-md z-[9999]">
                <Select.Viewport className="p-1">
                  {doctors.map((doctor) => (
                    <Select.Item
                      key={doctor.user._id}
                      value={doctor.user._id}
                      className="px-3 py-2 rounded flex items-center gap-2 cursor-pointer hover:bg-gray-100"
                    >
                      <Select.ItemText>{doctor.user.name}</Select.ItemText>
                      <Select.ItemIndicator>
                        <Check className="w-4 h-4 text-blue-600" />
                      </Select.ItemIndicator>
                    </Select.Item>
                  ))}
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>

          {/* ---- BUTTON ---- */}
          <Dialog.Close asChild>
            <button
              className="w-full bg-[#5b0f00] text-white mt-6 py-2 rounded font-medium disabled:opacity-40 cursor-pointer"
              disabled={!selectedDoctor}
              onClick={() => {
                text === "Decline" ? declineTicket() : startTicket()
              }}
            >
              Confirm
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}