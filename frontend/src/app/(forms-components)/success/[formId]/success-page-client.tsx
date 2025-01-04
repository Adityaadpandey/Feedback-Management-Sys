"use client";

import { useEffect, useState } from "react";
import { FormPreview } from "@/components/success/form-preview";
import { ShareSection } from "@/components/success/share-section";
import { SuccessHeader } from "@/components/success/success-header";
// import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { getFormBySlug } from "@/lib/api/forms";
// import { motion } from "framer-motion";

interface SuccessPageClientProps {
  formId: string;
}

export function SuccessPageClient({ formId }: SuccessPageClientProps) {
  const [formData, setFormData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const data = await getFormBySlug(formId);
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
  }, [formId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading form details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md w-full">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!formData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <SuccessHeader />
        <div className="max-w-3xl mx-auto space-y-6">
          <ShareSection formId={formId} />
          <FormPreview formData={formData} />
        </div>
      </main>
    </div>
  );
}
