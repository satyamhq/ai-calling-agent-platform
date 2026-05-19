"use client";

import { PhoneCall, Coins, Target, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useUser } from "@/hooks/use-user";

export function StatsCards() {
  const { profile } = useUser();
  const credits = profile?.credits_remaining || 0;
  
  const stats = [
    { name: "Credits Remaining", value: credits, icon: Coins },
    { name: "Calls Today", value: "12", icon: PhoneCall },
    { name: "Success Rate", value: "68%", icon: Target },
    { name: "Avg Duration", value: "2m 14s", icon: Clock },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.name} className="shadow-sm border-border">
            <CardContent className="p-4 md:p-6 flex flex-col items-start">
              <div className="p-2 bg-primary/10 rounded-lg text-primary mb-4">
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-sm font-medium text-muted-foreground mb-1">{stat.name}</p>
              <h3 className="font-serif text-3xl italic">{stat.value}</h3>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
