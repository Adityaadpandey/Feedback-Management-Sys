"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { QuestionProps } from "@/types/form";
import { motion } from "framer-motion";

export function MultipleChoice({ question, onChange, value }: QuestionProps) {
  return (
    <RadioGroup
      value={value}
      onValueChange={(val) => onChange(question._id, val)}
      className="space-y-2"
    >
      {question.options?.map((option, index) => (
        <motion.div
          key={option}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-accent/50 transition-colors">
            <RadioGroupItem value={option} id={`${question._id}-${option}`} />
            <Label htmlFor={`${question._id}-${option}`}>{option}</Label>
          </div>
        </motion.div>
      ))}
    </RadioGroup>
  );
}