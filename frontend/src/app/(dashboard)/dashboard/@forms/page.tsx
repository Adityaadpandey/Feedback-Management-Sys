"use client";

import { FormTitle } from "@/types/form";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { FileText, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

export default function FormsPage() {
  const router = useRouter();
  const [title_forms, setForms] = useState<FormTitle[]>([]); // Ensure it's initialized as an array.

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/v1/reports/titles`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("user")}`,
          },
        });

        // Check if response data is an array, else handle appropriately.
        // const forms = Array.isArray(response.data) ? response.data : [];
        console.log("Forms:", response.data);

        setForms(response.data.titles);
      } catch (error) {
        console.error("Failed to fetch forms:", error);
        setForms([]); // Set to an empty array on error to avoid further issues.
      }
    };

    fetchForms();
  }, []);

  const handleViewResponses = (formId: string) => {
    router.push(`/dashboard?formId=${formId}`);
  };

  return (
    <Card className="h-[calc(100vh-2rem)] p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">Forms</h2>
        <p className="text-muted-foreground">View and manage your feedback forms</p>
      </div>

      <ScrollArea className="h-[calc(100%-5rem)] pr-4">
        <div className="space-y-4">
          {title_forms.length > 0 ? (
            title_forms.map((form) => (
              <Card key={form._id} className="p-4 hover:bg-accent/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-medium text-foreground">{form.title}</h3>
                      <p className="text-sm text-muted-foreground">ID: {form._id}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewResponses(form._id)}
                    className="hover:bg-primary hover:text-primary-foreground"
                  >
                    View Responses
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))
          ) : (
            <p className="text-muted-foreground">No forms available</p>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
}
