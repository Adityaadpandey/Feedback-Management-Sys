"use client";

import { FormQuestion } from "@/types/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Type,
  AlignLeft,
  List,
  CheckSquare,
  ChevronDown,
  Upload,
  Calendar,
  Clock,
  Star,
  LineChart,
  Grid
} from "lucide-react";

interface QuestionTypeSelectorProps {
  currentType: FormQuestion["questionType"];
  onTypeChange: (type: FormQuestion["questionType"]) => void;
}

const questionTypes = [
  { value: "short-answer", label: "Short Answer", icon: Type },
  { value: "paragraph", label: "Paragraph", icon: AlignLeft },
  { value: "multiple-choice", label: "Multiple Choice", icon: List },
  { value: "checkbox", label: "Checkbox", icon: CheckSquare },
  { value: "dropdown", label: "Dropdown", icon: ChevronDown },
  { value: "file-upload", label: "File Upload", icon: Upload },
  { value: "date", label: "Date", icon: Calendar },
  { value: "time", label: "Time", icon: Clock },
  { value: "rating", label: "Rating", icon: Star },
  { value: "linear-scale", label: "Linear Scale", icon: LineChart },
  { value: "matrix", label: "Matrix", icon: Grid }
] as const;

export function QuestionTypeSelector({ currentType, onTypeChange }: QuestionTypeSelectorProps) {
  return (
    <Select value={currentType} onValueChange={onTypeChange}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select question type" />
      </SelectTrigger>
      <SelectContent>
        {questionTypes.map(({ value, label, icon: Icon }) => (
          <SelectItem key={value} value={value}>
            <div className="flex items-center gap-2">
              <Icon className="h-4 w-4" />
              {label}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}