import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_AGORA_TOKEN_ENDPOINT || 'http://localhost:5000';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  // If you later want cookies across domains enable this
  // withCredentials: true,
});

export default api;

// attach token from localStorage for authenticated requests
api.interceptors.request.use((config) => {
  try {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token')
      if (token) {
        config.headers = config.headers || {}
        ;(config.headers as any).Authorization = `Bearer ${token}`
      }
    }
  } catch (e) {
    // ignore
  }
  return config
})
