export interface FormTitle {
  _id: string;
  title: string;
}

export interface FormResponse {
  _id: string;
  formId: string;
  submittedBy: null;
  responses: {
    questionId: string;
    answer: string | string[];
    _id: string;
  }[];
  submittedAt: string;
  __v: number;
}

export interface ResponseData {
  responses: FormResponse[];
  length: number;
}