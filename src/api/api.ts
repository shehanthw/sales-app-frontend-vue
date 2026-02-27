import axios, { type AxiosInstance } from 'axios';

// Matches your FastAPI "check" response
export interface AuthCheckResponse {
  logged_in: boolean;
  email?: string;
  reason?: string;
}

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL!,
  withCredentials: true, // Required for HttpOnly cookies
});

export default api;