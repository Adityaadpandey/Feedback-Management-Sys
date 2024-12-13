"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QuestionProps } from "@/types/form";
import { Upload } from "lucide-react";
import { motion } from "framer-motion";

export function FileUpload({ question, onChange }: QuestionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-2"
    >
      <Label
        htmlFor={`file-${question._id}`}
        className="flex items-center gap-2 p-4 border-2 border-dashed rounded-lg hover:bg-accent/50 transition-colors cursor-pointer group"
      >
        <Upload className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
        <span>Click to upload or drag and drop</span>
      </Label>
      <Input
        id={`file-${question._id}`}
        type="file"
        className="hidden"
        onChange={(e) => onChange(question._id, e.target.files?.[0])}
      />
    </motion.div>
  );
}