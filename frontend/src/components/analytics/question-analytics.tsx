"use client";

import { Card } from "@/components/ui/card";
import {
  calculateAverageRating,
  processCheckboxData,
  processMultipleChoiceData,
  processScaleData,
  processTimeData,
} from "@/lib/utils/analytics";
import { BarChart } from "./charts/bar-chart";
import { PieChart } from "./charts/pie-chart";
import { ScrollArea } from "@/components/ui/scroll-area";

interface QuestionAnalyticsProps {
  questions: any[];
  responses: any[];
}

export function QuestionAnalytics({
  questions,
  responses,
}: QuestionAnalyticsProps) {
  const renderQuestionAnalytics = (question: any) => {
    switch (question.questionType) {
      case "multiple-choice":
        return (
          <PieChart
            data={processMultipleChoiceData(question, responses)}
            title={question.questionText}
          />
        );

      case "checkbox":
        return (
          <BarChart
            data={processCheckboxData(question, responses)}
            title={question.questionText}
          />
        );

      case "rating":
      case "linear-scale": {
        const maxScale = question.questionType === "rating" ? 5 : 10; // Determine the scale
        const avgRating = calculateAverageRating(responses, question._id);

        return (
          <div>
            <h3 className="text-lg font-semibold mb-2">
              {question.questionText}
            </h3>
            <div className="flex items-center gap-4">
              <div className="text-4xl font-bold text-primary">
                {avgRating.toFixed(1)}
              </div>
              <div className="text-sm text-muted-foreground">
                Average rating out of {maxScale}
              </div>
            </div>
            <BarChart
              data={processScaleData(question, responses, maxScale)}
              title="Rating Distribution"
            />
          </div>
        );
      }

      // case "time":
      //     return (
      //         <BarChart
      //             data={processTimeData(responses, question._id)}
      //             title={`${question.questionText} (Hour Distribution)`}
      //         />
      //     );

      case "short-answer":
      case "paragraph":
        return (
          <div>
            <h3 className="text-lg font-semibold mb-2">
              {question.questionText}
            </h3>
            <ScrollArea className="h-[300px]">
              <div className="space-y-2">
                {responses.map((response, index) => {
                  const answer = response.responses.find(
                    (r: any) => r.questionId === question._id,
                  )?.answer;
                  if (!answer) return null;
                  return (
                    <div key={index} className="p-3 rounded-lg bg-secondary/50">
                      <p className="text-sm">{answer}</p>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="grid gap-6">
      <h2 className="text-2xl font-bold">Question Analysis</h2>
      {questions.map((question) => {
        const analysis = renderQuestionAnalytics(question);
        if (!analysis) return null;

        return (
          <Card key={question._id} className="p-6">
            {analysis}
          </Card>
        );
      })}
    </div>
  );
}
