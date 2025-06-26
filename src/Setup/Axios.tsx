import axios from "axios";
import keycloakInstance from "./keycloak";

const API_BASE_URL: string = import.meta.env.PRODUCT_API_BASE_URL || 'https://localhost:7133/api/v1'

export const axiosInstance = axios.create({
    baseURL : API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

axiosInstance.interceptors.request.use(
  async config => {
    // Check if Keycloak is initialized and authenticated
    // Make sure 'keycloakInstance' is the actual Keycloak instance.
    // If you're using a Keycloak context or hook, you'll need to get the instance from there.
    if (keycloakInstance && keycloakInstance.authenticated && keycloakInstance.token) {
        config.headers.Authorization = `Bearer ${keycloakInstance.token}`;
    } else{
        keycloakInstance.logout();
    }
    return config;
  },
  error => {
    // Do something with request error
    return Promise.reject(error);
  }
);
