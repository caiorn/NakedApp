import { knex } from "../../../db/knex-db.js";

export class UserRepository {

	constructor(trxKnex) {
		this.trxKnex = trxKnex || knex;
	}

	async createUser(user) {
		return await this.trxKnex('users').insert(user).returning('id');
	}

	async getAllUsers() {
		const users = await this.trxKnex('users').select('*'); //.whereNull('deleted_at');
		return users;	
	}

	async getUserById(id) {
		return await this.trxKnex('users')
			.where({ id })
			.first();
	}

	async updateUser(id, userData) {
		return await this.trxKnex('users')
			.where({ id })
			.update(userData)
			.returning('*');
	}
}
	

