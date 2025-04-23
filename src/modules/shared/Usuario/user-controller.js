import { userSchema } from './user-schema.js';
import * as userService from './user-service.js';
import { AppError } from '../../../errors/AppError.js';


export const createUser = async (request, reply) => {
  // validação de entrada de dados JSON
  const validatedUser = userSchema.safeParse(request.body)
  if (!validatedUser.success) {
    return reply.status(400).send({
      error: 'Erro de validação',
      issues: validatedUser.error.issues.map((issue) => ({
        campo: issue.path.join('.'),
        mensagem: issue.message
      }))
    })
  }

  try {
    const user = await userService.createUser(request.body);

    reply.code(201).send(user);
  } catch (err) {
    // se for AppError, foi um erro lançado pelas camadas internas
    if (err instanceof AppError) {
      return reply.status(err.statusCode).send(err.message);
    }
    return reply.status(501).send('Erro interno no servidor') //erro desconhecido
  }
};

export const getAllUsers = async (request, reply) => {
  try {
    const users = await userService.getAllUsers();
    if (!users || users.length === 0) {
      return reply.code(404).send({ message: 'No users found' });
    }

    reply.code(200).send(users);
  } catch (error) {
    console.error(error);
  }
}

export const getUserById = async (request, reply) => {
  const { id } = request.params;
  try {
    const user = await userService.getUserById(id);
    if (!user) {
      return reply.code(404).send({ message: 'User not found' });
    }
    reply.code(200).send(user);
  } catch (error) {
    console.error(error);
  }
};  
