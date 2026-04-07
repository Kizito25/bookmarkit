import { useState } from "react";
import { Upload, FileText, CheckCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Progress } from "./ui/progress";
import { useAuth } from "@/contexts/auth-provider";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface ImportResult {
  imported: number;
  failed: number;
  errors: string[];
}

interface ImportProgress {
  current: number;
  total: number;
  percentage: number;
}

interface PocketCSVItem {
  title: string;
  url: string;
  time_added: string;
  tags: string;
  status: string;
}

function parseCSV(content: string): PocketCSVItem[] {
  const lines = content.trim().split("\n");
  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""));

  return lines
    .slice(1)
    .map((line) => {
      // Handle CSV with quoted values that may contain commas
      const values: string[] = [];
      let current = "";
      let inQuotes = false;

      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === "," && !inQuotes) {
          values.push(current.trim().replace(/"/g, ""));
          current = "";
        } else {
          current += char;
        }
      }
      values.push(current.trim().replace(/"/g, ""));

      const item: any = {};
      headers.forEach((header, index) => {
        const key = header.toLowerCase().replace(/\s+/g, "_");
        item[key] = values[index] || "";
      });

      return {
        title: item.title || "Untitled",
        url: item.url,
        time_added: item.time_added,
        tags: item.tags || "",
        status: item.status || "unread",
      };
    })
    .filter((item) => item.url);
}

export function ImportDialog() {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState<ImportProgress>({
    current: 0,
    total: 0,
    percentage: 0,
  });
  const [result, setResult] = useState<ImportResult | null>(null);
  const { user } = useAuth();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);
      setProgress({ current: 0, total: 0, percentage: 0 });
    }
  };

  const handleImport = async () => {
    if (!file || !user) return;

    setImporting(true);
    const results: ImportResult = { imported: 0, failed: 0, errors: [] };

    try {
      const content = await file.text();
      let items: PocketCSVItem[] = [];

      if (file.name.endsWith(".csv")) {
        items = parseCSV(content);
      } else if (file.name.endsWith(".json")) {
        const jsonData = JSON.parse(content);
        // Handle Pocket JSON format
        const pocketItems = Object.values(jsonData.list || {}) as any[];
        items = pocketItems.map((item) => ({
          title: item.resolved_title || item.given_title || "Untitled",
          url: item.resolved_url || item.given_url,
          time_added: item.time_added,
          tags: item.tags
            ? Object.values(item.tags)
                .map((t: any) => t.tag)
                .join(",")
            : "",
          status: item.status === "1" ? "read" : "unread",
        }));
      } else {
        throw new Error("Only CSV and JSON files are supported");
      }

      // Initialize progress
      setProgress({ current: 0, total: items.length, percentage: 0 });

      // Process items with progress tracking
      for (let i = 0; i < items.length; i++) {
        const item = items[i];

        try {
          if (!item.url) {
            results.failed++;
            results.errors.push("Missing URL");
            continue;
          }

          // Parse date
          let createdAt = new Date().toISOString();
          if (item.time_added) {
            const timestamp = parseInt(item.time_added);
            if (!isNaN(timestamp)) {
              createdAt = new Date(timestamp * 1000).toISOString();
            }
          }

          // Parse tags
          const tagNames = item.tags
            ? item.tags
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean)
            : [];

          // Insert bookmark directly using Supabase client
          const { data: bookmark, error: bookmarkError } = await supabase
            .from("bookmarks")
            .insert({
              title: item.title,
              url: item.url,
              description: null,
              favicon_url: null,
              is_pinned: false,
              user_id: user.id,
              created_at: createdAt,
            })
            .select()
            .single();

          if (bookmarkError) throw bookmarkError;

          // Handle tags if any
          if (tagNames.length > 0) {
            // Upsert tags
            const { data: tags } = await supabase
              .from("tags")
              .upsert(
                tagNames.map((name) => ({ name, user_id: user.id })),
                { onConflict: "name,user_id" }
              )
              .select();

            // Link bookmark to tags
            if (tags) {
              await supabase.from("bookmark_tags").insert(
                tags.map((tag) => ({
                  bookmark_id: bookmark.id,
                  tag_id: tag.id,
                }))
              );
            }
          }

          results.imported++;
        } catch (error) {
          results.failed++;
          const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
          results.errors.push(
            `Failed to import "${item.title}": ${errorMessage}`
          );
        }

        // Update progress
        const current = i + 1;
        const percentage = Math.round((current / items.length) * 100);
        setProgress({ current, total: items.length, percentage });
      }

      setResult(results);
      toast.success(`Imported ${results.imported} bookmarks successfully!`);

      // Refresh bookmarks list
      window.location.reload();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast.error(`Import failed: ${errorMessage}`);
    } finally {
      setImporting(false);
    }
  };

  const resetDialog = () => {
    setFile(null);
    setResult(null);
    setProgress({ current: 0, total: 0, percentage: 0 });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {/* <Button variant="outline" size="sm" className="hidden md:flex">
          <Upload className="h-4 w-4 mr-2" />
          Import from Pocket
        </Button> */}

        <Button
          variant="outline"
          className="md:rounded-md rounded-full md:px-4 px-3 flex items-center justify-center"
        >
          <Upload className="h-4 w-4 md:mr-2" />
          <span className="hidden md:inline">Import from Pocket</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Import Pocket Data</DialogTitle>
          <DialogDescription>
            Upload your Pocket export file (CSV or JSON format) to import your
            bookmarks.
          </DialogDescription>
        </DialogHeader>

        {!result ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor="pocket-file">Pocket Export File</Label>
              <Input
                id="pocket-file"
                type="file"
                accept=".json,.csv"
                onChange={handleFileChange}
                className="mt-1"
                disabled={importing}
              />
              <p className="text-xs text-muted-foreground mt-1">
                CSV format: title, url, time_added, tags, status
              </p>
            </div>

            {file && (
              <div className="flex items-center gap-2 p-2 bg-muted rounded">
                <FileText className="h-4 w-4" />
                <span className="text-sm">{file.name}</span>
              </div>
            )}

            {importing && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Importing bookmarks...</span>
                  <span>
                    {progress.current} / {progress.total}
                  </span>
                </div>
                <Progress value={progress.percentage} className="w-full" />
                <p className="text-xs text-muted-foreground text-center">
                  {progress.percentage}% complete
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="font-medium">Import Complete</span>
            </div>

            <div className="space-y-2">
              <p className="text-sm">
                ✅ Successfully imported: <strong>{result.imported}</strong>{" "}
                bookmarks
              </p>
              {result.failed > 0 && (
                <p className="text-sm text-orange-600">
                  ⚠️ Failed to import: <strong>{result.failed}</strong> items
                </p>
              )}
            </div>

            {result.errors.length > 0 && (
              <div className="max-h-32 overflow-y-auto">
                <p className="text-xs text-muted-foreground mb-1">Errors:</p>
                {result.errors.slice(0, 3).map((error, i) => (
                  <p key={i} className="text-xs text-red-600">
                    {error}
                  </p>
                ))}
                {result.errors.length > 3 && (
                  <p className="text-xs text-muted-foreground">
                    ... and {result.errors.length - 3} more
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          {!result ? (
            <div className="flex w-full items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={importing}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleImport}
                disabled={!file || importing}
                className="flex-1"
              >
                {importing
                  ? `Importing... (${progress.percentage}%)`
                  : "Import Bookmarks"}
              </Button>
            </div>
          ) : (
            <Button onClick={resetDialog}>Done</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
