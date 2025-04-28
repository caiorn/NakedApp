import { vitest , it, expect, describe, beforeEach} from "vitest";
import { InMemoryUserRepository } from "../../src/modules/shared/Usuario/user-repository-in-memory.js";
import { UserService } from "../../src/modules/shared/Usuario/user-service.js";
import { compare } from "bcryptjs";
import { AppError, AppError2 } from "../../src/errors/AppError.js";

let userRepository;  
let sut;
describe("Usuário", () => {

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();  
    sut = new UserService(userRepository);
  })

  it("deve criar usuário e checkar senha criptografada", async () => {  
    const userData = {
      nome: "John Doe",
      matricula: "12345",
      cpf: "123.456.789-00",
      senha: "password123",
      isFirstAccess: 1,
      api_access: 0,
    };
    const { userId } = await sut.createUser(userData);
    const { user } = await sut.getUserById(userId);
    const isPasswordValid = await compare(userData.senha, user.senha);
    expect(isPasswordValid).toBe(true);
    expect(user.id).toEqual(expect.any(Number));
  });
  
  it("deve evitar duplicidade de usuário pelo cpf e matricula", async () => {
    const userData = {
      nome: "John Doe",
      matricula: "12345",
      cpf: "123.456.789-00",
      senha: "password123",
      isFirstAccess: 1,
      api_access: 0,
    };
    try {
      await sut.createUser(userData)
      await sut.createUser(userData)
    } catch (error) {
      expect(error).toBeInstanceOf(AppError) // Error tb passaria porque é superclasse de AppError
      expect(error.statusCode).toBe(409)
      expect(error.constructor.name).toBe('AppError') 
    }
  });
});
