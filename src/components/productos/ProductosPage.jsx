import { useState, useEffect } from 'react';
import { formatPrecio } from '../../utils/format';
import { productosService } from '../../services/productosService';
import { categoriasService } from '../../services/categoriasService';
import { ModalProducto } from './ModalProducto';
import { ConfirmarEliminar } from './ConfirmarEliminar';

export function ProductosPage() {
  const [productos, setProductos]             = useState([]);
  const [categorias, setCategorias]           = useState([]);
  const [cargando, setCargando]               = useState(true);
  const [error, setError]                     = useState(null);
  const [categoriaFiltro, setCategoriaFiltro] = useState(null); // null = Todas
  const [modalProducto, setModalProducto]     = useState(null);
  const [confirmarEliminar, setConfirmarEliminar] = useState(null);

  // ── GET /productos y GET /categorias en paralelo ────────
  useEffect(() => {
    setCargando(true);
    setError(null);
    Promise.all([productosService.getAll(), categoriasService.getAll()])
      .then(([prods, cats]) => {
        setProductos(prods);
        setCategorias(cats);
      })
      .catch(err => setError(err.message))
      .finally(() => setCargando(false));
  }, []);

  const productosFiltrados = categoriaFiltro === null
    ? productos
    : productos.filter(p => p.categoria === categoriaFiltro);

  // ── POST /prodcutos ─────────────────────────────────────
  const crearProducto = async (formData) => {
    try {
      const nuevo = await productosService.create(formData);
      setProductos(prev => [...prev, nuevo]);
      setModalProducto(null);
    } catch (err) {
      alert(`Error al crear producto: ${err.message}`);
    }
  };

  // ── PUT /prodcutos/:id ──────────────────────────────────
  const editarProducto = async (formData) => {
    try {
      const actualizado = await productosService.update(formData.id, formData);
      setProductos(prev => prev.map(p => p.id === formData.id ? actualizado : p));
      setModalProducto(null);
    } catch (err) {
      alert(`Error al editar producto: ${err.message}`);
    }
  };

  // ── DELETE /prodcutos/:id ───────────────────────────────
  const eliminarProducto = async (id) => {
    try {
      await productosService.delete(id);
      setProductos(prev => prev.filter(p => p.id !== id));
      setConfirmarEliminar(null);
    } catch (err) {
      alert(`Error al eliminar producto: ${err.message}`);
    }
  };

  // ── RENDER ──────────────────────────────────────────────
  return (
    <div>
      <div className="page-toolbar">
        <h2 className="page-title">Productos</h2>
        <button className="btn-agregar" onClick={() => setModalProducto({ modo: 'crear' })}>
          + Nuevo Producto
        </button>
      </div>

      {/* Tabs de categorías del backend */}
      {!cargando && !error && categorias.length > 0 && (
        <div className="categoria-tabs">
          <button
            className={`categoria-tab ${categoriaFiltro === null ? 'active' : ''}`}
            onClick={() => setCategoriaFiltro(null)}
          >
            Todas
          </button>
          {categorias.map(cat => (
            <button
              key={cat.id}
              className={`categoria-tab ${categoriaFiltro === cat.nombre ? 'active' : ''}`}
              onClick={() => setCategoriaFiltro(cat.nombre)}
            >
              {cat.nombre}
            </button>
          ))}
        </div>
      )}

      {/* Estado de carga / error */}
      {cargando && (
        <div className="empty-state">
          <span className="empty-icon">⏳</span>
          <span>Cargando productos...</span>
        </div>
      )}

      {!cargando && error && (
        <div className="empty-state">
          <span className="empty-icon">⚠️</span>
          <span>No se pudieron cargar los productos.</span>
          <span className="error-detail">{error}</span>
          <button
            className="btn-agregar"
            style={{ marginTop: 12 }}
            onClick={() => {
              setCargando(true);
              setError(null);
              Promise.all([productosService.getAll(), categoriasService.getAll()])
                .then(([prods, cats]) => { setProductos(prods); setCategorias(cats); })
                .catch(e => setError(e.message))
                .finally(() => setCargando(false));
            }}
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Grid */}
      {!cargando && !error && (
        <div className="productos-grid">
          {productosFiltrados.length === 0 && (
            <div className="empty-state">
              <span className="empty-icon">📦</span>
              <span>No hay productos en esta categoría.</span>
            </div>
          )}

          {productosFiltrados.map(producto => (
            <div key={producto.id} className="producto-card">
              <div className="producto-card-top">
                <span className="producto-categoria-badge">
                  {producto.categoria}
                </span>
                <span className={`stock-badge ${producto.stock === 0 ? 'sin-stock' : ''}`}>
                  📦 {producto.stock} en stock
                </span>
              </div>

              <div className="producto-nombre">{producto.nombre}</div>

              <div className="producto-footer">
                <span className="producto-precio">{formatPrecio(producto.precio)}</span>
                <div className="producto-actions">
                  <button
                    className="btn-icon-action edit"
                    onClick={() => setModalProducto({ modo: 'editar', producto })}
                    title="Editar"
                  >✏️</button>
                  <button
                    className="btn-icon-action delete"
                    onClick={() => setConfirmarEliminar(producto)}
                    title="Eliminar"
                  >🗑️</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalProducto && (
        <ModalProducto
          modo={modalProducto.modo}
          initialData={modalProducto.producto}
          onGuardar={modalProducto.modo === 'crear' ? crearProducto : editarProducto}
          onCerrar={() => setModalProducto(null)}
        />
      )}

      {confirmarEliminar && (
        <ConfirmarEliminar
          nombre={confirmarEliminar.nombre}
          onConfirmar={() => eliminarProducto(confirmarEliminar.id)}
          onCancelar={() => setConfirmarEliminar(null)}
        />
      )}
    </div>
  );
}
