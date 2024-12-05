import { Button } from '@/components/ui/button';
import { cn } from "@/lib/utils";
import * as React from "react";
import { Input } from './Input';
import { Calendar } from './calendar';

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
            <Input
              type="text"
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
          {question.questionType === "multiple-choice" && (
            <div className="mt-2 space-y-2">
              {question.options?.map((option, i) => (
                <label key={i} className="flex items-center space-x-2">
                  <Input
                    type="radio"
                    name={question._id}
                    value={option}
                    className={cn("rounded focus:ring-indigo-500")}
                    onChange={(e) => handleInputChange(question._id, e.target.value)}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          )}
          {question.questionType === "checkbox" && (
            <div className="mt-2 space-y-2">
              {question.options?.map((option, i) => (
                <label key={i} className="flex items-center space-x-2">
                  <Input
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
          {question.questionType === "dropdown" && (
            <select
              className={cn(
                "w-full mt-2 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              )}
              onChange={(e) => handleInputChange(question._id, e.target.value)}
            >
              <option value="">Select an option</option>
              {question.options?.map((option, i) => (
                <option key={i} value={option}>
                  {option}
                </option>
              ))}
            </select>
          )}
          {question.questionType === "file-upload" && (
            <Input
              type="file"
              className={cn(
                "w-full mt-2 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              )}
              onChange={(e) =>
                handleInputChange(question._id, (e.target as HTMLInputElement).files?.[0])
              }
            />
          )}
          {question.questionType === "date" && (
            <Calendar
              onChange={(e) => handleInputChange(question._id, e.target.value)}
            />
          )}
          {question.questionType === "time" && (
            <Input
              type="time"
              className={cn(
                "w-full mt-2 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              )}
              onChange={(e) => handleInputChange(question._id, e.target.value)}
            />
          )}
          {question.questionType === "rating" && (
            <Input
              type="number"
              min="0"
              max="5"
              className={cn(
                "w-full mt-2 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              )}
              onChange={(e) => handleInputChange(question._id, e.target.value)}
            />
          )}
          {question.questionType === "linear-scale" && (
            <Input
              type="range"
              min="1"
              max="10"
              className={cn("w-full mt-2")}
              onChange={(e) => handleInputChange(question._id, e.target.value)}
            />
          )}
          {question.questionType === "matrix" && (
            <table className="mt-2 border-collapse border border-gray-300 w-full">
              <thead>
                <tr>
                  <th></th>
                  {question.options?.map((option, i) => (
                    <th key={i} className="border border-gray-300 p-2">
                      {option}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {question.options?.map((rowOption, i) => (
                  <tr key={i}>
                    <td className="border border-gray-300 p-2">{rowOption}</td>
                    {question.options?.map((colOption, j) => (
                      <td key={j} className="border border-gray-300 text-center">
                        <Input
                          type="radio"
                          name={`${question._id}-${i}`}
                          value={colOption}
                          className={cn("focus:ring-indigo-500")}
                          onChange={(e) =>
                            handleInputChange(question._id, {
                              ...responses[question._id],
                              [rowOption]: colOption,
                            })
                          }
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ))}
      <Button type="submit" className="w-full">
        {buttonText}
      </Button>
    </form>
  );
};

export default Form;
