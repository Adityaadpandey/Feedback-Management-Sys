import { use } from "react";
import { SuccessPageClient } from "./success-page-client";

export default function SuccessPage({
  params,
}: {
  params: Promise<{ formId: string }>;
}) {
  const resolvedParams = use(params);
  return <SuccessPageClient formId={resolvedParams.formId} />;
}
