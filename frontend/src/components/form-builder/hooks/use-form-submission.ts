import { useAlert } from "@/hooks/alert-provider";
import { FormQuestion } from "@/types/form";
import { useState } from "react";
import { toast } from "sonner";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/v1";


export function useFormSubmission() {
    const { showAlert } = useAlert();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitForm = async (title: string, questions: FormQuestion[]) => {
      if (!title.trim()) {
            showAlert(
                "Error!",
                "Please add a form title!",
                "error",
            )

      return false;
    }

      if (questions.length === 0) {
        showAlert(
                "Error!",
                "Please add a form title!",
                "error",
            )

      return false;

    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/forms/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          questions: questions.map(({ _id, ...q }) => q)
        })
      });

        if (!response.ok) throw new Error("Failed to create form");
        showAlert(
                "Success!",
                "Form created successfully!!",
                "success",
            );


      return true;
    } catch (error) {
        showAlert(
                "Error!",
                "Failed to create form. Please try again.",
                "error",
            );
      console.error(error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    submitForm
  };
}
