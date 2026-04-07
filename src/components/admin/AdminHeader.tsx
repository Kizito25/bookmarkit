import { Search, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
import { format } from "date-fns";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AdminUserNav } from "./AdminUserNav";
import { AdminMobileNav } from "./AdminMobileNav";

interface AdminHeaderProps {
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
  viewMode?: "card" | "list";
  onViewModeChange?: (mode: "card" | "list") => void;
  searchPlaceholder?: string;
  rightActions?: React.ReactNode;
}

export function AdminHeader({
  searchTerm = "",
  onSearchChange,
  viewMode = "card",
  onViewModeChange,
  searchPlaceholder = "Search...",
  rightActions,
}: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <AdminMobileNav />
      <div className="flex flex-1 items-center gap-4 h-16">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={searchPlaceholder}
            className="pl-8"
            value={searchTerm}
            onChange={(e) => onSearchChange?.(e.target.value)}
          />
        </div>
      </div>
      <div className="flex items-center gap-4 h-16">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{format(new Date(), "EEEE, do MMMM")}</span>
        </div>
        {onViewModeChange && (
          <div className="flex items-center gap-1 rounded-lg border p-1">
            <Button
              variant={viewMode === "card" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange("card")}
              className="h-8"
            >
              Card
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange("list")}
              className="h-8"
            >
              List
            </Button>
          </div>
        )}
        {rightActions}
        <ThemeToggle />
        <AdminUserNav />
      </div>
    </header>
  );
}
