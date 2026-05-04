import { useState } from 'react';
import { Header } from './components/Header';
import { SideMenu } from './components/SideMenu';
import { PedidosPage } from './components/pedidos/PedidosPage';
import { ProductosPage } from './components/productos/ProductosPage';
import { CategoriasPage } from './components/categorias/CategoriasPage';
import './App.css';

function App() {
  const [pagina, setPagina]                   = useState('pedidos');
  const [sideMenuAbierto, setSideMenuAbierto] = useState(false);

  return (
    <div className="app-container">
      <SideMenu
        isOpen={sideMenuAbierto}
        onClose={() => setSideMenuAbierto(false)}
        onNavigate={setPagina}
        paginaActiva={pagina}
      />
      <Header onMenuToggle={() => setSideMenuAbierto(prev => !prev)} />
      <main>
        {pagina === 'pedidos'    && <PedidosPage />}
        {pagina === 'productos'  && <ProductosPage />}
        {pagina === 'categorias' && <CategoriasPage />}
      </main>
    </div>
  );
}

export default App;
