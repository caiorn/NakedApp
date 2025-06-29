import styles from './Header.module.css'

export default function Header({ children }) {
	return (
		<header
			style={{
				height: '2rem',
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
				padding: '4px 20px',
				backgroundColor: '#333'
			}}
		>
			{/* Renderiza os filhos do componente */}
			{children}
		</header>
	)
}
