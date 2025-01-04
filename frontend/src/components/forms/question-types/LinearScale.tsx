"use client";

import { Slider } from "@/components/ui/slider";
import { QuestionProps } from "@/types/form";

export function LinearScale({ question, onChange, value = 5 }: QuestionProps) {
  return (
    <div className="space-y-4">
      <Slider
        value={[value]}
        min={0}
        max={10}
        step={1}
        onValueChange={(vals) => onChange(question._id, vals[0])}
        className="py-4"
      />
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>0</span>
        <span>5</span>
        <span>10</span>
      </div>
    </div>
  );
}
