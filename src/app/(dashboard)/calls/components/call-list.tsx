"use client";

import { useEffect, useState } from "react";
import { PhoneCall, Search, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export function CallList() {
  const [calls, setCalls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    // For a real app, this would fetch from a GET /api/calls route
    // Since we didn't specify one in Phase 6, we will leave it empty as a placeholder
    setLoading(false);
  }, []);

  const filteredCalls = calls.filter(c => c.phone_number_to?.includes(search));

  if (loading) {
    return <Card className="animate-pulse bg-muted/50 h-[400px] border-none" />;
  }

  if (calls.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center border border-dashed rounded-xl border-border bg-card/50 p-12">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
          <PhoneCall className="w-8 h-8" />
        </div>
        <h3 className="font-serif text-2xl mb-2">No calls yet</h3>
        <p className="text-muted-foreground mb-6 max-w-sm mx-auto text-center">
          Start your first AI call or launch a campaign to see the call log.
        </p>
      </div>
    );
  }

  return (
    <Card className="shadow-sm border-border">
      <CardContent className="p-0">
        <div className="p-4 border-b border-border flex items-center gap-2">
          <Search className="w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search by phone number..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-none shadow-none focus-visible:ring-0 max-w-sm px-2"
          />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Phone Number</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Cost</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCalls.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                  No calls found.
                </TableCell>
              </TableRow>
            ) : (
              filteredCalls.map((call) => (
                <TableRow key={call.id}>
                  <TableCell className="font-medium">{call.phone_number_to}</TableCell>
                  <TableCell>
                    <Badge variant={call.status === "completed" ? "default" : "secondary"}>
                      {call.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{call.cost_credits} credits</TableCell>
                  <TableCell>{new Date(call.created_at).toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <Sheet>
                      <SheetTrigger render={<Button variant="ghost" size="sm" />}>Details</SheetTrigger>
                      <SheetContent className="w-[400px] sm:w-[540px]">
                        <SheetHeader>
                          <SheetTitle>Call Details</SheetTitle>
                          <SheetDescription>
                            {call.phone_number_to}
                          </SheetDescription>
                        </SheetHeader>
                        <div className="mt-6 space-y-6">
                          <div>
                            <h4 className="font-medium mb-2 flex items-center gap-2">
                              <FileText className="w-4 h-4" /> Summary
                            </h4>
                            <p className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg">
                              {call.summary || "No summary available yet."}
                            </p>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">Transcript</h4>
                            <div className="text-sm bg-muted/30 p-4 rounded-lg max-h-[300px] overflow-y-auto whitespace-pre-wrap">
                              {call.transcript || "No transcript available."}
                            </div>
                          </div>
                          {call.recording_url && (
                            <div>
                              <h4 className="font-medium mb-2">Recording</h4>
                              <audio controls src={call.recording_url} className="w-full" />
                            </div>
                          )}
                        </div>
                      </SheetContent>
                    </Sheet>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
