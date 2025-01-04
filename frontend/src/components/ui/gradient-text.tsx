"use client";

import { cn } from "@/lib/utils";

export function GradientText({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "bg-gradient-to-r from-primary via-orange-200 to-primary-foreground bg-clip-text text-transparent animate-gradient",
        className,
      )}
    >
      {children}
    </span>
  );
}
