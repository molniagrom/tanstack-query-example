export const baseUrl = import.meta.env.DEV
  ? import.meta.env.VITE_BASE_URL
  : '/api/1.0/'
export const apiKey = import.meta.env.DEV ? import.meta.env.VITE_BASE_API_KEY : ''