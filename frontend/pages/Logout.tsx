import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate logout delay
    const timeout = setTimeout(() => {
      localStorage.removeItem("token"); // clear any auth token
      navigate("/login");
    }, 750);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      {/* Spinner */}
      <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>

      {/* Text */}
      <p className="mt-4 text-gray-600 text-lg font-medium">
        Logging you out...
      </p>
    </div>
  );
}
