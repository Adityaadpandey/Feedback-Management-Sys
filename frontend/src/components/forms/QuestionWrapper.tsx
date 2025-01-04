"use client";

import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { FormQuestion } from "@/types/form";
import { motion } from "framer-motion";

interface QuestionWrapperProps {
  question: FormQuestion;
  children: React.ReactNode;
}

export function QuestionWrapper({ question, children }: QuestionWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-6 hover:shadow-lg transition-shadow duration-300 border-2">
        <Label className="block text-lg font-semibold mb-4 text-foreground">
          {question.questionText}
        </Label>
        {children}
      </Card>
    </motion.div>
  );
}
