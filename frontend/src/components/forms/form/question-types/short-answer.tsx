"use client";

import { Input } from "@/components/ui/input";
import { QuestionProps } from "@/types/form";

export function ShortAnswer({ question, onChange, value }: QuestionProps) {
  return (
    <Input
      type="text"
      value={value}
      placeholder="Type your answer"
      className="w-full"
      onChange={(e) => onChange(question._id, e.target.value)}
    />
  );
}