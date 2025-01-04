"use client";

import { Card } from "@/components/ui/card";
import { submitFormResponse } from "@/lib/api/forms";
import { FormData } from "@/types/form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Form } from "../form";
import { useAlert } from "@/hooks/alert-provider";

interface DynamicFormProps {
  formData: FormData;
}

export function DynamicForm({ formData }: DynamicFormProps) {
  const { showAlert } = useAlert();

  const router = useRouter();
  const handleSubmit = async (responses: Record<string, any>) => {
    const formattedResponses = Object.entries(responses).map(
      ([questionId, answer]) => ({
        questionId,
        answer,
      }),
    );

    const payload = {
      formId: formData._id,
      responses: formattedResponses,
    };

    try {
      await submitFormResponse(payload);
      router.push(`/form/success`);
    } catch {
      showAlert("Error!", "Failed to submit the form", "error");
    }
  };

  if (!formData) {
    return (
      <p className="text-center text-muted-foreground">Loading form data...</p>
    );
  }

  return (
    <Card>
      <div className="p-4 sm:p-2 rounded-lg shadow-lg max-w-full sm:max-w-3xl mx-auto bg-dot-thick-transparent w-full sm:w-[700px] ">
        <h1 className="text-xl sm:text-2xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
          {formData.title}
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground text-center mb-6">
          {formData.description}
        </p>
        <Form
          questions={formData.questions}
          onSubmit={handleSubmit}
          buttonText="Submit Form"
        />
      </div>
    </Card>
  );
}
