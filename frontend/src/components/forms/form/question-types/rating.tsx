"use client";

import { QuestionProps } from "@/types/form";
import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export function Rating({ question, onChange, value = 0 }: QuestionProps) {
  const [hover, setHover] = useState<number | null>(null);
  const stars = Array.from({ length: 5 }, (_, i) => i + 1);

  return (
    <div className="flex gap-2">
      {stars.map((star) => (
        <motion.button
          key={star}
          type="button"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="focus:outline-none"
          onClick={() => onChange(question._id, star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(null)}
        >
          <Star
            className={`h-8 w-8 transition-colors ${
              (hover ? hover >= star : value >= star)
                ? "fill-primary text-primary"
                : "text-muted-foreground"
            }`}
          />
        </motion.button>
      ))}
    </div>
  );
}
