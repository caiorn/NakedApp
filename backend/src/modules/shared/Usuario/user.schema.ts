import { z } from 'zod';

// Campos base reutilizáveis
const name = z.string().min(1, { message: 'Nome é obrigatório' });
const email = z.string().email({ message: 'Email deve ser válido' });
const login = z.string().min(3, { message: 'Login deve ter no mínimo 3 caracteres' });
const password = z.string().min(8, { message: 'A Senha deve conter no mínimo 8 caracteres' });
const phone = z.string().min(11).max(20).nullable().optional();
const avatar = z.string().url({ message: 'Avatar deve ser uma URL válida' }).nullable().optional();
const status = z.enum(['active', 'inactive', 'blocked']).default('active');

// Schema principal (representação do banco)
const userSchema = z.object({
    id: z.number().positive(),
    name,
    email,
    login,
    password,
    avatar,
    phone,
    status,
    created_at: z.date(),
    updated_at: z.date().optional(),
    deleted_at: z.date().nullable().optional(),
    created_by: z.number().positive(),
    updated_by: z.number().positive().optional(),
    deleted_by: z.number().positive().nullable().optional(),
}).strict();

// Schemas para entrada do usuário (validation)
const newUser = z.object({
    name,
    email,
    login,
    password,
    avatar,
    phone,
    status,
}).strict();

const editUser = z.object({
    name: name.optional(),
    email: email.optional(),
    login: login.optional(),
    password: password.optional(),
    avatar,
    phone,
    status: status.optional(),
}).strict();

const editUserProfile = z.object({
    name: name.optional(),
    email: email.optional(),
    phone,
    avatar: z.instanceof(File).refine(
        (file) => file.type === 'image/png' || file.type === 'image/jpeg',
        { message: 'Avatar deve ser uma imagem PNG ou JPG' }
    ).optional()
}).strict();



// Schemas para persistência (service/repository)
const insertUserSchema = newUser.extend({
    created_by: z.number().positive(),
});

const updateUserSchema = editUser.extend({
    updated_by: z.number().positive(),
});

// Arrays
const newUsers = z.array(newUser);
const insertUsersSchema = z.array(insertUserSchema);

// ✅ Exports organizados por categoria
export {
    // Schema principal
    userSchema,

    // Schemas de entrada (controllers)
    newUser,
    newUsers,
    editUser,
    editUserProfile,

    // Schemas de persistência (services/repositories)
    insertUserSchema,
    insertUsersSchema,
    updateUserSchema,
};


// Types de referência
export type User = z.infer<typeof userSchema>;
export type UserColumn = keyof User | '*';

// Types de entrada
export type NewUser = z.infer<typeof newUser>;
export type NewUsers = z.infer<typeof newUsers>;
export type EditUser = z.infer<typeof editUser>;
export type EditUserProfile = z.infer<typeof editUserProfile>;

// Types de persistência
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertUsers = z.infer<typeof insertUsersSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;