import { z } from 'zod'

export const userSchema = z.object({
    name: z.string().min(1, { message: 'Nome é obrigatório' }),
    email: z.string().min(1, { message: 'Sobrenome é obrigatório' }),
    login: z.string().min(1, { message: 'Login é obrigatório' }),
    password: z.string().min(8, { message: 'A Senha deve conter no minímo 8 characteres' }),
    phone: z.string().max(20).optional().transform((val) => (val === '' || val === undefined ? null : val)),
    avatar: z.string().url().optional().nullable()
}).strict();  //strict Garante que o objeto não tenha atributos extras