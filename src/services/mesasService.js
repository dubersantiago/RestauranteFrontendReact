const BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Reemplazar cada función con la llamada fetch real al integrar el backend
export const mesasService = {
  getAll: () =>
    fetch(`${BASE_URL}/mesas`).then(r => r.json()),

  create: (data) =>
    fetch(`${BASE_URL}/mesas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(r => r.json()),

  update: (id, data) =>
    fetch(`${BASE_URL}/mesas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(r => r.json()),

  delete: (id) =>
    fetch(`${BASE_URL}/mesas/${id}`, { method: 'DELETE' }),
};
