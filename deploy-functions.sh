#!/bin/bash

# Deploy Supabase Edge Function
echo "Deploying send-reminders function..."
supabase functions deploy send-reminders

# Set environment variables
echo "Setting environment variables..."
supabase secrets set RESEND_API_KEY=your_resend_api_key
supabase secrets set SITE_URL=https://your-domain.com

echo "Deployment complete!"
echo "Don't forget to:"
echo "1. Update cron.sql with your actual project URL and anon key"
echo "2. Run the cron.sql in your Supabase SQL editor"
echo "3. Configure your domain in Resend dashboard"
