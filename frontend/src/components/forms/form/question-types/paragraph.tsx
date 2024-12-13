"use client";

import { Textarea } from "@/components/ui/textarea";
import { QuestionProps } from "@/types/form";

export function Paragraph({ question, onChange, value }: QuestionProps) {
  return (
    <Textarea
      value={value}
      placeholder="Type your response here..."
      className="min-h-[100px]"
      onChange={(e) => onChange(question._id, e.target.value)}
    />
  );
}