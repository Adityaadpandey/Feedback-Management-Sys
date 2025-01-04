"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import Link from "next/link";

export function SuccessHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mb-5 sticky top-0 z-10"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-primary" />
            <span className="font-semibold">Form Created Succesfully</span>
          </div>
          {/* <div className="w-9" /> */}
        </div>
      </div>
    </motion.div>
  );
}
