import { Suspense } from "react";
import { AnalyticsClient } from "./client";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export async function generateStaticParams() {
  return [];
}

export default function AnalyticsPage({
  params,
}: {
  params: { formId: string };
}) {
  return (
    <Suspense fallback={<AnalyticsLoading />}>
      <AnalyticsClient formId={params.formId} />
    </Suspense>
  );
}

function AnalyticsLoading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner className="mx-auto mb-4" />
        <p className="text-muted-foreground">Loading analytics...</p>
      </div>
    </div>
  );
}
