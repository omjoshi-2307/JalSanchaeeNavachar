import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const irrigationService = {
  generateSchedule: async (userId, formData) => {
    try {
      const response = await axios.post(`${API_URL}/generate-schedule`, {
        userId,
        formData
      });
      return response.data.schedule;
    } catch (error) {
      console.error('Error in irrigationService:', error);
      throw error.response?.data?.error || 'Failed to generate schedule';
    }
  }
};
