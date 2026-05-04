const BASE = import.meta.env.VITE_API_URL;

const handleResponse = async (res) => {
  if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
  // DELETE devuelve 204 sin cuerpo
  if (res.status === 204) return null;
  return res.json();
};

export const productosService = {
  getAll: () =>
    fetch(`${BASE}/productos`).then(handleResponse),

  create: (data) =>
    fetch(`${BASE}/productos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),

  update: (id, data) =>
    fetch(`${BASE}/productos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),

  delete: (id) =>
    fetch(`${BASE}/productos/${id}`, { method: 'DELETE' }).then(handleResponse),
};
