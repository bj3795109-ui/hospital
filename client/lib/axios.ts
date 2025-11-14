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
