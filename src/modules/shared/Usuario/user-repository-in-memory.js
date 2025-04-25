export class InMemoryUserRepository {

    users = [];

    async createUser(user) {
        const userId = this.users.length + 1;
        const newUser = { id: userId, ...user };
        this.users.push(newUser);
        return userId;
    }

    async getAllUsers() {
        return this.users;
    }

    async getUserById(id) {
        const user = this.users.find(user => user.id === id);
        return user;
    }

    async getUserByCPF(cpf) {
        const user = this.users.find(user => user.cpf === cpf);
        return user;
    }

    async getUserBy_CPF_or_Matricula(matricula, cpf) {
        return this.users.find(user => user.matricula === matricula || user.cpf === cpf) || null;
    }
    
    async updateUser(id, userData) {
        const userIndex = this.users.findIndex(user => user.id === id);
        this.users[userIndex] = { ...this.users[userIndex], ...userData };
        return this.users[userIndex];
    }
}