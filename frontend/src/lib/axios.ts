import axios from 'axios';

const toCamelCase = (str: string): string =>
  str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());

const convertKeysToCamelCase = (obj: any): any => {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) return obj.map(convertKeysToCamelCase);
  if (typeof obj !== 'object') return obj;

  const result: Record<string, any> = {};
  for (const key of Object.keys(obj)) {
    result[toCamelCase(key)] = convertKeysToCamelCase(obj[key]);
  }
  return result;
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use((response) => {
  if (response.data && typeof response.data === 'object') {
    response.data = convertKeysToCamelCase(response.data);
  }
  return response;
});

export default api;
