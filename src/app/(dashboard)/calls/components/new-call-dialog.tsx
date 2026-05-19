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
import { PhoneCall, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  agent_id: z.string().min(1, "Agent is required"),
  phone_number: z.string().min(10, "Valid phone number required"),
});

export function NewCallDialog() {
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
      agent_id: "",
      phone_number: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch("/api/calls/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to initiate call");
      }

      toast.success("Call initiated successfully!");
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
          <PhoneCall className="w-4 h-4 mr-2" />
          Start a Call
        </Button>
      } />
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Make an AI Call</DialogTitle>
          <DialogDescription>Dispatch an agent to call a specific number instantly.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
            <FormField
              control={form.control}
              name="phone_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl><Input placeholder="+1234567890" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Call Now
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
