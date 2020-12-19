import Axios, { AxiosRequestConfig } from 'axios';
import Auth from '../Auth';

export const http = Axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});

http.interceptors.request.use((config: AxiosRequestConfig) => {
  if (Auth.getToken()) {
    config.headers.Authorization = `Bearer ${Auth.getToken()}`;
  }

  return config;
});
