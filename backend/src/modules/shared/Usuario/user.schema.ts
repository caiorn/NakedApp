import { z } from 'zod';

// Campos base reutilizáveis
const name = z.string().min(1, { message: 'Nome é obrigatório' });
const email = z.string().email({ message: 'Email deve ser válido' });
const login = z.string().min(3, { message: 'Login deve ter no mínimo 3 caracteres' });
const password = z.string().min(8, { message: 'A Senha deve conter no mínimo 8 caracteres' });
const phone = z.string().min(11).max(20).nullable().optional();
const avatar = z.string().url({ message: 'Avatar deve ser uma URL válida' }).nullable().optional();
const status = z.enum(['active', 'inactive', 'blocked']).default('active');

// Schemas para entrada do usuário (validation)
export const newUser = z.object({
    name,
    email,
    login,
    password,
    avatar,
    phone,
    status,
}).strict();
export const newUsers = z.array(newUser);
export const editUser = newUser.partial().strict();
export const editUserProfile = z.object({
    name: name.optional(),
    email: email.optional(),
    phone,
    avatar: z.instanceof(File).refine(
        (file) => file.type === 'image/png' || file.type === 'image/jpeg',
        { message: 'Avatar deve ser uma imagem PNG ou JPG' }
    ).optional()
}).strict();

// Types de entrada
export type NewUser = z.infer<typeof newUser>;
export type NewUsers = z.infer<typeof newUsers>;
export type EditUser = z.infer<typeof editUser>;
export type EditUserProfile = z.infer<typeof editUserProfile>;