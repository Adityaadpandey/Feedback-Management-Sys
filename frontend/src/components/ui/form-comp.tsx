import { Button } from '@/components/ui/button';
import { cn } from "@/lib/utils";
import * as React from "react";

export interface FormQuestion {
  _id: string;
  questionText: string;
  questionType: "short-answer" | "rating" | "paragraph" | "checkbox";
  options?: string[];
}

// Form Props
export interface FormProps {
  questions: FormQuestion[];
  onSubmit: (responses: Record<string, any>) => void;
  buttonText?: string;
}

// Form Component
const Form: React.FC<FormProps> = ({ questions, onSubmit, buttonText = "Submit" }) => {
  const [responses, setResponses] = React.useState<Record<string, any>>({});

  const handleInputChange = (id: string, value: any) => {
    setResponses((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(responses);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {questions.map((question) => (
        <div key={question._id} className="space-y-2">
          <label className="block text-lg font-medium text-gray-800">{question.questionText}</label>
          {question.questionType === "short-answer" && (
            <input
              type="text"
              className={cn(
                "w-full mt-2 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              )}
              onChange={(e) => handleInputChange(question._id, e.target.value)}
            />
          )}
          {question.questionType === "rating" && (
            <input
              type="number"
              min="0"
              max="100"
              className={cn(
                "w-full mt-2 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              )}
              onChange={(e) => handleInputChange(question._id, e.target.value)}
            />
          )}
          {question.questionType === "paragraph" && (
            <textarea
              rows={4}
              className={cn(
                "w-full mt-2 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              )}
              onChange={(e) => handleInputChange(question._id, e.target.value)}
            ></textarea>
          )}
          {question.questionType === "checkbox" && (
            <div className="mt-2 space-y-2">
              {question.options?.map((option, i) => (
                <label key={i} className="flex items-center space-x-2 text-gray-800">
                  <input
                    type="checkbox"
                    value={option}
                    className={cn("rounded focus:ring-indigo-500")}
                    onChange={(e) => {
                      const currentValues = responses[question._id] || [];
                      if (e.target.checked) {
                        handleInputChange(question._id, [...currentValues, option]);
                      } else {
                        handleInputChange(
                          question._id,
                          currentValues.filter((val: string) => val !== option)
                        );
                      }
                    }}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      ))}
          <Button>
              {buttonText}
      </Button>
    </form>
  );
};

export default Form;
