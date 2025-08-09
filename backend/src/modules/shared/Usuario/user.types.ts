import type { BaseEntity, InsertEntity, UpdateEntity, EntityColumn } from '../../../types/base.ts';

/* Schema das colunas do banco de dados */

export const USER_STATUS = ['active', 'inactive', 'blocked'] as const;

// User herda de BaseEntity
export interface User extends BaseEntity {
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
export type InsertUser = InsertEntity<User>;
export type UpdateUser = UpdateEntity<User>;  
export type UserColumn = EntityColumn<User>;

// // Campos que o BD preenche automaticamente 
// type AutoFields = "id" | "created_at" | "updated_at" | "deleted_at";
// // Campos obrigatórios para inserção
// export type InsertUser = Omit<User, AutoFields | "updated_by" | "deleted_by"> & {
//   created_by: number;
// };
// // Campos obrigatórios para atualização
// export type UpdateUser = Partial<Omit<User, AutoFields | "created_by" | "deleted_by">> & {
//   updated_by: number;
// };
// export type UserColumn = keyof User | '*';