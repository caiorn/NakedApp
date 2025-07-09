export default function Header({ children }) {
	return (
		<header
			style={{
				height: '2rem',
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
				backgroundColor: 'transparent',
			}}
		>
			{/* Renderiza os filhos do componente */}
			{children}
		</header>
	)
}
