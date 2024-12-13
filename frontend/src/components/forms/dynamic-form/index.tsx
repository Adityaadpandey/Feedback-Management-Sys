"use client";

import { FormData } from "@/types/form";
import { Card } from "@/components/ui/card";
import { Form } from "../form";
import { submitFormResponse } from "@/lib/api/forms";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface DynamicFormProps {
  formData: FormData;
}

export function DynamicForm({ formData }: DynamicFormProps) {

    const router = useRouter();
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
        // alert('payload');
        router.push("/")
    //   toast.success("Form submitted successfully!");
    } catch  {
    //   console.error("Error submitting form:", error);
      toast.error("Failed to submit the form");
    }
  };

  if (!formData) {
    return <p className="text-center text-muted-foreground">Loading form data...</p>;
  }

  return (
    <Card>
      <div className="p-6 rounded-lg shadow-lg max-w-3xl mx-auto bg-dot-thick-transparent">
        <h1 className="text-2xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
          {formData.title}
        </h1>
        <p className="text-muted-foreground text-center mb-6">{formData.description}</p>

        <Form
          questions={formData.questions}
          onSubmit={handleSubmit}
          buttonText="Submit Form"
        />
      </div>
    </Card>
  );
}
