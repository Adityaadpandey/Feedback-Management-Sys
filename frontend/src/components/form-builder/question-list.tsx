"use client";

import { Draggable } from "react-beautiful-dnd";
import { QuestionEditor } from "./question-editor";
import { motion, AnimatePresence } from "framer-motion";
import { FormQuestion } from "@/types/form";

interface DragQuestion extends FormQuestion {
  _id: string;
}

interface QuestionListProps {
  questions: DragQuestion[];
  onUpdate: (id: string, updates: Partial<FormQuestion>) => void;
  onDelete: (id: string) => void;
}

export function QuestionList({
  questions,
  onUpdate,
  onDelete,
}: QuestionListProps) {
  return (
    <AnimatePresence>
      {questions.map((question, index) => (
        <Draggable key={question._id} draggableId={question._id} index={index}>
          {(provided) => (
            <motion.div
              ref={provided.innerRef}
              {...provided.draggableProps}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <QuestionEditor
                question={question}
                dragHandleProps={provided.dragHandleProps}
                onUpdate={(updates) => onUpdate(question._id, updates)}
                onDelete={() => onDelete(question._id)}
              />
            </motion.div>
          )}
        </Draggable>
      ))}
    </AnimatePresence>
  );
}
