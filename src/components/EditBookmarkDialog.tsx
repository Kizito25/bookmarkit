import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { ReminderToggle } from "./ReminderToggle";
import { useBookmarks } from "@/contexts/bookmarks-provider";
import { Bookmark } from "@/types";

interface EditBookmarkDialogProps {
  bookmark: Bookmark;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditBookmarkDialog({
  bookmark,
  open,
  onOpenChange,
}: EditBookmarkDialogProps) {
  const { updateBookmark, updateReminder } = useBookmarks();
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (bookmark && open) {
      setUrl(bookmark.url);
      setTitle(bookmark.title);
      setDescription(bookmark.description || "");
      setTagInput(bookmark.tags.map((t) => t.name).join(", "));
    }
  }, [bookmark, open]);

  const handleUpdateBookmark = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !url) return;

    const tagNames = tagInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    await updateBookmark(
      bookmark.id,
      { url, title, description: description || null },
      tagNames
    );

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleUpdateBookmark}>
          <DialogHeader>
            <DialogTitle>Edit bookmark</DialogTitle>
            <DialogDescription>
              Make changes to your bookmark here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4 py-4">
            <div className="columns-1 items-center gap-4">
              <Label htmlFor="edit-url" className="text-right">
                URL
              </Label>
              <Input
                id="edit-url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="col-span-1 items-center gap-4">
              <Label htmlFor="edit-title" className="text-right">
                Title
              </Label>
              <Input
                id="edit-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="col-span-1 items-center gap-4">
              <Label htmlFor="edit-description" className="text-right">
                Description
              </Label>
              <Textarea
                id="edit-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="col-span-1 items-center gap-4">
              <Label htmlFor="edit-tags" className="text-right">
                Tags
              </Label>
              <Input
                id="edit-tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                className="col-span-1"
                placeholder="work, inspiration, ..."
              />
            </div>
            <div className="col-span-1">
              <ReminderToggle
                enabled={bookmark.reminder_enabled || false}
                date={bookmark.reminder_date}
                onUpdate={(enabled, date) =>
                  updateReminder(bookmark.id, enabled, date)
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
