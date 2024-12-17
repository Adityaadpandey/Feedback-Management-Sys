"use client";

import { NoResponseSelected } from "@/components/dashboard/no-response-selected";
import { ResponseList } from "@/components/dashboard/response-list";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSearchParams,useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import {fetchResponsesForForm} from "@/lib/api/dashboard";

function ResponsesPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const formId = searchParams.get("formId");
    const [responses, setResponses] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!formId) return;
        setLoading(true);

        const fetchResponses = async () => {
            try {
                const response = await fetchResponsesForForm(formId);
                setResponses(response);
                setLoading(false);
            } catch (error) {
                console.log("Failed to fetch responses:", error);
                setLoading(false);
            }
        };

        fetchResponses();
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


    return (
        responses.length > 0 ? (
            <Card className="h-[calc(100vh-8rem)] p-6">
                <div className="mb-6 flex justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-foreground">Responses</h2>
                        <p className="text-muted-foreground">
                            {responses.length} responses received
                        </p>
                    </div>
                    <div>
                        <Button
                            variant="link"
                            onClick={() => router.push(`analytics/${formId}`)}
                        >
                            Get More
                        </Button>
                    </div>
                </div>

                <ScrollArea className="h-[calc(100%-5rem)] pr-4">
                    <ResponseList responses={responses} />
                </ScrollArea>
            </Card>
        ) : (
            <NoResponseSelected />
        )
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
