import { useState } from "react";
import { FormQuestion } from "@/types/form";
import { DropResult } from "react-beautiful-dnd";

interface DragQuestion extends FormQuestion {
  _id: string;
}

export function useFormState() {
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState<DragQuestion[]>([]);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(questions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setQuestions(items);
  };

  const addQuestion = (type: FormQuestion["questionType"]) => {
    const newQuestion: DragQuestion = {
      _id: `question-${Date.now()}`,
      questionType: type,
      questionText: "",
      options: ["multiple-choice", "checkbox", "dropdown"].includes(type) ? [] : undefined,
      validations: { required: false }
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (id: string, updates: Partial<FormQuestion>) => {
    setQuestions(questions.map(q => q._id === id ? { ...q, ...updates } : q));
  };

  const deleteQuestion = (id: string) => {
    setQuestions(questions.filter(q => q._id !== id));
  };

  const setFormContent = (formTitle: string, generatedQuestions: FormQuestion[]) => {
    setTitle(formTitle);
    setQuestions(generatedQuestions.map(q => ({
      ...q,
      _id: `question-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    })));
  };

  return {
    title,
    setTitle,
    questions,
    handleDragEnd,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    setFormContent
  };
}