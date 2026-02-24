import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://api.nafisart.uz';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// api.interceptors.response.use(
//   (res) => res,
//   (error) => {
//     console.error('API Error:', error.response?.data || error.message);
//     return Promise.reject(error);
//   }
// );

export function getLocalizedField(item: Record<string, any>, field: string, lang: string): string {
  const cap = lang.charAt(0).toUpperCase() + lang.slice(1);
  return item[`${field}${cap}`] || item[`${field}Uz`] || '';
}
