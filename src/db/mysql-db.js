import mysql from 'mysql2/promise'
import { env } from '../env.js'

export const pool = mysql.createPool(
	env.DB_URL || {
		host: env.DB_HOST,
		port: env.DB_PORT,
		user: env.DB_USER,
		password: env.DB_PASS,
		database: env.DB_NAME
	}
)