import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/auth-provider";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!session && !user) {
      navigate("/login", { replace: true });
    }
  }, [user, session, navigate]);

  if (!session && !user) {
    // Render nothing or a loading spinner while redirecting
    return null;
  }

  return <>{children}</>;
}
