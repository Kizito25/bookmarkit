import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './auth-provider';
import { Bookmark, Tag } from '@/types';
import { toast } from 'sonner';

export type View = "all" | "pinned" | "archived";
export type SortOrder = "created_at" | "last_visited_at" | "view_count";

interface BookmarksContextType {
    bookmarks: Bookmark[];
    tags: Tag[];
    loading: boolean;
    loadingMore: boolean;
    hasMore: boolean;
    error: string | null;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    addBookmark: (bookmark: Omit<Bookmark, 'id' | 'created_at' | 'user_id' | 'is_archived' | 'is_pinned' | 'view_count' | 'last_visited_at' | 'tags' | 'reminder_enabled' | 'reminder_date' | 'reminder_sent'>, tags: string[]) => Promise<number | null>;
    updateBookmark: (id: number, updates: Partial<Omit<Bookmark, 'id' | 'created_at' | 'user_id' | 'is_archived' | 'is_pinned' | 'view_count' | 'last_visited_at' | 'tags'>>, tagNames: string[]) => Promise<void>;
    togglePin: (id: number, is_pinned: boolean) => Promise<void>;
    toggleArchive: (id: number, is_archived: boolean) => Promise<void>;
    deleteBookmark: (id: number) => Promise<void>;
    visitBookmark: (id: number) => Promise<void>;
    updateReminder: (id: number, enabled: boolean, date: string | null) => Promise<void>;
    loadMore: () => Promise<void>;

    // Filters and sorting
    view: View;
    setView: (view: View) => void;
    tagFilter: string | null;
    setTagFilter: (tag: string | null) => void;
    sortOrder: SortOrder;
    setSortOrder: (order: SortOrder) => void;
}

const BookmarksContext = createContext<BookmarksContextType | undefined>(undefined);

