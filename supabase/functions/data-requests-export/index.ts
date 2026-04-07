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
    const storageBucket = Deno.env.get("EXPORT_BUCKET") ?? "exports";
    const siteUrl = Deno.env.get("SITE_URL") ?? "";

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

    // Fetch user profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user_id)
      .single();
    if (profileError) throw profileError;

    // Fetch bookmarks with tags
    const { data: bookmarks, error: bookmarksError } = await supabase
      .from("bookmarks")
      .select("*, tags(id, name)")
      .eq("user_id", user_id);
    if (bookmarksError) throw bookmarksError;

    // Fetch tags
    const { data: tags, error: tagsError } = await supabase
      .from("tags")
      .select("*")
      .eq("user_id", user_id);
    if (tagsError) throw tagsError;

    const payload = { profile, bookmarks, tags, generated_at: new Date().toISOString() };
    const filePath = `${user_id}/${request_id}.json`;

    const { error: uploadError } = await supabase.storage
      .from(storageBucket)
      .upload(filePath, new TextEncoder().encode(JSON.stringify(payload, null, 2)), {
        contentType: "application/json",
        upsert: true,
      });
    if (uploadError) throw uploadError;

    const { data: signed } = await supabase.storage
      .from(storageBucket)
      .createSignedUrl(filePath, 60 * 60 * 24 * 7); // 7 days

    const resultUrl = signed?.signedUrl ?? null;

    await supabase
      .from("data_requests")
      .update({ status: "completed", result_url: resultUrl, processed_at: new Date().toISOString() })
      .eq("id", request_id);

    // TODO: Send email to user/admin with resultUrl via Resend/SendGrid

    return new Response(JSON.stringify({ result_url: resultUrl, siteUrl }), {
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
