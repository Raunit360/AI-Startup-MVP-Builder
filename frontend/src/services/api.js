
import axios from 'axios';

/**
 * Axios instance configured for local and production API requests
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 45000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor to normalize success and error responses
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    let message = 'An unexpected error occurred. Please try again.';

    if (error.response) {
      const resData = error.response.data;

      if (resData?.error?.message) {
        message = resData.error.message;
      } else if (resData?.message) {
        message = resData.message;
      } else if (typeof resData === 'string') {
        message = resData;
      }
    } else if (
      error.code === 'ECONNABORTED' ||
      error.code === 'ETIMEDOUT'
    ) {
      message = 'Request timed out. Please try again.';
    } else if (error.request) {
      message =
        'Unable to connect to the server. Please check if the backend is running.';
    } else if (error.message) {
      message = error.message;
    }

    const enhancedError = new Error(message);
    enhancedError.originalError = error;
    enhancedError.statusCode = error.response?.status;
    enhancedError.details =
      error.response?.data?.error?.details || null;

    return Promise.reject(enhancedError);
  }
);

/**
 * API service endpoints
 */

// Dashboard
export const getDashboardStats = async () => {
  return await api.get('/dashboard/stats');
};

// Get all projects
export const getProjects = async (params = {}) => {
  const queryParams =
    typeof params === 'string'
      ? { search: params }
      : params;

  return await api.get('/projects', {
    params: queryParams,
  });
};

// Get a single project
export const getProjectById = async (id) => {
  return await api.get(`/projects/${id}`);
};

// Create project
export const createProject = async (data) => {
  return await api.post('/projects', data);
};

// Update project
export const updateProject = async (id, data) => {
  return await api.put(`/projects/${id}`, data);
};

// Delete project
export const deleteProject = async (id) => {
  return await api.delete(`/projects/${id}`);
};

// Generate MVP Plan
// Uses a 3-minute timeout because Gemini AI generation takes longer.
export const generatePlan = async (id) => {
  return await api.post(
    `/projects/${id}/generate-plan`,
    undefined,
    {
      timeout: 180000,
    }
  );
};

// Get generated MVP Plan
export const getPlan = async (id) => {
  return await api.get(`/projects/${id}/plan`);
};

// Analyze startup idea
export const analyzeIdea = async (data) => {
  return await api.post('/ai/analyze', data);
};

// Export configured Axios instance
export default api;
