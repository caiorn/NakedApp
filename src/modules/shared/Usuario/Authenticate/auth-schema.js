import { z } from 'zod'

export const authSchema = z.object({
    cpf: z.string().regex(/^\d{11}$/),
    senha: z.string().min(8, { message: 'A Senha deve conter no minímo 8 characteres' }),
}).strict();