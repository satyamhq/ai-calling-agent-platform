"use client";

import { useEffect, useState } from "react";
import { Bot, Settings } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Agent {
  id: string;
  name: string;
  description: string;
  voice_id: string;
  created_at: string;
}

export function AgentList() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const res = await fetch("/api/agents");
        if (res.ok) {
          const data = await res.json();
          setAgents(data.agents || []);
        }
      } catch (error) {
        console.error("Failed to fetch agents:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAgents();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <Card key={i} className="animate-pulse bg-muted/50 h-[250px] border-none" />
        ))}
      </div>
    );
  }

  if (agents.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center border border-dashed rounded-xl border-border bg-card/50 p-12">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
          <Bot className="w-8 h-8" />
        </div>
        <h3 className="font-serif text-2xl mb-2">No agents yet</h3>
        <p className="text-muted-foreground mb-6 max-w-sm mx-auto text-center">
          Create your first AI agent to start making automated calls.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {agents.map((agent) => (
        <Card key={agent.id} className="shadow-sm border-border hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-medium">{agent.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-1">{agent.description || "No description"}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Voice ID:</span>
              <Badge variant="secondary">{agent.voice_id}</Badge>
            </div>
          </CardContent>
          <CardFooter className="pt-2">
            <Button variant="outline" className="w-full">
              <Settings className="w-4 h-4 mr-2" />
              Manage Agent
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
