"use client";

import { AnalyticsHeader } from "@/components/analytics/analytics-header";
import { AnalyticsOverview } from "@/components/analytics/analytics-overview";
import { QuestionAnalytics } from "@/components/analytics/question-analytics";
import { ResponsesTimeline } from "@/components/analytics/responses-timeline";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { getFormAnalytics } from "@/lib/api/analytics";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";

export function AnalyticsClient({ formId }: { formId: string }) {
    const { data, isLoading, error } = useQuery({
        queryKey: ["form-analytics", formId],
        queryFn: () => getFormAnalytics(formId),
    });

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <LoadingSpinner className="mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading analytics data...</p>
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
                    <AlertDescription>Failed to load analytics data. Please try again later.</AlertDescription>
                </Alert>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                    <p>No data available</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <AnalyticsHeader form={data.form} />
            <main className="container mx-auto px-4 py-8">
                <div className="grid gap-8">

                    {/* TODO add the no of responses */}
                    <AnalyticsOverview analytics={data} />
                    <ResponsesTimeline responses={data.responses} />
                    <QuestionAnalytics
                        questions={data.form.questions}
                        responses={data.responses}
                    />
                </div>
            </main>
        </div>
    );
}
