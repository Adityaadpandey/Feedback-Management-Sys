"use client"

import { useState } from "react"
import { PlanCard } from "@/components/pricing/plan-card"
import { BillingToggle } from "@/components/pricing/billing-toggle"
import { PricingHeader } from "@/components/pricing/pricing-header"

const plans = [
  {
    name: "Free",
    price: { monthly: 0, yearly: 0 },
    description: "Perfect for exploring our platform",
    tokens: 1000,
    features: [
      { text: "Basic form builder", included: true },
      { text: "Simple analytics", included: true },
      { text: "Email support", included: true },
      { text: "Community access", included: true },
      { text: "AI emotion analysis (limited)", included: true },
      { text: "Custom branding", included: false },
      { text: "Advanced integrations", included: false },
      { text: "Priority response from moderators", included: false },
    ],
  },
  {
    name: "Admin V3",
    price: { monthly: 29, yearly: 279 },
    description: "Great for small teams getting started",
    tokens: 5000,
    features: [
      { text: "Advanced form builder", included: true },
      { text: "Detailed analytics", included: true },
      { text: "Priority email support", included: true },
      { text: "AI emotion analysis (basic)", included: true },
      { text: "Custom branding", included: true },
      { text: "Integration with Slack and Zapier", included: true },
      { text: "Community access with priority status", included: true },
      { text: "Basic collaborative notes sharing", included: true },
    ],
  },
  {
    name: "Admin V7",
    price: { monthly: 59, yearly: 569 },
    description: "Perfect for growing businesses",
    tokens: 10000,
    popular: true,
    features: [
      { text: "Professional form builder", included: true },
      { text: "Advanced analytics with reports", included: true },
      { text: "24/7 priority support", included: true },
      { text: "Full AI emotion and sentiment analysis", included: true },
      { text: "Custom branding and themes", included: true },
      { text: "Integration with CRMs and advanced tools", included: true },
      { text: "Premium community access", included: true },
      { text: "Collaborative notes with shared voting", included: true },
      { text: "AI-powered flashcards for learning", included: true },
    ],
  },
  {
    name: "Admin V10",
    price: { monthly: 99, yearly: 949 },
    description: "For enterprises needing full power",
    tokens: 20000,
    features: [
      { text: "Enterprise form builder", included: true },
      { text: "Custom analytics and AI insights", included: true },
      { text: "Dedicated account manager and support", included: true },
      { text: "Advanced AI emotion and behavior prediction", included: true },
      { text: "White labeling with custom domains", included: true },
      { text: "Custom integrations with APIs", included: true },
      { text: "Full community management tools", included: true },
      { text: "Enterprise collaboration and data exports", included: true },
      { text: "Real-time emotion tracking for team interactions", included: true },
    ],
  },
];


export default function PricingPage() {
  const [yearly, setYearly] = useState(false)

  return (
    <div className="relative min-h-screen pt-20">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <div className="container py-20">
        <PricingHeader />

        <div className="mt-12">
          <BillingToggle yearly={yearly} onToggle={() => setYearly(!yearly)} />
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan, index) => (
            <PlanCard
              key={plan.name}
              {...plan}
              price={yearly ? {
                monthly: Math.round(plan.price.yearly / 12),
                yearly: plan.price.yearly,
              } : plan.price}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
