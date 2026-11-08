const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// One small wrapper so every call sends the cookie and reports errors the same way.
async function request(path, { method = 'GET', body } = {}) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    credentials: 'include', // send the HTTP-only cookie
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // empty or non-JSON response, that's fine
  }

  if (!res.ok) {
    const err = new Error(data?.error || 'Something went wrong. Please try again.');
    err.status = res.status;
    throw err;
  }
  return data;
}

export const api = {
  signup: (email, password) => request('/api/auth/signup', { method: 'POST', body: { email, password } }),
  login: (email, password) => request('/api/auth/login', { method: 'POST', body: { email, password } }),
  logout: () => request('/api/auth/logout', { method: 'POST' }),
  me: () => request('/api/auth/me'),
  getNotes: () => request('/api/notes'),
  createNote: (note) => request('/api/notes', { method: 'POST', body: note }),
  updateNote: (id, note) => request(`/api/notes/${id}`, { method: 'PUT', body: note }),
  deleteNote: (id) => request(`/api/notes/${id}`, { method: 'DELETE' }),
};
