import { createApi } from '../services/apiClient';

const produtosApi = createApi(import.meta.env.VITE_PRODUTOS_API_URL);

export async function getProdutos() {
  const { data } = await produtosApi.get('/');
  return data;
}