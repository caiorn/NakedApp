import { UserRepository } from '../Usuario/user-repository.js';

export class UserService {
  constructor(userRepository) {
    /** @type {UserRepository} */
    this.userRepository = userRepository;
  }

  async createUser(userData) {
    const userId = await this.userRepository.createUser(userData);
    return userId;
  }

  async getAllUsers() {
      const users = await this.userRepository.getAllUsers();
      return users;
  }

  async getUserById(id) {
      const user = await this.userRepository.getUserById(id);
      return user;    
  }
}

