import { createBrowserRouter } from 'react-router-dom'

// Layouts
import RootLayout from '../layout/RootLayout'

// Páginas principais
import Login from '../pages/01-SingIn/SingIn'
import Main from '../pages/02-Home/Home'

// Páginas de erro
import ErrorPage from '../pages/ErrorPage'

// Módulo de Usuários
import UserList from '../pages/03-User/UserList'
import UserForm from '../pages/03-User/UserForm'
import UserDetails from '../pages/03-User/UserDetails'
import TestBoundaryForm from '../pages/03-User/Test'

// Loaders e boundaries
import loadUser from '../loaders/UsersLoad'
import EquipamentBoundary from '../error-boundaries/EquipamentBoundary'

// Rota privada
import PrivateRoute from './PrivateRoute'

const router = createBrowserRouter([
	{
		path: '/',
		element: <Login />,
		errorElement: <ErrorPage />		
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
			// Grupo de rotas do módulo "Usuários"
			{
				path: 'users',
				children: [
					{
						index: true,
						element: (
							<PrivateRoute>
								<UserList />
							</PrivateRoute>
						)
					},
					{
						path: 'new',
						element: (
							<PrivateRoute>
								<UserForm />
							</PrivateRoute>
						)
					},
					{
						path: ':userId',
						element: (
							<PrivateRoute>
								<UserForm />
							</PrivateRoute>
						)
					},
					{
						path: ':userId/details',
						element: (
							<PrivateRoute>
								<UserDetails />
							</PrivateRoute>
						)
					},
					{
						path: ':userId/test',
						element: (
							<PrivateRoute>
								<TestBoundaryForm />
							</PrivateRoute>
						),
						loader: loadUser,
						errorElement: <EquipamentBoundary />
					}
				]
			}
		]
	}
])

export default router
export { router }
