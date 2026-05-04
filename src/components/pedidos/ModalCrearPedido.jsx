import { useState, useEffect } from 'react';
import { productosService } from '../../services/productosService';
import { formatPrecio } from '../../utils/format';

export function ModalCrearPedido({ onCrear, onCerrar }) {
  const [lineas, setLineas]       = useState([{ productoId: '', cantidad: 1 }]);
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando]   = useState(true);
  const [errorProd, setErrorProd] = useState(false);
  const [enviando, setEnviando]   = useState(false);
  const [error, setError]         = useState(null);

  useEffect(() => {
    productosService.getAll()
      .then(data => setProductos(data))
      .catch(() => setErrorProd(true))
      .finally(() => setCargando(false));
  }, []);

  const setLinea = (idx, field, value) =>
    setLineas(prev => prev.map((l, i) => i === idx ? { ...l, [field]: value } : l));

  const agregarLinea = () =>
    setLineas(prev => [...prev, { productoId: '', cantidad: 1 }]);

  const eliminarLinea = (idx) =>
    setLineas(prev => prev.filter((_, i) => i !== idx));

  const totalPreview = lineas.reduce((acc, l) => {
    const prod = productos.find(p => p.id === Number(l.productoId));
    return (!prod || !l.cantidad) ? acc : acc + prod.precio * Number(l.cantidad);
  }, 0);

  const puedeEnviar = lineas.length > 0 &&
    lineas.every(l => l.productoId && Number(l.cantidad) > 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!puedeEnviar) return;
    setEnviando(true);
    setError(null);
    try {
      await onCrear({
        detalles: lineas.map(l => ({
          productoId: Number(l.productoId),
          cantidad:   Number(l.cantidad),
        })),
      });
    } catch (err) {
      setError(err.message);
      setEnviando(false);
    }
  };

  return (
    <div className="overlay" onClick={onCerrar}>
      <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">🛒 Nuevo Pedido</h2>
          <button className="close-btn" onClick={onCerrar}>✕</button>
        </div>
        <div className="modal-body">
          {cargando && (
            <div className="empty-state">
              <span className="empty-icon">⏳</span>
              <span>Cargando productos...</span>
            </div>
          )}

          {!cargando && errorProd && (
            <div className="empty-state">
              <span className="empty-icon">⚠️</span>
              <span>No se pudieron cargar los productos.</span>
            </div>
          )}

          {!cargando && !errorProd && (
            <form onSubmit={handleSubmit} className="producto-form">

              <div className="pedido-lineas-header">
                <span>Producto</span>
                <span>Cant.</span>
                <span>Subtotal</span>
              </div>

              <div className="pedido-lineas">
                {lineas.map((linea, idx) => {
                  const prodSel = productos.find(p => p.id === Number(linea.productoId));
                  return (
                    <div key={idx} className="pedido-linea">
                      <select
                        className="form-select"
                        value={linea.productoId}
                        onChange={e => setLinea(idx, 'productoId', e.target.value)}
                      >
                        <option value="">Selecciona un producto</option>
                        {productos.map(p => (
                          <option key={p.id} value={p.id}>
                            {p.nombre} — {formatPrecio(p.precio)}
                          </option>
                        ))}
                      </select>

                      <input
                        className="form-input linea-cantidad"
                        type="number"
                        min="1"
                        value={linea.cantidad}
                        onChange={e => setLinea(idx, 'cantidad', e.target.value)}
                      />

                      <span className="linea-subtotal">
                        {prodSel && linea.cantidad
                          ? formatPrecio(prodSel.precio * Number(linea.cantidad))
                          : '—'}
                      </span>

                      <button
                        type="button"
                        className="btn-icon-action delete"
                        onClick={() => eliminarLinea(idx)}
                        disabled={lineas.length === 1}
                        title="Quitar ítem"
                      >✕</button>
                    </div>
                  );
                })}
              </div>

              <button type="button" className="btn-agregar-linea" onClick={agregarLinea}>
                + Agregar ítem
              </button>

              {totalPreview > 0 && (
                <div className="total-row">
                  <span className="total-label">Total estimado:</span>
                  <span className="total-value">{formatPrecio(totalPreview)}</span>
                </div>
              )}

              {error && <span className="form-error">{error}</span>}

              <div className="form-actions">
                <button type="button" className="btn-cancelar" onClick={onCerrar}>
                  Cancelar
                </button>
                <button type="submit" className="btn-agregar" disabled={!puedeEnviar || enviando}>
                  {enviando ? 'Creando...' : 'Crear Pedido'}
                </button>
              </div>

            </form>
          )}
        </div>
      </div>
    </div>
  );
}
