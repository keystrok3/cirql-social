import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { useEffect, useState } from "react";

const ProtectedRoute = () => {
  const { verifyAuth } = useAuth();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      setIsChecking(true);
      const verified = await verifyAuth();
      setIsAuthenticated(verified);
      setIsChecking(false);
    };

    checkAuth();
  }, [verifyAuth]);

  if (isChecking) {
    return <div>Checking Authentication...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
