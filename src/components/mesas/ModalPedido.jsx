import { formatPrecio, calcularTotal } from '../../utils/format';

export function ModalPedido({ mesa, pedidos, onClose }) {
  const items = pedidos[mesa.numero] || [];

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">📋 Pedido — Mesa {mesa.numero}</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          {items.length === 0 ? (
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
                  {items.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.item}</td>
                      <td className="text-center">{item.cantidad}</td>
                      <td className="text-right col-precio-unit">{formatPrecio(item.precio)}</td>
                      <td className="text-right font-bold">{formatPrecio(item.precio * item.cantidad)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="total-row">
                <span className="total-label">Total:</span>
                <span className="total-value">{formatPrecio(calcularTotal(items))}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
