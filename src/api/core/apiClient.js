import axios from 'axios';

export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api', // Fallback for dev
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptors can be added here for auth tokens, etc.
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error);
        return Promise.reject(error);
    }
);
