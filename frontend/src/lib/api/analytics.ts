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
