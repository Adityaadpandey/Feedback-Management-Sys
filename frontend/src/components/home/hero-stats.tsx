"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Activity, MessageSquare, Users } from "lucide-react";
import { Spotlight } from "@/components/ui/spotlight";

const stats = [
  {
    icon: Users,
    title: "Active Users",
    value: "10K+",
    description: "Trust our platform",
  },
  {
    icon: MessageSquare,
    title: "Feedback Collected",
    value: "50K+",
    description: "And growing daily",
  },
  {
    icon: Activity,
    title: "Response Rate",
    value: "98%",
    description: "Customer satisfaction",
  },
];

export function HeroStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 w-full">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="relative overflow-hidden rounded-lg">
            <Spotlight>
              <Card
                className={cn(
                  "relative p-6",
                  "border border-border/50 hover:border-primary/50 transition-all duration-300",
                  "bg-background/95 backdrop-blur-xl"
                )}
              >
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground font-medium">
                      {stat.title}
                    </p>
                  </div>
                  <p className="text-3xl font-bold mb-1">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">
                    {stat.description}
                  </p>
                </div>
              </Card>
            </Spotlight>
          </div>
        );
      })}
    </div>
  );
}