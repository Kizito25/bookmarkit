import { supabase } from "@/lib/supabase";
import { Plan } from "./types";

export const PLANS: Plan[] = [
  {
    id: "free",
    name: "free",
    price: 0,
    features: [
      "Unlimited bookmarks",
      "Basic tagging",
      "Search and filter",
      "Mobile access",
    ],
  },
  {
    id: "pro",
    name: "pro",
    price: 9.99,
    features: [
      "Everything in Free",
      "Advanced analytics",
      "Priority support",
      "Export data",
      "Custom themes",
      "API access",
    ],
  },
];

export async function getUserPlan(userId: string): Promise<"free" | "pro"> {
  const { data } = await (supabase as any)
    .from("profiles")
    .select("plan")
    .eq("id", userId)
    .single();

  return (data?.plan as "free" | "pro") || "free";
}

export async function updateUserPlan(userId: string, plan: "free" | "pro") {
  const { error } = await (supabase as any)
    .from("profiles")
    .update({ plan })
    .eq("id", userId);

  if (error) throw error;
  return true;
}

export async function getSubscriptionStats() {
  const { count: freeUsers } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("plan", "free");

  const { count: proUsers } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("plan", "pro");

  return {
    free: freeUsers || 0,
    pro: proUsers || 0,
    total: (freeUsers || 0) + (proUsers || 0),
  };
}
