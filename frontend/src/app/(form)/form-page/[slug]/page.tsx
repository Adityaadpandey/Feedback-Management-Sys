'use client'
import { useEffect, useState } from "react";
import DynamicForm from "../dynamic";

interface FormData {
    _id: string;
    title: string;
    description: string;
    questions: Array<{
        _id: string;
        questionText: string;
        questionType: string;
        options?: string[];
    }>;
}

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
    const [formData, setFormData] = useState<FormData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const { slug } = await params; // Await for the slug promise
                const response = await fetch(`http://localhost:8080/v1/forms/get/${slug}`);
                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }
                const data = await response.json();
                setFormData(data);
            } catch (err) {
                if (err.code === 404) {
                    setError("Form not found");
                }
                setError(err instanceof Error ? err.message : "Unknown error occurred");
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [params]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            {formData && <DynamicForm formData={formData} />}
        </div>
    );
}
