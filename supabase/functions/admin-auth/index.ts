import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import bcrypt from "https://esm.sh/bcryptjs@2.4.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type AdminRole = "super_admin" | "admin";

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function randomToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

function sessionTtlMs(): number {
  const raw = Deno.env.get("ADMIN_SESSION_TTL_HOURS");
  const hours = raw ? Number.parseFloat(raw) : 24;
  if (!Number.isFinite(hours) || hours <= 0 || hours > 168) return 24 * 60 * 60 * 1000;
  return hours * 60 * 60 * 1000;
}

function safeCompare(password: string, hash: string): boolean {
  try {
    return bcrypt.compareSync(password, hash);
  } catch {
    return false;
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  if (!supabaseUrl || !serviceKey) {
    return json({ error: "Server misconfigured" }, 500);
  }

  let body: { action?: string; email?: string; password?: string; token?: string };
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const action = body.action;

  if (action === "verify") {
    const token = typeof body.token === "string" ? body.token.trim() : "";
    if (!token) {
      return json({ error: "Unauthorized" }, 401);
    }

    const { data: session, error } = await supabase
      .from("admin_sessions")
      .select("id, expires_at, admin_id")
      .eq("token", token)
      .maybeSingle();

    if (error || !session) {
      return json({ error: "Unauthorized" }, 401);
    }

    if (new Date(session.expires_at) <= new Date()) {
      await supabase.from("admin_sessions").delete().eq("id", session.id);
      return json({ error: "Unauthorized" }, 401);
    }

    const { data: admin, error: adminError } = await supabase
      .from("admin_users")
      .select("id, email, role")
      .eq("id", session.admin_id)
      .maybeSingle();

    if (adminError || !admin) {
      return json({ error: "Unauthorized" }, 401);
    }

    const role = admin.role as AdminRole;
    if (role !== "super_admin" && role !== "admin") {
      return json({ error: "Unauthorized" }, 401);
    }

    return json({
      user: { id: admin.id, email: admin.email, role },
      expiresAt: session.expires_at,
    });
  }

  if (action === "logout") {
    const token = typeof body.token === "string" ? body.token.trim() : "";
    if (token) {
      await supabase.from("admin_sessions").delete().eq("token", token);
    }
    return json({ ok: true });
  }

  if (action === "login") {
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!email || !password) {
      return json({ error: "Invalid email or password" }, 401);
    }

    const { data: admin, error } = await supabase
      .from("admin_users")
      .select("id, email, role, password_hash")
      .eq("email", email)
      .maybeSingle();

    const fail = () => json({ error: "Invalid email or password" }, 401);

    if (error || !admin?.password_hash) {
      // Constant-ish work when user missing (mitigate timing leaks slightly)
      safeCompare(password, "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi");
      return fail();
    }

    const ok = safeCompare(password, admin.password_hash as string);
    if (!ok) {
      return fail();
    }

    const role = admin.role as AdminRole;
    if (role !== "super_admin" && role !== "admin") {
      return fail();
    }

    const token = randomToken();
    const expiresAt = new Date(Date.now() + sessionTtlMs()).toISOString();

    const { error: insErr } = await supabase.from("admin_sessions").insert({
      admin_id: admin.id,
      token,
      expires_at: expiresAt,
    });

    if (insErr) {
      console.error(insErr);
      return json({ error: "Could not create session" }, 500);
    }

    await supabase.from("admin_users").update({ last_login_at: new Date().toISOString() }).eq(
      "id",
      admin.id,
    );

    return json({
      token,
      user: { id: admin.id, email: admin.email, role },
      expiresAt,
    });
  }

  return json({ error: "Unknown action" }, 400);
});
