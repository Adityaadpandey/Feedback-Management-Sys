"use client";

import { useState } from "react";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { QuestionList } from "./question-list";
import { Toolbox } from "./toolbox";
import { AIFormGenerator } from "./ai-form-generator";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner";
import { FormQuestion } from "@/types/form";
import { useRouter } from "next/navigation";

interface DragQuestion extends FormQuestion {
  _id: string;
}

export function FormBuilder() {
    const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<DragQuestion[]>([]);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(questions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setQuestions(items);
  };

  const handleAddQuestion = (type: FormQuestion["questionType"]) => {
    const newQuestion: DragQuestion = {
      _id: `question-${Date.now()}`,
      questionType: type,
      questionText: "",
      options: ["multiple-choice", "checkbox", "dropdown", "matrix"].includes(type) ? [] : undefined,
      validations: { required: false }
    };
    setQuestions([...questions, newQuestion]);
  };

  const handleUpdateQuestion = (id: string, updates: Partial<FormQuestion>) => {
    setQuestions(questions.map(q => q._id === id ? { ...q, ...updates } : q));
  };

  const handleDeleteQuestion = (id: string) => {
    setQuestions(questions.filter(q => q._id !== id));
  };

  const handleFormGenerated = (formTitle: string, formDescription: string, generatedQuestions: FormQuestion[]) => {
    setTitle(formTitle);
    setDescription(formDescription);
    setQuestions(generatedQuestions.map(q => ({
      ...q,
      _id: `question-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    })));
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error("Please add a form title");
      return;
    }

    if (questions.length === 0) {
      toast.error("Please add at least one question");
      return;
    }

    try {
      // Format questions before sending to API
      const formattedQuestions = questions.map(({ _id, ...q }) => ({
        ...q,
        // For matrix questions, ensure options is an array of strings
        options: q.questionType === "matrix"
          ? q.options || []
          : q.options
      }));

       const response = await fetch("http://localhost:8080/v1/forms/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${localStorage.getItem("user")}`,
                },
                body: JSON.stringify({
                    title,
                    description,
                    questions: formattedQuestions
                })
            });
            if (!response.ok) throw new Error("Failed to create form");
            // toast.success("Form created successfully!");
            const data = await response.json();
            console.log(data);
            setTitle("");
            setQuestions([]);
            router.push(`/success/${data.form._id}`);

    } catch (error) {
      toast.error("Failed to create form");
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
          Form Builder
        </h1>

        <AIFormGenerator
          onFormGenerated={handleFormGenerated}
          className="mb-6"
        />

        <Input
          type="text"
          placeholder="Form Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mb-4"
        />

        <Textarea
          placeholder="Form Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mb-6"
        />

        <div className="grid md:grid-cols-[250px,1fr] gap-6">
          <Toolbox onAddQuestion={handleAddQuestion} />

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="questions">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-4"
                >
                  <QuestionList
                    questions={questions}
                    onUpdate={handleUpdateQuestion}
                    onDelete={handleDeleteQuestion}
                  />
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>

        <div className="mt-6">
          <Button onClick={handleSubmit} className="w-full">
            Create Form
          </Button>
        </div>
      </Card>
    </div>
  );
}
