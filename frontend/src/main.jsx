import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './App.css'

console.log('Iniciando o aplicativo... 1')

createRoot(document.getElementById('root')).render(
	<App />
)

// <StrictMode>
// 	<App />
// 	{/* <RouterProvider router={router} /> */}
// </StrictMode>