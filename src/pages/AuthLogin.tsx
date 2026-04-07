import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookMarked } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

export function AuthLoginPage() {
  const navigate = useNavigate();
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleAuth = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Signed in successfully!");
      navigate("/dashboard");
    }

    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    try {
      setLoadingGoogle(true);

      const redirectTo = `${window.location.origin}/auth/callback`;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo },
      });

      if (error) {
        // show toast using Sonner
        toast.error(error.message);
        console.error(error);
      }

      // Supabase will redirect, so nothing else here
    } finally {
      setLoadingGoogle(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-muted/40">
      <Card className="w-full max-w-sm">
        <form onSubmit={handleAuth}>
          <CardHeader className="text-center text-primary">
            <Link to="/" style={{ textDecoration: "none" }}>
              <div className="flex justify-center">
                <BookMarked className="h-8 w-8" />
              </div>
              <CardTitle className="text-2xl">{"Sign In"}</CardTitle>
            </Link>
            <CardDescription>
              Enter your credentials to {"access your account"}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? "Processing..." : "Sign In"}
            </Button>

            <Button
              variant="link"
              type="button"
              onClick={() => navigate("/auth/signup")}
            >
              Don't have an account? Sign Up
            </Button>
            <Button
              onClick={() => {
                handleGoogleLogin();
              }}
              type="button"
              variant="outline"
              className="mx-auto gap-2 flex items-center justify-center border border-primary/10 text-primary"
              disabled={loadingGoogle}
            >
              <FcGoogle className="h-6 w-6" />
              {loadingGoogle ? "Processing..." : "Sign In"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
