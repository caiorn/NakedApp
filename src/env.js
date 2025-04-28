import { config } from 'dotenv'
import { z } from 'zod'
import { resolve } from 'node:path'
import { existsSync } from 'node:fs'

// Carrega o .env baseado no NODE_ENV
const envFile = `.env.${process.env.NODE_ENV || 'development'}`
const envPath = resolve(process.cwd(), envFile)

if (existsSync(envPath)) {
  config({ path: envPath })
} else {
  console.warn(`⚠️ Arquivo "${envFile}" não encontrado. Usando variáveis padrão ou .env`)
  config()
}

// Validação com Zod
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  HOST: z.string().default('localhost'),
  PORT: z.coerce.number().default(3333),

  DB_URL: z.string().optional(),
  DB_HOST: z.string().optional(),
  DB_USER: z.string().optional(),
  DB_PORT: z.coerce.number().optional().default(3306),
  DB_PASS: z.string().optional(),
  DB_NAME: z.string().optional(),
  DB_TIMEOUT: z.coerce.number().optional().default(15000),

  JWT_SECRET: z.string(),
  JWT_EXPIRATION: z.string().default('1d'),

  SQLITE_DB_PATH: z.string().optional(),
})

// Valida e faz parse
const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error('❌ Erro ao validar variáveis de ambiente:')
  console.error(parsed.error.format())
  process.exit(1)
}

export const env = parsed.data

// 🖨️ Exibe variáveis no dev
if (env.NODE_ENV === 'development') {
  console.log('Variáveis de ambiente carregadas:', env)
}
