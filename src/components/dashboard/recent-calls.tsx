"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const recentCalls = [
  { id: 1, contact: "John Smith", agent: "Sales Rep", status: "completed", duration: "1m 45s", date: "Today, 10:23 AM" },
  { id: 2, contact: "Sarah Connor", agent: "Support", status: "no-answer", duration: "0s", date: "Today, 09:15 AM" },
  { id: 3, contact: "Michael Scott", agent: "Sales Rep", status: "completed", duration: "4m 12s", date: "Yesterday" },
  { id: 4, contact: "Dwight Schrute", agent: "Sales Rep", status: "failed", duration: "12s", date: "Yesterday" },
];

export function RecentCalls() {
  return (
    <Card className="h-full shadow-sm border-border">
      <CardHeader>
        <CardTitle className="font-serif text-xl font-normal">Recent calls</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Contact</TableHead>
              <TableHead>Agent</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Duration</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentCalls.map((call) => (
              <TableRow key={call.id}>
                <TableCell className="font-medium">{call.contact}</TableCell>
                <TableCell>{call.agent}</TableCell>
                <TableCell>
                  <Badge variant={call.status === "completed" ? "default" : call.status === "failed" ? "destructive" : "secondary"}>
                    {call.status}
                  </Badge>
                </TableCell>
                <TableCell>{call.duration}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
