"use client";

import { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Wand2 } from "lucide-react";
import { toast } from "sonner";
import { generateForm } from "@/lib/gemini/client";
import { FormQuestion } from "@/types/form";

interface AIFormGeneratorProps {
  onFormGenerated: (title: string, description: string, questions: FormQuestion[]) => void;
  className?: string;
}

export function AIFormGenerator({ onFormGenerated, className }: AIFormGeneratorProps) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a description of the form you want to create");
      return;
    }

    setLoading(true);
    try {
      const formData = await generateForm(prompt);
      
      const questions: FormQuestion[] = formData.questions.map((q, index) => ({
        _id: `question-${Date.now()}-${index}`,
        questionText: q.questionText,
        questionType: q.questionType as FormQuestion["questionType"],
        options: q.options,
        validations: { required: false }
      }));

      onFormGenerated(formData.title, formData.description || "", questions);
      toast.success("Form generated successfully!");
      setPrompt("");
    } catch (error) {
      toast.error("Failed to generate form. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className={className}>
      <div className="space-y-4 p-4">
        <h2 className="font-semibold text-lg">AI Form Generator</h2>
        <Textarea
          placeholder="Describe the form you want to create... (e.g., 'Create a customer feedback form for a new product launch')"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="min-h-[100px] resize-none"
        />
        <Button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full"
        >
          <Wand2 className="mr-2 h-4 w-4" />
          {loading ? "Generating..." : "Generate Form"}
        </Button>
      </div>
    </Card>
  );
}