const BASE_URL = window._env_?.VITE_API_URL || import.meta.env.VITE_API_URL || '/api';

const handleResponse = async (res) => {
  if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
  return res.json();
};

export const categoriasService = {
  getAll: () =>
    fetch(`${BASE_URL}/categorias`).then(handleResponse),

  create: (data) =>
    fetch(`${BASE_URL}/categorias`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),
};
