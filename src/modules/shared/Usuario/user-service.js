import * as userRepository from './user-repository.js';

import { knex } from '../../../db/knex-db.js'

//  export async function createUserSolicitation(userData, solicitacaoData) {
//   const trx = await knex.transaction(); // inicia a transação aqui

//   try {
//     // Repositórios recebem o trx para operar dentro da transação
//     const userRepository = new UserRepository(trx);
//     const solicitacaoRepository = new SolicitacaoRepository(trx);

//     // Criação do usuário
//     const userId = await userRepository.create(userData);
//     const user = await userRepository.findById(userId);

//     // Criação da solicitação com base no usuário criado
//     await solicitacaoRepository.create(user, solicitacaoData);

//     // Commit após todas as operações com sucesso
//     await trx.commit();

//     return { success: true, userId };
//   } catch (error) {
//     await trx.rollback(); // rollback em caso de erro
//     console.error('Erro ao criar usuário e solicitação:', error);
//     throw error;
//   }

 export async function createUser(userData) {
  const trxKnex = await knex.transaction(); // inicia a transação aqui

  try {
    const userId = await userRepository.createUser(userData, trxKnex);
    await trxKnex.commit();
    return { success: true, userId };
  } catch (error) {
    await trxKnex.rollback(); // rollback em caso de erro    
    throw error;
  }
}

export async function getAllUsers() {
  try {
    const users = await userRepository.getAllUsers();
    return users;
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    throw error;
  }
}

 export async function getUserById(id) {
  try {
    const user = await userRepository.getUserById(id);
    return user;
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    throw error;
  }
}

