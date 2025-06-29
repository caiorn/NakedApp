import React, { useState, useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import styles from './Chat.module.css'

const Chat = () => {
	// Estados para gerenciar o chat
	const [username, setUsername] = useState('')
	const [message, setMessage] = useState('')
	const [messages, setMessages] = useState([])
	const [isConnected, setIsConnected] = useState(false)
	const [isLoggedIn, setIsLoggedIn] = useState(false)
	const [users, setUsers] = useState([])

	// Referências
	const socketRef = useRef(null)
	const messagesEndRef = useRef(null)

	// Conecta ao Socket.io quando o componente monta
	useEffect(() => {
		// Somente conecta se o usuário estiver logado
		if (isLoggedIn && !socketRef.current) {
			const socket = io('http://localhost:3003')
			socketRef.current = socket

			// Evento de conexão estabelecida
			socket.on('connect', () => {
				console.log('Conectado ao servidor Socket.io')
				setIsConnected(true)

				// Envia mensagem de login para o servidor
				socket.emit('login', { username })
			})

			// Evento de recebimento de mensagem
			socket.on('message', (data) => {
				console.log('Mensagem recebida:', data)
				setMessages((prev) => [...prev, data])
			})

			// Evento de atualização da lista de usuários
			socket.on('users', (data) => {
				console.log('Lista de usuários atualizada:', data)
				setUsers(data.users)
			})

			// Evento de recebimento do histórico de mensagens
			socket.on('history', (data) => {
				console.log('Histórico de mensagens recebido:', data)
				setMessages(data.messages)
			})

			// Evento de desconexão
			socket.on('disconnect', () => {
				console.log('Desconectado do servidor Socket.io')
				setIsConnected(false)
			})

			// Limpeza ao desmontar o componente
			return () => {
				socket.disconnect()
				socketRef.current = null
			}
		}
	}, [isLoggedIn, username])

	// Efeito para rolar para a última mensagem sempre que novas mensagens chegarem
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
	}, [messages])

	// Função de login
	const handleLogin = (e) => {
		e.preventDefault()

		if (username.trim()) {
			setIsLoggedIn(true)
		}
	}

	// Função para enviar mensagem
	const handleSendMessage = (e) => {
		e.preventDefault()

		if (message.trim() && isConnected && socketRef.current) {
			// Cria o objeto de mensagem
			const messageObj = {
				type: 'message',
				username: username,
				text: message,
				timestamp: new Date().toISOString()
			}

			// Envia a mensagem através do Socket.io
			socketRef.current.emit('message', messageObj)

			// Limpa o campo de mensagem
			setMessage('')
		}
	}

	// Função para formatar a hora da mensagem
	const formatTime = (timestamp) => {
		const date = new Date(timestamp)
		return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
	}

	// Renderiza o componente
	return (
		<div className={styles.chatContainer}>
			{!isLoggedIn ? (
				// Tela de login
				<div className={styles.loginContainer}>
					<h1>Chat em Tempo Real</h1>
					<form onSubmit={handleLogin} className={styles.loginForm}>
						<input
							type="text"
							placeholder="Seu nome"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							className={styles.usernameInput}
							required
						/>
						<button type="submit" className={styles.loginButton}>
							Entrar
						</button>
					</form>
				</div>
			) : (
				// Interface principal do chat
				<div className={styles.chatBox}>
					<div className={styles.chatHeader}>
						<h2>Chat em Tempo Real</h2>
						<div className={styles.connectionStatus}>
							{isConnected ? (
								<span className={styles.statusConnected}>● Conectado</span>
							) : (
								<span className={styles.statusDisconnected}>
									● Desconectado
								</span>
							)}
						</div>
					</div>

					<div className={styles.chatContent}>
						{/* Lista de usuários online */}
						<div className={styles.usersList}>
							<h3>Usuários Online ({users.length})</h3>
							<ul>
								{users.map((user, index) => (
									<li
										key={index}
										className={user === username ? styles.currentUser : ''}
									>
										{user === username ? `${user} (você)` : user}
									</li>
								))}
							</ul>
						</div>

						{/* Área de mensagens */}
						<div className={styles.messagesArea}>
							<div className={styles.messagesContainer}>
								{messages.length === 0 ? (
									<div className={styles.noMessages}>
										Nenhuma mensagem ainda. Seja o primeiro a enviar!
									</div>
								) : (
									messages.map((msg, index) => (
										<div
											key={index}
											className={`${styles.message} ${msg.username === username ? styles.myMessage : styles.otherMessage}`}
										>
											<div className={styles.messageBubble}>
												{msg.username !== username && (
													<div className={styles.messageSender}>
														{msg.username}
													</div>
												)}
												<div className={styles.messageText}>{msg.text}</div>
												<div className={styles.messageTime}>
													{formatTime(msg.timestamp)}
												</div>
											</div>
										</div>
									))
								)}
								<div ref={messagesEndRef} />
							</div>

							{/* Formulário para enviar mensagens */}
							<form onSubmit={handleSendMessage} className={styles.messageForm}>
								<input
									type="text"
									placeholder="Digite sua mensagem..."
									value={message}
									onChange={(e) => setMessage(e.target.value)}
									className={styles.messageInput}
									disabled={!isConnected}
								/>
								<button
									type="submit"
									className={styles.sendButton}
									disabled={!isConnected || !message.trim()}
								>
									Enviar
								</button>
							</form>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

export default Chat
