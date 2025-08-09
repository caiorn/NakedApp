import type { Knex } from "knex";
import type { User, UserColumn, InsertUser, UpdateUser } from "./user.types.ts";
import { knex } from "../../../db/knex-db.ts";

export class UserRepository {
	private db: Knex | Knex.Transaction;

	constructor(trxKnex?: Knex.Transaction) {
		this.db = trxKnex || knex;
	}
	async #simulateDelay(ms = 500) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	async insertUsers(users: InsertUser | InsertUser[]) {

		// PostgreSQL: descomente essa linha se estiver usando Postgres
		const insertedUsers = await this.db("users").insert(users).returning('id');

		// // MySQL: retorna apenas o primeiro ID inserido (auto-increment)
		// const [insertedId] = await this.db("users").insert(users);
		// // Garante que o retorno seja sempre um array de objetos { id }
		// const insertedUsers = Array.isArray(users)
		// 	? users.map((_, index) => ({ id: insertedId + index })) // simula múltiplos IDs
		// 	: [{ id: insertedId }];

		return insertedUsers;
	}

	async updateUsersByIds(ids: number[], userData: UpdateUser) {
		const affectedRows = await this.db("users")
			.whereIn("id", ids)
			.update(userData);
		return affectedRows;
	}

	async destroyUsersSoftly(ids: number[]) {
		const affectedRows = await this.db("users")
			.whereIn("id", ids)
			.update({ deleted_at: this.db.fn.now() });
		return affectedRows;
	}

	async selectAllUsers<T extends readonly UserColumn[]>({
		columns
	}: {
		columns: T;
	}): Promise<Pick<User, T[number]>[]> {
		const users = await this.db<User>("users")
			.select(...columns)
			.whereNull('deleted_at');
		return users as Pick<User, T[number]>[];
	}

	async selectUsersByIds<T extends readonly UserColumn[]>({
		ids,
		columns
	}: {
		ids: number[];
		columns: T; // ✅ Torne obrigatório para evitar problemas com "*"
	}): Promise<Pick<User, T[number]>[]> {
		const users = await this.db<User>("users")
			.select(...columns)
			.whereIn("id", ids)
			.whereNull("deleted_at");

		return users as Pick<User, T[number]>[];
	}


	async selectUsersLikeName({ name, columns }: { name: string; columns: UserColumn[] }) {
		const users: Partial<User>[] = await this.db("users")
			.select(columns)
			.whereLike("name", `%${name}%`)
			.whereNull("deleted_at");
		return users;
	}

	async selectUserByLogin({ login, columns }: { login: string; columns: UserColumn[] }) {
		const user: Partial<User> = await this.db("users")
			.select(columns)
			.where({ login })
			.first();
			
		return user;
	}

	async selectUsersByUniqueFields<T extends readonly UserColumn[]>({
		logins,
		emails,
		columns
	}: {
		logins: string[];
		emails: string[];
		columns: T;
	}): Promise<Pick<User, T[number]>[]> {
		if (logins.length === 0 && emails.length === 0) {
			return [];
		}

		const users = await this.db<User>("users")
			.select(...columns)
			.whereIn("login", logins)
			.orWhereIn("email", emails)
			.whereNull("deleted_at");

		return users as Pick<User, T[number]>[];
	}
}
