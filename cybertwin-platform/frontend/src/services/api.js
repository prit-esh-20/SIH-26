import axios from "axios";

/**
 * Centralized API configuration.
 *
 * VITE_USE_MOCK=true  → all services resolve from the deterministic mock layer
 *                       (works with no backend — required for the demo).
 * VITE_USE_MOCK=false → services call the FastAPI backend at VITE_API_BASE_URL.
 */
export const USE_MOCK = (import.meta.env.VITE_USE_MOCK ?? "true") !== "false";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

export function mockDelay(ms = 450) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function isMockMode() {
  return USE_MOCK;
}
