import axios from 'axios';

// Proxy is set in vite.config.js, so we hit /api natively
const backendApi = axios.create({
  baseURL: '/api',
  withCredentials: true, // Send cookies (JWT) automatically
});

export default backendApi;
