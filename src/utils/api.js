import axios from "axios";

const TOKEN_KEY = "access_token";

export const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function storeToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function getTokenPayload() {
  const token = getStoredToken();
  if (!token) return null;

  try {
    const payload = token.split(".")[1];
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(normalized));
  } catch {
    return null;
  }
}

export function getErrorMessage(error, fallback = "Something went wrong. Please try again.") {
  const data = error?.response?.data;

  if (typeof data === "string" && data.trim()) {
    return data;
  }

  if (data?.detail) {
    if (typeof data.detail === "string") {
      return data.detail;
    }
    if (Array.isArray(data.detail)) {
      return data.detail
        .map((item) => item.msg || item.detail || JSON.stringify(item))
        .join(", ");
    }
  }

  if (error?.code === "ERR_NETWORK" || (error?.request && !error?.response)) {
    return "Cannot reach the server. Make sure the FastAPI backend is running on http://localhost:8000.";
  }

  if (error?.response?.status === 400) {
    return "Request failed. This product ID may already exist.";
  }

  return error?.message || fallback;
}

function throwIfBackendReturnedException(data) {
  // Some backend paths return an HTTPException object instead of raising it.
  if (
    data &&
    typeof data === "object" &&
    data.detail &&
    typeof data.status_code === "number" &&
    data.status_code >= 400
  ) {
    const error = new Error(data.detail);
    error.response = { data, status: data.status_code };
    throw error;
  }
}

export async function registerUser(payload) {
  const { data } = await api.post("/register", payload);
  throwIfBackendReturnedException(data);
  return data;
}

export async function loginUser(payload) {
  const { data } = await api.post("/login", payload);
  if (data?.access_token) {
    storeToken(data.access_token);
  }
  return data;
}

export async function fetchProducts() {
  const { data } = await api.get("/products");
  return Array.isArray(data?.products) ? data.products : [];
}

export async function createProduct(product) {
  const { data } = await api.post("/products", product);
  return data;
}

export async function updateProduct(productId, product) {
  const { data } = await api.put(`/products/${productId}`, product);
  return data;
}

export async function deleteProduct(productId) {
  const { data } = await api.delete(`/products/${productId}`);
  return data;
}
