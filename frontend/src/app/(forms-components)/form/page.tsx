"use client";

import { DynamicForm } from "@/components/forms/DynamicForm";

const sampleQuestions = [
  {
    _id: "q1",
    questionText: "What is your name?",
    questionType: "short-answer" as const,
  },
  {
    _id: "q2",
    questionText: "Tell us about yourself",
    questionType: "paragraph" as const,
  },
  {
    _id: "q3",
    questionText: "What is your preferred contact method?",
    questionType: "multiple-choice" as const,
    options: ["Email", "Phone", "Text", "Social Media"],
  },
  {
    _id: "q4",
    questionText: "When would you like to schedule your appointment?",
    questionType: "date" as const,
  },
  {
    _id: "q5",
    questionText: "Which services are you interested in?",
    questionType: "checkbox" as const,
    options: ["Consulting", "Development", "Design", "Marketing"],
  },
  {
    _id: "q6",
    questionText: "Select your preferred package",
    questionType: "dropdown" as const,
    options: ["Basic", "Professional", "Enterprise"],
  },
  {
    _id: "q7",
    questionText: "Upload your project requirements",
    questionType: "file-upload" as const,
  },
  {
    _id: "q8",
    questionText: "Preferred meeting time",
    questionType: "time" as const,
  },
  {
    _id: "q9",
    questionText: "Rate our service",
    questionType: "rating" as const,
  },
  {
    _id: "q10",
    questionText: "How likely are you to recommend us?",
    questionType: "linear-scale" as const,
  },
  {
    _id: "q11",
    questionText: "Rate our features",
    questionType: "matrix" as const,
    options: ["Ease of Use", "Performance", "Support", "Value for Money"],
  },
];

export default function FormPage() {
  const handleSubmit = (responses: Record<string, any>) => {
    console.log("Form responses:", responses);
    // Handle form submission
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
          Dynamic Form Example
        </h1>
        <p className="text-muted-foreground mt-2">
          Please fill out the form below
        </p>
      </div>
      
      <DynamicForm
        questions={sampleQuestions}
        onSubmit={handleSubmit}
        buttonText="Submit Form"
      />
    </div>
  );
}