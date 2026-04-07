import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { user_id, request_id } = await req.json();
    if (!user_id || !request_id) {
      return new Response(JSON.stringify({ error: "Missing user_id or request_id" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Delete user-owned storage (adjust bucket names as needed)
    const storageBuckets = (Deno.env.get("DELETE_BUCKETS") || "avatars,favicons,exports")
      .split(",")
      .map((b) => b.trim())
      .filter(Boolean);

    for (const bucket of storageBuckets) {
      const { data: files } = await supabase.storage.from(bucket).list(user_id, { limit: 1000 });
      if (files && files.length > 0) {
        const paths = files.map((f) => `${user_id}/${f.name}`);
        await supabase.storage.from(bucket).remove(paths);
      }
    }

    // Delete relational data
    await supabase.from("bookmark_tags").delete().eq("bookmark_id", user_id); // safety; bookmarks cascade handles most
    await supabase.from("bookmarks").delete().eq("user_id", user_id);
    await supabase.from("tags").delete().eq("user_id", user_id);
    await supabase.from("profiles").delete().eq("id", user_id);

    // Delete auth user
    await supabase.auth.admin.deleteUser(user_id);

    await supabase
      .from("data_requests")
      .update({ status: "completed", processed_at: new Date().toISOString(), notes: "Deleted via function" })
      .eq("id", request_id);

    // TODO: Send confirmation email to user/admin.

    return new Response(JSON.stringify({ status: "deleted" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
