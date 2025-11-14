import * as Dialog from "@radix-ui/react-dialog";
import * as Select from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { getDoctorsByHospitalId } from "../../services/api/users/getDoctorsByHospitalId";
import { useAtomValue } from "jotai";
import { userAtom } from "../../store/userAtom";

type ReferPatientModalProps = {
  userObj : any
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


export default function ReferPatientModal({ userObj }: ReferPatientModalProps) {
  const [selectedDoctor, setSelectedDoctor] = useState<string | undefined>();
  const user = useAtomValue(userAtom);

  const [doctors,setDoctors] = useState([])
  const loadDoctors = async (hospitalId: string) => {
    try {
      if (!hospitalId) return;

      const data = await getDoctorsByHospitalId(hospitalId);
      setDoctors(data.doctors)
      console.log("Doctors:", data);
    } catch (err) {
      console.error("Error fetching doctors:", err);
    }
  };

  useEffect(() => {
    loadDoctors(user?.hospital)
  }, [])

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700 transition">
          Refer
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
            Refer Patient
          </Dialog.Title>

          <Dialog.Description className="mt-1 text-gray-600">
            Refer <b>{userObj.name}</b> to another doctor.
          </Dialog.Description>

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
                  {
                    doctors.map((doctor) => (
                      <Select.Item
                        value={doctor.user._id}
                        className="px-3 py-2 rounded flex items-center gap-2 cursor-pointer hover:bg-gray-100"
                      >
                        <Select.ItemText>{doctor.user.name}</Select.ItemText>
                        <Select.ItemIndicator>
                          <Check className="w-4 h-4 text-blue-600" />
                        </Select.ItemIndicator>
                      </Select.Item>
                    ))
                  }
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>

          {/* ---- BUTTON ---- */}
          <Dialog.Close asChild>
            <button
              className="w-full bg-blue-600 text-white mt-6 py-2 rounded font-medium disabled:opacity-40 cursor-pointer"
              disabled={!selectedDoctor}
            >
              Confirm
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}