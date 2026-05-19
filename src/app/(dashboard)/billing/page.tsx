"use client";

import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { CreditCard, Check, Loader2 } from "lucide-react";
import { useUser } from "@/hooks/use-user";
import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const plans = [
  {
    name: "Starter",
    price: "$19",
    credits: 100,
    priceId: process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID,
    features: ["100 Call Credits", "1 AI Voice Agent", "Basic Analytics"],
  },
  {
    name: "Pro",
    price: "$49",
    credits: 500,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
    features: ["500 Call Credits", "Unlimited Agents", "CRM Integrations", "Webhooks"],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$149",
    credits: 2000,
    priceId: process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID,
    features: ["2000 Call Credits", "Custom Voice Cloning", "Priority Support"],
  }
];

export default function BillingPage() {
  const { profile } = useUser();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleUpgrade = async (plan: typeof plans[0]) => {
    setLoadingPlan(plan.name);
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId: plan.priceId, plan: plan.name.toLowerCase(), credits: plan.credits })
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Failed to initiate checkout");
      
      window.location.href = data.url;
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader 
        title="Billing & Credits" 
        description="Manage your plan and purchase call credits"
      />
      
      <div className="bg-card border border-border rounded-xl p-8 mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="font-serif text-3xl mb-2">Current Balance</h2>
          <p className="text-muted-foreground">
            You are currently on the <strong className="text-foreground capitalize">{profile?.plan || "free"}</strong> plan.
          </p>
        </div>
        <div className="text-center md:text-right">
          <div className="font-serif text-5xl italic text-primary mb-1">{profile?.credits_remaining || 0}</div>
          <div className="text-sm font-medium text-muted-foreground">Credits Remaining</div>
        </div>
      </div>

      <h2 className="font-serif text-3xl mb-8 text-center">Upgrade your plan</h2>
      
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        {plans.map((plan) => (
          <div key={plan.name} className={`p-8 rounded-3xl relative shadow-sm transition-all hover:shadow-md ${plan.popular ? "bg-primary text-primary-foreground shadow-xl scale-105" : "bg-card text-card-foreground border border-border"}`}>
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-background text-foreground px-4 py-1 rounded-full text-sm font-bold border border-border">
                Most Popular
              </div>
            )}
            <h3 className="font-serif text-2xl mb-2">{plan.name}</h3>
            <div className="mb-6">
              <span className="font-serif text-5xl">{plan.price}</span>
              <span className={plan.popular ? "text-primary-foreground/80" : "text-muted-foreground"}>/mo</span>
            </div>
            <ul className="space-y-4 mb-8">
              {plan.features.map(feature => (
                <li key={feature} className="flex items-center gap-3">
                  <Check className={`w-5 h-5 ${plan.popular ? "" : "text-primary"}`} /> {feature}
                </li>
              ))}
            </ul>
            <Button 
              className={`w-full h-12 text-lg rounded-xl ${plan.popular ? "bg-background text-foreground hover:bg-background/90" : ""}`}
              variant={plan.popular ? "default" : "outline"}
              onClick={() => handleUpgrade(plan)}
              disabled={!!loadingPlan}
            >
              {loadingPlan === plan.name && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {profile?.plan === plan.name.toLowerCase() ? "Current Plan" : `Select ${plan.name}`}
            </Button>
          </div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground h-24">
                  No transactions yet.
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
