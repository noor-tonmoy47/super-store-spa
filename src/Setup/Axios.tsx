import axios from "axios";

const API_BASE_URL: string = import.meta.env.PRODUCT_API_BASE_URL || 'https://localhost:7133/api/v1'

export const axiosInstance = axios.create({
    baseURL : API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});