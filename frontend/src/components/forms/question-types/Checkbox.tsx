"use client";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { QuestionProps } from "@/types/form";
import { motion } from "framer-motion";

export function Checkbox({ question, onChange, value = [] }: QuestionProps) {
    return (
        <div className="mt-2 space-y-2">
            {question.options?.map((option, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                >
                    <Label className="flex items-center space-x-2 p-2 rounded-lg hover:bg-accent/50 transition-colors">
                        <input
                            type="checkbox"
                            value={option}
                            checked={value.includes(option)}
                            className={cn("rounded focus:ring-primary")}
                            onChange={(e) => {
                                const currentValues = value || [];
                                if (e.target.checked) {
                                    onChange(question._id, [...currentValues, option]);
                                } else {
                                    onChange(
                                        question._id,
                                        currentValues.filter((val: string) => val !== option)
                                    );
                                }
                            }}
                        />
                        <span className="text-foreground">{option}</span>
                    </Label>
                </motion.div>
            ))}
        </div>
    );
}
