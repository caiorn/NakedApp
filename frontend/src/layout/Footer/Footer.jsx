export default function Footer() {
	return (
		<footer
			style={{
				padding: '7px 20px',
				backgroundColor: '#333',
				color: 'white',
				borderTop: '1px solid #ccc',
				textAlign: 'center'
				//marginTop : 'auto'
			}}
		>
			<small>
				© {new Date().getFullYear()} Meu App. Todos os direitos reservados. -
				Caio
			</small>
		</footer>
	)
}
