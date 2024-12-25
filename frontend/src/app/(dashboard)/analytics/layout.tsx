"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Metadata } from "next";
import { ReactNode } from "react";

const queryClient = new QueryClient();

export const metadata: Metadata = {
    title: "CognifyForms - Insights & Analytics",
    description: "Gain actionable insights from your form responses with detailed analytics, AI-driven trends, and customizable reports. Track performance, user engagement, and make data-driven decisions."

};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}
