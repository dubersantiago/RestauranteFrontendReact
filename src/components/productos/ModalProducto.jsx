import { useState, useEffect } from 'react';
import { categoriasService } from '../../services/categoriasService';

const FORM_VACIO = {
  nombre:           '',
  precio:           '',
  stock:            '',
  fechaVencimiento: '',
  categoriaId:      '',
};

export function ModalProducto({ modo, initialData, onGuardar, onCerrar }) {
  const [form, setForm] = useState(
    initialData
      ? {
          nombre:           initialData.nombre,
          precio:           String(initialData.precio),
          stock:            String(initialData.stock ?? ''),
          fechaVencimiento: initialData.fechaVencimiento ?? '',
          categoriaId:      '',  // se resuelve tras cargar las categorías
        }
      : FORM_VACIO
  );
  const [errors, setErrors]                   = useState({});
  const [categorias, setCategorias]           = useState([]);
  const [cargandoCats, setCargandoCats]       = useState(true);
  const [errorCats, setErrorCats]             = useState(false);

  // Carga categorías al abrir el modal
  useEffect(() => {
    categoriasService.getAll()
      .then(data => {
        setCategorias(data);
        // En modo editar: pre-seleccionar la categoría por nombre
        if (initialData?.categoria) {
          const match = data.find(c => c.nombre === initialData.categoria);
          if (match) setForm(prev => ({ ...prev, categoriaId: String(match.id) }));
        }
      })
      .catch(() => setErrorCats(true))
      .finally(() => setCargandoCats(false));
  }, []);

  const set = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const errs = {};
    if (!form.nombre.trim())
      errs.nombre = 'El nombre es requerido';
    if (!form.precio || isNaN(Number(form.precio)) || Number(form.precio) <= 0)
      errs.precio = 'Ingresa un precio válido mayor a 0';
    if (form.stock === '' || isNaN(Number(form.stock)) || Number(form.stock) < 0)
      errs.stock = 'Ingresa un stock válido (mínimo 0)';
    if (!form.fechaVencimiento)
      errs.fechaVencimiento = 'La fecha de vencimiento es requerida';
    if (!form.categoriaId)
      errs.categoriaId = 'Selecciona una categoría';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onGuardar({
      ...(initialData ? { id: initialData.id } : {}),
      nombre:           form.nombre.trim(),
      precio:           Number(form.precio),
      stock:            Number(form.stock),
      fechaVencimiento: form.fechaVencimiento,
      categoriaId:      Number(form.categoriaId),
    });
  };

  return (
    <div className="overlay" onClick={onCerrar}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {modo === 'crear' ? '➕ Nuevo Producto' : '✏️ Editar Producto'}
          </h2>
          <button className="close-btn" onClick={onCerrar}>✕</button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit} className="producto-form">

            <div className="form-group">
              <label className="form-label">Nombre *</label>
              <input
                className={`form-input ${errors.nombre ? 'input-error' : ''}`}
                value={form.nombre}
                onChange={e => set('nombre', e.target.value)}
                placeholder="Ej: Bandeja Paisa"
                maxLength={80}
              />
              {errors.nombre && <span className="form-error">{errors.nombre}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Precio (COP) *</label>
                <input
                  className={`form-input ${errors.precio ? 'input-error' : ''}`}
                  type="number"
                  min="0"
                  value={form.precio}
                  onChange={e => set('precio', e.target.value)}
                  placeholder="Ej: 28000"
                />
                {errors.precio && <span className="form-error">{errors.precio}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Stock *</label>
                <input
                  className={`form-input ${errors.stock ? 'input-error' : ''}`}
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={e => set('stock', e.target.value)}
                  placeholder="Ej: 20"
                />
                {errors.stock && <span className="form-error">{errors.stock}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Fecha de vencimiento *</label>
                <input
                  className={`form-input ${errors.fechaVencimiento ? 'input-error' : ''}`}
                  type="date"
                  value={form.fechaVencimiento}
                  onChange={e => set('fechaVencimiento', e.target.value)}
                />
                {errors.fechaVencimiento && <span className="form-error">{errors.fechaVencimiento}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Categoría *</label>
                {errorCats ? (
                  <span className="form-error">No se pudieron cargar las categorías</span>
                ) : (
                  <select
                    className={`form-select ${errors.categoriaId ? 'input-error' : ''}`}
                    value={form.categoriaId}
                    onChange={e => set('categoriaId', e.target.value)}
                    disabled={cargandoCats}
                  >
                    <option value="">
                      {cargandoCats ? 'Cargando...' : 'Selecciona una categoría'}
                    </option>
                    {categorias.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                    ))}
                  </select>
                )}
                {errors.categoriaId && <span className="form-error">{errors.categoriaId}</span>}
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn-cancelar" onClick={onCerrar}>
                Cancelar
              </button>
              <button type="submit" className="btn-agregar" disabled={cargandoCats}>
                {modo === 'crear' ? 'Crear Producto' : 'Guardar Cambios'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
