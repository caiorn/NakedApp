export class UserRepository {
	constructor(connection) {
	  this.conn = connection;
	}
  
	async create(user) {
	  const [result] = await this.conn.execute(
		'INSERT INTO users (name, email) VALUES (?, ?)',
		[user.name, user.email]
	  );
	  return result.insertId;
	}
  
	async findById(id) {
	  const [rows] = await this.conn.execute(
		'SELECT * FROM users WHERE id = ?',
		[id]
	  );
	  return rows[0];
	}
  }
  