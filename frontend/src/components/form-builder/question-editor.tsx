"use client";

import { useState } from "react";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Grip, Trash, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { FormQuestion } from "@/types/form";
import { DraggableProvidedDragHandleProps } from "react-beautiful-dnd";
import { QuestionPreview } from "./question-preview";
import { QuestionTypeSelector } from "./question-type-selector";

interface QuestionEditorProps {
  question: FormQuestion;
  dragHandleProps: DraggableProvidedDragHandleProps | null;
  onUpdate: (updates: Partial<FormQuestion>) => void;
  onDelete: () => void;
}

export function QuestionEditor({
  question,
  dragHandleProps,
  onUpdate,
  onDelete,
}: QuestionEditorProps) {
  const [showPreview, setShowPreview] = useState(false);

  const handleAddOption = () => {
    const options = [
      ...(question.options || []),
      question.questionType === "matrix" ? "" : "",
    ];
    onUpdate({ options });
  };

  const handleUpdateOption = (index: number, value: string) => {
    const options = [...(question.options || [])];
    options[index] = value;
    onUpdate({ options });
  };

  const handleDeleteOption = (index: number) => {
    const options = question.options?.filter((_, i) => i !== index);
    onUpdate({ options });
  };

  return (
    <Card className="p-4 mb-4 relative group">
      <div className="flex items-center gap-4 mb-4">
        <div {...dragHandleProps} className="cursor-move">
          <Grip className="h-5 w-5 text-muted-foreground" />
        </div>

        <Input
          value={question.questionText}
          onChange={(e) => onUpdate({ questionText: e.target.value })}
          placeholder="Question text"
          className="flex-1"
        />

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowPreview(!showPreview)}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        >
          {showPreview ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={onDelete}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>

      <div className="ml-9">
        <QuestionTypeSelector
          currentType={question.questionType}
          onTypeChange={(type) => onUpdate({ questionType: type })}
        />

        {showPreview ? (
          <div className="mt-4 border rounded-lg p-4 bg-background/50">
            <QuestionPreview
              question={question}
              onChange={() => {}} // Preview only
            />
          </div>
        ) : question.questionType === "matrix" ? (
          <div className="mt-4 space-y-2">
            {question.options?.map((option, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2"
              >
                <Input
                  value={option}
                  onChange={(e) => handleUpdateOption(index, e.target.value)}
                  placeholder={`Row ${index + 1}`}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteOption(index)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </motion.div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddOption}
              className="mt-2"
            >
              Add Row
            </Button>
          </div>
        ) : (
          ["multiple-choice", "checkbox", "dropdown"].includes(
            question.questionType,
          ) && (
            <div className="mt-4 space-y-2">
              {question.options?.map((option, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2"
                >
                  <Input
                    value={option}
                    onChange={(e) => handleUpdateOption(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteOption(index)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </motion.div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddOption}
                className="mt-2"
              >
                Add Option
              </Button>
            </div>
          )
        )}
      </div>
    </Card>
  );
}
