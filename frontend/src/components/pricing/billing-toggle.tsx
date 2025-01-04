"use client";

import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface BillingToggleProps {
  yearly: boolean;
  onToggle: () => void;
}

export function BillingToggle({ yearly, onToggle }: BillingToggleProps) {
  return (
    <div className="flex items-center justify-center space-x-4">
      <Label
        htmlFor="billing"
        className={yearly ? "text-muted-foreground" : "text-foreground"}
      >
        Monthly
      </Label>
      <Switch
        id="billing"
        checked={yearly}
        onCheckedChange={onToggle}
        className="data-[state=checked]:bg-primary"
      />
      <div className="flex items-center space-x-2">
        <Label
          htmlFor="billing"
          className={yearly ? "text-foreground" : "text-muted-foreground"}
        >
          Yearly
        </Label>
        {yearly && (
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
          >
            Save 20%
          </motion.span>
        )}
      </div>
    </div>
  );
}
