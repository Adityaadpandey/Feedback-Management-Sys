import { useState } from "react";
import { toast } from "sonner";
import { FormQuestion } from "@/types/form";

export function useFormSubmission() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitForm = async (title: string, questions: FormQuestion[]) => {
    if (!title.trim()) {
      toast.error("Please add a form title");
      return false;
    }

    if (questions.length === 0) {
      toast.error("Please add at least one question");
      return false;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:8080/v1/forms/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          questions: questions.map(({ _id, ...q }) => q)
        })
      });

      if (!response.ok) throw new Error("Failed to create form");

      toast.success("Form created successfully!");
      return true;
    } catch (error) {
      toast.error("Failed to create form");
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