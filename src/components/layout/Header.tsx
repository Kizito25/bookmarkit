import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/ThemeToggle";
import { UserNav } from "@/components/UserNav";
import { AddBookmarkDialog } from "../AddBookmarkDialog";
import { ImportDialog } from "../ImportDialog";
import { NotificationCenter } from "../NotificationCenter";
import { useBookmarks } from "@/contexts/bookmarks-provider";
import { MobileNav } from "./MobileNav";

export function Header() {
  const { searchTerm, setSearchTerm } = useBookmarks();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <MobileNav />
      <div className="flex w-full mx-auto h-16 items-center gap-2 md:gap-2 lg:gap-4">
        <form className="sm:flex-initial w-full">
          <div className="flex-1 relative w-full flex items-center">
            <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search bookmarks..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </form>
        <AddBookmarkDialog />
        <ImportDialog />
        <NotificationCenter />
        <ThemeToggle />
        <UserNav />
      </div>
    </header>
  );
}
