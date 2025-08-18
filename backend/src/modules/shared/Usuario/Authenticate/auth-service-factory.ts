import { UserRepository } from '../user-repository.ts';
import { AuthRepository } from './auth-repository.ts';
import { AuthService } from "./auth-service.ts";
import type { Knex } from "knex";


export function makeAuthService(transaction? : Knex.Transaction) {
    const authRepository = new AuthRepository(transaction);
    const userRepository = new UserRepository(transaction);
    const authService = new AuthService(userRepository, authRepository);
    return authService;
}