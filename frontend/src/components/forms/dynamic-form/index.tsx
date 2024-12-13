"use client";

import { FormData } from "@/types/form";
import { Card } from "@/components/ui/card";
import { Form } from "../form";
import { submitFormResponse } from "@/lib/api/forms";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface DynamicFormProps {
  formData: FormData;
}

export function DynamicForm({ formData }: DynamicFormProps) {
  const handleSubmit = async (responses: Record<string, any>) => {
    const formattedResponses = Object.entries(responses).map(([questionId, answer]) => ({
      questionId,
      answer,
    }));

    const payload = {
      formId: formData._id,
      responses: formattedResponses,
    };

    try {
      await submitFormResponse(payload);
      toast.success("Form submitted successfully!");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to submit the form"
      );
    }
  };

  return (
    <Card className="max-w-3xl mx-auto">
      <motion.div 
        className="p-6 rounded-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
          {formData.title}
        </h1>
        <p className="text-muted-foreground text-center mb-6">
          {formData.description}
        </p>

        <Form
          questions={formData.questions}
          onSubmit={handleSubmit}
          buttonText="Submit Form"
        />
      </motion.div>
    </Card>
  );
}