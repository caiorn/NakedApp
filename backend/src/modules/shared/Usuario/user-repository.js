import { knex } from "../../../db/knex-db.js";

export class UserRepository {
	constructor(trxKnex) {
		/** @type {knex} */
		this.db = trxKnex || knex;
	}

	async insertUsers(users) {
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

	async updateUsersByIds(ids = [], userData) {
		const affectedRows = await this.db("users")
			.whereIn("id", ids)
			.update(userData);
		return affectedRows;
	}

	async destroyUsersSoftly(ids = []) {
		const affectedRows = await this.db("users")
			.whereIn("id", ids)
			.update({ deleted_at: this.db.fn.now() });
		return affectedRows;
	}

	async selectAllUsers({ columns = ["*"] }) {
		const users = await this.db("users").select(columns).whereNull('deleted_at');
		return users;
	}

	async selectUsersByIds({ ids, columns = ["*"] }) {
		const users = await this.db("users")
			.select(columns)
			.whereIn("id", ids)
			.whereNull("deleted_at");
		return users;
	}

	async selectUsersLikeName({ name, columns = ["*"] }) {
		const users = await this.db("users")
			.select(columns)
			.whereLike("name", `%${name}%`)
			.whereNull("deleted_at");
		return users;
	}

	async selectUserByLogin({ login, columns = ["*"] }) {
		const users = await this.db("users").select(columns).where({ login }).first();
		return users;
	}

	async selectUsersByUniqueFields({ logins, emails, columns = ["*"] }) {
		const users = this.db("users")
			.select(columns)
			.whereIn("login", logins)
			.orWhereIn("email", emails)
			.whereNull("deleted_at");
		return users;
	}
}
