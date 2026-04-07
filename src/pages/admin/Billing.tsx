import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, CreditCard } from "lucide-react";
import { PLANS, getSubscriptionStats } from "@/lib/data/admin/billing";
import { Skeleton } from "@/components/ui/skeleton";

export function BillingPage() {
  const [stats, setStats] = useState<{ free: number; pro: number; total: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSubscriptionStats().then((data) => {
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
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Plans & Billing</h1>
        <p className="text-muted-foreground">
          Manage subscription plans and billing information
        </p>
      </div>

      {stats && (
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Free Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.free}</div>
              <p className="text-sm text-muted-foreground mt-2">
                {((stats.free / stats.total) * 100).toFixed(1)}% of users
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5" />
                Pro Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.pro}</div>
              <p className="text-sm text-muted-foreground mt-2">
                {((stats.pro / stats.total) * 100).toFixed(1)}% of users
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {PLANS.map((plan) => (
          <Card key={plan.id} className={plan.name === "pro" ? "border-primary" : ""}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">{plan.name.toUpperCase()}</CardTitle>
                {plan.name === "pro" && (
                  <Badge variant="default">
                    <Crown className="h-3 w-3 mr-1" />
                    Popular
                  </Badge>
                )}
              </div>
              <div className="mt-2">
                <span className="text-3xl font-bold">${plan.price}</span>
                {plan.price > 0 && (
                  <span className="text-muted-foreground">/month</span>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className="w-full"
                variant={plan.name === "pro" ? "default" : "outline"}
              >
                {plan.price === 0 ? "Current Plan" : "Upgrade"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
