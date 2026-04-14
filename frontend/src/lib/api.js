const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000";


async function request(path, options) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
}

export function loadSettings() {
  return request("/api/settings");
}

export function updateSettings(settings) {
  return request("/api/settings", {
    method: "PUT",
    body: JSON.stringify(settings),
  });
}

export function loadSessions() {
  return request("/api/sessions");
}

export function createSession(payload) {
  return request("/api/sessions", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
