import { getFormAnalyticsByAI, getFormAnalyticsByAIforce } from '@/lib/api/analytics';
import { CheckCircle, List, MessageSquare, Lock } from 'lucide-react'; // Import icons
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { LoadingSpinner } from '../ui/loading-spinner';

const GeneratedAnalytics = ({ responseData }) => {
    const [loading, setLoading] = useState(true);
    const [analyticsData, setAnalyticsData] = useState(null);
    const [error, setError] = useState(null);

    // Function to fetch analytics data
    const fetchAnalytics = async () => {
        setLoading(true); // Reset loading state
        setError(null); // Reset error
        setAnalyticsData(null); // Reset analytics data
        try {
            const data = await getFormAnalyticsByAI(responseData._id); // Fetch analytics using API
            setAnalyticsData(data); // Set the fetched data into the state
        } catch (err) {
            console.error('Error generating analytics:', err);
            setError(err?.message || 'Failed to load analytics data. Please try again later.'); // Set error message
        } finally {
            setLoading(false); // Reset loading state after fetching
        }
    };

    // Fetch analytics data on initial load or when responseData changes
    useEffect(() => {
        fetchAnalytics();
    }, [responseData]); // Only re-fetch when responseData changes

    // Function to handle regeneration of analytics
    const regenerateAnalytics = async () => {
        setLoading(true); // Set loading state
        setError(null); // Reset error
        setAnalyticsData(null); // Reset analytics data
        try {
            // Call to regenerate analytics via the force API
            const data = await getFormAnalyticsByAIforce(responseData._id);
            setAnalyticsData(data); // Set newly generated data
            setLoading(false); // Reset loading state
        } catch (err) {
            console.error('Error regenerating analytics:', err.response.data.error.message);
            setError(err?.message || 'Failed to regenerate analytics. Please try again later.');
        }
    };

    // Display loading spinner
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-8">
                <LoadingSpinner />
                <p className="text-sm text-muted-foreground mt-4">Loading generated analytics...</p>
            </div>
        );
    }

    // Handle error state (AI generation limit exceeded)
    if (error && error.includes("AI generation limit exceeded")) {
        return (
            <div className="flex flex-col items-center justify-center p-8 space-y-4">
                <div className="w-full h-[300px] flex flex-col items-center justify-center text-center bg-gray-200 border border-dashed border-gray-400 rounded-md">
                    <Lock className="text-gray-500 w-16 h-16" />
                    <p className="text-xl font-semibold text-gray-700 mt-4">Upgrade Your Plan</p>
                    <p className="text-sm text-gray-500">You have reached your AI generation limit. Please upgrade your plan to continue generating analytics.</p>
                    <Button onClick={() => alert("Upgrade your plan to access this feature")} className="mt-4">
                        Upgrade Now
                    </Button>
                </div>
            </div>
        );
    }

    // Handle other error states
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center p-8">
                <p className="text-sm text-red-500 font-semibold">{error}</p>
            </div>
        );
    }

    // Handle case where no analytics data is available
    if (!analyticsData) {
        return (
            <div className="text-center p-8">
                <p className="text-sm text-muted-foreground">No analytics data available. Please try again later.</p>
            </div>
        );
    }

    // Render the analytics data once loaded
    return (
        <Card className="p-6 space-y-6 bg-card rounded-lg shadow-lg">
            <div className='flex justify-between items-center'>
                <h1 className="text-xl font-semibold text-foreground">Generated Analytics</h1>
                <Button onClick={regenerateAnalytics} className="mt-2">Regenerate Analytics</Button>
            </div>

            {/* Overall Feedback */}
            <div>
                <h2 className="text-lg font-medium text-primary mb-3 flex items-center">
                    <MessageSquare className="mr-2 text-primary" size={20} />
                    Overall Feedback:
                </h2>
                <p className="text-sm text-foreground leading-relaxed">
                    {analyticsData.overall || 'No feedback available.'}
                </p>
            </div>

            {/* Next Steps */}
            <div className="mb-4">
                <h2 className="text-md font-medium text-primary mb-2 flex items-center">
                    <CheckCircle className="mr-2 text-primary" size={20} />
                    Next Steps:
                </h2>
                <p className="text-sm text-foreground mt-1 leading-relaxed" style={{ whiteSpace: 'pre-line' }}>
                    {analyticsData.next_steps || 'N/A'}
                </p>
            </div>

            {/* Key Conclusions */}
            <div>
                <h2 className="text-lg font-medium text-primary mb-3 flex items-center">
                    <List className="mr-2 text-primary" size={20} />
                    Key Conclusions:
                </h2>
                {analyticsData.key_conclusions && analyticsData.key_conclusions.length > 0 ? (
                    <ul className="list-disc list-inside text-sm text-foreground space-y-2 pl-4">
                        {analyticsData.key_conclusions.map((conclusion, index) => (
                            <li key={index} className="leading-relaxed">{conclusion}</li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-muted-foreground">No key conclusions available.</p>
                )}
            </div>
        </Card>
    );
};

export default GeneratedAnalytics;
