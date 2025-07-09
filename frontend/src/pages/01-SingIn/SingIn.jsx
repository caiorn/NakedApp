import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import reactLogo from '../../assets/react.svg'
import { login as loginService } from '@/services/AuthService'
import { getUserGeoInfo } from '@/services/GeoService'
import './SingIn.css'

function Login() {
	const [formData, setFormData] = useState({ username: '', password: '' })
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false) // Estado para controlar o carregamento
	const navigate = useNavigate()

	const handleChange = (e) => {
		const { name, value } = e.target
		setFormData((prev) => ({ ...prev, [name]: value }))
		//console.log(`${name} ${value}`);
	}

	const handleSubmit = async (e) => {
		e.preventDefault()

		if (!formData.username || !formData.password) {
			setError('Preencha todos os campos!')
			return
		}

		setLoading(true) // Ativa o carregamento
		setError('') // Limpa qualquer erro anterior

		try {
			const geoInfo = await getUserGeoInfo()
			console.log('Localização do usuário:', geoInfo)

			//const authData = await loginService();
			//console.log('Dados de login:', authData);

			const correctPassword = '12345'
			// Simula a verificação de login e senha após 3 segundos
			setTimeout(() => {
				if (formData.password === correctPassword) {
					navigate('/main') // Redireciona para a página Main após o login
				} else {
					setError('Senha incorreta. Tente novamente.')
				}
				setLoading(false) // Desativa o carregamento
			}, 3000) // 3 segundos de espera
		} catch (error) {
			setError(`Erro no servidor. ${error}`)
		} finally {
		}
	}

	const handleForgotPassword = () => {
		// Aqui você pode redirecionar para uma página de recuperação de senha
		// Exemplo:
		navigate('/forgot-password') // Redireciona para a página "Esqueci minha senha"
	}

	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				backgroundColor: 'aquamarine',
				height: '100vh', // Ocupa toda a altura da viewport
			}}
		>
			<form 
				onSubmit={handleSubmit}
				// style={{
				// 	backgroundColor: '#f0f0f0',
				// }}
			>
				<h2>Sign In</h2>
				<label htmlFor="username">Username:</label>
				<input
					name="username"
					type="text"
					placeholder="Enter your login"
					value={formData.username}
					onChange={handleChange}
					required
				/>
				<label htmlFor="password">Password:</label>
				<input
					name="password"
					type="password"
					placeholder="Enter your password"
					value={formData.password}
					onChange={handleChange}
				/>
				{error && <span style={{ color: 'red' }}>{error}</span>}
				<button
					style={{ marginTop: '20px', width: '100%' }}
					type="submit"
					className={`${loading ? 'loading' : ''}`} // Adiciona a classe de loading
					disabled={loading} // Desabilita o botão enquanto carrega
				>
					{loading ? 'Carregando...' : 'Sign In'}
				</button>
			</form>
		</div>
	)
}

export default Login
