const BASE = '/api';

async function req<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(BASE + url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Network error' }));
    throw new Error(err.error || 'Request gagal');
  }
  return res.json();
}

export const api = {
  auth: {
    login: (email: string, password: string) =>
      req('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  },

  bins: {
    getAll: () => req('/bins'),
    create: (data: object) => req('/bins', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: object) => req(`/bins/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => req(`/bins/${id}`, { method: 'DELETE' }),
    collect: (id: string, data: object) =>
      req(`/bins/${id}/collect`, { method: 'POST', body: JSON.stringify(data) }),
  },

  users: {
    getAll: () => req('/users'),
    create: (data: object) => req('/users', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: object) => req(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    patchStatus: (id: string, status: string) =>
      req(`/users/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  },

  reports: {
    getAll: () => req('/reports'),
    create: (data: object) => req('/reports', { method: 'POST', body: JSON.stringify(data) }),
    updateStatus: (id: string, status: string) =>
      req(`/reports/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  },

  collections: {
    getAll: () => req('/collections'),
  },

  sensors: {
    getAll: () => req('/sensors'),
  },
};
