"use client";
import { Card } from "@/components/ui/card";
import { useAlert } from "@/hooks/alert-provider";
import { submitFormResponse } from "@/lib/api/forms";
import { FormData } from "@/types/form";
import { useRouter } from "next/navigation";
import { Form } from "../form";

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
      <p className="text-center text-muted-foreground text-sm sm:text-base py-8">
        Loading form data...
      </p>
    );
  }

  return (
    <Card className="w-full max-w-full border shadow-md sm:shadow-lg overflow-hidden">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 border-b px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-2 sm:mb-3 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70 leading-tight break-words">
          {formData.title}
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-muted-foreground text-center leading-relaxed max-w-2xl mx-auto break-words">
          {formData.description}
        </p>
      </div>

      {/* Form Content */}
      <div className="p-4 sm:p-6 md:p-8 lg:p-10 w-full">
        <Form
          questions={formData.questions}
          onSubmit={handleSubmit}
          buttonText="Submit Form"
        />
      </div>
    </Card>
  );
}
