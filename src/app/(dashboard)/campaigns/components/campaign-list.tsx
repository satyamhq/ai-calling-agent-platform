"use client";

import { useEffect, useState } from "react";
import { Megaphone, Play, Pause, MoreVertical } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface Campaign {
  id: string;
  name: string;
  status: string;
  created_at: string;
}

export function CampaignList() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await fetch("/api/campaigns");
        if (res.ok) {
          const data = await res.json();
          setCampaigns(data.campaigns || []);
        }
      } catch (error) {
        console.error("Failed to fetch campaigns:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2].map(i => (
          <Card key={i} className="animate-pulse bg-muted/50 h-[250px] border-none" />
        ))}
      </div>
    );
  }

  if (campaigns.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center border border-dashed rounded-xl border-border bg-card/50 p-12">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
          <Megaphone className="w-8 h-8" />
        </div>
        <h3 className="font-serif text-2xl mb-2">No active campaigns</h3>
        <p className="text-muted-foreground mb-6 max-w-sm mx-auto text-center">
          Select an agent and a list of contacts to launch your first automated calling campaign.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {campaigns.map((campaign) => (
        <Card key={campaign.id} className="shadow-sm border-border flex flex-col">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <div>
              <h3 className="font-serif text-xl font-medium">{campaign.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Started {new Date(campaign.created_at).toLocaleDateString()}
              </p>
            </div>
            <Badge variant={campaign.status === "active" ? "default" : "secondary"} className="capitalize">
              {campaign.status}
            </Badge>
          </CardHeader>
          <CardContent className="pt-4 flex-1">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">0 / 0 calls</span>
                </div>
                <Progress value={0} className="h-2" />
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm pt-2">
                <div>
                  <div className="text-muted-foreground">Success</div>
                  <div className="font-medium text-green-600 dark:text-green-400">0</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Failed/Voicemail</div>
                  <div className="font-medium text-destructive">0</div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-4 border-t border-border flex justify-between bg-muted/20">
            {campaign.status === "active" ? (
              <Button variant="outline" size="sm" className="w-full mr-2 text-amber-600 hover:text-amber-700">
                <Pause className="w-4 h-4 mr-2" /> Pause
              </Button>
            ) : (
              <Button variant="outline" size="sm" className="w-full mr-2">
                <Play className="w-4 h-4 mr-2" /> Resume
              </Button>
            )}
            <Button variant="ghost" size="icon" className="shrink-0">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
