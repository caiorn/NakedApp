import { config } from 'dotenv'
import { z } from 'zod'
import { resolve } from 'node:path'
import { existsSync } from 'node:fs'
import type { StringValue } from 'ms';

// Carrega o .env baseado no NODE_ENV
const envFile = `.env.${process.env.NODE_ENV}`
const envPath = resolve(process.cwd(), envFile)

if (existsSync(envPath)) {
  config({ path: envPath })
} else {
  console.warn(`⚠️  Arquivo "${envFile}" não encontrado. Usando variáveis padrão ou .env`)
  config()
}

// Validação com Zod
const envSchema = z.object({
  NODE_ENV: z.enum(['test', 'development' , 'production']),
  HOST: z.string(),
  PORT: z.coerce.number(),

  DB_URL: z.string(),

  JWT_ACCESS_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  JWT_ACCESS_EXPIRATION: z.string(),
  JWT_REFRESH_EXPIRATION: z.string(),

  COOKIE_SECRET: z.string(),

  SQLITE_DB_PATH: z.string().optional(),
})

// Valida e faz parse
const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error('❌ Erro ao validar variáveis de ambiente:')
  console.error(parsed.error.format())
  process.exit(1)
}

export const env = {
  ...parsed.data,
  JWT_ACCESS_EXPIRATION: parsed.data.JWT_ACCESS_EXPIRATION as StringValue,
  JWT_REFRESH_EXPIRATION: parsed.data.JWT_REFRESH_EXPIRATION as StringValue,
  inProduction: parsed.data.NODE_ENV === 'production'
};
// 🖨️ Exibe variáveis no dev
// if (env.NODE_ENV === 'development') {
  console.log('Variáveis de ambiente carregadas:', env)
// }
