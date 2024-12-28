"use client";

import { Input } from "@/components/ui/input";
import { QuestionProps } from "@/types/form";

export function ShortAnswer({ question, onChange }: QuestionProps) {
  return (
    <Input
      type="text"
      placeholder="Type your answer"
      className="w-full border rounded-md p-2"
      onChange={(e) => onChange(question._id, e.target.value)}
    />
  );
}
