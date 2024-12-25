import { Metadata } from "next";
import React from 'react';

export const metadata: Metadata = {
    title: "CognifyForms - Fill the Form",
    description: "Easily fill out forms and provide valuable feedback. Customize your responses and enjoy a seamless form experience with real-time progress tracking and AI-powered suggestions."
};


export default function layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="mt-24 mb-[190px] flex justify-center items-center px-4">
            {children}
        </div>

    )
}
