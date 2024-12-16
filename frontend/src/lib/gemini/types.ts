export interface GeneratedQuestion {
  questionText: string;
  questionType: string;
  options?: string[];
}

export interface GeneratedForm {
  title: string;
  description?: string;
  questions: GeneratedQuestion[];
}