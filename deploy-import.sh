#!/bin/bash

echo "Deploying import-pocket function..."
supabase functions deploy import-pocket

echo "Import function deployed successfully!"
echo ""
echo "To use the import feature:"
echo "1. Export your Pocket data as JSON or CSV"
echo "2. Click 'Import from Pocket' in the app header"
echo "3. Upload your JSON/CSV file"
echo ""
echo "Supported formats:"
echo "- Pocket JSON export"
echo "- Pocket CSV export (recommended)"
echo "- Preserves titles, URLs, descriptions, tags, and favorites"
echo ""
echo "CSV columns supported:"
echo "- url, title, description, tags, date_added, favorite"
echo "- Tags should be comma-separated in a single column"
