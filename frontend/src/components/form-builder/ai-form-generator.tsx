"use client";

import { useAlert } from "@/hooks/alert-provider";
import { generateForm } from "@/lib/gemini/client";
import { FormQuestion } from "@/types/form";
import { Wand2, Lock } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Textarea } from "../ui/textarea";
import { useRole } from "@/hooks/role-provider";

interface AIFormGeneratorProps {
    onFormGenerated: (title: string, description: string, questions: FormQuestion[]) => void;
    className?: string;
}

export function AIFormGenerator({ onFormGenerated, className }: AIFormGeneratorProps) {
    const { role, aiGenerationLimit } = useRole();
    const { showAlert } = useAlert();
    const [prompt, setPrompt] = useState("");
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            showAlert(
                "Error!",
                "Please enter a description of the form you want to create",
                "error"
            );
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
            showAlert("Success!", "Form generated successfully!", "success");
            setPrompt("");
        } catch {
            showAlert("Error!", "Failed to generate form. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className={className}>
            <div className="space-y-4 p-4">
                <h2 className="font-semibold text-lg">AI Form Generator</h2>

                {/* Conditional rendering based on role and AI generation limit */}
                {role === "admin" && aiGenerationLimit && aiGenerationLimit > 0 ? (
                    <>
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
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center space-y-4 text-center">
                        <Lock className="h-12 w-12 text-gray-500" />
                        <p className="text-xl font-semibold text-gray-600">Upgrade Your Plan</p>
                            <p className="text-sm text-gray-400">You need to upgrade your subscription plan to generate AI forms.</p>
                            {/* TODO: add the uprade now thing */}
                        <Button
                            onClick={() => showAlert("Info", "Please upgrade your plan to access this feature.", "info")}
                            className="mt-4 w-full"
                        >
                            Upgrade Now
                        </Button>
                    </div>
                )}
            </div>
        </Card>
    );
}
