import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  BookOpen,
  Crown,
  Calendar,
  TrendingUp,
  Plus,
} from "lucide-react";
import { fetchAdminStats } from "@/lib/data/admin/stats";
import { AdminStats } from "@/lib/data/admin/types";
import { Skeleton } from "@/components/ui/skeleton";

export function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminStats().then((data) => {
      setStats(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-9 w-48 mb-2" />
          <Skeleton className="h-5 w-64" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      icon: Users,
    },
    {
      title: "Total Bookmarks",
      value: stats?.totalBookmarks || 0,
      icon: BookOpen,
    },
    {
      title: "Pro Users",
      value: stats?.proUsers || 0,
      icon: Crown,
    },
    {
      title: "New Today",
      value: stats?.newUsersToday || 0,
      icon: Plus,
    },
    {
      title: "Daily Active Users",
      value: stats?.dailyActiveUsers || 0,
      icon: TrendingUp,
    },
    {
      title: "Items Added Today",
      value: stats?.itemsAddedToday || 0,
      icon: Calendar,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your Bookmarkly platform
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      {/* Add recent activity and charts here */}
    </div>
  );
}
