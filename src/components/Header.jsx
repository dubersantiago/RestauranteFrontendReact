export function Header({ onMenuToggle }) {
  return (
    <header className="header">
      <div className="header-left">
        <button className="btn-hamburger" onClick={onMenuToggle} aria-label="Abrir menú">
          <span /><span /><span />
        </button>
        <div className="logo-icon">🍽️</div>
        <div>
          <h1 className="header-title">SazonSoft</h1>
          <p className="header-subtitle">Sistema de Gestión · Beta V0.0.1</p>
        </div>
      </div>
    </header>
  );
}

export default Header;
