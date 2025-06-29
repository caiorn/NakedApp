import './Navbar.css'
import { Link } from 'react-router-dom'

export default function Navbar() {
	return (
		<nav className="menu" aria-label="Menu principal">
			<div className="menu-item" aria-haspopup="true" aria-expanded="false">
				<Link to="#">Fundamentos</Link>
				<div className="dropdown-content">
					<Link to="/main/biblioteca-lista">Biblioteca de Listas</Link>
					<Link to="/main/geradorsenhas">Gerador de Senhas</Link>
					<Link to="#">HTML5</Link>
					<Link to="#">CSS</Link>
					<div className="submenu-item">
						<Link to="#">JavaScript</Link>
						<div className="submenu">
							<Link to="#">Promisses</Link>
							<Link to="#">useState</Link>
							<Link to="#">use</Link>
						</div>
					</div>
					<div className="submenu-item">
						<Link to="#">React</Link>
						<div className="submenu">
							<Link to="#">useEffect</Link>
							<Link to="#">useState</Link>
							<Link to="#">use</Link>
						</div>
					</div>
				</div>
			</div>

			<div className="menu-item" aria-haspopup="true" aria-expanded="false">
				<Link to="#">WebSockets</Link>
				<div className="dropdown-content">
					<Link to="/main/websockets/sample">ToogleButton and Increment</Link>
					<Link to="/main/websockets/chat1">Chat1</Link>
					<Link to="/main/websockets/chat2">Chat2</Link>
				</div>
			</div>

			<div className="menu-item" aria-haspopup="true" aria-expanded="false">
				<Link to="#">AntDesign</Link>
				<div className="dropdown-content">
					<Link to="#">teste</Link>
					<Link to="#">Salvar</Link>
					<Link to="#">Sair</Link>
					<div className="submenu-item">
						<Link to="#">GridView</Link>
						<div className="submenu">
							<Link to="#">Exportar</Link>
							<Link to="#">Importar</Link>
							<Link to="#">Configurações Avançadas</Link>
						</div>
					</div>
				</div>
			</div>

			<div className="menu-item" aria-haspopup="true" aria-expanded="false">
				<Link to="#">Arquivo</Link>
				<div className="dropdown-content">
					<Link to="#">Abrir</Link>
					<Link to="#">Salvar</Link>
					<Link to="#">Sair</Link>
					<div className="submenu-item">
						<Link to="#">Mais opções</Link>
						<div className="submenu">
							<Link to="#">Exportar</Link>
							<Link to="#">Importar</Link>
							<Link to="#">Configurações Avançadas</Link>
						</div>
					</div>
				</div>
			</div>

			<div className="menu-item" aria-haspopup="true" aria-expanded="false">
				<Link to="#">Configurações</Link>
				<div className="dropdown-content">
					<Link to="#">Preferências</Link>
					<Link to="#">Contas</Link>
					<Link to="#">Notificações</Link>
					<div className="submenu-item">
						<Link to="#">Avançadas</Link>
						<div className="submenu">
							<Link to="#">Modo Escuro</Link>
							<Link to="#">Sincronizar</Link>
							<Link to="#">Recuperação de Dados</Link>
						</div>
					</div>
				</div>
			</div>

			<div className="menu-item" aria-haspopup="true" aria-expanded="false">
				<Link to="#">Ajuda</Link>
				<div className="dropdown-content">
					<Link to="#">Documentação</Link>
					<Link to="#">Suporte</Link>
					<div className="submenu-item">
						<Link to="#">Mais Ajuda</Link>
						<div className="submenu">
							<Link to="#">FAQ</Link>
							<Link to="#">Fórum</Link>
							<Link to="#">Relatar Problema</Link>
						</div>
					</div>
				</div>
			</div>
		</nav>
	)
}
