import { getAuth } from "../auth/authStorage";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export async function apiFetch(path, options = {}) {
  const auth = getAuth();
  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");

  if (auth?.token) {
    headers.set("Authorization", `Bearer ${auth.token}`);
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const message = data?.message || `Request failed with ${res.status}`;
    throw new Error(message);
  }

  return data;
}
