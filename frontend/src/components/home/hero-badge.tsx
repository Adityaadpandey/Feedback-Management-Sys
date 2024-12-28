"use client";

import { cn } from "@/lib/utils";
import { MessageSquare } from "lucide-react";

export function HeroBadge() {
  return (
    <div
      className={cn(
        "inline-flex items-center justify-center px-4 py-2 rounded-full",
        "bg-secondary/50 backdrop-blur-sm border border-primary/20",
        "transition-all duration-300 hover:border-primary/40",
        "animate-fade-in",
      )}
    >
      <MessageSquare className="w-4 h-4 text-primary mr-2" />
      <span className="text-sm font-medium">Feedback that matters</span>
    </div>
  );
}
