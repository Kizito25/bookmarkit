export type AdminUser = {
  id: string;
  email: string;
  name: string;
  plan: "free" | "pro";
  instagram?: string | null;
  linkedin?: string | null;
  facebook?: string | null;
  direct_access?: string | null;
  registration_time: string;
  last_access: string | null;
  items_count: number;
  status: "active" | "disabled";
};

export type UserFilters = {
  plan?: "free" | "pro";
  status?: "active" | "disabled";
  dateRange?: { from: Date; to: Date };
  search?: string;
};

export type PaginationParams = {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

export type AdminStats = {
  totalUsers: number;
  totalBookmarks: number;
  proUsers: number;
  newUsersToday: number;
  dailyActiveUsers: number;
  itemsAddedToday: number;
};

export type UserActivity = {
  id: string;
  action: string;
  timestamp: string;
  details: Record<string, unknown>;
};

export type UserCollection = {
  bookmarks: number;
  tags: number;
  pinned: number;
  archived: number;
};

export type Plan = {
  id: string;
  name: "free" | "pro";
  price: number;
  features: string[];
};

export type CollectionStats = {
  totalBookmarks: number;
  totalTags: number;
  totalUsers: number;
  bookmarksByTag: Array<{ tag: string; count: number }>;
};

export type AnalyticsData = {
  date: string;
  users: number;
  bookmarks: number;
  activeUsers: number;
};

export type Role = {
  id: string;
  name: string;
  permissions: string[];
  userCount: number;
};

export type AuditLog = {
  id: string;
  actor: string;
  actorEmail: string;
  action: string;
  entity: string;
  entityId: string;
  timestamp: string;
  metadata: Record<string, unknown>;
};
