"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function FormSubmittedSuccessfully() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 mb-5 sticky top-0 z-10"
    >
      <div className="mx-auto pt-20 px-4 py-4 min-w-[1000px]">
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2"
          role="alert"
          aria-live="polite"
        >
          <CheckCircle2 className="w-5 h-5 text-primary" />
          <span className="font-semibold">Form Submitted Successfully</span>
        </div>
        <div className="mt-5 flex justify-center">
          <Link href="/">
            <Button variant="link">Go home</Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default FormSubmittedSuccessfully;
