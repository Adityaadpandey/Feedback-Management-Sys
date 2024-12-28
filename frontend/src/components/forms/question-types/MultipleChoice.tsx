"use client";

import { Label } from "@/components/ui/label";
import { QuestionProps } from "@/types/form";
import { motion } from "framer-motion";

export function MultipleChoice({ question, onChange }: QuestionProps) {
  return (
    <div className="space-y-2">
      {question.options?.map((option, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Label className="flex items-center space-x-2 p-2 rounded-lg hover:bg-accent/50 transition-colors">
            <input
              type="radio"
              name={`question-${question._id}`}
              value={option}
              className="form-radio text-primary"
              onChange={() => onChange(question._id, option)}
            />
            <span className="text-foreground">{option}</span>
          </Label>
        </motion.div>
      ))}
    </div>
  );
}
