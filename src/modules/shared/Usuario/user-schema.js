import { z } from 'zod'

export const userSchema = z.object({
	username: z.string().min(1, { message: 'Username is required' }),
	email: z
		.string()
		.email({ message: 'Invalid email format' })
		.optional()
		.transform((val) => (val === '' || val === undefined ? null : val)),
	senha: z
		.string()
		.min(6, { message: 'Password must be at least 6 characters long' })
})