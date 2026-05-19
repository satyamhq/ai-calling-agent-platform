"use client";

import { AlertTriangle, AlertCircle, Info } from "lucide-react";
import { useUser } from "@/hooks/use-user";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function CreditsBanner() {
  const { profile } = useUser();
  if (!profile) return null;

  const credits = profile.credits_remaining;
  const isFree = profile.plan === "free";

  if (credits === 0) {
    return (
      <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3 text-destructive">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <div>
            <h4 className="font-medium">Out of credits</h4>
            <p className="text-sm opacity-90">Upgrade to continue making calls</p>
          </div>
        </div>
        <Link href="/billing">
          <Button variant="destructive" size="sm">Upgrade Now</Button>
        </Link>
      </div>
    );
  }

  if (credits <= 3) {
    return (
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3 text-amber-600 dark:text-amber-500">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <div>
            <h4 className="font-medium">Running low on credits</h4>
            <p className="text-sm opacity-90">Only {credits} calls left — upgrade for uninterrupted calling</p>
          </div>
        </div>
        <Link href="/billing">
          <Button variant="outline" size="sm" className="border-amber-500/50 hover:bg-amber-500/10">Upgrade</Button>
        </Link>
      </div>
    );
  }

  if (isFree && credits > 3) {
    return (
      <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 flex items-center gap-3 mb-8 text-primary">
        <Info className="w-5 h-5 shrink-0" />
        <p className="text-sm font-medium">{credits} free calls included with your account</p>
      </div>
    );
  }

  return null;
}
