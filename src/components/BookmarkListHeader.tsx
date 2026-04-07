import { useBookmarks, SortOrder } from "@/contexts/bookmarks-provider";
import { ListFilter } from "lucide-react";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";

const sortOptions: { value: SortOrder, label: string }[] = [
    { value: 'created_at', label: 'Recently Added' },
    { value: 'last_visited_at', label: 'Recently Visited' },
    { value: 'view_count', label: 'Most Visited' },
]

export function BookmarkListHeader() {
    const { view, tagFilter, sortOrder, setSortOrder } = useBookmarks();

    const getTitle = () => {
        if (tagFilter) return `Tag: #${tagFilter}`;
        if (view === 'pinned') return 'Pinned Bookmarks';
        if (view === 'archived') return 'Archived Bookmarks';
        return 'All Bookmarks';
    }

    return (
        <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold md:text-2xl">{getTitle()}</h1>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 gap-1">
                        <ListFilter className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                            Sort
                        </span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup value={sortOrder} onValueChange={(value) => setSortOrder(value as SortOrder)}>
                        {sortOptions.map(option => (
                            <DropdownMenuRadioItem key={option.value} value={option.value}>
                                {option.label}
                            </DropdownMenuRadioItem>
                        ))}
                    </DropdownMenuRadioGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
