import { pool } from './mysql-db.js'
import { knex } from './knex-db.js'

export const test = {
    ConnectionMySQL2: async () => {
        try {
            const connection = await pool.getConnection()
            const [rows] = await connection.query('SELECT DATABASE() AS db')
            const dbName = rows[0]?.db || '(desconhecido)'
            console.info(`🟢 Conexão MySQL2 estabelecida com sucesso! Banco: ${dbName}`)
            connection.release()
        } catch (error) {
            console.error('🔴 Erro ao conectar ao MySQL2:', error)
        }
    },

    ConnectionKnex: async () => {
        try {
            const result = await knex.raw('SELECT DATABASE() AS db')
            const dbName = result[0][0]?.db || '(desconhecido)'
            console.info(`🟢 Conexão Knex estabelecida com sucesso! Banco: ${dbName}`)
        } catch (error) {
            console.error('🔴 Erro ao conectar ao Knex:', error)
        }
    }
}
