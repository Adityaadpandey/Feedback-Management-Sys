import { GeneratedAnalytics } from "@/types/gemini";
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
