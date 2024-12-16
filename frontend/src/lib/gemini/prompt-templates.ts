export const FORM_GENERATION_PROMPT = `
Create a form based on the following description. Only use these question types:
- short-answer
- paragraph
- multiple-choice
- checkbox
- dropdown
- date
- time
- rating
- linear-scale

For matrix questions, return options as an array of strings representing the rows.
The columns will always be ["Yes", "No"].

Return the response in this exact JSON format:
{
  "title": "Form title here",
  "description": "Form description here",
  "questions": [
    {
      "questionText": "Question text here",
      "questionType": "one of the allowed types",
      "options": ["option1", "option2"] // For multiple-choice, checkbox, dropdown
      // For matrix type, options should be row labels like ["Reading", "Writing", "Drawing"]
    }
  ]
}

Description:

don't use \n for new lines as the data will not be able to be validated properly
`;
