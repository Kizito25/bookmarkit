#!/bin/bash

echo "Deploying Edge Functions for import debugging..."

echo "1. Deploying test function..."
supabase functions deploy test-import

echo "2. Deploying import function..."
supabase functions deploy import-pocket

echo ""
echo "Functions deployed! Now test:"
echo "1. Click 'Test Connection' button first"
echo "2. If test passes, try importing your CSV file"
echo "3. Check browser console for detailed error messages"
echo ""
echo "If you get 403 errors, check:"
echo "- Supabase project is running"
echo "- Edge Functions are enabled in your project"
echo "- Your VITE_SUPABASE_URL is correct"
