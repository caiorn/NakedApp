import React from 'react'
import { useRouteError, Link } from 'react-router-dom'

function ErrorPage() {
	const error = useRouteError()
	console.error(error)

	return (
		<div style={{ padding: '2rem', textAlign: 'center' }}>
			<h1>❌ Algo deu errado</h1>
			<p>
				{error.status === 404
					? 'Página não encontrada.'
					: 'Erro inesperado.'}
			</p>

			{error.status && <p>Status: {error.status}</p>}
			{error.statusText && <p>{error.statusText}</p>}

			<Link to="/main">Voltar para o início</Link>
		</div>
	)
}

export default ErrorPage
