class UnitOfWorkKnex {
    constructor(db) {
      this.db = db;
      this.transaction = null;
    }
  
    async begin() {
      this.transaction = await this.db.transaction();
      return this.transaction;
    }
  
    async commit() {
      if (this.transaction) {
        await this.transaction.commit();
        this.transaction = null;
      }
    }
  
    async rollback() {
      if (this.transaction) {
        await this.transaction.rollback();
        this.transaction = null;
      }
    }
  
    getRepository(repoClass) {
      return new repoClass(this.transaction || this.db);
    }
  }
  
  module.exports = UnitOfWorkKnex;