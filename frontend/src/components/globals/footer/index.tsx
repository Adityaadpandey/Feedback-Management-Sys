"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { FooterSection } from "./footer-section";
import { SocialLinks } from "./social-links";

const sections = {
  company: [
    { label: "About", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
  product: [
    { label: "Features", href: "/features" },
    { label: "Pricing", href: "/pricing" },
    { label: "Integrations", href: "/integrations" },
    { label: "API", href: "/api" },
  ],
  resources: [
    { label: "Documentation", href: "/docs" },
    { label: "Guides", href: "/guides" },
    { label: "Support", href: "/support" },
    { label: "Status", href: "/status" },
  ],
  legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
    { label: "Security", href: "/security" },
    { label: "Cookies", href: "/cookies" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex items-center space-x-4  p-4 rounded-lg "
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                // className="bg-white p-2 rounded-full"
              >
                <span className="text-2xl pl-5 pr-3">
                  <Image
                    unoptimized
                    src="/t-rex_1f996.gif"
                    width={50}
                    height={50}
                    alt=""
                  />
                </span>
              </motion.div>

              <div className="flex flex-col">
                <motion.h1
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="text-3xl font-extrabold "
                >
                  CognifyForms
                </motion.h1>
                <motion.span
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                  className="flex items-center text-sm text-primary"
                >
                  Product by Aditya
                </motion.span>
              </div>
            </motion.div>

            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              Transform your feedback collection and analysis with AI-powered
              insights and automated workflows.
            </p>
            <div className="mt-6">
              <SocialLinks />
            </div>
          </div>

          <FooterSection title="Company" links={sections.company} delay={0.1} />
          <FooterSection title="Product" links={sections.product} delay={0.2} />
          <FooterSection
            title="Resources"
            links={sections.resources}
            delay={0.3}
          />
        </div>

        <div className="mt-12 border-t pt-8">
          <div className="flex flex-col justify-between space-y-4 sm:flex-row sm:space-y-0">
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              {sections.legal.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="hover:text-primary"
                >
                  {link.label}
                </a>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} FeedbackAI Pro. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
