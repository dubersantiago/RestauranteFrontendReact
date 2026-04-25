const BASE = import.meta.env.VITE_API_URL;

const handleResponse = async (res) => {
  if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
  return res.json();
};

export const categoriasService = {
  getAll: () =>
    fetch(`${BASE}/categorias`).then(handleResponse),

  create: (data) =>
    fetch(`${BASE}/categorias`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),
};
