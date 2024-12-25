import React from 'react';
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FormFlow - Fill the Form",
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
