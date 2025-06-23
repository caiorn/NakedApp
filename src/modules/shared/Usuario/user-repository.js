import { knex } from "../../../db/knex-db.js";

export class UserRepository {
	constructor(trxKnex) {
		/** @type {knex} */
		this.trxKnex = trxKnex || knex;
	}

	async createUser(user) {
		const insertedId = await this.trxKnex("users").insert(user);
		return insertedId; // Return array of inserted IDs except for MySQL which returns the first inserted ID in the array
	}

	async createUserWithReturn(user) {
		const [insertedUser] = await this.trxKnex("users")
			.insert(user)
			.returning("*");
		return insertedUser; // Return the full user object
	}
	
	async updateUserById(id, userData) {
		const affectedRows  = await this.trxKnex("users")
			.where({ id })
			.update(userData);
		return affectedRows; // Return the number of affected rows
	}

	async softDeleteUser(id) {
		const affectedRows = await this.trxKnex("users")
			.where({ id })
			.update({ deleted_at: this.trxKnex.fn.now() });
		return affectedRows; // Return the number of affected rows
	}

	async getAllUsers({columns = ["*"]}) {
		const users = await this.trxKnex("users").select(columns).whereNull('deleted_at');
		return users; // Return an array of user objects or [] if none found
	}

	async getUserById({id, columns = ["*"]}) {
		const user = await this.trxKnex("users").select(columns).where({ id }).first();
		return user; // Return the user object or undefined if not found 
	}

	async getUsersByIds({ids, columns = ["*"]}) {
		const users = await this.trxKnex("users")
			.select(columns)
			.whereIn("id", ids)
			.whereNull("deleted_at");
		return users; // Return an array of user objects or [] if none found
	}

	async getUserByLogin({login, columns = ["*"]}) {
		const users = await this.trxKnex("users").select(columns).where({ login }).first();
		return users; // Return the user object or undefined if not found
	}

	async getUsersLikeName({name, columns = ["*"]}) {
		const users = await this.trxKnex("users")
			.whereLike("name", `%${name}%`)
			.whereNull("deleted_at");
		return users; // Return an array of user objects or [] if none found
	}

	async getUserByUniqueFields({ login, email, columns = ["*"] }) {
		const user = this.trxKnex("users")
		.select(columns)
		.where("login", login)
		.orWhere("email", email)
		.whereNull("deleted_at").first();
		return user; // Return the user object or undefined if not found
	}	
}
