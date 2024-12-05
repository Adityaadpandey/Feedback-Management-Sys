"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import React from "react";
// import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Slider } from "../ui/slider";

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

export interface FormProps {
    questions: FormQuestion[];
    onSubmit: (responses: Record<string, any>) => void;
    buttonText?: string;
}

const Form: React.FC<FormProps> = ({
    questions,
    onSubmit,
    buttonText = "Submit",
}) => {
    const [responses, setResponses] = React.useState<Record<string, any>>({});
    const [date, setDate] = React.useState<Date | undefined>();

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
                <div key={question._id} className="space-y-4">
                    <Label className="block text-lg font-semibold ">
                        {question.questionText}
                    </Label>

                    {/* Short Answer */}
                    {question.questionType === "short-answer" && (
                        <Input
                            type="text"
                            placeholder="Type your answer"
                            className="w-full border rounded-md p-2"
                            onChange={(e) => handleInputChange(question._id, e.target.value)}
                        />
                    )}

                    {/* Paragraph */}
                    {question.questionType === "paragraph" && (
                        <textarea
                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary"
                            placeholder="Type your response here..."
                            rows={4}
                            onChange={(e) => handleInputChange(question._id, e.target.value)}
                        />
                    )}

                    {/* Multiple Choice */}
                    {question.questionType === "multiple-choice" && (
                        <div className="space-y-2">
                            {question.options?.map((option, index) => (
                                <Label key={index} className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        name={`questions.${question._id}.response`}
                                        value={option}
                                        className="form-radio text-primary"
                                        onChange={(e) => handleInputChange(question._id, option)}
                                    />
                                    <span  >
                                        {option}
                                    </span>
                                </Label>
                            ))}
                        </div>
                    )}

                    {/* Date Picker */}
                    {question.questionType === "date" && (
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full sm:w-[280px] justify-start text-left font-normal",
                                        !date && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 bg-white dark:bg-gray-800">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={(selectedDate) => {
                                        setDate(selectedDate);
                                        handleInputChange(question._id, selectedDate?.toISOString());
                                    }}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    )}
                    {/* checkbox */}
                    {question.questionType === "checkbox" && (
                        <div className="mt-2 space-y-2">
                            {question.options?.map((option, i) => (
                                <Label key={i} className="flex items-center space-x-2 text-black">
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
                                </Label>
                            ))}
                        </div>
                    )}


                    {/* Dropdown */}
                    {question.questionType === "dropdown" && (
                        <select
                            className={cn(
                                "w-full mt-2 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:bg-black bg-inherit"
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


                    {/* File Upload */}
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

                    {/* Time */}
                    {question.questionType === "time" && (
                        <Input
                            type="time"
                            className={cn(
                                "w-full mt-2 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            )}
                            onChange={(e) => handleInputChange(question._id, e.target.value)}
                        />
                    )}

                    {/* Rating */}
                    {question.questionType === "rating" && (
                        <Input
                            type="number"
                            min="0"
                            max="10"
                            className={cn(
                                "w-[20%] mt-2 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            )}
                            placeholder="0-10"
                            onChange={(e) => handleInputChange(question._id, e.target.value)}
                        />
                    )}


                    {/* Linear Scale */}
                    {question.questionType === "linear-scale" && (
                        <Slider
                            defaultValue={[6]}
                            min={0}
                            max={10}
                            className={cn("w-full mt-2")}
                            onChange={(e) => handleInputChange(question._id, e.target.value)}
                        />
                    )}


                    {/* Matrix */}
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
