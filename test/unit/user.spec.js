import { vitest , test, expect} from "vitest";
import { InMemoryUserRepository } from "../../src/modules/shared/Usuario/user-repository-in-memory.js";
import { UserService } from "../../src/modules/shared/Usuario/user-service.js";
import { compare } from "bcryptjs";
import { AppError, AppError2 } from "../../src/errors/AppError.js";

test("verificando criptografia", async () => {
  const userRepository = new InMemoryUserRepository();  
  const userService = new UserService(userRepository);
  const userData = {
    nome: "John Doe",
    matricula: "12345",
    cpf: "123.456.789-00",
    senha: "password123",
    isFirstAccess: 1,
    api_access: 0,
  };
  const { userId } = await userService.createUser(userData);
  const user = await userRepository.getUserById(userId);
  console.log(user);
  const isPasswordValid = await compare(userData.senha, user.senha);
  expect(isPasswordValid).toBe(true);
  expect(user.id).toEqual(expect.any(Number));
});

test("duplicidade usuarios", async () => {
  const userRepository = new InMemoryUserRepository();  
  const userService = new UserService(userRepository);
  const userData = {
    nome: "John Doe",
    matricula: "12345",
    cpf: "123.456.789-00",
    senha: "password123",
    isFirstAccess: 1,
    api_access: 0,
  };  
  try {
    await userService.createUser(userData)
    await userService.createUser(userData)
  } catch (error) {
    console.log(error.constructor.name)
    expect(error).toBeInstanceOf(AppError) // Error tb passaria porque é superclasse de AppError
    expect(error.statusCode).toBe(409)
    expect(error.constructor.name).toBe('AppError') 
  }
});
