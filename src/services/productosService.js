const BASE_URL = window._env_?.VITE_API_URL || import.meta.env.VITE_API_URL || '/api';

const handleResponse = async (res) => {
  if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
  // DELETE devuelve 204 sin cuerpo
  if (res.status === 204) return null;
  return res.json();
};

export const productosService = {
  getAll: () =>
    fetch(`${BASE_URL}/productos`).then(handleResponse),

  create: (data) =>
    fetch(`${BASE_URL}/productos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),

  update: (id, data) =>
    fetch(`${BASE_URL}/productos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),

  delete: (id) =>
    fetch(`${BASE_URL}/productos/${id}`, { method: 'DELETE' }).then(handleResponse),
};
