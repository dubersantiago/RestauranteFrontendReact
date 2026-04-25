import React from 'react'

export const GridMesas = ({ mesas = [], onMesaClick }) => {
  return (
    <div className="mesas-grid">
        {mesas.length === 0 && (
          <div className="empty-state">
            <span className="empty-icon">🪑</span>
            <span>No hay mesas. ¡Agrega una!</span>
          </div>
        )}
        {mesas.map((mesa) => (
          <div
            key={mesa.id}
            className={`mesa-card ${mesa.estado}`}
            onClick={() => onMesaClick(mesa.id)}
          >
            <div className="mesa-icon-wrap">🪑</div>
            <div className="mesa-numero">Mesa {mesa.numero}</div>
            <div className={`estado-badge ${mesa.estado}`}>
              {mesa.estado === "ocupado" ? "● Ocupada" : "● Libre"}
            </div>
          </div>
        ))}
      </div>
  )
}

export default GridMesas;
