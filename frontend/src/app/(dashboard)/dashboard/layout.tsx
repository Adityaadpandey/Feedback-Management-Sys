import { GradientText } from "@/components/ui/gradient-text";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "CognifyForms - Insights & Analytics",
  description:
    "Gain actionable insights from your form responses with detailed analytics, AI-driven trends, and customizable reports. Track performance, user engagement, and make data-driven decisions.",
};

export default function DashboardLayout({
  forms,
  responses,
}: {
  children: React.ReactNode;
  forms: React.ReactNode;
  responses: React.ReactNode;
}) {
  return (
    <>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold max-w-4xl my-8 leading-tight">
          <GradientText>DashBoard</GradientText>
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>{forms}</div>
          <div>{responses}</div>
        </div>
      </div>
    </>
  );
}
