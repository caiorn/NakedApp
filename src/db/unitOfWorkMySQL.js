import pool from '../mysql.js';

export class UnitOfWork {

    constructor() {
        this.connection = null;
    }

    async beginTransaction() {
        this.connection = await pool.getConnection();
        await this.connection.beginTransaction();
    }

    async commitTransaction() {
        await this.connection.commit();
        this.connection.release();
        this.connection = null;
    }

    async rollbackTransaction() {
        await this.connection.rollback();
        this.connection.release();
        this.connection = null;
    }

    getConnection() {
        return this.connection;
    }
}
