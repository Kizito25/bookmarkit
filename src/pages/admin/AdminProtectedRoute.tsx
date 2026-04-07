import { Navigate } from "react-router-dom";
import { useAdminAuth } from "@/contexts/admin-auth-provider";
import { LoadingScreen } from "@/components/LoadingScreen";

export function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  const { adminUser, loading } = useAdminAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!adminUser) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}
