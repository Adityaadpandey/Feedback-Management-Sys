"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlanFeature {
  text: string;
  included: boolean;
}

export function PlanFeatures({ features }: { features: PlanFeature[] }) {
  return (
    <ul className="space-y-3">
      {features.map((feature, i) => (
        <li key={i} className="flex items-center text-sm">
          <span
            className={cn(
              "mr-2 flex h-5 w-5 items-center justify-center rounded-full",
              feature.included
                ? "bg-primary/10 text-primary dark:bg-primary/20"
                : "bg-muted text-muted-foreground",
            )}
          >
            <Check className="h-3.5 w-3.5" />
          </span>
          <span
            className={cn(
              feature.included ? "text-foreground" : "text-muted-foreground",
            )}
          >
            {feature.text}
          </span>
        </li>
      ))}
    </ul>
  );
}
