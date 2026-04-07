import { useState, useEffect } from "react";
import { Plus, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { ReminderToggle } from "./ReminderToggle";
import { useBookmarks } from "@/contexts/bookmarks-provider";
import { useDebounce } from "@/hooks/use-debounce";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const isValidUrl = (urlString: string) => {
  try {
    new URL(urlString);
    return true;
  } catch {
    return false;
  }
};

export function AddBookmarkDialog() {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderDate, setReminderDate] = useState<string | null>(null);
  const [isFetchingMetadata, setIsFetchingMetadata] = useState(false);
  const { addBookmark, updateReminder } = useBookmarks();

  const debouncedUrl = useDebounce(url, 500);

  useEffect(() => {
    const fetchMetadata = async () => {
      if (!debouncedUrl || !isValidUrl(debouncedUrl)) {
        return;
      }
      setIsFetchingMetadata(true);
      try {
        const { data, error } = await supabase.functions.invoke(
          "fetch-metadata",
          {
            body: { url: debouncedUrl },
          }
        );

        if (error) throw error;

        if (data.title && !title) {
          setTitle(data.title);
        }
        if (data.description && !description) {
          setDescription(data.description);
        }
      } catch (error) {
        console.error("Failed to fetch metadata:", error);
      } finally {
        setIsFetchingMetadata(false);
      }
    };

    fetchMetadata();
  }, [debouncedUrl, title, description]);

  const handleAddBookmark = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !url) return;

    const tagNames = tagInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const newBookmarkId = await addBookmark(
      {
        url,
        title,
        description,
        favicon_url: null,
      },
      tagNames
    );

    if (reminderEnabled && reminderDate && newBookmarkId) {
      try {
        await updateReminder(newBookmarkId, true, reminderDate);
      } catch (error) {
        console.error("Failed to set reminder:", error);
        toast.error("Bookmark saved, but reminder couldn't be set.");
      }
    }

    // Reset form and close dialog
    setUrl("");
    setTitle("");
    setDescription("");
    setTagInput("");
    setReminderEnabled(false);
    setReminderDate(null);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="md:rounded-md rounded-full md:px-4 px-3">
          <Plus className="md:mr-2 h-4 w-4" />
          <span className="hidden md:inline">Add Bookmark</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleAddBookmark}>
          <DialogHeader>
            <DialogTitle>Add a new bookmark</DialogTitle>
            <DialogDescription>
              Enter the details for your new bookmark. Click save when you're
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4 py-4">
            <div className="col-span-4 items-center gap-4">
              <Label htmlFor="url" className="text-right">
                URL
              </Label>
              <div className="relative">
                <Input
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                />
                {isFetchingMetadata && (
                  <Loader2 className="absolute right-2 top-2 h-5 w-5 animate-spin text-muted-foreground" />
                )}
              </div>
            </div>
            <div className="col-span-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="col-span-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="col-span-4 items-center gap-4">
              <Label htmlFor="tags" className="text-right">
                Tags
              </Label>
              <Input
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                className="col-span-3"
                placeholder="work, inspiration, ..."
              />
            </div>
            <div className="col-span-4">
              <ReminderToggle
                enabled={reminderEnabled}
                date={reminderDate}
                onUpdate={(enabled, date) => {
                  setReminderEnabled(enabled);
                  setReminderDate(date);
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save Bookmark</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
