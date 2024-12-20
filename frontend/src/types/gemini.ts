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

export interface GeneratedAnalytics {
    overall: string;
    next_steps: string;
    key_conclusions: string[];
    updatedOn: Date;

}
