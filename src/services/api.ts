const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export async function apiFetch(
  path: string,
  options: RequestInit = {}
) {
  const token = localStorage.getItem('km_token');

  const headers = new Headers(options.headers);

  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));

    throw new Error(
      errorData.error ||
        errorData.message ||
        `API request failed: ${response.status}`
    );
  }

  return response.json();
}

export function getApiUrl() {
  return API_URL;
}