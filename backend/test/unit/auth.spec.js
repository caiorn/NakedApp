import { it, expect, describe} from "vitest";
import { InMemoryUserRepository } from "../../src/modules/shared/Usuario/user-repository-in-memory.ts";
import { AuthService } from "../../src/modules/shared/Usuario/Authenticate/auth-service.ts";
import  bcrypt from "bcryptjs";

describe('Autenticação', () => {
    it("deve autenticação usuário com cpf e senha", async () => {
        const userRepository = new InMemoryUserRepository();  
        const sut = new AuthService(userRepository);
      
        await userRepository.createUser({
          cpf: "12345678900",
          senha: await bcrypt.hash("password123", 10),
          status: "active",
        }) 
      
        const {user} = await sut.authenticate('12345678900', 'password123');
      
        expect(user.id).toEqual(expect.any(Number));
      });  
})

