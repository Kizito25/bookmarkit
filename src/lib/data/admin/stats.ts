import { supabase } from "@/lib/supabase";
import { AdminStats } from "./types";

export async function fetchAdminStats(): Promise<AdminStats> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayISO = today.toISOString();

  const [
    { count: totalUsers },
    { count: totalBookmarks },
    { count: proUsers },
    { count: newUsersToday },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("bookmarks").select("*", { count: "exact", head: true }),
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("plan", "pro"),
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .gte("created_at", todayISO),
  ]);

  // Calculate daily active users (users who logged in today)
  const { data: { users } } = await supabase.auth.admin.listUsers();
  const dailyActiveUsers = users?.filter((u) => {
    if (!u.last_sign_in_at) return false;
    const lastSignIn = new Date(u.last_sign_in_at);
    return lastSignIn >= today;
  }).length || 0;

  // Items added today
  const { count: itemsAddedToday } = await supabase
    .from("bookmarks")
    .select("*", { count: "exact", head: true })
    .gte("created_at", todayISO);

  return {
    totalUsers: totalUsers || 0,
    totalBookmarks: totalBookmarks || 0,
    proUsers: proUsers || 0,
    newUsersToday: newUsersToday || 0,
    dailyActiveUsers,
    itemsAddedToday: itemsAddedToday || 0,
  };
}

export async function fetchCollectionStats() {
  const [
    { count: totalBookmarks },
    { count: totalTags },
    { count: totalUsers },
  ] = await Promise.all([
    supabase.from("bookmarks").select("*", { count: "exact", head: true }),
    supabase.from("tags").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
  ]);

  // Get bookmarks by tag (simplified - would need proper aggregation)
  const { data: bookmarkTags } = await supabase
    .from("bookmark_tags")
    .select("tag_id, tags(name)");

  const tagCounts: Record<string, number> = {};
  bookmarkTags?.forEach((bt) => {
    const tagName = (bt.tags as any)?.name || "Unknown";
    tagCounts[tagName] = (tagCounts[tagName] || 0) + 1;
  });

  const bookmarksByTag = Object.entries(tagCounts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return {
    totalBookmarks: totalBookmarks || 0,
    totalTags: totalTags || 0,
    totalUsers: totalUsers || 0,
    bookmarksByTag,
  };
}

export async function fetchAnalyticsData(days: number = 30): Promise<Array<{ date: string; users: number; bookmarks: number; activeUsers: number }>> {
  // Placeholder - would need proper time-series aggregation
  // For now, return mock data structure
  const data = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toISOString().split("T")[0],
      users: 0,
      bookmarks: 0,
      activeUsers: 0,
    });
  }
  
  return data;
}
