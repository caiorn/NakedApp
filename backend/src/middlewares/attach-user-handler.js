import { UserRepository } from "../modules/shared/Usuario/user-repository.js";
import { AppError } from "../errors/AppError.js";

export async function attachUserHandler(request, reply) {
    const { sub } = request.user;
    if (!sub) {
        throw new AppError(500, "User not found in token");
    }
    const [user] = await new UserRepository().selectUsersByIds({
        ids: [sub],
        columns: ['id', 'name', 'login', 'email']
    });

    if (!user) {
        throw new AppError(404, "User not found");
    }

    request.userLogged = user;
}