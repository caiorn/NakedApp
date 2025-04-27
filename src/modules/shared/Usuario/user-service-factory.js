import { UserRepository } from "./user-repository.js";
import { UserService } from "./user-service.js";

export function makeUserService(transaction) {
    const userRepository = new UserRepository(transaction);
    const userService = new UserService(userRepository);
    return userService;
}