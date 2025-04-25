import { z } from 'zod'

export const authSchema = z.object({
    cpf: z.string().regex(/^\d{11}$/),
    senha: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
}).strict();