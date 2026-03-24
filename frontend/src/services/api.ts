import axios, { AxiosInstance, AxiosError } from "axios";

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 503) {
      console.error("Backend is down — Varun's FastAPI server is not running");
    }
    if (error.response?.status === 404) {
      console.error("Endpoint not found — check with Varun if this API is ready");
    }
    return Promise.reject(error);
  }
);

export default api;