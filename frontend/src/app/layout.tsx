import Navbar from "@/components/globals/navbar";
import { ThemeProvider } from "@/components/globals/theme-provider";
import { ModeToggle } from "@/components/globals/theme-toogle";
import { AlertProvider } from "@/hooks/alert-provider";
import { RoleProvider } from "@/hooks/role-provider";
import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const font = DM_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "FormFlow - Dynamic Form Builder",
    description: "Create and manage customizable forms with AI-powered analysis, seamless integrations, and flexible collaboration tools for teams of all sizes."
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;

}>) {
    return (
        <ClerkProvider>
            <RoleProvider initialRole="user" initialSubscriptionPlan="free" initialAiGenerationLimit={0}>
                <html lang="en" suppressHydrationWarning>
                    <body className={font.className}>
                        <AlertProvider>
                            <ThemeProvider
                                attribute="class"
                                defaultTheme="system"
                                enableSystem
                                disableTransitionOnChange>
                                <ModeToggle />
                                <Navbar />
                                {children}
                            </ThemeProvider>
                        </AlertProvider>
                    </body>
                </html>
            </RoleProvider>
        </ClerkProvider>
    );
}
