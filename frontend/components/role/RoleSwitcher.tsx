import { useAtom } from "jotai";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { userRoleAtom } from "../../store/userAtom";

export default function RoleSwitcher() {
  const [role, setRole] = useAtom(userRoleAtom);
  const [open, setOpen] = useState(false);

  const roles: Array<"admin" | "doctor" | "patient"> = [
    "admin",
    "doctor",
    "patient",
  ];

  const handleRoleChange = (newRole: "admin" | "doctor" | "patient") => {
    setRole(newRole);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="px-4 py-2 bg-white rounded-full shadow text-sm font-medium flex items-center gap-2 hover:bg-gray-100"
      >
        {role.toUpperCase()}
        <ChevronDown className="w-4 h-4" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-xl border border-gray-200 overflow-hidden z-50">
          {roles.map((r) => (
            <button
              key={r}
              onClick={() => handleRoleChange(r)}
              className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${
                r === role ? "bg-gray-50 font-medium" : ""
              }`}
            >
              {r.toUpperCase()}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
