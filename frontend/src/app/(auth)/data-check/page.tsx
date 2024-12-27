"use client";

import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useRole } from "@/hooks/role-provider";
import { useUser } from "@clerk/nextjs";
import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Extend AxiosRequestConfig to include our metadata
interface RequestConfigWithMetadata extends InternalAxiosRequestConfig {
    metadata?: {
        startTime: number;
    };
}

// Create a performance tracking object
const responseTimings = {
    lastResponseTime: 1000, // Initial default 1 second
    updateTiming: (startTime: number) => {
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        // Exponential moving average to smooth out spikes
        responseTimings.lastResponseTime =
            (responseTimings.lastResponseTime * 0.7) + (responseTime * 0.3);
        return responseTime;
    }
};

// Create axios instance with dynamic timeout
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: Math.max(responseTimings.lastResponseTime * 1.5, 2000),
});

// Add request interceptor with proper typing
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const configWithMetadata = config as RequestConfigWithMetadata;
    configWithMetadata.metadata = { startTime: Date.now() };
    configWithMetadata.timeout = Math.max(responseTimings.lastResponseTime * 1.5, 2000);
    return configWithMetadata;
});

// Add response interceptor with proper typing
apiClient.interceptors.response.use(
    (response: AxiosResponse) => {
        const configWithMetadata = response.config as RequestConfigWithMetadata;
        const startTime = configWithMetadata.metadata?.startTime;
        if (startTime) {
            responseTimings.updateTiming(startTime);
        }
        return response;
    },
    (error) => {
        if (axios.isAxiosError(error) && error.config) {
            const configWithMetadata = error.config as RequestConfigWithMetadata;
            const startTime = configWithMetadata.metadata?.startTime;
            if (startTime) {
                responseTimings.updateTiming(startTime);
            }
        }
        return Promise.reject(error);
    }
);

// Type-safe API interface
interface UserFormData {
    email: string;
    phone: string;
    name: string;
    clerkId: string;
}

const API = {
    login: async (clerkId: string) => {
        try {
            return await apiClient.post('/auth/login', { clerkId });
        } catch (error) {
            throw error;
        }
    },
    register: async (formData: UserFormData) => {
        try {
            return await apiClient.post('/auth/register', formData);
        } catch (error) {
            throw error;
        }
    },
};
const UserInfoForm: React.FC = () => {
    const { setRole, setSubscriptionPlan, setAiGenerationLimit } = useRole();
    const router = useRouter();
    const { user } = useUser();

    const [isLoading, setIsLoading] = useState(true);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        email: "",
        phone: "",
        name: "",
        clerkId: "",
    });

    // Update formData when user data changes
    useEffect(() => {
        if (user) {
            setFormData({
                email: user.primaryEmailAddress?.emailAddress || "",
                phone: user.primaryPhoneNumber?.phoneNumber || "",
                clerkId: user.id,
                name: user.fullName || "",
            });
        }
    }, [user]);

    // Check if user exists in the system
    useEffect(() => {
        let mounted = true;

        const checkUserLogin = async () => {
            if (!user) return;

            try {
                const response = await API.login(user.id);

                if (!mounted) return;

                if (response.status === 200) {
                    const { accessToken, role, subscriptionPlan, ai_generation_limit } = response.data;

                    // Set all user data at once
                    localStorage.setItem("user", accessToken);
                    setRole(role);
                    setSubscriptionPlan(subscriptionPlan);
                    setAiGenerationLimit(ai_generation_limit);

                    router.push("/dashboard");
                    return;
                }
            } catch (error) {
                console.error("Error during user login check:", error);
            }

            if (mounted) {
                setIsLoading(false);
            }
        };

        checkUserLogin();

        return () => {
            mounted = false;
        };
    }, [user, router, setRole, setSubscriptionPlan, setAiGenerationLimit]);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }, []);

    const handleNext = useCallback(() => setStep((prev) => prev + 1), []);
    const handleBack = useCallback(() => setStep((prev) => prev - 1), []);

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const response = await API.register(formData);

            if (response.status === 201) {
                const { accessToken, role, subscriptionPlan, ai_generation_limit } = response.data;

                // Set all user data at once
                localStorage.setItem("user", accessToken);
                setRole(role);
                setSubscriptionPlan(subscriptionPlan);
                setAiGenerationLimit(ai_generation_limit);

                router.push("/");
            }
        } catch (error) {
            console.error("Error saving user data:", error);
            alert("Failed to save data. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            {step === 1 && (
                <div>
                    <h2 className="text-lg font-semibold mb-4 dark:text-black">Verify Your Email</h2>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg p-2 mb-4"
                        placeholder="Enter your email"
                    />
                    <div className="flex justify-end">
                        <Button onClick={handleNext}>Next</Button>
                    </div>
                </div>
            )}

            {step === 2 && (
                <div>
                    <h2 className="text-lg font-semibold mb-4 dark:text-black">Verify Your Phone (Optional)</h2>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg p-2 mb-4"
                        placeholder="Enter your phone number"
                    />
                    <div className="flex justify-between">
                        <Button onClick={handleBack} variant="secondary">Back</Button>
                        <Button onClick={handleNext}>Next</Button>
                    </div>
                </div>
            )}

            {step === 3 && (
                <div>
                    <h2 className="text-lg font-semibold mb-4 dark:text-black">Verify Your Name</h2>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg p-2 mb-4"
                        placeholder="Enter your name"
                    />
                    <div className="flex justify-between">
                        <Button onClick={handleBack} variant="secondary">Back</Button>
                        <Button onClick={handleNext}>Next</Button>
                    </div>
                </div>
            )}

            {step === 4 && (
                <div>
                    <h2 className="text-lg font-semibold mb-4 dark:text-black">Review & Submit</h2>
                    <div className="mb-4">
                        <p className="dark:text-black"><strong>Email:</strong> {formData.email}</p>
                        <p className="dark:text-black"><strong>Phone:</strong> {formData.phone || "Not Provided"}</p>
                        <p className="dark:text-black"><strong>Name:</strong> {formData.name}</p>
                    </div>
                    <div className="flex justify-between">
                        <Button onClick={handleBack} variant="secondary">Back</Button>
                        <Button onClick={handleSubmit}>Submit</Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserInfoForm;
