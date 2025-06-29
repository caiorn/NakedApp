import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd())
	console.log('🌍 Ambiente      :', mode)
	console.log('🟢 Variáveis carregadas:')
	for (const [key, value] of Object.entries(env)) {
		console.log(`   ${key.padEnd(15)} : ${value}`)
	}

	return {
		plugins: [react()],
		server: {
			port: 3000,
			host: 'localhost' // 0.0.0.0 Permite que dispositivos na mesma rede local acessem o servidor
		},
		resolve: {
			alias: {
				'@': path.resolve(__dirname, './src')
			}
		}
	}
})
