import { formatPrecio, formatFecha, formatHora } from '../../utils/format';

export function ModalDetallePedido({ pedido, onClose }) {
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            📋 Pedido #{String(pedido.id).padStart(4, '0')}
          </h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="factura-detalle">
            <div className="factura-row">
              <span className="factura-label">Fecha:</span>
              <span className="factura-val">{formatFecha(pedido.fecha)}</span>
            </div>
            <div className="factura-row">
              <span className="factura-label">Hora:</span>
              <span className="factura-val">{formatHora(pedido.fecha)}</span>
            </div>
            <div className="factura-row">
              <span className="factura-label">Ítems:</span>
              <span className="factura-val">{pedido.detalles.length}</span>
            </div>
          </div>

          <div className="divider" />

          <table className="data-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th className="text-center">Cant.</th>
                <th className="text-right col-precio-unit">Precio Unit.</th>
                <th className="text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {pedido.detalles.map((d, idx) => (
                <tr key={idx}>
                  <td>{d.nombreProducto}</td>
                  <td className="text-center">{d.cantidad}</td>
                  <td className="text-right col-precio-unit">
                    {formatPrecio(d.precioUnitario)}
                  </td>
                  <td className="text-right font-bold">
                    {formatPrecio(d.precioUnitario * d.cantidad)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="total-row">
            <span className="total-label">Total:</span>
            <span className="total-value">{formatPrecio(pedido.total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
