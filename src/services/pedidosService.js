const BASE = import.meta.env.VITE_API_URL;

const handleResponse = async (res) => {
  if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
  if (res.status === 204) return null;
  return res.json();
};

export const pedidosService = {
  getAll: () =>
    fetch(`${BASE}/pedidos`).then(handleResponse),

  getById: (id) =>
    fetch(`${BASE}/pedidos/${id}`).then(handleResponse),

  create: (data) =>
    fetch(`${BASE}/pedidos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),
};
