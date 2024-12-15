import { FormData } from "@/types/form";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/v1";

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

export async function getFormBySlug(slug: string): Promise<FormData> {
  try {
    const response = await fetch(`${API_BASE_URL}/forms/get/${slug}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 60 }, // Cache for 60 seconds
    });

    if (!response.ok) {
      throw new ApiError(
        response.status,
        response.status === 404 ? "Form not found" : "Failed to fetch form"
      );
    }

    return response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new Error("Network error occurred while fetching form");
  }
}

export async function submitFormResponse(payload: any): Promise<any> {
    try {
      // Get 'user' from localStorage
      const user = localStorage.getItem("user");

      // Prepare headers
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

        // Add authorization header if 'user' exists
      if (user) {
        headers["Authorization"] = `Bearer ${user}`;
      }

      // Make the API request
      const response = await fetch(`${API_BASE_URL}/responses`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      // Check if the response is not OK
      if (!response.ok) {
        throw new ApiError(response.status, "Failed to submit form response");
      }

      // Return the parsed JSON response
      return response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error("Network error occurred while submitting form");
    }
  }
