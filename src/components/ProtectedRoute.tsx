import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = sessionStorage.getItem("adminToken");
      const expiry = sessionStorage.getItem("adminTokenExpiry");

      // Check if token exists and hasn't expired
      if (!token || !expiry || Date.now() > parseInt(expiry)) {
        sessionStorage.removeItem("adminToken");
        sessionStorage.removeItem("adminTokenExpiry");
        setIsAuthenticated(false);
      } else {
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}
