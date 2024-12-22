"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { PlanFeatures } from "./plan-features"
import { TokenBadge } from "./token-badge"

interface PlanCardProps {
  name: string
  price: {
    monthly: number
    yearly: number
  }
  description: string
  features: Array<{ text: string; included: boolean }>
  tokens: number
  popular?: boolean
  index: number
}

export function PlanCard({
  name,
  price,
  description,
  features,
  tokens,
  popular,
  index,
}: PlanCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border bg-card p-6 transition-all hover:border-primary/50 dark:hover:border-primary/30",
        popular && "border-primary shadow-lg shadow-primary/10 dark:shadow-primary/5"
      )}
    >
      {/* Gradient background effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

      {popular && (
        <div className="absolute -right-20 top-7 rotate-45 bg-primary px-24 py-1 text-center text-xs font-medium text-primary-foreground">
          Popular Choice
        </div>
      )}

      <div className="relative">
        <div className="mb-4">
          <h3 className="text-2xl font-bold">{name}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        </div>

        <div className="mb-4 flex items-baseline space-x-1">
          <span className="text-4xl font-bold">₹{price.monthly}</span>
          <span className="text-muted-foreground">/month</span>
        </div>

        <div className="mb-6">
          <TokenBadge tokens={tokens} />
        </div>

        <Button
          className={cn(
            "mb-8 w-full transition-transform hover:scale-105",
            popular ? "bg-primary hover:bg-primary/90" : "bg-secondary hover:bg-secondary/80"
                  )}
                  onClick={() => console.log(name)}
                  //   TODO: add the functionality to redirect to the payment page
                  
              >

          Get Started
        </Button>

        <PlanFeatures features={features} />
      </div>
    </motion.div>
  )
}
