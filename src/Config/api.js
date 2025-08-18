import { baseUrl } from "./Urls.js";
import axios from "axios";

// Create a single axios instance with optimized defaults
const apiClient = axios.create({
    baseURL: baseUrl,
    timeout: 30000, // Reduced from 40000
    headers: {
        'Accept': 'application/json',
    }
});

// Request cache with TTL
const requestCache = new Map();
const CACHE_TTL = 2 * 60 * 1000; // 2 minutes

// In-flight request tracking to prevent duplicates
const pendingRequests = new Map();

// Helper function to get auth token
const getAuthToken = () => {
    try {
        const user = JSON.parse(localStorage.getItem("user"));
        return user?.accessToken || "";
    } catch {
        return "";
    }
};

// Helper function to create cache key
const createCacheKey = (url, params = {}, method = 'get') => {
    return `${method}:${url}:${JSON.stringify(params)}`;
};

// Helper function to check cache validity
const getCachedResponse = (cacheKey) => {
    const cached = requestCache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
        return cached.data;
    }
    if (cached) {
        requestCache.delete(cacheKey);
    }
    return null;
};

// Request interceptor
apiClient.interceptors.request.use(
    (config) => {
        // Set authorization header
        const authToken = getAuthToken();
        if (authToken) {
            config.headers.Authorization = authToken;
        }

        // Only set content-type for requests with data
        if (config.data && !config.headers['Content-Type']) {
            config.headers['Content-Type'] = 'application/json';
        }

        // For GET requests, check cache first
        if (config.method === 'get') {
            const cacheKey = createCacheKey(config.url, config.params);
            const cachedData = getCachedResponse(cacheKey);
            
            if (cachedData) {
                // Return a resolved promise with cached data
                config.adapter = () => Promise.resolve({
                    data: cachedData,
                    status: 200,
                    statusText: 'OK',
                    headers: {},
                    config,
                    request: {}
                });
            }
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for caching
apiClient.interceptors.response.use(
    (response) => {
        // Cache successful GET responses
        if (response.config.method === 'get' && response.status === 200) {
            const cacheKey = createCacheKey(response.config.url, response.config.params);
            requestCache.set(cacheKey, {
                data: response.data,
                timestamp: Date.now()
            });
        }
        return response;
    },
    (error) => {
        console.error("API Error:", error.response?.data || error.message);
        return Promise.reject(error);
    }
);

// Debounced request function to prevent duplicate requests
const makeRequest = async (requestKey, requestFn) => {
    if (pendingRequests.has(requestKey)) {
        return pendingRequests.get(requestKey);
    }

    const request = requestFn().finally(() => {
        pendingRequests.delete(requestKey);
    });

    pendingRequests.set(requestKey, request);
    return request;
};

export const uploadImage = async (image) => {
    try {
        const formData = new FormData();
        formData.append("images", image);
        
        const response = await apiClient.post("/api/jobs/saveImage", formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error uploading image:", error);
        throw error;
    }
};

export const createJob = async (jobData) => {
    try {
        const response = await apiClient.post("/api/preChecks", jobData);
        
        // Invalidate related cache entries
        const cacheKeysToDelete = Array.from(requestCache.keys()).filter(key => 
            key.includes('/api/preChecks') && key.startsWith('get:')
        );
        cacheKeysToDelete.forEach(key => requestCache.delete(key));
        
        return response.data;
    } catch (error) {
        console.error("Error creating job:", error);
        throw error;
    }
};

export const updateJobs = async (jobData) => {
    try {
        const response = await apiClient.put(`/api/preChecks/${jobData.id}`, jobData);
        
        // Invalidate related cache entries
        const cacheKeysToDelete = Array.from(requestCache.keys()).filter(key => 
            key.includes('/api/preChecks')
        );
        cacheKeysToDelete.forEach(key => requestCache.delete(key));
        
        return response.data;
    } catch (error) {
        console.error("Error updating job:", error);
        throw error;
    }
};

export const deleteJob = async (jobId) => {
    try {
        const response = await apiClient.delete(`/api/preChecks/${jobId}`);
        
        // Invalidate related cache entries
        const cacheKeysToDelete = Array.from(requestCache.keys()).filter(key => 
            key.includes('/api/preChecks')
        );
        cacheKeysToDelete.forEach(key => requestCache.delete(key));
        
        return response.data;
    } catch (error) {
        console.error("Error deleting job:", error);
        throw error;
    }
};

export const fetchJobs = async (params = {}) => {
    const requestKey = `fetchJobs:${JSON.stringify(params)}`;
    
    return makeRequest(requestKey, async () => {
        try {
            const response = await apiClient.get("/api/preChecks", { params });
            return response.data;
        } catch (error) {
            console.error("Error fetching jobs:", error);
            throw error;
        }
    });
};

export const getJobById = async (jobId) => {
    const requestKey = `getJobById:${jobId}`;
    
    return makeRequest(requestKey, async () => {
        try {
            const response = await apiClient.get(`/api/preChecks/${jobId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching job:", error);
            throw error;
        }
    });
};

// Utility function to clear cache manually if needed
export const clearCache = () => {
    requestCache.clear();
    pendingRequests.clear();
};

// Utility function to preload critical data
export const preloadCriticalData = async () => {
    try {
        // Preload the most commonly used data
        await fetchJobs({ limit: 20 }); // Adjust based on your needs
    } catch (error) {
        console.error("Error preloading data:", error);
    }
};