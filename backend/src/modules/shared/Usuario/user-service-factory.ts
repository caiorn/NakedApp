import { UserRepository } from "./user-repository.ts";
import { UserService } from "./user-service.ts";
import type { Knex } from "knex";


export function makeUserService(transaction? : Knex.Transaction) {
    const userRepository = new UserRepository(transaction);
    const userService = new UserService(userRepository);
    return userService;
}