import type { AuditEntity,InsertEntity, UpdateEntity, EntityColumn  } from "../../../types/CommonColumnsDb.ts";  
import type { Expand } from "../../../types/utils.ts";  

export const USER_STATUS = ['active', 'inactive', 'blocked'] as const;

interface UserDB extends AuditEntity {
    id: number;
    name: string;
    email: string;
    login: string;
    password: string;
    avatar?: string | null;
    phone?: string | null;
    status?: typeof USER_STATUS[number];
}

// Usa os tipos genéricos
export type User = Expand<UserDB>;
export type InsertUser = InsertEntity<UserDB>;
export type UpdateUser = UpdateEntity<UserDB>; 
export type UserColumn = EntityColumn<UserDB>;

export const USER_LOGGED_COLUMNS = ['id', 'name', 'status', 'login', 'email'] as const;
export type UserLogged = Expand<Pick<UserDB, typeof USER_LOGGED_COLUMNS[number]>> & { payload?: any };