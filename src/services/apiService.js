import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api/';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const createRoot = (stateOutcome) =>
  axiosInstance.post('create_root/', { stateOutcome });

export const expandNode = (outcomeID, stateAdditionalContext) =>
  axiosInstance.post('expand/', { outcomeID, stateAdditionalContext });

//export const getTree = () => axiosInstance.get('tree/');
export const getTree = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}tree/`);
    return response.data;
  } catch (error) {
    console.error("Error in getTree:", error.response?.data || error.message);
    throw error;
  }
};
export const resetTree = () => axiosInstance.post('reset/');