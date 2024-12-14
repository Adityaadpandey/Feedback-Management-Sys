"use client";

import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
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
import { motion } from "framer-motion";
import { FormQuestion } from "@/types/form";

interface ToolboxProps {
  onAddQuestion: (type: FormQuestion["questionType"]) => void;
}

const questionTypes = [
  { type: "short-answer" as const, icon: Type, label: "Short Answer" },
  { type: "paragraph" as const, icon: AlignLeft, label: "Paragraph" },
  { type: "multiple-choice" as const, icon: List, label: "Multiple Choice" },
  { type: "checkbox" as const, icon: CheckSquare, label: "Checkbox" },
  { type: "dropdown" as const, icon: ChevronDown, label: "Dropdown" },
  { type: "file-upload" as const, icon: Upload, label: "File Upload" },
  { type: "date" as const, icon: Calendar, label: "Date" },
  { type: "time" as const, icon: Clock, label: "Time" },
  { type: "rating" as const, icon: Star, label: "Rating" },
  { type: "linear-scale" as const, icon: LineChart, label: "Linear Scale" },
  { type: "matrix" as const, icon: Grid, label: "Matrix" }
];

export function Toolbox({ onAddQuestion }: ToolboxProps) {
  return (
    <Card className="p-4">
      <h2 className="font-semibold mb-4">Question Types</h2>
      <ScrollArea className="h-[calc(100vh-300px)]">
        <div className="space-y-2">
          {questionTypes.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.type}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => onAddQuestion(item.type)}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Button>
              </motion.div>
            );
          })}
        </div>
      </ScrollArea>
    </Card>
  );
}