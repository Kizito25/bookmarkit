-- Add reminder fields to bookmarks table
ALTER TABLE bookmarks 
ADD COLUMN reminder_enabled BOOLEAN DEFAULT FALSE,
ADD COLUMN reminder_date TIMESTAMPTZ NULL,
ADD COLUMN reminder_sent BOOLEAN DEFAULT FALSE;
