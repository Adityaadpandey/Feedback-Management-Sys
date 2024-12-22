"use client"

import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"

export function PricingHeader() {
  return (
    <div className="relative mx-auto max-w-2xl text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 inline-flex items-center rounded-full border bg-muted px-3 py-1 text-sm"
      >
        <Sparkles className="mr-2 h-3.5 w-3.5 text-primary" />
        Special launch pricing
      </motion.div>
      
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl"
      >
        Simple, transparent pricing
      </motion.h1>
      
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-4 text-lg text-muted-foreground"
      >
        Choose the perfect plan for your feedback management needs.
        All plans include core features to get you started.
      </motion.p>
    </div>
  )
}