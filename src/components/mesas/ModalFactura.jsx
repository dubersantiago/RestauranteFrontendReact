import { formatPrecio, calcularTotal } from '../../utils/format';

export function ModalFactura({ mesa, pedidos, onClose }) {
  const items    = pedidos[mesa.numero] || [];
  const subtotal = calcularTotal(items);
  const iva      = Math.round(subtotal * 0.19);
  const total    = subtotal + iva;

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">🧾 Factura — Mesa {mesa.numero}</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
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
                FAC-{String(mesa.numero).padStart(4, '0')}-{new Date().getFullYear()}
              </span>
            </div>
            <div className="factura-row">
              <span className="factura-label">Mesa:</span>
              <span className="factura-val">Mesa {mesa.numero}</span>
            </div>
            <div className="factura-row">
              <span className="factura-label">Fecha:</span>
              <span className="factura-val">{new Date().toLocaleDateString('es-CO')}</span>
            </div>
            <div className="factura-row">
              <span className="factura-label">Hora:</span>
              <span className="factura-val">{new Date().toLocaleTimeString('es-CO')}</span>
            </div>
          </div>

          <div className="divider" />

          {items.length === 0 ? (
            <p style={{ color: '#475569', textAlign: 'center', padding: '20px 0' }}>
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
                  {items.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.item}</td>
                      <td className="text-center">{item.cantidad}</td>
                      <td className="text-right">{formatPrecio(item.precio * item.cantidad)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="divider" />

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
            </>
          )}

          <div className="factura-footer">¡Gracias por su visita! Vuelva pronto 🙏</div>
        </div>
      </div>
    </div>
  );
}
