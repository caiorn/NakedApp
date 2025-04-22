import { UnitOfWork } from '../unitOfWork/unitOfWork.js';
import { UserService } from '../services/userService.js';

export const createUser = async (request, reply) => {
  const unitOfWork = new UnitOfWork();
  try {
    await unitOfWork.start();

    const userService = new UserService(unitOfWork);
    const user = await userService.createUser(request.body);

    await unitOfWork.commit();
    reply.code(201).send(user);
  } catch (error) {
    await unitOfWork.rollback();
    console.error(error);
    reply.code(500).send({ error: 'Internal Server Error' });
  }
};
