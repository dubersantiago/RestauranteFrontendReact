import { useState, useRef, useEffect } from "react";
import "./App.css";

const mockPedidos = {
  1: [
    { item: "Bandeja Paisa",     cantidad: 2, precio: 28000 },
    { item: "Limonada de Coco",  cantidad: 2, precio: 8000  },
    { item: "Arroz con Pollo",   cantidad: 1, precio: 22000 },
  ],
  2: [
    { item: "Churrasco",         cantidad: 1, precio: 45000 },
    { item: "Cerveza Águila",    cantidad: 3, precio: 7000  },
  ],
  3: [
    { item: "Cazuela de Mariscos", cantidad: 2, precio: 38000 },
    { item: "Agua Mineral",        cantidad: 2, precio: 4000  },
    { item: "Postre del Día",      cantidad: 2, precio: 12000 },
  ],
};

const formatPrecio = (precio) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(precio);

const calcularTotal = (items) =>
  items.reduce((acc, i) => acc + i.precio * i.cantidad, 0);

export default function TableManager() {
  const [mesas, setMesas] = useState([
    { id: 1, numero: 1, estado: "libre"   },
    { id: 2, numero: 2, estado: "ocupado" },
    { id: 3, numero: 3, estado: "libre"   },
  ]);
  const [pedidos]             = useState(mockPedidos);
  const [menuAbierto, setMenuAbierto]           = useState(null);
  const [modalPedido, setModalPedido]           = useState(null);
  const [modalFactura, setModalFactura]         = useState(null);
  const [confirmarEliminar, setConfirmarEliminar] = useState(null);
  const menuRef = useRef(null);

  /* Cierra el menú al tocar fuera */
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target))
        setMenuAbierto(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const agregarMesa = () => {
    const siguiente = mesas.length ? Math.max(...mesas.map((m) => m.numero)) + 1 : 1;
    setMesas([...mesas, { id: Date.now(), numero: siguiente, estado: "libre" }]);
  };

  const cambiarEstado = (id) => {
    setMesas(mesas.map((m) =>
      m.id === id ? { ...m, estado: m.estado === "libre" ? "ocupado" : "libre" } : m
    ));
    setMenuAbierto(null);
  };

  const eliminarMesa = (id) => {
    setMesas(mesas.filter((m) => m.id !== id));
    setConfirmarEliminar(null);
  };

  const getPedido = (numero) => pedidos[numero] || [];
  const mesaActiva = menuAbierto ? mesas.find((m) => m.id === menuAbierto) : null;

  return (
    <div className="app-container">

      {/* ── HEADER ── */}
      <header className="header">
        <div className="header-left">
          <div className="logo-icon">🍽️</div>
          <div>
            <h1 className="header-title">Gestión de Mesas</h1>
            <p className="header-subtitle">SazonSoft Beta V0.0.1</p>
          </div>
        </div>
        <div className="header-right">
          <div className="stat-badge">
            <span className="dot dot-green" />
            <span>{mesas.filter((m) => m.estado === "libre").length} Libres</span>
          </div>
          <div className="stat-badge">
            <span className="dot dot-red" />
            <span>{mesas.filter((m) => m.estado === "ocupado").length} Ocupadas</span>
          </div>
          <button className="btn-agregar" onClick={agregarMesa}>
            + Agregar Mesa
          </button>
        </div>
      </header>

      {/* ── GRID ── */}
      <div className="mesas-grid">
        {mesas.length === 0 && (
          <div className="empty-state">
            <span className="empty-icon">🪑</span>
            <span>No hay mesas. ¡Agrega una!</span>
          </div>
        )}
        {mesas.map((mesa) => (
          <div
            key={mesa.id}
            className={`mesa-card ${mesa.estado}`}
            onClick={() => setMenuAbierto(menuAbierto === mesa.id ? null : mesa.id)}
          >
            <div className="mesa-icon-wrap">🪑</div>
            <div className="mesa-numero">Mesa {mesa.numero}</div>
            <div className={`estado-badge ${mesa.estado}`}>
              {mesa.estado === "ocupado" ? "● Ocupada" : "● Libre"}
            </div>
          </div>
        ))}
      </div>

      {/* ── MENÚ CONTEXTUAL ── */}
      {menuAbierto && mesaActiva && (
        <div className="overlay" onClick={() => setMenuAbierto(null)}>
          <div
            ref={menuRef}
            className="menu-contextual"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="menu-header">
              <span className="menu-title">Mesa {mesaActiva.numero}</span>
              <span className={`menu-estado ${mesaActiva.estado}`}>
                {mesaActiva.estado === "ocupado" ? "Ocupada" : "Libre"}
              </span>
            </div>
            <div className="menu-opciones">
              <button className="menu-btn" onClick={() => cambiarEstado(mesaActiva.id)}>
                <span className="menu-btn-icon">🔄</span>
                Cambiar a {mesaActiva.estado === "libre" ? "Ocupada" : "Libre"}
              </button>
              <button
                className="menu-btn"
                onClick={() => { setModalPedido(mesaActiva); setMenuAbierto(null); }}
              >
                <span className="menu-btn-icon">📋</span>
                Ver Pedido
              </button>
              <button
                className="menu-btn"
                onClick={() => { setModalFactura(mesaActiva); setMenuAbierto(null); }}
              >
                <span className="menu-btn-icon">🧾</span>
                Facturación
              </button>
              <button
                className="menu-btn danger"
                onClick={() => { setConfirmarEliminar(mesaActiva); setMenuAbierto(null); }}
              >
                <span className="menu-btn-icon">🗑️</span>
                Eliminar Mesa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL PEDIDO ── */}
      {modalPedido && (
        <div className="overlay" onClick={() => setModalPedido(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">📋 Pedido — Mesa {modalPedido.numero}</h2>
              <button className="close-btn" onClick={() => setModalPedido(null)}>✕</button>
            </div>
            <div className="modal-body">
              {getPedido(modalPedido.numero).length === 0 ? (
                <div className="empty-state">
                  <span className="empty-icon">🍽️</span>
                  <span>No hay pedidos para esta mesa.</span>
                </div>
              ) : (
                <>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Ítem</th>
                        <th className="text-center">Cant.</th>
                        <th className="text-right col-precio-unit">Precio Unit.</th>
                        <th className="text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getPedido(modalPedido.numero).map((item, idx) => (
                        <tr key={idx}>
                          <td>{item.item}</td>
                          <td className="text-center">{item.cantidad}</td>
                          <td className="text-right col-precio-unit">
                            {formatPrecio(item.precio)}
                          </td>
                          <td className="text-right font-bold">
                            {formatPrecio(item.precio * item.cantidad)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="total-row">
                    <span className="total-label">Total:</span>
                    <span className="total-value">
                      {formatPrecio(calcularTotal(getPedido(modalPedido.numero)))}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL FACTURA ── */}
      {modalFactura && (
        <div className="overlay" onClick={() => setModalFactura(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">🧾 Factura — Mesa {modalFactura.numero}</h2>
              <button className="close-btn" onClick={() => setModalFactura(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="factura-header">
                <span className="factura-logo">🍽️</span>
                <div className="factura-info">
                  <strong>Restaurante El Sabor</strong>
                  <span>NIT: 900.123.456-7</span>
                  <span>Calle 45 #23-10, Bucaramanga</span>
                </div>
              </div>

              <div className="factura-detalle">
                <div className="factura-row">
                  <span className="factura-label">Factura N°:</span>
                  <span className="factura-val">
                    FAC-{String(modalFactura.numero).padStart(4, "0")}-{new Date().getFullYear()}
                  </span>
                </div>
                <div className="factura-row">
                  <span className="factura-label">Mesa:</span>
                  <span className="factura-val">Mesa {modalFactura.numero}</span>
                </div>
                <div className="factura-row">
                  <span className="factura-label">Fecha:</span>
                  <span className="factura-val">{new Date().toLocaleDateString("es-CO")}</span>
                </div>
                <div className="factura-row">
                  <span className="factura-label">Hora:</span>
                  <span className="factura-val">{new Date().toLocaleTimeString("es-CO")}</span>
                </div>
              </div>

              <div className="divider" />

              {getPedido(modalFactura.numero).length === 0 ? (
                <p style={{ color: "#475569", textAlign: "center", padding: "20px 0" }}>
                  No hay ítems para facturar.
                </p>
              ) : (
                <>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Descripción</th>
                        <th className="text-center">Cant.</th>
                        <th className="text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getPedido(modalFactura.numero).map((item, idx) => (
                        <tr key={idx}>
                          <td>{item.item}</td>
                          <td className="text-center">{item.cantidad}</td>
                          <td className="text-right">{formatPrecio(item.precio * item.cantidad)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="divider" />

                  {(() => {
                    const subtotal = calcularTotal(getPedido(modalFactura.numero));
                    const iva      = Math.round(subtotal * 0.19);
                    const total    = subtotal + iva;
                    return (
                      <div className="factura-resumen">
                        <div className="factura-row">
                          <span className="factura-label">Subtotal:</span>
                          <span className="factura-val">{formatPrecio(subtotal)}</span>
                        </div>
                        <div className="factura-row">
                          <span className="factura-label">IVA (19%):</span>
                          <span className="factura-val">{formatPrecio(iva)}</span>
                        </div>
                        <div className="total-row" style={{ marginTop: 10 }}>
                          <span className="total-label">TOTAL:</span>
                          <span className="total-value">{formatPrecio(total)}</span>
                        </div>
                      </div>
                    );
                  })()}
                </>
              )}

              <div className="factura-footer">¡Gracias por su visita! Vuelva pronto 🙏</div>
            </div>
          </div>
        </div>
      )}

      {/* ── CONFIRMAR ELIMINAR ── */}
      {confirmarEliminar && (
        <div className="overlay">
          <div className="modal modal-sm">
            <div className="modal-header">
              <h2 className="modal-title">⚠️ Confirmar eliminación</h2>
            </div>
            <div className="confirm-body">
              <p className="confirm-msg">
                ¿Estás seguro que deseas eliminar la{" "}
                <strong>Mesa {confirmarEliminar.numero}</strong>?
              </p>
              <p className="confirm-hint">Esta acción no se puede deshacer.</p>
              <div className="confirm-actions">
                <button className="btn-cancelar" onClick={() => setConfirmarEliminar(null)}>
                  Cancelar
                </button>
                <button className="btn-eliminar" onClick={() => eliminarMesa(confirmarEliminar.id)}>
                  Sí, eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}