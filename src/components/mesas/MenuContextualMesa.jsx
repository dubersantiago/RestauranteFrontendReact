export function MenuContextualMesa({
  mesa, menuRef, onClose,
  onCambiarEstado, onVerPedido, onFacturacion, onEliminar,
}) {
  return (
    <div className="overlay" onClick={onClose}>
      <div
        ref={menuRef}
        className="menu-contextual"
        onClick={e => e.stopPropagation()}
      >
        <div className="menu-header">
          <span className="menu-title">Mesa {mesa.numero}</span>
          <span className={`menu-estado ${mesa.estado}`}>
            {mesa.estado === 'ocupado' ? 'Ocupada' : 'Libre'}
          </span>
        </div>
        <div className="menu-opciones">
          <button className="menu-btn" onClick={onCambiarEstado}>
            <span className="menu-btn-icon">🔄</span>
            Cambiar a {mesa.estado === 'libre' ? 'Ocupada' : 'Libre'}
          </button>
          <button className="menu-btn" onClick={onVerPedido}>
            <span className="menu-btn-icon">📋</span>
            Ver Pedido
          </button>
          <button className="menu-btn" onClick={onFacturacion}>
            <span className="menu-btn-icon">🧾</span>
            Facturación
          </button>
          <button className="menu-btn danger" onClick={onEliminar}>
            <span className="menu-btn-icon">🗑️</span>
            Eliminar Mesa
          </button>
        </div>
      </div>
    </div>
  );
}
