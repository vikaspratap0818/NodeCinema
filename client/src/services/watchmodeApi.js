import axios from 'axios';

const WATCHMODE_BASE_URL = 'https://api.watchmode.com/v1/';
const WATCHMODE_API_KEY = import.meta.env.VITE_WATCHMODE_API_KEY;

const watchmodeApi = axios.create({
  baseURL: WATCHMODE_BASE_URL,
  params: {
    apiKey: WATCHMODE_API_KEY,
  },
});

export default watchmodeApi;
