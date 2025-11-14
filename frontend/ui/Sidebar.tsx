import { NavLink } from "react-router-dom";
import { routes } from "../constants/routes";

export default function Sidebar() {
  return (
    <div className="h-screen w-64 bg-white border-r border-gray-200 py-6 px-4 flex flex-col shadow-sm">
      <h1 className="text-xl font-semibold mb-8 px-2">Hospital Admin</h1>

      <nav className="flex flex-col gap-2">
        {routes.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition
              ${
                isActive
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
