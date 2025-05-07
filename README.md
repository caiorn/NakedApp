# 📡 Padrão de Retorno da API

Esta API utiliza um formato **padronizado** para todas as respostas HTTP, facilitando o consumo no front-end e padronizando o tratamento de erros e mensagens.

---

## ✅ Retorno de Sucesso

```json
{
  "success": true,
  "message": "Usuário criado com sucesso",
  "data": {
    // Conteúdo real solicitado (ex: dados do usuário, lista de registros, etc.)
  },
  "meta": {
    "timestamp": "2025-05-07T21:24:04.522663Z"
    // Outros dados adicionais, caso necessário (paginação, filtros, contexto de debug, etc.)
  }
}
```

---

## ❌ Retorno de Erro

```json
{
  "success": false,
  "status": 401,
  "error": "AppError",
  "message": "No Authorization",
  "path": "/api/users/4",
  "timestamp": "2025-05-07T21:24:04.522670Z",
  "issues": []
}
```

---

## 🧠 Tipos de Erros("error": ...) Possíveis

### 1. `ValidationError`

Erro de validação gerado por entrada de dados inválida (geralmente através da biblioteca [Zod](https://zod.dev/)).

> O Zod valida objetos conforme esquemas definidos e retorna erros detalhados caso algo esteja fora do esperado.

- O campo `issues` sempre estará presente e apenas no ValidationError e será um array vazio (`[]`) se não houver erros de validação. nos demais erros abaixo não terá o campo `issues`.

#### Exemplo:

```json
{
  "success": false,
  "status": 400,
  "error": "ValidationError",
  "message": "Erro de validação nos dados fornecidos.",
  "path": "/api/users",
  "timestamp": "2025-05-07T21:24:04.522671Z",
  "issues": [
    {
      "campo": "email",
      "mensagem": "Email inválido"
    },
    {
      "campo": "password",
      "mensagem": "A senha deve conter pelo menos 6 caracteres"
    }
  ]
}
```

---

### 2. `AppError`

Erro controlado propositalmente pela aplicação. Usado para representar erros esperados de **regra de negócio**, como:

- Credenciais inválidas (senha incorreta)
- Usuário não encontrado
- Acesso não autorizado (401)
- Recurso inexistente (404)
- Ação não permitida (403)
- etc...

A mensagem de erro (`message`) é sempre informativa e está presente mesmo quando `success` é `false`.

---

### 3. `Error`

Erro genérico e inesperado, causado por:

- Exceções não tratadas
- Bugs internos
- Falhas em bibliotecas de terceiros
- Problemas com o banco de dados

Esse tipo de erro representa falhas **críticas** e geralmente retorna status **500 Internal Server Error**.

---

## 📌 Observações

- A propriedade `path` representa a URL da requisição que originou o erro.
- A propriedade `timestamp` está sempre presente e reflete o momento da resposta no formato ISO UTC.
