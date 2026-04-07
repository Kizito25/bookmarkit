import { useMemo, useEffect, useRef, useCallback } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useBookmarks } from "@/contexts/bookmarks-provider";
import { useDebounce } from "@/hooks/use-debounce";
import { BookmarkCard } from "./BookmarkCard";
import { BookmarkListSkeleton } from "./Skeletons";
import { BookmarkListHeader } from "./BookmarkListHeader";
import { Loader2 } from "lucide-react";

function BookmarksPlaceholder({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm h-full">
      <div className="flex flex-col items-center gap-1 text-center">
        <h3 className="text-2xl font-bold tracking-tight">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

export function BookmarkList() {
  const {
    bookmarks,
    loading,
    loadingMore,
    hasMore,
    loadMore,
    searchTerm,
    view,
    setView,
    tagFilter,
    setTagFilter,
    sortOrder,
  } = useBookmarks();
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const location = useLocation();
  const params = useParams();
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith("/dashboard/tag/")) {
      setView("all");
      setTagFilter(params.tagName || null);
    } else if (path === "/dashboard/pinned") {
      setView("pinned");
      setTagFilter(null);
    } else if (path === "/dashboard/archived") {
      setView("archived");
      setTagFilter(null);
    } else {
      setView("all");
      setTagFilter(null);
    }
  }, [location.pathname, params.tagName, setView, setTagFilter]);

  const filteredAndSortedBookmarks = useMemo(() => {
    let processedBookmarks = [...bookmarks];

    // 1. Filter by view (all, pinned, archived)
    if (view === "pinned") {
      processedBookmarks = processedBookmarks.filter(
        (b) => b.is_pinned && !b.is_archived
      );
    } else if (view === "archived") {
      processedBookmarks = processedBookmarks.filter((b) => b.is_archived);
    } else {
      // 'all' view excludes archived unless explicitly viewing archived
      processedBookmarks = processedBookmarks.filter((b) => !b.is_archived);
    }

    // 2. Filter by tag
    if (tagFilter) {
      processedBookmarks = processedBookmarks.filter((b) =>
        b.tags.some((t) => t.name.toLowerCase() === tagFilter.toLowerCase())
      );
    }

    // 3. Filter by search term
    if (debouncedSearchTerm) {
      processedBookmarks = processedBookmarks.filter(
        (bookmark) =>
          bookmark.title
            .toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase()) ||
          bookmark.description
            ?.toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase()) ||
          bookmark.url.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
    }

    // 4. Sort
    processedBookmarks.sort((a, b) => {
      if (sortOrder === "created_at") {
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      }
      if (sortOrder === "last_visited_at") {
        // Treat nulls as oldest
        const dateA = a.last_visited_at
          ? new Date(a.last_visited_at).getTime()
          : 0;
        const dateB = b.last_visited_at
          ? new Date(b.last_visited_at).getTime()
          : 0;
        return dateB - dateA;
      }
      if (sortOrder === "view_count") {
        return b.view_count - a.view_count;
      }
      return 0;
    });

    return processedBookmarks;
  }, [bookmarks, debouncedSearchTerm, view, tagFilter, sortOrder]);

  const lastBookmarkElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading || loadingMore) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (
          entries[0].isIntersecting &&
          hasMore &&
          !debouncedSearchTerm &&
          !tagFilter
        ) {
          loadMore();
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [loading, loadingMore, hasMore, loadMore, debouncedSearchTerm, tagFilter]
  );

  if (loading) {
    return <BookmarkListSkeleton />;
  }

  if (!bookmarks || bookmarks.length === 0) {
    return (
      <BookmarksPlaceholder
        title="You have no bookmarks yet"
        description="Start adding bookmarks to see them here."
      />
    );
  }

  if (filteredAndSortedBookmarks.length === 0) {
    return (
      <>
        <BookmarkListHeader />
        <BookmarksPlaceholder
          title="No bookmarks found"
          description="Try a different filter or search term."
        />
      </>
    );
  }

  return (
    <>
      <BookmarkListHeader />
      <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
        {filteredAndSortedBookmarks.map((bookmark, index) => (
          <div
            key={bookmark.id}
            ref={
              index === filteredAndSortedBookmarks.length - 1
                ? lastBookmarkElementRef
                : null
            }
          >
            <BookmarkCard bookmark={bookmark} />
          </div>
        ))}
      </div>

      {loadingMore && (
        <div className="flex justify-center py-6">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading more bookmarks...</span>
          </div>
        </div>
      )}

      {!hasMore &&
        bookmarks.length > 0 &&
        !debouncedSearchTerm &&
        !tagFilter && (
          <div className="text-center py-6">
            <p className="text-muted-foreground text-sm">
              You've reached the end of your bookmarks
            </p>
          </div>
        )}
    </>
  );
}
