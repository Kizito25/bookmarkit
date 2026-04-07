import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get bookmarks with reminders due
    const now = new Date().toISOString()
    const { data: bookmarks, error } = await supabase
      .from('bookmarks')
      .select(`
        id, title, url, reminder_date, user_id,
        profiles!inner(username)
      `)
      .eq('reminder_enabled', true)
      .eq('reminder_sent', false)
      .lte('reminder_date', now)

    if (error) throw error

    const results = []
    
    for (const bookmark of bookmarks || []) {
      // Get user email
      const { data: user } = await supabase.auth.admin.getUserById(bookmark.user_id)
      
      if (user?.user?.email) {
        // Send email using Resend API
        const emailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Bookmarkly <reminders@bookmarkly.app>',
            to: [user.user.email],
            subject: `Reminder: ${bookmark.title}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>📚 Bookmark Reminder</h2>
                <p>Hi ${bookmark.profiles.username || 'there'},</p>
                <p>You asked to be reminded about this bookmark:</p>
                <div style="background: #f5f5f5; padding: 16px; border-radius: 8px; margin: 16px 0;">
                  <h3 style="margin: 0 0 8px 0;">${bookmark.title}</h3>
                  <a href="${bookmark.url}" style="color: #0066cc; text-decoration: none;">${bookmark.url}</a>
                </div>
                <p><a href="${bookmark.url}" style="background: #000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Visit Bookmark</a></p>
                <p style="color: #666; font-size: 14px;">
                  Manage your bookmarks at <a href="${Deno.env.get('SITE_URL') || 'https://bookmarkly.app'}">Bookmarkly</a>
                </p>
              </div>
            `
          })
        })

        if (emailResponse.ok) {
          // Mark reminder as sent
          await supabase
            .from('bookmarks')
            .update({ reminder_sent: true })
            .eq('id', bookmark.id)
          
          results.push({ id: bookmark.id, status: 'sent' })
        } else {
          results.push({ id: bookmark.id, status: 'failed' })
        }
      }
    }

    return new Response(
      JSON.stringify({ processed: results.length, results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
