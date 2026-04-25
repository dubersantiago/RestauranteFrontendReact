export function ConfirmarEliminar({ nombre, onConfirmar, onCancelar }) {
  return (
    <div className="overlay">
      <div className="modal modal-sm">
        <div className="modal-header">
          <h2 className="modal-title">⚠️ Confirmar eliminación</h2>
        </div>
        <div className="confirm-body">
          <p className="confirm-msg">
            ¿Estás seguro que deseas eliminar <strong>{nombre}</strong>?
          </p>
          <p className="confirm-hint">Esta acción no se puede deshacer.</p>
          <div className="confirm-actions">
            <button className="btn-cancelar" onClick={onCancelar}>Cancelar</button>
            <button className="btn-eliminar" onClick={onConfirmar}>Sí, eliminar</button>
          </div>
        </div>
      </div>
    </div>
  );
}
