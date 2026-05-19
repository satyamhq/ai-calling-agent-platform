"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const data = [
  { name: "Mon", calls: 4 },
  { name: "Tue", calls: 7 },
  { name: "Wed", calls: 12 },
  { name: "Thu", calls: 8 },
  { name: "Fri", calls: 15 },
  { name: "Sat", calls: 2 },
  { name: "Sun", calls: 0 },
];

export function ActivityChart() {
  return (
    <Card className="h-full shadow-sm border-border">
      <CardHeader>
        <CardTitle className="font-serif text-xl font-normal">Activity overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis 
                dataKey="name" 
                stroke="#888888" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
              />
              <YAxis 
                stroke="#888888" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                tickFormatter={(value) => `${value}`} 
              />
              <Tooltip 
                cursor={{ fill: 'var(--accent)' }}
                contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--card)', color: 'var(--foreground)' }}
              />
              <Bar dataKey="calls" fill="var(--primary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
