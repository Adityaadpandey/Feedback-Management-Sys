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

export async function submitFormResponse(payload: FormResponse): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/responses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new ApiError(
        response.status,
        "Failed to submit form response"
      );
    }

    return response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new Error("Network error occurred while submitting form");
  }
}
