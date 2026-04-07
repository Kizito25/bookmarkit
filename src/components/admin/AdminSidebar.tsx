import { NavLink, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  FolderOpen,
  BarChart3,
  Settings,
  Shield,
  FileText,
  Mail,
  LogOut,
  BookMarked,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdminAuth } from "@/contexts/admin-auth-provider";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  { icon: Users, label: "Users", path: "/admin/users" },
  { icon: CreditCard, label: "Plans & Billing", path: "/admin/billing" },
  { icon: FolderOpen, label: "Collections", path: "/admin/collections" },
  { icon: BarChart3, label: "Analytics", path: "/admin/analytics" },
  { icon: Settings, label: "Settings", path: "/admin/settings" },
  { icon: Shield, label: "Roles & Permissions", path: "/admin/roles" },
  { icon: FileText, label: "Audit Logs", path: "/admin/audit" },
  { icon: Mail, label: "Data Requests", path: "/admin/data-requests" },
];

export function AdminSidebar() {
  const { adminUser, logout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="border-r bg-muted/40 h-full">
      <div className="flex h-full max-h-screen flex-col">
        <div className="flex h-16 items-center border-b px-6 flex-shrink-0">
          <div className="flex items-center gap-2 font-semibold">
            <BookMarked className="h-6 w-6" />
            <span>Bookmarkly Admin</span>
          </div>
        </div>
        <div className="flex flex-col flex-1 min-h-0 overflow-y-auto">
          <nav className="grid items-start px-4 py-4 text-sm font-medium">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/admin"}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted",
                      isActive && "bg-muted text-primary"
                    )
                  }
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
        </div>
        <div className="flex-shrink-0 border-t p-4">
          <div className="flex items-center gap-3 mb-3">
            <Avatar>
              <AvatarFallback>
                {adminUser?.email?.charAt(0).toUpperCase() || "A"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{adminUser?.email}</p>
              <p className="text-xs text-muted-foreground truncate">
                {adminUser?.role}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full"
            onClick={handleLogout}
            size="sm"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
