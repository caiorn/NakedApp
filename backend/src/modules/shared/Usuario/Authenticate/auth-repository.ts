import { knex } from "../../../../db/knex-db.ts";
import type { Knex } from "knex";

export class AuthRepository {

    private db: Knex | Knex.Transaction;

    constructor(trxKnex?: Knex.Transaction) {
        this.db = trxKnex || knex;
    }
    async #simulateDelay(ms = 500) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async insertRefreshToken(tokenData : { userId: number; token: string; createdAt: Date; }) {
        // PostgreSQL: descomente essa linha se estiver usando Postgres
        const insertedToken = await this.db("refresh_tokens").insert(tokenData).returning('id');

        // // MySQL: retorna apenas o primeiro ID inserido (auto-increment)
        // const [insertedId] = await this.db("refresh_tokens").insert(tokenData);
        // // Garante que o retorno seja sempre um array de objetos { id }
        // const insertedUsers = Array.isArray(users)
        // 	? users.map((_, index) => ({ id: insertedId + index })) // simula múltiplos IDs
        // 	: [{ id: insertedId }];

        return insertedToken;
    }

    async destroyRefreshToken(token) {
        const affectedRows = await this.db("refresh_tokens")
            .update({ revoked_at: this.db.fn.now() })
            .where("token", token)
            .whereNull('revoked_at');
        return affectedRows;
    }

    async selectRefreshTokenByToken({ token, columns = ["*"] }) {
        // await this.#simulateDelay(1000); // Simula um delay de 1 segundo
        const refreshTokens = await this.db("refresh_tokens")
            .select(columns)
            .where("token", token);
        return refreshTokens;
    }

    async insertPasswordResetToken(data: { user_id: number; token: string; expires_at: Date; }) {
        const [insertedToken] = await this.db("password_resets").insert(data).returning("id");
        return insertedToken;
    }

    async updatePasswordResetToken(id: string, newData: { used_at: Date; }) {
        const affectedRows = await this.db("password_resets")
            .update(newData)
            .where("id", id);
        return affectedRows;
    }

    async selectPasswordResetToken({ token, columns = ["*"] }: { token: string; columns?: string[] }) {
        const passwordResetTokens = await this.db("password_resets")
            .select(columns)
            .where("token", token);
        return passwordResetTokens;
    }
}
