import DynamicForm from "./dynamic";

  const formData = {
    _id: "674dea84fe7f3fe1422f2151",
    title: "Customer Feedback Form",
    description: "A feedback form for our new product launch.",
    questions: [
      {
        _id: "674dea84fe7f3fe1422f2152",
        questionText: "What did you like about the product?",
        questionType: "short-answer",
      },
      {
        _id: "674dea84fe7f3fe1422f2153",    
        questionText: "How would you rate the product?",
        questionType: "rating",
      },
      {
        _id: "674dea84fe7f3fe1422f2154",
        questionText: "What improvements would you suggest?",
        questionType: "paragraph",
      },
      {
        _id: "674dea84fe7f3fe1422f2155",
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

export default function FormPage() {
    
  return <DynamicForm formData={formData} />;
}
