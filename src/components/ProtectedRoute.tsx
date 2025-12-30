import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Clear all sessions immediately
    sessionStorage.removeItem("adminToken");
    sessionStorage.removeItem("adminTokenExpiry");
    setIsAuthenticated(false);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  // Always redirect to login - admin panel is disabled
  return <Navigate to="/admin/login" replace />;
}
