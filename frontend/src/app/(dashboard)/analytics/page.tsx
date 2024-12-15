"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

function Analytics() {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 mb-5 sticky top-0 z-10"
        >
            <div className="mx-auto mt-20 px-4 py-4 ">
                <div
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2"
                    role="alert"
                    aria-live="polite"
                >
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <span className="font-semibold">Form Submitted Successfully</span>
                </div>
                <div className="mt-52 flex justify-center">
                    <Link href="/">
                        <Button>Go back to home</Button>
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}

export default Analytics;
