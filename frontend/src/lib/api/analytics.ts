import { GeneratedAnalytics } from "@/types/gemini";
import { saveAs } from 'file-saver';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/v1';

export async function getFormAnalytics(formId: string) {
    try {
        const response = await axios.get(`${API_URL}/analytics/formresponse/${formId}`
            , {
                headers: {
                    authorization: `Bearer ${localStorage.getItem('user')}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching analytics:', error);
        throw new Error('Failed to fetch analytics data');
    }
}

export async function getFormAnalyticsByAI(formId: string): Promise<GeneratedAnalytics> {
    try {
        const response = await axios.get(`${API_URL}/admin/ai/${formId}`
            , {
                headers: {
                    authorization: `Bearer ${localStorage.getItem('user')}`
                }
            }
        );
        return response.data as GeneratedAnalytics;
    } catch (error) {
        console.error('Error fetching analytics:', error);
        throw new Error('Failed to fetch analytics data');
    }
}


export async function getFormAnalyticsByAIforce(formId: string): Promise<GeneratedAnalytics> {
    try {
        // Retrieve token from localStorage (or wherever it's stored)
        const token = localStorage.getItem('user'); // Make sure 'user' holds the correct token

        // If token is not found, handle it
        if (!token) {
            console.error('Token not found in localStorage');
            throw new Error('Token is required');
        }

        // Sending the request with the Authorization header
        const response = await axios.post(`${API_URL}/admin/ai/push/${formId}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`, // Ensure the token is correctly prefixed with "Bearer"
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching analytics:', error);
        throw new Error('Failed to fetch analytics data');
    }
}




export async function getAnalyticDatainXlsx(formId: string): Promise<void> {
    try {
        // Fetch the XLSX data as an array buffer
        const response = await axios.get(`${API_URL}/reports/forms/${formId}/export/xlsx`, {
            responseType: 'arraybuffer', // Ensure the response is treated as binary data
            headers: {
                authorization: `Bearer ${localStorage.getItem('user')}`, // Ensure the token is correct
            },
        });

        // Check if response data is received properly
        console.log('Response Data:', response.data);

        // Check if we have binary data in the response
        if (!response.data || !(response.data instanceof ArrayBuffer)) {
            throw new Error('Invalid response data');
        }

        // Create a Blob from the response data
        const blob = new Blob([response.data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });

        // Use FileSaver to trigger a download
        const filename = `${formId}_analytics.xlsx`; // Customize the filename as needed
        saveAs(blob, filename);

    } catch (error) {
        console.error('Error fetching analytics:', error.message);
        throw new Error('Failed to fetch and download analytics data');
    }
}
