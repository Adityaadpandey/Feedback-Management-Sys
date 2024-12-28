"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FormProps } from "@/types/form";
import { QuestionWrapper } from "./question-wrapper";
import { renderQuestionType } from "./question-renderer";
import { motion } from "framer-motion";

export function Form({
  questions,
  onSubmit,
  buttonText = "Submit",
}: FormProps) {
  const [responses, setResponses] = useState<Record<string, any>>({});

  const handleInputChange = (id: string, value: any) => {
    setResponses((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(responses);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      {questions.map((question, index) => (
        <QuestionWrapper key={question._id} question={question}>
          {renderQuestionType({
            question,
            onChange: handleInputChange,
            value: responses[question._id],
          })}
        </QuestionWrapper>
      ))}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Button type="submit" className="w-full">
          {buttonText}
        </Button>
      </motion.div>
    </form>
  );
}
