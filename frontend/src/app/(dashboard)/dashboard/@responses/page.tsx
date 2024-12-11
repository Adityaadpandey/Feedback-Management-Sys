"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ResponseList } from "@/components/dashboard/response-list";
import { NoResponseSelected } from "@/components/dashboard/no-response-selected";
import axios from "axios";

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
        //   setLoading(false);
        //   console.log("Fetched responses:", response.data.responses);
      } catch (error) {
        console.log("Failed to fetch responses:", error);
      }
    };

    fetchResponses();
  }, [formId]);

  if (!formId) {
    return <NoResponseSelected />;
  }
    if (loading){
        return (
            <div className="flex justify-center items-center ">
                <h1 className="text-green-400 text-3xl">Loading..</h1>
                </div>
        )
    }

  return (
    <Card className="h-[calc(100vh-2rem)] p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">Responses</h2>
        <p className="text-muted-foreground">
          {responses.length} responses received
        </p>
      </div>

      <ScrollArea className="h-[calc(100%-5rem)] pr-4">
        <ResponseList responses={responses} />
      </ScrollArea>
    </Card>
  );
}
