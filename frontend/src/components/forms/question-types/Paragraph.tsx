"use client";

import { cn } from "@/lib/utils";
import { QuestionProps } from "@/types/form";

export function Paragraph({ question, onChange }: QuestionProps) {
  return (
    <textarea
      className={cn(
        "w-full p-2 border rounded-md",
        "focus:ring-2 focus:ring-primary",
        "bg-background text-foreground",
      )}
      placeholder="Type your response here..."
      rows={4}
      onChange={(e) => onChange(question._id, e.target.value)}
    />
  );
}
