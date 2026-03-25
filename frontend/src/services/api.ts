import axios, { AxiosInstance, AxiosError } from "axios";

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 503) {
      console.error("Backend is down!");
    }
    return Promise.reject(error);
  }
);

// Helper to extract data from Varun's response format
// All responses return: { success, data, message, timestamp }
export function extractData<T>(response: { data: { success: boolean; data: T } }): T {
  return response.data.data;
}

export default api;