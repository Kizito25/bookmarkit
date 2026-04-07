import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  Menu,
  BookMarked,
  LayoutDashboard,
  Users,
  CreditCard,
  FolderOpen,
  BarChart3,
  Settings,
  Shield,
  FileText,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
  { icon: Users, label: "Users", path: "/admin/users" },
  { icon: CreditCard, label: "Plans & Billing", path: "/admin/billing" },
  { icon: FolderOpen, label: "Collections", path: "/admin/collections" },
  { icon: BarChart3, label: "Analytics", path: "/admin/analytics" },
  { icon: Settings, label: "Settings", path: "/admin/settings" },
  { icon: Shield, label: "Roles & Permissions", path: "/admin/roles" },
  { icon: FileText, label: "Audit Logs", path: "/admin/audit" },
  { icon: Mail, label: "Data Requests", path: "/admin/data-requests" },
];

export function AdminMobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0 md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="DialogContent flex flex-col p-0">
        <Link
          to="/admin/dashboard"
          className="flex items-center gap-2 font-semibold px-6 py-4 border-b"
          onClick={() => setOpen(false)}
        >
          <BookMarked className="h-6 w-6" />
          <span>Bookmarkly Admin</span>
        </Link>
        <nav className="grid items-start px-4 py-4 text-sm font-medium">
          {navItems.map(({ icon: Icon, label, path }) => (
            <NavLink
              key={path}
              to={path}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                [
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all",
                  isActive
                    ? "bg-muted text-primary"
                    : "hover:text-primary hover:bg-muted",
                ].join(" ")
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
