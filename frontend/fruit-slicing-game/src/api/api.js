import axios from 'axios';

// Base URL for the API
const BASE_URL = 'https://c6cc0fdba61255fd299b49cf3496b786.serveo.net'; // Buraya kendi API URL'nizi ekleyin

// Create an instance of axios
const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// API methods
const apiMethods = {
    // GET request
    get: async (endpoint, params = {}) => {
        try {
            const response = await api.get(endpoint, { params });
            return response;
        } catch (error) {
            console.error('GET request error:', error);
            throw error;
        }
    },

    // POST request
    post: async (endpoint, data) => {
        try {
            const response = await api.post(endpoint, data);
            return response;
        } catch (error) {
            console.error('POST request error:', error);
            throw error;
        }
    },

    // PUT request
    put: async (endpoint, data) => {
        try {
            const response = await api.put(endpoint, data);
            return response;
        } catch (error) {
            console.error('PUT request error:', error);
            throw error;
        }
    },

    // DELETE request
    delete: async (endpoint) => {
        try {
            const response = await api.delete(endpoint);
            return response;
        } catch (error) {
            console.error('DELETE request error:', error);
            throw error;
        }
    },
};

export default apiMethods;
