import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

export function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleSession = async () => {
      // This will ensure session is loaded from URL hash and stored
      const { error } = await supabase.auth.getSession();

      if (error) {
        console.error(error);
        // optionally show a toast + send back to login
        navigate("/login");
        return;
      }

      // If session exists, go to dashboard (or wherever)
      navigate("/dashboard");
    };

    handleSession();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-sm text-muted-foreground">
        Finishing sign-in with Google…
      </p>
    </div>
  );
}
