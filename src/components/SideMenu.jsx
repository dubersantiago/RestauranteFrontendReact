import React from 'react'

export const SideMenu = ({ isOpen, onClose, onNavigate, paginaActiva }) => {
  return (
    <>
      {/* Backdrop */}
      {isOpen && <div className="sidemenu-backdrop" onClick={onClose} />}

      {/* Panel */}
      <aside className={`sidemenu ${isOpen ? 'sidemenu-open' : ''}`}>
        <div className="sidemenu-header">
          <span className="sidemenu-logo">🍽️</span>
          <span className="sidemenu-brand">SazonSoft</span>
          <button className="sidemenu-close" onClick={onClose} aria-label="Cerrar menú">✕</button>
        </div>

        <nav className="sidemenu-nav">
          <button
            className={`sidemenu-item ${paginaActiva === 'pedidos' ? 'active' : ''}`}
            onClick={() => { onNavigate('pedidos'); onClose(); }}
          >
            <span className="sidemenu-item-icon">🧾</span>
            <span>Pedidos</span>
          </button>
          <button
            className={`sidemenu-item ${paginaActiva === 'cocina' ? 'active' : ''}`}
            onClick={() => { onNavigate('cocina'); onClose(); }}
          >
            <span className="sidemenu-item-icon">🔥</span>
            <span>Cocina</span>
          </button>
          <button
            className={`sidemenu-item ${paginaActiva === 'productos' ? 'active' : ''}`}
            onClick={() => { onNavigate('productos'); onClose(); }}
          >
            <span className="sidemenu-item-icon">🛍️</span>
            <span>Productos</span>
          </button>
          <button
            className={`sidemenu-item ${paginaActiva === 'categorias' ? 'active' : ''}`}
            onClick={() => { onNavigate('categorias'); onClose(); }}
          >
            <span className="sidemenu-item-icon">🏷️</span>
            <span>Categorías</span>
          </button>
        </nav>

        <div className="sidemenu-footer">
          <span>Beta V0.0.1</span>
        </div>
      </aside>
    </>
  )
}

export default SideMenu;