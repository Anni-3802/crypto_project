import axios from 'axios';
import { getToken } from '../utils/auth';

const BASE_URL = 'http://localhost:5000/api/auth';

export const loginUser = async (data) => {
  return axios.post(`${BASE_URL}/login`, data);
};

export const signupUser = async (data) => {
  return axios.post(`${BASE_URL}/signup`, data);
};

export const getDashboard = async () => {
  return axios.get('http://localhost:5000/api/protected/dashboard', {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });
};
