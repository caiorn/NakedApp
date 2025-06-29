import Login from '../pages/01-SingIn/SingIn'
import Main from '../pages/02-Home/Home'
import GeradorSenhas from '../pages/GeradorSenhas/GeradorSenhas'
import BibliotecaLista from '../pages/BibliotecaLista/BibliotecaLista'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import RootLayout from '../layout/RootLayout'
import User from '../pages/03-User/User'
import Equipament from '../pages/Equipament/Equipament'
import loadEquipament from '../loaders/EquipamentsLoader'
import EquipamentBoundary from '../error-boundaries/EquipamentBoundary'
import PrivateRoute from './PrivateRoute' // Importa o componente de rota privada
import Chat from '../pages/07-WebSockets/4-Chat2/Chat'
import StatusAndIncrement from '../pages/07-WebSockets/1-Samples/StatusAndIncrement'

const router = createBrowserRouter([
	{
		path: '/',
		element: <Login />
	},
	{
		path: '/main',
		element: <RootLayout />,
		children: [
			{
				index: true,
				element: (
					<PrivateRoute>
						<Main />
					</PrivateRoute>
				)
			},
			{
				path: 'websockets/sample',
				element: (
					<PrivateRoute>
						<StatusAndIncrement />
					</PrivateRoute>
				) // Protege a rota com PrivateRoute
			},
			{
				path: 'websockets/chat2',
				element: (
					<PrivateRoute>
						<Chat />
					</PrivateRoute>
				) // Protege a rota com PrivateRoute
			},
			{
				path: 'user',
				element: (
					<PrivateRoute>
						<User />
					</PrivateRoute>
				) // Protege a rota com PrivateRoute
			},
			{
				path: 'user/:userId',
				element: (
					<PrivateRoute>
						<User />
					</PrivateRoute>
				) // Protege a rota com PrivateRoute
			},
			{
				path: 'equipament/:equipamentId',
				element: (
					<PrivateRoute>
						<Equipament />
					</PrivateRoute>
				), // Protege a rota com PrivateRoute
				loader: loadEquipament,
				errorElement: <EquipamentBoundary />
			},
			{
				path: 'geradorsenhas',
				element: (
					<PrivateRoute>
						<GeradorSenhas />
					</PrivateRoute>
				) // Protege a rota com PrivateRoute
			},
			{
				path: 'bibliotecalista',
				element: (
					<PrivateRoute>
						<BibliotecaLista />
					</PrivateRoute>
				) // Protege a rota com PrivateRoute
			}
		]
	}
])

export default router
export { router }
