const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Small helper for talking to the backend.
// Usage: api('/stores'), api('/auth/login', { method: 'POST', body: { email, password } })
export async function api(path, options = {}) {
  const token = localStorage.getItem('token');

  const response = await fetch(API_URL + path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await response.json().catch(() => ({}));

  // token is old or invalid -> send the user back to login
  if (response.status === 401 && token) {
    localStorage.clear();
    window.location.href = '/login';
  }

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  return data;
}

// { name: 'abc', email: '' } -> "?name=abc"   (empty values are skipped)
export function toQuery(params) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) query.append(key, value);
  });
  const text = query.toString();
  return text ? `?${text}` : '';
}
