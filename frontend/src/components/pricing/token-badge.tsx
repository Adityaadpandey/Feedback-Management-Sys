"use client"

import { motion } from "framer-motion"
import { Zap } from "lucide-react"

export function TokenBadge({ tokens }: { tokens: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm text-primary dark:bg-primary/20"
    >
      <Zap className="mr-1 h-3.5 w-3.5" />
      {tokens.toLocaleString()} tokens
    </motion.div>
  )
}