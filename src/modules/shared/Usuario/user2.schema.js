import { z } from 'zod'

export const userSchema = z.object({
    nome: z.string().min(1, { message: 'Username is required' }),
    cpf: z.string().regex(/^\d{11}$/, "CPF deve ter exatamente 11 dígitos numéricos"),
    senha: z.string().min(6, { message: 'Password must be at least 6 characters long' })
})