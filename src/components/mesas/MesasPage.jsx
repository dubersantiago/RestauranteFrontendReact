import { useState, useRef, useEffect } from 'react';
import { GridMesas } from '../GridMesas';
import { MenuContextualMesa } from './MenuContextualMesa';
import { ModalPedido } from './ModalPedido';
import { ModalFactura } from './ModalFactura';
import { ModalConfirmarEliminar } from './ModalConfirmarEliminar';

// TODO: reemplazar con mesasService.getAll() al integrar backend
const MESAS_INICIAL = [
  { id: 1, numero: 1, estado: 'libre'   },
  { id: 2, numero: 2, estado: 'ocupado' },
  { id: 3, numero: 3, estado: 'libre'   },
];

// TODO: reemplazar con datos reales del pedido activo de cada mesa
const mockPedidos = {
  1: [
    { item: 'Bandeja Paisa',     cantidad: 2, precio: 28000 },
    { item: 'Limonada de Coco',  cantidad: 2, precio: 8000  },
    { item: 'Arroz con Pollo',   cantidad: 1, precio: 22000 },
  ],
  2: [
    { item: 'Churrasco',         cantidad: 1, precio: 45000 },
    { item: 'Cerveza Águila',    cantidad: 3, precio: 7000  },
  ],
  3: [
    { item: 'Cazuela de Mariscos', cantidad: 2, precio: 38000 },
    { item: 'Agua Mineral',        cantidad: 2, precio: 4000  },
    { item: 'Postre del Día',      cantidad: 2, precio: 12000 },
  ],
};

export function MesasPage() {
  const [mesas, setMesas]                       = useState(MESAS_INICIAL);
  const [pedidos]                               = useState(mockPedidos);
  const [menuAbierto, setMenuAbierto]           = useState(null);
  const [modalPedido, setModalPedido]           = useState(null);
  const [modalFactura, setModalFactura]         = useState(null);
  const [confirmarEliminar, setConfirmarEliminar] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target))
        setMenuAbierto(null);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // TODO: await mesasService.create(nueva) y actualizar estado con respuesta del servidor
  const agregarMesa = () => {
    const siguiente = mesas.length ? Math.max(...mesas.map(m => m.numero)) + 1 : 1;
    setMesas([...mesas, { id: Date.now(), numero: siguiente, estado: 'libre' }]);
  };

  // TODO: await mesasService.update(id, { estado: nuevoEstado })
  const cambiarEstado = (id) => {
    setMesas(mesas.map(m =>
      m.id === id ? { ...m, estado: m.estado === 'libre' ? 'ocupado' : 'libre' } : m
    ));
    setMenuAbierto(null);
  };

  // TODO: await mesasService.delete(id)
  const eliminarMesa = (id) => {
    setMesas(mesas.filter(m => m.id !== id));
    setConfirmarEliminar(null);
  };

  const mesasLibres   = mesas.filter(m => m.estado === 'libre').length;
  const mesasOcupadas = mesas.filter(m => m.estado === 'ocupado').length;
  const mesaActiva    = menuAbierto ? mesas.find(m => m.id === menuAbierto) : null;

  return (
    <div>
      <div className="page-toolbar">
        <h2 className="page-title">Mesas</h2>
        <div className="page-toolbar-right">
          <div className="stat-badge">
            <span className="dot dot-green" />
            <span>{mesasLibres} Libres</span>
          </div>
          <div className="stat-badge">
            <span className="dot dot-red" />
            <span>{mesasOcupadas} Ocupadas</span>
          </div>
          <button className="btn-agregar" onClick={agregarMesa}>+ Agregar Mesa</button>
        </div>
      </div>

      <GridMesas
        mesas={mesas}
        onMesaClick={(id) => setMenuAbierto(menuAbierto === id ? null : id)}
      />

      {menuAbierto && mesaActiva && (
        <MenuContextualMesa
          mesa={mesaActiva}
          menuRef={menuRef}
          onClose={() => setMenuAbierto(null)}
          onCambiarEstado={() => cambiarEstado(mesaActiva.id)}
          onVerPedido={() => { setModalPedido(mesaActiva); setMenuAbierto(null); }}
          onFacturacion={() => { setModalFactura(mesaActiva); setMenuAbierto(null); }}
          onEliminar={() => { setConfirmarEliminar(mesaActiva); setMenuAbierto(null); }}
        />
      )}

      {modalPedido && (
        <ModalPedido
          mesa={modalPedido}
          pedidos={pedidos}
          onClose={() => setModalPedido(null)}
        />
      )}

      {modalFactura && (
        <ModalFactura
          mesa={modalFactura}
          pedidos={pedidos}
          onClose={() => setModalFactura(null)}
        />
      )}

      {confirmarEliminar && (
        <ModalConfirmarEliminar
          mesa={confirmarEliminar}
          onConfirmar={() => eliminarMesa(confirmarEliminar.id)}
          onCancelar={() => setConfirmarEliminar(null)}
        />
      )}
    </div>
  );
}
