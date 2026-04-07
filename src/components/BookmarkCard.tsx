import { useState } from "react";
import { Bookmark as BookmarkType } from "@/types";
import {
  Archive,
  Copy,
  MoreVertical,
  Trash2,
  Star,
  Edit,
  Clock,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "./ui/badge";
import { Button, buttonVariants } from "./ui/button";
import { toast } from "sonner";
import { useBookmarks } from "@/contexts/bookmarks-provider";
import { EditBookmarkDialog } from "./EditBookmarkDialog";
import { AlertDialogTrigger } from "@radix-ui/react-alert-dialog";
import { randomSolidColors } from "@kizito25/randomly";

interface BookmarkCardProps {
  bookmark: BookmarkType;
}

export function BookmarkCard({ bookmark }: BookmarkCardProps) {
  const { togglePin, toggleArchive, deleteBookmark, visitBookmark } =
    useBookmarks();
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(bookmark.url);
    toast.success("URL copied to clipboard!");
  };

  const handleDelete = () => {
    deleteBookmark(bookmark.id);
    setDeleteAlertOpen(false);
  };

  const handleVisit = () => {
    visitBookmark(bookmark.id);
  };

  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  };

  return (
    <>
      <Card className="flex flex-col transition-all hover:shadow-md">
        <CardHeader className="flex-row items-start justify-between gap-4 pb-2">
          <div className="flex items-center gap-3 overflow-hidden">
            <img
              src={`https://www.google.com/s2/favicons?domain=${getDomain(
                bookmark.url
              )}&sz=32`}
              alt={`Favicon for ${getDomain(bookmark.url)}`}
              className="h-6 w-6 flex-shrink-0 object-contain"
              width="24"
              height="24"
            />
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="truncate hover:underline"
              onClick={handleVisit}
            >
              <CardTitle className="text-base font-semibold leading-tight truncate">
                {bookmark.title}
              </CardTitle>
            </a>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground flex-shrink-0">
            {bookmark.reminder_enabled && bookmark.reminder_date && (
              <div
                title={`Reminder: ${new Date(
                  bookmark.reminder_date
                ).toLocaleDateString()}`}
              >
                <Clock className="h-4 w-4 text-blue-500" />
              </div>
            )}
            {bookmark.is_pinned && (
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            )}
          </div>
        </CardHeader>
        <CardContent className="flex-grow text-sm text-muted-foreground pb-4">
          {bookmark.description && (
            <p className="line-clamp-2">{bookmark.description}</p>
          )}
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary hover:underline truncate block"
            onClick={handleVisit}
          >
            {bookmark.url}
          </a>
        </CardContent>
        <CardFooter className="flex-col items-start gap-4">
          {bookmark.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {bookmark.tags.map((tag) => (
                <Badge
                  key={tag.id}
                  variant="secondary"
                  style={{ background: randomSolidColors() }}
                >
                  {tag.name}
                </Badge>
              ))}
            </div>
          )}
          <div className="flex w-full items-center justify-between text-xs text-muted-foreground">
            <span className="truncate">
              Added{" "}
              {formatDistanceToNow(new Date(bookmark.created_at), {
                addSuffix: true,
              })}
            </span>
            <AlertDialog
              open={deleteAlertOpen}
              onOpenChange={setDeleteAlertOpen}
            >
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">More actions</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onSelect={() => togglePin(bookmark.id, bookmark.is_pinned)}
                  >
                    <Star className="mr-2 h-4 w-4" />
                    <span>{bookmark.is_pinned ? "Unpin" : "Pin"}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setEditDialogOpen(true)}>
                    <Edit className="mr-2 h-4 w-4" />
                    <span>Edit</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() =>
                      toggleArchive(bookmark.id, bookmark.is_archived)
                    }
                  >
                    <Archive className="mr-2 h-4 w-4" />
                    <span>
                      {bookmark.is_archived ? "Unarchive" : "Archive"}
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={handleCopy}>
                    <Copy className="mr-2 h-4 w-4" />
                    <span>Copy URL</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem
                      onSelect={(e) => e.preventDefault()}
                      className="text-destructive focus:text-destructive focus:bg-destructive/10"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                </DropdownMenuContent>
              </DropdownMenu>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your bookmark and remove your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className={buttonVariants({ variant: "destructive" })}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardFooter>
      </Card>
      <EditBookmarkDialog
        bookmark={bookmark}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />
    </>
  );
}
