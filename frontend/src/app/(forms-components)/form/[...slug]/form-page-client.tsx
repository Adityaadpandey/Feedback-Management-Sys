"use client";
import { DynamicForm } from "@/components/forms/dynamic-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { getFormBySlug } from "@/lib/api/forms";
import { FormData } from "@/types/form";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";

interface FormPageClientProps {
  slug: string;
}

export function FormPageClient({ slug }: FormPageClientProps) {
  const [formData, setFormData] = useState<FormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const data = await getFormBySlug(slug);
        setFormData(data);
      } catch (err: any) {
        console.error("Error fetching form:", err);
        setError(
          err.status === 404
            ? "Form not found"
            : "Failed to load form. Please try again later.",
        );
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center min-h-[50vh] w-full"
      >
        <LoadingSpinner />
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md mx-auto"
      >
        <Alert variant="destructive" className="shadow-lg">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="text-sm sm:text-base font-semibold">
            Error
          </AlertTitle>
          <AlertDescription className="text-xs sm:text-sm mt-1">
            {error}
          </AlertDescription>
        </Alert>
      </motion.div>
    );
  }

  if (!formData) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-4xl"
    >
      <DynamicForm formData={formData} />
    </motion.div>
  );
}
