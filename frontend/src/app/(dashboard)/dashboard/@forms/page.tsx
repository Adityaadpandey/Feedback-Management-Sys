"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { deleteFormForDashboard, fetchFormsForDashboard } from "@/lib/api/dashboard";
import { FormTitle } from "@/types/form";
import { ArrowRight, FileText, PlusCircleIcon, Share2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from 'sonner';

export default function FormsPage() {
    const router = useRouter();
    const [delConfirmationView, setDelConfirmationView] = useState<string | null>(null);
    const [title_forms, setForms] = useState<FormTitle[]>([]); // Ensure it's initialized as an array.

    useEffect(() => {
        const fetchForms = async () => {
            try {
                const response = await fetchFormsForDashboard();
                setForms(response);
            } catch (error) {
                console.log("Failed to fetch forms:", error);
                setForms([]);
            }
        };

        fetchForms();
    }, []);

    const handleViewResponses = (formId: string) => {
        router.push(`/dashboard?formId=${formId}`);
    };

    const handleDeleteForm = async (formId: string) => {
        try {
            await deleteFormForDashboard(formId);
            setForms((prev) => prev.filter((form) => form._id !== formId));
            setDelConfirmationView(null);
        } catch (error) {
            console.log("Failed to delete form:", error);
        }
    };

    const openDeleteConfirmation = (formId: string) => {
        setDelConfirmationView(formId); // Set the formId to show the confirmation dialog
    };

    const closeDeleteConfirmation = () => {
        setDelConfirmationView(null); // Reset the formId to close the confirmation dialog
    };

    // const formUrl = `${window.location.origin}/form/${formId}`;

    return (
        <>
            {delConfirmationView && (
                <div className="fixed top-0 left-0 w-full h-full bg-black/50 z-50 flex items-center justify-center">
                    <Card className="p-6">
                        <h2 className="text-2xl font-bold text-foreground">Delete Form</h2>
                        <p className="text-muted-foreground">Are you sure you want to delete this form?</p>
                        <div className="flex justify-end space-x-4 mt-4">
                            <Button
                                variant="ghost"
                                onClick={closeDeleteConfirmation}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="default"
                                onClick={() => handleDeleteForm(delConfirmationView!)} // Pass the formId being deleted
                            >
                                Delete
                            </Button>
                        </div>
                    </Card>
                </div>
            )}

            <Card className="h-[calc(100vh-8rem)] p-6">
                <div className="mb-6 flex justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-foreground">Forms</h2>
                        <p className="text-muted-foreground">View and manage your feedback forms</p>
                    </div>
                    <div className="">
                        <Button variant="link" size="sm" onClick={() => router.push("/form-builder")}>
                            <PlusCircleIcon className="h-24 w-24" />
                            <span>Create new Form</span>
                        </Button>
                    </div>
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
                                        <div className="flex items-center space-x-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    const link = `${window.location.origin}/form/${form._id}`;
                                                    navigator.clipboard.writeText(link);
                                                    console.log("Copied link to clipboard: ", link);
                                                    toast.success("Link copied to clipboard. You can now share this link with your users");
                                                }}
                                                className="hover:bg-primary hover:text-primary-foreground"
                                            >
                                                <Share2 className="h-5 w-5" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => openDeleteConfirmation(form._id)}
                                                className="hover:bg-primary hover:text-primary-foreground"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    handleViewResponses(form._id);
                                                    toast.success("Please select");
                                                }}
                                                className="hover:bg-primary hover:text-primary-foreground"
                                            >
                                                View Responses
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>

                                </Card>
                            ))
                        ) : (
                            <p className="text-muted-foreground">No forms available</p>
                        )}
                    </div>
                </ScrollArea>
            </Card>
        </>
    );
}
