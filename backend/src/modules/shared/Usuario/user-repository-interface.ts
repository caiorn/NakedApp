import type { User, UserColumn, InsertUser, UpdateUser } from "./user.entity.ts";

export interface IUserRepository {
    insertUsers<T extends readonly UserColumn[]>(params: {
        users: InsertUser | InsertUser[];
        returning?: T;
    }): Promise<Pick<User, T[number]>[]>;

    updateUsersByIds<T extends readonly UserColumn[]>(params: {
        ids: number[];
        userData: UpdateUser;
        returning: T;
    }): Promise<Pick<User, T[number]>[]>;

    destroyUsersSoftly(ids: number[]): Promise<number>;

    selectAllUsers<T extends readonly UserColumn[]>(params: {
        columns: T;
    }): Promise<Pick<User, T[number]>[]>;

    selectUsersByIds<T extends readonly UserColumn[]>(params: {
        ids: number[];
        columns: T;
    }): Promise<Pick<User, T[number]>[]>;

    selectUsersLikeName<T extends readonly UserColumn[]>(params: {
        name: string;
        columns: T;
    }): Promise<Pick<User, T[number]>[]>;

    selectUserByLogin<T extends readonly UserColumn[]>(params: {
        login: string;
        columns: T;
    }): Promise<Pick<User, T[number]> | undefined>;

    selectUsersByUniqueFields<T extends readonly UserColumn[]>(params: {
        logins: string[];
        emails: string[];
        columns: T;
    }): Promise<Pick<User, T[number]>[]>;
}