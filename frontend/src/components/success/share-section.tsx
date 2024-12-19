"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Copy, Link as LinkIcon, Share2 } from "lucide-react";
import { useState } from "react";

interface ShareSectionProps {
    formId: string;
}

export function ShareSection({ formId }: ShareSectionProps) {
    const { toast } = useToast();
    const [copied, setCopied] = useState(false);
    const formUrl = `${window.location.origin}/form/${formId}`;

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(formUrl);
            setCopied(true);
            toast({
                title: "Link copied!",
                description: "The form link has been copied to your clipboard.",
            });
            setTimeout(() => setCopied(false), 2000);
        } catch {
            toast({
                title: "Failed to copy",
                description: "Please try copying the link manually.",
                variant: "destructive",
            });
        }
    };

    const shareForm = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: "Share Form",
                    text: "Check out this form!",
                    url: formUrl,
                });
            } catch (err) {
                if ((err as Error).name !== "AbortError") {
                    toast({
                        title: "Failed to share",
                        description: "Please try sharing the link manually.",
                        variant: "destructive",
                    });
                }
            }
        } else {
            copyToClipboard();
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
        >
            <Card className="p-6 border border-border/50 hover:border-primary/50 transition-all duration-300">
                <div className="flex flex-col space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 rounded-lg bg-primary/10">
                            <LinkIcon className="w-4 h-4 text-primary" />
                        </div>
                        <h2 className="text-lg font-semibold">Share Form</h2>
                    </div>

                    <div className="flex gap-2">
                        <Input
                            value={formUrl}
                            readOnly
                            className="font-mono text-sm bg-secondary/50"
                        />
                        <Button
                            variant="outline"
                            onClick={copyToClipboard}
                            className="shrink-0 hover:border-primary/50 transition-all duration-300"
                        >
                            <Copy className={`w-4 h-4 mr-2 ${copied ? 'text-primary' : ''}`} />
                            {copied ? "Copied!" : "Copy"}
                        </Button>
                    </div>

                    <Button
                        onClick={shareForm}
                        className="w-full sm:w-auto shadow-lg hover:shadow-primary/25 transition-all"
                    >
                        <Share2 className="w-4 h-4 mr-2" />
                        Share with others
                    </Button>
                </div>
            </Card>
        </motion.div>
    );
}
