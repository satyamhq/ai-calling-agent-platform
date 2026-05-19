"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  name: z.string().min(2, "Campaign name is required"),
  agent_id: z.string().min(1, "Agent is required"),
});

export function NewCampaignDialog() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [agents, setAgents] = useState<{id: string, name: string}[]>([]);
  
  useEffect(() => {
    if (open) {
      fetch("/api/agents")
        .then(res => res.json())
        .then(data => setAgents(data.agents || []))
        .catch(console.error);
    }
  }, [open]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      agent_id: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          agent_id: values.agent_id,
          status: "draft",
        }),
      });
      
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to create campaign");
      }

      toast.success("Campaign created successfully!");
      setOpen(false);
      form.reset();
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Campaign
        </Button>
      } />
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Campaign</DialogTitle>
          <DialogDescription>Setup a new automated outbound calling campaign.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Campaign Name</FormLabel>
                  <FormControl><Input placeholder="Q3 Outreach" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="agent_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>AI Agent</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an agent" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {agents.length === 0 ? (
                        <SelectItem value="empty" disabled>No agents found</SelectItem>
                      ) : (
                        agents.map((agent) => (
                          <SelectItem key={agent.id} value={agent.id}>{agent.name}</SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="pt-4">
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Campaign
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
