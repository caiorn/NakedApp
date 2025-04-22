import dotenv from 'dotenv'

class EnvLoader {
	static instance

	constructor() {
		if (EnvLoader.instance) {
			// biome-ignore lint/correctness/noConstructorReturn: <explanation>
			return EnvLoader.instance
		}

		dotenv.config({
			path: `.env.${process.env.NODE_ENV || 'development'}`
		})

		const REQUIRED_ENV_VARS = [
			'DB_HOST',
			'DB_USER',
			'DB_PORT',
			'DB_PASS',
			'DB_NAME',
			'PORT',
			'SQLITE_DB_PATH'
		]

		const errors = []
		for (const envVar of REQUIRED_ENV_VARS) {
			if (!process.env[envVar]) {
				errors.push(`${envVar} is required`)
			}
		}
		if (errors.length > 0) {
			console.info(
				`❌ Erro ao carregar variáveis em .env.${process.env.NODE_ENV}`
			)
			throw new Error(`Failed to load env file: ${errors.join(', ')}`)
		}

		this.env = {
			NODE_ENV: process.env.NODE_ENV || 'development',
			HOST: process.env.HOST || 'localhost',
			PORT: Number(process.env.PORT || 3333),
			DB_URL: process.env.DB_URL,
			DB_HOST: process.env.DB_HOST,
			DB_USER: process.env.DB_USER,
			DB_PORT: Number(process.env.DB_PORT || 3306),
			DB_PASS: process.env.DB_PASS,
			DB_NAME: process.env.DB_NAME,
			SQLITE_DB_PATH: process.env.SQLITE_DB_PATH,
			DATABASE_URL: process.env.DATABASE_URL || 'sqlite://db.sqlite'
		}

		if (this.env.NODE_ENV !== 'production') {
			console.info('🟢 Env file loaded', this.env)
		}

		EnvLoader.instance = this
	}
}

const { env } = new EnvLoader()

export { env }
