import axios from "axios";


const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3300",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

export default apiClient;