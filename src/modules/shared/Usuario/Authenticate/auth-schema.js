import { z } from 'zod'

export const authSchema = z.object({
    login: z.string().min(1, { message: 'Login é obrigatório' }),
    password: z.string().min(8, { message: 'A Senha deve conter no minímo 8 characteres' }),
}).strict();