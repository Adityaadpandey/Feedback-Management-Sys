"use client";

import { Checkbox as CheckboxInput } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { QuestionProps } from "@/types/form";
import { motion } from "framer-motion";

export function Checkbox({ question, onChange, value = [] }: QuestionProps) {
  return (
    <div className="space-y-2">
      {question.options?.map((option, index) => (
        <motion.div
          key={option}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-accent/50 transition-colors">
            <CheckboxInput
              id={`${question._id}-${option}`}
              checked={value.includes(option)}
              onCheckedChange={(checked) => {
                const currentValues = value || [];
                if (checked) {
                  onChange(question._id, [...currentValues, option]);
                } else {
                  onChange(
                    question._id,
                    currentValues.filter((val: string) => val !== option),
                  );
                }
              }}
            />
            <Label htmlFor={`${question._id}-${option}`}>{option}</Label>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
