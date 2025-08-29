import type { User, UserColumn, InsertUser, UpdateUser } from "./user.entity.ts";
import type { EntityResult } from "../../../types/utils.ts";

export interface IUserRepository {
    insertUsers<T extends readonly UserColumn[]>(params: {
        users: InsertUser | InsertUser[];
        returning?: T;
    }): Promise<EntityResult<User, T>[]>;

    updateUsersByIds<T extends readonly UserColumn[]>(params: {
        ids: number[];
        userData: UpdateUser;
        returning: T;
    }): Promise<EntityResult<User, T>[]>;

    destroyUsersSoftly(ids: number[]): Promise<number>;

    selectAllUsers<T extends readonly UserColumn[]>(params: {
        columns: T;
    }): Promise<EntityResult<User, T>[]>;

    selectUsersByIds<T extends readonly UserColumn[]>(params: {
        ids: number[];
        columns: T;
    }): Promise<EntityResult<User, T>[]>;

    selectUsersLikeName<T extends readonly UserColumn[]>(params: {
        name: string;
        columns: T;
    }): Promise<EntityResult<User, T>[]>;

    selectUserByLogin<T extends readonly UserColumn[]>(params: {
        login: string;
        columns: T;
    }): Promise<EntityResult<User, T> | undefined>;

    selectUserByEmail<T extends readonly UserColumn[]>({
        email,
        columns
    }: {
        email: string;
        columns: T;
    }): Promise<EntityResult<User, T> | undefined>;
    
    selectUsersByUniqueFields<T extends readonly UserColumn[]>(params: {
        logins: string[];
        emails: string[];
        columns: T;
    }): Promise<EntityResult<User, T>[]>;
}