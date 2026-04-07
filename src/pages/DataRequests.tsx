import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/auth-provider";
import { DataRequest } from "@/types";
import { format } from "date-fns";
import { FileDown, ShieldCheck, Clock } from "lucide-react";

type RequestType = "delete" | "export";

const REQUEST_OPTIONS: {
  value: RequestType;
  title: string;
  description: string;
}[] = [
  {
    value: "delete",
    title: "Delete my data",
    description:
      "Remove your account data and associated bookmarks. This action is irreversible after completion.",
  },
  {
    value: "export",
    title: "Export my data",
    description:
      "Receive a copy of your bookmarks and profile data in a portable format.",
  },
];

function statusBadgeClass(status: string) {
  switch (status) {
    case "completed":
      return "bg-emerald-100 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-100";
    case "processing":
      return "bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-100";
    case "rejected":
      return "bg-red-100 text-red-900 dark:bg-red-900/40 dark:text-red-100";
    default:
      return "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100";
  }
}

export function DataRequestsPage() {
  const { user } = useAuth();
  const [requestType, setRequestType] = useState<RequestType>("delete");
  const [details, setDetails] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [requests, setRequests] = useState<DataRequest[]>([]);

  const loadRequests = useCallback(async () => {
    if (!user) return;
    setLoadingRequests(true);

    const { data, error } = await supabase
      .from("data_requests")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Could not load your previous requests.");
    } else {
      setRequests(data || []);
    }

    setLoadingRequests(false);
  }, [user]);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const requestCopy = useMemo(() => {
    return REQUEST_OPTIONS.find((option) => option.value === requestType);
  }, [requestType]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) {
      toast.error("You need to be signed in to submit a request.");
      return;
    }

    if (!consent) {
      toast.error(
        "Please confirm you understand how we will process your request."
      );
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from("data_requests").insert({
        user_id: user.id,
        type: requestType,
        details: details.trim() || null,
      });

      if (error) throw error;

      setDetails("");
      setConsent(false);
      toast.success("Request received. We'll email you when it's processed.");
      loadRequests();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to submit your request right now.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 mb-5">
      <div>
        <h1 className="text-lg font-semibold md:text-2xl">Data Requests</h1>
        <p className="text-sm text-muted-foreground">
          Request a copy of your data or ask us to delete it. We will confirm by
          email when the request is handled.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[2fr_1fr] overflow-hidden">
        <Card>
          <CardHeader>
            <CardTitle>Submit a request</CardTitle>
            <CardDescription>
              Choose what you need and share any details that help us process it
              quickly.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="request-type">Request type</Label>
                <Select
                  value={requestType}
                  onValueChange={(value) =>
                    setRequestType(value as RequestType)
                  }
                >
                  <SelectTrigger id="request-type" className="w-full md:w-80">
                    <SelectValue placeholder="Select a request" />
                  </SelectTrigger>
                  <SelectContent>
                    {REQUEST_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {requestCopy && (
                  <p className="text-sm text-muted-foreground">
                    {requestCopy.description}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="details">Details (optional)</Label>
                  <Badge variant="secondary">Helps us respond faster</Badge>
                </div>
                <Textarea
                  id="details"
                  value={details}
                  onChange={(event) => setDetails(event.target.value)}
                  placeholder="Add context such as which bookmarks to delete or where to send your export."
                  className="min-h-[120px]"
                />
              </div>

              <div className="flex items-start space-x-3 rounded-md border p-3">
                <Checkbox
                  id="consent"
                  checked={consent}
                  onCheckedChange={(checked) => setConsent(checked === true)}
                  className="mt-0.5"
                />
                <div className="space-y-1 text-sm">
                  <Label htmlFor="consent" className="cursor-pointer">
                    I confirm I own this account and understand the request may
                    be irreversible.
                  </Label>
                  <p className="text-muted-foreground">
                    We may need to verify your identity or confirm via email
                    before we start processing.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Sending..." : "Send request"}
                </Button>
                <p className="text-sm text-muted-foreground">
                  Typical response time: under 72 hours.
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="bg-muted/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5" />
              How we handle requests
            </CardTitle>
            <CardDescription>What to expect after you submit.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div className="flex items-start gap-3">
              <FileDown className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">Exports</p>
                <p>
                  We prepare a JSON export of your profile and bookmarks and
                  share it securely.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">Deletions</p>
                <p>
                  We remove your account data from Supabase and storage after
                  verification.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">Status updates</p>
                <p>
                  Track progress below. We will also email you when we start and
                  finish.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="w-[90vw] md:w-auto overflow-x-hidden">
        <CardHeader>
          <CardTitle>Request history</CardTitle>
          <CardDescription>
            See the status of anything you have asked us to export or delete.
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-hidden">
          {loadingRequests ? (
            <p className="text-sm text-muted-foreground">
              Loading your requests...
            </p>
          ) : requests.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No requests yet. Submit one above to get started.
            </p>
          ) : (
            <div className="w-full overflow-hidden">
              <div className="overflow-x-auto">
                <Table className="w-[100vw] md:w-full table-fixed">
                  <TableHeader>
                    <TableRow className="table-row items-center justify-between">
                      <TableHead>Created</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="align-top">
                          <span className="block text-sm leading-tight">
                            {format(new Date(request.created_at), "PP p")}
                          </span>
                        </TableCell>
                        <TableCell className="capitalize align-top">
                          <span className="block text-sm leading-tight">
                            {request.type}
                          </span>
                        </TableCell>
                        <TableCell className="align-top">
                          <Badge className={statusBadgeClass(request.status)}>
                            {request.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-[360px] align-top">
                          {request.details ? (
                            <span className="text-sm text-foreground break-words leading-tight">
                              {request.details}
                            </span>
                          ) : (
                            <span className="text-sm text-muted-foreground leading-tight">
                              No extra details
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
