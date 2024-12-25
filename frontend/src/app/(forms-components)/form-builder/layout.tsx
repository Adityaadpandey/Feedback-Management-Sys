import { Metadata } from "next";
import React from 'react';


export const metadata: Metadata = {
    title: "FormFlow - AI-Powered Forms",
    description: "Leverage AI to create, analyze, and personalize your forms. Get intelligent suggestions, optimize responses, and enhance your form-filling experience with cutting-edge AI technology."
};


export default function layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="mt-20">
            {children}
        </div>

    )
}
