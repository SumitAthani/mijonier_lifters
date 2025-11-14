import { useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { routes } from "../constants/routes";
import Sidebar from "../ui/Sidebar";
import NotFound from "../pages/NotFound";
import Login from "../pages/Login";

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/login')
  }, []);

  // Routes where sidebar should be hidden
  const hideSidebar = location.pathname === "/login";

  return (
    <div className="min-h-screen flex">
      {/* Sidebar (only when not on /login) */}
      {!hideSidebar && <Sidebar />}

      {/* Main Content */}
      <div className="flex-1 bg-gray-50 p-6">
        <Routes>
          {routes.map(({ path, component: Component }) => (
            <Route key={path} path={path} element={<Component />} />
          ))}

          <Route path="/login" element={<Login />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
