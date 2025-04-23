export class UserRepository {
	constructor(trx) {
	  this.knex = trx;
	}
  
	async create(user) {
		// return await this.knex('users').insert(user).returning('id');
	}
  
	// async findById(id) {
	// 	return await this.knex('clients')
	// 	.where({ id })
	// 	.first();
	// }
  }
  