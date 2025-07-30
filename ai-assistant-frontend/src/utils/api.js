import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000'; // Django server URL

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
  withCredentials: true,
});

export const sendQuery = async (functionType, style, query) => {
  try {
    const response = await apiClient.post('/api/query/', {
      function_type: functionType,
      style: style,
      query: query
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'API request failed');
  }
};

export const submitFeedback = async (feedbackData) => {
  try {
    const response = await apiClient.post('/api/feedback/', feedbackData);
    return response.data;
  } catch (error) {
    throw new Error('Failed to submit feedback');
  }
};

export const getFeedbackStats = async () => {
  try {
    const response = await apiClient.get('/api/feedback-stats/');
    // console.log('API Utils - Raw response:', response.data);
    
    // Make sure we're returning the right data structure
    if (response.data.success) {
      // console.log('API Utils - Returning:', response.data.data);
      return response.data.data; // This should have total_feedback, function_stats etc.
    } else {
      return response.data;
    }
  } catch (error) {
    // console.error('API Utils Error:', error);
    throw new Error(error.response?.data?.error || 'Failed to get feedback stats');
  }
};