import axios from 'axios';

// Create an Axios instance with standard configuration
export const api = axios.create({
  baseURL: 'http://localhost:5000',
  // withCredentials is required to send cookies (like session IDs) with every request
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});
