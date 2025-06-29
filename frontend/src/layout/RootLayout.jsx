import { Outlet } from 'react-router-dom'
import Header from './Header/Header'
import Footer from './Footer/Footer'
import './RootLayout.css'
import { Avatar } from '../components/Avatar'
import Navbar from './Navbar/Navbar.jsx'

export default function RootLayout() {
	const contentStyle = {
		flex: 1,
		padding: '20px'
	}
	const layoutStyle = {
		display: 'flex',
		flexDirection: 'column',
		minHeight: '100vh'
	}
	return (
		<div style={layoutStyle}>
			<Header>
				<Navbar />
				<div>
					<Avatar src="https://i.pravatar.cc/39" alt="Perfil" />
					<Avatar src="https://i.pravatar.cc/40" alt="Perfil" />
					<Avatar src="https://i.pravatar.cc/41" alt="Perfil" />
				</div>
			</Header>
			<main style={contentStyle}>
				<Outlet />
			</main>
			<Footer />
		</div>
	)
}
