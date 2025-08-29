import type { User, UserColumn, InsertUser, UpdateUser, } from "./user.entity.ts";
import type { EntityResult } from "../../../types/utils.ts";
import type { Knex } from "knex";
import { knex } from "../../../db/knex-db.ts";
import type { IUserRepository } from "./user-repository-interface.ts";

export class UserRepository implements IUserRepository {
	private db: Knex | Knex.Transaction;

	constructor(trxKnex?: Knex.Transaction) {
		this.db = trxKnex || knex;
	}
	async #simulateDelay(ms = 500) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	async insertUsers<T extends readonly UserColumn[]>({
		users,
		returning = ["id"] as unknown as T
	}: {
		users: InsertUser | InsertUser[];
		returning?: T;
	}): Promise<EntityResult<User, T>[]> {
		// PostgreSQL: descomente essa linha se estiver usando Postgres
		const insertedUsers = await this.db<User>("users")
			.insert(users)
			.returning(returning);

		// // MySQL: retorna apenas o primeiro ID inserido (auto-increment)
		// const [insertedId] = await this.db("users").insert(users);
		// // Garante que o retorno seja sempre um array de objetos { id }
		// const insertedUsers = Array.isArray(users)
		// 	? users.map((_, index) => ({ id: insertedId + index })) // simula múltiplos IDs
		// 	: [{ id: insertedId }];

		return insertedUsers as EntityResult<User, T>[];
	}

	async updateUsersByIds<T extends readonly UserColumn[]>({
		ids,
		userData,
		returning
	}: {
		ids: number[];
		userData: UpdateUser;
		returning: T;
	}): Promise<EntityResult<User, T>[]> {
		const updatedUsers = await this.db<User>("users")
			.whereIn("id", ids)
			.update({
				...userData,
				updated_at: this.db.fn.now()
			})
			.returning(returning);
		return updatedUsers as EntityResult<User, T>[];
	}

	async destroyUsersSoftly(ids: number[]) {
		const affectedRows = await this.db("users")
			.whereIn("id", ids)
			.update({ deleted_at: this.db.fn.now() });
		return affectedRows;
	}

	async selectAllUsers<T extends readonly UserColumn[]>({
		columns  // = ["*"] as unknown as T, 
	}: {
		columns: T; //	columns?: T;
	}): Promise<EntityResult<User, T>[]> {
		const users = await this.db<User>("users")
			.select(...columns)
			.whereNull('deleted_at');
		return users as EntityResult<User, T>[];
	}

	async selectUsersByIds<T extends readonly UserColumn[]>({
		ids,
		columns
	}: {
		ids: number[];
		columns: T; //
	}): Promise<EntityResult<User, T>[]> {
		const users = await this.db<User>("users")
			.select(...columns)
			.whereIn("id", ids)
			.whereNull("deleted_at");

		return users as EntityResult<User, T>[];
	}


	async selectUsersLikeName<T extends readonly UserColumn[]>({
		name,
		columns
	}: {
		name: string;
		columns: T;
	}): Promise<EntityResult<User, T>[]> {
		const users = await this.db<User>("users")
			.select(...columns)
			.whereLike("name", `%${name}%`)
			.whereNull("deleted_at");
		return users as EntityResult<User, T>[];
	}

	async selectUserByLogin<T extends readonly UserColumn[]>({
		login,
		columns
	}: {
		login: string;
		columns: T;
	}): Promise<EntityResult<User, T> | undefined> {
		const user = await this.db<User>("users")
			.select(...columns)
			.where({ login })
			.whereNull("deleted_at")
			.first();

		return user as EntityResult<User, T> | undefined;
	}

	async selectUserByEmail<T extends readonly UserColumn[]>({
		email,
		columns
	}: {
		email: string;
		columns: T;
	}): Promise<EntityResult<User, T> | undefined> {
		const user = await this.db<User>("users")
			.select(...columns)
			.where({ email })
			.whereNull("deleted_at")
			.first();

		return user as EntityResult<User, T> | undefined;
	}

	async selectUsersByUniqueFields<T extends readonly UserColumn[]>({
		logins,
		emails,
		columns
	}: {
		logins: string[];
		emails: string[];
		columns: T;
	}): Promise<EntityResult<User, T>[]> {
		if (logins.length === 0 && emails.length === 0) {
			return [];
		}

		const users = await this.db<User>("users")
			.select(...columns)
			.whereIn("login", logins)
			.orWhereIn("email", emails)
			.whereNull("deleted_at");

		return users as EntityResult<User, T>[];
	}
}
