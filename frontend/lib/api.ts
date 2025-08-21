import axios from "axios";
import { ProductDto } from "./types/product.dto";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

export const register = (username: string, email: string, password: string) =>
  API.post("auth/register", { username, email, password });
export const login = (email: string, password: string) =>
  API.post("auth/login", { email, password });
export const logout = () => API.post("auth/logout");

export const getMe = () => API.get("/me");
export const getDashboard = () => API.get("/dashboard");

export const getListOfProducts = (params?: {
  page?: number;
  limit?: number;
  query?: string;
}) => API.get("/products", { params });

export const createProduct = (payload: ProductDto) => {
  API.post("/products", payload);
};
export const getProduct = (id: string) => {
  API.get(`/products/${id}`);
};
export const updateProduct = (
  id: string,
  payload: Partial<ProductDto>
) => {
  API.patch(`/products/${id}`, payload);
};
export const deleteProduct = (id: string) => {
  API.delete(`/products/${id}`);
};
