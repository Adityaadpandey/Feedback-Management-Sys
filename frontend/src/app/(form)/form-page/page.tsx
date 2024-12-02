'use client'
import { useState } from "react";
import axios from "axios";

const FeedbackForm = () => {
  const formData = {
    title: "Customer Feedback Form",
    description: "A feedback form for our new product launch.",
    questions: [
      {
        questionText: "What did you like about the product?",
        questionType: "short-answer",
      },
      {
        questionText: "How would you rate the product?",
        questionType: "rating",
      },
      {
        questionText: "What improvements would you suggest?",
        questionType: "paragraph",
      },
      {
        questionText: "What features would you like to see in future versions?",
        questionType: "checkbox",
        options: [
          "Better battery life",
          "More color options",
          "Additional accessories",
        ],
      },
    ],
  };

  const [responses, setResponses] = useState({});

  const handleInputChange = (questionText, value) => {
    setResponses((prev) => ({
      ...prev,
      [questionText]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedResponses = Object.entries(responses).map(
      ([questionText, answer]) => ({
        questionId: questionText, // Replace with actual question ID if available
        answer,
      })
    );

    try {
      const response = await axios.post("http://localhost:8080/responses", {
        formId: "exampleFormId", // Replace with actual form ID
        responses: formattedResponses,
      });
      alert("Response submitted successfully!");
      console.log(response.data);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit the form.");
    }
  };

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-lg max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-4">{formData.title}</h1>
      <p className="text-gray-700 text-center mb-6">{formData.description}</p>
      <form onSubmit={handleSubmit} className="space-y-6">
        {formData.questions.map((question, index) => (
          <div key={index}>
            <label className="block text-lg font-medium text-gray-800">
              {question.questionText}
            </label>
            {question.questionType === "short-answer" && (
              <input
                type="text"
                className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                onChange={(e) =>
                  handleInputChange(question.questionText, e.target.value)
                }
              />
            )}
            {question.questionType === "rating" && (
              <input
                type="number"
                min="1"
                max="5"
                className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                onChange={(e) =>
                  handleInputChange(question.questionText, e.target.value)
                }
              />
            )}
            {question.questionType === "paragraph" && (
              <textarea
                rows="4"
                className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                onChange={(e) =>
                  handleInputChange(question.questionText, e.target.value)
                }
              ></textarea>
            )}
            {question.questionType === "checkbox" && (
              <div className="mt-2 space-y-2">
                {question.options.map((option, i) => (
                  <label
                    key={i}
                    className="flex items-center space-x-2 text-gray-800"
                  >
                    <input
                      type="checkbox"
                      value={option}
                      className="rounded focus:ring-indigo-500"
                      onChange={(e) => {
                        const currentValues = responses[question.questionText] || [];
                        if (e.target.checked) {
                          handleInputChange(question.questionText, [
                            ...currentValues,
                            option,
                          ]);
                        } else {
                          handleInputChange(
                            question.questionText,
                            currentValues.filter((val) => val !== option)
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
        <button
          type="submit"
          className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;
