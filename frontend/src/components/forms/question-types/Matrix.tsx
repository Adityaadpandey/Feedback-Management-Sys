"use client";

import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { QuestionProps } from "@/types/form";
import { motion } from "framer-motion";

export function Matrix({ question, onChange, value = {} }: QuestionProps) {
  const options = question.options || [];
  const ratings = ["Poor", "Fair", "Good", "Excellent"];

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Criteria</TableHead>
            {ratings.map((rating) => (
              <TableHead key={rating} className="text-center">
                {rating}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {options.map((option, rowIndex) => (
            <motion.tr
              key={option}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: rowIndex * 0.1 }}
              className="hover:bg-accent/50"
            >
              <TableCell className="font-medium">{option}</TableCell>
              {ratings.map((rating) => (
                <TableCell key={rating} className="text-center">
                  <Label className="cursor-pointer">
                    <input
                      type="radio"
                      name={`${question._id}-${option}`}
                      checked={value[option] === rating}
                      onChange={() => {
                        onChange(question._id, {
                          ...value,
                          [option]: rating,
                        });
                      }}
                      className="form-radio text-primary"
                    />
                  </Label>
                </TableCell>
              ))}
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
