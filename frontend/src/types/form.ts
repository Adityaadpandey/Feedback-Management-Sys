export interface FormQuestion {
  _id: string;
  questionText: string;
  questionType:
    | "short-answer"
    | "paragraph"
    | "multiple-choice"
    | "checkbox"
    | "dropdown"
    | "file-upload"
    | "date"
    | "time"
    | "rating"
    | "linear-scale"
    | "matrix";
  options?: string[];
}


export interface FormTitle {
    _id: string;
    title: string;
  }

export interface FormData {
  _id: string;
  title: string;
  description: string;
  questions: FormQuestion[];
}

export interface QuestionProps {
  question: FormQuestion;
  onChange: (id: string, value: any) => void;
  value?: any;
}

export interface FormProps {
  questions: FormQuestion[];
  onSubmit: (responses: Record<string, any>) => void;
  buttonText?: string;
}

export interface FormResponse{
    _id: string;
    submittedAt: string;
    submittedBy: {
        user_name: string;
        user_id: string;
    };
    responses: {
        _id: string;
        questionId: string;
        answer: any;
    }[];

}
