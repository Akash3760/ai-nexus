import axios from "axios";
import { ENV } from "@/config/env";

const api = axios.create({
    baseURL: ENV.API_BASE_URL,

    headers: {
        "Content-Type": "application/json",
    },

    withCredentials: true,
});

// Attach JWT token automatically
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export default api;