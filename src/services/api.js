const PROXY_URL = import.meta.env.VITE_API_PROXY_URL;

export function getUsuarioId() {
  return localStorage.getItem("usuario_id");
}

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem("token");
  const usuario_id = getUsuarioId();

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const body = options.body || (options.method !== "GET" ? null : null);

  const response = await fetch(`${PROXY_URL}${endpoint}`, {
    ...options,
    headers,
    ...(body && { body }),
  });

  if (response.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario_id");
    window.location.href = "/";
    return;
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Error en la petición");
  }

  return data;
}