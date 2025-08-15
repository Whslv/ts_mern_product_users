import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

export const register = (username: string, email: string, password: string) =>
  API.post("auth/register", { username, email, password });

export const login = (email: string, password: string) =>
  API.post("auth/login", { email, password });

export const logout = () => API.post("auth/logout");

export const getMe = () => API.get('/me');

export const getDashboard = () => API.get(`/dashboard`);
