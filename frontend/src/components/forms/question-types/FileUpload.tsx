"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QuestionProps } from "@/types/form";
import { Upload } from "lucide-react";

export function FileUpload({ question, onChange }: QuestionProps) {
    return (
        <div className="space-y-2">
            <Label
                htmlFor={`file-${question._id}`}
                className="flex items-center gap-2 p-4 border-2 border-dashed rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
            >
                <Upload className="h-5 w-5 text-primary" />
                <span>Click to upload or drag and drop</span>
            </Label>
            <Input
                id={`file-${question._id}`}
                type="file"
                className="hidden"
                onChange={(e) => onChange(question._id, e.target.files?.[0])}
            />
        </div>
    );
}
