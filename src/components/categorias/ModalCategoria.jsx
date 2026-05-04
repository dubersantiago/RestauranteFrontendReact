import { useState } from 'react';

export function ModalCategoria({ onGuardar, onCerrar }) {
  const [nombre, setNombre]   = useState('');
  const [error, setError]     = useState(null);
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) { setError('El nombre es requerido'); return; }
    setEnviando(true);
    setError(null);
    try {
      await onGuardar({ nombre: nombre.trim() });
    } catch (err) {
      setError(err.message);
      setEnviando(false);
    }
  };

  return (
    <div className="overlay" onClick={onCerrar}>
      <div className="modal modal-sm" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">🏷️ Nueva Categoría</h2>
          <button className="close-btn" onClick={onCerrar}>✕</button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit} className="producto-form">
            <div className="form-group">
              <label className="form-label">Nombre *</label>
              <input
                className={`form-input ${error ? 'input-error' : ''}`}
                value={nombre}
                onChange={e => { setNombre(e.target.value); setError(null); }}
                placeholder="Ej: Bebidas"
                maxLength={60}
                autoFocus
              />
              {error && <span className="form-error">{error}</span>}
            </div>

            <div className="form-actions">
              <button type="button" className="btn-cancelar" onClick={onCerrar}>
                Cancelar
              </button>
              <button type="submit" className="btn-agregar" disabled={enviando}>
                {enviando ? 'Guardando...' : 'Crear Categoría'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
