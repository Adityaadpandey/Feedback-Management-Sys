"use client"

import { Boxes } from "lucide-react"
import { FooterSection } from "./footer-section"
import { NewsletterForm } from "./newsletter-form"
import { SocialLinks } from "./social-links"

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
}

export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2">
              <Boxes className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">FormFlow</span>
            </div>
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
          <FooterSection title="Resources" links={sections.resources} delay={0.3} />
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
  )
}
