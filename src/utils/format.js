export const formatPrecio = (precio) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(precio);

export const calcularTotal = (items) =>
  items.reduce((acc, i) => acc + i.precio * i.cantidad, 0);

export const formatFecha = (isoString) => {
  if (!isoString) return '';
  return new Date(isoString).toLocaleDateString('es-CO', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
};

export const formatHora = (isoString) => {
  if (!isoString) return '';
  return new Date(isoString).toLocaleTimeString('es-CO', {
    hour: '2-digit', minute: '2-digit',
  });
};
