import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { UsersTable } from "@/components/admin/UsersTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, Trash2 } from "lucide-react";
import { fetchUsers, exportUsersToCSV } from "@/lib/data/admin/users";
import { AdminUser, UserFilters } from "@/lib/data/admin/types";
import { useDebounce } from "@/hooks/use-debounce";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export function UsersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [planFilter, setPlanFilter] = useState<UserFilters["plan"]>(
    (searchParams.get("plan") as UserFilters["plan"]) || undefined
  );
  const [statusFilter, setStatusFilter] = useState<UserFilters["status"]>(
    (searchParams.get("status") as UserFilters["status"]) || undefined
  );
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [total, setTotal] = useState(0);
  const pageSize = 20;

  const debouncedSearch = useDebounce(searchTerm, 300);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const filters: UserFilters = {
        search: debouncedSearch || undefined,
        plan: planFilter,
        status: statusFilter,
      };

      const { data, total: totalCount } = await fetchUsers(filters, {
        page,
        pageSize,
      });

      setUsers(data);
      setTotal(totalCount);
    } catch (error) {
      toast.error("Failed to load users");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, planFilter, statusFilter, page]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set("search", searchTerm);
    if (planFilter) params.set("plan", planFilter);
    if (statusFilter) params.set("status", statusFilter);
    if (page > 1) params.set("page", page.toString());
    setSearchParams(params);
  }, [searchTerm, planFilter, statusFilter, page, setSearchParams]);

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedIds(new Set(users.map((u) => u.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectOne = (id: string, selected: boolean) => {
    const newSet = new Set(selectedIds);
    if (selected) {
      newSet.add(id);
    } else {
      newSet.delete(id);
    }
    setSelectedIds(newSet);
  };

  const handleExport = async () => {
    try {
      const filters: UserFilters = {
        search: debouncedSearch || undefined,
        plan: planFilter,
        status: statusFilter,
      };
      const csv = await exportUsersToCSV(filters);
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `users-${new Date().toISOString()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Users exported successfully");
    } catch (error) {
      toast.error("Failed to export users");
    }
  };

  const handleBulkDelete = async (ids: string[]) => {
    // Implement delete logic
    toast.success(`Deleted ${ids.length} users`);
    setSelectedIds(new Set());
    loadUsers();
  };

  if (loading && users.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-9 w-48 mb-2" />
          <Skeleton className="h-5 w-64" />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">
            Manage and view all platform users
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          {selectedIds.size > 0 && (
            <Button
              variant="destructive"
              onClick={() => handleBulkDelete(Array.from(selectedIds))}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete ({selectedIds.size})
            </Button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Input
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select value={planFilter || "all"} onValueChange={(v) => setPlanFilter(v === "all" ? undefined : (v as UserFilters["plan"]))}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Plan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Plans</SelectItem>
            <SelectItem value="free">Free</SelectItem>
            <SelectItem value="pro">Pro</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter || "all"} onValueChange={(v) => setStatusFilter(v === "all" ? undefined : (v as UserFilters["status"]))}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="disabled">Disabled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <UsersTable
        users={users}
        selectedIds={selectedIds}
        onSelectAll={handleSelectAll}
        onSelectOne={handleSelectOne}
        onDelete={handleBulkDelete}
      />

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {users.length} of {total} users
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => p + 1)}
            disabled={users.length < pageSize}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
