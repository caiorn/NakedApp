import request from 'supertest'
import { createServer } from 'node:http'
import { afterAll, beforeAll, expect, test, describe } from 'vitest'
import { app } from '../src/app.js'

//configurar knex e rodar migrations

describe('Users routes', () => {
	// função que vai executar unica vez antes de todos testes
	beforeAll(async () => {
		await app.ready() //antes de todos testes quero aguardar todas promisses do app
	})

	afterAll(async () => await app.close())

	// test0('get http', async () => {
	// 	//await
	// })

	test('create user', async () => {
		const response = await request(app.server).post('/users').send({
			username: 'andre',
			email: 'abc@gmail.com',
			senha: '123456'
		})

		expect(response.statusCode).toBe(201)
	})
})

/*
    test.skip = pular o teste
    test.only = executar apenas este teste
    test.todo = criar um teste que ainda não foi implementado

    jamais escreva um teste q e dependa de outro teste, se isso deve acontecer ele deve estar no mesmo teste
    criar um teste partindo do principio que nada existe, ou seja, o banco de dados deve estar vazio
*/
