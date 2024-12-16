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
                                {/* response Title */}
                                <p className="text-sm font-medium text-foreground">
                                    Response #{response._id.slice(-4)}
                                </p>
                                <time className="text-sm text-muted-foreground">
                                    {formatDistanceToNow(new Date(response.submittedAt), {
                                        addSuffix: true,
                                    })}
                                </time>
                            </div>
                            {/* userName */}
                                {response.submittedBy?.user_name ? (
                                    <p className="text-xs left-0 mb-2 font-medium text-foreground">user name : <span className="text-primary">{response.submittedBy.user_name}</span></p>
                                ) : null}
                            <div className="space-y-2">
                                {response.responses.map((item) => (
                                    <div key={item._id} className="rounded-md bg-accent/50 p-3">
                                        <p className="text-sm text-muted-foreground mb-1">
                                            Question ID: {item.questionId}
                                        </p>
                                        <p className="text-sm text-foreground">
                                            {Array.isArray(item.answer)
                                                ? item.answer.join(", ")
                                                : item.answer}
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
