// src/lib/axios.js
import axios from 'axios';

export function createApi(baseURL, options = {}) {
  return axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    withCredentials: true,
    ...options,
  });
}

// Vantagens dessa abordagem:
//  Reutilizável e DRY (Don’t Repeat Yourself)
//  Facilita adicionar interceptadores (como autenticação JWT)
//  Ajuda em testes e mockagem de chamadas
//  Suporta múltiplas APIs externas com diferentes configurações

