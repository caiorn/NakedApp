import { z } from 'zod'

export const newUser = z.object({
    name: z.string().min(1, { message: 'Nome é obrigatório' }),
    email: z.string().min(1, { message: 'Sobrenome é obrigatório' }),
    login: z.string().min(1, { message: 'Login é obrigatório' }),
    password: z.string().min(8, { message: 'A Senha deve conter no minímo 8 caracteres' }),
    phone: z.string().min(11).max(20).optional()
}).strict();  //strict Garante que o objeto não tenha atributos extras
export type NewUser = z.infer<typeof newUser>;

export const newUsers = z.array(newUser);
export type NewUsers = z.infer<typeof newUsers>;
export type InsertUser = NewUser & { created_by: number };

export const editUser = z.object({
    name: z.string().min(1, { message: 'Nome é obrigatório' }).optional(),
    email: z.string().min(1, { message: 'Sobrenome é obrigatório' }).optional(),
    login: z.string().min(1, { message: 'Login é obrigatório' }).optional(),
    password: z.string().min(8, { message: 'A Senha deve conter no minímo 8 caracteres' }).optional(),
    phone: z.string().min(11).max(20).optional().nullable()
}).strict();
export type EditUser = z.infer<typeof editUser>;
export type UpdateUser = EditUser & { updated_by: number };

export const editUserProfile = z.object({
    name: z.string().min(1, { message: 'Nome é obrigatório' }).optional(),
    email: z.string().min(1, { message: 'Sobrenome é obrigatório' }).optional(),
    phone: z.string().min(11).max(20).optional().nullable(),
    avatar: z.instanceof(File).refine(
        (file) => file.type === 'image/png' || file.type === 'image/jpeg',
        { message: 'Avatar deve ser uma imagem PNG ou JPG' }
    ).optional()
}).strict();
export type EditUserProfile = z.infer<typeof editUserProfile>;
