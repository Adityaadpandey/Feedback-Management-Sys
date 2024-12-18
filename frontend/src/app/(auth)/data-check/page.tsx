"use client";

import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
const API = {
  login: async (clerkId) => {
    return axios.post(`${API_BASE_URL}/auth/login`, { clerkId });
  },
  register: async (formData) => {
    return axios.post(`${API_BASE_URL}/auth/register`, formData);
  },
};

const UserInfoForm: React.FC = () => {
  const router = useRouter();
  const { user } = useUser(); // Clerk's user context
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
    const checkUserLogin = async () => {
      if (user) {
        try {
          const response = await API.login(user.id);

          if (response.status === 200) {
            // User exists, store token and redirect
            localStorage.setItem("user", response.data.accessToken);
            router.push("/dashboard");
            return;
          }
        } catch (error) {
          console.error("Error during user login check:", error);
        }
      }

      // User doesn't exist or login failed
      setIsLoading(false);
    };

    checkUserLogin();
  }, [user, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  const handleSubmit = async () => {
    try {
      const response = await API.register(formData);

      if (response.status === 200) {
        localStorage.setItem("user", JSON.stringify(response.data.accessToken));
        router.push("/");
      } else {
        alert("Failed to register user.");
      }
    } catch (error) {
      console.error("Error saving user data:", error);
      alert("Failed to save data.");
    }
  };

  // Show loading state while checking user
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  // Render registration form
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
            <Button onClick={handleBack} variant="secondary">
              Back
            </Button>
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
            <Button onClick={handleBack} variant="secondary">
              Back
            </Button>
            <Button onClick={handleNext}>Next</Button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div>
          <h2 className="text-lg font-semibold mb-4 dark:text-black">Review & Submit</h2>
          <div className="mb-4">
            <p className="dark:text-black">
              <strong>Email:</strong> {formData.email}
            </p>
            <p className="dark:text-black">
              <strong>Phone:</strong> {formData.phone || "Not Provided"}
            </p>
            <p className="dark:text-black">
              <strong>Name:</strong> {formData.name}
            </p>
          </div>
          <div className="flex justify-between">
            <Button onClick={handleBack} variant="secondary">
              Back
            </Button>
            <Button onClick={handleSubmit}>Submit</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserInfoForm;
