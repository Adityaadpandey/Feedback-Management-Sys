import Navbar from "@/components/globals/navbar";
import { ThemeProvider } from "@/components/globals/theme-provider";
import { ModeToggle } from "@/components/globals/theme-toogle";
import { AlertProvider } from "@/hooks/alert-provider";
import { RoleProvider } from "@/hooks/role-provider";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const font = DM_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "CognifyForms - AI-Powered Form Builder & Analytics",
    template: "%s | CognifyForms",
  },
  description:
    "Transform form creation with AI. CognifyForms helps you build, share, and analyze custom forms in minutes. Smart form generation, real-time analytics, and seamless collaboration for teams and individuals.",
  keywords: [
    "AI form builder",
    "form creator",
    "smart forms",
    "form analytics",
    "online forms",
    "survey builder",
    "AI form generation",
    "form automation",
    "custom forms",
    "form responses",
    "data collection",
    "form insights",
    "collaborative forms",
    "no-code forms",
  ],
  authors: [{ name: "Aditya" }],
  creator: "CognifyForms",
  publisher: "CognifyForms",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://cognifyforms.com"), // Replace with your actual domain
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://cognifyforms.com",
    title: "CognifyForms - AI-Powered Form Builder & Analytics",
    description:
      "Create intelligent forms in seconds with AI. Build, customize, and analyze forms effortlessly. Perfect for surveys, feedback, registrations, and more.",
    siteName: "CognifyForms",
    images: [
      {
        url: "/og-image.png", // Create this image (1200x630px recommended)
        width: 1200,
        height: 630,
        alt: "CognifyForms - AI-Powered Form Builder",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CognifyForms - AI-Powered Form Builder & Analytics",
    description:
      "Create intelligent forms in seconds with AI. Build, customize, and analyze forms effortlessly.",
    images: ["/twitter-image.png"], // Create this image (1200x600px recommended)
    creator: "@cognifyforms", // Replace with your Twitter handle
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  verification: {
    google: "your-google-verification-code", // Add your Google Search Console verification
    // yandex: "your-yandex-verification-code",
    // bing: "your-bing-verification-code",
  },
  category: "Technology",
  classification: "Business Software",
  applicationName: "CognifyForms",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "CognifyForms",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "application-name": "CognifyForms",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <RoleProvider
        initialRole="user"
        initialSubscriptionPlan="free"
        initialAiGenerationLimit={0}
      >
        <html lang="en" suppressHydrationWarning>
          <head>
            {/* Additional meta tags for better SEO */}
            <meta name="theme-color" content="#ffffff" />
            <meta name="color-scheme" content="light dark" />
          </head>
          <body className={`${font.className} overflow-x-hidden`}>
            <AlertProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
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
