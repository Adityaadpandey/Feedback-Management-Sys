'use client';

import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useEffect, useState } from 'react';

const Page = () => {
    const [forms, setForms] = useState([]); // Use an empty array as the default value for forms
    const [loading, setLoading] = useState(true); // Track loading state
    const [error, setError] = useState(null); // Track errors

    useEffect(() => {
        const fetchForms = async () => {
            try {
                const token = localStorage.getItem('user'); // Get the token from localStorage
                if (!token) {
                    throw new Error("No token found in localStorage.");
                }

                const response = await axios.get('http://localhost:8080/v1/reports/titles', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                setForms(response.data.titles); // Assuming the API returns an object with a "titles" property
            } catch (err) {
                console.error("Error fetching forms:", err.message);
                setError(err.message); // Set error state
            } finally {
                setLoading(false); // Stop loading after the fetch completes
            }
        };

        fetchForms();
    }, []);

    if (loading) return <h1>Loading...</h1>; // Display loading state
    if (error) return <h1>Error: {error}</h1>; // Display error message if an error occurs

    return (
        <div className="p-8 min-h-screen transition-colors duration-300  ">
            <h1 className="text-4xl font-extrabold text-center mb-10 text-gray-900 dark:text-gray-100">
                Your Forms
            </h1>
            {forms.length > 0 ? (
                <div className="space-y-6">
                    {forms.map((form) => (
                        <div
                            key={form._id}
                            className="flex items-center justify-between bg-white dark:bg-gray-800 shadow-md dark:shadow-lg rounded-lg p-6
                     hover:shadow-lg dark:hover:shadow-xl transition-shadow duration-300"
                        >
                            <h2 className="text-2xl font-medium text-gray-800 dark:text-gray-200">
                                {form.title}
                            </h2>
                            <Button
                                className="w-28 text-blue-600 dark:text-blue-400
                       hover:bg-blue-100 dark:hover:bg-gray-700
                       hover:scale-105 dark:hover:scale-105
                       transition-transform duration-200"
                                variant="link"
                            >
                                View Form
                            </Button>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-lg text-gray-600 dark:text-gray-300">
                    No forms available. Please create one to get started!
                </p>
            )}
        </div>




    );
};

export default Page;
