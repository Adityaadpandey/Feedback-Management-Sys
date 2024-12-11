"use client";

import { NoResponseSelected } from "@/components/dashboard/no-response-selected";
import { ResponseList } from "@/components/dashboard/response-list";
import { Button } from '@/components/ui/button';
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ClipLoader } from 'react-spinners';

export default function ResponsesPage() {
    const searchParams = useSearchParams();
    const formId = searchParams.get("formId");
    const [responses, setResponses] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!formId) return;
        setLoading(true);

        const fetchResponses = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:8080/v1/reports/form/${formId}`,
                    {
                        headers: {
                            authorization: `Bearer ${localStorage.getItem("user")}`,
                        },
                    }
                );
                setResponses(response.data.responses);
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
            <div className="flex justify-center items-center ">
                <ClipLoader />
                {/* <h1 className="text-green-400 text-3xl">Loading..</h1> */}
                {/* <Spinner /> */}


            </div>
        )
    }

    return (
        <>
         <Card className="h-[calc(100vh-2rem)] p-6">

            <div className="mb-6 flex justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-foreground">Responses</h2>
                <p className="text-muted-foreground">
                    {responses.length} responses received
                </p>
                </div>
                    <div>
                        <Button variant="link" className="hover:from-white to-purple-300">Get More</Button>
                </div>
            </div>

            <ScrollArea className="h-[calc(100%-5rem)] pr-4">
                <ResponseList responses={responses} />
            </ScrollArea>
        </Card>
        </>
    );
}
