import { z } from 'zod'

export const userSchema = z.object({
    matricula: z.string().regex(/^\d{5}$/, "Matrícula deve ter exatamente 5 dígitos numéricos"),
    nome: z.string().min(1, { message: 'Nome é obrigatório' }),
    sobrenome: z.string().min(1, { message: 'Sobrenome é obrigatório' }),
    cpf: z.string().regex(/^\d{11}$/, "CPF deve ter exatamente 11 dígitos numéricos"),
    senha: z.string().min(8, { message: 'A Senha deve conter no minímo 8 characteres' }),
    isFirstAccess: z.number().default(1),
    api_access: z.number().default(1), //não pe obrigatório, mas se não for passado, assume 1
    // email: z
    // .string()
    // .email({ message: 'Invalid email format' })
    // .optional()
    // .transform((val) => (val === '' || val === undefined ? null : val)),
}).strict();  //strict Garante que o objeto não tenha atributos extras