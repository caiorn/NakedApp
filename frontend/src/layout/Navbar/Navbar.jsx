import './Navbar.css';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (    
    <nav className="windows-menu-bar" aria-label="Menu principal">
      
    <div className="menu-item" aria-haspopup="true" aria-expanded="false">
        <Link to="#">Users</Link>
        <div className="dropdown-content">
          <Link to="/main/users/new">Create</Link>
          <Link to="/main/users">List</Link>
          <div className="menu-separator"></div>
          <Link to='/main/users/logs'>Logs</Link>
          <div className="menu-separator"></div>
          <Link to="/main/users/permissions">Permissions</Link>
          <Link to="/main/users/roles">Roles</Link>
          <div className="menu-separator"></div>
          <div className="submenu-item">
            <Link to="#">Advanced <span className="submenu-arrow">❯</span></Link>
            <div className="submenu">
              <Link to="/main/users/advanced/settings">Settings</Link>
              <Link to="/main/users/advanced/notifications">Notifications</Link>
              <div className="menu-separator"></div>
              <Link to="/main/users/advanced/data-recovery">Data Recovery</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="menu-item" aria-haspopup="true" aria-expanded="false">
        <Link to="#">Configurações</Link>
        <div className="dropdown-content">
          <Link to="#">Preferências</Link>
          <Link to="#">Contas</Link>
          <div className="menu-separator"></div>
          <Link to="#">Notificações</Link>
          <div className="menu-separator"></div>
          <div className="submenu-item">
            <Link to="#">Avançadas <span className="submenu-arrow">❯</span></Link>
            <div className="submenu">
              <Link to="#">Modo Escuro</Link>
              <Link to="#">Sincronizar</Link>
              <div className="menu-separator"></div>
              <Link to="#">Recuperação de Dados</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="menu-item" aria-haspopup="true" aria-expanded="false">
        <Link to="#">Ajuda</Link>
        <div className="dropdown-content">
          <Link to="#">Documentação</Link>
          <div className="menu-separator"></div>
          <Link to="#">Suporte</Link>
          <div className="menu-separator"></div>
          <div className="submenu-item">
            <Link to="#">Mais Ajuda <span className="submenu-arrow">❯</span></Link>
            <div className="submenu">
              <Link to="#">FAQ</Link>
              <Link to="#">Fórum</Link>
              <div className="menu-separator"></div>
              <Link to="#">Relatar Problema</Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}