"use client";

import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function ResponsesTimeline({ responses }: { responses: any[] }) {
  // Process responses data for the timeline
  const timelineData = responses.reduce((acc: any[], response) => {
    const date = new Date(response.submittedAt).toLocaleDateString();
    const existingDate = acc.find(item => item.date === date);

    if (existingDate) {
      existingDate.count += 1;
    } else {
      acc.push({ date, count: 1 });
    }

    return acc;
  }, []);

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Response Timeline</h2>
        <p className="text-sm text-muted-foreground">
          Number of responses over time
        </p>
      </div>
      <div className="h-[200px] mx-auto flex items-center justify-center">
        <ResponsiveContainer width="80%" height="100%">
          <LineChart data={timelineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="count"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