export function BookmarksProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(0);

    // New state for filtering and sorting
    const [view, setView] = useState<View>('all');
    const [tagFilter, setTagFilter] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<SortOrder>('created_at');

    const ITEMS_PER_PAGE = 20;
    const LOAD_MORE_COUNT = 10;

    const fetchBookmarksAndTags = useCallback(async (reset = false) => {
        if (!user) return;

        if (reset) {
            setLoading(true);
            setCurrentPage(0);
            setHasMore(true);
        } else {
            setLoadingMore(true);
        }
        setError(null);

        try {
            const page = reset ? 0 : currentPage;
            const limit = reset ? ITEMS_PER_PAGE : LOAD_MORE_COUNT;
            const offset = reset ? 0 : ITEMS_PER_PAGE + (page * LOAD_MORE_COUNT);

            const bookmarksPromise = supabase
                .from('bookmarks')
                .select('*, tags(id, name)')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .range(offset, offset + limit - 1);

            const { data: bookmarksData, error: bookmarksError } = await bookmarksPromise;
            
            if (bookmarksError) throw bookmarksError;
            
            if (reset) {
                setBookmarks(bookmarksData || []);
            } else {
                setBookmarks(prev => [...prev, ...(bookmarksData || [])]);
            }

            // Check if there are more items
            setHasMore((bookmarksData || []).length === limit);
            if (!reset) {
                setCurrentPage(prev => prev + 1);
            }

            // Fetch tags only on initial load
            if (reset || tags.length === 0) {
                const { data: tagsData, error: tagsError } = await supabase
                    .from('tags')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('name', { ascending: true });
                
                if (tagsError) throw tagsError;
                setTags(tagsData || []);
            }

        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
            setError(errorMessage);
            toast.error("Failed to fetch your data.");
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [user, currentPage, ITEMS_PER_PAGE, LOAD_MORE_COUNT, tags.length]);

    useEffect(() => {
        fetchBookmarksAndTags(true);
    }, [user]);

    const addBookmark = async (bookmark: Omit<Bookmark, 'id' | 'created_at' | 'user_id' | 'is_archived' | 'is_pinned' | 'view_count' | 'last_visited_at' | 'tags' | 'reminder_enabled' | 'reminder_date' | 'reminder_sent'>, tagNames: string[]): Promise<number | null> => {
        if (!user) return null;

        const promise = (async () => {
            const bookmarkData = {
                title: bookmark.title,
                url: bookmark.url,
                description: bookmark.description,
                favicon_url: bookmark.favicon_url,
                user_id: user.id
            };

            const { data: newBookmark, error: bookmarkError } = await supabase
                .from('bookmarks')
                .insert(bookmarkData)
                .select()
                .single();

            if (bookmarkError) throw bookmarkError;
            if (!newBookmark) return null;

            if (tagNames.length > 0) {
                const tagsToUpsert = tagNames.map(name => ({ name, user_id: user.id }));
                const { data: upsertedTags, error: tagsUpsertError } = await supabase
                    .from('tags')
                    .upsert(tagsToUpsert, { onConflict: 'name,user_id' })
                    .select('id, name');

                if (tagsUpsertError) throw tagsUpsertError;

                const bookmarkTagsToInsert = upsertedTags.map(tag => ({
                    bookmark_id: newBookmark.id,
                    tag_id: tag.id,
                }));

                const { error: bookmarkTagsError } = await supabase
                    .from('bookmark_tags')
                    .insert(bookmarkTagsToInsert);

                if (bookmarkTagsError) throw bookmarkTagsError;
            }
            await fetchBookmarksAndTags(true);
            return newBookmark.id;
        })();

        toast.promise(promise, {
            loading: 'Saving bookmark...',
            success: 'Bookmark added successfully!',
            error: 'Failed to add bookmark.',
        });

        return promise;
    };

    const updateBookmark = async (id: number, updates: Partial<Omit<Bookmark, 'tags'>>, tagNames: string[]) => {
        if (!user) return;
    
        const promise = async () => {
            // 1. Update the bookmark details
            const { error: updateError } = await supabase
                .from('bookmarks')
                .update(updates)
                .eq('id', id);
            if (updateError) throw updateError;
    
            // 2. Handle tags by removing all old and adding all new
            const { error: deleteTagsError } = await supabase
                .from('bookmark_tags')
                .delete()
                .eq('bookmark_id', id);
            if (deleteTagsError) throw deleteTagsError;
    
            if (tagNames.length > 0) {
                const tagsToUpsert = tagNames.map(name => ({ name, user_id: user.id }));
                const { data: upsertedTags, error: tagsUpsertError } = await supabase
                    .from('tags')
                    .upsert(tagsToUpsert, { onConflict: 'name,user_id' })
                    .select('id, name');
                if (tagsUpsertError) throw tagsUpsertError;
    
                const bookmarkTagsToInsert = upsertedTags.map(tag => ({
                    bookmark_id: id,
                    tag_id: tag.id,
                }));
                const { error: bookmarkTagsError } = await supabase
                    .from('bookmark_tags')
                    .insert(bookmarkTagsToInsert);
                if (bookmarkTagsError) throw bookmarkTagsError;
            }
    
            // 3. Refetch all data to update the UI
            await fetchBookmarksAndTags(true);
        };
    
        toast.promise(promise(), {
            loading: 'Updating bookmark...',
            success: 'Bookmark updated successfully!',
            error: 'Failed to update bookmark.',
        });
    };

    const togglePin = async (id: number, is_pinned: boolean) => {
        const { error } = await supabase.from('bookmarks').update({ is_pinned: !is_pinned }).eq('id', id);
        if (error) {
            toast.error(error.message);
        } else {
            setBookmarks(bookmarks.map(b => b.id === id ? { ...b, is_pinned: !is_pinned } : b));
            toast.success(is_pinned ? 'Bookmark unpinned' : 'Bookmark pinned');
        }
    };

    const toggleArchive = async (id: number, is_archived: boolean) => {
        const { error } = await supabase.from('bookmarks').update({ is_archived: !is_archived }).eq('id', id);
        if (error) {
            toast.error(error.message);
        } else {
            setBookmarks(bookmarks.map(b => b.id === id ? { ...b, is_archived: !is_archived } : b));
            toast.success(is_archived ? 'Bookmark unarchived' : 'Bookmark archived');
        }
    };

    const deleteBookmark = async (id: number) => {
        const { error } = await supabase.from('bookmarks').delete().eq('id', id);
        if (error) {
            toast.error(error.message);
        } else {
            setBookmarks(bookmarks.filter(b => b.id !== id));
            toast.success('Bookmark deleted');
        }
    };

    const visitBookmark = async (id: number) => {
        const bookmark = bookmarks.find(b => b.id === id);
        if (!bookmark) return;
        
        const { error } = await supabase
            .from('bookmarks')
            .update({ 
                view_count: bookmark.view_count + 1,
                last_visited_at: new Date().toISOString()
            })
            .eq('id', id);
        
        if (error) {
            console.error("Failed to increment view count", error);
        } else {
            // Update local state
            setBookmarks(bookmarks.map(b => 
                b.id === id 
                    ? { ...b, view_count: b.view_count + 1, last_visited_at: new Date().toISOString() }
                    : b
            ));
        }
    };

    const loadMore = async () => {
        if (!loadingMore && hasMore) {
            await fetchBookmarksAndTags(false);
        }
    };

    const updateReminder = async (id: number, enabled: boolean, date: string | null) => {
        const { error } = await supabase
            .from('bookmarks')
            .update({
                reminder_enabled: enabled,
                reminder_date: date,
                reminder_sent: false
            })
            .eq('id', id);

        if (error) {
            console.error('Error updating reminder:', error);
            throw error;
        }

        // Update local state
        setBookmarks(prev => prev.map(b => 
            b.id === id 
                ? { ...b, reminder_enabled: enabled, reminder_date: date, reminder_sent: false }
                : b
        ));
    };

    const value = {
        bookmarks,
        tags,
        loading,
        loadingMore,
        hasMore,
        error,
        searchTerm,
        setSearchTerm,
        addBookmark,
        updateBookmark,
        togglePin,
        toggleArchive,
        deleteBookmark,
        visitBookmark,
        updateReminder,
        loadMore,
        view,
        setView,
        tagFilter,
        setTagFilter,
        sortOrder,
        setSortOrder,
    };

    return <BookmarksContext.Provider value={value}>{children}</BookmarksContext.Provider>;
}

export function useBookmarks() {
    const context = useContext(BookmarksContext);
    if (context === undefined) {
        throw new Error('useBookmarks must be used within a BookmarksProvider');
    }
    return context;
}
