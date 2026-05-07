import { useState, useEffect, useCallback } from 'react';
import { pedidosService } from '../../services/pedidosService';
import { formatFecha, formatHora, formatPrecio } from '../../utils/format';

const ESTADOS = ['PENDIENTE', 'EN_PREPARACION', 'LISTO', 'ENTREGADO', 'CANCELADO'];

const ESTADO_CONFIG = {
  PENDIENTE:       { label: 'Pendiente',       icon: '📋', color: 'amarillo',   next: 'EN_PREPARACION' },
  EN_PREPARACION:  { label: 'En preparación',  icon: '🔥', color: 'naranja',    next: 'LISTO' },
  LISTO:           { label: 'Listo',           icon: '✅', color: 'verde',      next: 'ENTREGADO' },
  ENTREGADO:       { label: 'Entregado',       icon: '🍽️', color: 'gris',       next: null },
  CANCELADO:       { label: 'Cancelado',       icon: '❌', color: 'rojo',       next: null },
};

const COLORES = {
  amarillo: { bg: 'rgba(250,204,21,0.10)', border: 'rgba(250,204,21,0.30)', text: '#fde68a' },
  naranja:  { bg: 'rgba(251,146,60,0.10)', border: 'rgba(251,146,60,0.30)', text: '#fdba74' },
  verde:    { bg: 'rgba(74,222,128,0.10)', border: 'rgba(74,222,128,0.30)', text: '#86efac' },
  rojo:     { bg: 'rgba(248,113,113,0.10)', border: 'rgba(248,113,113,0.30)', text: '#fca5a5' },
  gris:     { bg: 'rgba(148,163,184,0.08)', border: 'rgba(148,163,184,0.20)', text: '#94a3b8' },
};

export function CocinaPage() {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  const cargar = useCallback(() => {
    setCargando(true);
    setError(null);
    pedidosService.getAll()
      .then(data => setPedidos(data))
      .catch(err => setError(err.message))
      .finally(() => setCargando(false));
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3500);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const avanzarEstado = async (id, estadoActual) => {
    const next = ESTADO_CONFIG[estadoActual]?.next;
    if (!next) return;
    try {
      await pedidosService.patchEstado(id, next);
      setPedidos(prev =>
        prev.map(p => p.id === id ? { ...p, estado: next } : p)
      );
      setToast({ type: 'ok', msg: `Pedido #${String(id).padStart(4, '0')} → ${ESTADO_CONFIG[next].label}` });
    } catch (err) {
      setToast({ type: 'err', msg: err.message });
    }
  };

  const cambiarEstado = async (id, nuevoEstado) => {
    try {
      await pedidosService.patchEstado(id, nuevoEstado);
      setPedidos(prev =>
        prev.map(p => p.id === id ? { ...p, estado: nuevoEstado } : p)
      );
      setToast({ type: 'ok', msg: `Pedido #${String(id).padStart(4, '0')} → ${ESTADO_CONFIG[nuevoEstado].label}` });
    } catch (err) {
      setToast({ type: 'err', msg: err.message });
    }
  };

  const estadosActivos = ESTADOS.filter(e => e !== 'CANCELADO');
  const pedidosFiltrados = pedidos.filter(p => p.estado !== 'CANCELADO');
  const pedidosCancelados = pedidos.filter(p => p.estado === 'CANCELADO');

  if (cargando) {
    return (
      <div className="empty-state" style={{ padding: '60px 20px' }}>
        <span className="empty-icon">⏳</span>
        <span>Cargando pedidos...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="empty-state" style={{ padding: '60px 20px' }}>
        <span className="empty-icon">⚠️</span>
        <span>Error al cargar los pedidos.</span>
        <span className="error-detail">{error}</span>
        <button className="btn-agregar" style={{ marginTop: 12 }} onClick={cargar}>Reintentar</button>
      </div>
    );
  }

  return (
    <div>
      <div className="page-toolbar">
        <h2 className="page-title">🔥 Cocina</h2>
        <button className="btn-agregar" onClick={cargar}>↻ Actualizar</button>
      </div>

      <div className="cocina-board">
        {estadosActivos.map(estado => {
          const conf = ESTADO_CONFIG[estado];
          const col = COLORES[conf.color];
          const pedidosCol = pedidosFiltrados.filter(p => p.estado === estado);

          return (
            <div key={estado} className="cocina-columna">
              <div
                className="cocina-columna-header"
                style={{ background: col.bg, borderColor: col.border }}
              >
                <span className="cocina-col-icon">{conf.icon}</span>
                <span className="cocina-col-titulo">{conf.label}</span>
                <span
                  className="cocina-col-count"
                  style={{ background: col.border, color: col.text }}
                >
                  {pedidosCol.length}
                </span>
              </div>

              <div className="cocina-columna-body">
                {pedidosCol.length === 0 && (
                  <div className="cocina-vacio">Sin pedidos</div>
                )}
                {pedidosCol.map(pedido => (
                  <div key={pedido.id} className="cocina-pedido-card">
                    <div className="cocina-pedido-top">
                      <span className="cocina-pedido-id">
                        #{String(pedido.id).padStart(4, '0')}
                      </span>
                      <span className="cocina-pedido-hora">
                        {formatHora(pedido.fecha)}
                      </span>
                    </div>

                    <div className="cocina-pedido-items">
                      {pedido.detalles?.map((d, idx) => (
                        <div key={idx} className="cocina-pedido-item">
                          <span className="cocina-item-cantidad">{d.cantidad}x</span>
                          <span className="cocina-item-nombre">{d.productoNombre || d.nombre || 'Producto'}</span>
                        </div>
                      ))}
                    </div>

                    <div className="cocina-pedido-footer">
                      <span className="cocina-pedido-total">{formatPrecio(pedido.total)}</span>
                      {conf.next && (
                        <button
                          className="btn-avanzar"
                          onClick={() => avanzarEstado(pedido.id, pedido.estado)}
                        >
                          {ESTADO_CONFIG[conf.next].icon} {ESTADO_CONFIG[conf.next].label}
                        </button>
                      )}
                    </div>

                    <details className="cocina-pedido-detalle">
                      <summary className="cocina-detalle-toggle">Ver detalle</summary>
                      <div className="cocina-detalle-acciones">
                        {ESTADOS.filter(e => e !== estado).map(e => (
                          <button
                            key={e}
                            className={`btn-estado btn-estado-${COLORES[ESTADO_CONFIG[e].color] === COLORES[conf.color] ? 'actual' : ''}`}
                            onClick={() => cambiarEstado(pedido.id, e)}
                            disabled={e === estado}
                          >
                            {ESTADO_CONFIG[e].icon} {ESTADO_CONFIG[e].label}
                          </button>
                        ))}
                      </div>
                    </details>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {pedidosCancelados.length > 0 && (
        <div className="cocina-cancelados">
          <h3 className="cocina-cancelados-titulo">❌ Cancelados ({pedidosCancelados.length})</h3>
          <div className="cocina-cancelados-list">
            {pedidosCancelados.map(p => (
              <div key={p.id} className="cocina-cancelado-item">
                <span>#{String(p.id).padStart(4, '0')}</span>
                <span>{formatFecha(p.fecha)} {formatHora(p.fecha)}</span>
                <span>{formatPrecio(p.total)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {toast && (
        <div className={`toast-cocina toast-${toast.type}`} onClick={() => setToast(null)}>
          {toast.type === 'ok' ? <span>✅</span> : <span>⚠️</span>}
          <span>{toast.msg}</span>
        </div>
      )}
    </div>
  );
}
