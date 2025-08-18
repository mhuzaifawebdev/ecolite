import { baseUrl } from "./Urls.js";
import axios from "axios";

// Create axios instance with default config to minimize preflight requests
const api = axios.create({
    baseURL: baseUrl,
    timeout: 40000,
    headers: {
        'Accept': 'application/json'
    }
});

// Request cache with 2-minute expiry
const requestCache = new Map();
const CACHE_DURATION = 120000; // 2 minutes

// Request deduplication
const pendingRequests = new Map();

// Add request interceptor
api.interceptors.request.use(
    (config) => {
        const USER = JSON.parse(localStorage.getItem("user")) || {};
        const AUTH_TOKEN = USER.accessToken || "";

        // Set authorization header
        config.headers.Authorization = AUTH_TOKEN;

        // Only handle GET requests for caching
        if (config.method === 'get') {
            const cacheKey = `${config.url}${JSON.stringify(config.params || {})}`;
            
            // Check cache first
            const cachedData = requestCache.get(cacheKey);
            if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
                return Promise.resolve({
                    ...config,
                    data: cachedData.data,
                    status: 200,
                    fromCache: true
                });
            }
            
            // Check for pending requests
            const pendingRequest = pendingRequests.get(cacheKey);
            if (pendingRequest) {
                return pendingRequest;
            }
        } else {
            // Only add Content-Type for non-GET requests
            config.headers['Content-Type'] = 'application/json';
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for caching
api.interceptors.response.use(
    (response) => {
        if (response.config.method === 'get' && !response.config.fromCache) {
            const cacheKey = `${response.config.url}${JSON.stringify(response.config.params || {})}`;
            requestCache.set(cacheKey, {
                data: response.data,
                timestamp: Date.now()
            });
            pendingRequests.delete(cacheKey);
        }
        return response;
    },
    (error) => Promise.reject(error)
);

export const fetchJobs = async (params) => {
    try {
        const response = await api.get('/api/preChecks', { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching jobs:", error);
        return null;
    }
};

export const getJobById = async (jobId) => {
    try {
        const response = await api.get(`/api/preChecks/${jobId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching job:", error);
        return null;
    }
};

export const createJob = async (jobData) => {
    try {
        const response = await api.post('/api/preChecks', jobData);
        return response.data;
    } catch (error) {
        console.error("Error creating job:", error);
        return error;
    }
};

export const updateJobs = async (jobData) => {
    try {
        const response = await api.put(`/api/preChecks/${jobData.id}`, jobData);
        return response.data;
    } catch (error) {
        console.error("Error updating job:", error);
        return null;
    }
};

export const deleteJob = async (jobId) => {
    try {
        const response = await api.delete(`/api/preChecks/${jobId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting job:", error);
        return null;
    }
};

export const uploadImage = async (image) => {
    try {
        const formData = new FormData();
        formData.append("images", image);
        
        const response = await api.post('/api/jobs/saveImage', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error uploading image:", error);
        return null;
    }
};
