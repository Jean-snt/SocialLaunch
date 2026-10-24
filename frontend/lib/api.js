/**
 * SocialLaunch API Client & Helper
 * Garantiza autenticación JWT consistente (Bearer Token + Cookies) y constantes oficiales.
 */

export const OFFICIAL_WHATSAPP_NUMBER = "+51991488770";
export const OFFICIAL_WHATSAPP_URL = "https://wa.me/+51991488770";

export function getApiUrl() {
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
}

export function getAuthToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("sociallaunch_token");
}

export function setAuthSession(token, user) {
  if (typeof window === "undefined") return;
  if (token) {
    localStorage.setItem("sociallaunch_token", token);
    // Establecer cookie accesible también para el navegador
    document.cookie = `token=${token}; path=/; max-age=604800; SameSite=Lax`;
  }
  if (user) {
    localStorage.setItem("sociallaunch_user", JSON.stringify(user));
  }
}

export function clearAuthSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("sociallaunch_token");
  localStorage.removeItem("sociallaunch_user");
  document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
}

export async function authFetch(endpoint, options = {}) {
  const apiUrl = getApiUrl();
  const url = endpoint.startsWith("http") ? endpoint : `${apiUrl}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  const token = getAuthToken();
  const headers = {
    ...(options.headers || {}),
  };

  // Si no es FormData, fijar Content-Type JSON si hay body
  if (!(options.body instanceof FormData) && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  // Inyectar Bearer Token para asegurar paso por CORS y evitar bloqueos de cookie
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const fetchOptions = {
    ...options,
    headers,
    credentials: "include", // Enviar también cookies si están disponibles
  };

  const response = await fetch(url, fetchOptions);
  let data;
  try {
    data = await response.json();
  } catch (err) {
    data = { success: false, message: "Error al procesar la respuesta del servidor" };
  }

  return { ok: response.ok, status: response.status, data };
}

export async function recordVisit(slug = "/", device = "mobile") {
  const apiUrl = getApiUrl();
  try {
    return await fetch(`${apiUrl}/dashboard/visit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, device }),
    });
  } catch (e) {
    return null;
  }
}

export async function recordLead(payload = {}) {
  const apiUrl = getApiUrl();
  try {
    return await fetch(`${apiUrl}/dashboard/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (e) {
    return null;
  }
}
