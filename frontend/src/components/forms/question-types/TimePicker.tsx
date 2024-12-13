"use client";

import { Input } from "@/components/ui/input";
import { QuestionProps } from "@/types/form";
import { Clock } from "lucide-react";

export function TimePicker({ question, onChange, value }: QuestionProps) {
  return (
    <div className="relative">
      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="time"
        value={value}
        className="pl-10"
        onChange={(e) => onChange(question._id, e.target.value)}
      />
    </div>
  );
}