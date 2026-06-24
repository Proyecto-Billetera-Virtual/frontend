const PROXY_URL = import.meta.env.VITE_API_PROXY_URL;

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${PROXY_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Si el token es inválido o expiró, lo limpiamos y mandamos al login
  if (response.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/";
    return;
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Error en la petición");
  }

  return data;
}