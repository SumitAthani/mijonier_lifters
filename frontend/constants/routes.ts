import { 
    Home as HomeIcon,
    LayoutDashboard as LayoutDashboardIcon
} from "lucide-react";
import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";

const routes = [
  { label: "Home", icon: HomeIcon, component: Home, path: "/" },
  { label: "Dashboard", icon: LayoutDashboardIcon, component: Dashboard, path: "/dashboard" },
];

export { routes };