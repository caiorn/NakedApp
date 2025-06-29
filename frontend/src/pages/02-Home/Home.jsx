import { useEffect, useState } from 'react'
import { Outlet, Link } from 'react-router-dom'
import styles from './Home.module.css'
import PrimaryButton from '../../components/Button/PrimaryButton'
import SecondaryButton from '../../components/Button/SecondaryButton'

export default function Home() {
	const [strList, setList] = useState([])

	useEffect(() => {
		console.log('strList', strList)
	}, [strList]) // executará na 1º renderizacao e em cada atualizacao do estado strList

	const addItem = (item) => {
		setList((prev) => [...prev, item])
	}

	return (
		<div className={styles.Home}>
			<h1>Bem-vindo à Página Inicial</h1>
			<PrimaryButton
				textLabel="Explorar"
				onClick={() => alert('Explorar clicado!')}
			/>
			<SecondaryButton
				textLabel="Saiba Mais"
				onClick={() => alert('Saiba Mais clicado!')}
			/>
			<time title="12 de Abril às 11:47h" dateTime="2025-04-12 11:4600">
				Publicado há 10min
			</time>
			{/* Renderiza as subrotas aqui */}
			<button type="button" onClick={() => addItem('Novo Item')}>
				Adicionar Item
			</button>
			<ul>
				{strList.map((item, index) => (
					<li key={index}>
						{item} {index}
					</li>
				))}
			</ul>
			<Outlet />
		</div>
	)
}
