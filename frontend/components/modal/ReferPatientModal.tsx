import * as Dialog from "@radix-ui/react-dialog";
import * as Select from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import { useState } from "react";

type ReferPatientModalProps = {
  userObj : any
};

export default function ReferPatientModal({ userObj }: ReferPatientModalProps) {
  const [selectedDoctor, setSelectedDoctor] = useState<string | undefined>();

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
                  <Select.Item
                    value="1"
                    className="px-3 py-2 rounded flex items-center gap-2 cursor-pointer hover:bg-gray-100"
                  >
                    <Select.ItemText>Dr. Priya Sharma</Select.ItemText>
                    <Select.ItemIndicator>
                      <Check className="w-4 h-4 text-blue-600" />
                    </Select.ItemIndicator>
                  </Select.Item>

                  <Select.Item
                    value="2"
                    className="px-3 py-2 rounded flex items-center gap-2 cursor-pointer hover:bg-gray-100"
                  >
                    <Select.ItemText>Dr. Rahul Menon</Select.ItemText>
                    <Select.ItemIndicator>
                      <Check className="w-4 h-4 text-blue-600" />
                    </Select.ItemIndicator>
                  </Select.Item>

                  <Select.Item
                    value="3"
                    className="px-3 py-2 rounded flex items-center gap-2 cursor-pointer hover:bg-gray-100"
                  >
                    <Select.ItemText>Dr. Anita Kapoor</Select.ItemText>
                    <Select.ItemIndicator>
                      <Check className="w-4 h-4 text-blue-600" />
                    </Select.ItemIndicator>
                  </Select.Item>
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