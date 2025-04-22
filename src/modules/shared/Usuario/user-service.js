import { UserRepository } from '../repositories/userRepository.js';

export class UserService {
  constructor(unitOfWork) {
    this.unitOfWork = unitOfWork;
    this.userRepository = new UserRepository(this.unitOfWork.getConnection());
  }

  async createUser(userData) {
    const userId = await this.userRepository.create(userData);
    const user = await this.userRepository.findById(userId);
    return user;
  }
}
