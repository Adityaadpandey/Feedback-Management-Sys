"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import { ScrollArea } from '@/components/ui/scroll-area';

interface FormPreviewProps {
  formData: any;
}

export function FormPreview({ formData }: FormPreviewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <Card className="p-3 pt-5 border border-border/50 hover:border-primary/50 transition-all duration-300">
              <ScrollArea className="h-[300px]">

                   <div className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <FileText className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">{formData.title}</h2>
              <p className="text-sm text-muted-foreground">{formData.description}</p>
            </div>
          </div>

          <div className="space-y-4">
            {formData.questions.map((question: any, index: number) => (
              <motion.div
                key={question._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-all duration-300"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="text-xs bg-background/50 hover:bg-background/80"
                      >
                        Q{index + 1}
                      </Badge>
                      <h3 className="font-medium">{question.questionText}</h3>
                    </div>
                    <Badge
                      variant="secondary"
                      className="text-xs bg-primary/10 text-primary hover:bg-primary/20"
                    >
                      {question.questionType}
                    </Badge>
                  </div>
                  {question.validations?.required && (
                    <Badge variant="destructive" className="text-xs shrink-0">
                      Required
                    </Badge>
                  )}
                </div>

                {question.options && question.options.length > 0 && (
                  <div className="mt-3 pl-6">
                    <ul className="list-disc text-sm text-muted-foreground space-y-1">
                      {question.options.map((option: string, i: number) => (
                        <li key={i} className="hover:text-foreground transition-colors">
                          {option}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
       </ScrollArea>
      </Card>
    </motion.div>
  );
}
