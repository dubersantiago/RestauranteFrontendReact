import { useState, useEffect } from 'react';
import { pedidosService } from '../../services/pedidosService';
import { formatPrecio, formatFecha, formatHora } from '../../utils/format';
import { ModalDetallePedido } from './ModalDetallePedido';
import { ModalCrearPedido } from './ModalCrearPedido';

export function PedidosPage() {
  const [pedidos, setPedidos]               = useState([]);
  const [cargando, setCargando]             = useState(true);
  const [error, setError]                   = useState(null);
  const [detallePedido, setDetallePedido]   = useState(null);
  const [modalCrear, setModalCrear]         = useState(false);

  const cargar = () => {
    setCargando(true);
    setError(null);
    pedidosService.getAll()
      .then(data => setPedidos(data))
      .catch(err => setError(err.message))
      .finally(() => setCargando(false));
  };

  useEffect(() => { cargar(); }, []);

  const crearPedido = async (body) => {
    const nuevo = await pedidosService.create(body);
    setPedidos(prev => [nuevo, ...prev]);
    setModalCrear(false);
  };

  return (
    <div>
      <div className="page-toolbar">
        <h2 className="page-title">Pedidos</h2>
        <button className="btn-agregar" onClick={() => setModalCrear(true)}>
          + Nuevo Pedido
        </button>
      </div>

      {cargando && (
        <div className="empty-state" style={{ padding: '60px 20px' }}>
          <span className="empty-icon">⏳</span>
          <span>Cargando pedidos...</span>
        </div>
      )}

      {!cargando && error && (
        <div className="empty-state" style={{ padding: '60px 20px' }}>
          <span className="empty-icon">⚠️</span>
          <span>No se pudieron cargar los pedidos.</span>
          <span className="error-detail">{error}</span>
          <button className="btn-agregar" style={{ marginTop: 12 }} onClick={cargar}>
            Reintentar
          </button>
        </div>
      )}

      {!cargando && !error && (
        <div className="pedidos-lista">
          {pedidos.length === 0 && (
            <div className="empty-state">
              <span className="empty-icon">🧾</span>
              <span>No hay pedidos registrados.</span>
            </div>
          )}

          {pedidos.map(pedido => (
            <div
              key={pedido.id}
              className="pedido-card"
              onClick={() => setDetallePedido(pedido)}
              title="Click para ver detalles"
            >
              <div className="pedido-card-left">
                <span className="pedido-id">
                  #{String(pedido.id).padStart(4, '0')}
                </span>
                <div className="pedido-fecha-hora">
                  <span>{formatFecha(pedido.fecha)}</span>
                  <span className="pedido-hora">{formatHora(pedido.fecha)}</span>
                </div>
              </div>
              <div className="pedido-card-right">
                <span className="pedido-items-badge">
                  {pedido.detalles.length}{' '}
                  {pedido.detalles.length === 1 ? 'ítem' : 'ítems'}
                </span>
                <span className="pedido-total">{formatPrecio(pedido.total)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {detallePedido && (
        <ModalDetallePedido
          pedido={detallePedido}
          onClose={() => setDetallePedido(null)}
        />
      )}

      {modalCrear && (
        <ModalCrearPedido
          onCrear={crearPedido}
          onCerrar={() => setModalCrear(false)}
        />
      )}
    </div>
  );
}
