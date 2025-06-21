import { faker } from '@faker-js/faker';
import { knex } from '../../src/db/knex-db.js';

const createMockUser = (index) => {
  const name = faker.person.fullName();
  const email = faker.internet.email({ firstName: name.split(' ')[0], lastName: name.split(' ')[1] });
  const login = faker.internet.username({ firstName: name.split(' ')[0] });
  const password = faker.internet.password();

  return {
    name,
    email: `${index}_${email}`, // evita duplicidade
    login,
    password,
    created_by: 'admin',
    updated_by: 'admin',
    deleted_by: null,
    deleted_at: null,
  };
};

async function insertMockUsers(total = 10) {
  try {
    const mockUsers = Array.from({ length: total }, (_, i) => createMockUser(i));
    await knex('users').insert(mockUsers);
    console.log(`✅ Inseridos ${total} usuários fictícios com sucesso!`);
  } catch (err) {
    console.error('❌ Erro ao inserir usuários mock:', err.message);
  } finally {
    await knex.destroy();
  }
}

insertMockUsers(20); // Altere o número para quantos usuários quiser
