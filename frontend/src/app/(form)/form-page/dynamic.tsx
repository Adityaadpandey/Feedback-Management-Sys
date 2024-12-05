"use client";

import Form, { FormQuestion } from "@/components/ui/form-comp";
import axios from "axios";
import { useState } from "react";

const DynamicForm = ({ formData }: { formData: any }) => {
    // State to hold form responses
    const [responses, setResponses] = useState<Record<string, any>>({});

    // Submit handler
    const handleSubmit = async (formResponses: Record<string, any>) => {
        const formattedResponses = Object.entries(formResponses).map(
            ([questionId, answer]) => ({
                questionId,
                answer,
            })
        );

        const payload = {
            formId: formData._id,
            responses: formattedResponses,
        };

        try {
            const response = await axios.post("http://localhost:8080/v1/responses", payload);
            alert("Form submitted successfully!");
            console.log("Server Response:", response.data);
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("Failed to submit the form.");
        }
    };

    // Handle loading state
    if (!formData) {
        return <p className="text-center text-gray-600">Loading form data...</p>;
    }

    return (
        <div className="bg-gray-100 p-6 rounded-lg shadow-lg max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold text-center mb-4 text-black">{formData.title}</h1>
            <p className="text-gray-700 text-center mb-6">{formData.description}</p>

            {/* Form Component */}
            <Form
                questions={formData.questions as FormQuestion[]}
                onSubmit={(responses) => handleSubmit(responses)}
                buttonText="Submit Form"
            />
        </div>
    );
};

export default DynamicForm;
