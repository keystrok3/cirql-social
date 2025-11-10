import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

const ProtectedRoute = () => {
  
  const { isAuthenticated } = useAuth();
  return isAuthenticated === "true" ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
