# 📡 Padrão de Retorno da API

Esta API segue os princípios RESTful e utiliza um formato padronizado, inspirado no padrão RFC 7807, para todas as respostas HTTP — incluindo sucessos e erros. Isso facilita o consumo no front-end e padroniza o tratamento de respostas, proporcionando maior previsibilidade e consistência.

---

## ✅ Retorno de Sucesso

```json
{
  "success": true,
  "status": 201
  "message": "Usuário criado com sucesso",
  "data": {
    "id": 123,
    "name": "João Silva",
    "email": "joao@exemplo.com"
  },
  "meta": {
    "page": 1,
    "totalItems": 25,
    "filter": "active"
  },
  "path": "/api/users",
  "timestamp": "2025-05-07T21:24:04.522663Z",
}
```
 **Observações:** 
#### **Campo `data`:**
- `[]` → Quando a resposta esperada é uma lista, mas está vazia  
- `{}` → Quando é uma resposta de objeto, mas sem dados no momento  
- `null` → Quando não há contexto aplicável ou nenhuma informação será retornada  

#### **Campo `message` (Opcional):**
- Omitido se não tiver mensagem útil  
- Usado para feedback amigável ou técnico (ex: `"Usuário criado"`, `"Processado com sucesso"`)  

#### **Campo `meta` (Opcional):**
- Adicione apenas quando necessário  
- Ideal para:  
  - Paginação (`page`, `total`, `hasNext`)  
  - Filtros aplicados  
  - Informações de debug  

#### **Campo `status` (Sugestão):**
Embora não estivesse no exemplo original, muitas APIs (GitHub, Stripe, etc.) incluem o **status HTTP no corpo** da resposta. Isso ajuda:  
- Clientes genéricos (dashboards, logs)  
- Testes automáticos  
- Depuração frontend  

---

## ❌ Retorno de Erro

```json
{
  "success": false,
  "status": 401,  
  "message": "No Authorization",
  "error": "AppError",
  "path": "/api/users/4",
  "timestamp": "2025-05-07T21:24:04.522670Z",
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
  "message": "Erro de validação nos dados fornecidos.",
  "error": "ValidationError",
  "issues": [
    {
      "field": "email",
      "message": "Email inválido"
    },
    {
      "field": "password",
      "message": "A senha deve conter pelo menos 6 caracteres"
    }
  ]
  "path": "/api/users",
  "timestamp": "2025-05-07T21:24:04.522671Z",
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
