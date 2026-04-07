import { supabase } from "@/lib/supabase";
import { AdminUser, UserFilters, PaginationParams } from "./types";

export async function fetchUsers(
  filters: UserFilters = {},
  pagination: PaginationParams = { page: 1, pageSize: 20 }
): Promise<{ data: AdminUser[]; total: number }> {
  // Build query with filters
  // Note: Some fields may not exist in all database schemas - they'll be null if missing
  let query = supabase
    .from("profiles")
    .select("id, username, created_at, updated_at, plan", { count: "exact" });

  // if (filters.plan) {
  //   query = query.eq("plan", filters.plan);
  // }

  if (filters.dateRange) {
    query = query
      .gte("created_at", filters.dateRange.from.toISOString())
      .lte("created_at", filters.dateRange.to.toISOString());
  }

  if (filters.search) {
    query = query.or(
      `username.ilike.%${filters.search}%`
    );
  }

  // Apply pagination
  const from = (pagination.page - 1) * pagination.pageSize;
  const to = from + pagination.pageSize - 1;
  query = query.range(from, to);

  // Apply sorting
  if (pagination.sortBy) {
    query = query.order(pagination.sortBy, {
      ascending: pagination.sortOrder === "asc",
    });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  const { data: profiles, error, count } = await query;

  if (error) throw error;

  // Get bookmark counts per user
  const { data: bookmarks } = await supabase
    .from("bookmarks")
    .select("user_id");

  const bookmarkCounts = bookmarks?.reduce((acc, bookmark) => {
    acc[bookmark.user_id] = (acc[bookmark.user_id] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  // Get auth users for email and last_sign_in
  const { data: { users: authUsers } } = await supabase.auth.admin.listUsers();

  const combinedUsers: AdminUser[] = (profiles || []).map((profile: any) => {
    const authUser = authUsers?.find((u) => u.id === profile.id);
    return {
      id: profile.id,
      email: authUser?.email || "No email",
      name: profile.username || authUser?.email?.split("@")[0] || "Unknown",
      // plan: (profile.plan as "free" | "pro") || "free",
      plan: "free",
      instagram: profile.instagram || null,
      linkedin: profile.linkedin || null,
      facebook: profile.facebook || null,
      direct_access: profile.direct_access || null,
      registration_time: (profile as any).created_at || (profile as any).updated_at || new Date().toISOString(),
      last_access: authUser?.last_sign_in_at || null,
      items_count: bookmarkCounts[profile.id] || 0,
      status: "active", // Placeholder - would need status field
    };
  });

  return { data: combinedUsers, total: count || 0 };
}

export async function fetchUserById(id: string): Promise<AdminUser | null> {
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (!profile) return null;

  // Get bookmark count
  const { count } = await supabase
    .from("bookmarks")
    .select("*", { count: "exact", head: true })
    .eq("user_id", id);

  const { data: { user: authUser } } = await supabase.auth.admin.getUserById(id);

  const profileAny = profile as any;

  return {
    id: profile.id,
    email: authUser?.email || "No email",
    name: profile.username || "Unknown",
    // plan: (profileAny.plan as "free" | "pro") || "free",
    plan: "free",
    instagram: profileAny.instagram || null,
    linkedin: profileAny.linkedin || null,
    facebook: profileAny.facebook || null,
    direct_access: profileAny.direct_access || null,
    registration_time: profileAny.created_at || profileAny.updated_at || new Date().toISOString(),
    last_access: authUser?.last_sign_in_at || null,
    items_count: count || 0,
    status: "active",
  };
}

export async function fetchUserActivity(_userId: string) {
  // Placeholder - would need an activity/audit log table
  void _userId;
  return [];
}

export async function fetchUserCollections(userId: string) {
  const [bookmarksResult, tagsResult, pinnedResult, archivedResult] = await Promise.all([
    supabase.from("bookmarks").select("*", { count: "exact", head: true }).eq("user_id", userId),
    supabase.from("tags").select("*", { count: "exact", head: true }).eq("user_id", userId),
    supabase.from("bookmarks").select("*", { count: "exact", head: true }).eq("user_id", userId).eq("is_pinned", true),
    supabase.from("bookmarks").select("*", { count: "exact", head: true }).eq("user_id", userId).eq("is_archived", true),
  ]);

  return {
    bookmarks: bookmarksResult.count || 0,
    tags: tagsResult.count || 0,
    pinned: pinnedResult.count || 0,
    archived: archivedResult.count || 0,
  };
}

export async function exportUsersToCSV(filters: UserFilters = {}): Promise<string> {
  const { data } = await fetchUsers(filters, { page: 1, pageSize: 10000 });
  
  const headers = ["Name", "Email", "Plan", "Items Count", "Registration Time", "Last Access", "Status"];
  const rows = data.map((user) => [
    user.name,
    user.email,
    user.plan,
    user.items_count.toString(),
    user.registration_time,
    user.last_access || "Never",
    user.status,
  ]);

  const csv = [headers.join(","), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(","))].join("\n");
  return csv;
}
