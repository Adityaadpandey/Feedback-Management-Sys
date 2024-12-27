"use client";

import { NoResponseSelected } from "@/components/dashboard/no-response-selected";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { fetchResponsesForForm } from "@/lib/api/dashboard";
import { FormResponse } from "@/types/form";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { memo, Suspense, useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";

// Memoized answer renderer component to prevent unnecessary re-renders
const AnswerRenderer = memo(({ answer }: { answer: any }) => {
    if (!answer) return <span className="text-muted-foreground">No answer provided</span>;

    if (Array.isArray(answer)) {
        // Handle arrays with proper client-side rendering
        return (
            <div className="flex flex-wrap gap-2">
                {answer.map((item, index) => (
                    <span key={`${item}-${index}`} className="bg-primary/10 px-2 py-1 rounded-full text-xs">
                        {item}
                    </span>
                ))}
            </div>
        );
    }

    if (typeof answer === "object" && answer !== null) {
        return (
            <div className="space-y-1">
                {Object.entries(answer).map(([key, value]) => (
                    <div key={key} className="text-sm">
                        <span className="font-medium">{key}:</span>{" "}
                        <span className="text-muted-foreground">
                            {typeof value === "string" ? value : JSON.stringify(value)}
                        </span>
                    </div>
                ))}
            </div>
        );
    }

    return <span>{answer.toString()}</span>;
});

AnswerRenderer.displayName = "AnswerRenderer";

// Memoized individual response component
const ResponseItem = memo(({ response }: { response: FormResponse }) => {
    return (
        <Card className="p-4">
            <div className="flex items-start space-x-4">
                <div className="rounded-full bg-primary/10 p-2 shrink-0">
                    <MessageSquare className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="mb-2 flex items-center justify-between">
                        <p className="text-sm font-medium text-foreground truncate">
                            Response #{response._id.slice(-4)}
                        </p>
                        <time className="text-sm text-muted-foreground whitespace-nowrap ml-2">
                            {formatDistanceToNow(new Date(response.submittedAt), {
                                addSuffix: true,
                            })}
                        </time>
                    </div>

                    {response.submittedBy?.user_name && (
                        <p className="text-xs mb-2 font-medium text-foreground">
                            User Name: <span className="text-primary">{response.submittedBy.user_name}</span>
                        </p>
                    )}

                    <div className="space-y-2">
                        {response.responses.map((item) => (
                            <div key={item._id} className="rounded-md bg-accent/50 p-3">
                                <p className="text-xs text-muted-foreground mb-1">
                                    Question ID: {item.questionId}
                                </p>
                                <div className="text-sm text-foreground">
                                    <AnswerRenderer answer={item.answer} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Card>
    );
});

ResponseItem.displayName = "ResponseItem";

// Memoized response list component
const ResponseList = memo(({ responses }: { responses: FormResponse[] }) => {
    return (
        <div className="space-y-4">
            {responses.map((response) => (
                <ResponseItem key={response._id} response={response} />
            ))}
        </div>
    );
});

ResponseList.displayName = "ResponseList";

function ResponsesPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const formId = searchParams.get("formId");
    const [responses, setResponses] = useState<FormResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!formId) return;

        let mounted = true;
        setLoading(true);
        setError(null);

        const fetchResponses = async () => {
            try {
                const response = await fetchResponsesForForm(formId);
                if (mounted) {
                    setResponses(response);
                }
            } catch (error) {
                if (mounted) {
                    setError("Failed to fetch responses");
                    console.error("Failed to fetch responses:", error);
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        fetchResponses();

        return () => {
            mounted = false;
        };
    }, [formId]);

    if (!formId) {
        return <NoResponseSelected />;
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full">
                <ClipLoader />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-full text-red-500">
                {error}
            </div>
        );
    }

    return responses.length > 0 ? (
        <Card className="h-[calc(100vh-8rem)] p-6">
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-foreground">Responses</h2>
                    <p className="text-muted-foreground">
                        {responses.length} responses received
                    </p>
                </div>
                <Button
                    variant="link"
                    onClick={() => router.push(`analytics/${formId}`)}
                >
                    Get More
                </Button>
            </div>

            <ScrollArea className="h-[calc(100%-5rem)] pr-4">
                <ResponseList responses={responses} />
            </ScrollArea>
        </Card>
    ) : (
        <NoResponseSelected />
    );
}

export default function ResponsesPage() {
    return (
        <Suspense
            fallback={
                <div className="flex justify-center items-center h-screen">
                    <ClipLoader />
                </div>
            }
        >
            <ResponsesPageContent />
        </Suspense>
    );
}
