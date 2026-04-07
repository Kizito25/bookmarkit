import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

type AdminDataRequest = {
  id: number;
  user_id: string;
  type: "delete" | "export";
  status: "pending" | "processing" | "completed" | "rejected";
  details: string | null;
  notes: string | null;
  result_url: string | null;
  processed_at: string | null;
  processed_by: string | null;
  created_at: string;
};

const statusVariants: Record<AdminDataRequest["status"], string> = {
  pending: "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100",
  processing: "bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-100",
  completed: "bg-emerald-100 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-100",
  rejected: "bg-red-100 text-red-900 dark:bg-red-900/40 dark:text-red-100",
};

export function AdminDataRequestsPage() {
  const [requests, setRequests] = useState<AdminDataRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState<AdminDataRequest["status"] | "all">("all");
  const [notesDraft, setNotesDraft] = useState<Record<number, string>>({});
  const [resultDraft, setResultDraft] = useState<Record<number, string>>({});

  const filteredRequests = useMemo(() => {
    if (filterStatus === "all") return requests;
    return requests.filter((req) => req.status === filterStatus);
  }, [requests, filterStatus]);

  const loadRequests = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("data_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load data requests");
    } else {
      setRequests((data || []) as AdminDataRequest[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const updateStatus = async (
    id: number,
    status: AdminDataRequest["status"],
    options?: { notes?: string; result_url?: string }
  ) => {
    setUpdatingId(id);
    const { error } = await supabase
      .from("data_requests")
      .update({
        status,
        notes: options?.notes ?? notesDraft[id] ?? null,
        result_url: options?.result_url ?? resultDraft[id] ?? null,
        processed_at: status === "pending" ? null : new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      toast.error("Could not update request");
    } else {
      toast.success("Request updated");
      loadRequests();
    }
    setUpdatingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">Data Requests</h1>
        <p className="text-muted-foreground">
          View and process user data export/deletion requests. Use notes and result URL to track outcomes.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Requests</CardTitle>
            <CardDescription>Update status, attach notes, and add result links when complete.</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Label className="text-sm font-medium">Filter</Label>
            <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as typeof filterStatus)}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={loadRequests}>
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading requests...
            </div>
          ) : filteredRequests.length === 0 ? (
            <p className="text-sm text-muted-foreground">No requests match this filter.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Created</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="min-w-[220px]">Notes</TableHead>
                  <TableHead className="min-w-[220px]">Result URL</TableHead>
                  <TableHead className="min-w-[200px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="whitespace-nowrap">
                      {format(new Date(request.created_at), "PP p")}
                    </TableCell>
                    <TableCell className="font-mono text-xs">{request.user_id}</TableCell>
                    <TableCell className="capitalize">{request.type}</TableCell>
                    <TableCell>
                      <Badge className={statusVariants[request.status]}>{request.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Textarea
                        defaultValue={request.notes ?? ""}
                        onChange={(e) =>
                          setNotesDraft((prev) => ({
                            ...prev,
                            [request.id]: e.target.value,
                          }))
                        }
                        placeholder="Add processing notes"
                        className="min-h-[60px]"
                      />
                    </TableCell>
                    <TableCell>
                      <Textarea
                        defaultValue={request.result_url ?? ""}
                        onChange={(e) =>
                          setResultDraft((prev) => ({
                            ...prev,
                            [request.id]: e.target.value,
                          }))
                        }
                        placeholder="Link to export or evidence"
                        className="min-h-[60px]"
                      />
                    </TableCell>
                    <TableCell className="space-y-2">
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={updatingId === request.id}
                          onClick={() => updateStatus(request.id, "processing")}
                        >
                          Start
                        </Button>
                        <Button
                          size="sm"
                          variant="default"
                          disabled={updatingId === request.id}
                          onClick={() =>
                            updateStatus(request.id, "completed", {
                              notes: notesDraft[request.id],
                              result_url: resultDraft[request.id],
                            })
                          }
                        >
                          Complete
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          disabled={updatingId === request.id}
                          onClick={() => updateStatus(request.id, "rejected", { notes: notesDraft[request.id] })}
                        >
                          Reject
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Processed: {request.processed_at ? format(new Date(request.processed_at), "PP p") : "—"}
                      </p>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
