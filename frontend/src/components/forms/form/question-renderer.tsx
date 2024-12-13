"use client";

import { QuestionProps } from "@/types/form";
import { ShortAnswer } from "./question-types/short-answer";
import { Paragraph } from "./question-types/paragraph";
import { MultipleChoice } from "./question-types/multiple-choice";
import { DatePicker } from "./question-types/date-picker";
import { Checkbox } from "./question-types/checkbox";
import { Dropdown } from "./question-types/dropdown";
import { FileUpload } from "./question-types/file-upload";
import { TimePicker } from "./question-types/time-picker";
import { Rating } from "./question-types/rating";
import { LinearScale } from "./question-types/linear-scale";
import { Matrix } from "./question-types/matrix";

export function renderQuestionType(props: QuestionProps) {
  const questionTypes = {
    "short-answer": ShortAnswer,
    "paragraph": Paragraph,
    "multiple-choice": MultipleChoice,
    "date": DatePicker,
    "checkbox": Checkbox,
    "dropdown": Dropdown,
    "file-upload": FileUpload,
    "time": TimePicker,
    "rating": Rating,
    "linear-scale": LinearScale,
    "matrix": Matrix,
  };

  const Component = questionTypes[props.question.questionType];
  return Component ? <Component {...props} /> : null;
}