import { NavLink } from "react-router-dom";
import { Bookmark, Star, Archive, Tag, Settings, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { useBookmarks } from "@/contexts/bookmarks-provider";

const navLinkClass = "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary";
const activeNavLinkClass = "bg-muted text-primary";

interface NavContentProps {
    onLinkClick?: () => void;
}

export function NavContent({ onLinkClick }: NavContentProps) {
    const { tags } = useBookmarks();

    const handleLinkClick = () => {
        if (onLinkClick) {
            onLinkClick();
        }
    }

    return (
        <>
            <div className="flex-1 overflow-y-auto py-2">
                <nav className="grid items-start px-4 text-sm font-medium">
                    <NavLink to="/dashboard" end className={({ isActive }) => cn(navLinkClass, isActive && activeNavLinkClass)} onClick={handleLinkClick}>
                        <Bookmark className="h-4 w-4" />
                        All Bookmarks
                    </NavLink>
                    <NavLink to="/dashboard/pinned" className={({ isActive }) => cn(navLinkClass, isActive && activeNavLinkClass)} onClick={handleLinkClick}>
                        <Star className="h-4 w-4" />
                        Pinned
                    </NavLink>
                    <NavLink to="/dashboard/archived" className={({ isActive }) => cn(navLinkClass, isActive && activeNavLinkClass)} onClick={handleLinkClick}>
                        <Archive className="h-4 w-4" />
                        Archived
                    </NavLink>
                </nav>
                <Separator className="my-4" />
                <div className="px-4">
                    <h3 className="mb-2 px-3 text-xs font-semibold uppercase text-muted-foreground">Tags</h3>
                    <div className="grid items-start text-sm font-medium">
                        {tags.map(tag => (
                            <NavLink key={tag.id} to={`/dashboard/tag/${tag.name.toLowerCase()}`} className={({ isActive }) => cn(navLinkClass, isActive && activeNavLinkClass)} onClick={handleLinkClick}>
                                <Tag className="h-4 w-4" />
                                {tag.name}
                            </NavLink>
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex-shrink-0 border-t p-4">
                <div className="space-y-2">
                    <NavLink to="/dashboard/data-requests" className={({ isActive }) => cn('w-full justify-start', navLinkClass, isActive && activeNavLinkClass)} onClick={handleLinkClick}>
                        <ShieldCheck className="mr-2 h-4 w-4" />
                        Data Requests
                    </NavLink>
                    <NavLink to="/dashboard/settings" className={({ isActive }) => cn('w-full justify-start', navLinkClass, isActive && activeNavLinkClass)} onClick={handleLinkClick}>
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                    </NavLink>
                </div>
            </div>
        </>
    );
}
