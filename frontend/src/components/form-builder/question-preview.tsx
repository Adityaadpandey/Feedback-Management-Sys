"use client";

import { FormQuestion } from "@/types/form";
import { ShortAnswer } from "../forms/form/question-types/short-answer";
import { Paragraph } from "../forms/form/question-types/paragraph";
import { MultipleChoice } from "../forms/form/question-types/multiple-choice";
import { Checkbox } from "../forms/form/question-types/checkbox";
import { Dropdown } from "../forms/form/question-types/dropdown";
import { FileUpload } from "../forms/form/question-types/file-upload";
import { DatePicker } from "../forms/form/question-types/date-picker";
import { TimePicker } from "../forms/form/question-types/time-picker";
import { Rating } from "../forms/form/question-types/rating";
import { LinearScale } from "../forms/form/question-types/linear-scale";
import { Matrix } from "../forms/form/question-types/matrix";

interface QuestionPreviewProps {
  question: FormQuestion;
  onChange: (value: any) => void;
}

export function QuestionPreview({ question, onChange }: QuestionPreviewProps) {
  const components = {
    "short-answer": ShortAnswer,
    paragraph: Paragraph,
    "multiple-choice": MultipleChoice,
    checkbox: Checkbox,
    dropdown: Dropdown,
    "file-upload": FileUpload,
    date: DatePicker,
    time: TimePicker,
    rating: Rating,
    "linear-scale": LinearScale,
    matrix: Matrix,
  };

  const Component = components[question.questionType];

  if (!Component) {
    return <div>Unsupported question type</div>;
  }

  return <Component question={question} onChange={onChange} />;
}
