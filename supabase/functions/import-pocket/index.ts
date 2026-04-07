import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
}

interface PocketItem {
  item_id?: string
  resolved_title?: string
  resolved_url?: string
  excerpt?: string
  tags?: { [key: string]: { tag: string } } | string
  time_added?: string
  favorite?: string
  // CSV format fields
  url?: string
  title?: string
  description?: string
  tag?: string
  date_added?: string
}

function parseCSV(content: string): PocketItem[] {
  const lines = content.trim().split('\n')
  if (lines.length < 2) return []
  
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
  
  return lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim().replace(/"/g, ''))
    const item: PocketItem = {}
    
    headers.forEach((header, index) => {
      const value = values[index] || ''
      const key = header.toLowerCase().replace(/\s+/g, '_')
      
      // Map common CSV headers to our format
      if (key === 'url' || key === 'resolved_url') item.resolved_url = value
      else if (key === 'title' || key === 'resolved_title') item.resolved_title = value
      else if (key === 'description' || key === 'excerpt') item.excerpt = value
      else if (key === 'tags' || key === 'tag') item.tags = value
      else if (key === 'date_added' || key === 'time_added') item.time_added = value
      else if (key === 'favorite') item.favorite = value
      else (item as any)[key] = value
    })
    
    return item
  }).filter(item => item.resolved_url) // Only items with URLs
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase configuration')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get user from JWT
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing Authorization header' }),
        { status: 401, headers: corsHeaders }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token or user not found' }),
        { status: 401, headers: corsHeaders }
      )
    }

    // Parse form data
    let formData: FormData
    try {
      formData = await req.formData()
    } catch (error) {
      return new Response(
        JSON.stringify({ error: 'Failed to parse form data' }),
        { status: 400, headers: corsHeaders }
      )
    }

    const file = formData.get('file') as File
    if (!file) {
      return new Response(
        JSON.stringify({ error: 'No file provided' }),
        { status: 400, headers: corsHeaders }
      )
    }

    // Read file content
    let content: string
    try {
      content = await file.text()
    } catch (error) {
      return new Response(
        JSON.stringify({ error: 'Failed to read file content' }),
        { status: 400, headers: corsHeaders }
      )
    }

    let items: PocketItem[] = []

    // Parse different formats
    try {
      if (file.name.endsWith('.json')) {
        const pocketData: { list: { [key: string]: PocketItem } } = JSON.parse(content)
        items = Object.values(pocketData.list || {})
      } else if (file.name.endsWith('.csv')) {
        items = parseCSV(content)
      } else {
        return new Response(
          JSON.stringify({ error: 'Only JSON and CSV formats supported' }),
          { status: 400, headers: corsHeaders }
        )
      }
    } catch (error) {
      return new Response(
        JSON.stringify({ error: 'Failed to parse file content' }),
        { status: 400, headers: corsHeaders }
      )
    }

    const results = { imported: 0, failed: 0, errors: [] as string[] }

    // Process items
    for (const item of items) {
      try {
        if (!item.resolved_url) {
          results.failed++
          results.errors.push('Missing URL')
          continue
        }

        // Parse date
        let createdAt = new Date().toISOString()
        if (item.time_added) {
          const timestamp = parseInt(item.time_added)
          if (!isNaN(timestamp)) {
            createdAt = new Date(timestamp * 1000).toISOString()
          } else {
            const date = new Date(item.time_added)
            if (!isNaN(date.getTime())) {
              createdAt = date.toISOString()
            }
          }
        }

        // Insert bookmark
        const { data: bookmark, error: bookmarkError } = await supabase
          .from('bookmarks')
          .insert({
            title: item.resolved_title || 'Untitled',
            url: item.resolved_url,
            description: item.excerpt || null,
            favicon_url: null,
            is_pinned: item.favorite === '1' || item.favorite === 'true',
            user_id: user.id,
            created_at: createdAt
          })
          .select()
          .single()

        if (bookmarkError) throw bookmarkError

        // Handle tags
        let tagNames: string[] = []
        if (item.tags) {
          if (typeof item.tags === 'string') {
            tagNames = item.tags.split(',').map(t => t.trim()).filter(Boolean)
          } else {
            tagNames = Object.values(item.tags).map(t => t.tag)
          }
        }
        
        if (tagNames.length > 0) {
          const { data: tags } = await supabase
            .from('tags')
            .upsert(
              tagNames.map(name => ({ name, user_id: user.id })),
              { onConflict: 'name,user_id' }
            )
            .select()

          if (tags) {
            await supabase
              .from('bookmark_tags')
              .insert(
                tags.map(tag => ({
                  bookmark_id: bookmark.id,
                  tag_id: tag.id
                }))
              )
          }
        }

        results.imported++
      } catch (error) {
        results.failed++
        results.errors.push(`Failed to import "${item.resolved_title || item.resolved_url}": ${error.message}`)
      }
    }

    return new Response(
      JSON.stringify(results),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Import function error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        details: error.toString()
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }, 
        status: 500 
      }
    )
  }
})
