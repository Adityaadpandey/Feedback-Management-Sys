import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/v1";

export async function getAiToken(): Promise<number> {
  try {
    const response = await axios.get(`${API_URL}/admin/checktokens`, {
      headers: {
        authorization: `Bearer ${localStorage.getItem("user")}`,
      },
    });
    return response.data.tokens;
  } catch (error) {
    console.error("Error fetching AI token:", error);
    throw new Error("Failed to fetch AI token");
  }
}

export async function sendAiToken(): Promise<any> {
  try {
    const response = await axios.post(
      `${API_URL}/admin/sendtokens`,
      {},
      {
        headers: {
          authorization: `Bearer ${localStorage.getItem("user")}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error sending AI token:", error);
    throw new Error("Failed to send AI token");
  }
}
