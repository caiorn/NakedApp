export class UserRepository {
	constructor(trx) {
	  this.knex = trx;
	}
  
	async create(client) {
		return await this.knex('clients').insert(client).returning('id');
	}
  
	async findById(id) {
		return await this.knex('clients')
		.where({ id })
		.first();
	}
  }
  