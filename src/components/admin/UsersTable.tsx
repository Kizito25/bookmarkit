import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, ExternalLink } from "lucide-react";
import { AdminUser } from "@/lib/data/admin/types";
import { format } from "date-fns";
import { Link } from "react-router-dom";

interface UsersTableProps {
  users: AdminUser[];
  selectedIds: Set<string>;
  onSelectAll: (selected: boolean) => void;
  onSelectOne: (id: string, selected: boolean) => void;
  onEdit?: (user: AdminUser) => void;
  onDelete?: (ids: string[]) => void;
}

export function UsersTable({
  users,
  selectedIds,
  onSelectAll,
  onSelectOne,
  onEdit,
  onDelete,
}: UsersTableProps) {
  const allSelected = users.length > 0 && users.every((u) => selectedIds.has(u.id));

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={allSelected}
                onCheckedChange={(checked) => onSelectAll(checked === true)}
                aria-label="Select all"
              />
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Plan</TableHead>
            <TableHead>Social</TableHead>
            <TableHead>Registration</TableHead>
            <TableHead>Last Access</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} className="h-24 text-center">
                No users found.
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedIds.has(user.id)}
                    onCheckedChange={(checked) =>
                      onSelectOne(user.id, checked === true)
                    }
                    aria-label={`Select ${user.name}`}
                  />
                </TableCell>
                <TableCell className="font-medium">
                  <Link
                    to={`/admin/users/${user.id}`}
                    className="hover:underline"
                  >
                    {user.name}
                  </Link>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={user.plan === "pro" ? "default" : "secondary"}>
                    {user.plan}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {user.instagram && (
                      <a
                        href={user.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary"
                        title="Instagram"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                    {user.linkedin && (
                      <a
                        href={user.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary"
                        title="LinkedIn"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                    {user.facebook && (
                      <a
                        href={user.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary"
                        title="Facebook"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                    {user.direct_access && (
                      <a
                        href={user.direct_access}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary"
                        title="Direct Access"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                    {!user.instagram &&
                      !user.linkedin &&
                      !user.facebook &&
                      !user.direct_access && (
                        <span className="text-muted-foreground text-xs">—</span>
                      )}
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {format(new Date(user.registration_time), "MMM d, yyyy")}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {user.last_access
                    ? format(new Date(user.last_access), "MMM d, yyyy")
                    : "Never"}
                </TableCell>
                <TableCell>{user.items_count}</TableCell>
                <TableCell>
                  <Badge
                    variant={user.status === "active" ? "default" : "secondary"}
                  >
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => onEdit?.(user)}
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete?.([user.id])}
                        className="text-destructive"
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
