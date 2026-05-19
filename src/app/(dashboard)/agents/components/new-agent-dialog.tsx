"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  voice_id: z.string().min(1, "Voice is required"),
  system_prompt: z.string().min(10, "Provide a more detailed prompt"),
  first_message: z.string().min(2, "First message is required"),
});

export function NewAgentDialog() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      voice_id: "jennifer",
      system_prompt: "You are a helpful AI assistant calling on behalf of Callify.",
      first_message: "Hello, this is Jennifer. How can I help you today?",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to create agent");
      }

      toast.success("Agent created successfully!");
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
          New Agent
        </Button>
      } />
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Agent</DialogTitle>
          <DialogDescription>Configure your AI caller's voice and personality.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Agent Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Sales Representative" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Handles outbound sales calls" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="voice_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Voice ID</FormLabel>
                  <FormControl>
                    <Input placeholder="jennifer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="system_prompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>System Prompt</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="You are a helpful AI assistant..." 
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="first_message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Message</FormLabel>
                  <FormControl>
                    <Input placeholder="Hello, is this [Name]?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Agent
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
