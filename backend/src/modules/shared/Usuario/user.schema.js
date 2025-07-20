import { z } from 'zod'


export const newUser = z.object({
    name: z.string().min(1, { message: 'Nome é obrigatório' }),
    email: z.string().min(1, { message: 'Sobrenome é obrigatório' }),
    login: z.string().min(1, { message: 'Login é obrigatório' }),
    password: z.string().min(8, { message: 'A Senha deve conter no minímo 8 caracteres' }),
    phone: z.string().max(20).optional().transform((val) => (val === '' || val === undefined ? null : val)),
}).strict();  //strict Garante que o objeto não tenha atributos extras

export const newUsers = z.array(newUser);

export const editUser = z.object({
    name: z.string().min(1, { message: 'Nome é obrigatório' }).optional(),
    email: z.string().min(1, { message: 'Sobrenome é obrigatório' }).optional(),
    login: z.string().min(1, { message: 'Login é obrigatório' }).optional(),
    password: z.string().min(8, { message: 'A Senha deve conter no minímo 8 caracteres' }).optional(),
    phone: z.string().max(20).optional().transform((val) => (val === '' || val === undefined ? null : val))
}).strict();

export const editUserProfile = z.object({
    name: z.string().min(1, { message: 'Nome é obrigatório' }).optional(),
    email: z.string().min(1, { message: 'Sobrenome é obrigatório' }).optional(),
    phone: z.string().max(20).optional().transform((val) => (val === '' || val === undefined ? null : val)),
    avatar: z.instanceof(File).refine(
        (file) => file.type === 'image/png' || file.type === 'image/jpeg',
        { message: 'Avatar deve ser uma imagem PNG ou JPG' }
    ).optional()
}).strict();