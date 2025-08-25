import type { IUserRepository } from "./user-repository-interface.ts";
import type { User, UserColumn, InsertUser, UpdateUser } from "./user.entity.ts";
import type { EntityResult, Expand } from "../../../types/utils.ts";

export class UserRepositoryFake implements IUserRepository {
    private users: User[] = [
        { id: 1, login: 'john_doe', email: 'john@example.com', name: 'John Doe', password: 'hashed_password_1', created_by: 1, created_at: new Date('2023-01-01'), updated_at: new Date('2023-01-01'), deleted_at: null },
        { id: 2, login: 'jane_smith', email: 'jane@example.com', name: 'Jane Smith', password: 'hashed_password_2', created_by: 1, created_at: new Date('2023-01-02'), updated_at: new Date('2023-01-02'), deleted_at: null },
        { id: 3, login: 'bob_wilson', email: 'bob@example.com', name: 'Bob Wilson', password: 'hashed_password_3', created_by: 1, created_at: new Date('2023-01-03'), updated_at: new Date('2023-01-03'), deleted_at: null }
    ];
    private nextId = 4;
    async insertUsers<T extends readonly UserColumn[]>(params: { users: InsertUser | InsertUser[]; returning?: T; }): Promise<EntityResult<User, T>[]> {
        const usersArray = Array.isArray(params.users) ? params.users : [params.users];
        const insertedUsers: User[] = [];

        for (const userData of usersArray) {
            const newUser: User = {
                id: this.nextId++,
                login: userData.login,
                email: userData.email,
                name: userData.name,
                password: userData.password,
                created_at: new Date(),
                created_by: userData.created_by
            };
            this.users.push(newUser);
            insertedUsers.push(newUser);
        }
        if (!params.returning) {
            return insertedUsers as unknown as EntityResult<User, T>[];
        }

        return insertedUsers.map(user => this.pickColumns(user, params.returning!));
    }

    async updateUsersByIds<T extends readonly UserColumn[]>(params: { ids: number[]; userData: UpdateUser; returning: T; }): Promise<EntityResult<User, T>[]> {
        const updatedUsers: User[] = [];

        for (const id of params.ids) {
            const userIndex = this.users.findIndex(user => user.id === id && !user.deleted_at);
            if (userIndex !== -1) {
                this.users[userIndex] = {
                    ...this.users[userIndex],
                    ...params.userData,
                    updated_at: new Date(),
                };
                updatedUsers.push(this.users[userIndex]);
            }
        }

        return updatedUsers.map(user => this.pickColumns(user, params.returning));
    }

    async destroyUsersSoftly(ids: number[]): Promise<number> {
        let deletedCount = 0;
        const now = new Date();

        for (const id of ids) {
            const userIndex = this.users.findIndex(user => user.id === id && !user.deleted_at);
            if (userIndex !== -1) {
                this.users[userIndex].deleted_at = now;
                // this.users[userIndex].updated_at = now;
                deletedCount++;
            }
        }

        return deletedCount;
    }

    async selectAllUsers<T extends readonly UserColumn[]>(params: { columns: T; }): Promise<EntityResult<User, T>[]>{
        const activeUsers = this.users.filter(user => !user.deleted_at);
        return activeUsers.map(user => this.pickColumns(user, params.columns));
    }

    async selectUsersByIds<T extends readonly UserColumn[]>(params: { ids: number[]; columns: T; }): Promise<EntityResult<User, T>[]>{
        const foundUsers = this.users.filter(user => params.ids.includes(user.id) && !user.deleted_at);
        return foundUsers.map(user => this.pickColumns(user, params.columns));
    }

    async selectUsersLikeName<T extends readonly UserColumn[]>(params: { name: string; columns: T; }): Promise<EntityResult<User, T>[]>{
        const matchingUsers = this.users.filter(user => 
            user.name.toLowerCase().includes(params.name.toLowerCase()) && !user.deleted_at
        );
        return matchingUsers.map(user => this.pickColumns(user, params.columns));
    }

    async selectUserByLogin<T extends readonly UserColumn[]>(params: { login: string; columns: T; }): Promise<EntityResult<User, T> | undefined> {
        const user = this.users.find(user => user.login === params.login && !user.deleted_at);
        return user ? this.pickColumns(user, params.columns) : undefined;
    }

    async selectUsersByUniqueFields<T extends readonly UserColumn[]>(params: { logins: string[]; emails: string[]; columns: T; }): Promise<EntityResult<User, T>[]>{
        const matchingUsers = this.users.filter(user => 
            (params.logins.includes(user.login) || params.emails.includes(user.email)) && !user.deleted_at  
        );
        return matchingUsers.map(user => this.pickColumns(user, params.columns));
    }

    private pickColumns<T extends readonly UserColumn[]>(user: User, columns: T): Expand<Pick<User, T[number]>> {
        const result = {} as Expand<Pick<User, T[number]>>;
        for (const column of columns) {
            (result as any)[column] = user[column as keyof User];
        }
        return result;
    }
}


