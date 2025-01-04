"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FormProps } from "@/types/form";
import { QuestionWrapper } from "./QuestionWrapper";
import { ShortAnswer } from "./question-types/ShortAnswer";
import { Paragraph } from "./question-types/Paragraph";
import { MultipleChoice } from "./question-types/MultipleChoice";
import { DatePicker } from "./question-types/DatePicker";
import { Checkbox } from "./question-types/Checkbox";
import { Dropdown } from "./question-types/Dropdown";
import { FileUpload } from "./question-types/FileUpload";
import { TimePicker } from "./question-types/TimePicker";
import { Rating } from "./question-types/Rating";
import { LinearScale } from "./question-types/LinearScale";
import { Matrix } from "./question-types/Matrix";
import { motion } from "framer-motion";

export function DynamicForm({
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

  const renderQuestionType = (question: FormProps["questions"][0]) => {
    const props = {
      question,
      onChange: handleInputChange,
      value: responses[question._id],
    };

    switch (question.questionType) {
      case "short-answer":
        return <ShortAnswer {...props} />;
      case "paragraph":
        return <Paragraph {...props} />;
      case "multiple-choice":
        return <MultipleChoice {...props} />;
      case "date":
        return <DatePicker {...props} />;
      case "checkbox":
        return <Checkbox {...props} />;
      case "dropdown":
        return <Dropdown {...props} />;
      case "file-upload":
        return <FileUpload {...props} />;
      case "time":
        return <TimePicker {...props} />;
      case "rating":
        return <Rating {...props} />;
      case "linear-scale":
        return <LinearScale {...props} />;
      case "matrix":
        return <Matrix {...props} />;
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      {questions.map((question, index) => (
        <QuestionWrapper key={question._id} question={question}>
          {renderQuestionType(question)}
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
