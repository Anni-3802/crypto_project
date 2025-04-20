import axios from 'axios';
import { getToken } from '../utils/auth';
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
})


api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});



export const loginUser = async (data) => {
  return api.post(`/auth/login`, data);
};

export const signupUser = async (data) => {
  return api.post(`/auth/signup`, data);
};

export const getDashboard = async () => {
  return api.get('/protected/dashboard');
};


