import axios from 'axios';

export async function fetchFormsForDashboard() {
  try {
    const user = localStorage.getItem("user");

      const response = await axios.get('http://localhost:8080/v1/reports/titles', {
        headers: {
          authorization: `Bearer ${user}`,
        },
     });

    // Check if response data is an array, else handle appropriately.
    const formTitles = Array.isArray(response.data.titles) ? response.data.titles : [];
    console.log("Forms:", formTitles);

    return formTitles;
  } catch (error) {
    console.log("Failed to fetch forms:", error);
    return []; // Return an empty array on error to avoid further issues.
  }
}



export async function fetchResponsesForForm(formId: string) {
    try {
        const user = localStorage.getItem("user");

        const response = await axios.get(
        `http://localhost:8080/v1/reports/form/${formId}`,
        {
            headers: {
            authorization: `Bearer ${user}`,
            },
        }
        );

        return response.data.responses;
    } catch (error) {
        console.log("Failed to fetch responses:", error);
        return [];
    }
    }
