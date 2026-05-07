const BASE_URL = window._env_?.VITE_API_URL || import.meta.env.VITE_API_URL || '/api';

const handleResponse = async (res) => {
  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    throw new Error(errBody.error || `Error ${res.status}: ${res.statusText}`);
  }
  if (res.status === 204) return null;
  return res.json();
};

export const pedidosService = {
  getAll: () =>
    fetch(`${BASE_URL}/pedidos`).then(handleResponse),

  getById: (id) =>
    fetch(`${BASE_URL}/pedidos/${id}`).then(handleResponse),

  create: (data) =>
    fetch(`${BASE_URL}/pedidos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),

  patchEstado: (id, estado) =>
    fetch(`${BASE_URL}/pedidos/${id}/estado?estado=${estado}`, {
      method: 'PATCH',
    }).then(handleResponse),
};
