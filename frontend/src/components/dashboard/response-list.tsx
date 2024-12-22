"use client";

import { Card } from "@/components/ui/card";
import { FormResponse } from "@/types/form";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare } from "lucide-react";

interface ResponseListProps {
    responses: FormResponse[];
}

export function ResponseList({ responses }: ResponseListProps) {
    return (
        <div className="space-y-4">
            {responses.map((response) => (
                <Card key={response._id} className="p-4">
                    <div className="flex items-start space-x-4">
                        <div className="rounded-full bg-primary/10 p-2">
                            <MessageSquare className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1">
                            <div className="mb-2 flex items-center justify-between">
                                {/* Response Title */}
                                <p className="text-sm font-medium text-foreground">
                                    Response #{response._id.slice(-4)}
                                </p>
                                <time className="text-sm text-muted-foreground">
                                    {formatDistanceToNow(new Date(response.submittedAt), {
                                        addSuffix: true,
                                    })}
                                </time>
                            </div>
                            {/* User Name */}
                            {response.submittedBy?.user_name && (
                                <p className="text-xs mb-2 font-medium text-foreground">
                                    User Name: <span className="text-primary">{response.submittedBy.user_name}</span>
                                </p>
                            )}
                            <div className="space-y-2">
                                {/* Iterate over individual responses */}
                                {response.responses.map((item) => (
                                    <div key={item._id} className="rounded-md bg-accent/50 p-3">
                                        <p className="text-sm text-muted-foreground mb-1">
                                            Question ID: {item.questionId}
                                        </p>
                                        <p className="text-sm text-foreground">
                                            {renderAnswer(item.answer)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
}



/**
 * Utility to handle different answer types.
 * @param answer The answer to a question.
 */

function renderAnswer(answer: any): string | JSX.Element {
    if (Array.isArray(answer)) {
        // Join arrays for display
        return answer.join(", ");
    } else if (typeof answer === "object" && answer !== null) {
        // Format objects for display
        return (
            <div>
                <ul className="list-none list-inside">
                    {Object.entries(answer).map(([key, value]) => (
                        <li key={key}>
                            <strong>{key}:</strong> {value}
                        </li>
                    ))}
                </ul>
            </div>
        );
    } else {
        // Default case for strings, numbers, or other values
        return answer?.toString() || "No answer provided";
    }
}
