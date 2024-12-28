import { use } from "react";
import { FormPageClient } from "./form-page-client";

export default function FormPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  return <FormPageClient slug={resolvedParams.slug} />;
}
