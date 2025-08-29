import { z } from 'zod';

// Centralized password validation schema
const passwordSchema = z.string()
    .min(8, { message: 'A senha deve conter no mínimo 8 caracteres' })
    .regex(/[A-Z]/, { message: 'A senha deve conter pelo menos uma letra maiúscula' })
    .regex(/[a-z]/, { message: 'A senha deve conter pelo menos uma letra minúscula' })
    .regex(/[0-9]/, { message: 'A senha deve conter pelo menos um número' })
    .regex(/[@$!%*?&]/, { message: 'A senha deve conter pelo menos um caractere especial (@, $, !, %, *, ?, &)' });

export const loginSchema = z.object({
    login: z.string().min(1, { message: 'Login é obrigatório' }),
    password: passwordSchema,
}).strict();

export const emailSchema = z.object({
    email: z.string().email({ message: 'Email inválido' }),
});

export const resetPasswordSchema = z.object({
    token: z.string().min(1, { message: 'Token é obrigatório' }),
    newPassword: passwordSchema,
}).strict();
