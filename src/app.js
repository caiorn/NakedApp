import fastify from 'fastify'
import fastifyJwt from '@fastify/jwt'
import { ZodError } from 'zod'
import { AppError } from './errors/AppError.js'
import { env } from './env.js'
import { appRoutes } from './routes.js'
// import { userSQLiteRoutes } from './modules/userSQLite/user-routes.js'

const inProduction = process.env.NODE_ENV === 'production'

export const app = fastify()
app.register(fastifyJwt, {
	secret: env.JWT_SECRET,
	sign: {
		expiresIn: env.JWT_EXPIRATION
	  }
});


app.setErrorHandler((error, _request, reply) => {
	let statusCode = 500;
	let payload = {
	  error: 'InternalServerError',
	  message: 'Erro interno no servidor.',
	};
  
	// ZodError
	if (error instanceof ZodError) {
	  statusCode = 400;
	  payload = {
		error: 'Erro de validação',
		message: 'Erro de validação nos dados fornecidos.',
		issues: error.issues.map(issue => ({
		  campo: issue.path.join('.'),
		  mensagem: issue.message,
		})),
	  };
	}
  
	// AppError (erro customizado com statusCode)
	else if (error instanceof AppError) {
	  statusCode = error.statusCode || 400;
	  payload = {
		error: error.name,
		message: error.message,
	  };
	}
  
	// Erros desconhecidos (em dev mostra stack)
	else if (!inProduction) {
	  console.error('[Erro não tratado]:', error);
	  payload = {
		error: error.name || 'InternalServerError',
		message: error.message,
		stack: error,
	  };
	} else {
	  // TODO: logar erro em serviço externo (Sentry, etc)
	}
	return reply.status(statusCode).send({ statusCode, ...payload });
  });
  

app.register(appRoutes, { prefix: '/api' })

app.get('/', () => {
	return '🟢 Server running!'
})
