import { pool } from './mysql-db.js'
import { knex } from './knex-db.js'

export const test = {
    ConnectionMySQL2: async () => {
        try {
            const connection = await pool.getConnection()
            await connection.query('SELECT 1')
            console.info('🟢 Conexão MySQL2 estabelecida com sucesso!')
            connection.release()
        } catch (error) {
            console.error('🔴 Erro ao conectar ao MySQL2:', error)
        }
    },

    ConnectionKnex: async () => {
        try {
            await knex.raw('SELECT 1')
            console.info('🟢 Conexão Knex estabelecida com sucesso!')
        } catch (error) {
            console.error('🔴 Erro ao conectar ao Knex:', error)
        }
    }

}

