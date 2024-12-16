"use client";

import { Card } from "@/components/ui/card";
import { Users, Clock, BarChart } from "lucide-react";

export function AnalyticsOverview({ analytics }: { analytics: any }) {
  const stats = [
    {
      label: "Total Responses",
      value: analytics.length,
      icon: Users,
      description: "Total number of form submissions",
    },
    {
      label: "Last Response",
      value: new Date(analytics.lastResponseAt).toLocaleDateString(),
      icon: Clock,
      description: "Most recent submission",
    },
    {
      label: "Response Rate",
      value: "100%",
      icon: BarChart,
      description: "Form completion rate",
    },
  ];
    // console.log(analytics);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </p>
                <h3 className="text-2xl font-bold">{stat.value}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
