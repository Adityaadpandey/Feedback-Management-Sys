"use client";

import { useAlert } from "@/hooks/alert-provider";
import { generateForm } from "@/lib/gemini/client";
import { FormQuestion } from "@/types/form";
import { Wand2 } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Textarea } from "../ui/textarea";

interface AIFormGeneratorProps {
    onFormGenerated: (title: string, description: string, questions: FormQuestion[]) => void;
    className?: string;
}

export function AIFormGenerator({ onFormGenerated, className }: AIFormGeneratorProps) {
    const { showAlert } = useAlert();
    const [prompt, setPrompt] = useState("");
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            showAlert(
                "Error!",
                "Please enter a description of the form you want to create",
                "error",
            )

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
            showAlert(
                "Success!",
                "Form generated successfully!",
                "success",
            );
            setPrompt("");
        } catch {
            showAlert(
                "Error!",
                "Failed to generate form. Please try again.",
                "error",
            );

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
