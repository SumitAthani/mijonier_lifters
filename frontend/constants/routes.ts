import {
  LogOut as LogoutIcon,
  LayoutDashboard as LayoutDashboardIcon,
} from "lucide-react";

import Dashboard from "../pages/Dashboard";
import Logout from "../pages/Logout";

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboardIcon,
    component: Dashboard,
    path: "/",
  },
  {
    label: "Logout",
    icon: LogoutIcon,
    component: Logout,
    path: "/logout",
  },
];

export { routes };
