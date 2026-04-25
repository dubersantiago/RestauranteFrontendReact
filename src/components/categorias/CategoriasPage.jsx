import { useState, useEffect } from 'react';
import { categoriasService } from '../../services/categoriasService';
import { ModalCategoria } from './ModalCategoria';

export function CategoriasPage() {
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando]     = useState(true);
  const [error, setError]           = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);

  const cargar = () => {
    setCargando(true);
    setError(null);
    categoriasService.getAll()
      .then(data => setCategorias(data))
      .catch(err => setError(err.message))
      .finally(() => setCargando(false));
  };

  useEffect(() => { cargar(); }, []);

  const crearCategoria = async (data) => {
    const nueva = await categoriasService.create(data);
    setCategorias(prev => [...prev, nueva]);
    setModalAbierto(false);
  };

  return (
    <div>
      <div className="page-toolbar">
        <h2 className="page-title">Categorías</h2>
        <button className="btn-agregar" onClick={() => setModalAbierto(true)}>
          + Nueva Categoría
        </button>
      </div>

      {cargando && (
        <div className="empty-state" style={{ padding: '60px 20px' }}>
          <span className="empty-icon">⏳</span>
          <span>Cargando categorías...</span>
        </div>
      )}

      {!cargando && error && (
        <div className="empty-state" style={{ padding: '60px 20px' }}>
          <span className="empty-icon">⚠️</span>
          <span>No se pudieron cargar las categorías.</span>
          <span className="error-detail">{error}</span>
          <button className="btn-agregar" style={{ marginTop: 12 }} onClick={cargar}>
            Reintentar
          </button>
        </div>
      )}

      {!cargando && !error && (
        <div className="categorias-grid">
          {categorias.length === 0 && (
            <div className="empty-state">
              <span className="empty-icon">🏷️</span>
              <span>No hay categorías registradas.</span>
            </div>
          )}

          {categorias.map(cat => (
            <div key={cat.id} className="categoria-card">
              <span className="categoria-card-id">#{cat.id}</span>
              <span className="categoria-card-nombre">{cat.nombre}</span>
            </div>
          ))}
        </div>
      )}

      {modalAbierto && (
        <ModalCategoria
          onGuardar={crearCategoria}
          onCerrar={() => setModalAbierto(false)}
        />
      )}
    </div>
  );
}
