"use client";

import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from "react";

const UserInfoForm: React.FC = () => {
    const router = useRouter();
    const { user } = useUser(); // Clerk's user context
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        email: "",
        phone: "",
        name: "",
        clerkId: "",
    });
    const [loader,setloader] = useState(true);

    // Check if user is logged in and exists
    useEffect(() => {
    setloader(true);
        const checkUserLogin = async () => {
            if (user) {
                const email = user?.primaryEmailAddress?.emailAddress || "";
                const phone = user?.primaryPhoneNumber?.phoneNumber || '';
                const clerkId = user?.id;

                // Prepare the data to send to the server
                const data = { email, phone, clerkId };

                try {
                    const response = await axios.post("http://localhost:8080/v1/auth/login", data);
                    if (response.status === 200) {
                        console.log("User already exists, logged in successfully.");
                        localStorage.setItem("user", JSON.stringify(response.data.accessToken));
                        router.push("/"); // Redirect to home page
                    } else {
                        console.log("User doesn't exist, proceed to registration.");
                    }
                } catch (error) {
                    console.error("Error during login check:", error);
                    // Handle the error (e.g., user doesn't exist or login failed)
                }
            }
        };

        checkUserLogin(); // Run on page load
    }, [user, router]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleNext = () => {
        setStep((prev) => prev + 1);
    };

    const handleBack = () => {
        setStep((prev) => prev - 1);
    };

    const handleSubmit = async () => {
        try {
            // If phone is an empty string, set it to null
            if (formData.phone === "") {
                formData.phone = null;
            }

            // Register the user if they don't exist
            const response = await axios.post("http://localhost:8080/v1/auth/register", formData);
            if (response.status === 200) {
                console.log("User registered successfully.");
                localStorage.setItem("user", JSON.stringify(response.data.accessToken));
                router.push("/"); // Redirect to home page
            } else {
                console.error("Error registering user:", response.data);
                alert("Failed to register user.");
            }
        } catch (error) {
            console.error("Error saving user data:", error);
            alert("Failed to save data.");
        }
    };

    if (loader) return <div>Loading...</div>;

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
                        <Button onClick={handleNext} className="left-0">
                            Next
                        </Button>
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
                        <Button onClick={handleBack} variant="secondary">
                            Back
                        </Button>
                        <Button onClick={handleNext}>
                            Next
                        </Button>
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
                        <Button onClick={handleBack} variant="secondary">
                            Back
                        </Button>
                        <Button onClick={handleNext}>
                            Next
                        </Button>
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
                        <Button onClick={handleBack} variant="secondary">
                            Back
                        </Button>
                        <Button onClick={handleSubmit}>
                            Submit
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserInfoForm;
