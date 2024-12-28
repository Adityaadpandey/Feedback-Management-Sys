"use client";

import { QuestionProps } from "@/types/form";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useState } from "react";

export function Rating({ question, onChange, value }: QuestionProps) {
  const [hover, setHover] = useState<number | null>(null);
  const stars = [1, 2, 3, 4, 5];

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
            className={`h-8 w-8 ${
              (hover ? hover >= star : value >= star)
                ? "fill-primary text-primary"
                : "text-muted-foreground"
            } transition-colors`}
          />
        </motion.button>
      ))}
    </div>
  );
}
