import { knex } from "../../../db/knex-db.js";

export async function createUser(user, trxKnex) {
	return await trxKnex('users').insert(user).returning('id');
}

export async function getAllUsers(trxKnex) {
	const db = trxKnex || knex;
	const users = await db('users').select('*') //.whereNull('deleted_at');
	return users;	
}


export async function getUserById(id, trxKnex) {
	const db = trxKnex || knex;
	return await db('users')
		.where({ id })
		.first();
}

export async function updateUser(id, userData, trxKnex) {
	const db = trxKnex || knex;
	return await db('users')
		.where({ id })
		.update(userData)
		.returning('*');
}